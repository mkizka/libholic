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

const env = getEnv(["GITHUB_TOKEN"]);

export { env };
