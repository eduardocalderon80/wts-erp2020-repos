using System;
using System.Collections.Generic;
using BE_ERP;
using System.Data.SqlClient;
using DAL_ERP.Laboratorio;
using BE_ERP.Laboratorio;
using System.IO;
using Newtonsoft.Json;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace BL_ERP.Laboratorio
{
    public class blPartida : blLog
    {
        blLog logerror = new blLog();

        public beCorreo Correos(int IdSolicitud, int IdServicio, int RolOrigen, int RolDestino, string nombreBD = null)
        {
            beCorreo oCorreos = new beCorreo();
            string conexion = nombreBD ?? Util.ERP;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPartida odatapartida = new daPartida();
                    oCorreos = odatapartida.Correos(con, IdSolicitud, IdServicio, RolOrigen, RolDestino);

                }
                catch (Exception ex)
                {
                    oCorreos = null;
                    GrabarArchivoLog(ex);
                }
            }

            return oCorreos;
        }

        public int DevolverDestino(int pCodigoSolicitud, int pOrigen, string nombreBD = null)
        {
            string conexion = nombreBD ?? Util.ERP;
            int ndestino = 0;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPartida odatapartida = new daPartida();
                    ndestino = odatapartida.DevolverDestino(con, pCodigoSolicitud, pOrigen);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return ndestino;
        }

        public beUser DatosPersonal(int pIdUsuario, string nombreBD = null)
        {
            beUser opersonal = null;
            string conexion = nombreBD ?? Util.ERP;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPartida odatapartida = new daPartida();
                    opersonal = odatapartida.DatosPersonal(con, pIdUsuario);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return opersonal;
        }

        public string Bl_GetData_ReportePartida(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = bl.get_Data("usp_Laboratorio_ReporteBase", par, true, Util.ERP);
            return data;
        }

        public string Bl_GetData_ReporteSolicitud(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = bl.get_Data("uspPartidaSolicitudReporteObtener", par, true, Util.Intranet);
            return data;
        }
        
        public string Bl_GetData_ReportePartida_v2(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = bl.get_Data("usp_Laboratorio_ReportePDF", par, true, Util.Intranet);
            return data;
        }

        public ReporteLaboratorio GetReporteLaboratorio(int id)
        {
            ReporteLaboratorio oReporteLaboratorio = null;
            string conexion = Util.Intranet;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    daPartida odatapartida = new daPartida();
                    oReporteLaboratorio = odatapartida.GetReporteLaboratorio(con, id);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return oReporteLaboratorio;
        }
        public byte[] CrearPdf_Partida(ReporteLaboratorio oreporte)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();
            blMantenimiento bl = new blMantenimiento();
            try
            {
                List<ReporteBase> lista = new List<ReporteBase>();
                lista = JsonConvert.DeserializeObject<List<ReporteBase>>(oreporte.reporteBase);

                List<ReporteDetalle> listaDetalle = new List<ReporteDetalle>();
                listaDetalle = JsonConvert.DeserializeObject<List<ReporteDetalle>>(oreporte.reporteDetalle);

                List<ReporteKeys> listaKeys = new List<ReporteKeys>();
                listaKeys = JsonConvert.DeserializeObject<List<ReporteKeys>>(oreporte.reporteKeys);

                List<ReporteConditions> listaConditions = new List<ReporteConditions>();
                listaConditions = JsonConvert.DeserializeObject<List<ReporteConditions>>(oreporte.reporteConditions);

                // :document
                iTextSharp.text.pdf.PdfWriter pdfw = default(iTextSharp.text.pdf.PdfWriter);
                Document document = new Document(PageSize.A4, 50f, 20f, 30f, 50f);

                blReportePartida partida = new blReportePartida();
                pdfw = PdfWriter.GetInstance(document, ms);

                // :open
                document.Open();

                float[] arrayWidth = new float[] { 230f, 270f };
                partida.Tabla_Encabezado_Logo(document, lista, 1, arrayWidth);

                arrayWidth = new float[] { 60f, 190f, 60f, 190f };
                partida.Tabla_Base(document, lista, 2, arrayWidth);

                arrayWidth = new float[] { 100f, 400f };
                partida.Tabla_Base(document, lista, 3, arrayWidth);

                arrayWidth = new float[] { 300f, 100f, 100f };
                partida.Tabla_Resumen(document, listaDetalle, 4, arrayWidth);

                arrayWidth = new float[] { 300f, 130f, 100f, 40f, 40f };
                partida.Tabla_Detalle(document, listaDetalle, 5, arrayWidth);

                arrayWidth = new float[] { 300f, 130f, 100f, 40f, 40f };
                partida.Tabla_Detalle(document, listaDetalle, 6, arrayWidth);

                arrayWidth = new float[] { 300f, 130f, 100f, 40f, 40f };
                partida.Tabla_Detalle(document, listaDetalle, 7, arrayWidth);

                arrayWidth = new float[] { 250f, 250f };
                partida.Tabla_Keys(document, listaKeys, arrayWidth);

                arrayWidth = new float[] { 500f };
                partida.Tabla_Conditions(document, listaConditions, arrayWidth);

                // :close
                document.Close();
                pdfw.Close();

                pdfbyte = ms.GetBuffer();
                ms.Close();
                ms.Dispose();
            }
            catch (System.Exception ex)
            {
                pdfbyte = new byte[0];
                logerror.GrabarArchivoLog(ex);
            }
            return pdfbyte;
        }
               
        public byte[] CrearPdf_Partida_v2(ReporteLaboratorio oreporte)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();
            blMantenimiento bl = new blMantenimiento();
            try
            {
                List<ReporteBase> lista = new List<ReporteBase>();
                lista = JsonConvert.DeserializeObject<List<ReporteBase>>(oreporte.reporteBase);

                List<ReporteDetalle> listaResumen = new List<ReporteDetalle>();
                listaResumen = JsonConvert.DeserializeObject<List<ReporteDetalle>>(oreporte.reporteResumen);

                List<ReporteDetalle> listaDetalle = new List<ReporteDetalle>();
                listaDetalle = JsonConvert.DeserializeObject<List<ReporteDetalle>>(oreporte.reporteDetalle);

                List<ReporteKeys> listaKeys = new List<ReporteKeys>();
                listaKeys = JsonConvert.DeserializeObject<List<ReporteKeys>>(oreporte.reporteKeys);

                List<ReporteConditions> listaConditions = new List<ReporteConditions>();
                listaConditions = JsonConvert.DeserializeObject<List<ReporteConditions>>(oreporte.reporteConditions);


                // :document
                iTextSharp.text.pdf.PdfWriter pdfw = default(iTextSharp.text.pdf.PdfWriter);
                Document document = new Document(PageSize.A4, 50f, 20f, 30f, 30f);

                blReportePartida partida = new blReportePartida();
                pdfw = PdfWriter.GetInstance(document, ms);

                // :open
                document.Open();

                float[] arrayWidth = new float[] { 330f, 170f };
                partida.Tabla_Encabezado_Logo_v2(document, oreporte, arrayWidth);

                arrayWidth = new float[] { 60f, 210f, 100f, 130f };
                partida.Tabla_Base_v2(document, lista, 2, arrayWidth);

                arrayWidth = new float[] { 500f };
                partida.Tabla_Base_Comments_v2(document, lista, 3, arrayWidth);

                arrayWidth = new float[] { 500f };
                partida.Tabla_Base_Comments_v2(document, lista, 4, arrayWidth);

                arrayWidth = new float[] { 500f };
                partida.Tabla_Base_Comments_v2(document, lista, 5, arrayWidth, oreporte.TipoPrueba);

                arrayWidth = new float[] { 290f, 70f, 70f, 70f };
                partida.Tabla_Resumen_v2(document, listaResumen, 0, arrayWidth);

                arrayWidth = new float[] { 50f, 50f, 50f, 50f, 50f, 50f, 50f, 50f };
                partida.Tabla_Garment(document, listaDetalle, 6, arrayWidth,oreporte.UOM);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 7, arrayWidth);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 8, arrayWidth);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 9, arrayWidth);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 10, arrayWidth);
                                
                arrayWidth = new float[] { 100f, 80f, 70f, 100f, 80f, 70f };                
                partida.Tabla_Minimum_v2(document, listaResumen, listaDetalle, 10, arrayWidth);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 11, arrayWidth);

                arrayWidth = new float[] { 280f, 100f, 50f, 40f, 30f };
                partida.Tabla_Detalle_v2(document, listaResumen, listaDetalle, 12, arrayWidth);

                arrayWidth = new float[] { 166f, 166f, 166f };
                partida.Tabla_Keys(document, listaKeys, arrayWidth);

                arrayWidth = new float[] { 500f };
                partida.Tabla_Conditions(document, listaConditions, arrayWidth);

                // :close
                document.Close();
                pdfw.Close();

                pdfbyte = ms.GetBuffer();
                ms.Close();
                ms.Dispose();
            }
            catch (System.Exception ex)
            {
                pdfbyte = new byte[0];
                logerror.GrabarArchivoLog(ex);
            }
            return pdfbyte;
        }
    }
}
