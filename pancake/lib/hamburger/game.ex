defmodule Hamburger.Game do
  alias Sushi.Schemas.Player
  alias Sushi.Schemas.Boat
  alias Hamburger.GameState

  # helper functions

  def calculateTargets(players) do
    length = map_size(players) - 1

    Enum.reduce(0..length, players, fn (i, players) ->
      values = Map.values(players)
      first = List.first(values)

      player = Enum.at(values, i)
      target = Enum.at(values ++ [first], i + 1)

      Map.put(players, player.id, %Player{player | target: target.id})
    end)
  end

  def getBoatInPoint(player, x, y) do
    Enum.reduce(player.boats, nil, fn (v, acc) ->
      cond do
        Boat.pointInsideBoat?(v, x, y) -> v
        true -> acc
      end
    end)
  end

  # query functions

  def started?() do
    GameState.get().started
  end

  def getPlayers() do
    GameState.get().players
  end

  def getPlayer(id) do
    Map.get(GameState.get().players, id)
  end

  # mutation functions

  def start() do
    state = GameState.get()
    if (map_size(state.players) > 1 and !state.started) do
        players = calculateTargets(state.players)

        Hamburger.PubSub.broadcast("game:start", true)
        GameState.set(%{state | players: players, started: true})
    end
  end

  def reset() do
    state = GameState.get()
    GameState.set(%{state | started: false})
  end

  def addPlayer(player) do
    state = GameState.get()
    if not state.started do
      state = %{state | players: Map.put(state.players, player.id, player)}
      state = %{state | host: calculateHost(state)}

      GameState.set(state)
    end
  end

  def removePlayer(id) do
    state = GameState.get()

    state = %{state | players: Map.delete(state.players, id)}
    state = %{state | host: calculateHost(state)}
    state = %{state | started: calculateStarted(state)}
    state = %{state | players: calculatePlayers(state)}

    if state.started, do: Hamburger.PubSub.broadcast("game:start", true)
    GameState.set(state)
  end

  # private helper functions

  defp calculateHost(state) do
    cond do
      state.host != nil and Map.has_key?(state.players, state.host) -> state.host
      map_size(state.players) > 0 -> List.first(Map.values(state.players)).id
      true -> nil
    end
  end
  defp calculateStarted(state) do
    cond do
      map_size(state.players) > 1 -> state.started
      true -> false
    end
  end
  defp calculatePlayers(state) do
    cond do
      state.started -> calculateTargets(state.players)
      true -> state.players
    end
  end
end
