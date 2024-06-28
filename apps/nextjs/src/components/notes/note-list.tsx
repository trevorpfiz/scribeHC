"use client";

import { use } from "react";
import Link from "next/link";

import type { RouterOutputs } from "@shc/api";
import type { Note } from "@shc/db/schema";
import { Button } from "@shc/ui/button";

import { api } from "~/trpc/react";
import NoteModal from "./note-modal";

export default function NoteList(props: {
  notes: Promise<RouterOutputs["note"]["byUser"]>;
}) {
  const initialData = use(props.notes);
  const { data: r } = api.note.byUser.useQuery(undefined, {
    initialData,
  });

  if (r.notes.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {r.notes.map((note) => (
        <NoteComponent note={note} key={note.id} />
      ))}
    </ul>
  );
}

const NoteComponent = ({ note }: { note: Note }) => {
  return (
    <li className="my-2 flex justify-between">
      <div className="w-full">
        <div>{note.title}</div>
      </div>
      <Button variant={"ghost"} size={"sm"} asChild>
        <Link href={`/notes/${note.id}`}>{"View"}</Link>
      </Button>
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No notes
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new note.
      </p>
      <div className="mt-6">
        <NoteModal emptyState={true} />
      </div>
    </div>
  );
};
