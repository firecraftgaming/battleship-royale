# STEP 1 - BUILD RELEASE 
FROM hexpm/elixir:1.12.1-erlang-22.3.4.18-alpine-3.13.3 AS build

WORKDIR /app

COPY rebar3 /app/rebar3

# Install build dependencies
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache \
    git \
    build-base && \ 
    mix local.hex --force && \
    mix local.rebar rebar3 ./rebar3 --force

ENV MIX_ENV=prod

# Install elixir package dependencies
COPY mix.exs /app/mix.exs
COPY mix.lock /app/mix.lock
RUN mix do deps.get, deps.compile

# copy config, priv and release and application directories
COPY lib /app/lib

# compile app and create release
RUN mix do compile, release

####################################################################################################
# STEP 2 - FINAL
FROM alpine:3.13.2 as app
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/pancake ./

ENV HOME=/app

CMD bin/pancake eval "Pancake.Release.migrate" && bin/pancake start