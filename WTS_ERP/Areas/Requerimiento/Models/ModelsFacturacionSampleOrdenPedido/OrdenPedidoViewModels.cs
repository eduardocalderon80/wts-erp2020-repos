using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class OrdenPedidoViewModels : OrdenPedido
    {
        public string Usuario { get; set; }
        public int IdCliente { get; set; }

        //// PARA EL DETALLE
        public string OrdenPedidoDetalle { get; set; }  //// ESTO VIENE EN FORMATO JSON

        /// <summary>
        /// PROPIEDADES AGREGADAS PARA EL REPORTE DE PO
        /// </summary>
        public string EmpresaJSON { get; set; }
        public string ProveedorJSON { get; set; }
		public string ClienteJSON { get; set; }

        public int TotalPOCantidad { get; set; }

        public string TotalPOCosto_Cadena { get; set; }

        public string Terms { get; set; }

        public string RequerimientoMuestraJSON { get; set; }
    }
}