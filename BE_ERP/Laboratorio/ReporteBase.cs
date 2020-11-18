using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Laboratorio
{
   public class ReporteBase
    {
        public string iddetalle { get; set; }
        public int idgrupo { get; set; }
        public string grupo { get; set; }
        public string formatogrupo { get; set; }
        public int columnagrupo { get; set; }
        public string campo { get; set; }
        public string formato { get; set; }
        public string estitulo { get; set; }
        public int repeater { get; set; }
        public int orden { get; set; }
    }
}
