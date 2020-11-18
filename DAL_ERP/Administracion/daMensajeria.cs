using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.Administracion;
namespace DAL_ERP.Administracion
{
    public class daMensajeria
    {
        public List<beMensajeriaReporte> getReport(SqlConnection con, string fi, string ff, string TipoMensajeria)
        {

            List<beMensajeriaReporte> Reporte = null;

            SqlCommand cmd = new SqlCommand("usp_MensajeriaReporte", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@fi", SqlDbType.VarChar).Value = fi;
            cmd.Parameters.Add("@ff", SqlDbType.VarChar).Value = ff;
            cmd.Parameters.Add("@TipoMensajeria", SqlDbType.VarChar).Value = TipoMensajeria;

            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Reporte = new List<beMensajeriaReporte>();
                        beMensajeriaReporte obeMensajeriaReporte = null;

                        while (dr.Read())
                        {
                            obeMensajeriaReporte = new beMensajeriaReporte();

                            obeMensajeriaReporte.Fecha = dr.GetString(0);
                            obeMensajeriaReporte.Destino = dr.GetString(1);                            
                            obeMensajeriaReporte.Cliente = dr.GetString(2);
                            obeMensajeriaReporte.EnviadoPor = dr.GetString(3);
                            obeMensajeriaReporte.AprobadoPor = dr.GetString(4);
                            obeMensajeriaReporte.TipoServicio = dr.GetString(8);
                            obeMensajeriaReporte.Hora = dr.GetString(9);
                            obeMensajeriaReporte.Programacion = dr.GetString(10);
                            obeMensajeriaReporte.TipoMovilidad = dr.GetString(11);
                            obeMensajeriaReporte.Costo = dr.GetString(12);
                            obeMensajeriaReporte.Estado = dr.GetString(13);
                            obeMensajeriaReporte.MotivoCancel = dr.GetString(14);

                            Reporte.Add(obeMensajeriaReporte);
                        }

                    }
                }
            }    
                        
            return Reporte;
        }
    }
}
