defmodule Sushi.Schemas.User do
  use Ecto.Schema

  @type t :: %__MODULE__{
    id: Ecto.UUID.t(),
    username: String.t(),
    displayName: String.t(),
    boats: list(Boat),
    shots: list(Shot)
  }

  @primary_key {:id, :binary_id, []}
  embedded_schema do
    field(:username, :string)
    field(:displayName, :string)
    has_many(:boats, Boat)
    has_many(:shots, Shot)
  end

  defimpl Jason.Encoder do
    @fields ~w(id username displayName)a

    def encode(user, opts) do
      user
      |> Map.take(@fields)
      |> Jason.Encoder.encode(opts)
    end
  end
end
