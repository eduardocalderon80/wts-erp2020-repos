using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.ServicioPackingList
{
    public class ServicioPackingListPackItem
    {
        public int IdServicioPackingList { get; set; }
        public int IdServicioPackingListPack { get; set; }
        public int IdServicioPackingListPackItem { get; set; }
        public string Style { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public int SizeOrder { get; set; }
        public int IdColor { get; set; }
        public int IdSize { get; set; }
        public int Qty { get; set; }
        public string Descripcion { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Boxes { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal NetWeight { get; set; }
        public int Orden { get; set; }
    }
}
