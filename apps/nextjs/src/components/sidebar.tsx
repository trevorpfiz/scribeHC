import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import SidebarItems from "~/components/sidebar-items";

const Sidebar = () => {
  const { userId } = auth();

  return (
    <aside className="hidden h-screen min-w-52 border-r border-border bg-muted p-4 pt-8 shadow-inner md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <h3 className="ml-4 text-lg font-semibold">scribeHC</h3>
          <SidebarItems />
        </div>
        <div className="flex w-full items-center gap-2 border-t border-border px-2 pt-4">
          <UserButton />
          <div className="text-muted-foreground">
            <p className="max-w-28 truncate text-xs">{userId}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
