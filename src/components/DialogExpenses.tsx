import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as z from "zod";

import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { typeSelect } from "@/lib/typeSelect";

const schema = z.object({
  type: z.enum([
    "food",
    "petrol",
    "transportation",
    "lodging",
    "pleasure",
    "sport",
    "other",
  ]),
  description: z.string().min(1, { message: "Required" }),
  amount: z.coerce.number().nonnegative().min(1, { message: "Required" }),
  date_issued: z.date().min(new Date("1900-01-01"), { message: "Required" }),
});

export default function DialogExpenses({
  dialogOpen,
  setDialogOpen,
  tripId,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  tripId: number;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "food",
      description: "",
      amount: 0,
      date_issued: undefined,
    },
  });
  const { isPending, isSuccess, isError, mutate, error } = useMutation({
    mutationFn: (expense: any) => {
      return axios.post("/api/expenses/create", expense);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tripId"] });
      toast({
        title: "Expense added",
        description: "Expense added successfully",
        duration: 1500,
      });
      setTimeout(() => {
        if (form.formState.isSubmitSuccessful) {
          form.reset();
        }
        setDialogOpen(false);
      }, 1700);
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    mutate({
      tripId,
      type: values.type,
      description: values.description,
      amount: values.amount,
      date_issued: values.date_issued
        ? format(values.date_issued, "t")
        : undefined,
    });
  }

  // React.useEffect(() => {
  //   if (form.formState.isSubmitSuccessful) {
  //     form.reset();
  //   }
  // }, [form.formState, form.reset]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-xl my-10">
        <ScrollArea className="max-h-[80vh] px-2 m-4  rounded-lg">
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <DialogDescription>
              Add an expense to your trip by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mx-2"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeSelect.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.emoji} {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Write a short name of the activity.
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
                        placeholder="We ate at the local restaurant"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write a description of your activity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2  sm:space-x-2 items-end">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount spent</FormLabel>
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
                        Amount spent for the activity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_issued"
                  render={({ field }) => (
                    <FormItem className="flex flex-col z-[1000]">
                      <FormLabel>Date of the expense</FormLabel>
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
                        <div className="z-[1000]">
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </div>
                      </Popover>
                      <FormDescription>Date of departure.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  size={"sm"}
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
                <Button type="submit" size={"sm"} disabled={isPending}>
                  Add expense
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
