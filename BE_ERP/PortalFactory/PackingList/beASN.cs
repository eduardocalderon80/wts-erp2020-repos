using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class beASN
    {
        public List<bePackingListDetalle> ListaDetalle { get; set; }
        public List<bePackingListDetalleCarton> Carton { get; set; }
        //public beShipmentEDI Shipment { get; set; } Coming soon
    }
}
