defmodule Waffle.Message.User.Login do
    use Waffle.Message.Call

    alias Sushi.Schemas.User

    @primary_key false
    embedded_schema do
      field(:name, :string)
    end

    def changeset(initializer \\ %__MODULE__{}, data) do
      initializer
      |> cast(data, [:name])
      |> validate_length(:name, max: 500)
      |> validate_required([:name])
    end

    defmodule Reply do
        use Waffle.Message.Push

        @derive {Jason.Encoder, only: [:username]}

        @primary_key false
        embedded_schema do
            field(:username, :string)
        end
    end

    def execute(changeset, state) do
      with {:ok, %{name: name}} <- apply_action(changeset, :validate) do
        user = %User{
            username: Pancake.Utils.Random.big_ascii_id(),
            displayName: name
        }

        Hamburger.PubSub.subscribe("chat:all");
        Hamburger.PubSub.subscribe("chat:" <> user.username);

        {:reply, %Reply{
            username: user.username
        }, %{state | user: user}}
      end
    end
end
