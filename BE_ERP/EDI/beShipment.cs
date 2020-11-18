using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beShipment
    {
        public int ShipmentGroupID { get; set; }
        public string Packaging_Type_Code { get; set; }
        public int Shipment_Code { get; set; }
        public int Lading_Qty { get; set; }
        public string Lading_Description { get; set; }
        public decimal Cross_Weight_Kg { get; set; }
        public decimal Cross_Weight_Lb { get; set; }
        public string Route_Type_Code { get; set; }
        public string Shipment_ID_Standard { get; set; }
        public string Transportation_Type_Code { get; set; }
        public string Carrier_Reference { get; set; }
        public string Order_Status_Code { get; set; }
        public string Equipment_Code { get; set; }
        public string Equipment_Initial { get; set; }
        public string Equipment_Number { get; set; }
        public string Seal_Number { get; set; }
        public string Bill_of_lading_number { get; set; }
        public string Carriers_PRO_Invoice_number { get; set; }
        public string Authorization_Shipping { get; set; }
        public DateTime Shipped_Date { get; set; }
        public string Shipped_DateStr { get; set; }
        public DateTime Current_Scheduled_Delivery_Date { get; set; }
        public string Current_Scheduled_Delivery_DateStr { get; set; }
        public string Ship_Method_Code { get; set; }
        public string ShipTo_Name { get; set; }
        public string ShipTo_Code { get; set; }
        public string ShipFrom_Name { get; set; }
        public string ShipFrom_VendorCode { get; set; }
        public string ShipFrom_City { get; set; }
        public string ShipFrom_State { get; set; }
        public string ShipFrom_PostalCode { get; set; }
        public string ID_Negocio { get; set; }
        public string Archivo_EDI { get; set; }
        public string State_Shipment { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public string Usuario_Creacion { get; set; }
        public string Fecha_Modificacion { get; set; }
        public string Usuario_Modificacion { get; set; }
        public string InterchangeControlNumber { get; set; }
        public string ShipmentIdentification { get; set; }
        public string Division_Code { get; set; }
        public List<beOrder> Order { get; set; }
        public List<bePack> Pack { get; set; }
        public List<beItem> Item { get; set; }
        public List<beItem> DefaultItem { get; set; }
    }
}
