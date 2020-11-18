using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.RecursosHumanos;
using System.Data;
using System.Data.SqlClient;


namespace DAL_ERP.RecursosHumanos
{
    public class daPersonal
    {
        public List<Personal> Personal_ReportPDF(SqlConnection con, int pIdArea, int pIdCargo, int pEstado)
        {
            Personal objPersonal = new Personal();
            List<Personal> listPersonal = new List<Personal>();

            //SqlCommand cmd = new SqlCommand("usp_PersonalReporte", con);
            SqlCommand cmd = new SqlCommand("GestionTalento.usp_Personal_Export_Reporte", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdArea", Convert.ToInt32(pIdArea));
            cmd.Parameters.AddWithValue("@IdCargo", Convert.ToInt32(pIdCargo));
            cmd.Parameters.AddWithValue("@Eliminado", Convert.ToInt32(pEstado));

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        objPersonal = new Personal();
                        objPersonal.IdPersonal = Convert.ToInt32(oReader[0]);
                        objPersonal.NombrePersonal = oReader[1].ToString();
                        objPersonal.PrimerNombre = oReader[2].ToString();
                        objPersonal.SegundoNombre = oReader[3].ToString();
                        objPersonal.PrimerApellido = oReader[4].ToString();
                        objPersonal.SegundoApellido = oReader[5].ToString();
                        objPersonal.Dni = oReader[6].ToString();
                        objPersonal.CorreoElectronico = oReader[7].ToString();
                        objPersonal.IdArea = Convert.ToInt32(oReader[8].ToString());
                        objPersonal.Area = oReader[9].ToString();
                        objPersonal.IdSubArea = Convert.ToInt32(oReader[10].ToString());
                        objPersonal.SubArea = oReader[11].ToString();
                        objPersonal.IdEquipoTrabajo = Convert.ToInt32(oReader[12].ToString());
                        objPersonal.EquipoTrabajo = oReader[13].ToString();
                        objPersonal.IdCargo = Convert.ToInt32(oReader[14].ToString());
                        objPersonal.Cargo = oReader[15].ToString();
                        objPersonal.ImagenWebNombre = oReader[16].ToString();
                        objPersonal.IdLaptop = Convert.ToInt32(oReader[17].ToString());
                        objPersonal.IdCelular = Convert.ToInt32(oReader[18].ToString());
                        objPersonal.Estado = Convert.ToInt32(oReader[19].ToString());
                        objPersonal.FechaInicio = oReader[20].ToString();
                        objPersonal.FechaCese = oReader[21].ToString();
                        objPersonal.FechaNacimiento = oReader[22].ToString(); 
                        objPersonal.NombrePreferido = oReader[23].ToString();
                        objPersonal.RegistraMarcacion = oReader[24].ToString();
                        objPersonal.CorreoPersonal = oReader[25].ToString();
                        objPersonal.Sexo = oReader[26].ToString();
                        listPersonal.Add(objPersonal);
                    }
                }
            }

            return listPersonal;
        }
    }
}
