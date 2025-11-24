export const getOriginalFilename = (filename: string): string => {
  const [baseName, ext] = filename.split(/(\.[\w\d_-]+)$/i)
  return baseName.split('_').slice(0, -1).join('_') + ext
}

export const formatName = (name: string): string => {
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Normalizar caracteres acentuados a su forma base
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^a-z0-9-]/g, '') // Eliminar caracteres especiales
}
