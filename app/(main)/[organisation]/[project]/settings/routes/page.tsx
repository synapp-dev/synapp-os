import { columns, Payment } from "./route-columns";
import { DataTable } from "./route-data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ];
}

export default function RoutesPage() {
  const data = getData();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Routes</h1>
        <p>
          Routes are used to route calls to the correct destination. You can
          create a route by clicking the &quot;Create Route&quot; button below.
        </p>
      </div>

      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
