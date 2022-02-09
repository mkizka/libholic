import { AppShell, Button, Header, TextInput } from "@mantine/core";
import { useState } from "react";
import { ActionFunction, Form, redirect } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  return redirect(`/${body.get("name")}`);
};

export default function () {
  const [loading, setLoading] = useState(false);
  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} padding="xs">
          libholic
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
          height: "100vh",
        },
      })}
    >
      <Form method="post" onSubmit={() => setLoading(true)}>
        <TextInput name="name" label="ユーザー名" required />
        <Button type="submit" loading={loading}>
          結果を見てみる
        </Button>
      </Form>
    </AppShell>
  );
}
