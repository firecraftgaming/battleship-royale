defmodule Waffle.Message.User.Login do
  use Waffle.Message.Call

  alias Sushi.Schemas.User

  @primary_key false
  embedded_schema do
    field(:name, :string)
    embeds_many(:boats, Boat)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:name])
    |> cast_embed(:boats, [required: true])
    |> validate_length(:name, max: 32)
    |> validate_required([:name, :boats])
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
      user = %User{
        id: Pancake.Utils.Random.big_ascii_id,
        username: name,

        boats: [],
        shots: [],

        target: nil,
        victim: nil
      }

      Hamburger.GameState.addPlayer(user);

      IO.puts(inspect boats)

      {:reply, %Reply{
        id: user.id
      }, %{state | user: user}}
    end
  end
end
