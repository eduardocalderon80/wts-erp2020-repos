using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.Planeamiento;
using System.Data;
using System.Data.SqlClient;

namespace DAL_ERP.Planeamiento
{
    public class daOrdenCompraTextil
    {
        public List<OrdenCompraTextil> OrdenCompraTextil_Export_Excel(SqlConnection con, string codigofabrica, string codigocliente, string fechadesde, string fechahasta, int idoc, string usuarioad)
        {
            OrdenCompraTextil objOrdenCompraTextil = new OrdenCompraTextil();
            List<OrdenCompraTextil> listOrdenCompraTextil = new List<OrdenCompraTextil>();

            SqlCommand cmd = new SqlCommand("usp_PO_OC_Export_Excel", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@codigofabrica", Convert.ToString(codigofabrica));
            cmd.Parameters.AddWithValue("@codigocliente", Convert.ToString(codigocliente));
            cmd.Parameters.AddWithValue("@fechadesde", Convert.ToString(fechadesde));
            cmd.Parameters.AddWithValue("@fechahasta", Convert.ToString(fechahasta));
            cmd.Parameters.AddWithValue("@idoc", Convert.ToInt32(idoc));
            cmd.Parameters.AddWithValue("@usuarioad", Convert.ToString(usuarioad));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objOrdenCompraTextil = new OrdenCompraTextil();

                        objOrdenCompraTextil.po = Convert.ToString(oReader[0]);
                        objOrdenCompraTextil.estilo = Convert.ToString(oReader[1]);
                        objOrdenCompraTextil.lote = Convert.ToString(oReader[2]);
                        objOrdenCompraTextil.color = Convert.ToString(oReader[3]);
                        objOrdenCompraTextil.cantidad = Convert.ToString(oReader[4]);
                        objOrdenCompraTextil.fecha_creacion = Convert.ToString(oReader[5]);
                        objOrdenCompraTextil.dias_sinoct = Convert.ToString(oReader[6]);
                        objOrdenCompraTextil.fecha_fab_original = Convert.ToString(oReader[7]);
                        objOrdenCompraTextil.leadtime_fabrica = Convert.ToString(oReader[8]);
                        objOrdenCompraTextil.tela = Convert.ToString(oReader[9]);
                        objOrdenCompraTextil.fabrica = Convert.ToString(oReader[10]);
                        objOrdenCompraTextil.cliente = Convert.ToString(oReader[11]);
                        objOrdenCompraTextil.vendedor = Convert.ToString(oReader[12]);
                        objOrdenCompraTextil.division = Convert.ToString(oReader[13]);
                        objOrdenCompraTextil.temporada = Convert.ToString(oReader[14]);
                        objOrdenCompraTextil.descripcion = Convert.ToString(oReader[15]);
                        objOrdenCompraTextil.controller = Convert.ToString(oReader[16]);
                        objOrdenCompraTextil.envio = Convert.ToString(oReader[17]);
                        objOrdenCompraTextil.oc = Convert.ToString(oReader[18]);
                        objOrdenCompraTextil.proveedortela = Convert.ToString(oReader[19]);
                        objOrdenCompraTextil.fechaoc = Convert.ToString(oReader[20]);

                        listOrdenCompraTextil.Add(objOrdenCompraTextil);
                    }
                }
            }

            return listOrdenCompraTextil;
        }
    }
}
