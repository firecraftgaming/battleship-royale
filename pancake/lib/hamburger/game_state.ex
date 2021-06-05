defmodule Hamburger.GameState do
    use GenServer
    alias Sushi.Schemas.User

    def start_link(opts) do
        GenServer.start_link(__MODULE__, :ok, opts)
    end

    def getPlayers() do
        GenServer.call(Hamburger.GameState, {:getPlayers})
    end

    def getPlayer(id) do
        GenServer.call(Hamburger.GameState, {:getPlayer, id})
    end

    def addPlayer(user) do
        GenServer.cast(Hamburger.GameState, {:addPlayer, user})
    end

    def removePlayer(id) do
        GenServer.cast(Hamburger.GameState, {:removePlayer, id})
    end

    def start() do
        GenServer.cast(Hamburger.GameState, {:start})
    end

    def started?() do
        GenServer.call(Hamburger.GameState, {:started})
    end

    def get() do
        GenServer.call(Hamburger.GameState, {:get})
    end

    def reset() do
        GenServer.cast(Hamburger.GameState, {:reset})
    end

    @impl true
    def init(:ok) do
        {:ok, %{started: false, players: %{}, host: nil}}
    end

    def startImpl(state) do
        if (map_size(state.players) > 1 and !state.started) do
            players = calculateTargets(state.players)

            Hamburger.PubSub.broadcast("game:start", true)
            {:noreply, %{state | players: players, started: true}}
        else
            {:noreply, state}
        end
    end

    def filterPlayer(player) do
        boats = Enum.reduce(player.boats, [], fn (v, acc) ->
            cond do
                v.sunk ->
                    acc ++ [v]
                true ->
                    acc
            end
        end)

        %{id: player.id, username: player.username, boats: boats, shots: player.shots}
    end

    def calculateTargets(players) do
        length = map_size(players) - 1

        Enum.reduce(0..length, players, fn (i, players) ->
            values = Map.values(players)
            first = List.first(values)

            player = Enum.at(values, i)
            target = Enum.at(values ++ [first], i + 1)

            Map.put(players, player.id, %User{player | target: target.id})
        end)
    end

    def startedImpl?(state) do
        {:reply, state.started, state}
    end

    def resetImpl(state) do
        Hamburger.PubSub.broadcast("game:start", false)
        {:noreply, %{state | started: false}}
    end

    def getPlayersImpl(state) do
        {:reply, state.players, state}
    end

    def getPlayerImpl(id, state) do
        {:reply, Map.fetch(state.players, id), state}
    end

    def addPlayerImpl(user, state) do
        if not state.started do
            players = Map.put(state.players, user.id, user)
            host = case map_size(players) do
                1 -> user.id
                _ -> state.host
            end
            {:noreply, %{state | players: players, host: host}}
        else
            {:noreply, state}
        end
    end

    def removePlayerImpl(id, state) do
        players = Map.delete(state.players, id)
        host = cond do
            Map.has_key?(players, state.host) -> state.host
            true -> List.first(Map.values(players))
        end
        started = cond do
            map_size(players) > 1 -> state.started
            true -> false
        end
        players = cond do
            started -> calculateTargets(players)
            true -> players
        end

        if started, do: Hamburger.PubSub.broadcast("game:start", true)
        {:noreply, %{state | players: players, host: host, started: started}}
    end

    @impl true
    def handle_call({:getPlayers}, _from, state) do
        getPlayersImpl(state)
    end

    @impl true
    def handle_call({:getPlayer, id}, _from, state) do
        getPlayerImpl(id, state)
    end

    @impl true
    def handle_call({:started}, _from, state) do
        startedImpl?(state)
    end

    @impl true
    def handle_call({:get}, _from, state) do
        {:reply, state, state}
    end

    @impl true
    def handle_cast({:addPlayer, user}, state) do
        addPlayerImpl(user, state)
    end

    @impl true
    def handle_cast({:removePlayer, id}, state) do
        removePlayerImpl(id, state)
    end

    @impl true
    def handle_cast({:start}, state) do
        startImpl(state)
    end

    @impl true
    def handle_cast({:reset}, state) do
        resetImpl(state)
    end
end
