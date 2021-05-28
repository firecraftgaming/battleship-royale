import EctoEnum

alias Waffle.Message.User
alias Waffle.Message.Test

defenum(
  Waffle.Message.Types.Operator,
  [
    # user: 0..1
    {User.Login, 1},
    # test  2..3
    {Test.Fetch, 2}
  ]
)
