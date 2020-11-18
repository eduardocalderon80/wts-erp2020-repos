using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoMuestra
    {
        public int IdRequerimiento { get; set; }

        [Required]
        public int IdTipoMuestraxCliente { get; set; }

        [Required]
        public int Version { get; set; }

        public string Codigo { get; set; }

        public int IdCliente { get; set; }

        public int IdProveedor { get; set; }

        public int IdEstilo { get; set; }

        public string Descripcion { get; set; }

        public string PO { get; set; }

        public int IdGrupoPersonal { get; set; }

        [Required]
        public int Estado { get; set; }

        public DateTime? FechaEstado { get; set; }

        public string ComentarioEstado { get; set; }

        public string Comentario { get; set; }

        public string UsuarioRegistro { get; set; }

        public DateTime? FechaRegistro { get; set; }

        public string UsuarioInicio { get; set; }

        public DateTime? FechaInicio { get; set; }

        public string UsuarioCierre { get; set; }

        public DateTime? FechaCierre { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public int Eliminado { get; set; }

        public int IdGrupoComercial { get; set; }

        public int IdPrograma { get; set; }

        public DateTime? ExFactoryInicial { get; set; }

        public DateTime? ExFactoryUpdate { get; set; }

        public DateTime? FechaInDC { get; set; }

        public DateTime? ExFactoryReal { get; set; }

        public DateTime? FactroyDate { get; set; }

        public int ExFactoryDateValidate { get; set; }

        public DateTime? FechaAprobacionCliente { get; set; }

        public int EsFacturableCliente { get; set; }
        public int EsFacturableFabrica { get; set; }
        public string IdCatalogo_EstadoFacturacion { get; set; } //// SUS VALORES SON PEN = PENDIENTE, PAR = PARCIAL, COM = COMPLETO
    }
}