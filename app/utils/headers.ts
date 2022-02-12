export function cacheControl(time: number) {
  return {
    "Cache-Control": `max-age=0, s-maxage=${time}, stale-while-revalidate=${time}`,
  };
}
