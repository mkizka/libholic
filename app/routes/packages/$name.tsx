import { LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.name != undefined);
  const response = await fetch(`https://api.npms.io/v2/package/${params.name}`);
  if (response.ok) {
    const data = await response.json();
    const url = data?.collected?.metadata?.links?.repository;
    if (url && typeof url == "string" && url.startsWith("https://github.com")) {
      return redirect(`${url}/contribute`);
    }
  }
  throw new Response("Not Found", {
    status: 404,
  });
};
