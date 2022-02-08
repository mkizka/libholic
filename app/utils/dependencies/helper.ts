import yaml from "js-yaml";
// @ts-ignore
import { parse as yarnParse } from "parse-yarn-lockfile";

export function parseJsonOrNull(text: string) {
  try {
    return JSON.parse(text) as Record<string, any>;
  } catch {
    return null;
  }
}

export function parseYamlOrNull(text: string) {
  try {
    return yaml.load(text) as Record<string, any>;
  } catch {
    return null;
  }
}

export function parseYarnOrNull(text: string) {
  try {
    return yarnParse(text) as Record<string, any>;
  } catch {
    return null;
  }
}
