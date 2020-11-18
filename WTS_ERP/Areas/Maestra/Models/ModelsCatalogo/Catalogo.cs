using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class Catalogo
    {
		public int IdCatalogo { get; set; }

		public int IdTipoCatalogo { get; set; }

		public string CodCatalogo { get; set; }

		public string Nombre { get; set; }

		public string Descripcion { get; set; }

		public DateTime FechaCreacion { get; set; }

		public DateTime FechaActualizacion { get; set; }

		public string UsuarioCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }

		public int Eliminado { get; set; }

		public int Visible { get; set; }

		public string Abreviatura { get; set; }

		public int orden { get; set; }
	}
}