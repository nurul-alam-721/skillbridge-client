"use client";

import { zodValidator } from "@tanstack/zod-form-adapter";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { userService, CurrentUser } from "@/services/user.service";

export function ProfileEditForm({
  user,
  onUpdated,
}: {
  user: CurrentUser;
  onUpdated: (updated: CurrentUser) => void;
}) {
  const form = useForm({
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone ?? "",
      image: user.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Saving changes...");
      try {
        const updated = await userService.updateMyProfile({
          name: value.name,
          phone: value.phone || undefined,
          image: value.image || undefined,
        });
        onUpdated(updated);
        toast.success("Profile updated!", { id: toastId });
      } catch {
        toast.error("Failed to update profile.", { id: toastId });
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit Profile</CardTitle>
        <CardDescription>Update your name, phone, and avatar.</CardDescription>
      </CardHeader>

      <form
        id="profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <CardContent className="space-y-4">
          {/* Avatar preview — live updates as user types */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-xl">
              <AvatarImage src={form.state.values.image || undefined} />
              <AvatarFallback>
                {(form.state.values.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Paste an image URL below to update your avatar.
            </p>
          </div>

          <FieldGroup className="space-y-4">
            {/* Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">Full Name</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="rounded-xl"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Phone */}
            <form.Field name="phone">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">Phone</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="+1234567890"
                      className="rounded-xl"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Image URL */}
            <form.Field name="image">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">Avatar URL</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="https://example.com/photo.jpg"
                      className="rounded-xl"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Button type="submit" form="profile-form" className="rounded-xl">
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}