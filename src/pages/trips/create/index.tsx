import React from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  budget: z.number().min(1, { message: "Required" }),
  amount_used: z.number().min(1),
  currency: z.string().min(1, { message: "Required" }),
  status: z.string().min(1, { message: "Required" }),
});

export default function CreateTrip() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
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
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      Create trip{" "}
      <form onSubmit={handleSubmit((d) => console.log(d))}>
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors.name?.message && <p>{errors.root?.message}</p>}
        <Label>Description</Label>
        <Input {...register("description")} />
        <Label>Budget</Label>
        <Input type="number" {...register("budget")} />

        <Label>Currency </Label>
        <Input {...register("currency")} />
        <Label>Status</Label>
        <Input {...register("status")} />
        <input type="submit" />
      </form>
      <Button
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
    </div>
  );
}
