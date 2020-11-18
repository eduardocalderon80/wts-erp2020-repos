using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Facturas
{
    public class FacturaV
    {
        public int idfacturav { get; set; }
        public string serie { get; set; }
        public string numero { get; set; }
        public int idcliente { get; set; }
        public DateTime fechafactura { get; set; }
        public int idbillto { get; set; }
        public int idshipto { get; set; }
        public int idterminos { get; set; }
        public int idcuenta { get; set; }
        public int idshipmode { get; set; }
        public int idconcepto { get; set; }
        public int idotrareferencia { get; set; }
        public string estado { get; set; }
        public string comentarioanulacion { get; set; }

        public decimal importe { get; set; }

        public List<FacturaVDetalle> listafacturavdetalle { get; set; }

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
		public string delivery { get; set; }
    }
}
