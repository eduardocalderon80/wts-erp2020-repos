using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.ServicioPackingList
{
    public class ServicioPackingListBox
    {
        public int IdServicioPackingList { get; set; }
        public int IdServicioPackingListBox { get; set; }
        public string CpOrder { get; set; }
        public int BoxNumber { get; set; }
        public int TotalPCS { get; set; }
        public decimal NetWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public List<ServicioPackingListBoxDetail> Detail { get; set; }
    }
}
