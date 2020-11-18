using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Facturas
{
    public class FacturaCliente
    {
        public int idfacturacliente { get; set; }
        // CAMPOS ADICIONALES: DATOS PARA STICKER
        public string numerofactura { get; set; }

        public string strfechafacturasticker { get; set; }
        public string direccionwtssticker { get; set; }
        public string titulosticker { get; set; }
        public string sticker { get; set; }
        public string concepto { get; set; }

        public string terminospago { get; set; }

        public string otrasreferencias { get; set; }

        public string billto { get; set; }
        public string shipto { get; set; }
        public string shipmode { get; set; }
        public string observacion { get; set; }
        public string footleft { get; set; }
        public string footright { get; set; } 
        public string footfinal { get; set; }
        public string store { get; set; }
        public int factor { get; set; }

        public string comentarioanulacion { get; set; }
        public decimal importe { get; set; }
        public string strfechaactualizacion { get; set; }
        public string usuarioactualizacion { get; set; }

        public List<FacturaClienteDetalle> listafacturaclientedetalle { get; set; }
    }
}
