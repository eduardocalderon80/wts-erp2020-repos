// :edu 20171017 exportar a pdf
using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;
// :edu 20171017 EXPORTAR A PDF
using System.Collections.Generic;

namespace BL_ERP
{
    public class blPo : blLog
    {
        string nombreBD = string.Empty;
        public blPo()
        {

        }

        // :edu 20171017 EXPORTAR A PDF
        public Po UltimoPoInd(int pIdPo, string nombreBD = null)
        {
            Po objPo = new Po();
            string Conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daPo odata = new daPo();
                    objPo = odata.UltimoPoInd(con, pIdPo);
                }
                catch (Exception ex)
                {
                    objPo = null;
                    GrabarArchivoLog(ex);
                }
            }
            return objPo;
        }
        // :edu 20171017 EXPORTAR A PDF
        public List<Empresa> GetAllEmpresa(string nombreBD = null)
        {
            List<Empresa> listaEmpresa = new List<Empresa>();
            string conexion = nombreBD;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPo odata = new daPo();
                    listaEmpresa = odata.GetAllEmpresa(con);
                }
                catch (Exception ex)
                {
                    listaEmpresa = null;
                    GrabarArchivoLog(ex);
                }
            }

            return listaEmpresa;
        }

        public List<PoClienteEstiloTallaColor> GetListaPoClienteEstiloTallaColor(int pIdPoClienteEstilo, string nombreBD = null)
        {
            List<PoClienteEstiloTallaColor> lista = new List<PoClienteEstiloTallaColor>();
            string conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPo odata = new daPo();
                    lista = odata.GetListaPoClienteEstiloTallaColor(con, pIdPoClienteEstilo);
                }
                catch (Exception ex)
                {
                    lista = null;
                    GrabarArchivoLog(ex);
                }
            }
            return lista;
        }

        public int SavePOMarmaxx(string Po, string PoCliente, string PoClienteEstilo, string PoClienteEstiloDestino, string PoClienteEstiloDestinoTallaColor, string Usuario)
        {
            int response = -1;
            string Conexion = Util.Default;
            SqlTransaction transaction = null;

            using (SqlConnection con = new SqlConnection(Conexion))
            {
                con.Open();
                transaction = con.BeginTransaction();

                try
                {
                    daPo odata = new daPo();
                    response = odata.SavePOMarmaxx(con, transaction, Po, PoCliente, PoClienteEstilo, PoClienteEstiloDestino, PoClienteEstiloDestinoTallaColor, Usuario);
                    transaction.Commit();
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
