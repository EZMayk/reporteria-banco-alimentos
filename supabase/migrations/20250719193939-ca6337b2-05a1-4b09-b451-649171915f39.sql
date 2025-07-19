-- Crear tabla de usuarios
CREATE TABLE public.usuarios (
  id uuid NOT NULL,
  rol text,
  tipo_persona text,
  nombre text,
  ruc text,
  cedula text,
  direccion text,
  telefono text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  representante text,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

-- Crear tabla de depósitos
CREATE TABLE public.depositos (
  id_deposito uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  CONSTRAINT depositos_pkey PRIMARY KEY (id_deposito)
);

-- Crear tabla de productos donados
CREATE TABLE public.productos_donados (
  id_producto uuid NOT NULL DEFAULT gen_random_uuid(),
  id_usuario uuid,
  nombre_producto text,
  descripcion text,
  fecha_donacion timestamp with time zone DEFAULT now(),
  cantidad numeric,
  unidad_medida text,
  fecha_caducidad timestamp with time zone,
  CONSTRAINT productos_donados_pkey PRIMARY KEY (id_producto),
  CONSTRAINT productos_donados_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id)
);

-- Crear tabla de solicitudes
CREATE TABLE public.solicitudes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  tipo_alimento text NOT NULL,
  cantidad numeric NOT NULL,
  comentarios text,
  latitud double precision,
  longitud double precision,
  estado text DEFAULT 'pendiente'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT solicitudes_pkey PRIMARY KEY (id),
  CONSTRAINT solicitudes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

-- Crear tabla de inventario
CREATE TABLE public.inventario (
  id_inventario uuid NOT NULL DEFAULT gen_random_uuid(),
  id_deposito uuid NOT NULL,
  id_producto uuid NOT NULL,
  cantidad_disponible numeric NOT NULL DEFAULT 0,
  fecha_actualizacion timestamp without time zone DEFAULT now(),
  CONSTRAINT inventario_pkey PRIMARY KEY (id_inventario),
  CONSTRAINT inventario_id_deposito_fkey FOREIGN KEY (id_deposito) REFERENCES public.depositos(id_deposito),
  CONSTRAINT inventario_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos_donados(id_producto)
);

-- Crear tabla de detalles de solicitud
CREATE TABLE public.detalles_solicitud (
  id_detalle uuid NOT NULL DEFAULT gen_random_uuid(),
  id_solicitud uuid,
  id_producto uuid,
  cantidad_solicitada numeric,
  cantidad_entregada numeric,
  CONSTRAINT detalles_solicitud_pkey PRIMARY KEY (id_detalle),
  CONSTRAINT detalles_solicitud_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos_donados(id_producto),
  CONSTRAINT detalles_solicitud_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES public.solicitudes(id)
);

-- Crear tabla de movimiento inventario cabecera
CREATE TABLE public.movimiento_inventario_cabecera (
  id_movimiento uuid NOT NULL DEFAULT gen_random_uuid(),
  fecha_movimiento timestamp without time zone DEFAULT now(),
  id_donante uuid NOT NULL,
  id_solicitante uuid NOT NULL,
  estado_movimiento text NOT NULL CHECK (estado_movimiento = ANY (ARRAY['pendiente'::text, 'completado'::text, 'donado'::text])),
  observaciones text,
  CONSTRAINT movimiento_inventario_cabecera_pkey PRIMARY KEY (id_movimiento),
  CONSTRAINT movimiento_inventario_cabecera_id_donante_fkey FOREIGN KEY (id_donante) REFERENCES public.usuarios(id),
  CONSTRAINT movimiento_inventario_cabecera_id_solicitante_fkey FOREIGN KEY (id_solicitante) REFERENCES public.usuarios(id)
);

-- Crear tabla de movimiento inventario detalle
CREATE TABLE public.movimiento_inventario_detalle (
  id_detalle uuid NOT NULL DEFAULT gen_random_uuid(),
  id_movimiento uuid NOT NULL,
  id_producto uuid NOT NULL,
  cantidad numeric NOT NULL,
  tipo_transaccion text NOT NULL CHECK (tipo_transaccion = ANY (ARRAY['ingreso'::text, 'egreso'::text, 'baja'::text])),
  rol_usuario text NOT NULL CHECK (rol_usuario = ANY (ARRAY['donante'::text, 'beneficiario'::text, 'distribuidor'::text])),
  observacion_detalle text,
  CONSTRAINT movimiento_inventario_detalle_pkey PRIMARY KEY (id_detalle),
  CONSTRAINT movimiento_inventario_detalle_id_movimiento_fkey FOREIGN KEY (id_movimiento) REFERENCES public.movimiento_inventario_cabecera(id_movimiento),
  CONSTRAINT movimiento_inventario_detalle_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos_donados(id_producto)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depositos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos_donados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimiento_inventario_cabecera ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimiento_inventario_detalle ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas para permitir acceso a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver usuarios" 
ON public.usuarios FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver depósitos" 
ON public.depositos FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver productos donados" 
ON public.productos_donados FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver solicitudes" 
ON public.solicitudes FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver inventario" 
ON public.inventario FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver detalles de solicitud" 
ON public.detalles_solicitud FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver movimientos de inventario cabecera" 
ON public.movimiento_inventario_cabecera FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuarios autenticados pueden ver movimientos de inventario detalle" 
ON public.movimiento_inventario_detalle FOR SELECT 
TO authenticated 
USING (true);