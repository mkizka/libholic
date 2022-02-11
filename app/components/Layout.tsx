import { AppShell, Header, Text } from "@mantine/core";
import { Link } from "remix";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      header={
        <Header height="" padding="xs">
          <Text
            component={Link}
            to="/"
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "initial",
              textDecoration: "none",
            }}
          >
            pkgholic
          </Text>
        </Header>
      }
      styles={{
        root: {
          height: "100vh",
          maxWidth: 500,
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        },
        body: {
          flex: 1,
        },
      }}
    >
      {children}
    </AppShell>
  );
}
