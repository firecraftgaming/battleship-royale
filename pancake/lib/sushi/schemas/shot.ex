defmodule Sushi.Schemas.Shot do
  use Ecto.Schema

  @type t :: %__MODULE__{
    x: Integer.t(),
    y: Integer.t(),

    hit: boolean()
  }

  embedded_schema do
    field(:x, :integer)
    field(:y, :integer)

    field(:hit, :boolean)
  end

  defimpl Jason.Encoder do
    @fields ~w(x y hit)a

    def encode(shot, opts) do
      shot
      |> Map.take(@fields)
      |> Jason.Encoder.encode(opts)
    end
  end
end
