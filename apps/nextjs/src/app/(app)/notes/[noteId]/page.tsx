import { Suspense } from "react";
import { notFound } from "next/navigation";

import Loading from "~/app/loading";
import { NoteEditor } from "~/components/notes/note-editor";
import NoteModal from "~/components/notes/note-modal";
import { BackButton } from "~/components/shared/back-button";
import { api } from "~/trpc/server";

export default async function Note({ params }: { params: { noteId: string } }) {
  const { note } = await api.note.byId({ id: params.noteId });

  if (!note) notFound();
  return (
    <main className="overflow-y-auto">
      <Suspense fallback={<Loading />}>
        <div className="relative">
          <BackButton currentResource="notes" />

          <div className="m-4">
            <div className="mb-4 flex items-end justify-between">
              <h1 className="text-2xl font-semibold">{note.title}</h1>
              <div className="flex gap-2">
                <NoteModal note={note} />
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <pre
                className={"text-wrap break-all rounded-lg bg-secondary p-4"}
              >
                <NoteEditor initialValue={note.content ?? ""} />
              </pre>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Transcript</h2>
                <pre
                  className={"text-wrap break-all rounded-lg bg-secondary p-4"}
                >
                  {note.transcript}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
