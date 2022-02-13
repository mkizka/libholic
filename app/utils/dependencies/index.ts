import { requestGraphql, RequestGraphqlResult } from "../graphql";
import { flatten } from "../helper";
import { getTargets, getDependencies } from "./getters";

function fileToRepo(filename: string) {
  return ({ repoUrl, content }: RequestGraphqlResult["files"][0]) => {
    const data =
      content != null
        ? getDependencies(filename, content)
        : { dependencies: [], error: "ファイルが見つかりませんでした" };
    return {
      filename,
      url: repoUrl,
      ...data,
    };
  };
}

function targetToGraphqlResponse(login: string) {
  return async (filename: string) => {
    const { rateLimit, files } = await requestGraphql({ login, filename });
    return { rateLimit, repos: files.map(fileToRepo(filename)) };
  };
}

export async function getDependenciesUser({
  login,
  lockfile,
}: {
  login: string;
  lockfile: boolean;
}) {
  const promises = getTargets(lockfile).map(targetToGraphqlResponse(login));
  const responsePerTarget = await Promise.all(promises);
  const repos = flatten(responsePerTarget.map((response) => response.repos));
  const rateLimit = responsePerTarget.sort(
    (a, b) => a.rateLimit.remaining - b.rateLimit.remaining
  )[0].rateLimit;
  return { repos, rateLimit };
}
