defmodule Sushi.Schemas.User do
    use Ecto.Schema
    import Ecto.Changeset

    use Waffle.Message.Push

    @type t :: %__MODULE__{
        id: Ecto.UUID.t(),
        username: String.t(),
        displayName: String.t()
    }

    @primary_key {:id, :binary_id, []}
    embedded_schema do
      field(:username, :string)
      field(:displayName, :string)
    end

    def edit_changeset(user, attrs) do
      user
      |> cast(attrs, [
        :id,
        :username,
        :displayName,
      ])
      |> validate_required([:username, :displayName])
      |> update_change(:displayName, &String.trim/1)
      |> validate_length(:displayName, min: 2, max: 50)
      |> validate_format(:username, ~r/^[\w\.]{4,15}$/)
      |> unique_constraint(:username)
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
