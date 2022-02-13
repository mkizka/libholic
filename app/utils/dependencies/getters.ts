import invariant from "tiny-invariant";
import { parseJsonOrNull, parseYamlOrNull, parseYarnOrNull } from "./helper";

function getDependenciesPackage(text: string) {
  const parsed = parseJsonOrNull(text);
  return {
    dependencies: [
      ...Object.keys(parsed?.dependencies || {}),
      ...Object.keys(parsed?.devDependencies || {}),
    ],
    error: parsed == null ? "package.jsonのパースに失敗しました" : null,
  };
}

function getDependenciesLock(text: string) {
  const parsed = parseJsonOrNull(text);
  return {
    dependencies: [...Object.keys(parsed?.dependencies || {})],
    error: parsed == null ? "package-lock.jsonのパースに失敗しました" : null,
  };
}

function getDependenciesYarn(text: string) {
  const parsed = parseYarnOrNull(text);
  return {
    dependencies: Object.keys(parsed?.object || {}).map(
      (nameWithVersion: string) => {
        const splitted = nameWithVersion.split("@");
        return splitted.length == 3 ? `@${splitted[1]}` : splitted[0];
      }
    ),
    error: parsed == null ? "yarn.lockのパースに失敗しました" : null,
  };
}

function getDependenciesPnpm(text: string) {
  const parsed = parseYamlOrNull(text);
  return {
    dependencies: Object.keys(parsed?.packages || {}).map(
      (nameWithVersion: string) => {
        // ex: ["", "@babel", "code-frame", "7.16.7"]
        const splitted = nameWithVersion.split("/");
        return splitted.length == 4
          ? splitted.slice(1, 3).join("/")
          : splitted[1];
      }
    ),
    error: parsed == null ? "pnpm-lock.yamlのパースに失敗しました" : null,
  };
}

const getters: Record<string, typeof getDependenciesPackage> = {
  "package.json": getDependenciesPackage,
  "package-lock.json": getDependenciesLock,
  "yarn.lock": getDependenciesYarn,
  "pnpm-lock.yaml": getDependenciesPnpm,
};

export function getDependencies(filename: string, text: string) {
  invariant(filename in getters, "予期しないファイルが指定されています");
  return getters[filename](text);
}

export function getTargets(lockfile: boolean) {
  const [pkgfile, ...lockfiles] = Object.keys(getters);
  return lockfile ? lockfiles : [pkgfile];
}
