using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.PackingList
{
    public class beCarton
    {

        public int IdPackingList { get; set; }
        public int IdPackingListCarton { get; set; }
        public int BoxNumber { get; set; }
        public string BoxCode { get; set; }
        public List<beCartonDetail> Detail { get; set; }
    }
}
