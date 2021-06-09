import React from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Game } from "../modules/game/Game";
import { useUserStore } from "../stores/useUserStore";
import { Login } from "./Login";

export function Main() {
  const username = useUserStore((state: any) => state.username);

  let content;
  if (username) content = <Game />; else content = <Login />;

  return (
    <MainLayout>
      {content}
    </MainLayout>
  );
}