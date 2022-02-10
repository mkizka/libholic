import { Button, TextInput, Text, Group } from "@mantine/core";
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
        <Group
          styles={{
            root: {
              justifyContent: "center",
              gap: 4,
              margin: "auto",
            },
          }}
        >
          <Text
            styles={{
              root: {
                fontSize: "1.2rem",
                marginTop: "auto",
                marginBottom: 5,
              },
            }}
          >
            https://github.com/
          </Text>
          <TextInput
            name="name"
            label="ユーザー名"
            required
            styles={{
              root: {
                width: 200,
              },
            }}
          />
        </Group>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          styles={{
            root: {
              marginTop: 10,
            },
          }}
        >
          結果を見る
        </Button>
      </Form>
    </>
  );
}
