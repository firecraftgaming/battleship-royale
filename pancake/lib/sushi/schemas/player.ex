defmodule Sushi.Schemas.Player do
  use Ecto.Schema

  alias Sushi.Schemas.Shot
  alias Sushi.Schemas.Boat

  @type t :: %__MODULE__{
    id: Ecto.UUID.t(),
    username: String.t(),

    target: Ecto.UUID.t(),

    boats: list(Boat),
    shots: list(Shot)
  }

  @primary_key {:id, :binary_id, []}
  embedded_schema do
    field(:username, :string)

    field(:target, :binary_id)

    embeds_many(:boats, Boat)
    embeds_many(:shots, Shot)
  end

  defimpl Jason.Encoder do
    @fields ~w(id username)a

    def encode(player, opts) do
      player
      |> Map.take(@fields)
      |> Jason.Encoder.encode(opts)
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
end
