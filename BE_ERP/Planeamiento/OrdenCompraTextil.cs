using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Planeamiento
{
    public class OrdenCompraTextil
    {
        public string po { get; set; }
        public string estilo { get; set; }
        public string lote { get; set; }
        public string color { get; set; }
        public string cantidad { get; set; }
        public string fecha_creacion { get; set; }
        public string dias_sinoct { get; set; }
        public string fecha_fab_original { get; set; }
        public string leadtime_fabrica { get; set; }
        public string tela { get; set; }
        public string fabrica { get; set; }
        public string cliente { get; set; }
        public string vendedor { get; set; }
        public string division { get; set; }
        public string temporada { get; set; }
        public string descripcion { get; set; }
        public string controller { get; set; }
        public string envio { get; set; }
        public string oc { get; set; }
        public string proveedortela { get; set; }
        public string fechaoc { get; set; }
    }
}
