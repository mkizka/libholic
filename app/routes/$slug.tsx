import { json, LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";

import { getDependenciesUser } from "~/utils/dependencies";
import { aggregate } from "~/utils/helper";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug != undefined);
  const { rateLimit, dependencies } = await getDependenciesUser(params.slug);
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
