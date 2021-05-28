defmodule Hamburger.Storage do
    use GenServer

    def start_link(opts) do
        GenServer.start_link(__MODULE__, :ok, opts)
    end

    def getPlayers() do
        GenServer.call(Hamburger.Storage, {:getPlayers})
    end

    def addPlayer(user) do
        GenServer.call(Hamburger.Storage, {:addPlayer, user})
    end

    def removePlayer(user) do
        GenServer.call(Hamburger.Storage, {:removePlayer, user})
    end

    @impl true
    def init(:ok) do
        {:ok, %{}}
    end

    def getPlayersImpl(state) do
        {:reply, state, state}
    end

    def addPlayerImpl(user, state) do
        new_state = Map.put(state, user.username, user)
        {:reply, new_state, new_state}
    end

    def removePlayerImpl(user, state) do
        new_state = Map.delete(state, user.username)
        {:reply, new_state, new_state}
    end

    @impl true
    def handle_call({:getPlayers}, _from, state) do
        getPlayersImpl(state)
    end

    @impl true
    def handle_call({:addPlayer, user}, _from, state) do
        addPlayerImpl(user, state)
    end

    @impl true
    def handle_call({:removePlayer, user}, _from, state) do
        removePlayerImpl(user, state)
    end
end