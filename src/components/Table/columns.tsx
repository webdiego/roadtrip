import { ColumnDef } from "@tanstack/react-table";
import { typeSelect } from "@/lib/typeSelect";
import { TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expenses = {
  id: string;
  type:
    | "food"
    | "petrol"
    | "transportation"
    | "lodging"
    | "pleasure"
    | "sport"
    | "other";
  paymentMethod: "cash" | "card" | "other";
  description: string;
  amount: number;
  createdAt: string;
};

export const columns: ColumnDef<Expenses>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const typeValue = row.getValue("type") as string;
      const emoji = typeSelect.find((item) => item.value === typeValue)?.emoji;
      const type = typeSelect.find((item) => item.value === typeValue)?.label;
      return (
        <div>
          {emoji} {type}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as string;
      return (
        <div>
          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",

    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "date_issued",
    header: "Date of the expense",
    cell: ({ row }) => {
      const date_issued = new Date(row.getValue("date_issued"));

      return (
        <div>
          {format(new Date(+date_issued * 1000), "d MMMM yyyy", {
            locale: enGB,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Button size="icon" variant="ghost">
          <TrashIcon className="h-4 w-4" />
        </Button>
      );
    },
  },
];
