import EctoEnum

alias Waffle.Message.Player
alias Waffle.Message.Test
alias Waffle.Message.Game

defenum(
  Waffle.Message.Types.Operator,
  [
    # player: 0..1
    {Player.Join, 1},
    # test  2..2
    {Test.Fetch, 2},
    # game  3..3
    {Game.Start, 3}
  ]
)
