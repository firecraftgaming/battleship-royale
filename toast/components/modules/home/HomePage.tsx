import React from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../layouts/MainLayout";
import { Loading } from "../../ui/Loading";
import { isServer } from "../../../lib/isServer";
import { useUsernameStore } from "../../stores/useUsernameStore";
import { Game } from "../game/Game";

export const HomePage: React.FC = () => {
  const username = useUsernameStore((state: any) => state.username);

  if (!username) {
    const router = useRouter();
    if (!isServer) router.push('/login');

    return (
      <MainLayout>
        <Loading/>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Game/>
    </MainLayout>
  )
};