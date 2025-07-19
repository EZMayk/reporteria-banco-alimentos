export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      depositos: {
        Row: {
          descripcion: string | null
          id_deposito: string
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          id_deposito?: string
          nombre: string
        }
        Update: {
          descripcion?: string | null
          id_deposito?: string
          nombre?: string
        }
        Relationships: []
      }
      detalles_solicitud: {
        Row: {
          cantidad_entregada: number | null
          cantidad_solicitada: number | null
          id_detalle: string
          id_producto: string | null
          id_solicitud: string | null
        }
        Insert: {
          cantidad_entregada?: number | null
          cantidad_solicitada?: number | null
          id_detalle?: string
          id_producto?: string | null
          id_solicitud?: string | null
        }
        Update: {
          cantidad_entregada?: number | null
          cantidad_solicitada?: number | null
          id_detalle?: string
          id_producto?: string | null
          id_solicitud?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detalles_solicitud_id_producto_fkey"
            columns: ["id_producto"]
            isOneToOne: false
            referencedRelation: "productos_donados"
            referencedColumns: ["id_producto"]
          },
          {
            foreignKeyName: "detalles_solicitud_id_solicitud_fkey"
            columns: ["id_solicitud"]
            isOneToOne: false
            referencedRelation: "solicitudes"
            referencedColumns: ["id"]
          },
        ]
      }
      inventario: {
        Row: {
          cantidad_disponible: number
          fecha_actualizacion: string | null
          id_deposito: string
          id_inventario: string
          id_producto: string
        }
        Insert: {
          cantidad_disponible?: number
          fecha_actualizacion?: string | null
          id_deposito: string
          id_inventario?: string
          id_producto: string
        }
        Update: {
          cantidad_disponible?: number
          fecha_actualizacion?: string | null
          id_deposito?: string
          id_inventario?: string
          id_producto?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventario_id_deposito_fkey"
            columns: ["id_deposito"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id_deposito"]
          },
          {
            foreignKeyName: "inventario_id_producto_fkey"
            columns: ["id_producto"]
            isOneToOne: false
            referencedRelation: "productos_donados"
            referencedColumns: ["id_producto"]
          },
        ]
      }
      movimiento_inventario_cabecera: {
        Row: {
          estado_movimiento: string
          fecha_movimiento: string | null
          id_donante: string
          id_movimiento: string
          id_solicitante: string
          observaciones: string | null
        }
        Insert: {
          estado_movimiento: string
          fecha_movimiento?: string | null
          id_donante: string
          id_movimiento?: string
          id_solicitante: string
          observaciones?: string | null
        }
        Update: {
          estado_movimiento?: string
          fecha_movimiento?: string | null
          id_donante?: string
          id_movimiento?: string
          id_solicitante?: string
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimiento_inventario_cabecera_id_donante_fkey"
            columns: ["id_donante"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimiento_inventario_cabecera_id_solicitante_fkey"
            columns: ["id_solicitante"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movimiento_inventario_detalle: {
        Row: {
          cantidad: number
          id_detalle: string
          id_movimiento: string
          id_producto: string
          observacion_detalle: string | null
          rol_usuario: string
          tipo_transaccion: string
        }
        Insert: {
          cantidad: number
          id_detalle?: string
          id_movimiento: string
          id_producto: string
          observacion_detalle?: string | null
          rol_usuario: string
          tipo_transaccion: string
        }
        Update: {
          cantidad?: number
          id_detalle?: string
          id_movimiento?: string
          id_producto?: string
          observacion_detalle?: string | null
          rol_usuario?: string
          tipo_transaccion?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimiento_inventario_detalle_id_movimiento_fkey"
            columns: ["id_movimiento"]
            isOneToOne: false
            referencedRelation: "movimiento_inventario_cabecera"
            referencedColumns: ["id_movimiento"]
          },
          {
            foreignKeyName: "movimiento_inventario_detalle_id_producto_fkey"
            columns: ["id_producto"]
            isOneToOne: false
            referencedRelation: "productos_donados"
            referencedColumns: ["id_producto"]
          },
        ]
      }
      productos_donados: {
        Row: {
          cantidad: number | null
          descripcion: string | null
          fecha_caducidad: string | null
          fecha_donacion: string | null
          id_producto: string
          id_usuario: string | null
          nombre_producto: string | null
          unidad_medida: string | null
        }
        Insert: {
          cantidad?: number | null
          descripcion?: string | null
          fecha_caducidad?: string | null
          fecha_donacion?: string | null
          id_producto?: string
          id_usuario?: string | null
          nombre_producto?: string | null
          unidad_medida?: string | null
        }
        Update: {
          cantidad?: number | null
          descripcion?: string | null
          fecha_caducidad?: string | null
          fecha_donacion?: string | null
          id_producto?: string
          id_usuario?: string | null
          nombre_producto?: string | null
          unidad_medida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_donados_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes: {
        Row: {
          cantidad: number
          comentarios: string | null
          created_at: string | null
          estado: string | null
          id: string
          latitud: number | null
          longitud: number | null
          tipo_alimento: string
          usuario_id: string
        }
        Insert: {
          cantidad: number
          comentarios?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          tipo_alimento: string
          usuario_id: string
        }
        Update: {
          cantidad?: number
          comentarios?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          latitud?: number | null
          longitud?: number | null
          tipo_alimento?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          cedula: string | null
          created_at: string | null
          direccion: string | null
          id: string
          nombre: string | null
          representante: string | null
          rol: string | null
          ruc: string | null
          telefono: string | null
          tipo_persona: string | null
          updated_at: string | null
        }
        Insert: {
          cedula?: string | null
          created_at?: string | null
          direccion?: string | null
          id: string
          nombre?: string | null
          representante?: string | null
          rol?: string | null
          ruc?: string | null
          telefono?: string | null
          tipo_persona?: string | null
          updated_at?: string | null
        }
        Update: {
          cedula?: string | null
          created_at?: string | null
          direccion?: string | null
          id?: string
          nombre?: string | null
          representante?: string | null
          rol?: string | null
          ruc?: string | null
          telefono?: string | null
          tipo_persona?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
