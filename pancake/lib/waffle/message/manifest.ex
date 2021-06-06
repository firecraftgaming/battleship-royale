defmodule Waffle.Message.Manifest do
    alias Waffle.Message.Player
    alias Waffle.Message.Game

    alias Waffle.Message.Types.Operator
    require Operator

    @actions %{
      "player:join" => Player.Join,

      "game:start" => Game.Start,
      "game:shoot" => Game.Shoot
    }

    # verify that all of the actions are accounted for in the
    # operators list

    @actions
    |> Map.values()
    |> Enum.each(fn module ->
        Operator.valid_value?(module) || raise CompileError,
        description: "the module #{inspect(module)} is not a member of #{inspect(Operator)}"
    end)

    def actions, do: @actions
  end
