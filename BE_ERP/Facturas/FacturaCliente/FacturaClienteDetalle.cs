using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Facturas
{
    public class FacturaClienteDetalle
    {
        // CAMPOS ADICIONALES: DATOS PARA STICKER
        public string numero_po { get; set; }
        public string style { get; set; }
        public string descripcionestilo { get; set; }
        public string contenido_tela { get; set; }
        public string colores { get; set; }
        public string division { get; set; }
        public decimal cantidad { get; set; }
        public decimal preciounitario { get; set; }
        public decimal importetotal { get; set; }
        
        public int idpackinglist { get; set; }
    }
}
