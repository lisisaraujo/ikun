export function extractYouTubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : url
}
