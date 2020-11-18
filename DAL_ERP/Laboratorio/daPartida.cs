using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using BE_ERP.Laboratorio;
using System.Data;
using System.Data.SqlClient;


namespace DAL_ERP.Laboratorio
{
    public class daPartida
    {
        public beCorreo Correos(SqlConnection con, int IdSolicitud, int IdServicio, int RolOrigen, int RolDestino)
        {
            beCorreo oCorreo = null;
            SqlCommand cmd = new SqlCommand("uspCorreoListar", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@IdSolicitud", SqlDbType.Int).Value = IdSolicitud;
            cmd.Parameters.Add("@IdServicio", SqlDbType.Int).Value = IdServicio;
            cmd.Parameters.Add("@ROLORIGEN", SqlDbType.Int).Value = RolOrigen;
            cmd.Parameters.Add("@ROLDESTINO", SqlDbType.Int).Value = RolDestino;

            SqlDataReader oreader = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (oreader != null)
            {
                while (oreader.Read())
                {
                    oCorreo = new beCorreo();
                    oCorreo.nombre_origen = oreader.GetString(oreader.GetOrdinal("NOMBRE_ORIGEN"));
                    oCorreo.nombre_destino = oreader.GetString(oreader.GetOrdinal("NOMBRE_DESTINO"));
                    oCorreo.idservicio = oreader.GetInt32(oreader.GetOrdinal("IDSERVICIO"));
                    oCorreo.nombre_servicio = oreader.GetString(oreader.GetOrdinal("NOMBRE_SERVICIO"));
                    oCorreo.correo = oreader.GetString(oreader.GetOrdinal("CORREO"));
                    oCorreo.correo_cc = oreader.GetString(oreader.GetOrdinal("CORREOCC"));
                }
            }
            oreader.Close();
            return oCorreo;
        }

        public int DevolverDestino(SqlConnection con, int pCodigoSolicitud, int pOrigen)
        {
            int nDestino = 0;
            string cSql = "";
            cSql = string.Format("select dbo.ufnSolicitudDevolverDestino({0},{1})", pCodigoSolicitud, pOrigen);
            SqlCommand oComando = new SqlCommand(cSql, con);
            oComando.CommandType = CommandType.Text;

            nDestino = (int)oComando.ExecuteScalar();

            return nDestino;
        }

        public beUser DatosPersonal(SqlConnection con, int pIdUsuario)
        {
            beUser oPersonal = new beUser();
            SqlCommand cmd = new SqlCommand("uspPersonalUsuarioBuscar", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@IdUsuario", SqlDbType.Int).Value = pIdUsuario;
            SqlDataReader oreader = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (oreader != null)
            {
                while (oreader.Read())
                {
                    oPersonal = new beUser();
                    oPersonal.IdUsuario = int.Parse(oreader["IdUsuario"].ToString());
                    oPersonal.IdPersonal = int.Parse(oreader["IdPersonal"].ToString());

                    oPersonal.NombrePersonal = oreader["NombrePersonal"].ToString();
                    oPersonal.Correo = oreader["CorreoElectronico"].ToString();

                    oPersonal.IdArea = int.Parse(oreader["IdArea"].ToString());
                    oPersonal.Area = oreader["Area"].ToString();

                    oPersonal.IdCargo = int.Parse(oreader["IdCargo"].ToString());
                    oPersonal.Cargo = oreader["Cargo"].ToString();
                }
                oreader.Close();
            }
            return oPersonal;
        }

        public ReporteLaboratorio GetReporteLaboratorio(SqlConnection con, int id)
        {

            ReporteLaboratorio oReporteLaboratorio = new ReporteLaboratorio();
            SqlCommand cmd = new SqlCommand("uspPartidaReporteObtener", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Cod_Partida", SqlDbType.Int).Value = id;
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleRow);
            if (dr != null)
            {
                if (dr.Read())
                {
                    oReporteLaboratorio = new ReporteLaboratorio();
                    oReporteLaboratorio.CodigoPartida = int.Parse(dr["CodigoPartida"].ToString());
                    oReporteLaboratorio.ReporteTecnico = dr["ReporteTecnico"].ToString();
                    oReporteLaboratorio.NumeroPartida = dr["NumeroPartida"].ToString();
                    oReporteLaboratorio.FechaIngreso = dr["FechaIngreso"].ToString();
                    oReporteLaboratorio.NombreColor = dr["NombreColor"].ToString();
                    oReporteLaboratorio.CodigoTela = dr["CodigoTela"].ToString();
                    oReporteLaboratorio.NombreCliente = dr["NombreCliente"].ToString();
                    oReporteLaboratorio.NombreFabrica = dr["NombreFabrica"].ToString();
                    oReporteLaboratorio.TipoPrueba = dr["TipoPrueba"].ToString();
                    oReporteLaboratorio.StatusPartida = dr["StatusPartida"].ToString();

                    oReporteLaboratorio.ComentarioColor = dr["ComentarioColor"].ToString();
                    oReporteLaboratorio.ComentarioTesting = dr["ComentarioTesting"].ToString();
                    oReporteLaboratorio.InstruccionCuidado = dr["InstruccionCuidado"].ToString();

                    oReporteLaboratorio.EncogimientoLargo = dr["EncogimientoLargo"].ToString();
                    oReporteLaboratorio.EncogimientoAncho = dr["EncogimientoAncho"].ToString();
                    oReporteLaboratorio.Revirado = dr["Revirado"].ToString();
                    oReporteLaboratorio.Apariencia = dr["Apariencia"].ToString();
                    oReporteLaboratorio.Pilling = dr["Pilling"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_1erLav_1 = dr["MuestraA_Ancho_1erLav_1"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_3erLav_1 = dr["MuestraA_Ancho_3erLav_1"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_1erLav_2 = dr["MuestraA_Ancho_1erLav_2"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_3erLav_2 = dr["MuestraA_Ancho_3erLav_2"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_1erLav_3 = dr["MuestraA_Ancho_1erLav_3"].ToString();
                    oReporteLaboratorio.MuestraA_Ancho_3erLav_3 = dr["MuestraA_Ancho_3erLav_3"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_1erLav_1 = dr["MuestraA_Largo_1erLav_1"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_3erLav_1 = dr["MuestraA_Largo_3erLav_1"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_1erLav_2 = dr["MuestraA_Largo_1erLav_2"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_3erLav_2 = dr["MuestraA_Largo_3erLav_2"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_1erLav_3 = dr["MuestraA_Largo_1erLav_3"].ToString();
                    oReporteLaboratorio.MuestraA_Largo_3erLav_3 = dr["MuestraA_Largo_3erLav_3"].ToString();
                    oReporteLaboratorio.MuestraA_1erLav_AC = dr["MuestraA_1erLav_AC"].ToString();
                    oReporteLaboratorio.MuestraA_1erLav_BD = dr["MuestraA_1erLav_BD"].ToString();
                    oReporteLaboratorio.MuestraA_3erLav_AC = dr["MuestraA_3erLav_AC"].ToString();
                    oReporteLaboratorio.MuestraA_3erLav_BD = dr["MuestraA_3erLav_BD"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_1erLav_1 = dr["MuestraB_Ancho_1erLav_1"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_3erLav_1 = dr["MuestraB_Ancho_3erLav_1"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_1erLav_2 = dr["MuestraB_Ancho_1erLav_2"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_3erLav_2 = dr["MuestraB_Ancho_3erLav_2"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_1erLav_3 = dr["MuestraB_Ancho_1erLav_3"].ToString();
                    oReporteLaboratorio.MuestraB_Ancho_3erLav_3 = dr["MuestraB_Ancho_3erLav_3"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_1erLav_1 = dr["MuestraB_Largo_1erLav_1"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_3erLav_1 = dr["MuestraB_Largo_3erLav_1"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_1erLav_2 = dr["MuestraB_Largo_1erLav_2"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_3erLav_2 = dr["MuestraB_Largo_3erLav_2"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_1erLav_3 = dr["MuestraB_Largo_1erLav_3"].ToString();
                    oReporteLaboratorio.MuestraB_Largo_3erLav_3 = dr["MuestraB_Largo_3erLav_3"].ToString();
                    oReporteLaboratorio.MuestraB_1erLav_AC = dr["MuestraB_1erLav_AC"].ToString();
                    oReporteLaboratorio.MuestraB_1erLav_BD = dr["MuestraB_1erLav_BD"].ToString();
                    oReporteLaboratorio.MuestraB_3erLav_AC = dr["MuestraB_3erLav_AC"].ToString();
                    oReporteLaboratorio.MuestraB_3erLav_BD = dr["MuestraB_3erLav_BD"].ToString();
                    oReporteLaboratorio.AcrossChestOriginal = dr["AcrossChestOriginal"].ToString();
                    oReporteLaboratorio.AcrossChestOneCyle = dr["AcrossChestOneCyle"].ToString();
                    oReporteLaboratorio.AcrossChestThreeCyles = dr["AcrossChestThreeCyles"].ToString();
                    oReporteLaboratorio.BottomWidthOriginal = dr["BottomWidthOriginal"].ToString();
                    oReporteLaboratorio.BottomWidthOneCyle = dr["BottomWidthOneCyle"].ToString();
                    oReporteLaboratorio.BottomWidthThreeCyles = dr["BottomWidthThreeCyles"].ToString();
                    oReporteLaboratorio.BodyFromLenOriginal = dr["BodyFromLenOriginal"].ToString();
                    oReporteLaboratorio.BodyFromLeOneCyle = dr["BodyFromLeOneCyle"].ToString();
                    oReporteLaboratorio.BodyFromLeThreeCyles = dr["BodyFromLeThreeCyles"].ToString();
                    oReporteLaboratorio.SleeveLenOriginal = dr["SleeveLenOriginal"].ToString();
                    oReporteLaboratorio.SleeveLenOneCyle = dr["SleeveLenOneCyle"].ToString();
                    oReporteLaboratorio.SleeveLenThreeCyles = dr["SleeveLenThreeCyles"].ToString();
                    oReporteLaboratorio.WaistbandWidthHalfOriginal = dr["WaistbandWidthHalfOriginal"].ToString();
                    oReporteLaboratorio.WaistbandWidthHalfOneCyle = dr["WaistbandWidthHalfOneCyle"].ToString();
                    oReporteLaboratorio.WaistbandWidthHalfThreeCyles = dr["WaistbandWidthHalfThreeCyles"].ToString();
                    oReporteLaboratorio.LegOpeningHalfOriginal = dr["LegOpeningHalfOriginal"].ToString();
                    oReporteLaboratorio.LegOpeningHalfOneCyle = dr["LegOpeningHalfOneCyle"].ToString();
                    oReporteLaboratorio.LegOpeningHalfThreeCyles = dr["LegOpeningHalfThreeCyles"].ToString();
                    oReporteLaboratorio.OutseambelowOriginal = dr["OutseambelowOriginal"].ToString();
                    oReporteLaboratorio.OutseambelowOneCyle = dr["OutseambelowOneCyle"].ToString();
                    oReporteLaboratorio.OutseambelowThreeCyles = dr["OutseambelowThreeCyles"].ToString();
                    oReporteLaboratorio.InseamLenOriginal = dr["InseamLenOriginal"].ToString();
                    oReporteLaboratorio.InseamLenOneCyle = dr["InseamLenOneCyle"].ToString();
                    oReporteLaboratorio.InseamLenThreeCyles = dr["InseamLenThreeCyles"].ToString();

                    oReporteLaboratorio.Densidad = dr["Densidad"].ToString();
                    oReporteLaboratorio.AnchoAcabado = dr["AnchoAcabado"].ToString();

                    oReporteLaboratorio.Seco = dr["Seco"].ToString();
                    oReporteLaboratorio.Humedo = dr["Humedo"].ToString();

                    oReporteLaboratorio.CambioColorSL = dr["CambioColorSL"].ToString();
                    oReporteLaboratorio.AcetatoSL = dr["AcetatoSL"].ToString();
                    oReporteLaboratorio.AlgodonSL = dr["AlgodonSL"].ToString();
                    oReporteLaboratorio.NylonSL = dr["NylonSL"].ToString();
                    oReporteLaboratorio.PoliesterSL = dr["PoliesterSL"].ToString();
                    oReporteLaboratorio.AcrilicoSL = dr["AcrilicoSL"].ToString();
                    oReporteLaboratorio.LanaSL = dr["LanaSL"].ToString();
                    oReporteLaboratorio.SilkSL = dr["SilkSL"].ToString();
                    oReporteLaboratorio.ViscosaSL = dr["ViscosaSL"].ToString();
                    oReporteLaboratorio.EvaluacionAparienciaSL = dr["EvaluacionAparienciaSL"].ToString();
                    oReporteLaboratorio.PillingResultado = dr["PillingResultado"].ToString();
                    oReporteLaboratorio.PillingMin = dr["PillingMin"].ToString();
                    oReporteLaboratorio.BurstingResultado = dr["BurstingResultado"].ToString();
                    oReporteLaboratorio.BurstingMin = dr["BurstingMin"].ToString();

                    oReporteLaboratorio.CambioColorST = dr["CambioColorST"].ToString();
                    oReporteLaboratorio.AcetatoST = dr["AcetatoST"].ToString();
                    oReporteLaboratorio.AlgodonST = dr["AlgodonST"].ToString();
                    oReporteLaboratorio.NylonST = dr["NylonST"].ToString();
                    oReporteLaboratorio.SilkST = dr["SilkST"].ToString();
                    oReporteLaboratorio.PoliesterST = dr["PoliesterST"].ToString();
                    oReporteLaboratorio.AcrilicoST = dr["AcrilicoST"].ToString();
                    oReporteLaboratorio.LanaST = dr["LanaST"].ToString();
                    oReporteLaboratorio.ViscosaST = dr["ViscosaST"].ToString();

                    oReporteLaboratorio.CambioColorSA = dr["CambioColorSA"].ToString();
                    oReporteLaboratorio.AcetatoSA = dr["AcetatoSA"].ToString();
                    oReporteLaboratorio.AlgodonSA = dr["AlgodonSA"].ToString();
                    oReporteLaboratorio.NylonSA = dr["NylonSA"].ToString();
                    oReporteLaboratorio.SilkSA = dr["SilkSA"].ToString();
                    oReporteLaboratorio.PoliesterSA = dr["PoliesterSA"].ToString();
                    oReporteLaboratorio.AcrilicoSA = dr["AcrilicoSA"].ToString();
                    oReporteLaboratorio.LanaSA = dr["LanaSA"].ToString();
                    oReporteLaboratorio.ViscosaSA = dr["ViscosaSA"].ToString();

                    oReporteLaboratorio.CambioColorBlanqueadorSinCloroSodiumPerborate = dr["CambioColorBlanqueadorSinCloroSodiumPerborate"].ToString();
                    oReporteLaboratorio.CambioColorBlanqueadorSinCloroHydrogenPeroxide = dr["AcrilicoST"].ToString();
                    oReporteLaboratorio.CambioColorBlanqueadorConCloro = dr["CambioColorBlanqueadorConCloro"].ToString();

                    oReporteLaboratorio.ResultadoPH = dr["ResultadoPH"].ToString();
                    oReporteLaboratorio.RequeridoPH = dr["RequeridoPH"].ToString();
                    oReporteLaboratorio.WikingPulgadas = dr["WikingPulgadas"].ToString();
                    oReporteLaboratorio.WikingMinutes = dr["WikingMinutos"].ToString();
                    oReporteLaboratorio.WikingMin30Wales = dr["Wales30Wiking"].ToString();
                    oReporteLaboratorio.WikingMin30Courses = dr["Courses30Wiking"].ToString();


                    // Status
                    oReporteLaboratorio.EncogimientoStatus = int.Parse(dr["EncogimientoStatus"].ToString());
                    oReporteLaboratorio.ReviradoStatus = int.Parse(dr["ReviradoStatus"].ToString());
                    oReporteLaboratorio.AparienciaStatus = int.Parse(dr["AparienciaStatus"].ToString());
                    oReporteLaboratorio.DensidadStatus = int.Parse(dr["DensidadStatus"].ToString());
                    oReporteLaboratorio.SolidezFroteStatus = int.Parse(dr["SolidezFroteStatus"].ToString());
                    oReporteLaboratorio.SolidezLavadoStatus = int.Parse(dr["SolidezLavadoStatus"].ToString());
                    oReporteLaboratorio.ResistenciaPillingStatus = int.Parse(dr["ResistenciaPillingStatus"].ToString());
                    oReporteLaboratorio.BurstingStatus = int.Parse(dr["BurstingStatus"].ToString());
                    oReporteLaboratorio.SolidezTranspiracionStatus = int.Parse(dr["SolidezTranspiracionStatus"].ToString());
                    oReporteLaboratorio.BlanqueadorSinClaroStatus = int.Parse(dr["BlanqueadorSinClaroStatus"].ToString());
                    oReporteLaboratorio.BlanqueadorConCloroStatus = int.Parse(dr["BlanqueadorConCloroStatus"].ToString());
                    oReporteLaboratorio.SolidezAguaStatus = int.Parse(dr["SolidezAguaStatus"].ToString());
                    oReporteLaboratorio.PHStatus = int.Parse(dr["PHStatus"].ToString());
                    oReporteLaboratorio.WikingStatus = int.Parse(dr["WikingStatus"].ToString());

                    // Encogimiento Nuevos Campos

                    oReporteLaboratorio.EncogimientoLargo_EP = dr["EncogimientoLargo_EP"].ToString();
                    oReporteLaboratorio.EncogimientoAncho_EP = dr["EncogimientoAncho_EP"].ToString();
                    oReporteLaboratorio.Revirado_EP = dr["Revirado_EP"].ToString();
                    oReporteLaboratorio.Apariencia_EP = dr["Apariencia_EP"].ToString();
                    oReporteLaboratorio.Pilling_EP = dr["Pilling_EP"].ToString();
                    oReporteLaboratorio.EncogimientoStatus_EP = dr["EncogimientoStatus_EP"].ToString();
                    oReporteLaboratorio.ReviradoStatus_EP = dr["ReviradoStatus_EP"].ToString();

                    oReporteLaboratorio.EncogimientoLargo_HW = dr["EncogimientoLargo_HW"].ToString();
                    oReporteLaboratorio.EncogimientoAncho_HW = dr["EncogimientoAncho_HW"].ToString();
                    oReporteLaboratorio.Revirado_HW = dr["Revirado_HW"].ToString();
                    oReporteLaboratorio.Apariencia_HW = dr["Apariencia_HW"].ToString();
                    oReporteLaboratorio.Pilling_HW = dr["Pilling_HW"].ToString();
                    oReporteLaboratorio.EncogimientoStatus_HW = dr["EncogimientoStatus_HW"].ToString();
                    oReporteLaboratorio.ReviradoStatus_HW = dr["ReviradoStatus_HW"].ToString();




                }
                dr.Close();
            }
            return oReporteLaboratorio;
        }

    }
}
