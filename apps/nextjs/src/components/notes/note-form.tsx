"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { NewNoteParams, Note } from "@shc/db/schema";
import { insertNoteParams } from "@shc/db/schema";
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

import { api } from "~/trpc/react";

const NoteForm = ({
  note,
  closeModal,
}: {
  note?: Note;
  closeModal?: () => void;
}) => {
  const editing = !!note?.id;

  const router = useRouter();
  const utils = api.useUtils();

  const form = useForm({
    schema: insertNoteParams,
    defaultValues: note ?? {
      title: "",
      content: "",
      transcript: "",
    },
  });

  const onSettled = async (
    action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.note.byUser.invalidate();

    if (action === "delete") {
      router.push("/notes");
    } else if (action === "update") {
      router.refresh();
    }

    if (closeModal) closeModal();
    toast.success(`Note ${action}d!`);
  };

  const { mutate: createNote, isPending: isCreating } =
    api.note.create.useMutation({
      onSettled: (data, err) => onSettled("create", { error: err?.message }),
    });

  const { mutate: updateNote, isPending: isUpdating } =
    api.note.update.useMutation({
      onSettled: (data, err) => onSettled("update", { error: err?.message }),
    });

  const { mutate: deleteNote, isPending: isDeleting } =
    api.note.delete.useMutation({
      onSettled: (data, err) => onSettled("delete", { error: err?.message }),
    });

  const handleSubmit = (values: NewNoteParams) => {
    if (editing) {
      updateNote({ ...values, id: note.id });
    } else {
      createNote(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteNote({ id: note.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default NoteForm;
