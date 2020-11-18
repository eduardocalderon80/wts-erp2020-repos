using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class FacturaFabrica
    {
        public int IdFacturaFabrica { get; set; }
        [Required]
        [Range(1, 1000000)]
        public int IdOrdenPedido { get; set; }

        [Required]
        [Range(1, 1000000)]
        public int IdPrograma { get; set; }

        [Required]
        [Range(1, 1000000)]
        public int IdProveedor { get; set; }
        [Required]
        public string Serie_FacturaFabrica { get; set; }
        [Required]
        public string Numero_FacturaFabrica { get; set; }
        [Required]
        public string FechaGeneracion { get; set; }
        public string Observacion { get; set; }
        public int Estado { get; set; }
        public string UsuarioCreacion { get; set; }
        public string UsuarioActualizacion { get; set; }
        public string FechaCreacion { get; set; }
        public string FechaActualizacion  { get; set; }
        public string Ip { get; set; }
        public string HostName { get; set; }
        public int Eliminado { get; set; }
    }
}