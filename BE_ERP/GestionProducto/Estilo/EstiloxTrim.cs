using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class EstiloxTrim
    {
        public int idestilotrim { get; set; }
        public int idestilo { get; set; }
        public string descripcion { get; set; }
        public string placement { get; set; }
        public string proveedor { get; set; }
        public string status { get; set; }
        public decimal costo { get; set; }
        public int costouom { get; set; }
        public int costomoneda { get; set; }
        public string comment { get; set; }
        public string codigo { get; set; }
        public string incoterm { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_color { get; set; }
    }
}
