import { Button, TextInput, Text, Group, NativeSelect } from "@mantine/core";
import { useState } from "react";
import { ActionFunction, Form, redirect } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  return redirect(`/${body.get("name")}`);
};

export default function () {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Text>最近使ったnpmパッケージ一覧をランキング形式で表示します。</Text>
      <Form method="post" onSubmit={() => setLoading(true)}>
        <NativeSelect
          label="検索対象"
          sx={{
            width: "fit-content",
            margin: "auto",
          }}
          data={[
            { value: "package", label: "package.jsonから取得", selected: true },
            { value: "lock", label: "lockファイル(npm/yarn/pnpm)から取得" },
          ]}
          required
        />
        <Group
          sx={{
            justifyContent: "center",
            gap: 4,
            margin: "auto",
          }}
        >
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
            name="name"
            label="ユーザー名"
            required
            sx={{
              width: 200,
            }}
          />
        </Group>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          sx={{
            marginTop: 10,
          }}
        >
          結果を見る
        </Button>
      </Form>
    </>
  );
}
