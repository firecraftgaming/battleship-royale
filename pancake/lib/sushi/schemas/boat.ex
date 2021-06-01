defmodule Sushi.Schemas.Boat do
  import Ecto.Changeset
  use Ecto.Schema

  @type t :: %__MODULE__{
    x: Integer.t(),
    y: Integer.t(),
    length: Integer.t(),

    rot: String.t(),
    sunk: boolean()
  }

  @primary_key false
  embedded_schema do
    field(:x, :integer)
    field(:y, :integer)
    field(:length, :integer)

    field(:rot, :string)
    field(:sunk, :boolean, [default: false])
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:x, :y, :length, :rot])
    |> validate_required([:x, :y, :length, :rot])
  end


  defimpl Jason.Encoder do
    @fields ~w(x y sunk length rot)a

    def encode(user, opts) do
      user
      |> Map.take(@fields)
      |> Jason.Encoder.encode(opts)
    end
  end
end
