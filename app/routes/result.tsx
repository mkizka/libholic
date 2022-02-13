import { SimpleGrid } from "@mantine/core";
import {
  HeadersFunction,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";

import { PkgItem } from "~/components/PkgItem";
import {
  AggregatedPkg,
  aggregatePkgs,
  getDependenciesUser,
} from "~/utils/dependencies";
import { RateLimit } from "~/utils/graphql";
import { cacheControl } from "~/utils/helper";

export const headers: HeadersFunction = () => {
  return {
    ...cacheControl(30),
  };
};

type Data = {
  rateLimit: RateLimit;
  pkgs: AggregatedPkg[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = new URL(request.url).searchParams.get("user");
  const target = new URL(request.url).searchParams.get("target");
  if (!user) {
    return redirect("/");
  }
  const { rateLimit, repos } = await getDependenciesUser({
    login: user,
    lockfile: target == "lock",
  });
  const pkgs = aggregatePkgs(repos).slice(0, 30);
  return json(
    { rateLimit, pkgs },
    {
      headers: {
        ...cacheControl(30),
      },
    }
  );
};

export default function Index() {
  const { rateLimit, pkgs } = useLoaderData<Data>();
  console.info(rateLimit);
  return (
    <SimpleGrid cols={1} spacing="sm">
      {pkgs.map((pkg) => (
        <PkgItem key={pkg.name} pkg={pkg} />
      ))}
    </SimpleGrid>
  );
}
