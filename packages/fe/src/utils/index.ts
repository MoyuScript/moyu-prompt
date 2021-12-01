export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor(((duration / 1000) % 60));

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
