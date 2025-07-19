import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface RequestsTableProps {
  data: RequestData[];
}

export default function RequestsTable({ data }: RequestsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No hay solicitudes para mostrar
      </div>
    );
  }

  const getStatusBadge = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'completado':
      case 'atendido':
        return <Badge variant="default">Completado</Badge>;
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitante</TableHead>
            <TableHead>Tipo de Alimento</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Solicitud</TableHead>
            <TableHead>Comentarios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.usuario_nombre}
              </TableCell>
              <TableCell>{request.tipo_alimento}</TableCell>
              <TableCell>{request.cantidad?.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(request.estado)}</TableCell>
              <TableCell>
                {format(parseISO(request.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {request.comentarios || 'Sin comentarios'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}