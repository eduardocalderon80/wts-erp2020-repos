using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.ServicioPackingList
{
    public class ServicioPackingListPack
    {
        public int IdServicioPackingList { get; set; }
        public int IdServicioPackingListPack { get; set; }
        public string CpOrder { get; set; }
        public int BoxNumber { get; set; }
        public int TotalPCS { get; set; }
        public decimal NetWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Boxes { get; set; }
        public List<ServicioPackingListPackItem> PackItems { get; set; }
        public int QtyPerPack { get; set; }
    }
}
