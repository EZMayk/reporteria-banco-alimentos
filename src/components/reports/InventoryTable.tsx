import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface InventoryData {
  id_inventario: string;
  cantidad_disponible: number;
  deposito_nombre: string;
  producto_nombre: string;
  fecha_actualizacion: string;
}

interface InventoryTableProps {
  data: InventoryData[];
}

export default function InventoryTable({ data }: InventoryTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No hay inventario para mostrar
      </div>
    );
  }

  const getStockStatus = (cantidad: number) => {
    if (cantidad === 0) return 'out-of-stock';
    if (cantidad <= 10) return 'low-stock';
    if (cantidad <= 50) return 'medium-stock';
    return 'high-stock';
  };

  const getStockBadge = (cantidad: number) => {
    const status = getStockStatus(cantidad);
    
    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive">Sin stock</Badge>;
      case 'low-stock':
        return <Badge variant="outline">Stock bajo</Badge>;
      case 'medium-stock':
        return <Badge variant="secondary">Stock medio</Badge>;
      default:
        return <Badge variant="default">Stock alto</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Depósito</TableHead>
            <TableHead>Cantidad Disponible</TableHead>
            <TableHead>Estado del Stock</TableHead>
            <TableHead>Última Actualización</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id_inventario}>
              <TableCell className="font-medium">
                {item.producto_nombre}
              </TableCell>
              <TableCell>{item.deposito_nombre}</TableCell>
              <TableCell className="text-right font-mono">
                {item.cantidad_disponible?.toLocaleString()}
              </TableCell>
              <TableCell>{getStockBadge(item.cantidad_disponible)}</TableCell>
              <TableCell>
                {format(parseISO(item.fecha_actualizacion), 'dd/MM/yyyy HH:mm', { locale: es })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}