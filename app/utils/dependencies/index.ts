import { requestGraphql, RequestGraphqlResult } from "../graphql";
import { getDependencies, getFilenames } from "./getters";
import { Target } from "./types";

function fileToRepo(target: Target, filename: string) {
  return ({ repoUrl, content }: RequestGraphqlResult["files"][0]) => {
    const data =
      content != null
        ? getDependencies(content, target, filename)
        : { dependencies: [], error: "ファイルが見つかりませんでした" };
    return {
      filename,
      url: repoUrl,
      ...data,
    };
  };
}

export type Repo = ReturnType<ReturnType<typeof fileToRepo>>;

function filenameToGraphqlResponse(login: string, target: Target) {
  return async (filename: string) => {
    const { rateLimit, files } = await requestGraphql({ login, filename });
    return { rateLimit, repos: files.map(fileToRepo(target, filename)) };
  };
}

export async function getDependenciesUser({
  login,
  target,
}: {
  login: string;
  target: Target;
}) {
  const promises = getFilenames(target).map(
    filenameToGraphqlResponse(login, target)
  );
  const responsePerTarget = await Promise.all(promises);
  const repos = responsePerTarget.map((response) => response.repos).flat();
  const { rateLimit } = responsePerTarget.sort(
    (a, b) => a.rateLimit.remaining - b.rateLimit.remaining
  )[0];
  return { repos, rateLimit };
}

export function aggregatePkgs(repos: Repo[]) {
  const temp = repos.reduce((result, repo) => {
    for (const name of repo.dependencies) {
      if (name in result) {
        result[name].count += 1;
      } else {
        result[name] = {
          count: 1,
          repoUrls: [],
        };
      }
      if (!result[name].repoUrls.includes(repo.url)) {
        result[name].repoUrls.push(repo.url);
      }
    }
    return result;
  }, {} as Record<string, { count: number; repoUrls: string[] }>);
  return Object.entries(temp)
    .map(([name, value]) => {
      return { name, ...value };
    })
    .sort((a, b) => b.count - a.count);
}

export type AggregatedPkg = ReturnType<typeof aggregatePkgs>[0];
