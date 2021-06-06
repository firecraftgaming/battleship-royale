defmodule Waffle.Message.Game.Shoot do
  use Waffle.Message.Cast
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field(:x, :integer)
    field(:y, :integer)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:x, :y])
    |> validate_required([:x, :y])
    |> validate_xy_constraint
  end

  defp if_state(statement, iftrue, iffalse) do
    if statement do
      iftrue
    else
      iffalse
    end
  end

  def validate_xy_constraint(changeset) do
    {x, y} = {get_field(changeset, :x), get_field(changeset, :y)}

    changeset = if_state(x < 0 or x > 9, add_error(changeset, :x, "x is out of bounds 0..9", val: x), changeset)
    changeset = if_state(y < 0 or y > 9, add_error(changeset, :y, "y is out of bounds 0..9", val: y), changeset)

    changeset
  end

  def already_shot?(target, x, y) do
    shots = if target != nil, do: target.shots, else: []
    Enum.reduce(shots, false, fn (v, acc) -> acc or (v.x == x and v.y == y) end)
  end

  def execute(changeset, state) do
    with {:ok, %{x: x, y: y}} <- apply_action(changeset, :validate) do
      cond do
        state.player == nil -> {:error, "Not Logged In"}
        not Hamburger.Game.started? -> {:error, "Game Not Started Yet"}
        Hamburger.Game.turn != state.player.id -> {:error, "Not Your Turn"}
        already_shot?(Hamburger.Game.getPlayer(state.player.target), x, y) -> {:error, "Already Shot There"}
        true ->
          Hamburger.Game.shoot(x, y)
          {:noreply, state}
      end
    end
  end
end
