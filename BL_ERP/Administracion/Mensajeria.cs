using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.Administracion;
using DAL_ERP.Administracion;
namespace BL_ERP
{
    public class Mensajeria : blLog
    {
        public List<beMensajeriaReporte> getReport(string fi,string ff, string TipoMensajeria, string nombreBD = null)
        {
            List<beMensajeriaReporte> Reporte = null;
            string Conexion = nombreBD ?? Util.Default;

            try
            {
                using (SqlConnection con = new SqlConnection(Conexion))
                {
                    con.Open();
                    daMensajeria odaMensajeria = new daMensajeria();
                    Reporte = odaMensajeria.getReport(con, fi, ff, TipoMensajeria);

                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return Reporte;
        }
    }
}
