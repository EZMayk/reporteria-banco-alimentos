import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface RequestData {
  id: string;
  usuario_id: string;
  tipo_alimento: string;
  cantidad: number;
  comentarios: string;
  estado: string;
  created_at: string;
  usuario_nombre: string;
}

interface RequestsChartProps {
  data: RequestData[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];

export default function RequestsChart({ data }: RequestsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay datos de solicitudes disponibles
      </div>
    );
  }

  // Agrupar por estado
  const groupedByStatus = data.reduce((acc, request) => {
    const status = request.estado;
    if (!acc[status]) {
      acc[status] = {
        name: status,
        value: 0,
        cantidad: 0
      };
    }
    acc[status].value += 1;
    acc[status].cantidad += request.cantidad || 0;
    return acc;
  }, {} as Record<string, { name: string; value: number; cantidad: number }>);

  const statusData = Object.values(groupedByStatus);

  // Agrupar por tipo de alimento
  const groupedByType = data.reduce((acc, request) => {
    const type = request.tipo_alimento;
    if (!acc[type]) {
      acc[type] = {
        name: type,
        solicitudes: 0,
        cantidad: 0
      };
    }
    acc[type].solicitudes += 1;
    acc[type].cantidad += request.cantidad || 0;
    return acc;
  }, {} as Record<string, { name: string; solicitudes: number; cantidad: number }>);

  const typeData = Object.values(groupedByType)
    .sort((a, b) => b.solicitudes - a.solicitudes)
    .slice(0, 8);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#fbbf24'; // amarillo
      case 'completado':
      case 'atendido':
        return 'hsl(var(--primary))'; // verde
      case 'rechazado':
      case 'cancelado':
        return '#ef4444'; // rojo
      default:
        return 'hsl(var(--secondary))';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'completado':
        return 'Completado';
      case 'atendido':
        return 'Atendido';
      case 'rechazado':
        return 'Rechazado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado de solicitudes */}
      <div>
        <h4 className="text-sm font-medium mb-2">Estado de Solicitudes</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${getStatusLabel(name)} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `${value} solicitudes`,
                  `Estado: ${getStatusLabel(name as string)}`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tipos de alimentos más solicitados */}
      <div>
        <h4 className="text-sm font-medium mb-2">Tipos de Alimentos Más Solicitados</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${name === 'solicitudes' ? 'solicitudes' : 'unidades'}`,
                  name === 'solicitudes' ? 'Número de Solicitudes' : 'Cantidad Total'
                ]}
              />
              <Bar dataKey="solicitudes" fill="hsl(var(--primary))" name="solicitudes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}