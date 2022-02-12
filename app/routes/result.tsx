import { Group, Text, Button, Badge, SimpleGrid, Paper } from "@mantine/core";
import {
  HeadersFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";

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
  if (!user) {
    return redirect("/");
  }
  const { rateLimit, dependencies } = await getDependenciesUser(user);
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
              to={`/packages?q=${encodeURIComponent(pkg.name)}`}
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
