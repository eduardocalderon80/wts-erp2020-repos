using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;

namespace BL_ERP
{
  public  class blMantenimiento:blLog
    {
        string nombreBD = string.Empty;
        
        public blMantenimiento() {}
        
        
        public int save_Row(string sp, string parametro, string nombreBD=null)
        {
            int response = -1;            
            string Conexion = nombreBD ?? Util.Default;
            

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.save_Row(con, sp, parametro);
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }
                
        public string save_Row_String(string sp, string parametro, int size_output=0, string nombreBD = null)
        {
            string response = string.Empty;
            string Conexion = nombreBD ?? Util.Default;
            
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.save_Row_String(con, sp, parametro,size_output);
                }
                catch (Exception ex)
                {
                    response = "";
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

        public int save_Row_Out(string sp, string parametro, string nombreBD = null)
        {
            int response = -1;
            string Conexion = nombreBD ?? Util.Default;


            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.save_Row_Out(con, sp, parametro);
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

        public int save_Rows(string sp, string parHead, string nombreBD=null, string parDetail = null, string parSubDetail = null, string parFoot = null)
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
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.save_Rows(con,transaction, sp, parHead,parDetail,parSubDetail,parFoot);
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

        public int save_Rows_Out(string sp, string parHead, string nombreBD = null, string parDetail = null, string parSubDetail = null, string parFoot = null, string parSubFoot = null)
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
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.save_Rows_Out(con, transaction, sp, parHead, parDetail, parSubDetail, parFoot, parSubFoot);
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

        public string get_Data(string sp, string parametro, bool ListToJson = false, string nombreBD = null)
        { 
            string response = string.Empty;
            string Conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMantenimiento odata = new daMantenimiento();
                    response = odata.get_Data(con, sp, parametro, ListToJson);
                }
                catch (Exception ex)
                {
                    response = string.Empty;                    
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }
        public DataTable get_DataDT(string sp, string parametro, string nombreBD = null)
        {
            DataTable Dt = null;
            string Conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daMantenimiento odata = new daMantenimiento();
                    Dt = odata.get_DataDT(con, sp, parametro);
                }
                catch (Exception ex)
                {
                    Dt = null;
                    GrabarArchivoLog(ex);
                }
            }
            return Dt;
        }
        public bool save_Rows_BulkCopy(string nombreTablaBD, DataTable parametroTable, string nombreBD = null)
        {
            bool exitoBulkCopy = false;
            string Conexion = nombreBD ?? Util.Default;
            
            using (SqlBulkCopy con = new SqlBulkCopy(Conexion))
            {                          
                try
                {
                    daMantenimiento odata = new daMantenimiento();
                    exitoBulkCopy = odata.save_Rows_BulkCopy(con, parametroTable,nombreTablaBD);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                    exitoBulkCopy = false;
                }
            }
            return exitoBulkCopy;
        }

    }
}
