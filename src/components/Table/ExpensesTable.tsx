import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { typeSelect } from "@/lib/typeSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Expenses = {
  id: string;
  type:
    | "food"
    | "petrol"
    | "transportation"
    | "lodging"
    | "pleasure"
    | "sport"
    | "other";
  description: string;
  amount: number;
  createdAt: string;
};

interface DataTableProps<TData, TValue> {
  data: TData[];
}

export function ExpensesTable<Expenses, TValue>({
  data,
}: DataTableProps<Expenses, TValue>) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (expensesId: any) => {
      console.log(expensesId);
      return axios.post("/api/expenses/delete", expensesId);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["tripId"] });
    },
  });

  const columns: ColumnDef<Expenses>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => {
        return <div>{row.id}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const typeValue = row.getValue("type") as string;
        const emoji = typeSelect.find(
          (item) => item.value === typeValue
        )?.emoji;
        const type = typeSelect.find((item) => item.value === typeValue)?.label;
        return (
          <div>
            {emoji} {type}
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
            {new Date(+date_issued * 1000).toLocaleString("en-UK", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);

        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              mutation.mutate({
                // @ts-ignore
                expensesId: +row.original.id as number,
              });
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
