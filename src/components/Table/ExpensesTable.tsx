import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { ArrowUpDown, TrashIcon } from "lucide-react";
import { typeSelect } from "@/lib/typeSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Input } from "../ui/input";

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
      return axios.post("/api/expenses/delete", expensesId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tripId"] });
    },
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const columns: ColumnDef<Expenses>[] = [
    // {
    //   accessorKey: "id",
    //   header: "Id",
    //   cell: ({ row }) => {
    //     return <div className="text-sm text-gray-400">#{row.id}</div>;
    //   },
    // },
    {
      accessorKey: "type",
      cell: ({ row }) => {
        const typeValue = row.getValue("type") as string;
        const emoji = typeSelect.find(
          (item) => item.value === typeValue
        )?.emoji;
        const type = typeSelect.find((item) => item.value === typeValue)?.label;
        return (
          <div className="ml-2">
            {emoji} {type}
          </div>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size={"sm"}
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      cell: ({ row }) => {
        return <div className="ml-2">{row.getValue("description")}</div>;
      },
      header: ({ column }) => {
        return (
          <Button variant="ghost" size={"sm"}>
            Description
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="ml-2">{formatted}</div>;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size={"sm"}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "date_issued",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            size={"sm"}
          >
            Date of the expense
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date_issued = new Date(row.getValue("date_issued"));

        return (
          <div className="ml-2">
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    // initialState: {
    //   pagination: {
    //     pageIndex: 1, //custom initial page index
    //     pageSize: 1, //custom default page size
    //   },
    // },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by type.."
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("type")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border border-gray-200 dark:border-gray-700 w-full">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
