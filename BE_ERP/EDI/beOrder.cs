using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beOrder
    {
        public int Shipment_Code { get; set; }
        public int Order_Code { get; set; }
        public string Original_PO_Number { get; set; }
        //public DateTime PO_Date { get; set; }
        public string Packaging_Type_Code { get; set; }
        public int Lading_Qty { get; set; }
        public decimal Cross_Weight_Kg { get; set; }
        public decimal Cross_Weight_Lb { get; set; }
        public string Invoice_Number { get; set; }
        public string Buying_Party_Name { get; set; }
        public string Buying_Party_Code { get; set; }
        public string Division_Code { get; set; }
        public string Fecha_Creacion { get; set; }
        public string Usuario_Creacion { get; set; }
        public string Fecha_Modificacion { get; set; }
        public string Usuario_Modificacion { get; set; }

        //New
        public int ShipmentId { get; set; }
        public int IdPackingList { get; set; }
        public string Po { get; set; }
        public string Estilo { get; set; }
        public string Lote { get; set; }
        public string DepartmentCode { get; set; }
        public string VendorCode { get; set; }
        public decimal PrendasRequeridas { get; set; }
        public int InnerPerPack { get; set; }
      
        public string PO_Number { get; set; }
        public string PO_Date { get; set; }
        public DateTime PO_DateDT { get; set; }
        //public string Packaging_Type_Code { get; set; }
        //public int Lading_Qty { get; set; }
        //public decimal Cross_Weight_Kg { get; set; }
        //public decimal Cross_Weight_Lb { get; set; }
        //public string Invoice_Number { get; set; }
        //public string Buying_Party_Name { get; set; }
        //public string Buying_Party_Code { get; set; }
        //public string Fecha_Creacion { get; set; }
        //public string Usuario_Creacion { get; set; }
        //public string Fecha_Modificacion { get; set; }
        //public string Usuario_Modificacion { get; set; }
        //public string Division_Code { get; set; }
        public DateTime CancelDate { get; set; }
    }
}
