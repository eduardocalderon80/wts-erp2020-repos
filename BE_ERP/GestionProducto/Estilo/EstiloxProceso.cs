using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class EstiloxProceso
    {
        public int idestiloproceso { get; set; }
        public int idestilo { get; set; }
        public string descripcion { get; set; }
        public int idproveedor { get; set; }
        public string status { get; set; }
        public string comentario { get; set; }
        public decimal costo { get; set; }
        public int costouom { get; set; }
        public int costomoneda { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_color { get; set; }
        public string nombreproveedor { get; set; }
    }
}
