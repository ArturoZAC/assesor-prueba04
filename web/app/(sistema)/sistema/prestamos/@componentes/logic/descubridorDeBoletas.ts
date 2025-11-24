export function descubridorDeBoletas(factura: string): string {
  if (factura.includes('F')) {
    return 'factura'
  }
  else {
    return 'boleta'
  }
}