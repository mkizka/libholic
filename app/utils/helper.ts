export function aggregate(names: string[]) {
  const temp = names.reduce((result, name) => {
    if (name in result) {
      result[name] += 1;
    } else {
      result[name] = 1;
    }
    return result;
  }, {} as Record<string, number>);
  return Object.entries(temp).map(([name, count]) => {
    return { name, count };
  });
}

export function flatten<T>(array: T[][]) {
  return array.reduce((result, arr) => {
    result.push(...arr);
    return result;
  }, [] as T[]);
}
