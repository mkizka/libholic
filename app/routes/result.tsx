import { SimpleGrid } from "@mantine/core";
import {
  HeadersFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { PkgItem } from "~/components/PkgItem";

import { getDependenciesUser } from "~/utils/dependencies";
import { RateLimit } from "~/utils/graphql";
import { aggregate } from "~/utils/helper";

const cacheControl = {
  "Cache-Control": "max-age=0, s-maxage=30, stale-while-revalidate=30",
};

export const headers: HeadersFunction = () => {
  return cacheControl;
};

type Data = {
  pkgs: ReturnType<typeof aggregate>;
  rateLimit: RateLimit;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = new URL(request.url).searchParams.get("user");
  const target = new URL(request.url).searchParams.get("target");
  if (!user) {
    return redirect("/");
  }
  const { rateLimit, dependencies } = await getDependenciesUser({
    login: user,
    lockfile: target == "lock",
  });
  const pkgs = aggregate(dependencies)
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
  return json(
    { rateLimit, pkgs },
    {
      headers: cacheControl,
    }
  );
};

export default function Index() {
  const { rateLimit, pkgs } = useLoaderData<Data>();
  console.info(rateLimit);
  return (
    <SimpleGrid cols={1} spacing="sm">
      {pkgs.map((pkg) => (
        <PkgItem key={pkg.name} name={pkg.name} count={pkg.count} />
      ))}
    </SimpleGrid>
  );
}
