/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "scribe-hc",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc");
    const rds = new sst.aws.Postgres("MyPostgres", { vpc });

    new sst.aws.Nextjs("MyWeb", {
      path: "apps/nextjs",
      link: [rds],
    });
  },
});
