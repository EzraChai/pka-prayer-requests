"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import SelectBibleVersesDialog from "./SelectBibleVersesDialog";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z
    .string()
    .min(10, "Prayer content must be at least 10 characters long"),
  bibleVerses: z.string().optional(),
  username: z.string().optional(),
  expiresAt: z.number().optional(),
  public: z.boolean(),
});

export function AddNewPrayerForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      public: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted successfully");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" text-3xl bg-neutral-800 border-3 font-black p-8">
          + Prayer
        </Button>
      </DialogTrigger>

      <DialogContent className="w-2xl">
        <DialogHeader>
          <DialogTitle>New Prayer Request</DialogTitle>
        </DialogHeader>
        <form
          id="prayer-request-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <input
                      required
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Title"
                      autoComplete="off"
                      className="border-0 text-2xl font-bold outline-0 ring-0 focus:ring-0"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="content">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <textarea
                      required
                      rows={5}
                      className="border-0 ring-0 focus:ring-0 outline-0"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Prayer Request"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          <FieldGroup>
            <form.Field name="bibleVerses">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Bible Verse (Optional)
                  </FieldLabel>
                  <SelectBibleVersesDialog />
                  {/* <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g., John 3:16"
                    autoComplete="off"
                  /> */}
                </Field>
              )}
            </form.Field>
            <form.Field name="username">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Your Name (Optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Your Name"
                    autoComplete="off"
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </form>
        <Field className="justify-end" orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            className="bg-yellow-300 hover:bg-yellow-300 text-neutral-800 border-2"
            form="prayer-request-form"
          >
            Submit
          </Button>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
