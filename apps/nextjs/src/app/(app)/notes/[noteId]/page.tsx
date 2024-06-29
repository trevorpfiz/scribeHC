import { Suspense } from "react";
import { notFound } from "next/navigation";

import Loading from "~/app/loading";
import NoteModal from "~/components/notes/note-modal";
import { BackButton } from "~/components/shared/back-button";
import { api } from "~/trpc/server";
import TailwindAdvancedEditor from "~/components/notes/novel/advanced-editor";

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
              <div
                className={"text-wrap break-all rounded-lg bg-secondary p-1"}
              >
                <TailwindAdvancedEditor noteId={note.id} content={note.content ?? ""} />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Transcript</h2>
                <div
                  className={"text-wrap break-all rounded-lg bg-secondary p-4"}
                >
                  {note.transcript}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
