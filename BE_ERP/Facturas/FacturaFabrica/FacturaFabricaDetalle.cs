using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Facturas
{
    public class FacturaFabricaDetalle
    {
        public int IdFacturaFabricaDetalle { get; set; }
        public int IdFacturafabrica { get; set; }
        public int IdPackinglist { get; set; }

        // CAMPOS ADICIONALES: DATOS PARA STICKER
        public string numero_po { get; set; }
        public string style { get; set; }
        public string descripcionestilo { get; set; }
        public string contenido_tela { get; set; }
        public string colores { get; set; }
        public string division { get; set; }
        public int cantidad { get; set; }
        public decimal preciounitario { get; set; }
        public decimal importetotal { get; set; }
    }
}
