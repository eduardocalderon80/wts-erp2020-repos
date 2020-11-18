using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class EstiloxArte
    {
        public int idestiloarte { get; set; }
        public int idestilo { get; set; }
        public string descripcion { get; set; }
        public string placement { get; set; }
        public string technique { get; set; }
        public string comment { get; set; }
        public int idproveedor { get; set; }
        public string status { get; set; }
        public decimal costo { get; set; }
        public int costomoneda { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_color { get; set; }
        public string nombreproveedor { get; set; }
    }
}
