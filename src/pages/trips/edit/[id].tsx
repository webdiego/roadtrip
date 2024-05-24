import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import * as z from "zod";
import { backgroundSelect } from "@/lib/backgroundSelect";

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
  emoji: z.string().min(1, { message: "Required" }),
  background: z.string().min(1, { message: "Required" }),
});

export default function EditTrip({ tripId }: { tripId: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);
  const [emojiState, setEmojiState] = useState("");
  // Query
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["tripId"],
    queryFn: async () => {
      return axios
        .get(`/api/trips/get-trip/?tripId=${tripId}`)
        .then((res) => res.data);
    },
  });

  const trip = data?.trip[0];
  // Mutations
  const {
    isPending,
    isSuccess,
    isError: isErrorMutation,
    mutate,
    error: errorMutation,
  } = useMutation({
    mutationFn: (trip: any) => {
      return axios.post("/api/trips/update", trip);
    },
    onSuccess: (data) => {
      console.log(data);

      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["trip"] });
      toast({
        title: "Trip updated",
        description: "Ready to go!",
        duration: 1500,
      });
      setTimeout(() => {
        router.push("/trips");
      }, 2000);
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate({
      id: trip.id,
      name: values.name,
      description: values.description,
      budget: values.budget,
      currency: values.currency,
      start_trip: values.start_trip
        ? format(values.start_trip, "t")
        : undefined,
      end_trip: values.end_trip ? format(values.end_trip, "t") : undefined,
      emoji: JSON.stringify(emojiState),
      background: values.background,
    });
  }
  // let parseEmoji = JSON.parse(trip?.emoji)
  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: trip?.name ?? "",
      description: trip?.description ?? "",
      budget: trip?.budget ?? 0,
      currency: trip?.currency ?? "",
      start_trip: trip?.start_trip ?? undefined,
      end_trip: trip?.end_trip ?? undefined,
      emoji: trip?.emoji ?? "",
      background: trip?.background ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      ...trip,
      emoji: JSON.parse(trip?.emoji).native,
      start_trip: new Date(+trip?.start_trip * 1000),
      end_trip: new Date(+trip?.end_trip * 1000),
    });
    // form.setValue("emoji", emojiData.emojis[trip?.emoji].skins[0].native);
  }, [trip, form]);

  const handleEmojiSelect = (emoji: any) => {
    setEmojiState(emoji);
    //FOR SHOW IN THE INPUT
    form.setValue("emoji", emoji.native);

    setIsPickerVisible(false);
  };

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

  if (isLoading) return <LoadingSkeleton />;
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
                                data={emojiData}
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
                        defaultValue={trip?.background}
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
                              {field.value instanceof Date &&
                              !isNaN(field.value.getTime()) ? (
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
                              {field.value instanceof Date &&
                              !isNaN(field.value.getTime()) ? (
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

              <Button
                type="submit"
                className="mt-4"
                size={"sm"}
                disabled={isPending}
              >
                Update trip
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: any) {
  const tripId = +ctx.query.id!;

  return {
    props: {
      tripId,
    },
  };
}
