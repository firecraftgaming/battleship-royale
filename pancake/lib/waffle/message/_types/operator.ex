import EctoEnum

alias Waffle.Message.User
alias Waffle.Message.Test
alias Waffle.Message.Game

defenum(
  Waffle.Message.Types.Operator,
  [
    # user: 0..1
    {User.Login, 1},
    # test  2..2
    {Test.Fetch, 2},
    # game  3..3
    {Game.Start, 3}
  ]
)
