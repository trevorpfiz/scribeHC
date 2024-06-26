import { Button } from "@shc/ui/button";
import { Github } from "lucide-react";

import { signInWithGithub } from "~/app/auth/actions";

export const Social = () => {
  return (
    <form className="flex w-full flex-col items-center gap-2">
      <Button
        size="lg"
        className="flex w-full flex-row items-center justify-center gap-2"
        variant="outline"
        formAction={signInWithGithub}
      >
        <Github size={20} />
        <span className="font-medium text-muted-foreground">
          Continue with GitHub
        </span>
      </Button>
    </form>
  );
};
