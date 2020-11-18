
using System;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Collections.Generic;
using BE_ERP;
namespace DAL_ERP
{
    public class daEdi
    {
        public beShipment GetPackingList(SqlConnection con, int IdPackingList)
        {
            beShipment obeShipment = null;

            SqlCommand cmd = new SqlCommand("uspPackingListGet", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@IdPackingList", SqlDbType.Int).Value = IdPackingList;

            using (SqlDataReader dr = cmd.ExecuteReader())
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        obeShipment = new beShipment();

                        obeShipment.Order = new List<beOrder>();
                        beOrder obeOrder = null;
                        obeShipment.Pack = new List<bePack>();
                        bePack obePack = null;
                        obeShipment.Item = new List<beItem>();
                        beItem obeItem = null;
                        obeShipment.DefaultItem = new List<beItem>();
                        beItem obeDefaultItem = null;
                        while (dr.Read())
                        {
                            obeOrder = new beOrder();
                            obeOrder.IdPackingList = dr.GetInt32(0);
                            obeOrder.Po = dr.GetString(1);
                            obeOrder.Estilo = dr.GetString(2);
                            obeOrder.Lote = dr.GetString(3);
                            obeOrder.Lading_Qty = dr.GetInt32(4);
                            obeOrder.PrendasRequeridas = dr.GetDecimal(5);
                            obeOrder.Buying_Party_Code = dr.GetString(6);                            
                            obeOrder.InnerPerPack = dr.GetInt32(7);
                            obeOrder.Original_PO_Number = dr.GetString(8);
                            obeOrder.DepartmentCode = dr.GetString(9);
                            obeOrder.VendorCode = dr.GetString(10);
                            obeOrder.Buying_Party_Name = dr.GetString(11);
                            obeOrder.Division_Code = dr.GetString(12);
                            obeOrder.PO_DateDT = dr.GetDateTime(13);
                            obeOrder.CancelDate = dr.GetDateTime(14);
                            obeShipment.Order.Add(obeOrder);
                        }
                        if (dr.NextResult())
                        {
                            while (dr.Read())
                            {
                                obePack = new bePack();
                                obePack.IdPackingList = dr.GetInt32(0);
                                obePack.IdPack = dr.GetInt32(1);
                                obePack.IdCarton = dr.GetInt32(2);
                                obePack.NumberOfCartonPack = dr.GetInt32(3);
                                obePack.Length = dr.GetDecimal(4);
                                obePack.Width = dr.GetDecimal(5);
                                obePack.Height = dr.GetDecimal(6);
                                obePack.NetWeight = dr.GetDecimal(7);
                                obePack.GrossWeight = dr.GetDecimal(8);
                                obePack.NumberOfCarton = dr.GetInt32(9);
                                obePack.SSCC = dr.GetString(10);
                                obeShipment.Pack.Add(obePack);
                            }
                            if (dr.NextResult())
                            {
                                while (dr.Read())
                                {
                                    obeItem = new beItem();
                                    obeItem.IdPackingList = dr.GetInt32(0);
                                    obeItem.IdPackDetail = dr.GetInt32(1);
                                    obeItem.IdPack = dr.GetInt32(2);
                                    obeItem.Po = dr.GetString(3);
                                    obeItem.Vendor_Style = dr.GetString(4);
                                    obeItem.Lote = dr.GetString(5);
                                    obeItem.Vendor_Color = dr.GetString(6);
                                    obeItem.Buyer_Color = dr.GetString(6);
                                    obeItem.Buyer_Size = dr.GetString(7);
                                    obeItem.Vendor_Size = dr.GetString(7);
                                    obeItem.Size_Ratio = dr.GetInt32(8);
                                    obeItem.Quantity_Ordered = dr.GetInt32(9);
                                    obeItem.Buyer_Style = dr.GetString(10);
                                    obeShipment.Item.Add(obeItem);
                                }

                                if (dr.NextResult())
                                {
                                    while (dr.Read())
                                    {
                                        obeDefaultItem = new beItem();
                                        obeDefaultItem.Vendor_Style = dr.GetString(0);
                                        obeDefaultItem.Vendor_Color = dr.GetString(1);
                                        obeDefaultItem.Vendor_Size = dr.GetString(2);
                                        obeDefaultItem.Buyer_Style = dr.GetString(3);
                                        obeDefaultItem.Size_Ratio = dr.GetInt32(4);
                                        obeShipment.DefaultItem.Add(obeDefaultItem);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return obeShipment;
        }

        public int SaveShipmentGroup(SqlConnection cn, SqlTransaction ts) {
            int ShipmentGroupId = 0;
            SqlCommand cmd = new SqlCommand("SP_EDI_SHIPMENT_GROUP_INSERT", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter parShipmentGroupID = cmd.Parameters.Add("@@IDENTITY", SqlDbType.Int);
            parShipmentGroupID.Direction = ParameterDirection.ReturnValue;
            cmd.Parameters.Add("@Company_ID", SqlDbType.Int).Value = 1; // Marmaxx = 1 
            cmd.Parameters.Add("@Created_By", SqlDbType.VarChar).Value = "Sistemas";
            int resul = cmd.ExecuteNonQuery();
            ShipmentGroupId = (int)parShipmentGroupID.Value;
            return ShipmentGroupId;

        }

        public int SaveShipment(SqlConnection cn, SqlTransaction ts, beShipment obeShipment) {

            int ShipmentId = 0;

            SqlCommand cmd = new SqlCommand("SP_EDI_SHIPMENT_INSERT", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter parShipmentID = cmd.Parameters.Add("@@IDENTITY", SqlDbType.Int);
            parShipmentID.Direction = ParameterDirection.ReturnValue;
            SqlParameter par47 = cmd.Parameters.Add("@Shipment_Group_ID", SqlDbType.Int);
            SqlParameter par48 = cmd.Parameters.Add("@Packaging_Type_Code", SqlDbType.VarChar);
            SqlParameter par50 = cmd.Parameters.Add("@Lading_Qty", SqlDbType.Int);
            SqlParameter par51 = cmd.Parameters.Add("@Lading_Description", SqlDbType.VarChar);
            SqlParameter par52 = cmd.Parameters.Add("@Cross_Weight_Kg", SqlDbType.Decimal);
            SqlParameter par53 = cmd.Parameters.Add("@Cross_Weight_Lb", SqlDbType.Decimal);
            SqlParameter par54 = cmd.Parameters.Add("@Route_Type_Code", SqlDbType.VarChar);
            SqlParameter par55 = cmd.Parameters.Add("@Shipment_ID_Standard", SqlDbType.VarChar);
            SqlParameter par56 = cmd.Parameters.Add("@Transportation_Type_Code", SqlDbType.VarChar);
            SqlParameter par57 = cmd.Parameters.Add("@Carrier_Reference", SqlDbType.VarChar);
            SqlParameter par58 = cmd.Parameters.Add("@Order_Status_Code", SqlDbType.VarChar);
            SqlParameter par59 = cmd.Parameters.Add("@Equipment_Code", SqlDbType.VarChar);
            SqlParameter par60 = cmd.Parameters.Add("@Equipment_Initial", SqlDbType.VarChar);
            SqlParameter par61 = cmd.Parameters.Add("@Equipment_Number", SqlDbType.VarChar);
            SqlParameter par62 = cmd.Parameters.Add("@Seal_Number", SqlDbType.VarChar);
            SqlParameter par63 = cmd.Parameters.Add("@Bill_of_lading_number", SqlDbType.VarChar);
            SqlParameter par64 = cmd.Parameters.Add("@Carriers_PRO_Invoice_number", SqlDbType.VarChar);
            SqlParameter par65 = cmd.Parameters.Add("@Authorization_Shipping", SqlDbType.VarChar);
            SqlParameter par66 = cmd.Parameters.Add("@Shipped_Date", SqlDbType.VarChar);
            SqlParameter par67 = cmd.Parameters.Add("@Current_Scheduled_Delivery_Date", SqlDbType.VarChar);
            SqlParameter par68 = cmd.Parameters.Add("@Ship_Method_Code", SqlDbType.VarChar);
            SqlParameter par69 = cmd.Parameters.Add("@ShipTo_Name", SqlDbType.VarChar);
            SqlParameter par70 = cmd.Parameters.Add("@ShipTo_Code", SqlDbType.VarChar);
            SqlParameter par71 = cmd.Parameters.Add("@ShipFrom_Name", SqlDbType.VarChar);
            SqlParameter par72 = cmd.Parameters.Add("@ShipFrom_VendorCode", SqlDbType.VarChar);
            SqlParameter par73 = cmd.Parameters.Add("@ShipFrom_City", SqlDbType.VarChar);
            SqlParameter par74 = cmd.Parameters.Add("@ShipFrom_State", SqlDbType.VarChar);
            SqlParameter par75 = cmd.Parameters.Add("@ShipFrom_PostalCode", SqlDbType.VarChar);
            SqlParameter par76 = cmd.Parameters.Add("@State_Shipment", SqlDbType.VarChar);
            SqlParameter par77 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);

            par47.Value = obeShipment.ShipmentGroupID;
            par48.Value = obeShipment.Packaging_Type_Code;
            par50.Value = obeShipment.Lading_Qty;
            par51.Value = obeShipment.Lading_Description;
            par52.Value = obeShipment.Cross_Weight_Kg;
            par53.Value = obeShipment.Cross_Weight_Lb;
            par54.Value = obeShipment.Route_Type_Code;
            par55.Value = obeShipment.Shipment_ID_Standard;
            par56.Value = obeShipment.Transportation_Type_Code;
            par57.Value = obeShipment.Carrier_Reference;
            par58.Value = obeShipment.Order_Status_Code;
            par59.Value = obeShipment.Equipment_Code;
            par60.Value = obeShipment.Equipment_Initial;
            par61.Value = obeShipment.Equipment_Number;
            par62.Value = obeShipment.Seal_Number;
            par63.Value = obeShipment.Bill_of_lading_number;
            par64.Value = obeShipment.Carriers_PRO_Invoice_number;
            par65.Value = obeShipment.Authorization_Shipping;
            par66.Value = obeShipment.Shipped_DateStr;
            par67.Value = obeShipment.Current_Scheduled_Delivery_DateStr;
            par68.Value = obeShipment.Ship_Method_Code;
            par69.Value = obeShipment.ShipTo_Name;
            par70.Value = obeShipment.ShipTo_Code;
            par71.Value = obeShipment.ShipFrom_Name;
            par72.Value = obeShipment.ShipFrom_VendorCode;
            par73.Value = obeShipment.ShipFrom_City;
            par74.Value = obeShipment.ShipFrom_State;
            par75.Value = obeShipment.ShipFrom_PostalCode;
            par76.Value = obeShipment.State_Shipment;
            par77.Value = obeShipment.Usuario_Creacion;
            int resul = cmd.ExecuteNonQuery();
            ShipmentId = (int)parShipmentID.Value;
            return ShipmentId;
        }
        public int SaveOrder(SqlConnection cn, SqlTransaction ts, beOrder obeOrder) {
            int OrderId = 0;

            SqlCommand cmd = new SqlCommand("SP_EDI_ORDER_INSERT", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter parOrderID = cmd.Parameters.Add("@@IDENTITY", SqlDbType.Int);
            parOrderID.Direction = ParameterDirection.ReturnValue;
            SqlParameter par78 = cmd.Parameters.Add("@Shipment_Code", SqlDbType.Int);
            SqlParameter par79 = cmd.Parameters.Add("@Original_PO_Number", SqlDbType.VarChar);
            SqlParameter par80 = cmd.Parameters.Add("@PO_Date", SqlDbType.VarChar);
            SqlParameter par81 = cmd.Parameters.Add("@Packaging_Type_Code", SqlDbType.VarChar);
            SqlParameter par82 = cmd.Parameters.Add("@Lading_Qty", SqlDbType.Int);
            SqlParameter par83 = cmd.Parameters.Add("@Cross_Weight_Kg", SqlDbType.Decimal);
            SqlParameter par84 = cmd.Parameters.Add("@Cross_Weight_Lb", SqlDbType.Decimal);
            SqlParameter par85 = cmd.Parameters.Add("@Invoice_Number", SqlDbType.VarChar);
            SqlParameter par86 = cmd.Parameters.Add("@Buying_Party_Name", SqlDbType.VarChar);
            SqlParameter par87 = cmd.Parameters.Add("@Buying_Party_Code", SqlDbType.VarChar);
            SqlParameter par88 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);
            SqlParameter par88_1 = cmd.Parameters.Add("@Division_Code", SqlDbType.VarChar);

            par78.Value = obeOrder.Shipment_Code;
            par79.Value = obeOrder.Original_PO_Number;
            par80.Value = obeOrder.PO_Date;
            par81.Value = obeOrder.Packaging_Type_Code;
            par82.Value = obeOrder.Lading_Qty;
            par83.Value = obeOrder.Cross_Weight_Kg;
            par84.Value = obeOrder.Cross_Weight_Lb;
            par85.Value = obeOrder.Invoice_Number;
            par86.Value = obeOrder.Buying_Party_Name;
            par87.Value = obeOrder.Buying_Party_Code;
            par88.Value = "Sistemas";
            par88_1.Value = obeOrder.Division_Code;

            int resul = cmd.ExecuteNonQuery();
            OrderId = (int)parOrderID.Value;

            return OrderId;
        }
        public int SavePack(SqlConnection cn, SqlTransaction ts, bePack obePack) {
            int IdPack = 0;
            SqlCommand cmd = new SqlCommand("SP_EDI_PACK_INSERT", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter parPackID = cmd.Parameters.Add("@@IDENTITY", SqlDbType.Int);
            parPackID.Direction = ParameterDirection.ReturnValue;
            SqlParameter par89 = cmd.Parameters.Add("@Shipment_Code", SqlDbType.Int);
            SqlParameter par90 = cmd.Parameters.Add("@Order_Code", SqlDbType.Int);
            SqlParameter par91 = cmd.Parameters.Add("@UCC_EAN_Code", SqlDbType.VarChar);
            SqlParameter par92 = cmd.Parameters.Add("@Package_ID_Number", SqlDbType.VarChar);
            SqlParameter par93 = cmd.Parameters.Add("@Code_Items_per_Pack", SqlDbType.VarChar);
            SqlParameter par94 = cmd.Parameters.Add("@Parent_Pack_Code", SqlDbType.Int);
            SqlParameter par94_5 = cmd.Parameters.Add("@SSCC", SqlDbType.VarChar);
            SqlParameter par95 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);

            par89.Value = obePack.Shipment_Code;
            par90.Value = obePack.Order_Code;
            par91.Value = obePack.UCC_EAN_Code;
            par92.Value = DBNull.Value; ;
            par93.Value = obePack.Code_Items_per_Pack;
            par94.Value = DBNull.Value;
            par94_5.Value = obePack.SSCC;
            par95.Value = "Sistemas";

            int resul = cmd.ExecuteNonQuery();

            IdPack = (int)parPackID.Value;

            return IdPack;
        }
        public int SaveItem(SqlConnection cn, SqlTransaction ts, beItem obeItem) {
            int resul = 0;
            SqlCommand cmd = new SqlCommand("SP_EDI_ITEM_INSERT", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par96 = cmd.Parameters.Add("@Shipment_Code", SqlDbType.Int);
            SqlParameter par97 = cmd.Parameters.Add("@Order_Code", SqlDbType.Int);
            SqlParameter par98 = cmd.Parameters.Add("@Pack_Code", SqlDbType.Int);
            SqlParameter par99 = cmd.Parameters.Add("@Product_Code", SqlDbType.VarChar);
            SqlParameter par100 = cmd.Parameters.Add("@Vendor_Style", SqlDbType.VarChar);
            SqlParameter par101 = cmd.Parameters.Add("@Buyer_Style", SqlDbType.VarChar);
            SqlParameter par102 = cmd.Parameters.Add("@Buyer_Size", SqlDbType.VarChar);
            SqlParameter par103 = cmd.Parameters.Add("@Vendor_Color", SqlDbType.VarChar);
            SqlParameter par104 = cmd.Parameters.Add("@Buyer_Color", SqlDbType.VarChar);
            SqlParameter par105 = cmd.Parameters.Add("@Quantity_Shipped", SqlDbType.Int);
            SqlParameter par106 = cmd.Parameters.Add("@UOM_Quantity_Shipped", SqlDbType.VarChar);
            SqlParameter par107 = cmd.Parameters.Add("@Quantity_Ordered", SqlDbType.Int);
            SqlParameter par108 = cmd.Parameters.Add("@UOM_Quantity_Ordered", SqlDbType.VarChar);
            SqlParameter par109 = cmd.Parameters.Add("@Inner_Pack", SqlDbType.Int);
            SqlParameter par110 = cmd.Parameters.Add("@Size_Ratio", SqlDbType.Int);
            SqlParameter par111 = cmd.Parameters.Add("@UOM_Size_Ratio", SqlDbType.VarChar);
            SqlParameter par112 = cmd.Parameters.Add("@Vendor_Size", SqlDbType.VarChar);
            SqlParameter par114 = cmd.Parameters.Add("@Kind_Of_Packed", SqlDbType.VarChar);
            SqlParameter par113 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);

            par96.Value = obeItem.Shipment_Code;
            par97.Value = obeItem.Order_Code;
            par98.Value = obeItem.Pack_Code;
            par99.Value = DBNull.Value;
            par100.Value = obeItem.Vendor_Style;
            par101.Value = obeItem.Buyer_Style;
            par102.Value = obeItem.Buyer_Size;
            par103.Value = obeItem.Vendor_Color;
            par104.Value = obeItem.Buyer_Color;
            par105.Value = obeItem.Quantity_Shipped;
            par106.Value = obeItem.UOM_Quantity_Shipped;
            par107.Value = obeItem.Quantity_Ordered;
            par108.Value = obeItem.UOM_Quantity_Ordered;
            par109.Value = obeItem.Inner_Pack;
            par110.Value = obeItem.Size_Ratio;
            par111.Value = obeItem.UOM_Size_Ratio;
            par112.Value = obeItem.Vendor_Size;
            par113.Value = "Sistemas";
            par114.Value = obeItem.PackCharacter;

            resul = cmd.ExecuteNonQuery();
            return resul;
        }
        public int UpdateOrder(SqlConnection cn, SqlTransaction ts, beOrder obeOrder) {
            int resul = 0;
            SqlCommand cmd = new SqlCommand("SP_EDI_ORDER_LADINGQUANTITY", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Order_Code", SqlDbType.Int).Value = obeOrder.Order_Code;
            cmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = obeOrder.Lading_Qty;
            resul = cmd.ExecuteNonQuery();
            return resul;
        }
    }
}
