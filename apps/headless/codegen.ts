import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load env files in reverse priority (lowest first, highest last overrides)
// Matches Next.js behavior: .env < .env.local
const projectDir = process.cwd();
const envFiles = ['.env', '.env.local'];

for (const envFile of envFiles) {
  const envPath = path.join(projectDir, envFile);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
    console.log(`[codegen] Loaded env from: ${envFile}`);
  }
}

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!wordpressUrl) {
  console.error('ERROR: NEXT_PUBLIC_WORDPRESS_API_URL is not defined!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('WORDPRESS')));
  process.exit(1);
}

console.log(`[codegen] Using WordPress GraphQL endpoint: ${wordpressUrl}/graphql`);

const wpUser = process.env.WP_USER;
const wpAppPass = process.env.WP_APP_PASS;
const headers: Record<string, string> = { "User-Agent": "Codegen" };

if (wpUser && wpAppPass) {
  headers.Authorization = `Basic ${Buffer.from(`${wpUser}:${wpAppPass}`).toString("base64")}`;
  console.log(`[codegen] Using Basic auth as WP user: ${wpUser}`);
} else {
  console.log(`[codegen] No WP_USER/WP_APP_PASS — making unauthenticated introspection request`);
}

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`${wordpressUrl}/graphql`]: { headers },
  },
  generates: {
    "src/gql/": {
      preset: "client",
    },
    "src/gql/schema.gql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
