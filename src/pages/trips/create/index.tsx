import React from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  budget: z.number().min(1, { message: "Required" }),
  currency: z
    .string()
    .min(1, { message: "Required" })
    .max(3, { message: "Max 3 characters" }),
  status: z.boolean().default(false),
});

export default function CreateTrip() {
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      currency: "",
      status: false,
    },
  });

  // Mutations
  const { isPending, isSuccess, isError, mutate, error } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({
      name: "Test Trip query",
      description: "This is a test trip query",
    });
  }
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="py-10">
        <h1 className="text-2xl font-bold">Create a new trip</h1>
        <p className="text-sm text-gray-500">
          You can create a new trip by filling out the form below.
        </p>
        <div className="border border-gray-200 rounded-lg p-4 shadow-md flex flex-col mt-5 w-[500px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Australia West Coast" {...field} />
                    </FormControl>
                    <FormDescription>
                      Write a short name for your trip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="We are going to Australia West Coast, visiting Sydney, Melbourne, Brisbane and Perth"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a description of your trip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input
                          min={0}
                          type="number"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set a budget for your trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl className="flex items-center">
                      <div className="flex items-center">
                        <p className="text-sm mr-2 text-gray-800">
                          Not on trip
                        </p>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <p className="text-sm ml-2">On trip</p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Is this trip already started?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4"
                size={"sm"}
                disabled={isPending}
                onClick={() =>
                  mutate({
                    name: "Test Trip query",
                    description: "This is a test trip query",
                  })
                }
              >
                Create Trip
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
