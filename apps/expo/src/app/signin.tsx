import React from "react";

import { SignInForm } from "~/components/auth/signin-form";
import { useSoftKeyboardEffect } from "~/lib/keyboard";

export default function SignInScreen() {
  useSoftKeyboardEffect();

  return (
    <>
      <SignInForm />
    </>
  );
}
