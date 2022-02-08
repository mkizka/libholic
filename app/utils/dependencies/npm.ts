import { parseJsonOrNull } from "./helper";

export function getDependenciesPackage(text: string) {
  const parsed = parseJsonOrNull(text);
  if (parsed == null) return [];
  return [
    ...Object.keys(parsed.dependencies || {}),
    ...Object.keys(parsed.devDependencies || {}),
  ];
}

export function getDependenciesLock(text: string) {
  const parsed = parseJsonOrNull(text);
  if (parsed == null) return [];
  return [...Object.keys(parsed.dependencies || {})];
}
