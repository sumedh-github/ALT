"use client";

import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface RevenuePoint {
  date: string;
  revenue: number;
}

interface OrderStatusSlice {
  status: string;
  count: number;
}

interface DashboardChartsProps {
  revenueSeries: RevenuePoint[];
  orderStatusSeries: OrderStatusSlice[];
}

const pieColors = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#6366f1",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
  REFUNDED: "#9ca3af"
} as const;

export function DashboardCharts({
  revenueSeries,
  orderStatusSeries
}: DashboardChartsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
        <h2 className="text-sm font-semibold text-[#e2e4ed]">Revenue (Last 30 Days)</h2>
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries}>
              <XAxis
                dataKey="date"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#2a2d3a" }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#2a2d3a" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1117",
                  border: "1px solid #2a2d3a",
                  borderRadius: "8px",
                  color: "#e2e4ed"
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-4">
        <h2 className="text-sm font-semibold text-[#e2e4ed]">Orders by Status</h2>
        <div className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusSeries}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {orderStatusSeries.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={
                      pieColors[entry.status as keyof typeof pieColors] ?? "#6366f1"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f1117",
                  border: "1px solid #2a2d3a",
                  borderRadius: "8px",
                  color: "#e2e4ed"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
