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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import SelectBibleVersesDialog from "./SelectBibleVersesDialog";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { LanguageContext } from "./LanguageContextProvider";
import { use, useState } from "react";
import SelectExpiresAt from "./selectExpiresAt";
import { Switch } from "./ui/switch";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  content: z
    .string()
    .min(5, "Prayer content must be at least 5 characters long"),
  bibleVerses: z.string().default("").nullable(),
  username: z.string().default("").nullable(),
  expiresAt: z.date().nullable(),
  isPublic: z.boolean(),
});

export function AddNewPrayerForm() {
  const addPrayerRequest = useAction(api.myFunctions.checkAndAddPrayer);
  const context = use(LanguageContext);
  const [open, setOpen] = useState(false);
  const lang = context?.lang ?? "en";

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      bibleVerses: "",
      username: "",
      expiresAt: null as Date | null,
      isPublic: true,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Replace 'userId' with the actual user id, e.g. from context or props
        await addPrayerRequest({
          ...value,
          userId: "123", // TODO: Replace with actual user id
          expiresAt: value.expiresAt ? value.expiresAt.getTime() : undefined,
        });
      } catch (error) {
        console.error("Error submitting prayer request:", error);
        toast.error(
          (error as Error).message || "Failed to submit prayer request",
        );
        return;
      }

      toast.success("Form submitted successfully");
      form.reset();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <FieldGroup className="mt-4 gap-3">
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <input
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
          <FieldGroup className="mt-4">
            <form.Field name="bibleVerses">
              {(field) => (
                <Field>
                  <SelectBibleVersesDialog
                    onChange={(value) => field.handleChange(value)}
                  />
                  {field.state.value && (
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-neutral-700">
                        Selected Verse:{" "}
                        <span className="text-neutral-900 font-semibold">
                          {lang === "en" &&
                          typeof field.state.value === "string"
                            ? field.state.value
                              ? BIBLE_BOOKS.find(
                                  (b) =>
                                    typeof field.state.value === "string" &&
                                    b.abbr === field.state.value.split(" ")[0],
                                )?.engName
                              : ""
                            : field.state.value
                              ? BIBLE_BOOKS.find(
                                  (b) =>
                                    typeof field.state.value === "string" &&
                                    b.abbr === field.state.value.split(" ")[0],
                                )?.chiName
                              : ""}{" "}
                          {typeof field.state.value === "string"
                            ? field.state.value.split(" ").slice(1).join(" ")
                            : ""}
                        </span>
                      </p>
                      <Button
                        variant={"link"}
                        className="text-xs h-fit p-0 m-0 "
                        type="button"
                        onClick={() => field.handleChange("")}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </Field>
              )}
            </form.Field>
            <div className="grid grid-cols-2 gap-4">
              <form.Field name="username">
                {(field) => (
                  <Field>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value || ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Your Name (Optional)"
                      autoComplete="off"
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="expiresAt">
                {(field) => (
                  <Field>
                    <SelectExpiresAt
                      value={field.state.value}
                      onChange={field.handleChange}
                    />
                  </Field>
                )}
              </form.Field>
            </div>
            <form.Field name="isPublic">
              {(field) => (
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Public</FieldLabel>
                    <FieldDescription className="text-xs">
                      Public prayers will be shown on the prayer board. <br />
                      Private prayers are only visible to you &{" "}
                      <span className="font-semibold text-neutral-700">
                        PKA EXCOs
                      </span>
                      .
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
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
            disabled={form.state.isSubmitting}
            type="submit"
            className="bg-yellow-300 hover:bg-yellow-300 text-neutral-800 border-2"
            form="prayer-request-form"
          >
            {form.state.isSubmitting ? (
              <LoaderCircle className="animate-spin " />
            ) : (
              "Submit"
            )}
          </Button>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
