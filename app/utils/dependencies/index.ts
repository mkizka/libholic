import { RateLimit, requestGraphql } from "../graphql";
import { flatten } from "../helper";
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
  const dependenciesPerText = texts.map(
    (text) => getDependencies(filename, text) || []
  );
  return flatten(dependenciesPerText);
}

export function getTargetFilenames(lockfile: boolean) {
  const [pkgfile, ...lockfiles] = Object.keys(getters);
  return lockfile ? lockfiles : [pkgfile];
}

export async function getDependenciesUser({
  login,
  lockfile,
}: {
  login: string;
  lockfile: boolean;
}) {
  const rateLimits: RateLimit[] = [];
  const promises = getTargetFilenames(lockfile).map(async (filename) => {
    const { rateLimit, texts } = await requestGraphql({ login, filename });
    rateLimits.push(rateLimit);
    return getDependenciesAll(
      filename,
      texts.filter((text): text is string => text != null)
    );
  });
  const dependenciesPerFilename = await Promise.all(promises);
  return {
    dependencies: flatten(dependenciesPerFilename),
    rateLimit: rateLimits.sort((a, b) => a.remaining - b.remaining)[0],
  };
}
