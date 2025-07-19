import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText, TrendingUp, Package, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Componentes de gráficas
import InventoryChart from "@/components/reports/InventoryChart";
import DonationsChart from "@/components/reports/DonationsChart";
import RequestsChart from "@/components/reports/RequestsChart";
import MovementsChart from "@/components/reports/MovementsChart";
import ComparisonChart from "@/components/reports/ComparisonChart";

// Componentes de tablas
import DonationsTable from "@/components/reports/DonationsTable";
import RequestsTable from "@/components/reports/RequestsTable";
import InventoryTable from "@/components/reports/InventoryTable";

// Hooks customizados
import { useReportData } from "@/hooks/useReportData";

export default function Reportes() {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedDeposit, setSelectedDeposit] = useState<string>("all");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const { 
    inventoryData, 
    donationsData, 
    requestsData, 
    movementsData,
    comparisonData,
    deposits,
    loading,
    error,
    refreshData
  } = useReportData({
    dateFrom,
    dateTo,
    depositId: selectedDeposit !== "all" ? selectedDeposit : undefined,
    userType: selectedUserType !== "all" ? selectedUserType : undefined,
    status: selectedStatus !== "all" ? selectedStatus : undefined
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Error al cargar los datos de reportería",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleExportReport = async (reportType: string) => {
    try {
      // Aquí implementarías la lógica de exportación
      toast({
        title: "Exportando reporte",
        description: `Generando reporte de ${reportType}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al exportar el reporte",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedDeposit("all");
    setSelectedUserType("all");
    setSelectedStatus("all");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reportería</h1>
            <p className="text-muted-foreground">
              Dashboard de análisis y reportes del sistema de donaciones
            </p>
          </div>
          <Button onClick={refreshData} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Datos"}
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Filtros de Reportes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Fecha Desde */}
              <div className="space-y-2">
                <Label>Fecha Desde</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Hasta */}
              <div className="space-y-2">
                <Label>Fecha Hasta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Depósito */}
              <div className="space-y-2">
                <Label>Depósito</Label>
                <Select value={selectedDeposit} onValueChange={setSelectedDeposit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los depósitos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los depósitos</SelectItem>
                    {deposits.map((deposit) => (
                      <SelectItem key={deposit.id_deposito} value={deposit.id_deposito}>
                        {deposit.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Usuario */}
              <div className="space-y-2">
                <Label>Tipo de Usuario</Label>
                <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="donante">Donante</SelectItem>
                    <SelectItem value="beneficiario">Beneficiario</SelectItem>
                    <SelectItem value="distribuidor">Distribuidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botón Limpiar Filtros */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventario</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryData?.reduce((sum, item) => sum + (item.cantidad_disponible || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                productos en stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donaciones del Período</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donationsData?.length.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                donaciones registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requestsData?.filter(req => req.estado === 'pendiente').length.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                solicitudes en espera
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set([
                  ...(donationsData?.map(d => d.id_usuario) || []),
                  ...(requestsData?.map(r => r.usuario_id) || [])
                ]).size.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                usuarios participantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal con Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="donations">Donaciones</TabsTrigger>
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventario por Depósito</CardTitle>
                </CardHeader>
                <CardContent>
                  <InventoryChart data={inventoryData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donaciones vs Solicitudes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComparisonChart data={comparisonData} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Donaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <DonationsChart data={donationsData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado de Solicitudes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RequestsChart data={requestsData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Inventario */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Inventario Actual</h3>
              <Button onClick={() => handleExportReport('inventario')}>
                Exportar Inventario
              </Button>
            </div>
            <InventoryTable data={inventoryData} />
          </TabsContent>

          {/* Tab: Donaciones */}
          <TabsContent value="donations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Historial de Donaciones</h3>
              <Button onClick={() => handleExportReport('donaciones')}>
                Exportar Donaciones
              </Button>
            </div>
            <DonationsTable data={donationsData} />
          </TabsContent>

          {/* Tab: Solicitudes */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gestión de Solicitudes</h3>
              <Button onClick={() => handleExportReport('solicitudes')}>
                Exportar Solicitudes
              </Button>
            </div>
            <RequestsTable data={requestsData} />
          </TabsContent>

          {/* Tab: Movimientos */}
          <TabsContent value="movements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Movimientos de Inventario</h3>
              <Button onClick={() => handleExportReport('movimientos')}>
                Exportar Movimientos
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Movimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <MovementsChart data={movementsData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}