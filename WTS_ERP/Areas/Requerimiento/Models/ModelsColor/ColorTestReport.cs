using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class ColorTestReport
    {    
        public int IdReportTest { get; set; }

        public string TestCode { get; set; }

        public string ColorCode { get; set; }

        public string EstadoReportTest { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }
    }
}