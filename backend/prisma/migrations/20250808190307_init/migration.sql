-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` CHAR(36) NOT NULL,
    `nombres` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT false,
    `cliente` VARCHAR(255) NULL,
    `departamento` VARCHAR(100) NULL,
    `direccion` VARCHAR(255) NULL,
    `distrito` VARCHAR(100) NULL,
    `nacionalidad` VARCHAR(100) NULL,
    `observacion` TEXT NULL,
    `ocupacion` VARCHAR(100) NULL,
    `otro` VARCHAR(100) NULL,
    `provincia` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `tercero` VARCHAR(255) NULL,
    `vigente` VARCHAR(50) NULL,
    `apellido_materno` VARCHAR(100) NULL,
    `apellido_materno_apo` VARCHAR(100) NULL,
    `apellido_paterno` VARCHAR(100) NULL,
    `apellido_paterno_apo` VARCHAR(100) NULL,
    `cliente_2` VARCHAR(255) NULL,
    `codigo` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `documento` VARCHAR(100) NULL,
    `documento_2` VARCHAR(100) NULL,
    `documento_tercero` VARCHAR(100) NULL,
    `nombres_apo` VARCHAR(255) NULL,
    `numero_documento` VARCHAR(50) NULL,
    `rol_id` INTEGER NOT NULL DEFAULT 1,
    `tipo_cliente` VARCHAR(100) NULL,
    `tipo_documento` VARCHAR(50) NULL,
    `tipo_documento_cliente` VARCHAR(100) NULL,
    `tipo_tercero` VARCHAR(100) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `usuarios_rol_id_fkey`(`rol_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    INDEX `password_reset_tokens_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_cambio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `precioCompra` DECIMAL(10, 4) NOT NULL,
    `precioVenta` DECIMAL(10, 4) NOT NULL,
    `moneda` VARCHAR(10) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `intervaloCompra` DECIMAL(10, 4) NOT NULL,
    `intervaloVenta` DECIMAL(10, 4) NOT NULL,
    `middlePrice` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `operaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `numero` INTEGER NOT NULL,
    `tipo` ENUM('COMPRA', 'VENTA') NOT NULL,
    `t` VARCHAR(191) NOT NULL DEFAULT '',
    `dolares` DOUBLE NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipoCambioId` INTEGER NOT NULL,
    `flujoFondosId` INTEGER NOT NULL,
    `rendimientoId` INTEGER NULL,
    `movimientoId` INTEGER NOT NULL,
    `saldoFinalId` INTEGER NULL,
    `resultadoId` INTEGER NULL,

    UNIQUE INDEX `operaciones_numero_key`(`numero`),
    UNIQUE INDEX `operaciones_tipoCambioId_key`(`tipoCambioId`),
    UNIQUE INDEX `operaciones_flujoFondosId_key`(`flujoFondosId`),
    UNIQUE INDEX `operaciones_rendimientoId_key`(`rendimientoId`),
    UNIQUE INDEX `operaciones_movimientoId_key`(`movimientoId`),
    UNIQUE INDEX `operaciones_saldoFinalId_key`(`saldoFinalId`),
    UNIQUE INDEX `operaciones_resultadoId_key`(`resultadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuadre_op` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `operacionId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cuadre_op_operacionId_key`(`operacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuadre_op_dolares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadreOperacionId` INTEGER NOT NULL,
    `fecha_usd` DATETIME(3) NOT NULL,
    `descripcion_op_usd` VARCHAR(500) NOT NULL,
    `monto_usd` DOUBLE NOT NULL,
    `referencia_usd` VARCHAR(500) NOT NULL,
    `diferencia_usd` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuadre_op_soles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadreOperacionId` INTEGER NOT NULL,
    `fecha_pen` DATETIME(3) NOT NULL,
    `descripcion_op_pen` VARCHAR(500) NOT NULL,
    `monto_pen` DOUBLE NOT NULL,
    `referencia_pen` VARCHAR(500) NOT NULL,
    `diferencia_pen` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_tipocambio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compra` DOUBLE NOT NULL,
    `venta` DOUBLE NOT NULL,
    `spread` DOUBLE NOT NULL,
    `promedio` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_flujofondos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montoUSD` DOUBLE NOT NULL,
    `montoPEN` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_rendimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `forzado` DOUBLE NOT NULL,
    `medio` DOUBLE NOT NULL,
    `esperado` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_movimientofondos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compraUSD` DOUBLE NOT NULL,
    `ventaUSD` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_saldofinal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `montoUSD` DOUBLE NOT NULL,
    `montoPEN` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `op_resultado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `simple` DOUBLE NOT NULL,
    `estricto` DOUBLE NOT NULL,
    `potencial` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoCambioMes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `mes` INTEGER NOT NULL,
    `anio` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gasto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `referencia` VARCHAR(191) NULL,
    `tipoMoneda` VARCHAR(191) NOT NULL DEFAULT 'PEN',
    `clase` VARCHAR(191) NULL,
    `concepto` VARCHAR(191) NULL,
    `tipoGasto` ENUM('MANTENIMIENTO', 'FUNCIONAMIENTO', 'PERSONAL', 'DIVERSOS_OPERATIVOS', 'IMPUESTOS', 'INTERESES_RENTA_SEGUNDA', 'OVERNIGHT_BCP', 'ITF', 'PRESTAMOS_SIN_INTERES', 'PERSONAL_PERSONAS', 'GASTO_LEASING', 'GASTO_PRESTAMO', 'OTROS_GASTOS', 'OTROS_GASTOS_1', 'OTROS_GASTOS_2', 'OTROS_GASTOS_3', 'OTROS_GASTOS_4', 'OTROS_GASTOS_5', 'OTROS_GASTOS_6', 'OTROS_GASTOS_7') NOT NULL,
    `isRecopilado` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestamo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_operacion` INTEGER NOT NULL DEFAULT 1,
    `numero_prestamo` VARCHAR(191) NULL,
    `capital_soles` DECIMAL(10, 2) NULL,
    `capital_dolares` DECIMAL(10, 2) NULL,
    `moneda` ENUM('US$', 'S/.') NOT NULL,
    `tasa` DOUBLE NOT NULL,
    `devolucion` DATETIME(3) NOT NULL,
    `fechaInicial` DATETIME(3) NOT NULL,
    `dias` INTEGER NOT NULL,
    `estatus` ENUM('PAGADO', 'PENDIENTE', 'A PLAZO') NOT NULL DEFAULT 'PENDIENTE',
    `interes` DECIMAL(10, 2) NOT NULL,
    `cobroTotal` DECIMAL(10, 2) NOT NULL,
    `tc` DECIMAL(10, 2) NOT NULL,
    `potencial` DECIMAL(10, 2) NOT NULL,
    `igv` DECIMAL(10, 2) NOT NULL,
    `rendimiento` DECIMAL(10, 2) NOT NULL,
    `ganancia` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `cuadre` DECIMAL(10, 2) NULL DEFAULT 0,
    `detraccion` DECIMAL(10, 2) NOT NULL,
    `factura` VARCHAR(191) NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `codigoFacturaBoleta` VARCHAR(191) NULL,
    `tipo` VARCHAR(20) NOT NULL DEFAULT 'BOLETA',
    `esAntiguo` BOOLEAN NOT NULL DEFAULT false,

    INDEX `op_prestamo_usuarioId_fkey`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestamo_anulados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigoFacturaBoleta` VARCHAR(191) NOT NULL,
    `factura` VARCHAR(191) NOT NULL,
    `prestamoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pres_cuadre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prestamoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pres_cuadre_prestamoId_key`(`prestamoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pres_pagos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadrePrestamoId` INTEGER NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `moonto` DECIMAL(10, 2) NOT NULL,
    `diferencia` DECIMAL(10, 2) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pres_devoluciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadrePrestamoId` INTEGER NOT NULL,
    `deposito` VARCHAR(191) NOT NULL,
    `pagado` DECIMAL(10, 2) NOT NULL,
    `tc` INTEGER NULL,
    `montoFinal` DECIMAL(10, 2) NOT NULL,
    `referencia` INTEGER NULL,
    `diferencia` DECIMAL(10, 2) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leasing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` VARCHAR(191) NOT NULL,
    `codSer` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `numero_actual` INTEGER NOT NULL DEFAULT 0,
    `numero_leasing` VARCHAR(191) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `fecha_inicial` DATETIME(3) NOT NULL,
    `fecha_final` DATETIME(3) NOT NULL,
    `dias` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'BOLETA',
    `estatus` ENUM('PAGADO', 'PENDIENTE', 'A PLAZO') NOT NULL DEFAULT 'PENDIENTE',
    `cobroTotal` DECIMAL(10, 2) NOT NULL,
    `tc` DECIMAL(10, 2) NOT NULL,
    `potencial` DECIMAL(10, 2) NOT NULL,
    `igv` DECIMAL(10, 2) NOT NULL,
    `rendimiento` DECIMAL(10, 2) NOT NULL,
    `detraccion` DECIMAL(10, 2) NOT NULL,
    `codigoFacturaBoleta` VARCHAR(191) NULL,
    `descripcion` LONGTEXT NULL,
    `factura` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lea_anulados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigoFacturaBoleta` VARCHAR(191) NOT NULL,
    `factura` VARCHAR(191) NOT NULL,
    `leasingId` INTEGER NOT NULL,
    `prestamoOperacionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lea_cuadre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `leasingId` INTEGER NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lea_cuadre_leasingId_key`(`leasingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lea_pago_realizado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cuadreLeasingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lea_detraccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deposito` VARCHAR(191) NOT NULL,
    `pagado` DECIMAL(10, 2) NOT NULL,
    `tc` INTEGER NULL,
    `montoFinal` DECIMAL(10, 2) NOT NULL,
    `referencia` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diferencia` DECIMAL(10, 2) NOT NULL,
    `cuadreLeasingRealizadoId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lea_detraccion_cuadreLeasingRealizadoId_key`(`cuadreLeasingRealizadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lea_pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deposito` VARCHAR(191) NOT NULL,
    `pagado` DECIMAL(10, 2) NOT NULL,
    `tc` INTEGER NULL,
    `montoFinal` DECIMAL(10, 2) NOT NULL,
    `referencia` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diferencia` DECIMAL(10, 2) NOT NULL,
    `cuadreLeasingRealizadoId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `lea_pago_cuadreLeasingRealizadoId_key`(`cuadreLeasingRealizadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facturacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unit` DECIMAL(10, 2) NOT NULL,
    `glosa` MEDIUMTEXT NOT NULL,
    `op` INTEGER NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    `accion` VARCHAR(20) NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `tc` DECIMAL(10, 2) NOT NULL,
    `entrega` DECIMAL(10, 2) NOT NULL,
    `m1` VARCHAR(20) NOT NULL,
    `recibe` DECIMAL(10, 2) NOT NULL,
    `m2` VARCHAR(20) NOT NULL,
    `operacionId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `facturacion_operacionId_key`(`operacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fact_cuadre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `difFecha` VARCHAR(191) NOT NULL,
    `difMonto` VARCHAR(191) NOT NULL,
    `difDocumento` VARCHAR(191) NOT NULL,
    `facturacionId` INTEGER NOT NULL,
    `fechaCuadre` VARCHAR(191) NOT NULL,
    `docCuadre` VARCHAR(191) NOT NULL,
    `numeroCuadre` VARCHAR(191) NOT NULL,
    `clienteCuadre` VARCHAR(191) NOT NULL,
    `rucCuadre` VARCHAR(191) NOT NULL,
    `vendedorCuadre` VARCHAR(191) NULL,
    `subtotalCuadre` DECIMAL(10, 2) NOT NULL,
    `igvCuadre` DECIMAL(10, 2) NULL,
    `totalCuadre` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gast_recopilacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `gastoId` INTEGER NULL,
    `mes` INTEGER NOT NULL,
    `anio` INTEGER NOT NULL,
    `tipo_gasto` ENUM('MANTENIMIENTO', 'FUNCIONAMIENTO', 'PERSONAL', 'DIVERSOS_OPERATIVOS', 'IMPUESTOS', 'INTERESES_RENTA_SEGUNDA', 'OVERNIGHT_BCP', 'ITF', 'PRESTAMOS_SIN_INTERES', 'PERSONAL_PERSONAS', 'GASTO_LEASING', 'GASTO_PRESTAMO', 'OTROS_GASTOS', 'OTROS_GASTOS_1', 'OTROS_GASTOS_2', 'OTROS_GASTOS_3', 'OTROS_GASTOS_4', 'OTROS_GASTOS_5', 'OTROS_GASTOS_6', 'OTROS_GASTOS_7') NOT NULL,

    UNIQUE INDEX `gast_recopilacion_gastoId_key`(`gastoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flujo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia` INTEGER NOT NULL,
    `mes` INTEGER NULL,
    `anio` INTEGER NULL,
    `monto` DOUBLE NULL,
    `tc` DOUBLE NOT NULL,
    `tipoFlujo` ENUM('PRESUPUESTO', 'REAL_TOTAL', 'REAL_DIVISA', 'REAL_PRESTAMO', 'CONSULTORIA', 'LEASING') NOT NULL,
    `ingresos` DOUBLE NULL,
    `ingresosPorDivisas` DOUBLE NULL,
    `ingresosPorPrestamos` DOUBLE NULL,
    `ingresosPorLeasing` DOUBLE NULL,
    `interesesPorInversion` DOUBLE NULL,
    `consultoria` DOUBLE NULL,
    `gastos` DOUBLE NULL,
    `personalTotal` DOUBLE NULL,
    `cts` DOUBLE NULL,
    `eps` DOUBLE NULL,
    `serviciosOperativos` DOUBLE NULL,
    `internet` DOUBLE NULL,
    `oficina` DOUBLE NULL,
    `celular` DOUBLE NULL,
    `factElectronica` DOUBLE NULL,
    `contabilidad` DOUBLE NULL,
    `gestionRiesgo` DOUBLE NULL,
    `marketingComercial` DOUBLE NULL,
    `servciosStaff` DOUBLE NULL,
    `combustible` DOUBLE NULL,
    `alquilerVehiculos` DOUBLE NULL,
    `gastosExtras` DOUBLE NULL,
    `viajesEventosOtros` DOUBLE NULL,
    `gastosBancarios` DOUBLE NULL,
    `itfSoles` DOUBLE NULL,
    `itfDolares` DOUBLE NULL,
    `mantSoles` DOUBLE NULL,
    `mantDolares` DOUBLE NULL,
    `interbancarioSoles` DOUBLE NULL,
    `interbancariosDolares` DOUBLE NULL,
    `serviciosFondos` DOUBLE NULL,
    `interesFondosSoles` DOUBLE NULL,
    `interesFondosDolares` DOUBLE NULL,
    `otrosGastosTotal` DOUBLE NULL,
    `impuestosDetracciones` DOUBLE NULL,
    `otrosGastos` DOUBLE NULL,
    `utilidadOperativa` DOUBLE NULL,
    `impuestos` DOUBLE NULL,
    `utilidadNeta` DOUBLE NULL,
    `flujoCaja` DOUBLE NULL,
    `capitalTrabajo` DOUBLE NULL,
    `flujoCajaLibre` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flujo_porcentaje` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anio` INTEGER NOT NULL,
    `porcentajePersonal` DOUBLE NULL,
    `porcentajeServicios` DOUBLE NULL,
    `porcentajeServiciosStaff` DOUBLE NULL,
    `porcentajeGastosBancarios` DOUBLE NULL,
    `porcentajeServiciosFondos` DOUBLE NULL,
    `porcentajeOtrosGastos` DOUBLE NULL,
    `porcentajeImpuestos` DOUBLE NULL,
    `tipoFlujo` ENUM('PRESUPUESTO', 'REAL_TOTAL', 'REAL_DIVISA', 'REAL_PRESTAMO', 'CONSULTORIA', 'LEASING') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flujo_pers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `monto` DOUBLE NOT NULL,
    `anio` INTEGER NOT NULL,
    `mes` INTEGER NOT NULL,
    `flujoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `operaciones_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_tipocambio` FOREIGN KEY (`tipoCambioId`) REFERENCES `op_tipocambio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_flujofondos` FOREIGN KEY (`flujoFondosId`) REFERENCES `op_flujofondos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_rendimiento` FOREIGN KEY (`rendimientoId`) REFERENCES `op_rendimiento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_movimiento` FOREIGN KEY (`movimientoId`) REFERENCES `op_movimientofondos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_saldofinal` FOREIGN KEY (`saldoFinalId`) REFERENCES `op_saldofinal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `operaciones` ADD CONSTRAINT `fk_operacion_resultado` FOREIGN KEY (`resultadoId`) REFERENCES `op_resultado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cuadre_op` ADD CONSTRAINT `cuadre_op_operacionId_fkey` FOREIGN KEY (`operacionId`) REFERENCES `operaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cuadre_op_dolares` ADD CONSTRAINT `cuadre_op_dolares_cuadreOperacionId_fkey` FOREIGN KEY (`cuadreOperacionId`) REFERENCES `cuadre_op`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cuadre_op_soles` ADD CONSTRAINT `cuadre_op_soles_cuadreOperacionId_fkey` FOREIGN KEY (`cuadreOperacionId`) REFERENCES `cuadre_op`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestamo` ADD CONSTRAINT `prestamo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prestamo_anulados` ADD CONSTRAINT `prestamo_anulados_prestamoId_fkey` FOREIGN KEY (`prestamoId`) REFERENCES `prestamo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pres_cuadre` ADD CONSTRAINT `pres_cuadre_prestamoId_fkey` FOREIGN KEY (`prestamoId`) REFERENCES `prestamo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pres_pagos` ADD CONSTRAINT `pres_pagos_cuadrePrestamoId_fkey` FOREIGN KEY (`cuadrePrestamoId`) REFERENCES `pres_cuadre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pres_devoluciones` ADD CONSTRAINT `pres_devoluciones_cuadrePrestamoId_fkey` FOREIGN KEY (`cuadrePrestamoId`) REFERENCES `pres_cuadre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leasing` ADD CONSTRAINT `leasing_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_anulados` ADD CONSTRAINT `lea_anulados_leasingId_fkey` FOREIGN KEY (`leasingId`) REFERENCES `leasing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_anulados` ADD CONSTRAINT `lea_anulados_prestamoOperacionId_fkey` FOREIGN KEY (`prestamoOperacionId`) REFERENCES `prestamo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_cuadre` ADD CONSTRAINT `lea_cuadre_leasingId_fkey` FOREIGN KEY (`leasingId`) REFERENCES `leasing`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_pago_realizado` ADD CONSTRAINT `lea_pago_realizado_cuadreLeasingId_fkey` FOREIGN KEY (`cuadreLeasingId`) REFERENCES `lea_cuadre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_detraccion` ADD CONSTRAINT `lea_detraccion_cuadreLeasingRealizadoId_fkey` FOREIGN KEY (`cuadreLeasingRealizadoId`) REFERENCES `lea_pago_realizado`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lea_pago` ADD CONSTRAINT `lea_pago_cuadreLeasingRealizadoId_fkey` FOREIGN KEY (`cuadreLeasingRealizadoId`) REFERENCES `lea_pago_realizado`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturacion` ADD CONSTRAINT `facturacion_operacionId_fkey` FOREIGN KEY (`operacionId`) REFERENCES `operaciones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturacion` ADD CONSTRAINT `facturacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fact_cuadre` ADD CONSTRAINT `fact_cuadre_facturacionId_fkey` FOREIGN KEY (`facturacionId`) REFERENCES `facturacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gast_recopilacion` ADD CONSTRAINT `gast_recopilacion_gastoId_fkey` FOREIGN KEY (`gastoId`) REFERENCES `gasto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flujo_pers` ADD CONSTRAINT `flujo_pers_flujoId_fkey` FOREIGN KEY (`flujoId`) REFERENCES `flujo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
