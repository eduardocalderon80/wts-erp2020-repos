using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoxActividad
    {
		public int IdRequerimientoxActividad { get; set; }

        [Required]
        [Range(1, 1000000)]
		public int IdActividad { get; set; }
        [Required]
        [Range(1, 1000000)]
		public int IdRequerimiento { get; set; }

        //[Required]
		public string FechaProgramada { get; set; }

		public string FechaReal { get; set; }

		public string Comentario { get; set; }

        [Required]
        [Range(1, 1000000)]
		public int IdEstado_IdCatalogo { get; set; }

		public int Eliminado { get; set; }

		public string UsuarioCreacion { get; set; }

		public string FechaCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string FechaActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }
        public int Version { get; set; }

    }
}