using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;

namespace BL_ERP
{
   public class DBHelper : blLog
    {
        public DBHelper()
        {

        }

        /// <summary>
        /// Metodo para grabar una Fila
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter</param>
        /// <param name="NombreBD">Nombre de la BD</param>
        /// <returns>int</returns>
        public int SaveRow(string SP, List<Parameter> Parameters, string NombreBD = null)
        {
            int response = -1;
            string Conexion = NombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daDBHelper odata = new daDBHelper();                    
                    response = odata.SaveRow(con, SP, Parameters);
                    con.Close();
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

        /// <summary>
        /// Metodo para Grabar una Fila
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter</param>
        /// <param name="SizeOutPut">Tamaño del parametro de salida => recomendable ingresar</param>
        /// <param name="NombreBD">Nombre de la BD</param>
        /// <returns>String</returns>
        public string SaveRow_String(string SP, List<Parameter> Parameters, int SizeOutPut = -1, string NombreBD = null)
        {
            string response = string.Empty;
            string Conexion = NombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daDBHelper odata = new daDBHelper();
                    response = odata.SaveRow_String(con, SP, Parameters,SizeOutPut);                    
                    con.Close();
                }
                catch (Exception ex)
                {
                    response = "";
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }

        /// <summary>
        /// Metodo para grabar una Fila con parametro de Salida
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter, parametro de salida @return</param>
        /// <param name="NombreBD">Nombre de la BD</param>
        /// <returns>int</returns>
        public int SaveRow_Out(string SP, List<Parameter> Parameters, string NombreBD = null)
        {
            int response = -1;
            string Conexion = NombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daDBHelper odata = new daDBHelper();
                    response = odata.SaveRow_Out(con, SP, Parameters);                    
                    con.Close();
                }
                catch (Exception ex)
                {
                    response = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }


        /// <summary>
        /// Metodo para grabar una o varias Filas con Transacción
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter</param>
        /// <param name="NombreBD">Nombre de la BD</param>
        /// <returns>int</returns>
        public int SaveRowsTransaction(string SP, List<Parameter> Parameters, string NombreBD = null)
        {
            int response = -1;
            string Conexion = NombreBD ?? Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daDBHelper odata = new daDBHelper();
                    response = odata.SaveRowsTransaction(con, transaction,SP,Parameters);
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

        /// <summary>
        /// Metodo para grabar una o varias Filas con Transacción
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter, parametro de salida @return</param>
        /// <param name="NombreBD">Nombre de la BD</param>
        /// <returns>int</returns>
        public int SaveRowsTransaction_Out( string SP, List<Parameter> Parameters, string NombreBD = null)
        {
            int response = -1;
            string Conexion = NombreBD ?? Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daDBHelper odata = new daDBHelper();
                    response = odata.SaveRowsTransaction_Out(con, transaction, SP, Parameters);
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


        /// <summary>
        /// Metodo para Obtener Data
        /// </summary>
        /// <param name="SP">Nombre del Store Procedure</param>
        /// <param name="Parameters">Lista de Parametros de tipo Parameter</param>
        /// <param name="ListToJson">true => Si el resultado es de multiple columnas (select nombre, apellido, edad)</param>
        /// <param name="NombreBD">Nombre de la Base de Datos</param>
        /// <returns>string</returns>
        public string GetData(string SP, List<Parameter> Parameters, bool ListToJson = false, string NombreBD = null)
        {
            string response = string.Empty;
            string Conexion = NombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daDBHelper odata = new daDBHelper();
                    response = odata.GetData(con, SP, Parameters, ListToJson);
                }
                catch (Exception ex)
                {
                    response = string.Empty;
                    GrabarArchivoLog(ex);
                }
            }
            return response;
        }


    }
}
