import { auth } from "@clerk/nextjs/server";
import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient();

export const authAction = createSafeActionClient({
  middleware() {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return { user: userId };
  },
});
