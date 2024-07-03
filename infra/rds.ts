export const vpc = new sst.aws.Vpc("MyVpc");
export const rds = new sst.aws.Postgres("MyPostgres", { vpc });
