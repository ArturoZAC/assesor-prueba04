export function extraerIdYouTube (url: string): string | null {
  // URL tradicional: youtube.com/watch?v=VIDEO_ID
  let match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
  if (match) {
    return match[1]
  }

  // URL corta: youtu.be/VIDEO_ID
  match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return match[1]
  }

  // URL de video incrustado: youtube.com/embed/VIDEO_ID
  match = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return match[1]
  }

  // URL de video incrustado con wwww: www.youtube.com/embed/VIDEO_ID
  match = url.match(/www.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return match[1]
  }

  // URL de video incrustado con https: https://www.youtube.com/embed/VIDEO_ID
  match = url.match(/https:\/\/www.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return match[1]
  }

  return null // URL no válida o ID no encontrado
}
