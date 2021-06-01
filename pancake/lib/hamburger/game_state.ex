defmodule Hamburger.GameState do
    use GenServer

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

    def reset() do
        GenServer.cast(Hamburger.GameState, {:reset})
    end

    @impl true
    def init(:ok) do
        {:ok, %{started: false, players: %{}}}
    end

    def startImpl(state) do
        if (map_size(state.players) > 1) do
            Hamburger.PubSub.broadcast("game:start", true)
            {:noreply, %{state | started: true}}
        else
            {:noreply, state}
        end
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
        players = Map.put(state.players, user.id, user)
        {:noreply, %{state | players: players}}
    end

    def removePlayerImpl(id, state) do
        players = Map.delete(state.players, id)
        {:noreply, %{state | players: players}}
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
