import {
  Card,
  Group,
  Text,
  Button,
  useMantineTheme,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import {
  HeadersFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
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
  const theme = useMantineTheme();
  const { rateLimit, pkgs } = useLoaderData();
  console.info(rateLimit);
  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 3 },
        { maxWidth: "sm", cols: 2 },
        { maxWidth: "xs", cols: 1 },
      ]}
    >
      {pkgs.map((pkg: any) => (
        <Card shadow="sm" padding="lg">
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
              Good First Issueを見てみる
            </Button>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
