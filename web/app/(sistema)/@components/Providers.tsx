"use client";

import { AuthProvider } from "@/context/useAuthContext";
import { UserInterface } from "@/interfaces/AuthInterface";
import { ModalRender } from "./modal/ModalRender";

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserInterface | null;
}) {
  if (user) {
    /*setUser(user);*/
  }
  return (
    <AuthProvider userInitial={user}>
      {children}

      <ModalRender />
    </AuthProvider>
  );
}
