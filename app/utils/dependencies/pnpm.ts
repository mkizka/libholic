import { parseYamlOrNull } from "./helper";

export function getDependenciesPnpm(text: string): any {
  const parsed = parseYamlOrNull(text);
  if (parsed == null) return [];
  return Object.keys(parsed.packages).map((nameWithVersion: string) => {
    const splitted = nameWithVersion.split("/");
    return splitted.length == 4 ? splitted.slice(1, 3).join("/") : splitted[1];
  });
}
