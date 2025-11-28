import app from "./server";
import express from "express";
import prisma from "./config/database";
import { ENV } from "./config/config";
import cookieParser from "cookie-parser";

import userRoutes from "../src/routes/user.routes";
import clientesRoutes from "../src/routes/clientes.routes";
import authRoutes from "../src/routes/auth.routes";
import operacionesRoutes from "../src/routes/operaciones/operaciones.routes";
import gastosRoutes from "../src/routes/gastos.routes";
import prestamosRoutes from "./routes/prestamos/prestamos.routes";
import leasingRoutes from "./routes/leasing/leasing.routes";
import cuadreLeasingRoutes from "./routes/leasing/cuadreleasing.routes";
import facturacionRoutes from "./routes/facturacion/facturacion.routes";
import cuadrePrestamosRoutes from "./routes/prestamos/cuadreprestamos.routes";
import cuadreFacturacionRoutes from "./routes/facturacion/cuadrefacturacion.routes";
import flujoRoutes from "./routes/flujo/flujo.routes";
import flujoDivisasRoutes from "./routes/flujo/flujo-divisas.routes";
import flujoPorcentajesRoutes from "./routes/flujo/flujo-porcentaje.routes";
import flujoRealTotalRoutes from "./routes/flujo/flujo-real-total.routes";
import flujoPrestamosRoutes from "./routes/flujo/flujo-prestamos.routes";
import saldosRoutes from "./routes/saldos/saldos.routes";
import flujoConsultoriaRoutes from "./routes/flujo/flujo-consultoria.routes";
import flujoLeasingRoutes from "./routes/flujo/flujo-leasing.routes";
import tipoCmabioRoutes from "./routes/tipocambio.route";
//import http from "http"
// import { verifyAdmin } from "./middlewares/JWTMiddleware";

// const HOST = '192.168.0.44'

app.use(express.static("public"));

// const server = http.createServer(app)

app.use(cookieParser());
prisma
  .$connect()
  .then(() => {
    console.log("✅ Conectado a la base de datos");

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server corriendo en http://localhost:${ENV.PORT}`);
    });

    /*
    server.listen(ENV.PORT, Number(HOST), () => {
      console.log(`🚀 Server corriendo en http://${HOST}:${ENV.PORT}`);
    })
    */
  })
  .catch((error: any) => {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1);
  });

app.use("/api", authRoutes);
app.use("/api", tipoCmabioRoutes);
/*
app.use("/api/user",verifyAdmin ,userRoutes);
app.use("/api/clientes",verifyAdmin , clientesRoutes);
app.use("/api/operaciones",verifyAdmin , operacionesRoutes);
app.use("/api/gastos",verifyAdmin , gastosRoutes);
app.use("/api/prestamos",verifyAdmin , prestamosRoutes);
app.use("/api/cuadreprestamos",verifyAdmin , cuadrePrestamosRoutes)
app.use("/api/leasing",verifyAdmin , leasingRoutes);
app.use("/api/cuadreleasing",verifyAdmin , cuadreLeasingRoutes)
app.use("/api/facturacion",verifyAdmin , facturacionRoutes);
app.use("/api/cuadrefacturacion",verifyAdmin , cuadreFacturacionRoutes)
app.use("/api/flujo",verifyAdmin , flujoRoutes)
app.use("/api/flujo-divisas",verifyAdmin , flujoDivisasRoutes)
app.use("/api/flujo-porcentaje",verifyAdmin , flujoPorcentajesRoutes)
app.use("/api/flujo-real-total",verifyAdmin , flujoRealTotalRoutes)
app.use("/api/flujo-prestamos",verifyAdmin , flujoPrestamosRoutes)
app.use("/api/saldos",verifyAdmin , saldosRoutes)
app.use("/api/flujo-consultoria",verifyAdmin , flujoConsultoriaRoutes)
app.use("/api/flujo-leasing",verifyAdmin , flujoLeasingRoutes)
*/

app.use("/api/user", userRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/operaciones", operacionesRoutes);
app.use("/api/gastos", gastosRoutes);
app.use("/api/prestamos", prestamosRoutes);
app.use("/api/cuadreprestamos", cuadrePrestamosRoutes);
app.use("/api/leasing", leasingRoutes);
app.use("/api/cuadreleasing", cuadreLeasingRoutes);
app.use("/api/facturacion", facturacionRoutes);
app.use("/api/cuadrefacturacion", cuadreFacturacionRoutes);
app.use("/api/flujo", flujoRoutes);
app.use("/api/flujo-divisas", flujoDivisasRoutes);
app.use("/api/flujo-porcentaje", flujoPorcentajesRoutes);
app.use("/api/flujo-real-total", flujoRealTotalRoutes);
app.use("/api/flujo-prestamos", flujoPrestamosRoutes);
app.use("/api/saldos", saldosRoutes);
app.use("/api/flujo-consultoria", flujoConsultoriaRoutes);
app.use("/api/flujo-leasing", flujoLeasingRoutes);
