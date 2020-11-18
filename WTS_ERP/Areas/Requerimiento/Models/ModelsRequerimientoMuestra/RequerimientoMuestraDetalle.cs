using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoMuestraDetalle
    {
        public int IdRequerimientoDetalle { get; set; }

        public int IdRequerimiento { get; set; }

        [Required]
        public int IdClienteColor { get; set; }

        [Required]
        public int IdClienteTalla { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        public int CantidadCM { get; set; }

        public int CantidadDespacho { get; set; }

        public int CantidadCMDespacho { get; set; }

        public DateTime? FechaFTY { get; set; }

        public DateTime? FechaCliente { get; set; }

        public DateTime? FechaActual { get; set; }

        public DateTime? FechaClientIHD { get; set; }

        public int Estado { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public int Eliminado { get; set; }

        public int ConteoRechazoInterno { get; set; }

        public DateTime? FechaFtyMax { get; set; }

        public DateTime? FechaDespacho { get; set; }

        public int IdClienteDireccion { get; set; }

        public DateTime? FechaFTYUpdate { get; set; }
    }
}