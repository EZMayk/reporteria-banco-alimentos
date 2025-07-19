import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

interface DonationsTableProps {
  data: DonationData[];
}

export default function DonationsTable({ data }: DonationsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No hay donaciones para mostrar
      </div>
    );
  }

  const getExpirationStatus = (fechaCaducidad: string) => {
    if (!fechaCaducidad) return 'no-expiry';
    
    const expiryDate = new Date(fechaCaducidad);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expires-soon';
    if (daysUntilExpiry <= 30) return 'expires-medium';
    return 'fresh';
  };

  const getExpirationBadge = (fechaCaducidad: string) => {
    if (!fechaCaducidad) {
      return <Badge variant="secondary">Sin caducidad</Badge>;
    }

    const status = getExpirationStatus(fechaCaducidad);
    const expiryDate = new Date(fechaCaducidad);
    const formattedDate = format(expiryDate, 'dd/MM/yyyy', { locale: es });
    
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">Caducado {formattedDate}</Badge>;
      case 'expires-soon':
        return <Badge variant="destructive">Caduca pronto {formattedDate}</Badge>;
      case 'expires-medium':
        return <Badge variant="outline">Caduca {formattedDate}</Badge>;
      default:
        return <Badge variant="secondary">{formattedDate}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Donante</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Fecha Donación</TableHead>
            <TableHead>Caducidad</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((donation) => (
            <TableRow key={donation.id_producto}>
              <TableCell className="font-medium">
                {donation.nombre_producto}
              </TableCell>
              <TableCell>{donation.usuario_nombre}</TableCell>
              <TableCell>
                {donation.cantidad?.toLocaleString()} {donation.unidad_medida}
              </TableCell>
              <TableCell>
                {format(parseISO(donation.fecha_donacion), 'dd/MM/yyyy HH:mm', { locale: es })}
              </TableCell>
              <TableCell>
                {getExpirationBadge(donation.fecha_caducidad)}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {donation.descripcion || 'Sin descripción'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}