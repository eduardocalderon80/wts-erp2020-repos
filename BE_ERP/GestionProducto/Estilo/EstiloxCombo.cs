using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class EstiloxCombo
    {
        public int idestilocombo { get; set; }
        public int idestilo { get; set; }
        public string descripcion { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_color { get; set; }
    }
}
