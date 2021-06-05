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

      @derive {Jason.Encoder, only: [:id]}

      @primary_key false
      embedded_schema do
        field(:id, :binary_id)
      end
  end

  def execute(changeset, state) do
    with {:ok, %{name: name, boats: boats}} <- apply_action(changeset, :validate) do
      if (state.user == nil) do
        user = %User{
          id: Pancake.Utils.Random.big_ascii_id,
          username: name,

          boats: boats,
          shots: [],

          target: nil,
          victim: nil
        }

        Hamburger.GameState.addPlayer(user)

        {:reply, %Reply{
          id: user.id
        }, %{state | user: user}}
      else
        {:error, "Already Logged In"}
      end

    end
  end
end
