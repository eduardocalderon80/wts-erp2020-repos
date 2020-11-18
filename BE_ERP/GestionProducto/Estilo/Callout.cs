using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class Callout
    {
        public int idestilocallout { get; set; }
        public int idestilo { get; set; }
        public string comentario { get; set; }
        public string usuario { get; set; }
        public string fecha { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera_detallecallout { get; set; }
    }
}
