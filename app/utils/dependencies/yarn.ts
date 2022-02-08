import { parseYarnOrNull } from "./helper";

export function getDependenciesYarn(text: string) {
  const parsed = parseYarnOrNull(text);
  if (parsed == null) return [];
  return Object.keys(parsed.object).map((nameWithVersion: string) => {
    const splitted = nameWithVersion.split("@");
    return splitted.length == 3 ? `@${splitted[1]}` : splitted[0];
  });
}
