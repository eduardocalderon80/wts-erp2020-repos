using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Actividad
    {
		public int IdActividad { get; set; }

		public string NombreActividad { get; set; }

		public int Eliminado { get; set; }

		public string UsuarioCreacion { get; set; }

		public string FechaCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string FechaActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }
	}
}