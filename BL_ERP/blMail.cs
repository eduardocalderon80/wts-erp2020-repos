using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;

namespace BL_ERP
{
  public class blMail:blLog
    {
        public blMail() { }

        public int sendMail(beMailSQL oMailSQL, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;

            oMailSQL.to_address = oMailSQL.to_address.Replace(',', ';');
            
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMail oMail = new daMail();
                    response = oMail.sendMail(oMailSQL, con);
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

        public int sendMailBandeja(beMailSQL oMailSQL, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;

            oMailSQL.to_address = oMailSQL.to_address.Replace(',', ';');

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMail oMail = new daMail();
                    response = oMail.sendMail_Bandeja(oMailSQL, con);
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

    }
}
