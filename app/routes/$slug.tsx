import { HeadersFunction, json, LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";

import { getDependenciesUser } from "~/utils/dependencies";
import { aggregate } from "~/utils/helper";

const cacheControl = {
  "Cache-Control": "max-age=0, s-maxage=30, stale-while-revalidate=30",
};

export const headers: HeadersFunction = () => {
  return cacheControl;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug != undefined);
  const { rateLimit, dependencies } = await getDependenciesUser(params.slug);
  const data = aggregate(dependencies)
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
  return json(
    { rateLimit, data },
    {
      headers: cacheControl,
    }
  );
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
