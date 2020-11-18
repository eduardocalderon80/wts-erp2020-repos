using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class FichaTecnica
    {
        public int idfichatecnica { get; set; }
        public string codigotela { get; set; }
        public string peso { get; set; }
        public string titulo { get; set; }
        public string nombrefamilia { get; set; }
        public string lavado { get; set; }
        public string nombretela { get; set; }
        public string nombreproveedor { get; set; }
        public string origen { get; set; }
        public int orden { get; set; }
        public string placement { get; set; }
        public string comentario { get; set; }
        public int idestilo { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_proyectotela_proceso { get; set; }
        public string titulos_cabecera_telacolor { get; set; }
        public string estadotela { get; set; }
    }
}
