using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Programa
    {
		public int IdPrograma { get; set; }

		[Required]
		public int IdCliente { get; set; }

		[Required]
		public string Nombre { get; set; }

		public int Orden { get; set; }

		public DateTime FechaCreacion { get; set; }

		public string UsuarioCreacion { get; set; }

		public DateTime FechaActualizacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public string Ip { get; set; }

		public string HostName { get; set; }

		public int Eliminado { get; set; }

		
		public int IdClienteMarca { get; set; }
		[Required]
		public int IdClienteTemporada { get; set; }
	
		public int IdClienteDivision { get; set; }
		[Required]
		public int IdCatalogo_IdEstado { get; set; }
        [Required]
        public string CodigoTemporada { get; set; }

		public string Marca { get; set; }

		public string Division { get; set; }
		public string IdGrupoPersonal { get; set; }
		public string IdPersonal { get; set; }
	}
}