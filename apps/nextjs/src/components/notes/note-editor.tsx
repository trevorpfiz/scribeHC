"use client";

import type { JSONContent } from "novel";
import { useState } from "react";

import Editor from "~/components/notes/novel/advanced-editor";
import { defaultValue } from "~/components/notes/novel/default-value";

function NoteEditor(props: { initialValue: string }) {
  //   const [value, setValue] = useState<JSONContent>(defaultValue);

  return <Editor />;
}

export { NoteEditor };
