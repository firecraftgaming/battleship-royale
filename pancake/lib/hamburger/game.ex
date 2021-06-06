defmodule Hamburger.Game do
  alias Sushi.Schemas.Player
  alias Sushi.Schemas.Boat
  alias Sushi.Schemas.Shot
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

  def turn() do
    GameState.get().turn
  end

  def host() do
    GameState.get().host
  end

  def current() do
    state = GameState.get()
    Map.get(state.players, state.turn)
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
        state = %{state | players: players, started: true, turn: state.host}

        Hamburger.PubSub.broadcast("game:update", state)
        GameState.set(state)
    end
  end

  def reset() do
    state = GameState.get()
    state = %{state | started: false}

    Hamburger.PubSub.broadcast("game:update", state)
    GameState.set(state)
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

    should_stop = map_size(state.players) == 2 and state.started

    state = %{state | players: Map.delete(state.players, id)}
    state = %{state | host: calculateHost(state)}
    state = %{state | started: calculateStarted(state)}
    state = %{state | players: calculatePlayers(state)}

    if should_stop, do: Hamburger.PubSub.broadcast("game:kick:" <> List.first(Map.keys(state.players)), "You Won")
    if state.started, do: Hamburger.PubSub.broadcast("game:update", state)

    GameState.set(state)
  end

  def shoot(x, y) do
    state = GameState.get()

    player = Map.get(state.players, state.turn)
    target = Map.get(state.players, player.target)

    shot = %Shot{x: x, y: y, hit: getBoatInPoint(target, x, y) != nil}
    boats = Enum.reduce(target.boats, [], fn (boat, acc) ->
      sunk = boat.length == Enum.reduce([shot | target.shots], 0, fn (v, a) ->
        if Boat.pointInsideBoat?(boat, v.x, v.y), do: a + 1, else: a
      end)

      acc ++ [%Boat{boat | sunk: sunk}]
    end)

    sunk = Enum.reduce(boats, true, fn (boat, acc) -> boat.sunk and acc end)

    target = %Player{target | shots: [shot | target.shots], boats: boats}
    turn = cond do
      shot.hit or sunk -> player.id
      true -> player.target
    end

    state = %{state | players: Map.put(state.players, target.id, target), turn: turn}

    Hamburger.PubSub.broadcast("game:update", state)
    GameState.set(state)

    if sunk, do: Hamburger.PubSub.broadcast("game:kick:" <> target.id, "You Lost")
  end

  # private helper functions

  defp calculateHost(state) do
    cond do
      state.host != nil and Map.has_key?(state.players, state.host) -> state.host
      map_size(state.players) > 0 -> List.first(Map.keys(state.players))
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
