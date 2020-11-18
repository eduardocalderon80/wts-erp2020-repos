using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class ClienteTemporada : Temporada
    {
		public int IdClienteTemporada { get; set; }

        [Required]
		public int IdCliente { get; set; }
        
		public string CodigoClienteTemporada { get; set; }

		public int Anio { get; set; }

		public DateTime FechaCreacion { get; set; }

		public DateTime FechaActualizacion { get; set; }

		public string UsuarioCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }

		public int Eliminado { get; set; }
	}
}