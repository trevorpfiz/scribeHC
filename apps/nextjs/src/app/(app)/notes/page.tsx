import { Suspense } from "react";

import Loading from "~/app/loading";
import NoteList from "~/components/notes/note-list";
import NewNoteModal from "~/components/notes/note-modal";
import { api } from "~/trpc/server";

export default function Notes() {
  const notes = api.note.byUser();

  return (
    <main>
      <div className="flex justify-between">
        <h1 className="my-2 text-2xl font-semibold">Notes</h1>
        <NewNoteModal />
      </div>
      <Suspense
        fallback={
          <div className="flex w-full flex-col gap-4">
            <Loading />
          </div>
        }
      >
        <NoteList notes={notes} />
      </Suspense>
    </main>
  );
}
