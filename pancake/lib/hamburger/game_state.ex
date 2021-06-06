defmodule Hamburger.GameState do
    use GenServer

    # Init

    def start_link(opts) do
        GenServer.start_link(__MODULE__, :ok, opts)
    end

    @impl true
    def init(:ok) do
        {:ok, %{started: false, players: %{}, host: nil, turn: nil}}
    end

    # Client

    def get() do
        GenServer.call(Hamburger.GameState, {:get})
    end

    def set(data) do
        GenServer.cast(Hamburger.GameState, {:set, data})
    end

    # Server

    @impl true
    def handle_call({:get}, _from, state) do
        {:reply, state, state}
    end

    @impl true
    def handle_cast({:set, data}, _state) do
        {:noreply, data}
    end
end
