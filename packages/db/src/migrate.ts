import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { migrate } from "drizzle-orm/aws-data-api/pg/migrator";
import { Resource } from "sst";

const client = new RDSDataClient({});

const runMigrate = async () => {
  const db = drizzle(client, {
    database: Resource.MyPostgres.database,
    secretArn: Resource.MyPostgres.secretArn,
    resourceArn: Resource.MyPostgres.clusterArn,
  });

  console.log("⏳ Running migrations...");

  const start = Date.now();

  await migrate(db, { migrationsFolder: "migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
