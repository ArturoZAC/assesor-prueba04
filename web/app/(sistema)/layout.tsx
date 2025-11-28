import { SistemaProvider } from "@/context/sistemaContext";
import { SistemaProviders } from "./@components/SistemaProviders";
import { getUser } from "@/server/getUser";
import { UserProvider } from "@/context/UserContext";

export default async function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  // console.log({ user });

  return (
    <UserProvider userInitial={user}>
      <SistemaProvider>
        <SistemaProviders>{children}</SistemaProviders>
      </SistemaProvider>
    </UserProvider>
  );
}
