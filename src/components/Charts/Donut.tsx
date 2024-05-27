import { Card, DonutChart, List, ListItem } from "@tremor/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Expense {
  type: string;
  amount: number;
}

interface ExpenseSummary {
  totals: Record<string, number>;
  percentages: Record<string, number>;
}

function calculateExpenses(expenses: Expense[]): ExpenseSummary {
  const totals: Record<string, number> = {};
  let totalAmount = 0;

  // Calculate the total amount for each type and the overall total amount
  expenses.forEach((expense: Expense) => {
    if (!totals[expense.type]) {
      totals[expense.type] = 0;
    }
    totals[expense.type] += expense.amount;
    totalAmount += expense.amount;
  });

  // Calculate the percentage for each type
  const percentages: Record<string, number> = {};

  for (const type in totals) {
    percentages[type] = parseFloat(
      ((totals[type] / totalAmount) * 100).toFixed(2)
    );
  }

  return {
    totals,
    percentages,
  };
}

export default function Donut({
  expenses,
  currency,
}: {
  expenses: any;
  currency: string;
}) {
  const result = calculateExpenses(expenses);
  const data = [
    {
      name: "Food",
      amount: result.totals["food"] || 0,
      percentage: result.percentages["food"] || 0,
      color: "bg-cyan-500",
    },
    {
      name: "Transportation",
      amount: result.totals["transportation"] || 0,
      percentage: result.percentages["transportation"] || 0,
      color: "bg-blue-500",
    },
    {
      name: "Petrol",
      amount: result.totals["petrol"] || 0,
      percentage: result.percentages["petrol"] || 0,
      color: "bg-indigo-500",
    },
    {
      name: "Lodging",
      amount: result.totals["lodging"] || 0,
      percentage: result.percentages["lodging"] || 0,
      color: "bg-violet-500",
    },
    {
      name: "Pleasure",
      amount: result.totals["pleasure"] || 0,
      percentage: result.percentages["pleasure"] || 0,
      color: "bg-fuchsia-500",
    },
    {
      name: "Sport",
      amount: result.totals["sport"] || 0,
      percentage: result.percentages["sport"] || 0,
      color: "bg-pink-500",
    },
    {
      name: "Other",
      amount: result.totals["other"] || 0,
      percentage: result.percentages["other"] || 0,
      color: "bg-red-500",
    },
  ];

  const currencyFormatter = (number: number) => {
    return `${currency}` + Intl.NumberFormat("us").format(number).toString();
  };

  return (
    <>
      <Card className="w-full border rounded-lg">
        <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Total expenses by category
        </h3>
        {expenses.length > 0 ? (
          <DonutChart
            className="mt-8 h-[200px] dark:text-white "
            data={data}
            category="amount"
            index="name"
            valueFormatter={currencyFormatter}
            showTooltip={false}
            colors={[
              "cyan",
              "blue",
              "indigo",
              "violet",
              "fuchsia",
              "pink",
              "red",
            ]}
          />
        ) : null}
        <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          <span>Category</span>
          <span>Amount</span>
        </p>
        <List className="mt-2">
          {data.map((item) => (
            <ListItem key={item.name} className="space-x-6">
              <div className="flex items-center space-x-2.5 truncate">
                <span
                  className={classNames(
                    item.color,
                    "h-2.5 w-2.5 shrink-0 rounded-sm"
                  )}
                  aria-hidden={true}
                />
                <span className="truncate dark:text-dark-tremor-content-emphasis">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {currencyFormatter(item.amount)}
                </span>
                <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                  {item.percentage}%
                </span>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
