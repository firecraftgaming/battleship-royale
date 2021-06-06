import EctoEnum

alias Waffle.Message.Player
alias Waffle.Message.Game

defenum(
  Waffle.Message.Types.Operator,
  [
    # player: 0..1
    {Player.Join, 1},
    # game  2..3
    {Game.Start, 2},
    {Game.Shoot, 3}
  ]
)
