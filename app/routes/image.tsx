import { LoaderFunction } from "remix";
import { getScreenshot } from "~/utils/chromium";

const isDev = !process.env.AWS_REGION;

export const loader: LoaderFunction = async ({ request }) => {
  const file = await getScreenshot(`<p>test</p>`, "png", isDev);
  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "png",
      "Cache-Control": `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
    },
  });
};
