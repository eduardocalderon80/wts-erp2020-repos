using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class beCartonDetail
    {
        public int IdPackingList { get; set; }
        public int IdPackingListCarton { get; set; }
        public int IdPackingListCartonDetail { get; set; }
        public string PO { get; set; }
        public string Style { get; set; }
        public string BuyerStyle { get; set; }
        public string Lote { get; set; }
        public string Descripcion { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public int Qty { get; set; }
    }
}
