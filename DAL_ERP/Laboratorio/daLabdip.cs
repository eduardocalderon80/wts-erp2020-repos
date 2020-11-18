using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.Laboratorio;
using System.Data;
using System.Data.SqlClient;


namespace DAL_ERP.Laboratorio
{
    public class daLabdip
    {
        public List<Labdip> LabDipReceive_Export(SqlConnection con, int idcliente, int estadolab)
        {
            Labdip objLabdip = new Labdip();
            List<Labdip> listLabdip = new List<Labdip>();

            SqlCommand cmd = new SqlCommand("usp_Labdip_Report", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@idcliente", Convert.ToInt32(idcliente));
            cmd.Parameters.AddWithValue("@estadolab", Convert.ToInt32(estadolab));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objLabdip = new Labdip();

                        objLabdip.color = Convert.ToString(oReader[0]);
                        objLabdip.fabric = Convert.ToString(oReader[1]);
                        objLabdip.standard = Convert.ToString(oReader[2]);
                        objLabdip.tipo = Convert.ToString(oReader[3]);
                        objLabdip.aprobadopor = Convert.ToString(oReader[4]);
                        objLabdip.cliente = Convert.ToString(oReader[5]);
                        objLabdip.tintoreria = Convert.ToString(oReader[6]);
                        objLabdip.temporada = Convert.ToString(oReader[7]);
                        objLabdip.alternativa = Convert.ToString(oReader[8]);
                        objLabdip.codigotintoreria = Convert.ToString(oReader[9]);
                        objLabdip.comentario = Convert.ToString(oReader[10]);
                        objLabdip.original = Convert.ToString(oReader[11]);
                        objLabdip.numeropartida = Convert.ToString(oReader[12]);
                        objLabdip.solidezluz = Convert.ToString(oReader[13]);
                        objLabdip.solidezhumedo = Convert.ToString(oReader[14]);
                        objLabdip.solidezseco = Convert.ToString(oReader[15]);
                        objLabdip.fechacreacion = Convert.ToString(oReader[16]);
                        objLabdip.fechaenvio = Convert.ToString(oReader[17]);
                        objLabdip.fecharecibido = Convert.ToString(oReader[18]);
                        
                        listLabdip.Add(objLabdip);
                    }
                }
            }

            return listLabdip;

        }

    }
}
