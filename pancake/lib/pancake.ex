defmodule Pancake do
    use Application

    def start(_type, _args) do
        import Supervisor.Spec, warn: false

        children = [
          {Hamburger.GameState, name: Hamburger.GameState},
          {Phoenix.PubSub, name: Hamburger.PubSub},
          Plug.Cowboy.child_spec(
              scheme: :http,
              plug: Waffle,
              options: [
                  port: String.to_integer("3000"),
                  dispatch: dispatch(),
                  protocol_options: [idle_timeout: :infinity]
              ]
          )
        ]

        opts = [strategy: :one_for_one, name: Pancake.Supervisor]
        Supervisor.start_link(children, opts)
    end

    defp dispatch do
      [
        {:_,
         [
           {"/socket", Waffle.SocketHandler, []},
           {:_, Plug.Cowboy.Handler, {Waffle, []}}
         ]}
      ]
    end
  end
