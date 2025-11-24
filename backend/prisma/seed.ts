import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Registrar Roles
    await registrarRoles();

    // Registrar Administrador
    await registrarAdministrador();

    // Registrar Precios
    await registrarTipoCambio();

    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function registrarRoles() {
  const roles = ["administrador", "gerencia", "cliente"];

  for (const nombre of roles) {
    const rolExiste = await prisma.rol.findUnique({
      where: { nombre },
    });

    if (!rolExiste) {
      await prisma.rol.create({
        data: { nombre },
      });

      console.log(`Rol '${nombre}' registrado.`);
    }
  }
}

async function registrarAdministrador() {

    const hashPassword = await bcrypt.hash("Assessor@2025", 10);
    
    await prisma.usuario.create({
        data: {
          rol_id: 2,
          nombres: "Assessor",
          apellido_paterno: "Perú",
          apellido_materno: "Admin",
          email: "administrador@assessorperu.com",
          password: hashPassword,
          activo: true,
          codigo: "CP9900001",
          vigente: "Sí",
          documento: "12345678",
          ocupacion: "Administrador",
          tipo_cliente: "persona_juridica",
          direccion: "Av. Principal 123",
          departamento: "Lima",
          provincia: "Lima",
          distrito: "Miraflores",
          telefono: "987654321",
          apellido_paterno_apo: "García",
          apellido_materno_apo: "López",
          nombres_apo: "Juan Carlos",
          tipo_documento: "DNI",
          numero_documento: "87654321",
          nacionalidad: "Peruana",
          cliente: "Empresa SAC",
          tipo_documento_cliente: "RUC",
          cliente_2: "Cliente Dos SAC",
          documento_2: "20481234567",
          otro: "Ninguno",
          tercero: "Tercero S.A.",
          tipo_tercero: "Proveedor",
          documento_tercero: "10481234567",
          observacion: "Este es el usuario administrador por defecto",
        },
      });
    
      await prisma.usuario.create({
        data: {
          rol_id: 1,
          nombres: "Usuario",
          apellido_paterno: "Uno",
          apellido_materno: "Test",
          email: "usuario1@assessorperu.com",
          password: hashPassword,
          activo: true,
          codigo: "CP9900002",
          vigente: "Sí",
          documento: "22334455",
          ocupacion: "Asistente",
          tipo_cliente: "persona_natural",
          direccion: "Calle Secundaria 456",
          departamento: "Cusco",
          provincia: "Cusco",
          distrito: "San Blas",
          telefono: "912345678",
          apellido_paterno_apo: "Ramírez",
          apellido_materno_apo: "Gómez",
          nombres_apo: "Luis Alberto",
          tipo_documento: "DNI",
          numero_documento: "99887766",
          nacionalidad: "Peruana",
          cliente: "Cliente Uno SAC",
          tipo_documento_cliente: "RUC",
          cliente_2: "Cliente Extra",
          documento_2: "20489991234",
          otro: "Sin datos",
          tercero: "Proveedor Uno",
          tipo_tercero: "Proveedor",
          documento_tercero: "10489999876",
          observacion: "Usuario número 1 de prueba",
        },
      });
    
      await prisma.usuario.create({
        data: {
          rol_id: 1,
          nombres: "Usuario",
          apellido_paterno: "Dos",
          apellido_materno: "Ejemplo",
          email: "usuario2@assessorperu.com",
          password: hashPassword,
          activo: true,
          codigo: "CP9900003",
          vigente: "Sí",
          documento: "33445566",
          ocupacion: "Supervisor",
          tipo_cliente: "persona_natural",
          direccion: "Jr. Las Flores 789",
          departamento: "Arequipa",
          provincia: "Arequipa",
          distrito: "Yanahuara",
          telefono: "923456789",
          apellido_paterno_apo: "Fernández",
          apellido_materno_apo: "Ruiz",
          nombres_apo: "María Elena",
          tipo_documento: "DNI",
          numero_documento: "88776655",
          nacionalidad: "Peruana",
          cliente: "Cliente Dos SAC",
          tipo_documento_cliente: "RUC",
          cliente_2: "Cliente Apoyo",
          documento_2: "20553334444",
          otro: "Ninguno",
          tercero: "Proveedor Dos",
          tipo_tercero: "Proveedor",
          documento_tercero: "10558887777",
          observacion: "Usuario número 2 de prueba",
        },
      });
    
  console.log("Administrador creado con todos los campos.");
}

async function registrarTipoCambio() {
  const precioCompra = new Prisma.Decimal(3.65);
  const precioVenta = new Prisma.Decimal(3.7);
  const middlePrice = Number(precioCompra.plus(precioVenta).dividedBy(2));

  await prisma.tipoCambio.create({
    data: {
      precioCompra,
      precioVenta,
      intervaloCompra: new Prisma.Decimal(0.005),
      intervaloVenta: new Prisma.Decimal(0.005),
      moneda: "USD",
      middlePrice,
    },
  });

  console.log("Tipo de Cambio Registrado");
}

main();
