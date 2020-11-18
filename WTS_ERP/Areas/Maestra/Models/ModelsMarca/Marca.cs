using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class Marca
    {
		public int IdMarca { get; set; }

        [Required]
		public string NombreMarca { get; set; }

		public string UsuarioCreacion { get; set; }

		public string UsuarioActualizacion { get; set; }

		public DateTime FechaCreacion { get; set; }

		public DateTime FechaActualizacion { get; set; }
	}
}