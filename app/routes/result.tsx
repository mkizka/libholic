import { Group, Text, Button, Badge, SimpleGrid, Paper } from "@mantine/core";
import {
  HeadersFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";

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

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug != undefined);
  const { rateLimit, dependencies } = await getDependenciesUser(params.slug);
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
        <Paper key={pkg.name} padding="sm" withBorder>
          <Group>
            <Badge color="green" variant="outline">
              {pkg.count}
            </Badge>
            <Text weight={500}>{pkg.name}</Text>
            <Button
              component={Link}
              to={`/packages/${pkg.name}`}
              variant="light"
              color="blue"
              style={{ marginLeft: "auto" }}
            >
              Good First Issueを見る
            </Button>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
