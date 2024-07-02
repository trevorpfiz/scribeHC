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

    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      link: [rds],
      handler: "apps/trpc/src/index.handler",
    });

    return {
      api: trpc.url,
    };
  },
});
