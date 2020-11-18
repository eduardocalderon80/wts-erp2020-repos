using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class FacturaFabricaDetalle
    {
        public int IdFacturaFabricaDetalle { get; set; }
        public int IdOrdenPedido { get; set; }
        public int IdOrdenPedidoDetalle { get; set; }
        public int IdRequerimiento { get; set; }
        public int IdRequerimientoDetalle { get; set; }

        public int EsContramuestraFacturableCliente { get; set; }
        public int CantidadMuestraFacturable        { get; set; }
        public decimal PrecioMuestra { get; set; }
        public int CantidadContraMuestraFacturable  { get; set; }
        public decimal PrecioContraMuestra { get; set; }
        public string HistorialJSON { get; set; }
        public string UsuarioCreacion { get; set; }
        public string UsuarioActualizacion { get; set; }
        public string FechaCreacion { get; set; }
        public string FechaActualizacion { get; set; }
        public string Ip { get; set; }
        public string HostName { get; set; }
        public int Eliminado { get; set; }
    }
}