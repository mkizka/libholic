import { LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.name != undefined);
  const response = await fetch(`https://api.npms.io/v2/package/${params.name}`);
  const data = await response.json();
  const url = data.collected.metadata.links.repository;
  return redirect(url, {
    headers: {
      "Cache-Control":
        "max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
};
