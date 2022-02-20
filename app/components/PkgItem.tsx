import { Paper, Group, Badge, Button, Text } from "@mantine/core";
import { Link } from "remix";
import { AggregatedPkg } from "~/utils/dependencies";

type Props = {
  pkg: AggregatedPkg;
};

export function PkgItem({ pkg }: Props) {
  return (
    <Paper padding="sm" withBorder>
      <Group>
        <Badge color="green" variant="outline">
          {pkg.count}
        </Badge>
        <Text size="xl" weight={500}>
          {pkg.name}
        </Text>
      </Group>
      <Group spacing={5}>
        {pkg.repoUrls
          .reverse()
          .slice(0, 3)
          .map((url) => (
            <Text size="sm">
              <a href={url} rel="nofollow">
                {url.replace("https://github.com/", "")}
              </a>
            </Text>
          ))}
      </Group>
    </Paper>
  );
}
