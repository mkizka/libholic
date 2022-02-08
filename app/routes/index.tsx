import { json, LoaderFunction, useLoaderData } from "remix";

import { getDependenciesAll, getTargetFilenames } from "~/utils/dependencies";
import { requestGraphql, RateLimit } from "~/utils/graphql";
import { aggregate, flatten } from "~/utils/helper";

async function getDependenciesUser(login: string) {
  const rateLimits: RateLimit[] = [];
  const promises = getTargetFilenames(true).map(async (filename) => {
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

export const loader: LoaderFunction = async ({ request }) => {
  const login = new URL(request.url).searchParams.get("q") || "mkizka";
  const { rateLimit, dependencies } = await getDependenciesUser(login);
  const data = aggregate(dependencies)
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
  return json({ rateLimit, data });
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
