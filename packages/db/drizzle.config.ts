import type { Config } from "drizzle-kit";
import { Resource } from "sst";

export default {
  driver: "aws-data-api",
  schema: "./src/schema",
  schemaFilter: ["public"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: Resource.MyPostgres.database,
    secretArn: Resource.MyPostgres.secretArn,
    resourceArn: Resource.MyPostgres.clusterArn,
  },
  tablesFilter: ["scribeHC_*"],
} satisfies Config;
