defmodule Sushi.Schemas.ChatMessage do
    import Ecto.Changeset
    use Ecto.Schema

    use Waffle.Message.Push
    alias Sushi.Schemas.User

    @type t :: %__MODULE__{
        id: Ecto.UUID.t(),
        message: String.t(),
        from: User.t() | Ecto.Association.NotLoaded.t(),
    }

    @derive {Jason.Encoder, only: ~w(id message from)a}

    @primary_key {:id, :binary_id, []}
    embedded_schema do
      field(:message, :string)
      belongs_to(:from, User, foreign_key: :fromId, type: :binary_id)
    end

    def insert_changeset(message, attrs) do
        message
        |> cast(attrs, [
            :id,
            :message,
            :fromId
        ])
        |> validate_required([:message, :fromId])
        |> validate_length(:message, max: 500)
        |> unique_constraint(:fromId)
    end

    def edit_changeset(message, attrs) do
        message
        |> cast(attrs, [:message])
        |> validate_length(:message, max: 500)
    end
  end
