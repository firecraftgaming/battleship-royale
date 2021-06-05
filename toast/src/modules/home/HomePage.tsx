import React from "react";
import { useRouter } from "next/router";
import { MainLayout } from "../../layouts/MainLayout";
import { Loading } from "../../ui/Loading";
import { isServer } from "../../lib/isServer";
import { UserStoreType, useUserStore } from "../../stores/useUserStore";
import { Game } from "../game/Game";

export const HomePage: React.FC = () => {
  const username = useUserStore((state: UserStoreType) => state.username);
  const router = useRouter();
  
  if (!username) {
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