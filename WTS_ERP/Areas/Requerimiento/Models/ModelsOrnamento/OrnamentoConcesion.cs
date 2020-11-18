using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class OrnamentoConcesion : Ornamento
    {    
        public string IdReportTest { get; set; }

        public string IdContacto { get; set; }

        public string IdGrupoPersonal { get; set; }

        public string Nota { get; set; }

        public string Operacion { get; set; }



    }
}