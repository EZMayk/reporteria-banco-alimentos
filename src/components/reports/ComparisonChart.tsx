import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ComparisonData {
  periodo: string;
  donaciones: number;
  solicitudes: number;
  atendidas: number;
}

interface ComparisonChartProps {
  data: ComparisonData[];
}

export default function ComparisonChart({ data }: ComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay datos de comparación disponibles
      </div>
    );
  }

  // Calcular eficiencia (atendidas / solicitudes)
  const chartData = data.map(item => ({
    ...item,
    eficiencia: item.solicitudes > 0 ? Math.round((item.atendidas / item.solicitudes) * 100) : 0,
    pendientes: item.solicitudes - item.atendidas
  }));

  return (
    <div className="space-y-6">
      {/* Comparación de volúmenes */}
      <div>
        <h4 className="text-sm font-medium mb-2">Donaciones vs Solicitudes</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} unidades`,
                  name === 'donaciones' ? 'Donaciones Recibidas' :
                  name === 'solicitudes' ? 'Solicitudes Totales' :
                  name === 'atendidas' ? 'Solicitudes Atendidas' : 'Solicitudes Pendientes'
                ]}
              />
              <Bar dataKey="donaciones" fill="hsl(var(--primary))" name="donaciones" />
              <Bar dataKey="solicitudes" fill="hsl(var(--secondary))" name="solicitudes" />
              <Bar dataKey="atendidas" fill="hsl(var(--accent))" name="atendidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Eficiencia en atención */}
      <div>
        <h4 className="text-sm font-medium mb-2">Eficiencia en Atención (%)</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Eficiencia de Atención']}
                labelFormatter={(label) => `Período: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="eficiencia" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                name="eficiencia"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {chartData.reduce((sum, item) => sum + item.donaciones, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Donaciones</div>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-2xl font-bold text-secondary">
            {chartData.reduce((sum, item) => sum + item.solicitudes, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Solicitudes</div>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {chartData.reduce((sum, item) => sum + item.atendidas, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Atendidas</div>
        </div>
        <div className="bg-muted p-3 rounded-lg">
          <div className="text-2xl font-bold">
            {chartData.length > 0 ? 
              Math.round(
                chartData.reduce((sum, item) => sum + item.eficiencia, 0) / chartData.length
              ) : 0
            }%
          </div>
          <div className="text-sm text-muted-foreground">Eficiencia Promedio</div>
        </div>
      </div>
    </div>
  );
}