import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface InventoryData {
  id_inventario: string;
  cantidad_disponible: number;
  deposito_nombre: string;
  producto_nombre: string;
  fecha_actualizacion: string;
}

interface InventoryChartProps {
  data: InventoryData[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

export default function InventoryChart({ data }: InventoryChartProps) {
  // Agrupar datos por depósito
  const groupedData = data.reduce((acc, item) => {
    const deposito = item.deposito_nombre;
    if (!acc[deposito]) {
      acc[deposito] = {
        name: deposito,
        total: 0,
        productos: 0
      };
    }
    acc[deposito].total += item.cantidad_disponible;
    acc[deposito].productos += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; productos: number }>);

  const chartData = Object.values(groupedData);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay datos de inventario disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gráfico de barras por depósito */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'total' ? `${value} unidades` : `${value} productos`,
                name === 'total' ? 'Cantidad Total' : 'Productos Diferentes'
              ]}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" name="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico circular de distribución */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}