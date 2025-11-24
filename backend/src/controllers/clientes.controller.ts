
import * as XLSX from "xlsx";
import { Request, Response } from "express";
import multer from "multer";
import * as bcrypt from "bcryptjs";
import prisma from "../config/database";
import { guardarError } from "../logic/guardarErrores";


export async function generarCodigo(tipoCliente: string): Promise<string> {
  const año = new Date().getFullYear().toString().slice(2);
  const prefijo = tipoCliente === "persona_juridica" ? "CE" : "CP";
  const base = `${prefijo}${año}`;

  const ultimo = await prisma.usuario.findFirst({
    where: {
      tipo_cliente: tipoCliente,
      codigo: {
        startsWith: base,
      },
    },
    orderBy: {
      codigo: "desc",
    },
    select: {
      codigo: true,
    },
  });

  let correlativo = 1;
  if (ultimo?.codigo) {
    const num = parseInt(ultimo.codigo.slice(base.length));
    correlativo = num + 1;
  }

  const codigoFinal = `${base}${correlativo.toString().padStart(5, "0")}`;
  return codigoFinal;
}

export const editarCliente = async (req: any, res: any) => {
  const { id } = req.params;
  const {
    rol_id = 3,
    nombres,
    email,
    vigente,
    documento,
    apellido_paterno,
    apellido_materno,
    ocupacion,
    tipo_cliente,
    direccion,
    departamento,
    provincia,
    distrito,
    telefono,
    apellido_paterno_apo,
    apellido_materno_apo,
    nombres_apo,
    tipo_documento,
    numero_documento,
    nacionalidad,
    cliente,
    tipo_documento_cliente,
    cliente_2,
    documento_2,
    otro,
    tercero,
    tipo_tercero,
    documento_tercero,
    observacion,
  } = req.body;
  console.log(req.body)
  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: id },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: id },
      data: {
        rol_id,
        nombres,
        email,
        vigente,
        documento,
        apellido_paterno,
        apellido_materno,
        ocupacion,
        tipo_cliente,
        direccion,
        departamento,
        provincia,
        distrito,
        telefono,
        apellido_paterno_apo,
        apellido_materno_apo,
        nombres_apo,
        tipo_documento,
        numero_documento,
        nacionalidad,
        cliente,
        tipo_documento_cliente,
        cliente_2,
        documento_2,
        otro,
        tercero,
        tipo_tercero,
        documento_tercero,
        observacion,
      },
    });

    return res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: {
        id: usuarioActualizado.id,
        email: usuarioActualizado.email,
        nombres: usuarioActualizado.nombres,
        updated_at: usuarioActualizado.updated_at,
      },
    });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    return res.status(500).json({ error: "Ocurrió un error al editar el usuario" });
  } finally {
    prisma.$disconnect()
  }
};

export const registrarCliente = async (req: any, res: any) => {
  const {
    rol_id = 3,
    nombres,
    email,
    vigente,
    documento,
    apellido_paterno,
    apellido_materno,
    ocupacion,
    tipo_cliente,
    direccion,
    departamento,
    provincia,
    distrito,
    telefono,
    apellido_paterno_apo,
    apellido_materno_apo,
    nombres_apo,
    tipo_documento,
    numero_documento,
    nacionalidad,
    cliente,
    tipo_documento_cliente,
    cliente_2,
    documento_2,
    otro,
    tercero,
    tipo_tercero,
    documento_tercero,
    observacion,
  } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { email: email, documento: documento },
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const codigo = (await generarCodigo(tipo_cliente)).toString();

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        rol_id,
        nombres,
        email,
        password: "",
        codigo,
        vigente,
        documento,
        apellido_paterno,
        apellido_materno,
        ocupacion,
        tipo_cliente,
        direccion,
        departamento,
        provincia,
        distrito,
        telefono,
        apellido_paterno_apo,
        apellido_materno_apo,
        nombres_apo,
        tipo_documento,
        numero_documento,
        nacionalidad,
        cliente,
        tipo_documento_cliente,
        cliente_2,
        documento_2,
        otro,
        tercero,
        tipo_tercero,
        documento_tercero,
        observacion,
      },
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        codigo: nuevoUsuario.codigo,
        nombres: nuevoUsuario.nombres,
        created_at: nuevoUsuario.created_at,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Ocurrió un error al registrar el usuario" });
  } finally {
    prisma.$disconnect()
  }
};

export const obtenerClientes = async (req: any, res: any) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = (req.query.search as string)?.trim() || "";

  const tipo_cliente = (req.query.tipoCliente as string)?.trim() || "";
  const skip = (page - 1) * limit;

  const searchLower = search.toLowerCase();

  const whereConditions: any = {
    rol_id: 3,
    OR: [
      { documento: { contains: searchLower } },
      { nombres: { contains: searchLower } },
      { apellido_materno: { contains: searchLower } },
      { apellido_paterno: { contains: searchLower } },
      { cliente: { contains: searchLower } },
      { email: { contains: searchLower } },
      { telefono: { contains: searchLower } },
    ],
  };

  if (tipo_cliente) {
    whereConditions.tipo_cliente = {
      contains: tipo_cliente,
    };
  }
  try {
    const [clientes, total] = await Promise.all([
      prisma.usuario.findMany({
        skip,
        take: limit,
        where: whereConditions,
      }),
      prisma.usuario.count({
        where: whereConditions,
      }),
    ]);

    res.json({
      data: clientes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clientes" });
  } finally {
    prisma.$disconnect()
  }
};

export const buscarCliente = async (req: any, res: any) => {
  const search = req.params.search;

  if (!search || search.trim().length < 3) {
    return res.status(400).json({
      error: "Debe proporcionar al menos 3 caracteres para buscar.",
    });
  }

  try {
    const clientes = await prisma.usuario.findMany({
      where: {
        OR: [
          {
            nombres: {
              contains: search,
            },
          },
          {
            apellido_materno: {
              contains: search,
            },
          },
          {
            apellido_paterno: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
          {
            documento: {
              contains: search,
            },
          },
        ],
      },
      take: 10,
    });

    res.json(clientes);
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    res.status(500).json({ error: "Error al buscar clientes." });
  } finally {
    prisma.$disconnect()
  }
};

/* EXPORTACION DATOS A EXCEL */

export const exportarUsuariosExcel = async (req: any, res: any) => {
  try {
    const { tipo } = req.params;
    const whereCondition =
      tipo === "todos" ? { rol_id: 3 } : { rol_id: 3, tipo_cliente: tipo };
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: true,
      },
      where: whereCondition,
    });

    const headers = [
      "Nombres",
      "Email",
      "Creado el",
      "Actualizado el",
      "Código",
      "Vigente",
      "Documento",
      "Apellido Paterno",
      "Apellido Materno",
      "Ocupación",
      "Tipo de Cliente",
      "Dirección",
      "Departamento",
      "Provincia",
      "Distrito",
      "Teléfono",
      "Apellido Paterno Apoderado",
      "Apellido Materno Apoderado",
      "Nombres Apoderado",
      "Tipo Documento",
      "Número Documento",
      "Nacionalidad",
      "Cliente",
      "Tipo Documento Cliente",
      "Cliente 2",
      "Documento 2",
      "Otro",
      "Tercero",
      "Tipo Tercero",
      "Documento Tercero",
      "Observación",
    ];

    // Cuerpo de la tabla
    const rows = usuarios.map((u) => [
      u.nombres,
      u.email,
      u.created_at.toISOString(),
      u.updated_at.toISOString(),
      u.codigo,
      u.vigente ?? "",
      u.documento ?? "",
      u.apellido_paterno ?? "",
      u.apellido_materno ?? "",
      u.ocupacion ?? "",
      u.tipo_cliente ?? "",
      u.direccion ?? "",
      u.departamento ?? "",
      u.provincia ?? "",
      u.distrito ?? "",
      u.telefono ?? "",
      u.apellido_paterno_apo ?? "",
      u.apellido_materno_apo ?? "",
      u.nombres_apo ?? "",
      u.tipo_documento ?? "",
      u.numero_documento ?? "",
      u.nacionalidad ?? "",
      u.cliente ?? "",
      u.tipo_documento_cliente ?? "",
      u.cliente_2 ?? "",
      u.documento_2 ?? "",
      u.otro ?? "",
      u.tercero ?? "",
      u.tipo_tercero ?? "",
      u.documento_tercero ?? "",
      u.observacion ?? "",
    ]);

    // Insertamos cabeceras + datos
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=usuarios.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error exportando usuarios:", error);
    res.status(500).json({ message: "Error exportando usuarios" });
  } finally {
    prisma.$disconnect()
  }
};

/***************** SUBIDA MASIVA DE DATOS */

export const uploadCliente = multer({ storage: multer.memoryStorage() });

/*
export const importarUsuariosHandler = [
  upload.single("file"),

  async (req: Request, res: Response): Promise<any> => {

    const errores: { codigo: string; mensaje: string }[] = [];

    try {
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer) {
        console.log("Archivo no encontrado")
        return res.status(400).json({ error: "Archivo no encontrado" });
      }

      const workbook = XLSX.read(fileBuffer);
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(hoja, { defval: "" });

      for (const row of rows) {
        const codigo = String(row["CODIGO"] ?? ""); // Para el reporte de errores
        const tipoCliente =
          String(row["TIP/CLI"] ?? "")
            .toLowerCase()
            .includes("jurídica") ||
            String(row["TIP/CLI"] ?? "")
              .toLowerCase()
              .includes("juridica")
            ? "persona_juridica"
            : "persona_natural";

        const email = String(
          row["CORREO"] || `usuario${Date.now()}@correo.com`
        );
        const password = await bcrypt.hash("123456", 10);

        try {
          // 3. Intentar crear el usuario
          await prisma.usuario.create({
            data: {
              nombres: String(row["NOMBRES"]),
              email,
              password,
              cliente: String(row["CLIENTE"] ?? ""),
              departamento: String(row["DEPARTAMENTO"] ?? ""),
              direccion: String(row["DIRECCION"] ?? ""),
              distrito: String(row["DISTRITO"] ?? ""),
              nacionalidad: String(row["NACIONALID"] ?? ""),
              observacion: String(row["OBSERVACION"] ?? ""),
              ocupacion: String(row["OCUPACION"] ?? ""),
              otro:
                row["Otro"] !== undefined && row["Otro"] !== null
                  ? String(row["Otro"])
                  : null,
              provincia: String(row["PROVINCIA"] ?? ""),
              telefono: String(row["TELEFONO"] ?? ""),
              tercero: String(row["TERCERO"] ?? ""),
              vigente: String(row["VIGENTE"] ?? ""),
              apellido_materno: String(row["APELLIDO MATERNO"] ?? ""),
              apellido_materno_apo: String(row["MATERNO - APO"] ?? ""),
              apellido_paterno: String(row["APELLIDO PATERNO"] ?? ""),
              apellido_paterno_apo: String(row["PATERNO - APO"] ?? ""),
              cliente_2: String(row["CLIENTE - 2"] ?? ""),
              codigo,
              documento: row["DOCU"] != null ? String(row["DOCU"]) : null,
              documento_2: String(row["DOCU-2"] ?? ""),
              documento_tercero: String(row["DOC/TERC"] ?? ""),
              nombres_apo: String(row["NOMBRES - APO"] ?? ""),
              numero_documento: String(row["NRO DOCU"] ?? ""),
              tipo_cliente: tipoCliente,
              tipo_documento: String(row["Tdocu"] ?? ""),
              tipo_documento_cliente: String(row["TIP DOCU"] ?? ""),
              tipo_tercero: String(row["TIP/TERC"] ?? ""),
              rol_id: 3,
            },
          });
        } catch (error: any) {
          // 4. Capturar y acumular errores
          console.log(error)
          if (error.code === "P2002") {
            errores.push({
              codigo,
              mensaje: `El email '${email}' ya existe.`,
            });
          } else {
            errores.push({
              codigo,
              mensaje: `Error al crear el usuario: ${error.message}`,
            });
          }
        }
      }
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    if (errores.length > 0) {
      console.log("NO SE PUDIERON IMPORTAR LOS USUARIOS")
      return res.status(400).json({
        mensaje: "Algunos usuarios no pudieron importarse.",
        errores,
      });
    }

    return res.status(200).json({
      mensaje: "Usuarios importados correctamente.",
    });
  }
];
*/
export const importarUsuariosHandler = async (req: Request, res: Response): Promise<any> => {


  const errores: { fila: string; mensaje: string }[] = [];


  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      console.log("Archivo no encontrado")
      return res.status(400).json({ error: "Archivo no encontrado" });
    }

    const workbook = XLSX.read(fileBuffer);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(hoja, { defval: "" });

    for (const row of rows) {
      const codigo = String(row["CODIGO"] ?? ""); // Para el reporte de errores
      const tipoCliente =
        String(row["TIP/CLI"] ?? "")
          .toLowerCase()
          .includes("jurídica") ||
          String(row["TIP/CLI"] ?? "")
            .toLowerCase()
            .includes("juridica")
          ? "persona_juridica"
          : "persona_natural";

      const email = String(
        row["CORREO"]
      );

      if (email === "") {
        errores.push({
          fila: row["CODIGO"],
          mensaje: `En el cliente ${row["CODIGO"]} tiene el email vacío '${email}' , no se a creado el usuario.`,
        });
        continue;
      }

      const password = await bcrypt.hash("123456", 10);
      console.log(row["CLIENTE"])
      try {
        // 3. Intentar crear el usuario
        await prisma.usuario.create({
          data: {
            nombres: String(row["NOMBRES"]),
            email,
            password,
            cliente: String(row["CLIENTE"] ?? ""),
            departamento: String(row["DEPARTAMENTO"] ?? ""),
            direccion: String(row["DIRECCION"] ?? ""),
            distrito: String(row["DISTRITO"] ?? ""),
            nacionalidad: String(row["NACIONALID"] ?? ""),
            observacion: String(row["OBSERVACION"] ?? ""),
            ocupacion: String(row["OCUPACION"] ?? ""),
            otro:
              row["Otro"] !== undefined && row["Otro"] !== null
                ? String(row["Otro"])
                : null,
            provincia: String(row["PROVINCIA"] ?? ""),
            telefono: String(row["TELEFONO"] ?? ""),
            tercero: String(row["TERCERO"] ?? ""),
            vigente: String(row["VIGENTE"] ?? ""),
            apellido_materno: String(row["APELLIDO MATERNO"] ?? ""),
            apellido_materno_apo: String(row["MATERNO - APO"] ?? ""),
            apellido_paterno: String(row["APELLIDO PATERNO"] ?? ""),
            apellido_paterno_apo: String(row["PATERNO - APO"] ?? ""),
            cliente_2: String(row["CLIENTE - 2"] ?? ""),
            codigo,
            documento: row["DOCU"] != null ? String(row["DOCU"]) : null,
            documento_2: String(row["DOCU-2"] ?? ""),
            documento_tercero: String(row["DOC/TERC"] ?? ""),
            nombres_apo: String(row["NOMBRES - APO"] ?? ""),
            numero_documento: String(row["NRO DOCU"] ?? ""),
            tipo_cliente: tipoCliente,
            tipo_documento: String(row["Tdocu"] ?? ""),
            tipo_documento_cliente: String(row["TIP DOCU"] ?? ""),
            tipo_tercero: String(row["TIP/TERC"] ?? ""),
            rol_id: 3,
          },
        });
      } catch (error: any) {
        // 4. Capturar y acumular errores
        console.log(error)
        const fila = row["CODIGO"] ?? "Sin código";
        const cliente = row["CLIENTE"] ?? "Sin nombre";

        let mensajeError = "";

        if (error.code === "P2002") {
          mensajeError = `El codigo '${fila}' ya está registrado.`;
        } else if (error.code === "P2003") {
          mensajeError = `Error de relación referencial (foreign key) al crear el usuario con código ${fila}.`;
        } else if (error.code === "P2025") {
          mensajeError = `Registro relacionado no encontrado al crear usuario con código ${fila}.`;
        } else if (error.name === "PrismaClientValidationError") {
          mensajeError = `Error de validación de datos al crear usuario con código ${fila}. Verifica los nombres y tipos de las columnas.`;
        } else {
          mensajeError = `Error inesperado al crear usuario '${cliente}' con código ${fila}`;
        }
        guardarError(mensajeError);
        errores.push({
          fila,
          mensaje: mensajeError,
        });
      }
    }
    if (errores.length > 0) {
      console.log("NO SE PUDIERON IMPORTAR LOS USUARIOS")
      return res.status(400).json({
        errores
      })
      /*
      return res.status(400).json({
        mensaje: "Algunos usuarios no pudieron importarse.",
        errores,
      });
      */
    }
  } catch (err: any) {
    console.log(err);
    if (errores.length > 0) {
      console.log("NO SE PUDIERON IMPORTAR LOS USUARIOS")
      return res.status(400).json({
        errores
      })
      /*
      return res.status(400).json({
        mensaje: "Algunos usuarios no pudieron importarse.",
        errores,
      });
      */
    }
    return res.status(500).json({ error: "Error al procesar el archivo" });
  } finally {
    prisma.$disconnect()
  }
  return res.status(200).json({
    mensaje: "Usuarios importados correctamente.",
  });
}

