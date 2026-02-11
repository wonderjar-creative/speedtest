import { draftMode, cookies } from "next/headers";

export async function fetchGraphQL<T = any>(
  query: string,
  variables?: { [key: string]: any },
  headers?: { [key: string]: string },
): Promise<T> {
  let preview = false;
  let authHeader = "";

  try {
    const { isEnabled } = await draftMode();
    preview = isEnabled;

    if (preview) {
      const auth = (await cookies()).get("wp_jwt")?.value;
      if (auth) {
        authHeader = `Bearer ${auth}`;
      }
    }
  } catch {
    // draftMode() throws outside of request scope (e.g. generateStaticParams)
  }

  const body = JSON.stringify({
    query,
    variables: {
      preview,
      ...variables,
    },
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        ...headers,
      },
      body,
      cache: preview ? "no-cache" : "default",
      next: {
        tags: ["wordpress"],
      },
    },
  );

  if (!response.ok) {
    console.error("Response Status:", response.status, response.statusText);
    throw new Error(response.statusText);
  }

  const data = await response.json();

  if (data.errors) {
    console.error("GraphQL Errors:", data.errors);
    throw new Error("Error executing GraphQL query");
  }

  return data.data;
}
