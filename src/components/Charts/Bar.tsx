import { BarList, Card } from "@tremor/react";
interface Expense {
  id: number;
  tripId: number;
  type: string;
  description: string;
  amount: number;
  date_issued: number;
  createdAt: number;
}

interface ExpenseCounts {
  [key: string]: number;
}

function countExpensesByType(expenses: Expense[]): ExpenseCounts {
  const counts: ExpenseCounts = {};

  // Calculate the count of expenses for each type
  expenses.forEach((expense: Expense) => {
    if (!counts[expense.type]) {
      counts[expense.type] = 0;
    }
    counts[expense.type]++;
  });

  return counts;
}
export default function Bar({ expenses }: { expenses: any }) {
  const result = countExpensesByType(expenses);
  const data = [
    {
      name: "Food",
      value: result["food"] || 0,
      icon: function icon() {
        return <span className="px-2">🍔</span>;
      },
    },
    {
      name: "Petrol",
      value: result["petrol"] || 0,
      icon: function icon() {
        return <span className="px-2">⛽</span>;
      },
    },
    {
      name: "Transportation",
      value: result["transportation"] || 0,

      icon: function icon() {
        return <span className="px-2">🚌</span>;
      },
    },
    {
      name: "Lodging",
      value: result["lodging"] || 0,
      href: "",
      icon: function icon() {
        return <span className="px-2">🏡</span>;
      },
    },
    {
      name: "Pleasure",
      value: result["pleasure"] || 0,

      icon: function icon() {
        return <span className="px-2">🎭</span>;
      },
    },
    {
      name: "Sport",
      value: result["sport"] || 0,

      icon: function icon() {
        return <span className="px-2">🏄</span>;
      },
    },
    {
      name: "Other",
      value: result["other"] || 0,

      icon: function icon() {
        return <span className="px-2">💡</span>;
      },
    },
  ];
  return (
    <Card className="w-full border rounded-lg ">
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Expenses Analytics
      </h3>
      <p className="mt-4 text-tremor-default flex items-center justify-between text-tremor-content dark:text-dark-tremor-content">
        <span className="text-xs">Expenses type</span>
        <span className="text-xs">Count</span>
      </p>
      <BarList data={data} className="mt-2" />
    </Card>
  );
}
