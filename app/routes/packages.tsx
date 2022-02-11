import { LoaderFunction, redirect } from "remix";

export const loader: LoaderFunction = async ({ request }) => {
  const q = new URL(request.url).searchParams.get("q");
  if (!q) {
    return redirect("/");
  }
  const response = await fetch(
    `https://api.npms.io/v2/package/${encodeURIComponent(q)}`
  );
  if (!response.ok) {
    throw new Response("パッケージの情報がありません", { status: 404 });
  }
  const data = await response.json();
  const url = data?.collected?.metadata?.links?.repository;
  const isGithubUrl =
    url && typeof url == "string" && url.startsWith("https://github.com");
  if (!isGithubUrl) {
    throw new Response("パッケージにGitHubのリンクがありません");
  }
  return redirect(`${url}/contribute`);
};
