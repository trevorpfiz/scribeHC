"use client";

import { useAction } from "next-safe-action/hooks";

import type { SignUp } from "@hh/validators";
import { Button } from "@hh/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@hh/ui/form";
import { Input } from "@hh/ui/input";
import { SignUpSchema } from "@hh/validators";

import { FormError } from "~/app/auth/_components/form-error";
import { FormSuccess } from "~/app/auth/_components/form-success";
import { signUp } from "~/app/auth/actions";

export const SignUpForm = () => {
  const form = useForm({
    schema: SignUpSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, result, status } = useAction(signUp);

  const onSubmit = (values: SignUp) => {
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

        {status === "hasSucceeded" && (
          <FormSuccess message={"Confirmation email has been sent!"} />
        )}
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
