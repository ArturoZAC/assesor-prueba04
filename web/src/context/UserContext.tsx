"use client";

import { UserInterface } from "@/interfaces/AuthInterface";
import React, { SetStateAction } from "react";

interface UserContextInterface {
  user: UserInterface | null;
  setUser: React.Dispatch<SetStateAction<UserInterface | null>>;
}

export const UserContext = React.createContext<UserContextInterface>({
  user: {
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    celular: "",
    email: "",
    id: "",
  },
  setUser: () => {},
});

export const UserProvider = ({
  children,
  userInitial,
}: {
  children: React.ReactNode;
  userInitial: UserInterface | null;
}) => {
  const [user, setUser] = React.useState<UserInterface | null>(userInitial);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
