import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format, isAfter, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { backgroundSelect } from "@/lib/backgroundSelect";
import * as z from "zod";
import { Loader } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ButtonLoading } from "@/components/ButtonLoading";
const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  budget: z.coerce.number().nonnegative().min(1, { message: "Required" }),
  currency: z
    .string()
    .min(1, { message: "Required" })
    .max(3, { message: "Max 3 characters" }),
  start_trip: z.date().min(new Date("1900-01-01"), {
    message: "Required",
  }),
  end_trip: z.date().min(new Date("1900-01-01"), { message: "Required" }),
  emoji: z.string().min(1, { message: "Required" }),
  background: z.string().min(1, { message: "Required" }),
});

export default function CreateTrip() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const [emojiState, setEmojiState] = useState("");

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      currency: "",
      start_trip: undefined,
      end_trip: undefined,
      emoji: "",
      background: "",
    },
  });
  const watchStartTrip = form.watch("start_trip");
  const watchEndTrip = form.watch("end_trip");

  useEffect(() => {
    if (isAfter(watchStartTrip, watchEndTrip) && watchEndTrip !== undefined) {
      //@ts-ignore
      form.setValue("end_trip", undefined); // Reset end_trip to undefined
    }
  }, [watchStartTrip, watchEndTrip]);

  // Mutations
  const { isPending, isError, mutate, error } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/create", trip);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      let tripId = data.data.trip[0].id;
      toast({
        title: "Trip created",
        description: "Ready to go!",
        duration: 1000,
      });
      setTimeout(() => {
        router.push(`/trips/view/${tripId}`);
      }, 1500);
    },
  });

  const handleEmojiSelect = (emoji: any) => {
    setEmojiState(emoji);
    form.setValue("emoji", emoji.native); // Update the form field value with the selected emoji]
    setIsPickerVisible(false);
  };

  // Handle click outside to close the emoji picker
  const handleClickOutside = (event: any) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      pickerRef.current &&
      !pickerRef.current.contains(event.target)
    ) {
      setIsPickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function onSubmit(values: z.infer<typeof schema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    mutate({
      name: values.name,
      description: values.description,
      budget: values.budget,
      currency: values.currency,
      start_trip: format(values.start_trip, "t"),
      end_trip: format(values.end_trip, "t"),
      emoji: JSON.stringify(emojiState),
      background: values.background,
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
                  name="emoji"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emoji of trip</FormLabel>
                      <FormControl>
                        <div className="flex relative w-full ">
                          <div ref={inputRef} className="w-full">
                            <Input
                              placeholder="🏄‍♂️"
                              onFocus={() => setIsPickerVisible(true)}
                              {...field}
                            />
                          </div>
                          {isPickerVisible && (
                            <div
                              className="absolute w-full -top-1 right-2"
                              ref={pickerRef}
                            >
                              <Picker
                                data={data}
                                onEmojiSelect={handleEmojiSelect}
                                navPosition="none"
                                searchPosition="none"
                                previewPosition="none"
                                perLine={7}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set the emoji for the trip!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background color</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sea" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {backgroundSelect.map((item: any) => (
                            <SelectItem key={item.value} value={item.name}>
                              <div className="flex justify-between items-center w-full">
                                <p className="mr-2">{item.name}</p>
                                <div
                                  className={`${item.value} h-4 w-4 rounded-full`}
                                />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a color to represent your trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      <FormDescription>Start Trip.</FormDescription>
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
                              disabled={!watchStartTrip}
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
                            disabled={
                              watchStartTrip
                                ? { before: new Date(watchStartTrip) }
                                : undefined
                            } // Conditionally set disabled prop
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

              {isPending ? (
                <ButtonLoading />
              ) : (
                <Button
                  type="submit"
                  className="mt-4"
                  size={"sm"}
                  disabled={isPending || form.formState.isSubmitSuccessful}
                >
                  Create Trip
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
