import React from "react";

import { SignUpForm } from "~/components/auth/signup-form";
import { useSoftKeyboardEffect } from "~/lib/keyboard";

export default function SignUpScreen() {
  // useSoftKeyboardEffect();

  return (
    <>
      <SignUpForm />
    </>
  );
}
