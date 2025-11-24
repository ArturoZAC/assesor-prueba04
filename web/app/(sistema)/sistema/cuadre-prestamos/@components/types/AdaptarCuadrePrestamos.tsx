
export const adaptarPrestamosCuadre = (data: PrestamoOperacion[]) => {

  return data.map((pres) => {
    const usuario = pres.usuario ?? null;
    const cuadre = pres.cuadrePrestamo?.[0] ?? null;
    const salida = cuadre?.salidasPrestamo?.[0] ?? null;
    const devolucion = cuadre?.devolucionesPrestamo?.[0] ?? null;

    return {
      id: pres.id ?? null,
      fecha: pres.fechaInicial ?? null,
      cliente: usuario ? `${usuario.nombres ?? ''} ${usuario.apellido_paterno ?? ''}`.trim() : null,
      tipo_documento: usuario?.tipo_documento?.toUpperCase?.() ?? null,
      documento: usuario?.documento ?? null,
      numero_prestamo: pres.numero_prestamo ?? null,

      descripcion: salida?.descripcion ?? null,
      capital_soles: pres.capital_soles ?? null,
      capital_dolares: pres.capital_dolares ?? null,
      interes: pres.interes ?? null,
      montoTotal: pres.cobroTotal ?? null,

      fecha_salida: salida?.fecha ?? null,
      monto_sal: salida?.moonto ?? null,
      diferencia_sal: (() => {
        let current = Number(pres.capital_dolares || 0) + Number(pres.capital_soles || 0);

        
        pres.cuadrePrestamo?.forEach((cuadre) => {

          
          cuadre.salidasPrestamo?.forEach((salida) => {
            current = Math.abs(current) - Math.abs(Number(salida.moonto));
          });

        });
        return Number(-(current).toFixed(2));
      })(), // salida?.diferencia ?? null,

      fecha_dev: devolucion?.fecha ?? null,
      descripcion_dev: devolucion?.deposito ?? null,
      pagado_dev: devolucion?.pagado ?? null,
      tc_dev: devolucion?.tc ?? null,
      monto_final_dev: devolucion?.montoFinal ?? null,
      referencia_dev: devolucion?.referencia ?? null,
      diferencia_dev: (() => {
        let current = Number(pres.cobroTotal);

        
        pres.cuadrePrestamo?.forEach((cuadre) => {

          
          cuadre.devolucionesPrestamo?.forEach((devolucion) => {
            current = Math.abs(current) - Math.abs(Number(devolucion.montoFinal));
          });

        });
        return Number(-(current).toFixed(2));
      })(),

      resaltarFila: {
        active: pres.cuadrePrestamo.length > 0 && pres.cuadrePrestamo,
        data: [{ label: 'Cuadre Prestamo' }],
      }
    };
  })

}