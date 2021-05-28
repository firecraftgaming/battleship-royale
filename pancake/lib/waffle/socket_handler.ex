defmodule Waffle.SocketHandler do
    require Logger
    alias Hamburger.PubSub

    defstruct ip: nil, user: nil

    @type state :: %__MODULE__{
      ip: String.t(),
      user: nil | Sushi.Schemas.User.t()
    }

    @behaviour :cowboy_websocket

    ###############################################################
    ## initialization boilerplate

    @impl true
    def init(request, _state) do
      ip = request.headers["x-forwarded-for"]

      state = %__MODULE__{
        ip: ip
      }

      {:cowboy_websocket, request, state}
    end

    @impl true
    def websocket_init(state) do
      PubSub.subscribe("gene:broadcast")
      {:ok, state}
    end

    #######################################################################
    ## API

    @typep command :: :cow_ws.frame() | {:shutdown, :normal}
    @typep call_result :: {[command], state}

    # exit
    def exit(pid), do: send(pid, :exit)
    @spec exit_impl(state) :: call_result
    defp exit_impl(state) do
      # note the remote webserver will then close the connection.  The
      # second command forces a shutdown in case the client is a jerk and
      # tries to DOS us by holding open connections.
      # frontend expects 4003
      ws_push([{:close, 4003, "killed by server"}, shutdown: :normal], state)
    end

    # unsub from PubSub topic
    def unsub(socket, topic), do: send(socket, {:unsub, topic})


    defp unsub_impl(topic, state) do
      PubSub.unsubscribe(topic)
      ws_push(nil, state)
    end

    # transitional remote_send message
    def remote_send(socket, message), do: send(socket, {:remote_send, message})

    @spec remote_send_impl(Pancake.json(), state) :: call_result
    defp remote_send_impl(message, state) do
      ws_push(prepare_socket_msg(message), state)
    end

    #PubSub
    @spec general_impl(Pancake.json(), state) :: call_result
    defp general_impl(message, state) do
      case message do
        {"gene:broadcast", payload} -> ws_push(prepare_socket_msg(%{operator: "broadcast", payload: payload}), state)
        {"chat:all", payload} -> ws_push(prepare_socket_msg(%{operator: "chat:new_message", payload: payload}), state)
        _ -> ws_push(nil, state)
      end
    end

    ##########################################################################
    ## WEBSOCKET API

    @impl true
    def websocket_handle({:text, "ping"}, state), do: {[text: "pong"], state}

    # this is for firefox
    @impl true
    def websocket_handle({:ping, _}, state), do: {[text: "pong"], state}

    def websocket_handle({:text, command_json}, state) do
      with {:ok, message_map!} <- Jason.decode(command_json),
           %{"op" => <<not_at>> <> _} when not_at != ?@ <- message_map!,
           {:ok, message = %{errors: nil}} <- validate(message_map!, state) do
        dispatch(message, state)
      else
        msg = %{"op" => "@" <> _} ->
          dispatch_mediasoup_message(msg, state)
          ws_push(nil, state)

        {:error, %Jason.DecodeError{}} ->
          ws_push({:close, 4001, "invalid input"}, state)

        {:ok, error} ->
          error
          |> Map.put(:operator, error.inbound_operator)
          |> prepare_socket_msg
          |> ws_push(state)

        {:error, changeset = %Ecto.Changeset{}} ->
          %{errors: Pancake.Utils.Errors.changeset_errors(changeset)}
          |> prepare_socket_msg
          |> ws_push(state)
      end
    end

    import Ecto.Changeset

    @spec validate(map, state) :: {:ok, Waffle.Message.t()} | {:error, Ecto.Changeset.t()}
    def validate(message, state) do
      message
      |> Waffle.Message.changeset(state)
      |> apply_action(:validate)
    end

    def dispatch(message, state) do
      case message.operator.execute(message.payload, state) do
        close when elem(close, 0) == :close ->
          ws_push(close, state)

        {:error, err} ->
          message
          |> wrap_error(err)
          |> prepare_socket_msg
          |> ws_push(state)

        {:error, errors, new_state} ->
          message
          |> wrap_error(errors)
          |> prepare_socket_msg
          |> ws_push(new_state)

        {:noreply, new_state} ->
          ws_push(nil, new_state)

        {:reply, payload, new_state} ->
          message
          |> wrap(payload)
          |> prepare_socket_msg
          |> ws_push(new_state)
      end
    end

    def wrap(message, payload = %{}) do
      %{message | operator: message.inbound_operator <> ":reply", payload: payload}
    end

    defp wrap_error(message, error) do
      Map.merge(
        message,
        %{
          payload: nil,
          operator: message.inbound_operator,
          errors: to_map(error)
        }
      )
    end

    # we expect three types of errors:
    # - Changeset errors
    # - textual errors
    # - anything else
    # this common `to_map` function handles them all.

    defp to_map(changeset = %Ecto.Changeset{}) do
      Pancake.Utils.Errors.changeset_errors(changeset)
    end

    defp to_map(string) when is_binary(string) do
      %{message: string}
    end

    defp to_map(other) do
      %{message: inspect(other)}
    end

    # defp dispatch_mediasoup_message(msg, %{user: %{id: user_id}}) do
    #   with {:ok, room_id} <- Beef.Users.tuple_get_current_room_id(user_id),
    #        [{_, _}] <- Onion.RoomSession.lookup(room_id) do
    #     voice_server_id = Onion.RoomSession.get(room_id, :voice_server_id)

    #     mediasoup_message =
    #       msg
    #       |> Map.put("d", msg["p"] || msg["d"])
    #       |> put_in(["d", "peerId"], user_id)
    #       # voice server expects this key
    #       |> put_in(["uid"], user_id)
    #       |> put_in(["d", "roomId"], room_id)

    #     Onion.VoiceRabbit.send(voice_server_id, mediasoup_message)
    #   end
    # end

    defp dispatch_mediasoup_message(_, _), do: nil

    def prepare_socket_msg(data), do: {:text, Jason.encode!(data)}

    def ws_push(frame, state) do
      {List.wrap(frame), state}
    end

    # ROUTER

    @impl true
    def websocket_info({:EXIT, _, _}, state), do: exit_impl(state)
    def websocket_info(:exit, state), do: exit_impl(state)
    def websocket_info({:remote_send, message}, state), do: remote_send_impl(message, state)
    def websocket_info({:unsub, topic}, state), do: unsub_impl(topic, state)

    def websocket_info(message = {<<_::binary-size(4), ?:>> <> _, _}, state), do: general_impl(message, state)

    def websocket_info(_, state), do: ws_push(nil, state)
  end
