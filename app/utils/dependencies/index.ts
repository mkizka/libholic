import { getDependenciesPackage, getDependenciesLock } from "./npm";
import { getDependenciesPnpm } from "./pnpm";
import { getDependenciesYarn } from "./yarn";

const getters: Record<string, (text: string) => string[]> = {
  "package.json": getDependenciesPackage,
  "package-lock.json": getDependenciesLock,
  "yarn.lock": getDependenciesYarn,
  "pnpm-lock.yaml": getDependenciesPnpm,
};

function getDependencies(filename: string, text: string) {
  if (filename in getters) {
    return getters[filename](text);
  }
  return null;
}

export function getDependenciesAll(filename: string, texts: string[]) {
  return texts.reduce((result, text) => {
    const deps = getDependencies(filename, text) || [];
    result.push(...deps);
    return result;
  }, [] as string[]);
}

export function getTargetFilenames(lockfile: boolean) {
  const [pkgfile, ...lockfiles] = Object.keys(getters);
  return lockfile ? lockfiles : [pkgfile];
}
