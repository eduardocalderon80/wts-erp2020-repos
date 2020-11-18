using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
namespace DAL_ERP
{
    public class daASN
    {
        public beASN getASN(int Shipment_Code, SqlConnection cn)
        {
            beASN ASN = null;
            string StoreProcedure = "sp_ASN_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Shipment_Group_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Shipment_Code;
            using (SqlDataReader dr = cmd.ExecuteReader())
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        ASN = new beASN();
                        beShipment obeShipment = null;
                        ASN.Shipments = new List<beShipment>();
                        while (dr.Read())
                        {
                            obeShipment = new beShipment();
                            obeShipment.Packaging_Type_Code = dr.GetString(0);
                            obeShipment.Shipment_Code = dr.GetInt32(1);
                            obeShipment.Lading_Qty = dr.GetInt32(2);
                            obeShipment.Lading_Description = dr.GetString(3);
                            obeShipment.Cross_Weight_Kg = dr.GetDecimal(4);
                            obeShipment.Route_Type_Code = dr.GetString(5);
                            obeShipment.Shipment_ID_Standard = dr.GetString(6);
                            obeShipment.Transportation_Type_Code = dr.GetString(7);
                            obeShipment.Carrier_Reference = dr.GetString(8);
                            obeShipment.Order_Status_Code = dr.GetString(9);
                            obeShipment.Equipment_Code = dr.GetString(10);
                            obeShipment.Equipment_Initial = dr.GetString(11);
                            obeShipment.Equipment_Number = dr.GetString(12);
                            obeShipment.Seal_Number = dr.GetString(13);
                            obeShipment.Bill_of_lading_number = dr.GetString(14);
                            obeShipment.Carriers_PRO_Invoice_number = dr.GetString(15);
                            obeShipment.Authorization_Shipping = dr.GetString(16);
                            obeShipment.Shipped_Date = dr.GetDateTime(17);
                            obeShipment.Current_Scheduled_Delivery_Date = dr.GetDateTime(18);
                            obeShipment.Ship_Method_Code = dr.GetString(19);
                            obeShipment.ShipTo_Name = dr.GetString(20);
                            obeShipment.ShipTo_Code = dr.GetString(21);
                            obeShipment.ShipFrom_Name = dr.GetString(22);
                            obeShipment.ShipFrom_VendorCode = dr.GetString(23);
                            obeShipment.ShipFrom_City = dr.GetString(24);
                            obeShipment.ShipFrom_State = dr.GetString(25);
                            obeShipment.ShipFrom_PostalCode = dr.GetString(26);
                            //obeShipment.ID_Negocio = dr.GetString(27);
                            //obeShipment.Archivo_EDI = dr.GetString(28);
                            obeShipment.State_Shipment = dr.GetString(27);
                            ASN.Shipments.Add(obeShipment);
                        }
                        if (dr.NextResult())
                        {
                            beOrder obeOder = null;
                            ASN.Orders = new List<beOrder>();
                            while (dr.Read())
                            {
                                obeOder = new beOrder();
                                obeOder.Shipment_Code = dr.GetInt32(0);
                                obeOder.Order_Code = dr.GetInt32(1);
                                obeOder.Original_PO_Number = dr.GetString(2);
                                obeOder.PO_DateDT = dr.GetDateTime(3);
                                obeOder.Packaging_Type_Code = dr.GetString(4);
                                obeOder.Lading_Qty = dr.GetInt32(5);
                                obeOder.Cross_Weight_Kg = dr.GetDecimal(6);
                                obeOder.Invoice_Number = dr.GetString(7);
                                obeOder.Buying_Party_Name = dr.GetString(8);
                                obeOder.Buying_Party_Code = dr.GetString(9);
                                obeOder.Division_Code = dr.GetString(10);
                                ASN.Orders.Add(obeOder);
                            }
                            if (dr.NextResult())
                            {
                                bePack obePack = null;
                                ASN.Packs = new List<bePack>();
                                while (dr.Read())
                                {
                                    obePack = new bePack();
                                    obePack.Shipment_Code = dr.GetInt32(0);
                                    obePack.Order_Code = dr.GetInt32(1);
                                    obePack.Pack_Code = dr.GetInt32(2);
                                    obePack.UCC_EAN_Code = dr.GetString(3);
                                    obePack.Package_ID_Number = dr.GetString(4);
                                    obePack.Code_Items_per_Pack = dr.GetString(5);
                                    obePack.Mark_Number = "";
                                    obePack.SSCC = dr.GetString(6);
                                    ASN.Packs.Add(obePack);
                                }
                                if (dr.NextResult())
                                {
                                    beItem obeItem = null;
                                    ASN.Items = new List<beItem>();
                                    while (dr.Read())
                                    {
                                        obeItem = new beItem();
                                        obeItem.Shipment_Code = dr.GetInt32(0);
                                        obeItem.Order_Code = dr.GetInt32(1);
                                        obeItem.Pack_Code = dr.GetInt32(2);
                                        obeItem.Item_Code = dr.GetInt32(3);
                                        obeItem.Product_Code = dr.GetString(4);
                                        obeItem.Vendor_Style = dr.GetString(5);
                                        obeItem.Buyer_Style = dr.GetString(6);
                                        obeItem.Buyer_Size = dr.GetString(7);
                                        obeItem.Vendor_Color = dr.GetString(8);
                                        obeItem.Buyer_Color = dr.GetString(9);
                                        obeItem.Quantity_Shipped = dr.GetInt32(10);
                                        obeItem.UOM_Quantity_Shipped = dr.GetString(11);
                                        obeItem.Quantity_Ordered = dr.GetInt32(12);
                                        obeItem.UOM_Quantity_Ordered = dr.GetString(13);
                                        obeItem.Inner_Pack = dr.GetInt32(14);
                                        obeItem.Size_Ratio = dr.GetInt32(15);
                                        obeItem.UOM_Size_Ratio = dr.GetString(16);
                                        obeItem.Vendor_Size = dr.GetString(17);
                                        obeItem.Kind_Of_Packed = dr.GetString(18);
                                        ASN.Items.Add(obeItem);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ASN;
        }

        public bool UpdateShipmentGroupStatus(int ShipmentGroupID, string Status, SqlConnection cn)
        {
            int resul = 0;
            string StoreProcedure = "sp_EDI_Shipment_GroupId_Update";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Shipment_Group_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ShipmentGroupID;
            SqlParameter par2 = cmd.Parameters.Add("@Status", SqlDbType.VarChar);
            par2.Direction = ParameterDirection.Input;
            par2.Value = Status;
            resul = cmd.ExecuteNonQuery();
            return resul > 0;
        }
        public beShipmentGroup GetShipmentGroup(SqlConnection cn)
        {
            beShipmentGroup obeShipmentGroup = null;
            string StoreProcedure = "sp_EDI_Shipment_Group_GET";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmd.ExecuteReader())
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        if (dr.Read())
                        {
                            obeShipmentGroup = new beShipmentGroup();
                            obeShipmentGroup.Shipment_Group_ID = dr.GetInt32(0);
                            obeShipmentGroup.Company_ID = dr.GetInt32(1);
                        }
                    }
                }
            }
            return obeShipmentGroup;
        }
        public bool UpdateShipmentGroup_FileID(int Shipment_Group_ID, int FileID,SqlConnection cn,SqlTransaction ts)
        {
            int resul = 0;
            string StoreProcedure = "sp_ASN_ShipmentGroup_Update_FileID";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Transaction = ts;
            SqlParameter par1 = cmd.Parameters.Add("@Shipment_Group_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Shipment_Group_ID;
            SqlParameter par2 = cmd.Parameters.Add("@File_ID", SqlDbType.Int);
            par2.Direction = ParameterDirection.Input;
            par2.Value = FileID;
            resul = cmd.ExecuteNonQuery();
            return resul > 0;
        }
    }
}
