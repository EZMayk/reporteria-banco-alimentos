import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface DonationData {
  id_producto: string;
  id_usuario: string;
  nombre_producto: string;
  descripcion: string;
  fecha_donacion: string;
  cantidad: number;
  unidad_medida: string;
  fecha_caducidad: string;
  usuario_nombre: string;
}

interface DonationsChartProps {
  data: DonationData[];
}

export default function DonationsChart({ data }: DonationsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No hay datos de donaciones disponibles
      </div>
    );
  }

  // Agrupar donaciones por fecha
  const groupedByDate = data.reduce((acc, donation) => {
    const date = format(parseISO(donation.fecha_donacion), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        fecha: format(parseISO(donation.fecha_donacion), 'dd/MM', { locale: es }),
        cantidad: 0,
        donaciones: 0
      };
    }
    acc[date].cantidad += donation.cantidad || 0;
    acc[date].donaciones += 1;
    return acc;
  }, {} as Record<string, { fecha: string; cantidad: number; donaciones: number }>);

  const chartData = Object.values(groupedByDate).sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  // Agrupar por tipo de producto
  const groupedByProduct = data.reduce((acc, donation) => {
    const product = donation.nombre_producto;
    if (!acc[product]) {
      acc[product] = {
        name: product,
        cantidad: 0,
        donaciones: 0
      };
    }
    acc[product].cantidad += donation.cantidad || 0;
    acc[product].donaciones += 1;
    return acc;
  }, {} as Record<string, { name: string; cantidad: number; donaciones: number }>);

  const productData = Object.values(groupedByProduct)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10); // Top 10 productos

  return (
    <div className="space-y-6">
      {/* Tendencia temporal */}
      <div>
        <h4 className="text-sm font-medium mb-2">Tendencia Temporal</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} ${name === 'cantidad' ? 'unidades' : 'donaciones'}`,
                  name === 'cantidad' ? 'Cantidad Donada' : 'Número de Donaciones'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="cantidad"
              />
              <Line 
                type="monotone" 
                dataKey="donaciones" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                name="donaciones"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top productos donados */}
      <div>
        <h4 className="text-sm font-medium mb-2">Top Productos Donados</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} unidades`, 'Cantidad Total']}
              />
              <Bar dataKey="cantidad" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}