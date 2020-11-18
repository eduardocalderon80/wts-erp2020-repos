using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory.ServicioPackingList
{
    public class ServicioPackingList
    {
        public int IdServicioPackingList { get; set; }
        public int IdProveedor { get; set; }
        public int IdCliente { get; set; }
        public string Brand { get; set; }
        public string NumeroPacking { get; set; }
        public string PO { get; set; }
        public string StoreNumber { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public DateTime Date { get; set; }
        public string DateStr
        {
            get
            {
                return Date.ToShortDateString();
            }
        }
        public string Invoice { get; set; }
        public string EmptyField { get; set; }
        public string ListaDatos { get; set; }
        public string NombreCliente { get; set; }
        public string NombreProveedor { get; set; }
        public string DireccionProveedor { get; set; }
        public List<ServicioPackingListPack> Pack { get; set; }
        public List<ServicioPackingListBox> Box { get; set; }
        public List<ServicioPackingListBoxDetail> BoxDetail { get; set; }
        public List<ServicioPackingListReporteDetalle> ReporteDetalle { get; set; }
        public List<ServicioPackingListPackItem> PackItem { get; set; }

        //inicio luis Albarracin
        public string xData { get; set; }
        public string xDataoShippingAnalysisPO { get; set; }
        public string aCabecerasoShippingAnalysisPO { get; set; }
        //fin Luis Albarracin

    }
}
