using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class bePack
    {
        public int Shipment_Code { get; set; }
        public int Order_Code { get; set; }
        public int Pack_Code { get; set; }
        public string UCC_EAN_Code { get; set; }
        public string Package_ID_Number { get; set; }
        public string Code_Items_per_Pack { get; set; }
        public string Mark_Number { get; set; }
        public string SSCC { get; set; }
        public string Fecha_Creacion { get; set; }
        public string Usuario_Creacion { get; set; }
        public string Fecha_Modificacion { get; set; }
        public string Usuario_Modificacion { get; set; }

        // New
        public int IdPackingList { get; set; }
        public int IdPack { get; set; }
        public int IdCarton { get; set; }
        public int NumberOfCartonPack { get; set; }
        public int NumberOfCarton { get; set; }
        public decimal Length { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal NetWeight { get; set; }
        public decimal GrossWeight { get; set; }
        public string Original_PO_Number { get; set; }
        //public int Shipment_Code { get; set; }
        //public int Order_Code { get; set; }
        //public int Pack_Code { get; set; }
        //public string UCC_EAN_Code { get; set; }
        //public string Package_ID_Number { get; set; }
        //public string Code_Items_per_Pack { get; set; }
        //public string Mark_Number { get; set; }
        //public string Parent_Pack_Code { get; set; }
        //public string Fecha_Creacion { get; set; }
        //public string Usuario_Creacion { get; set; }
        //public string Fecha_Modificacion { get; set; }
        //public string Usuario_Modificacion { get; set; }
        //public string SSCC { get; set; }
        public int ShipmentId { get; set; }
        public int OrderId { get; set; }




    }
}
