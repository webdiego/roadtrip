const stats = [
  { id: 1, name: "Total Expenses", value: "9000+" },
  { id: 2, name: "Total Users", value: "1500+" },
  { id: 3, name: "Total Trips", value: "3000+" },
];

export default function Stats() {
  return (
    <div className="py-32 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base/7 text-gray-600 dark:text-white">
                {stat.name}
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
