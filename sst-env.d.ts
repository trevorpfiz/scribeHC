/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    MyPostgres: {
      clusterArn: string
      database: string
      secretArn: string
      type: "sst.aws.Postgres"
    }
    MyWeb: {
      type: "sst.aws.Nextjs"
      url: string
    }
  }
}
export {}