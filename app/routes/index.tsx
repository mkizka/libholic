import {
  Button,
  TextInput,
  Text,
  Group,
  Container,
  List,
  Space,
  Radio,
  RadioGroup,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { Form } from "remix";

export default function () {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Text>最近使ったnpmパッケージ一覧をランキング形式で表示します。</Text>
      <Space h={30} />
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
        <Space h={30} />
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
              width: 200,
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
