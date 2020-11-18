using System.Collections.Generic;
using System.Web.Mvc;
using WTS_ERP.Models;
using BE_ERP;
using BE_ERP.Laboratorio;
using BL_ERP;
using BL_ERP.Laboratorio;
using Newtonsoft.Json;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using Microsoft.Reporting.WebForms;
using System;
using System.Configuration;
using System.Linq;
namespace WTS_ERP.Areas.Laboratorio.Controllers
{
    public class PartidaController : Controller
    {
        blLog logerror = new blLog();
        blPartida partida_bl = new blPartida();
        blReportePartida reportepartida_bl = new blReportePartida();
        string UrlReportingService = ConfigurationManager.AppSettings["ReportingServicesURL"].ToString();

        // Laboratorio/Partida
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        public ActionResult Partida()
        {
            return View();
        }

        public ActionResult Consulta()
        {
            return View();
        }

        public ActionResult ConsultaPartidas()
        {
            beUser oUsuario = _.GetUsuario();

            List<string> roles = oUsuario.Roles.Split(',').ToList();

            int UsuarioComercial = 0;
            
            //if (roles.Exists(x => x.Trim() == "2")) // Si es Jefa Comercial
            //{
            //    UsuarioComercial = 1;
            //}

            ViewBag.Usuario = oUsuario.CodUsuario.Trim().ToLower();
            ViewBag.IdProveedor = oUsuario.IdProveedor;
            ViewBag.UsuarioComercial = UsuarioComercial;

            return View();
        }

        public ActionResult PruebasConsulta()
        {
            return View();
        }

        public ActionResult AprobarPartidasRechazadaPorLosDioses()
        {
            return View();
        }

        public ActionResult Recibir()
        {
            return View();
        }

        public ActionResult Solicitud()
        {
            return View();
        }

        public ActionResult SolicitudFabrica()
        {
            beUser oUsuario = _.GetUsuario();
            ViewBag.IdProveedor = oUsuario.IdProveedor;
            return View();
        }

        public ActionResult Pruebas()
        {
            return View();
        }

        public ActionResult Editar_Partida()
        {
            return View();
        }
        
        public ActionResult _AprobacionComercial()
        {
            return View();
        }

        public ActionResult _FinalizarConReproceso()
        {
            return View();
        }

        public ActionResult _BusquedaAvanzadaEstados_Partida()
        {
            return View();
        }

        public ActionResult PermisosLaboratorio()
        {
            return View();
        }
        
        [AccessSecurity]
        public string getDataPartida()
        {
            string par = _.Get("par");
            blMantenimiento omantenimiento = new blMantenimiento();
            beUser oUsuario = _.GetUsuario();
            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "nombreperfil", oUsuario.PerfilesNombres);
            string data = omantenimiento.get_Data("usp_LaboratorioPartida_index", par, true, Util.ERP);
            data = _.addParameter(data, "perfil", oUsuario.PerfilesNombres.ToString(), true);
            data = _.addParameter(data, "rol", oUsuario.RolPorUsuarioSTR.ToLower().ToString(), true);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getDataPartidabyId()
        {
            string par = _.Get("par");
            beUser oUsuario = _.GetUsuario();
            string idrol = oUsuario.Roles.ToString();
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idrol", idrol);
            blMantenimiento omantenimiento = new blMantenimiento();
            string data = omantenimiento.get_Data("usp_LaboratorioPartida_view", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string getData_editar_partida_load()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetDataEditarPartida_JSON", par, true, Util.ERP);
            return data;
        }

        public string Save_Edit_Partida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int filasafectadas = bl.save_Row("usp_SaveEdit_Partida_JSON", par, Util.ERP);
            string mensaje = _.Mensaje("edit", filasafectadas > 0);
            return mensaje;
        }

        public string GetPartidaById_JSON()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetPartidaById_JSON", par, false, Util.ERP);
            return data;
        }

        public string GetData_PartidaAprobadoComercialObtener_JSON()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetData_PartidaAprobadoComercialObtener_JSON", par, false, Util.ERP);
            return data;
        }

        public string PartidaAprobadoComercialActualizar()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int idpartida = int.Parse(_.Get_Par(par, "idpartida"));
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            int nrows = bl.save_Row("usp_PartidaAprobadoComercialActualizar_JSON", par, Util.ERP);
            string mensaje = _.Mensaje("edit", nrows > 0, null, idpartida);
            return mensaje;
        }

        public string GetDataFinalizarConReproceso_Index()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetDataFinalizarConReprocesoIndex_jSON", par, true, Util.ERP);
            return data;
        }

        public string GetData_ReportePartida(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = partida_bl.Bl_GetData_ReportePartida(pidpartida);
            return data;
        }

        //Luis
        public string GetData_ReporteSolicitud(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = partida_bl.Bl_GetData_ReporteSolicitud(pidpartida);
            return data;
        }

        public string GetData_ReportePartida_v2(int pidpartida)
        {
            blMantenimiento bl = new blMantenimiento();
            string par = pidpartida.ToString();
            string data = partida_bl.Bl_GetData_ReportePartida_v2(pidpartida);
            return data;
        }

        public ActionResult ExportarPartidaPDF(int pidpartida)
        {
            JsonResponse ores = new JsonResponse();
            byte[] pdfbyte = new byte[0];
            string data = GetData_ReportePartida_v2(pidpartida);

            List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
            reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
            ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

            List<SolicitudPartida> lstsolicitudpartida = new List<SolicitudPartida>();
            lstsolicitudpartida = JsonConvert.DeserializeObject<List<SolicitudPartida>>(oreporte.dataPartida);

            pdfbyte = partida_bl.CrearPdf_Partida(oreporte);
            string nombrePDF = lstsolicitudpartida[0].reportetecnico;
            return File(pdfbyte, "application/pdf", nombrePDF + ".pdf");
        }

        public byte[] GetPartidaPDF_byte(int pidpartida)
        {
            

            byte[] pdfbyte = new byte[0];
            string data = GetData_ReportePartida_v2(pidpartida);

            List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
            reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
            ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

            //List<SolicitudPartida> lstsolicitudpartida = new List<SolicitudPartida>();
            //lstsolicitudpartida = JsonConvert.DeserializeObject<List<SolicitudPartida>>(oreporte.dataPartida);

            pdfbyte = partida_bl.CrearPdf_Partida_v2(oreporte);
            return pdfbyte;
        }

        [AccessSecurity]
        public string getData_combosIndex_BusquedaAvanzada_partida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "idfabrica", _.GetUsuario().IdProveedor.ToString());
            string data = bl.get_Data("usp_GetCombosIndexBusquedaAvanzadaPartida", par, true, Util.ERP);
            return data;
        }

        
        /* Luis - Consesionar - APP */
        public ActionResult ConcesionarPartidasRechazadas()
        {
            return View();
        }

        public string Laboratorio_Concesionar_Get()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Laboratorio_Concesionar_Get", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string Laboratorio_Consesionar_Insert()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Laboratorio_Concesionar_Insert", par, true, Util.Intranet);

            if (data != "") {
                string resultado = data.Replace("[", "").Replace("]", "");
                string estado = _.Get_Par(resultado, "estado");

                if (estado == "success") {

                    string idpartida = _.Get_Par(par, "cod_partida");
                    string reportetecnico = _.Get_Par(par, "reportecnico");
                    string partida = _.Get_Par(par, "partida");
                    string idclienteerp = _.Get_Par(par, "idclienteerp");
                    string idproveedor = _.Get_Par(par, "idproveedor");
                    string status = _.Get_Par(par, "status");
                    string cliente = _.Get_Par(par, "cliente");
                    string fabrica = _.Get_Par(par, "fabrica");

                    string parametroClienteFabrica = idclienteerp + "," + idproveedor;

                    /* correochange */
                    string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString();
                    string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                    string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametroClienteFabrica, false, Util.ERP);

                    //string CopiaCorreoLaboratorio = "lrojas@wts.com.pe";
                    //string CorreoComercial = "1627749@utp.edu.pe";
                    //string CorreoFabrica = "mesadeayuda@wts.com.pe";

                    string datacorreo = oMantenimiento.get_Data("usp_Laboratorio_Reporte_Email", idpartida, true, Util.Intranet);

                    List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                    reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(datacorreo);
                    ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;

                    string html = "Se adjunta Reporte Tecnico";

                    if (oreporte != null) { html = oreporte.Email_Body; }

                    byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                    string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                    string name_file = reportetecnico + ".pdf";
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                    blMail oMail = new blMail();
                    beMailSQL obeMail = new beMailSQL();

                    obeMail.codigo_usuario = "erp";
                    obeMail.correo_usuario = "erp@wts.com.pe";

                    obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
                    obeMail.copiacorreo = CopiaCorreoLaboratorio;// ;laboratorio@wts.com.pe";
                    obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

                    obeMail.subject = "WTS - " + cliente + " - " + fabrica + " - " + reportetecnico + " - " + "CONCESIONADO" + " / " + partida;
                    if (obeMail.subject.Length > 250) { obeMail.subject = "WTS - " + cliente + " - " + fabrica + " - " + reportetecnico + " - " + "CONCESIONADO"; }
                    obeMail.body = html;

                    obeMail.file_attachments = name_file;
                    oMail.sendMailBandeja(obeMail);

                }
            }
            return data != "" ? data : string.Empty;
        }

        /* Luis - Reportes*/
        [AccessSecurity]
        public ActionResult ConsultarReporte()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult FiltrarReporte()
        {
            return PartialView();
        }

        /* Version 2 */
        public ActionResult PruebasPartida()
        {
            return PartialView();
        }

        public ActionResult PruebasPartida_Lab()
        {
            return View();
        }


        public string Laboratorio_Reporte_List_Master()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Laboratorio_Reportes_Master", "", true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string Laboratorio_Reporte_Get()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Laboratorio_Reportes_Get", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string Laboratorio_Reporte_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_Laboratorio_Reportes_List", "", true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public JsonResult Laboratorio_Reporte_Export_Pruebas(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            string fabrica = _.Get_Par(par, "fabrica");
            string cliente = _.Get_Par(par, "cliente");
            string fechadesde = _.Get_Par(par, "fechadesde");
            string fechahasta = _.Get_Par(par, "fechahasta");
            string statusfinal = _.Get_Par(par, "statusfinal");
            string tipoprueba = _.Get_Par(par, "tipoprueba");
            string reportetecnico = _.Get_Par(par, "reportetecnico");
            string numeropartida = _.Get_Par(par, "numeropartida");

            blReporteLab blReporteLab = new blReporteLab();
            List<ReporteLab> listreporte = blReporteLab.Reporte_Export_Pruebas(Util.Intranet, fabrica, cliente, fechadesde, fechahasta, statusfinal, tipoprueba, reportetecnico, numeropartida);
            string strlistacabecera = string.Empty, strlistabody = string.Empty, strtitulodocumento = string.Empty, strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "reporte_tecnico¬" +
                    "numero_partida¬" +
                    "fabrica¬" +
                    "tintoreria¬" +
                    "cliente¬" +
                    "color¬" +
                    "codigo_tela¬" +
                    "tela¬" +                    
                    "tipo_prueba¬" +
                    "status_final¬" +
                    "status_lab¬" +
                    "status_tono¬" +
                    "fecha_ingreso¬" +
                    "fecha_recibido¬" +
                    "fecha_entrega¬" +
                    "Mes-Anio¬" +
                    "comentario_tono¬" +
                    "comentario_testing¬" +
                    "instruccion_cuidado¬" +
                    "instruccion_laboratorio¬" +
                    //"muestra_a_ancho_1erlav_1¬" +
                    //"muestra_a_ancho_3erlav_1¬" +
                    //"muestra_a_ancho_5tolav_1¬" +
                    //"muestra_a_largo_1erlav_1¬" +
                    //"muestra_a_largo_3erlav_1¬" +
                    //"muestra_a_largo_5tolav_1¬" +
                    //"muestra_b_ancho_1erlav_1¬" +
                    //"muestra_b_ancho_3erlav_1¬" +
                    //"muestra_b_ancho_5tolav_1¬" +
                    //"muestra_b_largo_1erlav_1¬" +
                    //"muestra_b_largo_3erlav_1¬" +
                    //"muestra_b_largo_5tolav_1¬" +
                    //"muestra_a_ancho_1erlav_2¬" +
                    //"muestra_a_ancho_3erlav_2¬" +
                    //"muestra_a_ancho_5tolav_2¬" +
                    //"muestra_a_largo_1erlav_2¬" +
                    //"muestra_a_largo_3erlav_2¬" +
                    //"muestra_a_largo_5tolav_2¬" +
                    //"muestra_b_ancho_1erlav_2¬" +
                    //"muestra_b_ancho_3erlav_2¬" +
                    //"muestra_b_ancho_5tolav_2¬" +
                    //"muestra_b_largo_1erlav_2¬" +
                    //"muestra_b_largo_3erlav_2¬" +
                    //"muestra_b_largo_5tolav_2¬" +
                    //"muestra_a_ancho_1erlav_3¬" +
                    //"muestra_a_ancho_3erlav_3¬" +
                    //"muestra_a_ancho_5tolav_3¬" +
                    //"muestra_a_largo_1erlav_3¬" +
                    //"muestra_a_largo_3erlav_3¬" +
                    //"muestra_a_largo_5tolav_3¬" +
                    //"muestra_b_ancho_1erlav_3¬" +
                    //"muestra_b_ancho_3erlav_3¬" +
                    //"muestra_b_ancho_5tolav_3¬" +
                    //"muestra_b_largo_1erlav_3¬" +
                    //"muestra_b_largo_3erlav_3¬" +
                    //"muestra_b_largo_5tolav_3¬" +
                    "encogimiento_largo¬" +
                    "encogimiento_ancho¬" +
                    //"status_encogimiento¬" +
                    //"acrosschest_original¬" +
                    //"acrosschest_onecyle¬" +
                    //"acrosschest_threecycles¬" +
                    //"acrosschest_fivecycles¬" +
                    //"bottomwidth_original¬" +
                    //"bottomwidth_onecyle¬" +
                    //"bottomwidth_threecycles¬" +
                    //"bottomwidth_fivecycles¬" +
                    //"bodyfromlen_original¬" +
                    //"bodyfromle_onecycle¬" +
                    //"bodyfromlen_threecycles¬" +
                    //"bodyfromlen_fivecycles¬" +
                    //"sleevelen_original¬" +
                    //"sleevelen_onecycle¬" +
                    //"sleevelen_threecycles¬" +
                    //"sleevelen_fivecycles¬" +
                    //"waistbandwidth_halforiginal¬" +
                    //"waistbandwidth_halfonecycle¬" +
                    //"waistbandwidth_halfthreecycles¬" +
                    //"waistbandwidth_halffivecycles¬" +
                    //"legopening_halforiginal¬" +
                    //"legopening_halfonecycle¬" +
                    //"legopening_halfthreecycles¬" +
                    //"legopening_halffivecycles¬" +
                    //"outseambelow_original¬" +
                    //"outseambelow_onecycle¬" +
                    //"outseambelow_threecycles¬" +
                    //"outseambelow_fivecycles¬" +
                    //"inseamlen_original¬" +
                    //"inseamlen_onecyle¬" +
                    //"inseamlen_threecyles¬" +
                    //"inseamlen_fivecycle¬" +
                    "acrosschest_onecyclechange¬" +
                    "acrosschest_threecyclechange¬" +
                    "acrosschest_fivecyclechange¬" +
                    "bottomwidtht_onecyclechange¬" +
                    "bottomwidth_threecyclechange¬" +
                    "bottomwidtht_fivecyclechange¬" +
                    "bodyfromlen_onecyclechange¬" +
                    "bodyfromlen_threecyclechange¬" +
                    "bodyfromlen_fivecyclechange¬" +
                    "sleevelenone_cyclechange¬" +
                    "sleevelen_threecyclechange¬" +
                    "sleevelen_fivecyclechange¬" +
                    "waistbandwidth_halfonecyclechange¬" +
                    "waistbandwidth_halfthreecyclechange¬" +
                    "waistbandwidth_halffivecyclechange¬" +
                    "legopening_halfonecyclechange¬" +
                    "legopening_halfthreecyclechange¬" +
                    "legopening_halffivecyclechange¬" +
                    "outseambelow_onecyclechange¬" +
                    "outseambelow_threecyclechange¬" +
                    "outseambelow_fivecyclechange¬" +
                    "inseamlen_onecyclechange¬" +
                    "inseamlen_threecyclechange¬" +
                    "inseamlen_fivecyclechange¬" +
                    //"status_encogimiento_garment¬" +
                    //"uom¬" +
                    //"muestra_a_1erlav_ac¬" +
                    //"muestra_a_1erlav_bd¬" +
                    //"muestra_a_3erlav_ac¬" +
                    //"muestra_a_3erlav_bd¬" +
                    //"muestra_a_5tolav_ac¬" +
                    //"muestra_a_5tolav_bd¬" +
                    //"muestra_b_1erlav_ac¬" +
                    //"muestra_b_1erlav_bd¬" +
                    //"muestra_b_3erlav_ac¬" +
                    //"muestra_b_3erlav_bd¬" +
                    //"muestra_b_5tolav_ac¬" +
                    //"muestra_b_5tolav_bd¬" +
                    "revirado¬" +
                    //"status_revirado¬" +
                    //"muestra_a_ancho_1erlav_1_ep¬" +
                    //"muestra_a_ancho_3erlav_1_ep¬" +
                    //"muestra_a_ancho_1erlav_2_ep¬" +
                    //"muestra_a_ancho_3erlav_2_ep¬" +
                    //"muestra_a_ancho_1erlav_3_ep¬" +
                    //"muestra_a_ancho_3erlav_3_ep¬" +
                    //"muestra_a_largo_1erlav_1_ep¬" +
                    //"muestra_a_largo_3erlav_1_ep¬" +
                    //"muestra_a_largo_1erlav_2_ep¬" +
                    //"muestra_a_largo_3erlav_2_ep¬" +
                    //"muestra_a_largo_1erlav_3_ep¬" +
                    //"muestra_a_largo_3erlav_3_ep¬" +
                    //"muestra_b_ancho_1erlav_1_ep¬" +
                    //"muestra_b_ancho_3erlav_1_ep¬" +
                    //"muestra_b_ancho_1erlav_2_ep¬" +
                    //"muestra_b_ancho_3erlav_2_ep¬" +
                    //"muestra_b_ancho_1erlav_3_ep¬" +
                    //"muestra_b_ancho_3erlav_3_ep¬" +
                    //"muestra_b_largo_1erlav_1_ep¬" +
                    //"muestra_b_largo_3erlav_1_ep¬" +
                    //"muestra_b_largo_1erlav_2_ep¬" +
                    //"muestra_b_largo_3erlav_2_ep¬" +
                    //"muestra_b_largo_1erlav_3_ep¬" +
                    //"muestra_b_largo_3erlav_3_ep¬" +
                    "encogimientolargo_ep¬" +
                    "encogimientoancho_ep¬" +
                    //"Status_Encogimiento_EP¬" +
                    //"muestra_a_ancho_1erlav_1_hw¬" +
                    //"muestra_a_ancho_3erlav_1_hw¬" +
                    //"muestra_a_ancho_1erlav_2_hw¬" +
                    //"muestra_a_ancho_3erlav_2_hw¬" +
                    //"muestra_a_ancho_1erlav_3_hw¬" +
                    //"muestra_a_ancho_3erlav_3_hw¬" +
                    //"muestra_a_largo_1erlav_1_hw¬" +
                    //"muestra_a_largo_3erlav_1_hw¬" +
                    //"muestra_a_largo_1erlav_2_hw¬" +
                    //"muestra_a_largo_3erlav_2_hw¬" +
                    //"muestra_a_largo_1erlav_3_hw¬" +
                    //"muestra_a_largo_3erlav_3_hw¬" +
                    //"muestra_b_ancho_1erlav_1_hw¬" +
                    //"muestra_b_ancho_3erlav_1_hw¬" +
                    //"muestra_b_ancho_1erlav_2_hw¬" +
                    //"muestra_b_ancho_3erlav_2_hw¬" +
                    //"muestra_b_ancho_1erlav_3_hw¬" +
                    //"muestra_b_ancho_3erlav_3_hw¬" +
                    //"muestra_b_largo_1erlav_1_hw¬" +
                    //"muestra_b_largo_3erlav_1_hw¬" +
                    //"muestra_b_largo_1erlav_2_hw¬" +
                    //"muestra_b_largo_3erlav_2_hw¬" +
                    //"muestra_b_largo_1erlav_3_hw¬" +
                    //"muestra_b_largo_3erlav_3_hw¬" +
                    "encogimientolargo_hw¬" +
                    "encogimientoancho_hw¬" +
                    //"status_encogimiento_hw¬" +
                    "color_change¬" +
                    "grado_pilling¬" +
                    "grade_sa¬" +
                    //"evaluacion_apariencia¬" +
                    //"status_apariencia¬" +
                    //"seamtwist_beforeaa¬" +
                    //"seamtwist_beforeab¬" +
                    //"seamtwist_before_resultado¬" +
                    //"seamtwist_afteraa¬" +
                    //"seamtwist_afterab¬" +
                    //"seamtwist_after_resultado¬" +
                    "seamtwistchange¬" +
                    //"status_seamtwist¬" +
                    //"muestra1_densidad¬" +
                    //"muestra2_densidad¬" +
                    //"muestra3_densidad¬" +
                    "densidad¬" +
                    //"muestra1_ancho¬" +
                    //"muestra2_ancho¬" +
                    //"muestra3_ancho¬" +
                    "ancho_acabado¬" +
                    "desviacion¬" +
                    //"status_densidad¬" +
                    "seco¬" +
                    "humedo¬" +
                    //"status_solidezfrote¬" +
                    "cambiocolor_sl¬" +
                    "acetato_sl¬" +
                    "algodon_sl¬" +
                    "nylon_sl¬" +
                    "silk_sl¬" +
                    "poliester_sl¬" +
                    "acrilico_sl¬" +
                    "lana_sl¬" +
                    "viscosa_sl¬" +
                    //"status_solidezlavado¬" +
                    "pilling_resultado¬" +
                    //"pilling_min¬" +
                    //"status_resistenciapilling¬" +
                    "bursting_resultado¬" +
                    //"bursting_min¬" +
                    //"status_bursting¬" +
                    "cambiocolor_st¬" +
                    "acetato_st¬" +
                    "algodon_st¬" +
                    "nylon_st¬" +
                    "silk_st¬" +
                    "poliester_st¬" +
                    "acrilico_st¬" +
                    "lana_st¬" +
                    "viscosa_st¬" +
                    //"status_solideztranspiracion¬" +
                    "cambiocolor_sa¬" +
                    "acetato_sa¬" +
                    "algodon_sa¬" +
                    "nylon_sa¬" +
                    "silk_sa¬" +
                    "poliester_sa¬" +
                    "acrilico_sa¬" +
                    "lana_sa¬" +
                    "viscosa_sa¬" +
                    //"status_solidezagua¬" +
                    "cambiocolor_al¬" +
                    "acetato_al¬" +
                    "algodon_al¬" +
                    "nylon_al¬" +
                    "silk_al¬" +
                    "poliester_al¬" +
                    "acrilico_al¬" +
                    "lana_al¬" +
                    "viscose_al¬" +
                    "stainingwhitecloth_al¬" +
                    //"status_almacenamiento¬" +
                    "cambiocolor_bsc_sodiumperborate¬" +
                    "cambiocolor_bsc_hydrogenperoxide¬" +
                    //"status_blanqueadorsincloro¬" +
                    "cambiocolor_bc_cloro¬" +
                    //"status_blanqueadorconcloro¬" +
                    "resultado_ph¬" +
                    //"requerido_ph¬" +
                    //"status_phvalue¬" +
                    //"wiking_pulgadas¬" +
                    //"wiking_minutos¬" +
                    "wiking_wales30¬" +
                    "wiking_courses30";
                    //"status_wiking";

            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.reporte_tecnico + "¬" +
                        item.numero_partida + "¬" +
                        item.fabrica + "¬" +
                        item.tintoreria + "¬" +
                        item.cliente + "¬" +
                        item.color + "¬" +
                        item.codigo_tela + "¬" +
                        item.tela + "¬" +                       
                        item.tipo_prueba + "¬" +
                        item.status_final + "¬" +
                        item.status_lab + "¬" +
                        item.status_tono + "¬" +
                        item.fecha_ingreso + "¬" +
                        item.fecha_recibido + "¬" +
                        item.fecha_entrega + "¬" +
                        item.mesanio + "¬" +
                        item.comentario_tono + "¬" +
                        item.comentario_testing + "¬" +
                         item.instruccion_cuidado + "¬" +
                        item.instruccion_laboratorio + "¬" +

                        /***** Reporte Pruebas ****/
                        /* Estabilidad Dimensional - Tela */
                        //item.muestra_a_ancho_1erlav_1 + "¬" +
                        //item.muestra_a_ancho_3erlav_1 + "¬" +
                        //item.muestra_a_ancho_5tolav_1 + "¬" +
                        //item.muestra_a_largo_1erlav_1 + "¬" +
                        //item.muestra_a_largo_3erlav_1 + "¬" +
                        //item.muestra_a_largo_5tolav_1 + "¬" +
                        //item.muestra_b_ancho_1erlav_1 + "¬" +
                        //item.muestra_b_ancho_3erlav_1 + "¬" +
                        //item.muestra_b_ancho_5tolav_1 + "¬" +
                        //item.muestra_b_largo_1erlav_1 + "¬" +
                        //item.muestra_b_largo_3erlav_1 + "¬" +
                        //item.muestra_b_largo_5tolav_1 + "¬" +

                        //item.muestra_a_ancho_1erlav_2 + "¬" +
                        //item.muestra_a_ancho_3erlav_2 + "¬" +
                        //item.muestra_a_ancho_5tolav_2 + "¬" +
                        //item.muestra_a_largo_1erlav_2 + "¬" +
                        //item.muestra_a_largo_3erlav_2 + "¬" +
                        //item.muestra_a_largo_5tolav_2 + "¬" +
                        //item.muestra_b_ancho_1erlav_2 + "¬" +
                        //item.muestra_b_ancho_3erlav_2 + "¬" +
                        //item.muestra_b_ancho_5tolav_2 + "¬" +
                        //item.muestra_b_largo_1erlav_2 + "¬" +
                        //item.muestra_b_largo_3erlav_2 + "¬" +
                        //item.muestra_b_largo_5tolav_2 + "¬" +

                        //item.muestra_a_ancho_1erlav_3 + "¬" +
                        //item.muestra_a_ancho_3erlav_3 + "¬" +
                        //item.muestra_a_ancho_5tolav_3 + "¬" +
                        //item.muestra_a_largo_1erlav_3 + "¬" +
                        //item.muestra_a_largo_3erlav_3 + "¬" +
                        //item.muestra_a_largo_5tolav_3 + "¬" +
                        //item.muestra_b_ancho_1erlav_3 + "¬" +
                        //item.muestra_b_ancho_3erlav_3 + "¬" +
                        //item.muestra_b_ancho_5tolav_3 + "¬" +
                        //item.muestra_b_largo_1erlav_3 + "¬" +
                        //item.muestra_b_largo_3erlav_3 + "¬" +
                        //item.muestra_b_largo_5tolav_3 + "¬" +

                        item.encogimiento_largo + "¬" +
                        item.encogimiento_ancho + "¬" +
                        //item.status_encogimiento + "¬" +

                        /* Estabilidad Dimensional - Prenda */
                        //item.acrosschest_original + "¬" +
                        //item.acrosschest_onecyle + "¬" +
                        //item.acrosschest_threecycles + "¬" +
                        //item.acrosschest_fivecycles + "¬" +
                        //item.bottomwidth_original + "¬" +
                        //item.bottomwidth_onecyle + "¬" +
                        //item.bottomwidth_threecycles + "¬" +
                        //item.bottomwidth_fivecycles + "¬" +
                        //item.bodyfromlen_original + "¬" +
                        //item.bodyfromle_onecycle + "¬" +
                        //item.bodyfromlen_threecycles + "¬" +
                        //item.bodyfromlen_fivecycles + "¬" +
                        //item.sleevelen_original + "¬" +
                        //item.sleevelen_onecycle + "¬" +
                        //item.sleevelen_threecycles + "¬" +
                        //item.sleevelen_fivecycles + "¬" +
                        //item.waistbandwidth_halforiginal + "¬" +
                        //item.waistbandwidth_halfonecycle + "¬" +
                        //item.waistbandwidth_halfthreecycles + "¬" +
                        //item.waistbandwidth_halffivecycles + "¬" +
                        //item.legopening_halforiginal + "¬" +
                        //item.legopening_halfonecycle + "¬" +
                        //item.legopening_halfthreecycles + "¬" +
                        //item.legopening_halffivecycles + "¬" +
                        //item.outseambelow_original + "¬" +
                        //item.outseambelow_onecycle + "¬" +
                        //item.outseambelow_threecycles + "¬" +
                        //item.outseambelow_fivecycles + "¬" +
                        //item.inseamlen_original + "¬" +
                        //item.inseamlen_onecyle + "¬" +
                        //item.inseamlen_threecyles + "¬" +
                        //item.inseamlen_fivecycle + "¬" +

                        item.acrosschest_onecyclechange + "¬" +
                        item.acrosschest_threecyclechange + "¬" +
                        item.acrosschest_fivecyclechange + "¬" +
                        item.bottomwidtht_onecyclechange + "¬" +
                        item.bottomwidth_threecyclechange + "¬" +
                        item.bottomwidtht_fivecyclechange + "¬" +
                        item.bodyfromlen_onecyclechange + "¬" +
                        item.bodyfromlen_threecyclechange + "¬" +
                        item.bodyfromlen_fivecyclechange + "¬" +
                        item.sleevelenone_cyclechange + "¬" +
                        item.sleevelen_threecyclechange + "¬" +
                        item.sleevelen_fivecyclechange + "¬" +
                        item.waistbandwidth_halfonecyclechange + "¬" +
                        item.waistbandwidth_halfthreecyclechange + "¬" +
                        item.waistbandwidth_halffivecyclechange + "¬" +
                        item.legopening_halfonecyclechange + "¬" +
                        item.legopening_halfthreecyclechange + "¬" +
                        item.legopening_halffivecyclechange + "¬" +
                        item.outseambelow_onecyclechange + "¬" +
                        item.outseambelow_threecyclechange + "¬" +
                        item.outseambelow_fivecyclechange + "¬" +
                        item.inseamlen_onecyclechange + "¬" +
                        item.inseamlen_threecyclechange + "¬" +
                        item.inseamlen_fivecyclechange + "¬" +

                        //item.status_encogimiento_garment + "¬" +
                        //item.uom + "¬" +

                        /* Revirado */
                        //item.muestra_a_1erlav_ac + "¬" +
                        //item.muestra_a_1erlav_bd + "¬" +
                        //item.muestra_a_3erlav_ac + "¬" +
                        //item.muestra_a_3erlav_bd + "¬" +
                        //item.muestra_a_5tolav_ac + "¬" +
                        //item.muestra_a_5tolav_bd + "¬" +

                        //item.muestra_b_1erlav_ac + "¬" +
                        //item.muestra_b_1erlav_bd + "¬" +
                        //item.muestra_b_3erlav_ac + "¬" +
                        //item.muestra_b_3erlav_bd + "¬" +
                        //item.muestra_b_5tolav_ac + "¬" +
                        //item.muestra_b_5tolav_bd + "¬" +

                        item.revirado + "¬" +
                        //item.status_revirado + "¬" +

                        /* Estabilidad Dimensional Drycleaning in PerchLoroethylene - Tela */
                        //item.muestra_a_ancho_1erlav_1_ep + "¬" +
                        //item.muestra_a_ancho_3erlav_1_ep + "¬" +
                        //item.muestra_a_ancho_1erlav_2_ep + "¬" +
                        //item.muestra_a_ancho_3erlav_2_ep + "¬" +
                        //item.muestra_a_ancho_1erlav_3_ep + "¬" +
                        //item.muestra_a_ancho_3erlav_3_ep + "¬" +

                        //item.muestra_a_largo_1erlav_1_ep + "¬" +
                        //item.muestra_a_largo_3erlav_1_ep + "¬" +
                        //item.muestra_a_largo_1erlav_2_ep + "¬" +
                        //item.muestra_a_largo_3erlav_2_ep + "¬" +
                        //item.muestra_a_largo_1erlav_3_ep + "¬" +
                        //item.muestra_a_largo_3erlav_3_ep + "¬" +

                        //item.muestra_b_ancho_1erlav_1_ep + "¬" +
                        //item.muestra_b_ancho_3erlav_1_ep + "¬" +
                        //item.muestra_b_ancho_1erlav_2_ep + "¬" +
                        //item.muestra_b_ancho_3erlav_2_ep + "¬" +
                        //item.muestra_b_ancho_1erlav_3_ep + "¬" +
                        //item.muestra_b_ancho_3erlav_3_ep + "¬" +
                        //item.muestra_b_largo_1erlav_1_ep + "¬" +
                        //item.muestra_b_largo_3erlav_1_ep + "¬" +
                        //item.muestra_b_largo_1erlav_2_ep + "¬" +
                        //item.muestra_b_largo_3erlav_2_ep + "¬" +
                        //item.muestra_b_largo_1erlav_3_ep + "¬" +
                        //item.muestra_b_largo_3erlav_3_ep + "¬" +

                        item.encogimientolargo_ep + "¬" +
                        item.encogimientoancho_ep + "¬" +
                        //item.Status_Encogimiento_EP + "¬" +

                        /* Estabilidad Dimensional Hand Wash Laundering - Tela */
                        //item.muestra_a_ancho_1erlav_1_hw + "¬" +
                        //item.muestra_a_ancho_3erlav_1_hw + "¬" +
                        //item.muestra_a_ancho_1erlav_2_hw + "¬" +
                        //item.muestra_a_ancho_3erlav_2_hw + "¬" +
                        //item.muestra_a_ancho_1erlav_3_hw + "¬" +
                        //item.muestra_a_ancho_3erlav_3_hw + "¬" +
                        //item.muestra_a_largo_1erlav_1_hw + "¬" +
                        //item.muestra_a_largo_3erlav_1_hw + "¬" +
                        //item.muestra_a_largo_1erlav_2_hw + "¬" +
                        //item.muestra_a_largo_3erlav_2_hw + "¬" +
                        //item.muestra_a_largo_1erlav_3_hw + "¬" +
                        //item.muestra_a_largo_3erlav_3_hw + "¬" +

                        //item.muestra_b_ancho_1erlav_1_hw + "¬" +
                        //item.muestra_b_ancho_3erlav_1_hw + "¬" +
                        //item.muestra_b_ancho_1erlav_2_hw + "¬" +
                        //item.muestra_b_ancho_3erlav_2_hw + "¬" +
                        //item.muestra_b_ancho_1erlav_3_hw + "¬" +
                        //item.muestra_b_ancho_3erlav_3_hw + "¬" +
                        //item.muestra_b_largo_1erlav_1_hw + "¬" +
                        //item.muestra_b_largo_3erlav_1_hw + "¬" +
                        //item.muestra_b_largo_1erlav_2_hw + "¬" +
                        //item.muestra_b_largo_3erlav_2_hw + "¬" +
                        //item.muestra_b_largo_1erlav_3_hw + "¬" +
                        //item.muestra_b_largo_3erlav_3_hw + "¬" +

                        item.encogimientolargo_hw + "¬" +
                        item.encogimientoancho_hw + "¬" +
                        //item.status_encogimiento_hw + "¬" +

                        /* Apariencia */
                        item.color_change + "¬" +
                        item.grado_pilling + "¬" +
                        item.grade_sa + "¬" +
                        //item.evaluacion_apariencia + "¬" +
                        //item.status_apariencia + "¬" +

                        /* Seam twist in garment before and after home laundering */
                        //item.seamtwist_beforeaa + "¬" +
                        //item.seamtwist_beforeab + "¬" +
                        //item.seamtwist_before_resultado + "¬" +
                        //item.seamtwist_afteraa + "¬" +
                        //item.seamtwist_afterab + "¬" +
                        //item.seamtwist_after_resultado + "¬" +
                        item.seamtwistchange + "¬" +
                        //item.status_seamtwist + "¬" +

                        /* Densidad de Tela */
                        //item.muestra1_densidad + "¬" +
                        //item.muestra2_densidad + "¬" +
                        //item.muestra3_densidad + "¬" +
                        item.densidad + "¬" +
                        //item.muestra1_ancho + "¬" +
                        //item.muestra2_ancho + "¬" +
                        //item.muestra3_ancho + "¬" +
                        item.ancho_acabado + "¬" +
                        item.desviacion + "¬" +
                        //item.status_densidad + "¬" +

                        /* Solidez al Frote */
                        item.seco + "¬" +
                        item.humedo + "¬" +
                        //item.status_solidezfrote + "¬" +

                        /* Solidez al Lavado */
                        item.cambiocolor_sl + "¬" +
                        item.acetato_sl + "¬" +
                        item.algodon_sl + "¬" +
                        item.nylon_sl + "¬" +
                        item.silk_sl + "¬" +
                        item.poliester_sl + "¬" +
                        item.acrilico_sl + "¬" +
                        item.lana_sl + "¬" +
                        item.viscosa_sl + "¬" +
                        //item.status_solidezlavado + "¬" +

                        /* Resistencia Pilling */
                        item.pilling_resultado + "¬" +
                        //item.pilling_min + "¬" +
                        //item.status_resistenciapilling + "¬" +

                        /* Bursting */
                        item.bursting_resultado + "¬" +
                        //item.bursting_min + "¬" +
                        //item.status_bursting + "¬" +

                        /* Solidez a la Transpiración */
                        item.cambiocolor_st + "¬" +
                        item.acetato_st + "¬" +
                        item.algodon_st + "¬" +
                        item.nylon_st + "¬" +
                        item.silk_st + "¬" +
                        item.poliester_st + "¬" +
                        item.acrilico_st + "¬" +
                        item.lana_st + "¬" +
                        item.viscosa_st + "¬" +
                        //item.status_solideztranspiracion + "¬" +

                        /* Solidez al Agua */
                        item.cambiocolor_sa + "¬" +
                        item.acetato_sa + "¬" +
                        item.algodon_sa + "¬" +
                        item.nylon_sa + "¬" +
                        item.silk_sa + "¬" +
                        item.poliester_sa + "¬" +
                        item.acrilico_sa + "¬" +
                        item.lana_sa + "¬" +
                        item.viscosa_sa + "¬" +
                        //item.status_solidezagua + "¬" +

                        /* Almacenamiento */
                        item.cambiocolor_al + "¬" +
                        item.acetato_al + "¬" +
                        item.algodon_al + "¬" +
                        item.nylon_al + "¬" +
                        item.silk_al + "¬" +
                        item.poliester_al + "¬" +
                        item.acrilico_al + "¬" +
                        item.lana_al + "¬" +
                        item.viscose_al + "¬" +
                        item.stainingwhitecloth_al + "¬" +
                        //item.status_almacenamiento + "¬" +

                        /* Blanqueador sin Cloro */
                        item.cambiocolor_bsc_sodiumperborate + "¬" +
                        item.cambiocolor_bsc_hydrogenperoxide + "¬" +
                        //item.status_blanqueadorsincloro + "¬" +

                        /* Blanqueador con Cloro */
                        item.cambiocolor_bc_cloro + "¬" +
                        //item.status_blanqueadorconcloro + "¬" +

                        /* PH Value */
                        item.resultado_ph + "¬" +
                        //item.requerido_ph + "¬" +
                        //item.status_phvalue + "¬" +

                        /* Wicking */
                        //item.wiking_pulgadas + "¬" +
                        //item.wiking_minutos + "¬" +
                        item.wiking_wales30 + "¬" +
                        item.wiking_courses30;
                        //item.status_wiking + "^";
                    }
                }
            }

            byte[] filecontent = blReporteLab.crearExcel_Reporte_Pruebas(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 1);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Laboratorio_Reporte_Export_LeadTime(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            string fabrica = _.Get_Par(par, "fabrica");
            string cliente = _.Get_Par(par, "cliente");
            string fechadesde = _.Get_Par(par, "fechadesde");
            string fechahasta = _.Get_Par(par, "fechahasta");
            string statusfinal = _.Get_Par(par, "statusfinal");
            string tipoprueba = _.Get_Par(par, "tipoprueba");
            string reportetecnico = _.Get_Par(par, "reportetecnico");
            string numeropartida = _.Get_Par(par, "numeropartida");

            blReporteLab blReporteLab = new blReporteLab();
            List<ReporteLab> listreporte = blReporteLab.Reporte_Export_LeadTime(Util.Intranet, fabrica, cliente, fechadesde, fechahasta, statusfinal, tipoprueba, reportetecnico, numeropartida);
            string strlistacabecera = string.Empty, strlistabody = string.Empty, strtitulodocumento = string.Empty, strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "reporte_tecnico¬" +
                    "numero_partida¬" +
                    "fabrica¬" +
                    "tintoreria¬" +
                    "cliente¬" +
                    "color¬" +
                    "codigo_tela¬" +
                    "tela¬" +
                    "tipo_prueba¬" +
                    "status_final¬" +
                    "status_lab¬" +
                    "status_tono¬" +
                    "creadopor¬" +
                    "fecha_ingreso¬" +
                    "fecha_recibido¬" +
                    "fecha_entrega¬" +
                    "leadtime_proveedor¬" +
                    "leadtime_laboratorio";

            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.reporte_tecnico + "¬" +
                        item.numero_partida + "¬" +
                        item.fabrica + "¬" +
                        item.tintoreria + "¬" +
                        item.cliente + "¬" +
                        item.color + "¬" +
                        item.codigo_tela + "¬" +
                        item.tela + "¬" +
                        item.tipo_prueba + "¬" +
                        item.status_final + "¬" +
                        item.status_lab + "¬" +
                        item.status_tono + "¬" +
                        item.creadopor + "¬" +
                        item.fecha_ingreso + "¬" +
                        item.fecha_recibido + "¬" +
                        item.fecha_entrega + "¬" +
                        item.leadtime_proveedor + "¬" +
                        item.leadtime_laboratorio;
                    }
                }
            }

            byte[] filecontent = blReporteLab.crearExcel_Reporte_Pruebas(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 2);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Laboratorio_Reporte_Export_TestSummay(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            string fabrica = _.Get_Par(par, "fabrica");
            string cliente = _.Get_Par(par, "cliente");
            string fechadesde = _.Get_Par(par, "fechadesde");
            string fechahasta = _.Get_Par(par, "fechahasta");
            string statusfinal = _.Get_Par(par, "statusfinal");
            string tipoprueba = _.Get_Par(par, "tipoprueba");
            string reportetecnico = _.Get_Par(par, "reportetecnico");
            string numeropartida = _.Get_Par(par, "numeropartida");

            blReporteLab blReporteLab = new blReporteLab();
            List<ReporteLab> listreporte = blReporteLab.Reporte_Export_TestSummay(Util.Intranet, fabrica, cliente, fechadesde, fechahasta, statusfinal, tipoprueba, reportetecnico, numeropartida);
            string strlistacabecera = string.Empty, strlistabody = string.Empty, strtitulodocumento = string.Empty, strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "reporte_tecnico¬" +
                            "numero_partida¬" +
                            "fabrica¬" +
                            "tintoreria¬" +
                            "cliente¬" +                   
                            "color¬" +
                            "codigo_tela¬" +
                            "tela¬" +
                            "tipo_prueba¬" +
                            "status_final¬" +
                            "status_lab¬" +
                            "status_tono¬" +
                            "fecha_ingreso¬" +
                            "fecha_recibido¬" +
                            "fecha_entrega¬" +
                            "Mes-Anio¬" +
                            "ED Prenda¬" +
                            "ED Tela¬" +
                            "ED al Seco¬" +
                            "ED a Mano¬" +
                            "Revirado Tela¬" +
                            "Apariencia¬" +
                            "Revirado Prenda¬" +
                            "Densidad¬" +
                            "Pilling¬" +
                            "Resistencia¬" +
                            "Solidez al Frote¬" +
                            "Solidez al Lavado¬" +
                            "Solidez al Sudor¬" +
                            "Solidez al Agua¬" +
                            "Almacenamiento¬" +
                            "NCB¬" +
                            "CB¬" +
                            "PH¬" +
                            "Wicking";
            
            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.reporte_tecnico + "¬" +
                        item.numero_partida + "¬" +
                        item.fabrica + "¬" +
                        item.tintoreria + "¬" +
                        item.cliente + "¬" +
                        item.color + "¬" +
                        item.codigo_tela + "¬" +
                        item.tela + "¬" +
                        item.tipo_prueba + "¬" +
                        item.status_final + "¬" +
                        item.status_lab + "¬" +
                        item.status_tono + "¬" +
                        item.fecha_ingreso + "¬" +
                        item.fecha_recibido + "¬" +
                        item.fecha_entrega + "¬" +
                        item.mesanio + "¬" +
                        item.dim_changes_home_laundering + "¬" +
                        item.dim_changes_garments_after_home_laundering + "¬" +
                        item.dimen_changes_dry_perchloroethylene + "¬" +
                        item.dimen_changes_hand_wash_laundering + "¬" +
                        item.skewness_after_home_laundering + "¬" +
                        item.appearance_after_home_laundering + "¬" +
                        item.seam_twist_garment_before_after_home_laundering + "¬" +
                        item.fabric_weight + "¬" +
                        item.pilling_resistance + "¬" +
                        item.bursting_stregth + "¬" +
                        item.colorfastness_crocking + "¬" +
                        item.colorfastness_accelerated + "¬" +
                        item.colorfastness_perspiration + "¬" +
                        item.colorfastness_water + "¬" +
                        item.colorfastness_dry_transfer + "¬" +
                        item.colornonchlorine + "¬" +
                        item.colorChlorine + "¬" +
                        item.phwater + "¬" +
                        item.wicking;
                    }
                }
            }

            byte[] filecontent = blReporteLab.crearExcel_Reporte_Pruebas(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 4);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Laboratorio_Reporte_Export_LeadTimeKPI(string par)
        {
            var jsonsession = new JsonResponse();
            var respuesta = new JsonResponse();

            int mes = Convert.ToInt32(_.Get_Par(par, "mes"));
            int anio = Convert.ToInt32(_.Get_Par(par, "anio"));

            blReporteLab blReporteLab = new blReporteLab();
            List<ReporteLab> listreporte = blReporteLab.Laboratorio_Reporte_Export_LeadTimeKPI(Util.Intranet, mes, anio);
            string strlistacabecera = string.Empty, strlistabody = string.Empty, strtitulodocumento = string.Empty, strestado = string.Empty;
            int totalfilas = 0, contador = 0;
            totalfilas = listreporte.Count;

            string titulohoja = "Listado";

            strlistacabecera = "Reporte_Tecnico¬" +
                    "Cliente¬" +
                    "Fabrica¬" + 
                    "Tipo_Prueba¬" +
                    "Status_Final¬" +
                    "Fecha_Ingreso¬" +
                     "Fecha_Recibido¬" +
                    "Fecha_Entrega¬" +                   
                    "Leadtime_Total";

            if (listreporte.Count > 0)
            {
                foreach (var item in listreporte)
                {
                    contador++;
                    if (contador <= totalfilas)
                    {
                        strlistabody += "^" + item.reporte_tecnico + "¬" +
                        item.cliente + "¬" +
                        item.fabrica + "¬" +
                        item.tipo_prueba + "¬" +
                        item.status_final + "¬" +
                        item.fecha_ingreso + "¬" +
                        item.fecha_recibido + "¬" +
                        item.fecha_entrega + "¬" +
                        item.leadtime_total;
                    }
                }
            }

            byte[] filecontent = blReporteLab.crearExcel_Reporte_Pruebas(titulohoja, strlistacabecera, strlistabody, strtitulodocumento, 3);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excelfacturav"] = jsonsession;

            respuesta.Success = true;
            respuesta.Message = "Exito";
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public FileContentResult descargarexcel_reporte()
        {
            blReporteLab oblReporteLab = new blReporteLab();
            byte[] filecontent;
            string tituloreporte = string.Empty;
            var jsonsession = (JsonResponse)System.Web.HttpContext.Current.Session["excelfacturav"];
            filecontent = (byte[])jsonsession.Data;
            //tituloreporte = jsonsession.Message + ".xlsx";
            tituloreporte = "Reporte.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excelfacturav");
            return File(filecontent, oblReporteLab.ExcelContentType(), tituloreporte);
        }

        public FileResult Laboratorio_Reporte_Export_KPI(string par)
        {
            byte[] bytes = new byte[0];
            try
            {
                int mes = Convert.ToInt32(_.Get_Par(par, "mes"));
                int anio = Convert.ToInt32(_.Get_Par(par, "anio"));
                ReportViewer rpt = new ReportViewer();
                rpt.ProcessingMode = ProcessingMode.Local;
                string filename = string.Empty;
                string url = UrlReportingService; //"http://172.16.2.73/ReportServer";
                rpt.PromptAreaCollapsed = false;
                rpt.ShowCredentialPrompts = false;
                rpt.ShowParameterPrompts = false;
                rpt.ProcessingMode = Microsoft.Reporting.WebForms.ProcessingMode.Remote;
                rpt.ServerReport.ReportServerCredentials = new ReportServerCredentials();
                rpt.ServerReport.ReportServerUrl = new System.Uri(url);
                string reportPath = "";
                reportPath = "/Reportes/Reportes_Laboratorio/ReporteLaboratorioKPI";
                rpt.ServerReport.ReportPath = reportPath;

                ReportParameter[] param = new ReportParameter[2];
                param[0] = new ReportParameter("mes", mes.ToString());
                param[1] = new ReportParameter("anio", anio.ToString());
                rpt.ServerReport.SetParameters(param);

                while (rpt.ServerReport.IsDrillthroughReport)
                {
                    rpt.PerformBack();
                };
                Warning[] warnings;
                string[] streamIds;
                string mimeType = string.Empty;
                string encoding = string.Empty;
                string extension = string.Empty;
                bytes = rpt.ServerReport.Render("EXCELOPENXML", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            }
            catch (Exception ex)
            {
                string error = ex.Message;

            }
            return File(bytes, "application/ms-excel", "ReporteLaboratorioKPI.xlsx");
        }

        /* Luis - Consulta - Ingreso Partidas*/

        public string Laboratorio_GetPermisos() //Obtener Permisos de usuario
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Laboratorio_Get_TipoPermisoxUsuario", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Search() //Busqueda de pantalla inicial
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            var id = _.GetUsuario().IdGrupoComercial;

            string par = _.Get("par") + "," + id;
            string data = oMantenimiento.get_Data("uspPartidaBuscar", par, true, Util.Intranet);
            return data;
        }

        public string AprobarPartidaRechazada() //Consesionar Partida -Gerentes - ERP
        {
            int rows = 0;

            string idpartida = _.Post("idpartida");
            string reportetecnico = _.Post("reportetecnico");
            string partida = _.Post("partida");
            string idclienteerp = _.Post("idclienteerp");
            string idproveedor = _.Post("idproveedor");
            string status = _.Post("status");
            string cliente = _.Post("cliente");
            string fabrica = _.Post("fabrica");

            string parametro = idpartida + "," + _.GetUsuario().CodUsuario.Trim().ToLower();

            blMantenimiento oMantenimiento = new blMantenimiento();
            rows = oMantenimiento.save_Row("uspPartidaAprobarComercial", parametro, Util.Intranet);

            if (rows > 0)
            {
                string parametroClienteFabrica = idclienteerp + "," + idproveedor;

                /* correochange */
                string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
                string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametroClienteFabrica, false, Util.ERP);

                //string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
                //string CorreoComercial = "1627749@utp.edu.pe";
                //string CorreoFabrica = "mesadeayuda@wts.com.pe";

                string data = oMantenimiento.get_Data("usp_Laboratorio_Reporte_Email", idpartida, true, Util.Intranet);

                List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;
                
                string html = "Se adjunta Reporte Tecnico";

                if (oreporte != null) { html = oreporte.Email_Body; }

                byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                string name_file = reportetecnico + ".pdf";
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                blMail oMail = new blMail();
                beMailSQL obeMail = new beMailSQL();

                obeMail.codigo_usuario = "erp";
                obeMail.correo_usuario = "erp@wts.com.pe";

                obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
                obeMail.copiacorreo = CopiaCorreoLaboratorio;// ;laboratorio@wts.com.pe";
                obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

                obeMail.subject = "WTS - " + cliente + " - " + fabrica + " - " + reportetecnico + " - " + "CONCESIONADO" + " / " + partida;
                if (obeMail.subject.Length > 250) { obeMail.subject = "WTS - " + cliente + " - " + fabrica + " - " + reportetecnico + " - " + "CONCESIONADO"; }
                obeMail.body = html;

                obeMail.file_attachments = name_file;
                oMail.sendMailBandeja(obeMail);

            }

            string mensaje = _.Mensaje("edit", rows > 0);

            return mensaje;
        }
         
        public string AprobarTono() // Aprobar Tono, Jefas Comerciales
        {
            int rows = -1;
            string idpartida = _.Post("idpartida");
            string reportetecnico = _.Post("reportetecnico");
            string idclienteerp = _.Post("idclienteerp");
            string idproveedor = _.Post("idproveedor");
            string comentariocolor = _.Post("comentariocolor");
            string status = _.Post("status");
            string estadotono = _.Post("estadotono");
            string usuario = _.GetUsuario().CodUsuario.Trim().ToLower();

            blMantenimiento oMantenimiento = new blMantenimiento();
          
            rows = oMantenimiento.save_Rows("uspPartidasAprobarTono", idpartida, Util.Intranet, usuario, comentariocolor, estadotono);           

            if (rows > 0)
            {
                if (status != "R")
                {
                    string parametro = idclienteerp + "," + idproveedor;

                    /* correochange */
                    string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
                    string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                    string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

                    //string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
                    //string CorreoComercial = "1627749@utp.edu.pe";
                    //string CorreoFabrica = "mesadeayuda@wts.com.pe";

                    string data = oMantenimiento.get_Data("usp_Laboratorio_Reporte_Email", idpartida, true, Util.Intranet);

                    List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                    reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                    ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;                    

                    string html = "Se adjunta Reporte Tecnico";

                    if (oreporte != null) { html = oreporte.Email_Body; }

                    byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                    string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                    string name_file = reportetecnico + ".pdf";
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                    blMail oMail = new blMail();
                    beMailSQL obeMail = new beMailSQL();
                   
                    obeMail.codigo_usuario = "erp";
                    obeMail.correo_usuario = "erp@wts.com.pe";

                    obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
                    obeMail.copiacorreo = CopiaCorreoLaboratorio;// ;laboratorio@wts.com.pe";
                    obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

                    obeMail.subject = oreporte.Email_Subject;
                    obeMail.body = html;

                    obeMail.file_attachments = name_file;

                    oMail.sendMailBandeja(obeMail);
                }
            }

            string mensaje = _.Mensaje("edit", rows > 0);
            return mensaje;
        }

        public string Save() //Guardar Solicitud por Laboratorio
        {
            int rows = 0;
            string parHead = _.Post("parHead");
            string parDetail = _.Post("parDetail");
            string parSubDetail = _.Post("parSubDetail");
            string parFoot = _.Post("parFoot");
            string parSubFoot = _.Post("parSubFoot");

            parHead = _.addParameter(parHead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parHead = _.addParameter(parHead, "Asignador", "0");


            blMantenimiento oMantenimiento = new blMantenimiento();
            /* Luis */
            //rows = oMantenimiento.save_Rows("uspPartidaSolicitudGuardar", parHead, Util.Intranet, parDetail, parSubDetail, parFoot);
            rows = oMantenimiento.save_Rows_Out("uspPartidaSolicitudGuardar", parHead, Util.Intranet, parDetail, parSubDetail, parFoot, parSubFoot);

            string mensaje = _.Mensaje("new", rows > 0);
            return mensaje;
        }

        public string SolicitudFabricaSave() //Guardar Solicitud por otro usuario
        {
            //int rows = 0;
            string parHead = _.Post("parHead");
            string parDetail = _.Post("parDetail");
            string parSubDetail = _.Post("parSubDetail");
            string parFoot = _.Post("parFoot");
            string parSubFoot = _.Post("parSubFoot");

            parHead = _.addParameter(parHead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parHead = _.addParameter(parHead, "Asignador", "0");

            int CodigoPartida = 0;

            blMantenimiento oMantenimiento = new blMantenimiento();
            CodigoPartida = oMantenimiento.save_Rows_Out("uspPartidaSolicitudFabricaGuardar", parHead, Util.Intranet, parDetail, parSubDetail, parFoot, parSubFoot);

            //if (CodigoPartida > 0)
            //{

            //    string[] Parametros = oMantenimiento.get_Data("uspPartidaTraerNumeroReporteTecnico", CodigoPartida.ToString(), false, Util.Intranet).Split(',');

            //    blMail oMail = new blMail();
            //    beMailSQL obeMail = new beMailSQL();
            //    obeMail.body = "Se registro la solicitud de reporte Tecnico.";
            //    obeMail.codigo_usuario = "erp";
            //    obeMail.copiacorreo = "rhuaman@wts.com.pe";
            //    obeMail.to_address = "kgarcia@wts.com.pe";
            //    obeMail.correo_usuario = "erp@wts.com.pe";
            //    obeMail.subject = "WTS Laboratory - Request - Report # " + Parametros[0] + " / " + Parametros[1];
            //    oMail.sendMailBandeja(obeMail);

            //    rows = 1;

            //}

            string mensaje = _.Mensaje("new", CodigoPartida > 0);
            return mensaje;
        }

        public string SaveTest() // Guardar Pruebas de Laboratorio
        {
            int rows = 0;
            string parHead = _.Post("par");           
            parHead = _.addParameter(parHead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parHead = _.addParameter(parHead, "Asignador", "1");

            string parDetail = _.Post("pardetail");
            
            string idclienteerp = _.Post("idclienteerp");
            string idproveedor = _.Post("idproveedor");
            string idpartida = _.Post("idpartida");

            string status = _.Post("status");
            string statustono = _.Post("statustono");
            string reporte = _.Post("reportetecnico");
            string accion = _.Post("accion");

            blMantenimiento oMantenimiento = new blMantenimiento();           
            rows = oMantenimiento.save_Rows_Out("uspPartidaPruebasGuardar", parHead, Util.Intranet, parDetail);

            var usuario = _.GetUsuario().CodUsuario.Trim().ToLower();

            //rows = 0;

            if (accion == "enviar") {

                if (rows > 0 && (usuario == "laboratorio" || usuario == "mroman"))
                {
                    string parametro = idclienteerp + "," + idproveedor;

                    string StatusFinal = "";

                    if (status == "A") // Aprobado
                    {
                        switch (statustono)
                        {
                            case "No Aplica":
                                StatusFinal = "A";
                                break;
                            case "Pendiente":
                                StatusFinal = "P";
                                break;
                            case "Aprobado":
                                StatusFinal = "A";
                                break;
                            case "Rechazado":
                                StatusFinal = "Z";
                                break;
                        }
                    }
                    else if (status == "C") //Aprobado con comentario
                    {
                        switch (statustono)
                        {
                            case "No Aplica":
                                StatusFinal = "C";
                                break;
                            case "Pendiente":
                                StatusFinal = "P";
                                break;
                            case "Aprobado":
                                StatusFinal = "C";
                                break;
                            case "Rechazado":
                                StatusFinal = "Z";
                                break;
                        }
                    }
                    else if (status == "Z")
                    {
                        switch (statustono)
                        {
                            case "No Aplica":
                                StatusFinal = "Z";
                                break;
                            case "Pendiente":
                                StatusFinal = "Z";
                                break;
                            case "Aprobado":
                                StatusFinal = "Z";
                                break;
                            case "Rechazado":
                                StatusFinal = "Z";
                                break;
                        }
                    }


                    if (StatusFinal == "C" || StatusFinal == "Z" || StatusFinal == "A" || StatusFinal == "P")
                    {
                        /* correochange */
                        //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
                        //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                        //string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

                        string CopiaCorreoLaboratorio = "laboratorio@wts.com.pe";
                        string CorreoComercial = "1627749@utp.edu.pe";
                        string CorreoFabrica = "lrojas@wts.com.pe";

                        string data = oMantenimiento.get_Data("usp_Laboratorio_Reporte_Email", idpartida, true, Util.Intranet);

                        List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                        reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                        ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;

                        string html = "Se adjunta Reporte Tecnico";

                        if (oreporte != null) { html = oreporte.Email_Body; }

                        byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                        string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                        string name_file = reporte + ".pdf";
                        System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                        blMail oMail = new blMail();
                        beMailSQL obeMail = new beMailSQL();

                        obeMail.codigo_usuario = "erp";
                        obeMail.correo_usuario = "erp@wts.com.pe";

                        obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
                        obeMail.copiacorreo = CopiaCorreoLaboratorio;
                        obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

                        obeMail.subject = oreporte.Email_Subject;
                        obeMail.body = html;

                        obeMail.file_attachments = name_file;
                        oMail.sendMailBandeja(obeMail);
                    }
                }
            }

            string mensaje = _.Mensaje("edit", rows > 0);
            return mensaje;
        }
                       
        public string SearchPartidaRelacion() //Obtener partidas relacionadas
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaRelacionBuscar", par, true, Util.Intranet);
            return data;
        }
        
        public string GetDatosCarga() // Traer Información Principal
        {
            var id = _.GetUsuario().IdGrupoComercial;
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspPartidaFabricaClienteFamilia", id.ToString(), true, Util.Intranet);
            return data;
        }

        public string GetTest() //Obtener Informacion Partida para Pruebas
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaTestObtener", par, true, Util.Intranet);
            return data;
        }

        public string GetPartidaReporte() //Obtener informacion partida para reporte
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaSolicitudReporteObtener", par, true, Util.Intranet);
            return data;
        }

        public string Get_InstruccionCuidado() //Obtener Instrucciones de Cuidado
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("Laboratorio.usp_Get_InstruccionCuidado_Laboratorio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }
                
        public string Get() // Obtener Informacion de Partida para Editar
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaSolicitudObtener", par, true, Util.Intranet);
            return data;
        }
        
        public string GetTemporada()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspPartidaClienteTemporadaObtener", par, true, Util.Intranet);
            return data;
        }

        public string SearchTela()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaTelaBuscar", par, true, Util.Intranet);
            return data;
        }

        public string SearchPo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaPoBuscar", par, true, Util.Intranet);
            return data;
        }
        
        public string GetPoColor()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaPoColorObtener", par, true, Util.Intranet);
            return data;
        }

        public string RecibirPartida()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("uspPartidaRecibirObtener", par, true, Util.Intranet);
            return data;
        }
        
        public string DeletePartida()
        {
            int rows = 0;
            string par = _.Post("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            rows = oMantenimiento.save_Row("uspLaboratorioPartidaEliminar", par, Util.Intranet);

            string mensaje = _.Mensaje("remove", rows > 0);
            return mensaje;
        }

        public string EnviarReporte()
        {
            int rows = 0;
            string par = _.Post("par");
            string reporte = _.Post("reporte");

            blMantenimiento oMantenimiento = new blMantenimiento();
            rows = oMantenimiento.save_Row("uspPartidaReporteEnviar", par, Util.Intranet);


            byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(par));
            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
            string name_file = reporte + ".pdf";
            System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

            blMail oMail = new blMail();
            beMailSQL obeMail = new beMailSQL();
            obeMail.body = "Se adjunta el reporte tecnico";
            obeMail.codigo_usuario = "erp";
            obeMail.copiacorreo = "rhuaman@wts.com.pe";
            obeMail.correo_usuario = "erp@wts.com.pe";
            obeMail.to_address = "kgarcia@wts.com.pe";
            obeMail.subject = "WTS Laboratory - Final Report " + reporte;
            obeMail.file_attachments = name_file;

            oMail.sendMailBandeja(obeMail);

            string mensaje = _.Mensaje("sendmail", rows > 0);
            return mensaje;
        }

        public string AprobarPartidaComercial()
        {
            int rows = 0;

            string codigo = _.Post("codigo");
            string idpartida = _.Post("idpartida");
            string reportetecnico = _.Post("reportetecnico");
            string partida = _.Post("partida");
            string idclienteerp = _.Post("idclienteerp");
            string idproveedor = _.Post("idproveedor");
            string status = _.Post("status");
            string cliente = _.Post("cliente");
            string fabrica = _.Post("fabrica");


            bool Valido = false;
            string Usuario = "";

            if (codigo == "2204") // Es Rodrigo
            {
                Valido = true;
                Usuario = "rlines";
            }
            else if (codigo == "190678") // Es Alberto
            {
                Valido = true;
                Usuario = "arejas";
            }
            else if (codigo == "rpdelsolar") // Es Raul
            {
                Valido = true;
                Usuario = "rperales";
            }

            string parametro = idpartida + "," + Usuario;

            if (Valido)
            {
                blMantenimiento oMantenimiento = new blMantenimiento();
                rows = oMantenimiento.save_Row("uspPartidaAprobarComercial", parametro, Util.Intranet);

                if (rows > 0)
                {

                    string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

                    List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                    reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                    ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;


                    string html = "Se adjunta Reporte Tecnico";

                    if (oreporte != null)
                    {
                        html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
                    }

                    string parametroClienteFabrica = idclienteerp + "," + idproveedor;

                    /* correochange */
                    string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString();
                    string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                    string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametroClienteFabrica, false, Util.ERP);

                    //string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
                    //string CorreoComercial = "1627749@utp.edu.pe";
                    //string CorreoFabrica = "mesadeayuda@wts.com.pe";

                    byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                    string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                    string name_file = reportetecnico + ".pdf";
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                    blMail oMail = new blMail();
                    beMailSQL obeMail = new beMailSQL();
                    obeMail.body = html;
                    obeMail.codigo_usuario = "erp";
                    obeMail.copiacorreo = CopiaCorreoLaboratorio;
                    obeMail.correo_usuario = "erp@wts.com.pe";
                    obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;


                    obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reportetecnico + "-" + "CONCESIONADO" + " / " + partida;

                    if (obeMail.subject.Length > 250)
                    {
                        obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + "-" + reportetecnico + "-" + "CONCESIONADO";
                    }

                    obeMail.file_attachments = name_file;

                    oMail.sendMailBandeja(obeMail);

                }

            }
            else
            {
                rows = -1;
            }

            string mensaje = rows.ToString(); // _.Mensaje("edit", rows > 0);
            return mensaje;
        }
             

        /* Luis - Reportes */ 
       
        public ActionResult Exportar_Solicitud(int id)
        {
            byte[] pdfbyte = new byte[0];
            MemoryStream ms = new MemoryStream();
            string data = GetData_ReporteSolicitud(id);
            string nombrePDF = "Error.pdf";
            if (data != null)
            {
                try
                {
                    List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
                    reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                    ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

                    iTextSharp.text.Document doc = new iTextSharp.text.Document(iTextSharp.text.PageSize.A4, 20f, 20f, 10f, 10f);
                    iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, ms);
                    doc.AddTitle("Technical Report");
                    doc.AddCreator("Luis Rojas");
                    doc.Open();

                    nombrePDF = oreporte.ReporteTecnico;

                    iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 14, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);
                    iTextSharp.text.Font _standardFont2 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
                    iTextSharp.text.Font _standardFont5 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 9, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
                    iTextSharp.text.Font _standardFont3 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 8, iTextSharp.text.Font.NORMAL, iTextSharp.text.BaseColor.BLACK);
                    iTextSharp.text.Font _standardFont4 = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA, 10, iTextSharp.text.Font.BOLD, iTextSharp.text.BaseColor.BLACK);

                    /**** TABLA HEADER ****/
                    iTextSharp.text.pdf.PdfPTable tablaHeader = new iTextSharp.text.pdf.PdfPTable(5);
                    tablaHeader.WidthPercentage = 100;

                    // LOGO //  
                    iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(Server.MapPath("~/Content/img/logos/WTSLogo2.png"));
                    jpg.ScaleToFit(100f, 80f);

                    iTextSharp.text.pdf.PdfPCell cellLogo = new iTextSharp.text.pdf.PdfPCell(jpg);
                    cellLogo.Colspan = 1;
                    cellLogo.Rowspan = 2;

                    //  TITULO //
                    iTextSharp.text.pdf.PdfPCell cellTitulo1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Registro", _standardFont2));
                    cellTitulo1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellTitulo1.Padding = 7;
                    cellTitulo1.Colspan = 3;

                    iTextSharp.text.pdf.PdfPCell cellTitulo2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Solicitud de Ensayo", _standardFont2));
                    cellTitulo2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellTitulo2.Padding = 7;
                    cellTitulo2.Colspan = 3;

                    // TABLA INFO //
                    iTextSharp.text.pdf.PdfPCell cellInfo = new iTextSharp.text.pdf.PdfPCell(new PdfPCell(new Phrase(string.Format("Código: {0} \n" + "Fecha: {1} \n" + "Versión: {2} \n" + "Página: {3} \n", "TT-LC-T-001-16", DateTime.Today.ToString("dd/MM/yyyy"), "00", "1 de 1"), _standardFont3)));
                    cellInfo.VerticalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellInfo.Colspan = 1;
                    cellInfo.Rowspan = 2;

                    tablaHeader.AddCell(cellLogo);
                    tablaHeader.AddCell(cellTitulo1);
                    tablaHeader.AddCell(cellInfo);
                    tablaHeader.AddCell(cellTitulo2);

                    doc.Add(tablaHeader);

                    /**** TABLA TITULO ***/
                    iTextSharp.text.pdf.PdfPTable tablaTitulo = new iTextSharp.text.pdf.PdfPTable(5);
                    tablaTitulo.WidthPercentage = 100;

                    iTextSharp.text.pdf.PdfPCell cellTitulo = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("                   SOLICITUD DE ENSAYO N° " + oreporte.ReporteTecnico, _standardFont));
                    cellTitulo.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellTitulo.Border = Rectangle.NO_BORDER;
                    cellTitulo.Padding = 7;
                    cellTitulo.Colspan = 4;

                    iTextSharp.text.pdf.PdfPCell cellFecha = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fecha:" + oreporte.FechaIngreso, _standardFont2));
                    cellFecha.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellFecha.Border = Rectangle.NO_BORDER;
                    cellFecha.Padding = 7;
                    cellFecha.Colspan = 1;

                    tablaTitulo.AddCell(cellTitulo);
                    tablaTitulo.AddCell(cellFecha);

                    doc.Add(tablaTitulo);

                    /**** TABLA INTRO ****/
                    iTextSharp.text.pdf.PdfPTable tablaIntro = new iTextSharp.text.pdf.PdfPTable(1);
                    tablaIntro.WidthPercentage = 100;

                    iTextSharp.text.pdf.PdfPCell cellIntro = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("DATOS DE LA MUESTRA", _standardFont4));
                    cellIntro.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellIntro.Border = Rectangle.NO_BORDER;
                    cellIntro.Padding = 7;
                    cellIntro.Colspan = 1;

                    tablaIntro.AddCell(cellIntro);

                    doc.Add(tablaIntro);

                    /**** TABLA DETALLE CABECERA ****/

                    iTextSharp.text.pdf.PdfPTable tablaDetCab = new iTextSharp.text.pdf.PdfPTable(3);
                    tablaDetCab.WidthPercentage = 100;

                    /* Fila 1 */
                    iTextSharp.text.pdf.PdfPCell cell1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Cliente :", _standardFont4));
                    cell1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell1.Border = Rectangle.NO_BORDER;
                    cell1.PaddingLeft = 7;
                    cell1.PaddingBottom = 3;
                    cell1.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Fábrica :", _standardFont4));
                    cell2.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell2.Border = Rectangle.NO_BORDER;
                    cell2.PaddingLeft = 7;
                    cell2.PaddingBottom = 3;
                    cell2.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Decripción :", _standardFont4));
                    cell3.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell3.Border = Rectangle.NO_BORDER;
                    cell3.PaddingLeft = 7;
                    cell3.PaddingBottom = 3;
                    cell3.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NombreCliente, _standardFont5));
                    cell4.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell4.Border = Rectangle.NO_BORDER;
                    cell4.PaddingLeft = 10;
                    cell4.PaddingBottom = 7;
                    cell4.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell5 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NombreFabrica, _standardFont5));
                    cell5.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell5.Border = Rectangle.NO_BORDER;
                    cell5.PaddingLeft = 10;
                    cell5.PaddingBottom = 7;
                    cell5.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell6 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.DescripcionTela, _standardFont5));
                    cell6.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell6.Border = Rectangle.NO_BORDER;
                    cell6.PaddingLeft = 10;
                    cell6.PaddingBottom = 7;
                    cell6.Colspan = 1;

                    /* Fila 2 */
                    iTextSharp.text.pdf.PdfPCell cell7 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("PO / BUY :", _standardFont4));
                    cell7.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell7.Border = Rectangle.NO_BORDER;
                    cell7.PaddingLeft = 7;
                    cell7.PaddingBottom = 3;
                    cell7.Colspan = 1;
                    
                    iTextSharp.text.pdf.PdfPCell cell8 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tintoreria :", _standardFont4));
                    cell8.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell8.Border = Rectangle.NO_BORDER;
                    cell8.PaddingLeft = 7;
                    cell8.PaddingBottom = 3;
                    cell8.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell9 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Partida :", _standardFont4));
                    cell9.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell9.Border = Rectangle.NO_BORDER;
                    cell9.PaddingLeft = 7;
                    cell9.PaddingBottom = 3;
                    cell9.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell10 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.POS, _standardFont5));
                    cell10.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell10.Border = Rectangle.NO_BORDER;
                    cell10.PaddingLeft = 10;
                    cell10.PaddingBottom = 7;
                    cell10.Colspan = 1;                  

                    iTextSharp.text.pdf.PdfPCell cell11 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NombreTintoreria, _standardFont5));
                    cell11.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell11.Border = Rectangle.NO_BORDER;
                    cell11.PaddingLeft = 10;
                    cell11.PaddingBottom = 7;
                    cell11.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell12 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NumeroPartida, _standardFont5));
                    cell12.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell12.Border = Rectangle.NO_BORDER;
                    cell12.PaddingLeft = 10;
                    cell12.PaddingBottom = 7;
                    cell12.Colspan = 1;
                    
                    /* Fila 3 */
                    iTextSharp.text.pdf.PdfPCell cell13 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Estilo :", _standardFont4));
                    cell13.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell13.Border = Rectangle.NO_BORDER;
                    cell13.PaddingLeft = 7;
                    cell13.PaddingBottom = 3;
                    cell13.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell14 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Color :", _standardFont4));
                    cell14.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell14.Border = Rectangle.NO_BORDER;
                    cell14.PaddingLeft = 7;
                    cell14.PaddingBottom = 3;
                    cell14.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell15 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Temporada :", _standardFont4));
                    cell15.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell15.Border = Rectangle.NO_BORDER;
                    cell15.PaddingLeft = 7;
                    cell15.PaddingBottom = 3;
                    cell15.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell16 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.Estilos, _standardFont5));
                    cell16.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell16.Border = Rectangle.NO_BORDER;
                    cell16.PaddingLeft = 10;
                    cell16.PaddingBottom = 7;
                    cell16.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell17 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NombreColor, _standardFont5));
                    cell17.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell17.Border = Rectangle.NO_BORDER;
                    cell17.PaddingLeft = 10;
                    cell17.PaddingBottom = 7;
                    cell17.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell18 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.NombreTemporada, _standardFont5));
                    cell18.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell18.Border = Rectangle.NO_BORDER;
                    cell18.PaddingLeft = 10;
                    cell18.PaddingBottom = 7;
                    cell18.Colspan = 1;

                    /* Fila 4 */
                    
                    iTextSharp.text.pdf.PdfPCell cell19 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Densidad :", _standardFont4));
                    cell19.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell19.Border = Rectangle.NO_BORDER;
                    cell19.PaddingLeft = 7;
                    cell19.PaddingBottom = 3;
                    cell19.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell20 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("N° Reporte Inicial :", _standardFont4));
                    cell20.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell20.Border = Rectangle.NO_BORDER;
                    cell20.PaddingLeft = 7;
                    cell20.PaddingBottom = 3;
                    cell20.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell21 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont4));
                    cell21.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell21.Border = Rectangle.NO_BORDER;
                    cell21.PaddingLeft = 7;
                    cell21.PaddingBottom = 3;
                    cell21.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell22= new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.GramajeAcabado, _standardFont5));
                    cell22.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell22.Border = Rectangle.NO_BORDER;
                    cell22.PaddingLeft = 10;
                    cell22.PaddingBottom = 10;
                    cell22.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell23 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.ReportesTecnicos, _standardFont5));
                    cell23.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell23.Border = Rectangle.NO_BORDER;
                    cell23.PaddingLeft = 10;
                    cell23.PaddingBottom = 10;
                    cell23.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cell24 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cell24.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cell24.Border = Rectangle.NO_BORDER;
                    cell24.PaddingLeft = 10;
                    cell24.PaddingBottom = 10;
                    cell24.Colspan = 1;

                    tablaDetCab.AddCell(cell1);
                    tablaDetCab.AddCell(cell2);
                    tablaDetCab.AddCell(cell3);
                    tablaDetCab.AddCell(cell4);
                    tablaDetCab.AddCell(cell5);
                    tablaDetCab.AddCell(cell6);
                    tablaDetCab.AddCell(cell7);
                    tablaDetCab.AddCell(cell8);
                    tablaDetCab.AddCell(cell9);
                    tablaDetCab.AddCell(cell10);
                    tablaDetCab.AddCell(cell11);
                    tablaDetCab.AddCell(cell12);
                    tablaDetCab.AddCell(cell13);
                    tablaDetCab.AddCell(cell14);
                    tablaDetCab.AddCell(cell15);
                    tablaDetCab.AddCell(cell16);
                    tablaDetCab.AddCell(cell17);
                    tablaDetCab.AddCell(cell18);
                    tablaDetCab.AddCell(cell19);
                    tablaDetCab.AddCell(cell20);
                    tablaDetCab.AddCell(cell21);
                    tablaDetCab.AddCell(cell22);
                    tablaDetCab.AddCell(cell23);
                    tablaDetCab.AddCell(cell24);

                    doc.Add(tablaDetCab);

                    /**** TABLA DETALLE  ****/

                    iTextSharp.text.pdf.PdfPTable tablaDetalle = new iTextSharp.text.pdf.PdfPTable(16);
                    tablaDetalle.WidthPercentage = 100;

                    iTextSharp.text.pdf.PdfPCell cellPrueba = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Paquete de Pruebas :", _standardFont4));
                    cellPrueba.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPrueba.Padding = 4;
                    cellPrueba.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellMaterial = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Material :", _standardFont4));
                    cellMaterial.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellMaterial.Padding = 4;
                    cellMaterial.Colspan = 2;

                    iTextSharp.text.pdf.PdfPCell cellProceso = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Proceso :", _standardFont4));
                    cellProceso.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellProceso.Padding = 4;
                    cellProceso.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellMuestra = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Muestra :", _standardFont4));
                    cellMuestra.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellMuestra.Padding = 4;
                    cellMuestra.Colspan = 4;

                    //row1
                    iTextSharp.text.pdf.PdfPCell cellFull = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Prenda - Todas las Pruebas", _standardFont5));
                    cellFull.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFull.Border = Rectangle.LEFT_BORDER;
                    cellFull.PaddingTop = 4;
                    cellFull.Colspan = 4;

                    var Full = oreporte.TipoPrueba.Trim() == "gf" ? "( X ) " : "(     ) ";
                    iTextSharp.text.pdf.PdfPCell cellFullCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Full, _standardFont5));
                    cellFullCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFullCheck.Border = Rectangle.RIGHT_BORDER;
                    cellFullCheck.PaddingTop = 4;
                    cellFullCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellTela = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela", _standardFont5));
                    cellTela.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellTela.Border = Rectangle.LEFT_BORDER;
                    cellTela.PaddingTop = 4;
                    cellTela.Colspan = 1;

                    var Tela = oreporte.Material.Trim() == "Tela" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellTelaCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Tela, _standardFont5));
                    cellTelaCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellTelaCheck.Border = Rectangle.RIGHT_BORDER;
                    cellTelaCheck.PaddingTop = 4;
                    cellTelaCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellPPT = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("PPT / PPE", _standardFont5));
                    cellPPT.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPPT.Border = Rectangle.LEFT_BORDER;
                    cellPPT.PaddingTop = 4;
                    cellPPT.Colspan = 4;

                    var PPT = oreporte.Proceso.Trim() == "PPT" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellPPTCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(PPT, _standardFont5));
                    cellPPTCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellPPTCheck.Border = Rectangle.RIGHT_BORDER;
                    cellPPTCheck.PaddingTop = 4;
                    cellPPTCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellLavada = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Lavada", _standardFont5));
                    cellLavada.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellLavada.Border = Rectangle.LEFT_BORDER;
                    cellLavada.PaddingTop = 4;
                    cellLavada.Colspan = 2;

                    var lavada = oreporte.Lavado.Trim() == "Lavado" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellLavadaCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(lavada, _standardFont5));
                    cellLavadaCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellLavadaCheck.Border = Rectangle.RIGHT_BORDER;
                    cellLavadaCheck.PaddingTop = 4;
                    cellLavadaCheck.Colspan = 2;

                    //row2
                    iTextSharp.text.pdf.PdfPCell cellIntruccionCuidado = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Prenda - Instrucciones de Cuidado", _standardFont5));
                    cellIntruccionCuidado.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellIntruccionCuidado.Border = Rectangle.LEFT_BORDER;
                    cellIntruccionCuidado.PaddingTop = 4;
                    cellIntruccionCuidado.Colspan = 4;

                    var IntruccionCuidado = oreporte.TipoPrueba.Trim() == "gi" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellIntruccionCuidadoCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(IntruccionCuidado, _standardFont5));
                    cellIntruccionCuidadoCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellIntruccionCuidadoCheck.Border = Rectangle.RIGHT_BORDER;
                    cellIntruccionCuidadoCheck.PaddingTop = 4;
                    cellIntruccionCuidadoCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellPrenda = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Prenda", _standardFont5));
                    cellPrenda.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPrenda.Border = Rectangle.LEFT_BORDER;
                    cellPrenda.PaddingTop = 4;
                    cellPrenda.Colspan = 1;

                    var Prenda = oreporte.Material.Trim() == "Prenda" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellPrendaCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Prenda, _standardFont5));
                    cellPrendaCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellPrendaCheck.Border = Rectangle.RIGHT_BORDER;
                    cellPrendaCheck.PaddingTop = 4;
                    cellPrendaCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellTenido = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Teñido en prenda", _standardFont5));
                    cellTenido.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellTenido.Border = Rectangle.LEFT_BORDER;
                    cellTenido.PaddingTop = 4;
                    cellTenido.Colspan = 4;

                    var Teprenda = oreporte.Proceso.Trim() == "TeñidoPrenda" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellTenidoCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Teprenda, _standardFont5));
                    cellTenidoCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellTenidoCheck.Border = Rectangle.RIGHT_BORDER;
                    cellTenidoCheck.PaddingTop = 4;
                    cellTenidoCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellSinLavar = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Sin Lavada", _standardFont5));
                    cellSinLavar.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellSinLavar.Border = Rectangle.LEFT_BORDER;
                    cellSinLavar.PaddingTop = 4;
                    cellSinLavar.Colspan = 2;

                    var Sinlavada = oreporte.Lavado.Trim() == "SinLavar" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellSinLavarCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Sinlavada, _standardFont5));
                    cellSinLavarCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellSinLavarCheck.Border = Rectangle.RIGHT_BORDER;
                    cellSinLavarCheck.PaddingTop = 4;
                    cellSinLavarCheck.Colspan = 2;

                    //row3
                    iTextSharp.text.pdf.PdfPCell cellProduccion = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Prenda - Producción", _standardFont5));
                    cellProduccion.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellProduccion.Border = Rectangle.LEFT_BORDER;
                    cellProduccion.PaddingTop = 4;
                    cellProduccion.Colspan = 4;

                    var produccion = oreporte.TipoPrueba.Trim() == "gp" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellProduccionCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(produccion, _standardFont5));
                    cellProduccionCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellProduccionCheck.Border = Rectangle.RIGHT_BORDER;
                    cellProduccionCheck.PaddingTop = 4;
                    cellProduccionCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellHilado = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Hilado", _standardFont5));
                    cellHilado.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellHilado.Border = Rectangle.LEFT_BORDER;
                    cellHilado.PaddingTop = 4;
                    cellHilado.Colspan = 1;

                    var Hilado = oreporte.Material.Trim() == "Hilado" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellHiladoCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Hilado, _standardFont5));
                    cellHiladoCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellHiladoCheck.Border = Rectangle.RIGHT_BORDER;
                    cellHiladoCheck.PaddingTop = 4;
                    cellHiladoCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellPieza = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Teñido en pieza", _standardFont5));
                    cellPieza.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPieza.Border = Rectangle.LEFT_BORDER;
                    cellPieza.PaddingTop = 4;
                    cellPieza.Colspan = 4;

                    var tepieza = oreporte.Proceso.Trim() == "TeñidoPieza" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellPiezaCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(tepieza, _standardFont5));
                    cellPiezaCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellPiezaCheck.Border = Rectangle.RIGHT_BORDER;
                    cellPiezaCheck.PaddingTop = 4;
                    cellPiezaCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellPregunta = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Lleva Complemento?", _standardFont5));
                    cellPregunta.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPregunta.BorderWidthTop = Rectangle.NO_BORDER;
                    cellPregunta.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellPregunta.PaddingTop = 4;
                    cellPregunta.Colspan = 4;

                    //row4
                    iTextSharp.text.pdf.PdfPCell cellPartidaPro = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - 1era Partida", _standardFont5));
                    cellPartidaPro.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellPartidaPro.Border = Rectangle.LEFT_BORDER;
                    cellPartidaPro.PaddingTop = 4;
                    cellPartidaPro.Colspan = 4;

                    var partidaproduccion = oreporte.TipoPrueba.Trim() == "pp" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellPartidaProCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(partidaproduccion, _standardFont5));
                    cellPartidaProCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellPartidaProCheck.Border = Rectangle.RIGHT_BORDER;
                    cellPartidaProCheck.PaddingTop = 4;
                    cellPartidaProCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellAvios = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Avios", _standardFont5));
                    cellAvios.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellAvios.Border = Rectangle.LEFT_BORDER;
                    cellAvios.PaddingTop = 4;
                    cellAvios.Colspan = 1;

                    var Avios = oreporte.Material.Trim() == "Avios" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellAviosCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Avios, _standardFont5));
                    cellAviosCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellAviosCheck.Border = Rectangle.RIGHT_BORDER;
                    cellAviosCheck.PaddingTop = 4;
                    cellAviosCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellEstampado = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Estampado Full Cobertura", _standardFont5));
                    cellEstampado.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellEstampado.Border = Rectangle.LEFT_BORDER;
                    cellEstampado.PaddingTop = 4;
                    cellEstampado.Colspan = 4;

                    var estampado = oreporte.Proceso.Trim() == "EstampadoCobertura" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellEstampadoCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(estampado, _standardFont5));
                    cellEstampadoCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellEstampadoCheck.Border = Rectangle.RIGHT_BORDER;
                    cellEstampadoCheck.PaddingTop = 4;
                    cellEstampadoCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellSi = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("SI", _standardFont5));
                    cellSi.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellSi.Border = Rectangle.LEFT_BORDER;
                    cellSi.PaddingTop = 4;
                    cellSi.Colspan = 2;

                    var compleSi = oreporte.Complemento.Trim() == "Si" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellSiCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(compleSi, _standardFont5));
                    cellSiCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellSiCheck.Border = Rectangle.RIGHT_BORDER;
                    cellSiCheck.PaddingTop = 4;
                    cellSiCheck.Colspan = 2;

                    //row5
                    iTextSharp.text.pdf.PdfPCell cellFullTest = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - Todas las Pruebas", _standardFont5));
                    cellFullTest.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFullTest.Border = Rectangle.LEFT_BORDER;
                    cellFullTest.PaddingTop = 4;
                    cellFullTest.PaddingBottom = 4;
                    cellFullTest.Colspan = 4;

                    var fulltest = oreporte.TipoPrueba.Trim() == "f" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellFullTestCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(fulltest, _standardFont5));
                    cellFullTestCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFullTestCheck.Border = Rectangle.RIGHT_BORDER;
                    cellFullTestCheck.PaddingTop = 4;
                    cellFullTestCheck.PaddingBottom = 4;
                    cellFullTestCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellOtros = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Otros", _standardFont5));
                    cellOtros.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellOtros.Border = Rectangle.LEFT_BORDER;
                    cellOtros.PaddingTop = 4;
                    cellOtros.PaddingBottom = 4;
                    cellOtros.Colspan = 1;

                    var Otros = oreporte.Material.Trim() == "Otros" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellOtrosCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(Otros, _standardFont5));
                    cellOtrosCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellOtrosCheck.Border = Rectangle.RIGHT_BORDER;
                    cellOtrosCheck.PaddingTop = 4;
                    cellOtrosCheck.PaddingBottom = 4;
                    cellOtrosCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellAcabados = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Acabados Especiales", _standardFont5));
                    cellAcabados.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellAcabados.Border = Rectangle.LEFT_BORDER;
                    cellAcabados.PaddingTop = 4;
                    cellAcabados.PaddingBottom = 4;
                    cellAcabados.Colspan = 4;

                    var acabados = oreporte.Proceso.Trim() == "AcabadosEspeciales" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellAcabadosCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(acabados, _standardFont5));
                    cellAcabadosCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellAcabadosCheck.Border = Rectangle.RIGHT_BORDER;
                    cellAcabadosCheck.PaddingTop = 4;
                    cellAcabadosCheck.PaddingBottom = 4;
                    cellAcabadosCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellNo = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("NO", _standardFont5));
                    cellNo.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellNo.Border = Rectangle.LEFT_BORDER;
                    cellNo.PaddingTop = 4;
                    cellNo.PaddingBottom = 4;
                    cellNo.Colspan = 2;

                    var compleNo = oreporte.Complemento.Trim() == "No" ? "( X ) " : "(     ) ";
                    iTextSharp.text.pdf.PdfPCell cellNoCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(compleNo, _standardFont5));
                    cellNoCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellNoCheck.Border = Rectangle.RIGHT_BORDER;
                    cellNoCheck.PaddingTop = 4;
                    cellNoCheck.PaddingBottom = 4;
                    cellNoCheck.Colspan = 2;

                    //row6
                    iTextSharp.text.pdf.PdfPCell cellFabricaPro = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - Producción", _standardFont5));
                    cellFabricaPro.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFabricaPro.Border = Rectangle.LEFT_BORDER;
                    cellFabricaPro.PaddingTop = 4;
                    cellFabricaPro.PaddingBottom = 4;
                    cellFabricaPro.Colspan = 4;

                    var fabricapro = oreporte.TipoPrueba.Trim() == "p" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellFabricaProCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(fabricapro, _standardFont5));
                    cellFabricaProCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFabricaProCheck.Border = Rectangle.RIGHT_BORDER;
                    cellFabricaProCheck.PaddingTop = 4;
                    cellFabricaProCheck.PaddingBottom = 4;
                    cellFabricaProCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellmaterial1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmaterial1.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmaterial1.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmaterial1.Colspan = 2;

                    iTextSharp.text.pdf.PdfPCell cellproceso1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellproceso1.BorderWidthTop = Rectangle.NO_BORDER;
                    cellproceso1.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellproceso1.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellmuestra1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmuestra1.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmuestra1.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmuestra1.Colspan = 4;


                    //row7
                    iTextSharp.text.pdf.PdfPCell cellFabricDevelop = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - Desarrollo", _standardFont5));
                    cellFabricDevelop.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFabricDevelop.Border = Rectangle.LEFT_BORDER;
                    cellFabricDevelop.PaddingTop = 4;
                    cellFabricDevelop.PaddingBottom = 4;
                    cellFabricDevelop.Colspan = 4;

                    var fabricadevelop = oreporte.TipoPrueba.Trim() == "d" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellFabricDevelopCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(fabricadevelop, _standardFont5));
                    cellFabricDevelopCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFabricDevelopCheck.Border = Rectangle.RIGHT_BORDER;
                    cellFabricDevelopCheck.PaddingTop = 4;
                    cellFabricDevelopCheck.PaddingBottom = 4;
                    cellFabricDevelopCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellmaterial2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmaterial2.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmaterial2.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmaterial2.Colspan = 2;

                    iTextSharp.text.pdf.PdfPCell cellproceso2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellproceso2.BorderWidthTop = Rectangle.NO_BORDER;
                    cellproceso2.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellproceso2.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellmuestra2 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmuestra2.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmuestra2.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmuestra2.Colspan = 4;

                    //row8
                    iTextSharp.text.pdf.PdfPCell cellFabricSales = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - Muestra de Ventas", _standardFont5));
                    cellFabricSales.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFabricSales.Border = Rectangle.LEFT_BORDER;
                    cellFabricSales.PaddingTop = 4;
                    cellFabricSales.PaddingBottom = 4;
                    cellFabricSales.Colspan = 4;

                    var fabricasales = oreporte.TipoPrueba.Trim() == "m" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellFabricSalesCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(fabricasales, _standardFont5));
                    cellFabricSalesCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFabricSalesCheck.Border = Rectangle.RIGHT_BORDER;
                    cellFabricSalesCheck.PaddingTop = 4;
                    cellFabricSalesCheck.PaddingBottom = 4;
                    cellFabricSalesCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellmaterial3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmaterial3.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmaterial3.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmaterial3.Colspan = 2;

                    iTextSharp.text.pdf.PdfPCell cellproceso3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellproceso3.BorderWidthTop = Rectangle.NO_BORDER;
                    cellproceso3.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellproceso3.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellmuestra3 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmuestra3.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmuestra3.BorderWidthBottom = Rectangle.NO_BORDER;
                    cellmuestra3.Colspan = 4;

                
                    //row9
                    iTextSharp.text.pdf.PdfPCell cellFabricAdicional = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Tela - Pruebas Adicionales", _standardFont5));
                    cellFabricAdicional.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellFabricAdicional.BorderWidthTop = Rectangle.NO_BORDER;
                    cellFabricAdicional.BorderWidthRight = Rectangle.NO_BORDER;
                    cellFabricAdicional.PaddingTop = 4;
                    cellFabricAdicional.PaddingBottom = 4;
                    cellFabricAdicional.Colspan = 4;

                    var fabricaadicional = oreporte.TipoPrueba.Trim() == "a" ? "( X ) " : "(     ) ";

                    iTextSharp.text.pdf.PdfPCell cellFabricAdicionalCheck = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(fabricaadicional, _standardFont5));
                    cellFabricAdicionalCheck.HorizontalAlignment = iTextSharp.text.Element.ALIGN_RIGHT;
                    cellFabricAdicionalCheck.BorderWidthTop = Rectangle.NO_BORDER;
                    cellFabricAdicionalCheck.BorderWidthLeft = Rectangle.NO_BORDER;
                    cellFabricAdicionalCheck.PaddingTop = 4;
                    cellFabricAdicionalCheck.PaddingBottom = 4;
                    cellFabricAdicionalCheck.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellmaterial4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmaterial4.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmaterial4.Colspan = 2;

                    iTextSharp.text.pdf.PdfPCell cellproceso4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellproceso4.BorderWidthTop = Rectangle.NO_BORDER;
                    cellproceso4.Colspan = 5;

                    iTextSharp.text.pdf.PdfPCell cellmuestra4 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("", _standardFont5));
                    cellmuestra4.BorderWidthTop = Rectangle.NO_BORDER;
                    cellmuestra4.Colspan = 4;
                    

                    tablaDetalle.AddCell(cellPrueba);
                    tablaDetalle.AddCell(cellMaterial);
                    tablaDetalle.AddCell(cellProceso);
                    tablaDetalle.AddCell(cellMuestra);

                    tablaDetalle.AddCell(cellFull);
                    tablaDetalle.AddCell(cellFullCheck);
                    tablaDetalle.AddCell(cellTela);
                    tablaDetalle.AddCell(cellTelaCheck);
                    tablaDetalle.AddCell(cellPPT);
                    tablaDetalle.AddCell(cellPPTCheck);
                    tablaDetalle.AddCell(cellLavada);
                    tablaDetalle.AddCell(cellLavadaCheck);

                    tablaDetalle.AddCell(cellIntruccionCuidado);
                    tablaDetalle.AddCell(cellIntruccionCuidadoCheck);
                    tablaDetalle.AddCell(cellPrenda);
                    tablaDetalle.AddCell(cellPrendaCheck);
                    tablaDetalle.AddCell(cellTenido);
                    tablaDetalle.AddCell(cellTenidoCheck);
                    tablaDetalle.AddCell(cellSinLavar);
                    tablaDetalle.AddCell(cellSinLavarCheck);

                    tablaDetalle.AddCell(cellProduccion);
                    tablaDetalle.AddCell(cellProduccionCheck);
                    tablaDetalle.AddCell(cellHilado);
                    tablaDetalle.AddCell(cellHiladoCheck);
                    tablaDetalle.AddCell(cellPieza);
                    tablaDetalle.AddCell(cellPiezaCheck);
                    tablaDetalle.AddCell(cellPregunta);

                    tablaDetalle.AddCell(cellPartidaPro);
                    tablaDetalle.AddCell(cellPartidaProCheck);
                    tablaDetalle.AddCell(cellAvios);
                    tablaDetalle.AddCell(cellAviosCheck);
                    tablaDetalle.AddCell(cellEstampado);
                    tablaDetalle.AddCell(cellEstampadoCheck);
                    tablaDetalle.AddCell(cellSi);
                    tablaDetalle.AddCell(cellSiCheck);

                    tablaDetalle.AddCell(cellFullTest);
                    tablaDetalle.AddCell(cellFullTestCheck);
                    tablaDetalle.AddCell(cellOtros);
                    tablaDetalle.AddCell(cellOtrosCheck);
                    tablaDetalle.AddCell(cellAcabados);
                    tablaDetalle.AddCell(cellAcabadosCheck);
                    tablaDetalle.AddCell(cellNo);
                    tablaDetalle.AddCell(cellNoCheck);

                    tablaDetalle.AddCell(cellFabricaPro);
                    tablaDetalle.AddCell(cellFabricaProCheck);
                    tablaDetalle.AddCell(cellmaterial1);
                    tablaDetalle.AddCell(cellproceso1);
                    tablaDetalle.AddCell(cellmuestra1);

                    tablaDetalle.AddCell(cellFabricDevelop);
                    tablaDetalle.AddCell(cellFabricDevelopCheck);
                    tablaDetalle.AddCell(cellmaterial2);
                    tablaDetalle.AddCell(cellproceso2);
                    tablaDetalle.AddCell(cellmuestra2);

                    tablaDetalle.AddCell(cellFabricSales);
                    tablaDetalle.AddCell(cellFabricSalesCheck);
                    tablaDetalle.AddCell(cellmaterial3);
                    tablaDetalle.AddCell(cellproceso3);
                    tablaDetalle.AddCell(cellmuestra3);

                    tablaDetalle.AddCell(cellFabricAdicional);
                    tablaDetalle.AddCell(cellFabricAdicionalCheck);
                    tablaDetalle.AddCell(cellmaterial4);
                    tablaDetalle.AddCell(cellproceso4);
                    tablaDetalle.AddCell(cellmuestra4);

                    doc.Add(tablaDetalle);

                    /**** TABLA INSTRUCCION ****/

                    iTextSharp.text.pdf.PdfPTable tablaInstruccion = new iTextSharp.text.pdf.PdfPTable(1);
                    tablaInstruccion.WidthPercentage = 100;

                    iTextSharp.text.pdf.PdfPCell cellInstruccion = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Instrucciones de cuidado asignada :", _standardFont4));
                    cellInstruccion.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellInstruccion.Border = Rectangle.NO_BORDER;
                    cellInstruccion.PaddingTop = 10;
                    cellInstruccion.PaddingLeft = 7;
                    cellInstruccion.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellInstruccion1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.InstruccionCuidadoSolicitud, _standardFont2));
                    cellInstruccion1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellInstruccion1.Border = Rectangle.NO_BORDER;
                    cellInstruccion1.PaddingTop = 5;
                    cellInstruccion1.PaddingLeft = 10;
                    cellInstruccion1.Colspan = 1;


                    tablaInstruccion.AddCell(cellInstruccion);
                    tablaInstruccion.AddCell(cellInstruccion1);

                    doc.Add(tablaInstruccion);

                    /**** TABLA COMENTARIO ****/

                    iTextSharp.text.pdf.PdfPTable tablaComentario = new iTextSharp.text.pdf.PdfPTable(1);
                    tablaComentario.WidthPercentage = 100;

                    iTextSharp.text.pdf.PdfPCell cellComentario = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase("Comentarios :", _standardFont4));
                    cellComentario.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellComentario.Border = Rectangle.NO_BORDER;
                    cellComentario.PaddingTop = 10;
                    cellComentario.PaddingLeft = 7;
                    cellComentario.Colspan = 1;


                    iTextSharp.text.pdf.PdfPCell cellComentario1 = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.ComentarioSolicitud, _standardFont2));
                    cellComentario1.HorizontalAlignment = iTextSharp.text.Element.ALIGN_LEFT;
                    cellComentario1.Border = Rectangle.NO_BORDER;
                    cellComentario1.PaddingTop = 5;
                    cellComentario1.PaddingLeft = 10;
                    cellComentario1.Colspan = 1;


                    tablaComentario.AddCell(cellComentario);
                    tablaComentario.AddCell(cellComentario1);

                    doc.Add(tablaComentario);

                    /**** CODIGO DE BARRAS ****/


                    iTextSharp.text.pdf.PdfPTable tablaCodigo = new iTextSharp.text.pdf.PdfPTable(1);
                    tablaCodigo.WidthPercentage = 100;

                    PdfContentByte cb128 = new PdfContentByte(writer);

                    Barcode128 code128 = new Barcode128();
                    code128.ChecksumText = true;
                    code128.CodeType = Barcode128.CODE128;
                    code128.Code = oreporte.ReporteTecnico.ToString();
                    code128.Font = null;
                    iTextSharp.text.Image image128 = code128.CreateImageWithBarcode(cb128, null, null);
                    image128.ScaleAbsolute(150, 50);

                    PdfPCell celSSCCBC = new PdfPCell(image128);
                    celSSCCBC.HorizontalAlignment = Element.ALIGN_CENTER;
                    celSSCCBC.Border = iTextSharp.text.Rectangle.NO_BORDER;
                    celSSCCBC.PaddingTop = 15;
                    celSSCCBC.Colspan = 1;

                    iTextSharp.text.pdf.PdfPCell cellCodigo = new iTextSharp.text.pdf.PdfPCell(new iTextSharp.text.Phrase(oreporte.ReporteTecnico.ToString(), _standardFont4));
                    cellCodigo.HorizontalAlignment = iTextSharp.text.Element.ALIGN_CENTER;
                    cellCodigo.Border = Rectangle.NO_BORDER;
                    cellCodigo.PaddingTop = 5;
                    cellCodigo.Colspan = 1;

                    tablaCodigo.AddCell(celSSCCBC);
                    tablaCodigo.AddCell(cellCodigo);

                    doc.Add(tablaCodigo);


                    doc.Close();
                    writer.Close();

                    pdfbyte = ms.GetBuffer();
                    ms.Close();
                    ms.Dispose();
                }
                catch (System.Exception)
                {
                    nombrePDF = "Incomplete.pdf";

                }
            }
            return File(pdfbyte, "application/pdf", nombrePDF + ".pdf");
        } //Reporte de Partida

        public ActionResult ReportePartida(int id) //Reporte de Pruebas
        {
            byte[] pdfbyte = new byte[0];
            string data = GetData_ReportePartida_v2(id);
            string nombrePDF = "Error.pdf";
            if (data != null)
            {
                try
                {
                    List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
                    reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                    ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;
                    pdfbyte = partida_bl.CrearPdf_Partida_v2(oreporte);
                    nombrePDF = oreporte.numero_reporte;
                }
                catch (System.Exception)
                {
                    nombrePDF = "Incomplete.pdf";
                }
            }
            return File(pdfbyte, "application/pdf", nombrePDF + ".pdf");
        }       

        public FileResult ReporteLaboratorio(string par)
        {
            byte[] bytes = new byte[0];
            try
            {
                ReportViewer rpt = new ReportViewer();
                rpt.ProcessingMode = ProcessingMode.Local;
                string filename = string.Empty;
                string url = UrlReportingService; //"http://172.16.2.73/ReportServer";
                rpt.PromptAreaCollapsed = false;
                rpt.ShowCredentialPrompts = false;
                rpt.ShowParameterPrompts = false;
                rpt.ProcessingMode = Microsoft.Reporting.WebForms.ProcessingMode.Remote;
                rpt.ServerReport.ReportServerCredentials = new ReportServerCredentials();
                rpt.ServerReport.ReportServerUrl = new System.Uri(url);
                string reportPath = "";
                reportPath = "/Reportes/ReportePartidasPruebas";
                rpt.ServerReport.ReportPath = reportPath;

                ReportParameter[] param = new ReportParameter[1];
                param[0] = new ReportParameter("par", par);
                rpt.ServerReport.SetParameters(param);

                while (rpt.ServerReport.IsDrillthroughReport)
                {
                    rpt.PerformBack();
                };
                Warning[] warnings;
                string[] streamIds;
                string mimeType = string.Empty;
                string encoding = string.Empty;
                string extension = string.Empty;
                bytes = rpt.ServerReport.Render("EXCELOPENXML", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            }
            catch (Exception ex)
            {
                string error = ex.Message;

            }
            return File(bytes, "application/ms-excel", "ReportePartida.xlsx");
        }

        //20190618
        //public string SaveTest_Anterior() // Guardar Pruebas de Laboratorio
        //{
        //    int rows = 0;
        //    string parHead = _.Post("par");
        //    parHead = _.addParameter(parHead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
        //    parHead = _.addParameter(parHead, "Asignador", "1");

        //    string parDetail = _.Post("parDetail");

        //    string idclienteerp = _.Post("idclienteerp");
        //    string idproveedor = _.Post("idproveedor");
        //    string idpartida = _.Post("idpartida");


        //    string status = _.Post("status");
        //    string statustono = _.Post("statustono");
        //    string reporte = _.Post("reportetecnico");
        //    string partida = _.Post("partida");



        //    string cliente = _.Post("cliente");
        //    string fabrica = _.Post("fabrica");
        //    string tipoprueba = _.Post("tipoprueba");

        //    string statusnombre = "";
        //    blMantenimiento oMantenimiento = new blMantenimiento();

        //    //rows = oMantenimiento.save_Row("uspPartidaPruebasGuardar", par, Util.Intranet);
        //    rows = oMantenimiento.save_Rows_Out("uspPartidaPruebasGuardar", parHead, Util.Intranet, parDetail);

        //    var usuario = _.GetUsuario().CodUsuario.Trim().ToLower();

        //    //rows = 0;
        //    if (rows > 0 && usuario == "laboratorio")
        //    {
        //        string parametro = idclienteerp + "," + idproveedor;


        //        string StatusFinal = "";

        //        if (status == "A") // Aprobado
        //        {
        //            switch (statustono)
        //            {
        //                case "No Aplica":
        //                    StatusFinal = "A";
        //                    break;
        //                case "Pendiente":
        //                    StatusFinal = "P";
        //                    break;
        //                case "Aprobado":
        //                    StatusFinal = "A";
        //                    break;
        //                case "Rechazado":
        //                    StatusFinal = "Z";
        //                    break;
        //            }
        //        }
        //        else if (status == "C") //Aprobado con comentario
        //        {
        //            switch (statustono)
        //            {
        //                case "No Aplica":
        //                    StatusFinal = "C";
        //                    break;
        //                case "Pendiente":
        //                    StatusFinal = "P";
        //                    break;
        //                case "Aprobado":
        //                    StatusFinal = "C";
        //                    break;
        //                case "Rechazado":
        //                    StatusFinal = "Z";
        //                    break;
        //            }
        //        }
        //        else if (status == "Z")
        //        {
        //            switch (statustono)
        //            {
        //                case "No Aplica":
        //                    StatusFinal = "Z";
        //                    break;
        //                case "Pendiente":
        //                    StatusFinal = "Z";
        //                    break;
        //                case "Aprobado":
        //                    StatusFinal = "Z";
        //                    break;
        //                case "Rechazado":
        //                    StatusFinal = "Z";
        //                    break;
        //            }
        //        }


        //        if (StatusFinal == "C" || StatusFinal == "Z" || StatusFinal == "A" || StatusFinal == "P")
        //        {
        //            /* correochange */
        //            string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
        //            string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
        //            string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

        //            string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
        //            string CorreoComercial = "1627749@utp.edu.pe";
        //            string CorreoFabrica = "mesadeayuda@wts.com.pe";

        //            if (StatusFinal == "C")
        //            {
        //                statusnombre = "APROBADO CON COMENTARIO";
        //            }
        //            else if (StatusFinal == "Z")
        //            {
        //                statusnombre = "RECHAZADO";
        //            }
        //            else if (StatusFinal == "P")
        //            {
        //                statusnombre = "PENDIENTE POR APROBACIÓN DEL CLIENTE";
        //            }
        //            else
        //            {
        //                statusnombre = "APROBADO";
        //            }

        //            //string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);
        //            string data = oMantenimiento.get_Data("usp_Laboratorio_Reporte_Email", idpartida, true, Util.Intranet);

        //            List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
        //            reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
        //            ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;


        //            string html = "Se adjunta Reporte Tecnico";

        //            if (oreporte != null)
        //            {
        //                html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
        //                //html = oreporte.Email_Body;
        //            }

        //            byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
        //            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
        //            string name_file = reporte + ".pdf";
        //            System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

        //            blMail oMail = new blMail();
        //            beMailSQL obeMail = new beMailSQL();
        //            obeMail.body = html;
        //            obeMail.codigo_usuario = "erp";
        //            obeMail.copiacorreo = CopiaCorreoLaboratorio;
        //            obeMail.correo_usuario = "erp@wts.com.pe";

        //            obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
        //            obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre + " / " + partida;
        //            obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

        //            if (obeMail.subject.Length > 250)
        //            {
        //                obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre;
        //            }

        //            obeMail.file_attachments = name_file; //EN PRE es distinta la ruta

        //            oMail.sendMailBandeja(obeMail);
        //        }

        //    }


        //    string mensaje = _.Mensaje("edit", rows > 0);
        //    return mensaje;
        //}

        //public string AprobarTono_Anterior() // Aprobar Tono, Jefas Comerciales
        //{
        //    int rows = -1;
        //    string idpartida = _.Post("idpartida");
        //    string idclienteerp = _.Post("idclienteerp");
        //    string idproveedor = _.Post("idproveedor");
        //    string comentariocolor = _.Post("comentariocolor");
        //    string status = _.Post("status");
        //    string estadotono = _.Post("estadotono");
        //    string usuario = _.GetUsuario().CodUsuario.Trim().ToLower();

        //    blMantenimiento oMantenimiento = new blMantenimiento();

        //    rows = oMantenimiento.save_Rows("uspPartidasAprobarTono", idpartida, Util.Intranet, usuario, comentariocolor, estadotono);

        //    if (rows > 0)
        //    {
        //        if (status != "R")
        //        {
        //            string parametro = idclienteerp + "," + idproveedor;

        //            string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

        //            List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
        //            reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
        //            ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;

        //            /* correochange */
        //            //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
        //            //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
        //            //string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

        //            string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
        //            string CorreoComercial = "1627749@utp.edu.pe";
        //            string CorreoFabrica = "mesadeayuda@wts.com.pe";

        //            string html = "Se adjunta Reporte Tecnico";

        //            string statuspartida = reportelst[0].StatusPartida;
        //            string statusnombre = "";

        //            if (statuspartida == "Approved with Comments")
        //            {
        //                statusnombre = "APROBADO CON COMENTARIO";

        //            }
        //            else if (statuspartida == "Approved")
        //            {
        //                statusnombre = "APROBADO";
        //            }
        //            else
        //            {
        //                statusnombre = "RECHAZADO";
        //            }

        //            if (oreporte != null)
        //            {
        //                html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
        //            }

        //            byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
        //            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
        //            string name_file = oreporte.ReporteTecnico + ".pdf";
        //            System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

        //            blMail oMail = new blMail();
        //            beMailSQL obeMail = new beMailSQL();
        //            obeMail.body = html;
        //            obeMail.codigo_usuario = "erp";
        //            obeMail.copiacorreo = CopiaCorreoLaboratorio;// ;laboratorio@wts.com.pe";
        //            obeMail.correo_usuario = "erp@wts.com.pe";
        //            obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
        //            obeMail.subject = "WTS-" + oreporte.NombreCliente + "-" + oreporte.NombreFabrica + "-" + oreporte.ReporteTecnico + "-" + statusnombre + " / " + oreporte.NumeroPartida;
        //            obeMail.copiacorreo_oculta = ConfigurationManager.AppSettings["copiaocultacorreoLaboratorio"].ToString();

        //            if (obeMail.subject.Length > 250)
        //            {
        //                obeMail.subject = "WTS-" + oreporte.NombreCliente + "-" + oreporte.NombreFabrica + "-" + "-" + oreporte.ReporteTecnico + "-" + statusnombre;

        //            }

        //            obeMail.file_attachments = name_file;

        //            oMail.sendMailBandeja(obeMail);
        //        }
        //    }

        //    string mensaje = _.Mensaje("edit", rows > 0);
        //    return mensaje;
        //}

        //public string AprobarPartidaRechazada_Anterior() //Consesionar Partida -Gerentes - ERP
        //{
        //    int rows = 0;

        //    string idpartida = _.Post("idpartida");
        //    string reportetecnico = _.Post("reportetecnico");
        //    string partida = _.Post("partida");
        //    string idclienteerp = _.Post("idclienteerp");
        //    string idproveedor = _.Post("idproveedor");
        //    string status = _.Post("status");
        //    string cliente = _.Post("cliente");
        //    string fabrica = _.Post("fabrica");

        //    string parametro = idpartida + "," + _.GetUsuario().CodUsuario.Trim().ToLower();

        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    rows = oMantenimiento.save_Row("uspPartidaAprobarComercial", parametro, Util.Intranet);

        //    if (rows > 0)
        //    {
        //        string parametroClienteFabrica = idclienteerp + "," + idproveedor;

        //        /* correochange */
        //        //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
        //        //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
        //        //string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

        //        string CopiaCorreoLaboratorio = "luis072591@wts.com.pe";
        //        string CorreoComercial = "1627749@utp.edu.pe";
        //        string CorreoFabrica = "mesadeayuda@wts.com.pe";

        //        string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

        //        List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
        //        reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
        //        ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;


        //        string html = "Se adjunta Reporte Tecnico";

        //        if (oreporte != null)
        //        {
        //            html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
        //        }

        //        byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
        //        string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
        //        string name_file = reportetecnico + ".pdf";
        //        System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

        //        blMail oMail = new blMail();
        //        beMailSQL obeMail = new beMailSQL();
        //        obeMail.body = html;
        //        obeMail.codigo_usuario = "erp";
        //        obeMail.copiacorreo = CopiaCorreoLaboratorio;// ;laboratorio@wts.com.pe";
        //        obeMail.correo_usuario = "erp@wts.com.pe";
        //        obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
        //        obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reportetecnico + "-" + "CONCESIONADO" + " / " + partida;


        //        if (obeMail.subject.Length > 250)
        //        {
        //            obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + "-" + reportetecnico + "-" + "CONCESIONADO";

        //        }

        //        obeMail.file_attachments = name_file;

        //        oMail.sendMailBandeja(obeMail);

        //    }

        //    string mensaje = _.Mensaje("edit", rows > 0);

        //    return mensaje;
        //}

        //public string Laboratorio_Consesionar_Inser_Anterior()
        //{
        //    string par = _.Post("par");
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string data = oMantenimiento.get_Data("usp_Laboratorio_Concesionar_Insert", par, true, Util.Intranet);

        //    if (data != "")
        //    {
        //        string resultado = data.Replace("[", "").Replace("]", "");
        //        string estado = _.Get_Par(resultado, "estado");

        //        if (estado == "success")
        //        {

        //            string idpartida = _.Get_Par(par, "cod_partida");
        //            string reportetecnico = _.Get_Par(par, "reportecnico");
        //            string partida = _.Get_Par(par, "partida");
        //            string idclienteerp = _.Get_Par(par, "idclienteerp");
        //            string idproveedor = _.Get_Par(par, "idproveedor");
        //            string status = _.Get_Par(par, "status");
        //            string cliente = _.Get_Par(par, "cliente");
        //            string fabrica = _.Get_Par(par, "fabrica");

        //            string datacorreo = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

        //            string parametroClienteFabrica = idclienteerp + "," + idproveedor;

        //            /* correochange */
        //            //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString();
        //            //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
        //            //string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametroClienteFabrica, false, Util.ERP);

        //            string CopiaCorreoLaboratorio = "lrojas@wts.com.pe";
        //            string CorreoComercial = "1627749@utp.edu.pe";
        //            string CorreoFabrica = "mesadeayuda@wts.com.pe";

        //            List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
        //            reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(datacorreo);
        //            ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;

        //            string html = "Se adjunta Reporte Tecnico";

        //            if (oreporte != null) { html = oreporte.Email_Body; }

        //            byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
        //            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
        //            string name_file = reportetecnico + ".pdf";
        //            System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

        //            blMail oMail = new blMail();
        //            beMailSQL obeMail = new beMailSQL();
        //            obeMail.body = html;
        //            obeMail.codigo_usuario = "erp";
        //            obeMail.copiacorreo = CopiaCorreoLaboratorio;
        //            obeMail.correo_usuario = "erp@wts.com.pe";
        //            obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;


        //            obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reportetecnico + "-" + "CONCESIONADO" + " / " + partida;

        //            if (obeMail.subject.Length > 250)
        //            {
        //                obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + "-" + reportetecnico + "-" + "CONCESIONADO";
        //            }

        //            obeMail.file_attachments = name_file;

        //            oMail.sendMailBandeja(obeMail);

        //        }
        //    }
        //    return data != "" ? data : string.Empty;


        //}

        /*
     public string SaveTest()
     {
         int rows = 0;
         string par = _.Post("par");
         string status = _.Post("status");
         string statustono = _.Post("statustono");
         string reporte = _.Post("reportetecnico");
         string partida = _.Post("partida");
         string idclienteerp = _.Post("idclienteerp");
         string idproveedor = _.Post("idproveedor");
         string idpartida = _.Post("idpartida");
         string cliente = _.Post("cliente");
         string fabrica = _.Post("fabrica");
         string tipoprueba = _.Post("tipoprueba");

         string statusnombre = "";

         blMantenimiento oMantenimiento = new blMantenimiento();
         rows = oMantenimiento.save_Row("uspPartidaPruebasGuardar", par, Util.Intranet);

         var usuario = _.GetUsuario().CodUsuario.Trim().ToLower();

         //rows = 0;
         if (rows > 0 && usuario == "laboratorio")
         {
             string parametro = idclienteerp + "," + idproveedor;


             string StatusFinal = "";

             if (status == "A") // Aprobado
             {
                 switch (statustono)
                 {
                     case "Pendiente":
                         StatusFinal = "P";
                         break;
                     case "Aprobado":
                         StatusFinal = "A";
                         break;
                     case "Rechazado":
                         StatusFinal = "Z";
                         break;
                 }
             }
             else if (status == "C") //Aprobado con comentario
             {
                 switch (statustono)
                 {
                     case "Pendiente":
                         StatusFinal = "P";
                         break;
                     case "Aprobado":
                         StatusFinal = "C";
                         break;
                     case "Rechazado":
                         StatusFinal = "Z";
                         break;
                 }
             }
             else if (status == "Z")
             {
                 switch (statustono)
                 {
                     case "Pendiente":
                         StatusFinal = "Z";
                         break;
                     case "Aprobado":
                         StatusFinal = "Z";
                         break;
                     case "Rechazado":
                         StatusFinal = "Z";
                         break;
                 }
             }
             else if (status == "P")
             {
                 StatusFinal = "P";
             }

             if (StatusFinal == "P")
             {
                 //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
                 //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);

                 string CopiaCorreoLaboratorio = "lrojas@wts.com.pe";
                 string CorreoComercial = "1627749@utp.edu.pe";

                 string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

                 List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                 reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                 ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;


                 string html = "Se adjunta Reporte Tecnico";

                 if (oreporte != null)
                 {
                     html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
                 }


                 statusnombre = "PENDIENTE POR APROBACIÓN DEL CLIENTE";

                 byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                 string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                 string name_file = reporte + ".pdf";
                 System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                 blMail oMail = new blMail();
                 beMailSQL obeMail = new beMailSQL();
                 obeMail.body = html; // "Se adjunta el reporte tecnico";
                 obeMail.codigo_usuario = "erp";
                 obeMail.copiacorreo = CopiaCorreoLaboratorio;
                 obeMail.correo_usuario = "erp@wts.com.pe";
                 obeMail.to_address = CorreoComercial;
                 obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre + " / " + partida;

                 if (obeMail.subject.Length > 250)
                 {
                     obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre;
                 }

                 obeMail.file_attachments = name_file;

                 oMail.sendMailBandeja(obeMail);


             }
             else if (StatusFinal == "C" || StatusFinal == "Z" || StatusFinal == "A")
             {

                 //string CopiaCorreoLaboratorio = ConfigurationManager.AppSettings["copiacorreoLaboratorio"].ToString(); //laboratorio , melania 
                 //string CorreoComercial = oMantenimiento.get_Data("uspGrupoPersonalObtenerCorreosPorIdCliente", idclienteerp, false, Util.ERP);
                 //string CorreoFabrica = oMantenimiento.get_Data("uspGrupoCorreoObtenerPorClienteyProveedorParaLab", parametro, false, Util.ERP);

                 string CopiaCorreoLaboratorio = "lrojas@wts.com.pe";
                 string CorreoComercial = "1627749@utp.edu.pe";
                 string CorreoFabrica = "mesadeayuda@wts.com.pe";

                 if (StatusFinal == "C")
                 {
                     statusnombre = "APROBADO CON COMENTARIO";
                 }
                 else if (StatusFinal == "Z")
                 {
                     statusnombre = "RECHAZADO";
                 }
                 else if (StatusFinal == "P")
                 {
                     statusnombre = "PENDIENTE POR APROBACIÓN DEL CLIENTE";
                 }
                 else
                 {
                     statusnombre = "APROBADO";
                 }

                 string data = oMantenimiento.get_Data("uspPartidaReporteCorreo", idpartida, true, Util.Intranet);

                 List<ReporteLaboratorio> reportelst = new List<ReporteLaboratorio>();
                 reportelst = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                 ReporteLaboratorio oreporte = (reportelst != null) ? reportelst[0] : null;


                 string html = "Se adjunta Reporte Tecnico";

                 if (oreporte != null)
                 {
                     html = "<table border='1' cellpadding='10'><tr><td>Reporte</td><td>Cliente</td><td>Fabrica</td><td>Partida</td><td>Color</td><td>Status</td><td>PO</td><td>Estilos</td></tr><tr><td>" + oreporte.ReporteTecnico + "</td><td>" + oreporte.NombreCliente + "</td><td>" + oreporte.NombreFabrica + "</td><td>" + oreporte.NumeroPartida + "</td><td>" + oreporte.NombreColor + "</td><td>" + oreporte.StatusPartida + "</td><td>" + oreporte.POS + "</td><td>" + oreporte.Estilos + "</td></tr></table>";
                 }

                 byte[] archivo_byte = GetPartidaPDF_byte(int.Parse(idpartida));
                 string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
                 string name_file = reporte + ".pdf";
                 System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, name_file), archivo_byte);

                 blMail oMail = new blMail();
                 beMailSQL obeMail = new beMailSQL();
                 obeMail.body = html;
                 obeMail.codigo_usuario = "erp";
                 obeMail.copiacorreo = CopiaCorreoLaboratorio;
                 obeMail.correo_usuario = "erp@wts.com.pe";

                 if (tipoprueba == "gi")
                 {
                     //obeMail.copiacorreo = CopiaCorreoLaboratorio + ";" + "mcarrion@wts.com.pe";
                     obeMail.copiacorreo = CopiaCorreoLaboratorio;
                     obeMail.to_address = CorreoComercial;
                 }
                 else
                 {
                     obeMail.to_address = CorreoComercial + ";" + CorreoFabrica;
                 }



                 obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre + " / " + partida;

                 if (obeMail.subject.Length > 250)
                 {
                     obeMail.subject = "WTS-" + cliente + "-" + fabrica + "-" + reporte + "-" + statusnombre;
                 }

                 obeMail.file_attachments = name_file;

                 oMail.sendMailBandeja(obeMail);
             }

         }


         string mensaje = _.Mensaje("edit", rows > 0);
         return mensaje;
     }
     */
    }
}