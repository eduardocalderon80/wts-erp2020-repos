using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beASN
    {
        public List<beShipment> Shipments { get; set; }
        public List<beOrder> Orders { get; set; }
        public List<bePack> Packs { get; set; }
        public List<beItem> Items { get; set; }
    }
}
