using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP.GestionProducto;
using Newtonsoft.Json;
namespace DAL_ERP.GestionProducto
{
    public class daProyectoTela
    {
        public int Save(SqlConnection con, SqlTransaction transaction,ProyectoTela oProyectoTela)
        {
            int id = 0;

            SqlCommand cmd = new SqlCommand("uspProyectoTelaGuardar", con, transaction);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@tipo", SqlDbType.Int).Value = oProyectoTela.Tipo;
            cmd.Parameters.Add("@proyectotela", SqlDbType.VarChar).Value = oProyectoTela.ProyectoTelaJS;
            cmd.Parameters.Add("@labdip", SqlDbType.VarChar).Value = oProyectoTela.ProyectoTelaLabdipJS;
            cmd.Parameters.Add("@labdipstatus", SqlDbType.VarChar).Value = oProyectoTela.ProyectoTelaLabdipStatusJS;
            cmd.Parameters.Add("@labdipeliminado", SqlDbType.VarChar).Value = oProyectoTela.ProyectoTelaLabdipEliminadoJS;
            cmd.Parameters.Add("@labdipstatuseliminado", SqlDbType.VarChar).Value = oProyectoTela.ProyectoTelaLabdipStatusEliminadoJS;
            cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = oProyectoTela.Usuario;
            cmd.Parameters.Add("@procesos", SqlDbType.VarChar).Value = oProyectoTela.Procesos;
            cmd.Parameters.Add("@procesos_eliminados", SqlDbType.VarChar).Value = oProyectoTela.Procesos_Eliminados;

            SqlParameter oId = cmd.Parameters.Add("@Id", SqlDbType.Int);
            oId.Direction = ParameterDirection.ReturnValue;

            //int iresult = cmd.ExecuteNonQuery();
            //transaction.Commit();
            //return iresult;

            cmd.ExecuteNonQuery();
            id = (int)oId.Value;
            transaction.Commit();
            return id;

        }

    }
}
