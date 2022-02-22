import invariant from "tiny-invariant";
import { parseJsonOrNull, parseYamlOrNull, parseYarnOrNull } from "./helper";

type Target = "dev" | "prod" | "all" | "lock";

function getDependenciesPackage(text: string, type: Omit<Target, "lock">) {
  const parsed = parseJsonOrNull(text);
  const dependencies = [];
  if (type == "all" || type == "prod") {
    dependencies.push(...Object.keys(parsed?.dependencies || {}));
  }
  if (type == "all" || type == "dev") {
    dependencies.push(...Object.keys(parsed?.devDependencies || {}));
  }
  return {
    dependencies,
    error: parsed == null ? "package.jsonのパースに失敗しました" : null,
  };
}

function getDependenciesPackageLock(text: string) {
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

function getDependenciesLock(text: string, filename: string) {
  const getters: Record<string, typeof getDependenciesPackageLock> = {
    "package-lock.json": getDependenciesPackageLock,
    "yarn.lock": getDependenciesYarn,
    "pnpm-lock.yaml": getDependenciesPnpm,
  };
  invariant(filename in getters, "予期しないファイルが指定されています");
  return getters[filename](text);
}

export function getDependencies(
  text: string,
  target: Target,
  filename: string
) {
  switch (target) {
    case "dev":
    case "prod":
    case "all":
      return getDependenciesPackage(text, target);
    case "lock":
      return getDependenciesLock(text, filename);
    default:
      throw new Error("予期しないターゲットが指定されています");
  }
}

export function getFilenames(target: Target) {
  switch (target) {
    case "dev":
    case "prod":
    case "all":
      return ["package.json"];
    case "lock":
      return ["package-lock.json", "yarn.lock", "pnpm-lock.yaml"];
  }
}
