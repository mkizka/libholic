export function randomInt(max: number) {
  return Math.floor(Math.random() * max + 1);
}

export function choice<T>(array: T[]) {
  return array[randomInt(array.length - 1)];
}

export type PromiseType<T extends (...args: any[]) => void> =
  ReturnType<T> extends Promise<infer U> ? U : never;

export function cacheControl(time: number) {
  return {
    "Cache-Control": `max-age=0, s-maxage=${time}, stale-while-revalidate=${time}`,
  };
}

function getEnv<T extends string>(keys: T[]) {
  return keys.reduce((result, key) => {
    if (process.env[key] === undefined) {
      throw new Error(`環境変数${key}が未設定です`);
    }
    // @ts-ignore
    result[key] = process.env[key];
    return result;
  }, {} as { [key in T]: string });
}

export const env = getEnv(["GITHUB_TOKEN"]);
