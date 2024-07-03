import { rds } from "./rds";

export const web = new sst.aws.Nextjs("MyWeb", {
  path: "apps/nextjs",
  link: [rds],
});
