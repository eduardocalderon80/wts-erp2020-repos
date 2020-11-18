using System;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;

namespace BL_ERP
{
    public class blEdi : blLog
    {
        string nombreBD = string.Empty;

        public blEdi() { }

        public string GetCharacters(int Contador)
        {
            string Characters = "";
            string[] arrayABC = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
            if (Contador > arrayABC.Length)
            {
                var arrCont = Contador.ToString().ToCharArray();

                foreach (var item in arrCont)
                {
                    Characters += arrayABC[int.Parse(item.ToString())];
                }
            }
            else
            {
                Characters = arrayABC[Contador];
            }
            return Characters;
        }
        public int SaveASN(int IdPackingList)
        {
            int response = -1;            
            int ShipmentGroupId = 0;
            string Conexion = Util.Intranet;
            string ConexionEDI = Util.EDI;
            beShipment obeShipment = null;
            daEdi odaEdi = new daEdi();
            try
            {
                response = 0;          
                using (SqlConnection cn = new SqlConnection(Conexion))
                {
                    cn.Open();
                    obeShipment = odaEdi.GetPackingList(cn, IdPackingList);
                    //obePackingListEDI = o
                }

                if (obeShipment != null && obeShipment.Order.Count > 0 && obeShipment.Pack.Count > 0 && obeShipment.Item.Count > 0 && obeShipment.DefaultItem.Count > 0)
                {
                    //beShipmentEDI obeShipmentEDI = new beShipmentEDI();

                    obeShipment.Packaging_Type_Code = "CTN25";
                    obeShipment.Lading_Qty = obeShipment.Pack.Count; // Contar Packs
                    obeShipment.Lading_Description = "";
                    obeShipment.Cross_Weight_Kg = obeShipment.Pack.Sum(x => x.GrossWeight);//Contar Pesos 
                    obeShipment.Cross_Weight_Lb = 0;
                    obeShipment.Route_Type_Code = "O";
                    obeShipment.Shipment_ID_Standard = "TRANSBER";
                    obeShipment.Transportation_Type_Code = "A";
                    obeShipment.Carrier_Reference = "";
                    obeShipment.Order_Status_Code = "CC";
                    obeShipment.Equipment_Code = "";
                    obeShipment.Equipment_Initial = "";
                    obeShipment.Equipment_Number = "";
                    obeShipment.Seal_Number = "";
                    obeShipment.Bill_of_lading_number = "";
                    obeShipment.Carriers_PRO_Invoice_number = "";
                    obeShipment.Authorization_Shipping = obeShipment.Order[0].VendorCode;
                    obeShipment.Shipped_DateStr = obeShipment.Order[0].CancelDate.AddDays(-1).ToString("yyyyMMdd");
                    obeShipment.Current_Scheduled_Delivery_DateStr = obeShipment.Order[0].CancelDate.ToString("yyyyMMdd");
                    obeShipment.Ship_Method_Code = "CC";
                    obeShipment.ShipTo_Name = obeShipment.Order[0].Buying_Party_Name;
                    obeShipment.ShipTo_Code = obeShipment.Order[0].Buying_Party_Code;
                    obeShipment.ShipFrom_Name = "World Textile Sourcing";
                    obeShipment.ShipFrom_VendorCode = obeShipment.Order[0].VendorCode;
                    obeShipment.ShipFrom_City = "NEW YORK";
                    obeShipment.ShipFrom_State = "NY";
                    obeShipment.ShipFrom_PostalCode = "10018";
                    obeShipment.State_Shipment = "I";

                    //int IdPack = 0;
                    int Contador = 0;
                    string Characters = "";

                    
                    int Factor = 4; // Mayor o Igual a 4 se considera Bulk Carton
                    int MaxRatio = obeShipment.DefaultItem.Max(x => x.Size_Ratio);

                    if (MaxRatio > Factor)
                    {
                        Factor = MaxRatio;
                    }




                    //foreach (var item in obeShipment.Item.OrderBy(x => x.IdPack))
                    //{
                    //    if (IdPack == 0)
                    //    {
                    //        IdPack = item.IdPack;
                    //        Characters = GetCharacters(Contador);
                    //    }
                    //    else
                    //    {
                    //        if (IdPack != item.IdPack)
                    //        {
                    //            IdPack = item.IdPack;
                    //            Contador++;
                    //            Characters = GetCharacters(Contador);
                    //        }
                    //    }
                    //    item.PackCharacter = Characters;
                    //}

                    foreach (var pack in obeShipment.Pack.Select(x=> x.IdPack).Distinct())
                    {
                         var Item = obeShipment.Item.FindAll(x => x.IdPack == pack);
                        if (Item.Exists(x => x.Size_Ratio >= Factor))
                        {
                            foreach (var item in Item)
                            {
                                item.PackCharacter = "";
                            }
                        }
                        else
                        {
                            Characters = GetCharacters(Contador);
                            foreach (var item in Item)
                            {
                                item.PackCharacter = Characters;
                            }
                            Contador++;
                        }

                    }




                    SqlTransaction transaction = null;
                    using (SqlConnection cn = new SqlConnection(ConexionEDI))
                    {
                        cn.Open();
                        transaction = cn.BeginTransaction();

                        try
                        {
                            ShipmentGroupId = odaEdi.SaveShipmentGroup(cn, transaction);
                            if (ShipmentGroupId > 0)
                            {
                                obeShipment.ShipmentGroupID = ShipmentGroupId;
                                obeShipment.Usuario_Creacion = "Sistemas";
                                int Shipment_Code = odaEdi.SaveShipment(cn, transaction, obeShipment);
                                if (Shipment_Code > 0)
                                {
                                    int Order_Code = 0;
                                    obeShipment.Order[0].Shipment_Code = Shipment_Code;
                                    obeShipment.Order[0].Packaging_Type_Code = "CTN25";
                                    obeShipment.Order[0].Lading_Qty = obeShipment.Pack.Count;
                                    obeShipment.Order[0].Cross_Weight_Kg = obeShipment.Pack.Sum(x => x.GrossWeight);
                                    obeShipment.Order[0].Cross_Weight_Lb = 0;
                                    obeShipment.Order[0].Invoice_Number = "";
                                    obeShipment.Order[0].PO_Date = obeShipment.Order[0].PO_DateDT.ToString("yyyyMMdd");//MM\/dd\/yyyy
                                    Order_Code = odaEdi.SaveOrder(cn, transaction, obeShipment.Order[0]);
                                    if (Order_Code > 0)
                                    {
                                        int Pack_Code = 0;
                                        int InnerPerPack = 0;
                                        int resul = 0;

                                        foreach (var pack in obeShipment.Pack)
                                        {
                                            pack.Shipment_Code = Shipment_Code;
                                            pack.Order_Code = Order_Code;
                                            pack.UCC_EAN_Code = "GM";
                                            pack.Code_Items_per_Pack = "M";
                                            Pack_Code = odaEdi.SavePack(cn, transaction, pack);
                                            if (Pack_Code > 0)
                                            {
                                                var Items = obeShipment.Item.FindAll(x => x.IdPack == pack.IdPack);
                                                InnerPerPack = 1;// Items.Sum(x => x.Size_Ratio);
                                                foreach (var item in Items)
                                                {
                                                    item.Shipment_Code = Shipment_Code;
                                                    item.Order_Code = Order_Code;
                                                    item.Pack_Code = Pack_Code;
                                                    item.Quantity_Shipped = pack.NumberOfCartonPack * item.Size_Ratio;
                                                    item.UOM_Quantity_Ordered = "EA";
                                                    item.UOM_Quantity_Shipped = "EA";
                                                    item.UOM_Size_Ratio = "EA";

                                                    if (item.PackCharacter == "")
                                                    {
                                                        InnerPerPack = item.Size_Ratio;
                                                    }

                                                    item.Inner_Pack = InnerPerPack;
                                                    resul = odaEdi.SaveItem(cn, transaction, item);
                                                }
                                            }
                                        }
                                    }
                                    transaction.Commit();
                                    response = 1;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            GrabarArchivoLog(ex);
                            response = -1;
                            ShipmentGroupId = -1;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
                response = -1;
                ShipmentGroupId = -1;
            }
            response = 0;
            return ShipmentGroupId;
        }


    }
}
