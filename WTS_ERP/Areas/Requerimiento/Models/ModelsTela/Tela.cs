using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Tela
    {
        public int IdRequerimientoTela { get; set; }
        public int IdRequerimiento { get; set; }
        public int IdPrograma { get; set; }
        public string ImagenOriginal { get; set; }

        public string ImagenNombre { get; set; }

        public string ImagenWebNombre { get; set; }

        public string TipoRequerimiento { get; set; }

        public string Duenio { get; set; }

        public string Codigo { get; set; }

        public string Descripcion { get; set; }

        public string ReporteAtx { get; set; }

        public string ReporteLaboratorio { get; set; }

        public string NombreComercial { get; set; }

        public string Categoria { get; set; }

        public string Estructura { get; set; }

        public string Densidad { get; set; }

        public string TipoLavado { get; set; }

        public string TituloHilado { get; set; }

        public string Contenido { get; set; }

        public string ColorCliente { get; set; }

        public string TipoProveedorDirecto { get; set; }

        public string ProveedorDirecto { get; set; }

        public string TipoProveedor { get; set; }

        public string Proveedor { get; set; }

        public string CodigoProveedor { get; set; }

        public string NumeroBulk { get; set; }

        public string Nota { get; set; }

        public string DocOriginal { get; set; }

        public string DocNombre { get; set; }

        public string DocWebNombre { get; set; }

        public string FechaCreacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public int IdCliente { get; set; }

        public string IdRol { get; set; }

        public string IdPerfil { get; set; }

        public string IdPersonal { get; set; }

        public string IdUsuario { get; set; }

        public int ActualizarImagen { get; set; }
        public int ActualizarDoc { get; set; }
    }
}