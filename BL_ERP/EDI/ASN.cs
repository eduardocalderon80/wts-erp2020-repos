using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using DAL_ERP;
namespace BL_ERP
{
    public class ASN : blLog
    {
        public beASN getASN(int Shipment_Code)
        {
            beASN obeASN = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daASN odaASN = new daASN();
                    obeASN = odaASN.getASN(Shipment_Code,cn);
                }

            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obeASN;
        }
        public beShipmentGroup getShipmentGroup()
        {
            beShipmentGroup obeShipmentGroup = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daASN odaASN = new daASN();
                    obeShipmentGroup = odaASN.GetShipmentGroup(cn);
                }

            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obeShipmentGroup;
        }

        public bool UpdateShipmentGroupStatus(int ShipmentGroupID, string Status) {
            bool resul = false;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daASN odaASN = new daASN();
                    resul = odaASN.UpdateShipmentGroupStatus(ShipmentGroupID,Status,cn);
                }

            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return resul;
        }
    }
}
