import { cache } from "react";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

import { createCaller, createTRPCContext } from "@shc/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    auth: getAuth(
      new NextRequest("https://notused.com", { headers: headers() }),
    ),
  });
});

export const api = createCaller(createContext);
