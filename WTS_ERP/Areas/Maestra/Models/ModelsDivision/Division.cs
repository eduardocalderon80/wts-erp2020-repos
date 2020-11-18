using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Models
{
    public class Division
    {
        public int IdDivision { get; set; }
        [Required]
        public string NombreDivision { get; set; }
    }
}