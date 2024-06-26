"use client";

import type { SignIn } from "@shc/validators";
import { Button } from "@shc/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@shc/ui/form";
import { Input } from "@shc/ui/input";
import { SignInSchema } from "@shc/validators";
import { useAction } from "next-safe-action/hooks";

import { FormError } from "~/app/auth/_components/form-error";
import { signInWithPassword } from "~/app/auth/actions";

export const SignInForm = () => {
  const form = useForm({
    schema: SignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, result, status } = useAction(signInWithPassword);

  const onSubmit = (values: SignIn) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="Email address"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="Password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button
          disabled={status === "executing"}
          type="submit"
          className="w-full"
        >
          Continue with Email
        </Button>
      </form>
    </Form>
  );
};
