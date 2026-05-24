type AdminOrder = {
  id: string;
  email: string;
  status: string;
  total: number;
};

type OrdersTableProps = {
  orders: AdminOrder[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-surface">
      <table className="min-w-full divide-y divide-surface">
        <thead className="bg-surface/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-muted">
              Order
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-muted">
              Client
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-muted">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs uppercase tracking-[0.2em] text-muted">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface/80 bg-bg">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-surface/20">
              <td className="px-4 py-3 text-xs uppercase tracking-[0.12em] text-taupe">
                {order.id.slice(0, 8)}
              </td>
              <td className="px-4 py-3 text-sm text-text">{order.email}</td>
              <td className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-gold">
                {order.status}
              </td>
              <td className="px-4 py-3 text-sm text-text">${(order.total / 100).toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
