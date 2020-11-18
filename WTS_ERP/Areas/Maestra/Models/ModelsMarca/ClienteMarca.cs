using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class ClienteMarca : Marca
    {
		public int IdClienteMarca { get; set; }
        [Required]
		public int IdCliente { get; set; }
	}
}