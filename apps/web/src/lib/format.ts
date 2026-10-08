export function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

export function readingTime(content: string) {
  const minutes = Math.max(1, Math.round(content.length / 400));
  return `约 ${minutes} 分钟`;
}
