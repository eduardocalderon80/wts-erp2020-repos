using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class Temporada
    {
        public int IdTemporada { get; set; }

        [Required]
        public string NombreTemporada { get; set; }
    }
}