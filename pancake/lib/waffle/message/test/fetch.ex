defmodule Waffle.Message.Test.Fetch do
    use Waffle.Message.Call

    @primary_key false
    embedded_schema do
    end

    def changeset(initializer \\ %__MODULE__{}, data) do
      initializer
      |> cast(data, [])
      |> validate_required([])
    end

    defmodule Reply do
        use Waffle.Message.Push

        @derive {Jason.Encoder, only: [:data]}

        @primary_key false
        embedded_schema do
            field(:data, :map)
        end
    end

    def execute(changeset, state) do
      with {:ok, %{}} <- apply_action(changeset, :validate) do
        players = for player <- Map.values(Hamburger.GameState.getPlayers()), do: Map.from_struct(player)
        {:reply, %{data: players}, state}
      end
    end
end
