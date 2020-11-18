using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;
using DAL_ERP;

namespace BL_ERP
{
    public class blPoSample : blLog
    {
        string nombreBD = string.Empty;
        // :edu 20171017 EXPORTAR A PDF
        public PoSample UltimoPoInd(int pIdPo, string nombreBD = null)
        {
            PoSample objPo = new PoSample();
            string Conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(Conexion))
            {
                try
                {
                    con.Open();
                    daPoSample odata = new daPoSample();
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

        public List<PoClienteEstiloDestinoTallaColorSample> GetListaPoClienteEstiloDestinoTallaColor(int pIdPoClienteEstilo, string nombreBD = null)
        {
            List<PoClienteEstiloDestinoTallaColorSample> lista = new List<PoClienteEstiloDestinoTallaColorSample>();
            string conexion = nombreBD ?? Util.Default;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPoSample odata = new daPoSample();
                    lista = odata.GetListaPoClienteEstiloDestinoTallaColor(con, pIdPoClienteEstilo);
                }
                catch (Exception ex)
                {
                    lista = null;
                    GrabarArchivoLog(ex);
                }
            }
            return lista;
        }
    }
}
