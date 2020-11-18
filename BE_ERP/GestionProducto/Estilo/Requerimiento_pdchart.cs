using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto
{
    public class Requerimiento_pdchart
    {
        public int idrequerimiento { get; set; }
        public int idestilo { get; set; }
        public string nombreproveedor { get; set; }
        public string comentarioadicional { get; set; }
        public string comentarioestado { get; set; }
        public string fechaestadorequerimiento { get; set; }
        public string nombreestado { get; set; }
        public int version { get; set; }
        public int total_label { get; set; }
        public int indicecolumna_dondeempieza_apintar { get; set; }
        public string titulos_cabecera { get; set; }
        public string titulos_cabecera_color { get; set; }
        public string nombretipomuestra { get; set; }
        public string titulos_cabecera_comentario { get; set; }
    }
}
