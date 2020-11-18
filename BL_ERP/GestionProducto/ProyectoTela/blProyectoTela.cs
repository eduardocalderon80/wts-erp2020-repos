using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP.GestionProducto;
using DAL_ERP.GestionProducto;
namespace BL_ERP.GestionProducto
{
    public class blProyectoTela : blLog
    {
        public int Save(ProyectoTela oProyectoTela, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daProyectoTela odata = new daProyectoTela();
                    response = odata.Save(con, transaction, oProyectoTela);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    GrabarArchivoLog(ex);
                    response = -1;
                }
            }
            return response;
        }
    }
}
