using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class RequerimientoDetalle_pdchart
    {
        public int idrequerimiento { get; set; }
        public int idestilo { get; set; }
        public string nombreclientecolor { get; set; }
        public string nombreclientetalla { get; set; }
        public int cantidad { get; set; }
        public int cantidadcm { get; set; }
        public string fechacliente { get; set; }
        public string fechafty { get; set; }
        public string fechaactual { get; set; }
    }
}
