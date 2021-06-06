defmodule Waffle.Message.Player.Join do
  use Waffle.Message.Call
  import Ecto.Changeset

  alias Sushi.Schemas.Player
  alias Sushi.Schemas.Boat

  @primary_key false
  embedded_schema do
    field(:name, :string)
    embeds_many(:boats, Boat)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:name])
    |> cast_embed(:boats)
    |> validate_length(:name, max: 32)
    |> validate_required([:name, :boats])
    |> Boat.validate_boats(:boats)
  end

  defmodule Reply do
      use Waffle.Message.Push

      @derive {Jason.Encoder, only: [:id, :username]}

      @primary_key {:id, :binary_id, []}
      embedded_schema do
        field(:username, :string)
      end
  end

  def execute(changeset, state) do
    with {:ok, %{name: name, boats: boats}} <- apply_action(changeset, :validate) do
      cond do
        state.player != nil -> {:error, "Already Logged In"}
        Hamburger.Game.started? -> {:error, "Game Already Started"}
        true ->
          player = %Player{
            id: Pancake.Utils.Random.big_ascii_id,
            username: name,

            boats: boats,
            shots: [],

            target: nil
          }

          Hamburger.Game.addPlayer(player)

          Hamburger.PubSub.subscribe("game:kick:" <> player.id)
          Hamburger.PubSub.subscribe("game:update")

          {:reply, %Reply{id: player.id, username: player.username}, %{state | player: player}}
      end
    end
  end
end
