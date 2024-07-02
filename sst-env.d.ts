/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Client: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    MyPostgres: {
      clusterArn: string
      database: string
      secretArn: string
      type: "sst.aws.Postgres"
    }
    Trpc: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
  }
}
export {}