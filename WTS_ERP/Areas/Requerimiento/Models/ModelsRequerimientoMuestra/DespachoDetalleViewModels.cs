using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class DespachoDetalleViewModels : DespachoDetalle
    {
        [Required]
        [Range(1, 1000000)]
        public int IdRequerimiento { get; set; }
    }
}