import React from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  budget: z.coerce.number().nonnegative().min(1, { message: "Required" }),
  currency: z
    .string()
    .min(1, { message: "Required" })
    .max(3, { message: "Max 3 characters" }),
  start_trip: z.date().min(new Date("1900-01-01")).optional(),
  end_trip: z.date().min(new Date("1900-01-01")).optional(),
});

export default function CreateTrip() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      currency: "",
      start_trip: undefined,
      end_trip: undefined,
    },
  });

  // Mutations
  const { isPending, isSuccess, isError, mutate, error } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast({
        title: "Trip created",
        description: "Ready to go!",
        duration: 1500,
      });
      setTimeout(() => {
        router.push("/trips");
      }, 2000);
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({
      name: values.name,
      description: values.description,
      budget: values.budget,
      currency: values.currency,
      start_trip: values.start_trip
        ? format(values.start_trip, "t")
        : undefined,
      end_trip: values.end_trip ? format(values.end_trip, "t") : undefined,
    });
  }

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="py-10 w-full">
        <h1 className="text-2xl font-bold">Create a new trip</h1>
        <p className="text-sm text-gray-500">
          You can create a new trip by filling out the form below.
        </p>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm flex flex-col mt-5 w-full sm:w-[600px]">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 space-y-6 sm:space-y-0 sm:space-x-6">
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
                          step=".01"
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
                      <FormDescription>
                        Set the currency for your budget.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 space-y-6 sm:space-y-0 sm:space-x-6">
                <FormField
                  control={form.control}
                  name="start_trip"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start trip</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Date of departure.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_trip"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End trip</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>You can set later on.</FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image of the trip</FormLabel>
                    <FormControl>
                      <Input id="picture" type="file" />
                    </FormControl>
                    <FormDescription>
                      Upload a picture of your trip. This will be used as a
                      thumbnail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Button
                type="submit"
                className="mt-4"
                size={"sm"}
                disabled={isPending}
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
