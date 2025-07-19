import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface MovementData {
  id_movimiento: string;
  fecha_movimiento: string;
  estado_movimiento: string;
  donante_nombre: string;
  solicitante_nombre: string;
  detalles: Array<{
    producto_nombre: string;
    cantidad: number;
    tipo_transaccion: string;
    rol_usuario: string;
  }>;
}

interface MovementsChartProps {
  data: MovementData[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

export default function MovementsChart({ data }: MovementsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay datos de movimientos disponibles
      </div>
    );
  }

  // Agrupar por estado de movimiento
  const groupedByStatus = data.reduce((acc, movement) => {
    const status = movement.estado_movimiento;
    if (!acc[status]) {
      acc[status] = {
        name: status,
        value: 0
      };
    }
    acc[status].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const statusData = Object.values(groupedByStatus);

  // Agrupar por fecha para tendencia temporal
  const groupedByDate = data.reduce((acc, movement) => {
    const date = format(parseISO(movement.fecha_movimiento), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        fecha: format(parseISO(movement.fecha_movimiento), 'dd/MM', { locale: es }),
        movimientos: 0,
        pendientes: 0,
        completados: 0
      };
    }
    acc[date].movimientos += 1;
    if (movement.estado_movimiento === 'pendiente') {
      acc[date].pendientes += 1;
    } else if (movement.estado_movimiento === 'completado') {
      acc[date].completados += 1;
    }
    return acc;
  }, {} as Record<string, { fecha: string; movimientos: number; pendientes: number; completados: number }>);

  const timelineData = Object.values(groupedByDate)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(-30); // Últimos 30 días

  // Agrupar por tipo de transacción de los detalles
  const transactionTypes = data.flatMap(movement => movement.detalles).reduce((acc, detail) => {
    const type = detail.tipo_transaccion;
    if (!acc[type]) {
      acc[type] = {
        name: type,
        cantidad: 0,
        movimientos: 0
      };
    }
    acc[type].cantidad += detail.cantidad || 0;
    acc[type].movimientos += 1;
    return acc;
  }, {} as Record<string, { name: string; cantidad: number; movimientos: number }>);

  const transactionData = Object.values(transactionTypes);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#fbbf24';
      case 'completado':
        return 'hsl(var(--primary))';
      case 'donado':
        return 'hsl(var(--secondary))';
      default:
        return 'hsl(var(--accent))';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'completado':
        return 'Completado';
      case 'donado':
        return 'Donado';
      default:
        return status;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ingreso':
        return 'Ingreso';
      case 'egreso':
        return 'Egreso';
      case 'baja':
        return 'Baja';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado de movimientos */}
      <div>
        <h4 className="text-sm font-medium mb-2">Estado de Movimientos</h4>
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
                  `${value} movimientos`,
                  `Estado: ${getStatusLabel(name as string)}`
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tendencia temporal */}
      <div>
        <h4 className="text-sm font-medium mb-2">Tendencia de Movimientos</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} movimientos`,
                  name === 'movimientos' ? 'Total' : 
                  name === 'pendientes' ? 'Pendientes' : 'Completados'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="movimientos" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="movimientos"
              />
              <Line 
                type="monotone" 
                dataKey="completados" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="completados"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tipos de transacción */}
      <div>
        <h4 className="text-sm font-medium mb-2">Tipos de Transacción</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={getTransactionLabel}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${name === 'cantidad' ? 'unidades' : 'movimientos'}`,
                  name === 'cantidad' ? 'Cantidad Total' : 'Número de Movimientos'
                ]}
                labelFormatter={(label) => `Tipo: ${getTransactionLabel(label)}`}
              />
              <Bar dataKey="cantidad" fill="hsl(var(--primary))" name="cantidad" />
              <Bar dataKey="movimientos" fill="hsl(var(--secondary))" name="movimientos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}