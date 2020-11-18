using System;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace DAL_ERP
{
    public class daMantenimiento
    {
        public int save_Row(SqlConnection con, string sp, string parametro)
        {
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            int iresult = cmd.ExecuteNonQuery();
            return iresult;
        }
        
        public string save_Row_String(SqlConnection con, string sp, string parametro,int size_output=0)
        {
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter preturn = new SqlParameter();
            preturn.ParameterName = "@return";
            preturn.DbType = DbType.String;
            if (size_output > 0) { preturn.Size = size_output; }
            preturn.Direction = ParameterDirection.Output;

            cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            string data= string.Empty;
            data=preturn.Value.ToString();
            return data;
        }

        public int save_Row_Out(SqlConnection con, string sp, string parametro)
        {
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter preturn = new SqlParameter();
            preturn.ParameterName = "@return";
            preturn.DbType = DbType.Int32;
            preturn.Direction = ParameterDirection.Output;

            cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            int idvalue = -1;
            idvalue = int.Parse(preturn.Value.ToString());
            return idvalue;
        }


        public int save_Rows(SqlConnection con, SqlTransaction transaction,string sp, string parHead,string parDetail=null, string parSubDetail=null, string parFoot=null)
        {
            SqlCommand cmd = new SqlCommand(sp, con, transaction);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@parHead", SqlDbType.VarChar).Value = parHead;
            cmd.Parameters.Add("@parDetail", SqlDbType.VarChar,-1).Value = parDetail??"";
            cmd.Parameters.Add("@parSubDetail", SqlDbType.VarChar).Value = parSubDetail ?? "";
            cmd.Parameters.Add("@parFoot", SqlDbType.VarChar).Value = parFoot ?? "";
            
            int iresult = cmd.ExecuteNonQuery();
            transaction.Commit();
            return iresult;
        }

        // :edu se agrego parametro opcional parSubFoot
        public int save_Rows_Out(SqlConnection con, SqlTransaction transaction, string sp, string parHead, string parDetail=null, string parSubDetail = null, string parFoot = null, 
            string parSubFoot = null)
        {
            SqlCommand cmd = new SqlCommand(sp, con, transaction);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter preturn = new SqlParameter();
            preturn.ParameterName = "@return";
            preturn.DbType = DbType.Int32;
            preturn.Direction = ParameterDirection.Output;

            cmd.Parameters.Add("@parHead", SqlDbType.VarChar).Value = parHead;
            cmd.Parameters.Add("@parDetail", SqlDbType.VarChar, -1).Value = parDetail??" ";
            cmd.Parameters.Add("@parSubDetail", SqlDbType.VarChar).Value = parSubDetail ?? " ";
            cmd.Parameters.Add("@parFoot", SqlDbType.VarChar).Value = parFoot ?? " ";
            if (parSubFoot != null)
            {
                cmd.Parameters.Add("@parSubFoot", SqlDbType.VarChar).Value = parSubFoot ?? " ";
            }
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            int idvalue = iresult > 0 ? int.Parse(preturn.Value.ToString()) : 0;
            transaction.Commit();
            return idvalue;
        }

        public string get_Data(SqlConnection con, string sp, string parametro, bool ListToJson = false)
        {
            string retorno = string.Empty;
            object oretorno = null;
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;
            //cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;

            if (parametro != null && parametro != string.Empty)
            {
                cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            }

            string tipo = ListToJson ? "list" : "cadena";
            switch (tipo)
            {
                case "cadena":
                    oretorno = cmd.ExecuteScalar();
                    if (oretorno != null) {
                        retorno = oretorno.ToString();
                    }
                    break;
                case "list":
                    SqlDataReader dr = cmd.ExecuteReader();
                    DataTable dt = new DataTable();
                    dt.Load(dr);
                    retorno = JsonConvert.SerializeObject(dt, Formatting.None).ToString();
                    break;
                default:
                    break;
            }
            return retorno;
        }
        public DataTable get_DataDT(SqlConnection con, string sp, string parametro)
        {
            string retorno = string.Empty;
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;
            //cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            if (parametro != null)
            {
                cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = parametro;
            }

            SqlDataReader dr = cmd.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Load(dr);

            return dt;
        }

        public bool save_Rows_BulkCopy(SqlBulkCopy con, DataTable parametroDataTable,string nombreTablaBD)
        {
            bool exitoBulkCopy = false;
            con.DestinationTableName = string.Format("dbo.{0}", nombreTablaBD); //"dbo.producto";//dbo.TG_PlaneamientoDetalle_TEMPORAL
            con.WriteToServer(parametroDataTable);
            exitoBulkCopy = true;
            return exitoBulkCopy;
        }

    }
}
