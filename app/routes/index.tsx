import {
  Button,
  TextInput,
  Text,
  Group,
  List,
  Space,
  Radio,
  RadioGroup,
  Center,
  SimpleGrid,
  Container,
  Paper,
} from "@mantine/core";
import { useState } from "react";
import { Form, LoaderFunction, useLoaderData, json } from "remix";

import { PkgItem } from "~/components/PkgItem";
import { samplePkgNames } from "~/utils/fixtures";
import { choice, randomInt } from "~/utils/helper";

export const loader: LoaderFunction = () => {
  const randomPkgs = [...Array(100)]
    .map((_) => choice(samplePkgNames))
    .slice(0, 3)
    .map((pkgName) => {
      return { name: pkgName, count: randomInt(15) };
    })
    .sort((a, b) => b.count - a.count);
  return json({ randomPkgs });
};

type Data = {
  randomPkgs: {
    name: string;
    count: number;
  }[];
};

export default function () {
  const { randomPkgs } = useLoaderData<Data>();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Text>
          最近使ったnpmパッケージを
          <br />
          ランキング形式で表示
        </Text>
        <Space h="md" />
        <Text>こんな感じ↓</Text>
        <SimpleGrid cols={1} spacing="sm">
          {randomPkgs.map((pkg) => (
            <PkgItem key={pkg.name} name={pkg.name} count={pkg.count} />
          ))}
        </SimpleGrid>
      </Container>
      <Space h="lg" />
      <Paper padding="md" shadow="xs">
        <Form method="get" action="/result" onSubmit={() => setLoading(true)}>
          <RadioGroup
            label="検索対象"
            name="target"
            description="lockファイル ... package-lock.json, yarn.lock, pnpm-lock.yaml"
            defaultValue="package"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            required
          >
            <Radio value="package">package.json</Radio>
            <Radio value="lock">lockファイル</Radio>
          </RadioGroup>
          <Space h="lg" />
          <Group sx={{ gap: 4, justifyContent: "center" }}>
            <Text
              sx={{
                fontSize: "1.2rem",
                marginTop: "auto",
                marginBottom: 5,
              }}
            >
              https://github.com/
            </Text>
            <TextInput
              name="user"
              label="ユーザー名"
              required
              sx={{
                width: 140,
              }}
            />
          </Group>
          <Space h={30} />
          <Center>
            <Button type="submit" loading={loading} size="lg">
              結果を見る
            </Button>
          </Center>
        </Form>
      </Paper>
      <Space h="md" />
      <List size="lg" sx={{ textAlign: "initial" }} withPadding>
        <List.Item>
          集計の対象
          <List withPadding>
            <List.Item>直近30件のフォークでない公開リポジトリ</List.Item>
            <List.Item>ルートにある検索対象ファイル</List.Item>
          </List>
        </List.Item>
        <List.Item>
          lockファイルの対象
          <List withPadding>
            <List.Item>package-lock.json</List.Item>
            <List.Item>yarn.lock</List.Item>
            <List.Item>pnpm-lock.yaml</List.Item>
          </List>
        </List.Item>
        <List.Item>
          注意など
          <List withPadding>
            <List.Item>
              pkgholicが使用するGitHubのAPIトークンが使用上限回数を超えた場合、最大1時間結果が表示されません。
            </List.Item>
          </List>
        </List.Item>
      </List>
    </>
  );
}
