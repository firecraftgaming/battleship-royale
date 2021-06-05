defmodule Waffle.Message.User.Login do
  use Waffle.Message.Call
  import Ecto.Changeset

  alias Sushi.Schemas.User
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

      @derive {Jason.Encoder, only: [:you]}

      @primary_key {:id, :binary_id, []}
      embedded_schema do
        field(:username, :string)
      end
  end

  def execute(changeset, state) do
    with {:ok, %{name: name, boats: boats}} <- apply_action(changeset, :validate) do
      cond do
        state.user != nil -> {:error, "Already Logged In"}
        Hamburger.GameState.started? -> {:error, "Game Already Started"}
        true ->
          user = %User{
            id: Pancake.Utils.Random.big_ascii_id,
            username: name,

            boats: boats,
            shots: [],

            target: nil
          }

          Hamburger.GameState.addPlayer(user)
          Hamburger.PubSub.subscribe("game:start")

          {:reply, %Reply{id: user.id, username: user.username}, %{state | user: user}}
      end
    end
  end
end
