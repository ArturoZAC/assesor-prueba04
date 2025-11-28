import { config } from "@/config/config";
import { UserInterface } from "@/interfaces/AuthInterface";
import { cookies } from "next/headers";

export async function getUser(): Promise<UserInterface | null> {
  const token = (await cookies()).get("token");

  // Si no hay token, retornar null (el middleware ya manejó la redirección)
  if (!token?.value) {
    console.log("No token found");
    return null;
  }

  console.log("Token found:", token.value.substring(0, 20) + "...");

  try {
    const res = await fetch(`${config.apiUrl}/user/yo`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token.value}`,
        Authorization: `Bearer ${token.value}`,
      },
      // Agregar timeout para evitar cuelgues
      signal: AbortSignal.timeout(10000), // 10 segundos
    });

    // Manejar diferentes tipos de errores de respuesta
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Error de autenticación - el middleware manejará la redirección en la próxima navegación
        console.log("Authentication failed");
        return null;
      } else if (res.status >= 500) {
        // Error del servidor - no redirigir, solo loggear
        console.error("Server error:", res.status, res.statusText);
        return null;
      } else {
        // Otros errores - no redirigir
        console.error("API error:", res.status, res.statusText);
        return null;
      }
    }

    const data = await res.json();
    console.log("User data fetched successfully");
    return data as UserInterface;
  } catch (error) {
    console.error("Error fetching user:", error);

    // Para errores de red, timeout, etc., simplemente retornar null
    // El middleware manejará la redirección si es necesario
    console.log("Network or server error, returning null");
    return null;
  }
}
