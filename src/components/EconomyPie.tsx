import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#00f5d4", "#4cc9f0", "#4895ef"];

export function EconomyPie({ data }: { data: any[] }) {
  return (
    <PieChart width={320} height={260}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}