using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beItem
    {
        public int Shipment_Code { get; set; }
        public int Order_Code { get; set; }
        public int Pack_Code { get; set; }
        public int Item_Code { get; set; }
        public string Product_Code { get; set; }
        public string Vendor_Style { get; set; }
        public string Buyer_Style { get; set; }
        public string Buyer_Size { get; set; }
        public string Vendor_Color { get; set; }
        public string Buyer_Color { get; set; }
        public int Quantity_Shipped { get; set; }
        public string UOM_Quantity_Shipped { get; set; }
        public int Quantity_Ordered { get; set; }
        public string UOM_Quantity_Ordered { get; set; }
        public int Inner_Pack { get; set; }
        public int Size_Ratio { get; set; }
        public string UOM_Size_Ratio { get; set; }
        public string Kind_Of_Packed { get; set; }
        public string Vendor_Size { get; set; }
        public string Fecha_Creacion { get; set; }
        public string Usuario_Creacion { get; set; }
        public string Fecha_Modificacion { get; set; }
        public string Usuario_Modificacion { get; set; }

        //New
        public int IdPackingList { get; set; }
        public int IdPackDetail { get; set; }
        public int IdPack { get; set; }
        public string Po { get; set; }
        public string Estilo { get; set; }
        public string Lote { get; set; }
        //public int Shipment_Code { get; set; }
        //public int Order_Code { get; set; }
        //public int Pack_Code { get; set; }
        //public int Item_Code { get; set; }
        //public string Product_Code { get; set; }
        //public string Vendor_Style { get; set; }
        //public string Buyer_Style { get; set; }
        //public string Buyer_Size { get; set; }
        //public string Vendor_Color { get; set; }
        //public string Buyer_Color { get; set; }
        //public int Quantity_Shipped { get; set; }
        //public string UOM_Quantity_Shipped { get; set; }
        //public int Quantity_Ordered { get; set; }
        //public string UOM_Quantity_Ordered { get; set; }
        //public int Inner_Pack { get; set; }
        //public int Size_Ratio { get; set; }
        //public string UOM_Size_Ratio { get; set; }
        //public string Vendor_Size { get; set; }
        //public string Fecha_Creacion { get; set; }
        //public string Usuario_Creacion { get; set; }
        //public string Fecha_Modificacion { get; set; }
        //public string Usuario_Modificacion { get; set; }
        public decimal GrossWeight { get; set; }

        public string Po_Number { get; set; }
        public string PackCharacter { get; set; }
    }
}
