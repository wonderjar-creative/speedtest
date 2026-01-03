import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnvConfig } from "@next/env";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment files manually in the correct order
const NODE_ENV = process.env.NODE_ENV || 'development';
const projectDir = process.cwd();

const envFiles = [
  `.env.${NODE_ENV}.local`,
  '.env.local',
  `.env.${NODE_ENV}`,
  '.env'
];

// Load the first env file that exists
for (const envFile of envFiles) {
  const envPath = path.join(projectDir, envFile);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`[codegen] Loaded env from: ${envFile}`);
    break;
  }
}

// Also try Next.js env loader as backup
loadEnvConfig(projectDir);

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!wordpressUrl) {
  console.error('ERROR: NEXT_PUBLIC_WORDPRESS_API_URL is not defined!');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('WORDPRESS')));
  process.exit(1);
}

console.log(`[codegen] Using WordPress GraphQL endpoint: ${wordpressUrl}/graphql`);

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`${wordpressUrl}/graphql`]: {
      headers: {
        "User-Agent": "Codegen",
      },
    },
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
