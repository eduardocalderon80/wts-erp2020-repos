using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.ServicioPackingList
{
    public class ServicioPackingListReporteDetalle
    {
        public int BoxNumber { get; set; }
        public string CPOrder { get; set; }
        public string Style { get; set; }
        public string Color { get; set; }
        public string Size { get; set; }
        public int QTY { get; set; }
        public int TotalPCS { get; set; }
        public decimal NetWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public string Descripcion { get; set; }
        public int TotalBoxes { get; set; }
        public string StoreNumber { get; set; }
        public int Orden { get; set; }
        public string PO { get; set; }
        public string NumeroPacking { get; set; }
        public int Length { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public int IdServicioPackingListPack { get; set; }
    }
}
