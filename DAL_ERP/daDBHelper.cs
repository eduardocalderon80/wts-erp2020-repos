using System;
using System.Data;
using System.Collections.Generic;
using System.Data.SqlClient;
using Newtonsoft.Json;
using BE_ERP;

namespace DAL_ERP
{
  public  class daDBHelper
    {
        public daDBHelper()
        {
        }

        public int SaveRow(SqlConnection Conexion, string SP, List<Parameter> Parameters) {
            SqlCommand cmd = new SqlCommand(SP, Conexion)
            {
                CommandType = CommandType.StoredProcedure
            };
            if (Parameters.Count > 0) {
                foreach (Parameter parametro in Parameters) {                    
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }
            int iresult = cmd.ExecuteNonQuery();
            return iresult;
        }

        public string SaveRow_String(SqlConnection Conexion,string SP, List<Parameter> Parameters, int SizeOutPut=-1)
        {
            SqlCommand cmd = new SqlCommand(SP, Conexion)
            {
                CommandType = CommandType.StoredProcedure
            };

            SqlParameter preturn = new SqlParameter
            {
                ParameterName = "@return",
                DbType = DbType.String,
                Size = SizeOutPut,
                Direction = ParameterDirection.Output
            };

            if (Parameters.Count > 0)
            {
                foreach (Parameter parametro in Parameters)
                {
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            string data = string.Empty;
            data = preturn.Value.ToString();
            return data;
        }

        public int SaveRow_Out(SqlConnection Conexion, string SP, List<Parameter> Parameters)
        {
            SqlCommand cmd = new SqlCommand(SP, Conexion)
            {
                CommandType = CommandType.StoredProcedure
            };

            SqlParameter preturn = new SqlParameter
            {
                ParameterName = "@return",
                DbType = DbType.Int32,
                Direction = ParameterDirection.Output
                
            };

            if (Parameters.Count > 0)
            {
                foreach (Parameter parametro in Parameters)
                {
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            int idvalue = -1;
            idvalue = int.Parse(preturn.Value.ToString());
            return idvalue;
        }

        public int SaveRowsTransaction(SqlConnection Conexion, SqlTransaction transaction, string SP, List<Parameter> Parameters)
        {
            SqlCommand cmd = new SqlCommand(SP, Conexion, transaction)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (Parameters.Count > 0)
            {
                foreach (Parameter parametro in Parameters)
                {
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }

            int iresult = cmd.ExecuteNonQuery();
            transaction.Commit();
            return iresult;
        }

        public int SaveRowsTransaction_Out(SqlConnection Conexion, SqlTransaction transaction, string SP, List<Parameter> Parameters)
        {
            SqlCommand cmd = new SqlCommand(SP, Conexion, transaction)
            {
                CommandType = CommandType.StoredProcedure
            };

            SqlParameter preturn = new SqlParameter
            {
                ParameterName = "@return",
                DbType = DbType.Int32,
                Direction = ParameterDirection.Output
            };

            if (Parameters.Count > 0)
            {
                foreach (Parameter parametro in Parameters)
                {
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }
            cmd.Parameters.Add(preturn);

            int iresult = cmd.ExecuteNonQuery();
            int idvalue = iresult > 0 ? int.Parse(preturn.Value.ToString()) : 0;
            transaction.Commit();
            return idvalue;
        }

        public string GetData(SqlConnection Conexion, string SP, List<Parameter> Parameters, bool ListToJson = false)
        {
            string retorno = string.Empty;
            object oretorno = null;
            SqlCommand cmd = new SqlCommand(SP, Conexion)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (Parameters.Count > 0)
            {
                foreach (Parameter parametro in Parameters)
                {
                    cmd.Parameters.Add(string.Format("@{0}", parametro.Key), SqlDbType.VarChar, parametro.Size);
                    cmd.Parameters[string.Format("@{0}", parametro.Key)].Value = parametro.Value;
                }
            }

            string tipo = ListToJson ? "list" : "cadena";
            switch (tipo)
            {
                case "cadena":
                    oretorno = cmd.ExecuteScalar();
                    if (oretorno != null)
                    {
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
    }
}
