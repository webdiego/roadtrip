import * as z from "zod";

export const tripSchema = z.object({
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

export const expenseSchema = z.object({
  type: z.enum([
    "food",
    "petrol",
    "transportation",
    "lodging",
    "pleasure",
    "sport",
    "other",
  ]),
  paymentMethod: z.enum(["cash", "card", "other"]),
  description: z.string().min(1, { message: "Required" }),
  amount: z.coerce.number().nonnegative().min(0.01, { message: "Required" }),
  date_issued: z.date().min(new Date("1900-01-01"), { message: "Required" }),
});
