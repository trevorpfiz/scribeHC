import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";

import type { AppRouter } from "./root";
import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.Post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext, appRouter, createCaller };
export type { AppRouter, RouterInputs, RouterOutputs };

// AWS Lambda handler
export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError({ error, path }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
  },
  responseMeta() {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
        "Access-Control-Allow-Headers": "*",
      },
    };
  },
});

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
// function setCorsHeaders(res: Response) {
//     res.headers.set("Access-Control-Allow-Origin", "*");
//     res.headers.set("Access-Control-Request-Method", "*");
//     res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
//     res.headers.set("Access-Control-Allow-Headers", "*");
//   }

//   export function OPTIONS() {
//     const response = new Response(null, {
//       status: 204,
//     });
//     setCorsHeaders(response);
//     return response;
//   }

// export const handler = async ({
//     event,
//     context,
//     info
//   }: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => {
//     if (event.requestContext.http.method === 'OPTIONS') {
//       return OPTIONS();
//     }

//     const response = await awsLambdaRequestHandler({
//       router: appRouter,
//       createContext: () => createTRPCContext({ event, context, info }),
//       responseMeta() {
//         return {
//           headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Request-Method': '*',
//             'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//             'Access-Control-Allow-Headers': '*',
//           },
//         };
//       },
//     })(event, context);

//     return setCORSHeaders(response);
//   };
