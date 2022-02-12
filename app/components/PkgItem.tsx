import { Paper, Group, Badge, Button, Text } from "@mantine/core";
import { Link } from "remix";

type Props = {
  name: string;
  count: number;
};
export function PkgItem({ name, count }: Props) {
  return (
    <Paper key={name} padding="sm" withBorder>
      <Group>
        <Badge color="green" variant="outline">
          {count}
        </Badge>
        <Text weight={500}>{name}</Text>
        {/* <Button
          component={Link}
          to={`/packages?q=${encodeURIComponent(name)}`}
          target="_blank"
          variant="light"
          color="blue"
          style={{ marginLeft: "auto" }}
        >
          Good First Issueを見る
        </Button> */}
      </Group>
    </Paper>
  );
}
