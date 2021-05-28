defmodule Hamburger.PubSub do
    alias Phoenix.PubSub

    @valid_classes ~w(gene chat)

    def subscribe(topic = <<class::binary-size(4), ?:>> <> _) when class in @valid_classes do
      PubSub.subscribe(__MODULE__, topic)
    end

    def broadcast(
          topic = <<class::binary-size(4), ?:>> <> _,
          message
        )
        when class in @valid_classes do
      # do other validation here in test and dev, in the future.

      PubSub.broadcast(__MODULE__, topic, {topic, message})
    end

    def unsubscribe(topic = <<class::binary-size(4), ?:>> <> _) when class in @valid_classes do
      PubSub.unsubscribe(__MODULE__, topic)
    end
  end
