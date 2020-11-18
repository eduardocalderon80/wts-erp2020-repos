using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class ClienteDivisionPersonal : Division
    {
		public int IdClienteDivision { get; set; }

        [Required]
		public int IdCliente { get; set; }

		public DateTime FechaCreacion { get; set; }

		public DateTime FechaActualizacion { get; set; }

		public string UsuarioCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }

		public int Eliminado { get; set; }

		public int IdClienteAnterior { get; set; }
	}
}