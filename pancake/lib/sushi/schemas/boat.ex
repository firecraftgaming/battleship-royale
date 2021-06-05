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
    |> validate_xy_constraint
  end

  defp if_state(statement, iftrue, iffalse) do
    if statement do
      iftrue
    else
      iffalse
    end
  end

  defp validate_xy_constraint(changeset) do
    {x, y, length, rot} = {get_field(changeset, :x), get_field(changeset, :y), get_field(changeset, :length), get_field(changeset, :rot)}

    changeset = if_state(x < 0 or x > 9, add_error(changeset, :x, "x is out of bounds 0..9", val: x), changeset)
    changeset = if_state(y < 0 or y > 9, add_error(changeset, :y, "y is out of bounds 0..9", val: y), changeset)

    changeset = if_state(length < 2 or length > 5, add_error(changeset, :length, "length is out of bounds 2..5", val: length), changeset)
    changeset = if_state(not (rot == "x" or rot == "y"), add_error(changeset, :rot, "rot is neither of 'x' or 'y'", val: rot), changeset)

    changeset = if_state(rot == "x" and x + length > 10, add_error(changeset, :length, "boat extends to far", val: length + x), changeset)
    changeset = if_state(rot == "y" and y + length > 10, add_error(changeset, :length, "boat extends to far", val: length + y), changeset)

    changeset
  end

  def validate_boats(changeset, field) do
    boats = get_field(changeset, field)

    result = Enum.reduce(boats, %{}, fn (v, acc) -> Map.put(acc, v.length, Map.get(acc, v.length, 0) + 1) end)
    valid_amount_boats = case result do
      _ when length(boats) != 5 ->
        true
      %{2 => 1, 3 => 2, 4 => 1, 5 => 1} ->
        false
      _ ->
        true
    end

    big_boxes = Enum.reduce(boats, [], fn (v, acc) ->
      {x, y} = {v.x - 1, v.y - 1}

      {w, h} = case v.rot do
        "x" ->
          {2 + v.length, 3}
        "y" ->
          {3, 2 + v.length}
        _ ->
          {0, 0}
      end

      box = %{
        x: x,
        y: y,

        w: w,
        h: h
      }

      [box | acc]
    end)

    small_boxes = Enum.reduce(boats, [], fn (v, acc) ->
      {x, y} = {v.x, v.y}

      {w, h} = case v.rot do
        "x" ->
          {v.length, 1}
        "y" ->
          {1, v.length}
        _ ->
          {0, 0}
      end

      box = %{
        x: x,
        y: y,

        w: w,
        h: h
      }

      [box | acc]
    end)

    intersect = Enum.reduce(0..(length(boats) - 2), false, fn (i, acc) ->
      cond do
        acc -> acc
        true ->
          Enum.reduce((i + 1)..(length(boats) - 1), false, fn (j, acc) ->
            cond do
              acc -> acc
              true ->
                a = Enum.at(small_boxes, i)
                b = Enum.at(big_boxes, j)

                ahw = a.x + a.w / 2
                bhw = b.x + b.w / 2

                ahh = a.y + a.h / 2
                bhh = b.y + b.h / 2

                w = a.w + b.w
                h = a.h + b.h

                wa = abs(ahw - bhw) * 2
                ha = abs(ahh - bhh) * 2

                wa < w and ha < h
            end
          end)
      end
    end)

    changeset = if_state(valid_amount_boats, add_error(changeset, field, "to many or to few boats or invalid amounts of them", val: boats), changeset)
    changeset = if_state(intersect, add_error(changeset, field, "boats overlap", val: boats), changeset)

    changeset
  end

  defimpl Jason.Encoder do
    @fields ~w(x y sunk length rot)a

    def encode(boat, opts) do
      boat
      |> Map.take(@fields)
      |> Jason.Encoder.encode(opts)
    end
  end

  def pointInsideBoat?(boat, x, y) do
    init = boat.x + boat.y * 10
    pos = x + y * 10

    diff = pos - init

    case boat.rot do
      "x" -> diff < boat.length
      "y" -> diff / 10 < boat.length and rem(diff, 10) < 1
    end
  end
end
