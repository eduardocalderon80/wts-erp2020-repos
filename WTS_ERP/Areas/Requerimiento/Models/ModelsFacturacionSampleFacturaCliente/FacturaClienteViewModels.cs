using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class FacturaClienteViewModels : FacturaCliente
    {
        public string Usuario { get; set; }
        public int IdCliente { get; set; }
        public int Actualizar_File_CertificadoOrigen { get; set; }
	    public int Actualizar_File_DeclaracionJurada { get; set; }
        public int Actualizar_File_GuiaAerea { get; set; }
        public int Actualizar_File_PackingList { get; set; }
        public string CadenaListaOrdenPedido { get; set; }

        //// PROPIEDADES AGREGADAS PARA EL REPORTE DE FACTURA
        //// PARA EL DETALLE
        public string FacturaClienteDetalle { get; set; }

        public string Terms { get; set; }
        public int TotalPOCantidad { get; set; }
        public string TotalPOCosto_Cadena { get; set; }
        public string NumeroFacturaCliente { get; set; }
        public string EmpresaJSON { get; set; }
        public string ProveedorJSON { get; set; }
        public string ClienteJSON { get; set; }
        public string RequerimientoMuestraJSON { get; set; }
    }
}