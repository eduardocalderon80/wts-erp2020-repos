using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class EstiloxTrimColor
    {
        public int idestilotrimcolor { get; set; }
        public int idestilotrim { get; set; }
        public int idestilo { get; set; }
        public string color { get; set; }
        public string status { get; set; }
        public string comentario { get; set; }
    }
}
