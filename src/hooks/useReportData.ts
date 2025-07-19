import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseReportDataProps {
  dateFrom?: Date;
  dateTo?: Date;
  depositId?: string;
  userType?: string;
  status?: string;
}

interface InventoryData {
  id_inventario: string;
  cantidad_disponible: number;
  deposito_nombre: string;
  producto_nombre: string;
  fecha_actualizacion: string;
}

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

interface ComparisonData {
  periodo: string;
  donaciones: number;
  solicitudes: number;
  atendidas: number;
}

interface Deposit {
  id_deposito: string;
  nombre: string;
  descripcion: string;
}

export function useReportData({
  dateFrom,
  dateTo,
  depositId,
  userType,
  status
}: UseReportDataProps) {
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [donationsData, setDonationsData] = useState<DonationData[]>([]);
  const [requestsData, setRequestsData] = useState<RequestData[]>([]);
  const [movementsData, setMovementsData] = useState<MovementData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = async () => {
    try {
      let query = supabase
        .from('inventario')
        .select(`
          id_inventario,
          cantidad_disponible,
          fecha_actualizacion,
          depositos:id_deposito(nombre),
          productos_donados:id_producto(nombre_producto)
        `);

      if (depositId) {
        query = query.eq('id_deposito', depositId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formattedData = data?.map(item => ({
        id_inventario: item.id_inventario,
        cantidad_disponible: item.cantidad_disponible,
        fecha_actualizacion: item.fecha_actualizacion,
        deposito_nombre: item.depositos?.nombre || 'Sin depósito',
        producto_nombre: item.productos_donados?.nombre_producto || 'Sin producto'
      })) || [];

      setInventoryData(formattedData);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Error al cargar datos de inventario');
    }
  };

  const fetchDonationsData = async () => {
    try {
      let query = supabase
        .from('productos_donados')
        .select(`
          id_producto,
          id_usuario,
          nombre_producto,
          descripcion,
          fecha_donacion,
          cantidad,
          unidad_medida,
          fecha_caducidad,
          usuarios:id_usuario(nombre, rol)
        `);

      if (dateFrom) {
        query = query.gte('fecha_donacion', dateFrom.toISOString());
      }
      if (dateTo) {
        query = query.lte('fecha_donacion', dateTo.toISOString());
      }
      if (userType && userType !== 'all') {
        query = query.eq('usuarios.rol', userType);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formattedData = data?.map(item => ({
        id_producto: item.id_producto,
        id_usuario: item.id_usuario,
        nombre_producto: item.nombre_producto,
        descripcion: item.descripcion,
        fecha_donacion: item.fecha_donacion,
        cantidad: item.cantidad,
        unidad_medida: item.unidad_medida,
        fecha_caducidad: item.fecha_caducidad,
        usuario_nombre: item.usuarios?.nombre || 'Usuario no encontrado'
      })) || [];

      setDonationsData(formattedData);
    } catch (err) {
      console.error('Error fetching donations data:', err);
      setError('Error al cargar datos de donaciones');
    }
  };

  const fetchRequestsData = async () => {
    try {
      let query = supabase
        .from('solicitudes')
        .select(`
          id,
          usuario_id,
          tipo_alimento,
          cantidad,
          comentarios,
          estado,
          created_at,
          usuarios:usuario_id(nombre)
        `);

      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo.toISOString());
      }
      if (status && status !== 'all') {
        query = query.eq('estado', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        usuario_id: item.usuario_id,
        tipo_alimento: item.tipo_alimento,
        cantidad: item.cantidad,
        comentarios: item.comentarios,
        estado: item.estado,
        created_at: item.created_at,
        usuario_nombre: item.usuarios?.nombre || 'Usuario no encontrado'
      })) || [];

      setRequestsData(formattedData);
    } catch (err) {
      console.error('Error fetching requests data:', err);
      setError('Error al cargar datos de solicitudes');
    }
  };

  const fetchMovementsData = async () => {
    try {
      // Consulta simplificada para evitar errores de relaciones
      const { data, error } = await supabase
        .from('movimiento_inventario_cabecera')
        .select(`
          id_movimiento,
          fecha_movimiento,
          estado_movimiento,
          id_donante,
          id_solicitante,
          observaciones
        `);

      if (error) throw error;

      // Obtener nombres de usuarios por separado
      const userIds = data?.flatMap(item => [item.id_donante, item.id_solicitante]) || [];
      const uniqueUserIds = [...new Set(userIds)];
      
      const { data: users } = await supabase
        .from('usuarios')
        .select('id, nombre')
        .in('id', uniqueUserIds);

      const userMap = users?.reduce((map, user) => {
        map[user.id] = user.nombre;
        return map;
      }, {} as Record<string, string>) || {};

      const formattedData = data?.map(item => ({
        id_movimiento: item.id_movimiento,
        fecha_movimiento: item.fecha_movimiento,
        estado_movimiento: item.estado_movimiento,
        donante_nombre: userMap[item.id_donante] || 'Usuario no encontrado',
        solicitante_nombre: userMap[item.id_solicitante] || 'Usuario no encontrado',
        detalles: [] // Por simplicidad, se puede expandir después
      })) || [];

      setMovementsData(formattedData);
    } catch (err) {
      console.error('Error fetching movements data:', err);
      setError('Error al cargar datos de movimientos');
    }
  };

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('depositos')
        .select('id_deposito, nombre, descripcion');

      if (error) throw error;
      setDeposits(data || []);
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError('Error al cargar datos de depósitos');
    }
  };

  const generateComparisonData = () => {
    // Generar datos de comparación basados en las donaciones y solicitudes
    const monthlyData: { [key: string]: ComparisonData } = {};

    // Procesar donaciones
    donationsData.forEach(donation => {
      const month = new Date(donation.fecha_donacion).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          periodo: month,
          donaciones: 0,
          solicitudes: 0,
          atendidas: 0
        };
      }
      monthlyData[month].donaciones += donation.cantidad || 0;
    });

    // Procesar solicitudes
    requestsData.forEach(request => {
      const month = new Date(request.created_at).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          periodo: month,
          donaciones: 0,
          solicitudes: 0,
          atendidas: 0
        };
      }
      monthlyData[month].solicitudes += request.cantidad || 0;
      if (request.estado === 'completado' || request.estado === 'atendido') {
        monthlyData[month].atendidas += request.cantidad || 0;
      }
    });

    setComparisonData(Object.values(monthlyData));
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchInventoryData(),
        fetchDonationsData(),
        fetchRequestsData(),
        fetchMovementsData(),
        fetchDeposits()
      ]);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [dateFrom, dateTo, depositId, userType, status]);

  useEffect(() => {
    generateComparisonData();
  }, [donationsData, requestsData]);

  return {
    inventoryData,
    donationsData,
    requestsData,
    movementsData,
    comparisonData,
    deposits,
    loading,
    error,
    refreshData
  };
}