defmodule Waffle.Message.Game.Start do
  use Waffle.Message.Cast
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [])
  end

  def execute(changeset, state) do
    with {:ok, %{}} <- apply_action(changeset, :validate) do
      cond do
        state.player == nil -> {:error, "Not Logged In"}
        Hamburger.GameState.get().host != state.player.id -> {:error, "You are not the host"}
        Hamburger.Game.started? -> {:error, "Game already started"}
        true ->
          Hamburger.Game.start()
          {:noreply, state}
      end
    end
  end
end
