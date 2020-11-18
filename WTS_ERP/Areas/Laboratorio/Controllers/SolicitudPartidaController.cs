using System;
using System.Collections.Generic;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;
using BE_ERP;
using BE_ERP.Laboratorio;
using Utilitario;
using System.Threading;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Script.Serialization;
using BL_ERP.Laboratorio;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;

namespace WTS_ERP.Areas.Laboratorio.Controllers
{
    public class SolicitudPartidaController : Controller
    {
        blLog logError = new blLog();
        EnvioCorreo utilEnvioCorreo = new EnvioCorreo();
        blPartida partida_bl = new blPartida();
        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _EditPartida()
        {
            return View();
        }

        public ActionResult _BuscarTela()
        {
            return View();
        }

        public ActionResult _BuscarEstilo()
        {
            return View();
        }

        public ActionResult _ViewMateriaPrima_Hilado()
        {
            return View();
        }

        public ActionResult _NewHilado()
        {
            return View();
        }

        public ActionResult _Aprobar_Rechazar_SolicitudPartida()
        {
            return View();
        }

        public ActionResult _BusquedaAvanzadaEstados()
        {
            return View();
        }

        public ActionResult _BuscarSolicitudPartida_Po()
        {
            return View();
        }

        [AccessSecurity]
        public string getDataSolicitud()
        {
            string par = _.Get("par");
            blMantenimiento omantenimiento = new blMantenimiento();
            beUser oUsuario = _.GetUsuario();
            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "nombreperfil", oUsuario.PerfilesNombres);
            // uspLaboratorioSolicitudPartidaBuscar_index_EDUELIMINAR
            string data = omantenimiento.get_Data("uspLaboratorioSolicitudPartidaBuscar_index", par, true, Util.ERP);
            data = _.addParameter(data, "perfil", oUsuario.PerfilesNombres.ToString(), true);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getDataSolicitudbyId()
        {
            string par = _.Get("par");
            blMantenimiento omantenimiento = new blMantenimiento();
            beUser oUsuario = _.GetUsuario();
            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            string perfil = oUsuario.PerfilesNombres;
            /// usp_LaboratorioSolicitudPartida_view_EDUELIMINAR
            string data = omantenimiento.get_Data("usp_LaboratorioSolicitudPartida_view", par, false, Util.ERP); // ANTES ERA FALSE
            data = _.addParameter(data, "perfil", perfil,true);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getDataSolicitud_Respuesta()
        {
            blMantenimiento omantenimiento = new blMantenimiento();
            string par = _.Get("par");
            beUser oUsuario = _.GetUsuario();
            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "idfabrica", oUsuario.IdProveedor.ToString());
            par = _.addParameter(par, "idgrupocomercial", oUsuario.IdGrupoComercial.ToString());
            string perfil = _.GetUsuario().PerfilesNombres;
            // usp_LaboratorioSolicitudPartida_respuesta_EDUELIMINAR
            string data = omantenimiento.get_Data("usp_LaboratorioSolicitudPartida_respuesta", par, true, Util.ERP);
            data = _.addParameter(data, "perfil", perfil, true);
            return data != null ? data : string.Empty;
        }

        /*Carga Nuevo*/
        [AccessSecurity]
        public string getDataNuevaSolicitud()
        {
            blMantenimiento omantenimiento = new blMantenimiento();
            string par = _.Get("par");
            beUser oUsuario = _.GetUsuario();

            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "idfabrica", oUsuario.IdProveedor.ToString());
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial.ToString());
            string data = omantenimiento.get_Data("usp_GetDataNewSolicitudPartida", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getDataEditSolicitud()
        {
            string par = _.Get("par");
            blMantenimiento omantenimiento = new blMantenimiento();
            beUser oUsuario = _.GetUsuario();
            
            par = _.addParameter(par, "idusuario", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "idfabrica", oUsuario.IdProveedor.ToString());
            par = _.addParameter(par, "idgrupocomercial", oUsuario.IdGrupoComercial.ToString());
            string data = omantenimiento.get_Data("usp_GetDataEditarSolicitudPartida", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getData_telas_buscar()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetTelasBuscar_ByFamilia_CSV", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string getData_estilos_buscar()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetEstilosBuscar_ByIdCliente_CSV", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [AccessSecurity]
        public string save_new_solicitudpartida()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser oUsuario = _.GetUsuario();

            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");

            par = _.addParameter(par, "idusuariosolicitante", oUsuario.IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", oUsuario.IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", oUsuario.Usuario);

            int id = bl.save_Rows_Out("usp_SolicitudPartida_Insert", par, Util.ERP, pardetail, parsubdetail, parfoot, parsubfoot);
            string mensaje = _.Mensaje("new", id > 0, null, id);
            return mensaje;
        }

        [AccessSecurity]
        public string save_edit_solicitudpartida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuariosolicitante", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");
            
            int id = bl.save_Rows_Out("usp_SolicitudPartida_Update", par, Util.ERP, pardetail, parsubdetail, parfoot, parsubfoot);
            string mensaje = _.Mensaje("edit", id > 0, null, id);
            return mensaje;
        }

        [AccessSecurity]
        public string getData_viewMateriaprima_hilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetDataModalMateriaPrima_View", par, false, Util.ERP);
            return data;
        }

        [AccessSecurity]
        public string getData_newhilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_GetDataModalMateriaPrima_New", "", true, Util.ERP);
            return data;
        }

        [AccessSecurity]
        public string save_new_hilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string detail = _.Post("pardetail");
            int id = bl.save_Rows_Out("usp_GrabarHiladoFromLaboratorio", par, Util.ERP, detail);
            string mensaje = _.Mensaje("new", id > 0, bl.get_Data("usp_GetHiladoCSV", "", false, Util.ERP), id);
            return mensaje;
        }

        [AccessSecurity]
        public string validarsiexistehilado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_ValidarSiExisteHilado", par, false, Util.ERP);
            return data;
        }

        [AccessSecurity]
        public string cambiar_estado_solicitudpartida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            string idsolicitudpartida = _.Get_Par(par, "idsolicitudpartida");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int nrows = bl.save_Rows("usp_CambiarEstadoSolicitudPartida_CSV", par, Util.ERP);
            string mensaje = _.Mensaje("edit", nrows > 0, bl.get_Data("usp_GetData_SolicitudPartidaById_JSON", idsolicitudpartida, false, Util.ERP), nrows);
            return mensaje;
        }

        [AccessSecurity]
        public JsonResult EnviarCorreo(int idsolicitudpartida, string estado)
        {
            blMantenimiento bl = new blMantenimiento();
            JsonResponse response = new JsonResponse();
            AsyncManager.OutstandingOperations.Increment();
            FileMailAttachment fileattachment = new FileMailAttachment();
            
            try
            {
                string data = bl.get_Data("usp_GetData_SolicitudPartidaById_JSON", idsolicitudpartida.ToString(), false, Util.ERP);

                List<SolicitudPartida> lista = new List<SolicitudPartida>();
                lista = JsonConvert.DeserializeObject<List<SolicitudPartida>>(data);

                beCorreo data_send_correo = GetDatosCorreoByEstado(lista[0], estado);
                ThreadPool.QueueUserWorkItem((s) =>
                {
                    utilEnvioCorreo.EnviarCorreo(data_send_correo.asunto, data_send_correo.correo_to, data_send_correo.correo_cc, data_send_correo.correo_bcc, data_send_correo.cuerpo, null, true, data_send_correo.correo_from);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                response.Success = true;
                response.Data = 1;
                response.Message = "Mail successfully sent.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Data = 0;
                response.Message = "Mail could not be sent: " + ex.ToString();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [AccessSecurity]
        private beCorreo GetDatosCorreoByEstado(SolicitudPartida pSolicitudPartida, string estado)
        {
            beUser oUser = _.GetUsuario();
            string[] arrPerfiles = oUser.PerfilesNombres.Split(',');
            string nobreperfil = arrPerfiles[0];

            JObject aparametro = new JObject();
            aparametro.Add("accion", estado);  // pSolicitudPartida.estado
            aparametro.Add("idusuario", oUser.IdUsuario);
            aparametro.Add("idcliente", pSolicitudPartida.idcliente);
            aparametro.Add("idsolicitudpartida", pSolicitudPartida.idsolicitudpartida);
            aparametro.Add("nombreperfil", nobreperfil);
            
            blMantenimiento bl = new blMantenimiento();
            string str_datacorreo = bl.get_Data("usp_GetCorreosByEstados_Laboratorio_entity", aparametro.ToString(), false, Util.ERP);

            beCorreo odatacorreo = new beCorreo();
            odatacorreo = JsonConvert.DeserializeObject<List<beCorreo>>(str_datacorreo)[0];

            string asunto = string.Empty;
            string cuerpo = string.Empty;
            if (estado != FuncionesConstantesEnumeradores.Finished)
            {
                asunto = String.Format("{0} - {1} - {2}", pSolicitudPartida.codigo, pSolicitudPartida.nombreproveedor, pSolicitudPartida.descripciontela);
                cuerpo = String.Format("El usuario {0} {1} </br> {2} </br></br>Por favor revise su bandeja.", oUser.NombreCompleto, getMensajeCorreo(estado), pSolicitudPartida.descripciontela);
            }
            else {
                string asunto_adicional = pSolicitudPartida.reportetecnico + " " + pSolicitudPartida.nombre_estado;
                asunto = String.Format("{0} - {1} - {2} - {3}", asunto_adicional, pSolicitudPartida.codigo , pSolicitudPartida.nombreproveedor, pSolicitudPartida.descripciontela);
                cuerpo = String.Format("El usuario {0} {1} </br> {2} </br></br> {3} </br></br>Por favor revise su bandeja.", oUser.NombreCompleto, getMensajeCorreo(estado), pSolicitudPartida.descripciontela, GetCadenaAdicional_AlFinalizarLaPartida(pSolicitudPartida));
            }
            
            string correo_to = string.IsNullOrEmpty(odatacorreo.correo_to) ? odatacorreo.correo_cc : odatacorreo.correo_to;
            string correo_cc = string.IsNullOrEmpty(odatacorreo.correo_to) ? string.Empty : odatacorreo.correo_cc;

            //// NOTA: FALTA COMPLETAR PARA AGREGAR EL ADJUNTO DE ARCHIVO DE REPORTE TECNICO
            beCorreo oDatosCorreoReturn = new beCorreo
            {
                asunto = asunto,
                correo_to = string.IsNullOrEmpty(odatacorreo.correo_to) ? odatacorreo.correo_cc : odatacorreo.correo_to,
                correo_cc = string.IsNullOrEmpty(odatacorreo.correo_to) ? string.Empty : odatacorreo.correo_cc,
                cuerpo = cuerpo
            };
            return oDatosCorreoReturn;
        }
        [AccessSecurity]
        public string getData_combosIndex_BusquedaAvanzada()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "idfabrica", _.GetUsuario().IdProveedor.ToString());
            string data = bl.get_Data("usp_GetCombosIndexBusquedaAvanzadaSolPartida", par, true, Util.ERP);
            return data;
        }
        [AccessSecurity]
        public string getData_buscarpocliente_load()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetBuscarPo_solicitudpartida_Load_CSV", par, true, Util.ERP);
            return data;
        }

        [AccessSecurity]
        private string getMensajeCorreo(string estado)
    {
            string titulo = string.Empty;

            if (estado == FuncionesConstantesEnumeradores.Sent)
            {
                titulo = " ha enviado una solicitud de partida";
            }
            else if (estado == FuncionesConstantesEnumeradores.Received)
            {
                titulo = " ha recibido la solicitud de partida.";
            }
            else if (estado == FuncionesConstantesEnumeradores.Approved)
            {
                titulo = " ha aprobado la solicitud de partida.";
            }
            else if (estado == FuncionesConstantesEnumeradores.Rejected)
            {
                titulo = " ha rechazado la solicitud de partida.";
            }
            else if (estado == FuncionesConstantesEnumeradores.Finished) {
                titulo = " ha finalizado la solicitud de partida.";
            }
            else
            {
                titulo = "";
            }
            return titulo;
        }

        public string IniciarPartida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int id = bl.save_Rows_Out("usp_Save_New_Partida_JSON", par, Util.ERP);
            string mensaje = _.Mensaje("new", id > 0, null, id);
            return mensaje;
        }

        private string GetCadenaAdicional_AlFinalizarLaPartida(SolicitudPartida pSolicitudPartida)
        {
            string color = "";
            if (pSolicitudPartida.nombre_estado.ToUpper() == "REJECT")
            {
                color = "Red";
            }
            else if (pSolicitudPartida.nombre_estado.ToUpper() == "APPROVED")
            {
                color = "Blue";
            }
            else {
                color = "Orange";
            }

            string mensajeCorreoPartidaFinalizada_Cuerpo = pSolicitudPartida.reportetecnico + " " + "<font color= '" + color + "'>" + pSolicitudPartida.nombre_estado + "</font>";
            return mensajeCorreoPartidaFinalizada_Cuerpo;
        }

        public string FinalizarSinCodigoTela()
        {
            
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            
            int nrows = bl.save_Rows_Out("usp_FinalizarPartidaSinCodigoTela_JSON", par, Util.ERP);
            string mensaje = string.Empty;
            if (nrows > 0) {
                
                AsyncManager.OutstandingOperations.Increment();
                // MANDAR CORREO
                int idpartida = int.Parse(_.Get_Par(par, "idpartida"));
                string data_partida = bl.get_Data("usp_GetPartidaById_JSON", idpartida.ToString(), false, Util.ERP);

                List<SolicitudPartida> lista = new List<SolicitudPartida>();
                lista = JsonConvert.DeserializeObject<List<SolicitudPartida>>(data_partida);

                beCorreo data_send_correo = GetDatosCorreoByEstado(lista[0], FuncionesConstantesEnumeradores.Finished);

                /* INICIO ADJUNTAR ARCHIVO PARTIDA*/
                #region ADJUNTAR ARCHIVO PARTIDA
                FileMailAttachment fileattachment = new FileMailAttachment();
                List<FileMailAttachment> listafileattachment = new List<FileMailAttachment>();

                byte[] pdfbyte = new byte[0];
                string data = partida_bl.Bl_GetData_ReportePartida(idpartida);

                List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
                reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

                List<SolicitudPartida> lstsolicitudpartida = new List<SolicitudPartida>();
                lstsolicitudpartida = JsonConvert.DeserializeObject<List<SolicitudPartida>>(oreporte.dataPartida);
                string nombrePDF = lstsolicitudpartida[0].reportetecnico + ".pdf";

                //// PARA EL NOMBRE DEL REPORTE
                pdfbyte = partida_bl.CrearPdf_Partida(oreporte); //CrearPdf_Partida(oreporte);

                fileattachment = new FileMailAttachment();
                fileattachment.NombreArchivo = nombrePDF;
                fileattachment.Archivo = pdfbyte;
                listafileattachment.Add(fileattachment);
                #endregion
                /* FIN ADJUNTAR ARCHIVO PARTIDA*/

                ThreadPool.QueueUserWorkItem((s) =>
                {
                    utilEnvioCorreo.EnviarCorreo(data_send_correo.asunto, data_send_correo.correo_to, data_send_correo.correo_cc, data_send_correo.correo_bcc, data_send_correo.cuerpo, listafileattachment, true, data_send_correo.correo_from);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                mensaje = _.Mensaje("edit", nrows > 0, data_partida, idpartida);
            
            }

            return mensaje;
        }

        public string FinalizarConCodigoTela()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", string.Empty);
            par = _.addParameter(par, "hostname", string.Empty);

            int nrows = bl.save_Rows_Out("usp_FinalizarPartidaConCodigoTela_JSON", par, Util.ERP);
            string mensaje = string.Empty;
            if (nrows > 0)
            {

                AsyncManager.OutstandingOperations.Increment();
                // MANDAR CORREO
                int idpartida = int.Parse(_.Get_Par(par, "idpartida"));
                string data_partida = bl.get_Data("usp_GetPartidaById_JSON", idpartida.ToString(), false, Util.ERP);

                List<SolicitudPartida> lista = new List<SolicitudPartida>();
                lista = JsonConvert.DeserializeObject<List<SolicitudPartida>>(data_partida);

                beCorreo data_send_correo = GetDatosCorreoByEstado(lista[0], FuncionesConstantesEnumeradores.Finished);

                /* INICIO ADJUNTAR ARCHIVO PARTIDA*/
                #region ADJUNTAR ARCHIVO PARTIDA
                FileMailAttachment fileattachment = new FileMailAttachment();
                List<FileMailAttachment> listafileattachment = new List<FileMailAttachment>();

                byte[] pdfbyte = new byte[0];
                string data = partida_bl.Bl_GetData_ReportePartida(idpartida);

                List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
                reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

                List<SolicitudPartida> lstsolicitudpartida = new List<SolicitudPartida>();
                lstsolicitudpartida = JsonConvert.DeserializeObject<List<SolicitudPartida>>(oreporte.dataPartida);
                string nombrePDF = lstsolicitudpartida[0].reportetecnico + ".pdf";

                //// PARA EL NOMBRE DEL REPORTE
                pdfbyte = partida_bl.CrearPdf_Partida(oreporte); //CrearPdf_Partida(oreporte);
                
                fileattachment = new FileMailAttachment();
                fileattachment.NombreArchivo = nombrePDF;
                fileattachment.Archivo = pdfbyte;
                listafileattachment.Add(fileattachment);
                #endregion
                /* FIN ADJUNTAR ARCHIVO PARTIDA*/

                ThreadPool.QueueUserWorkItem((s) =>
                {
                    utilEnvioCorreo.EnviarCorreo(data_send_correo.asunto, data_send_correo.correo_to, data_send_correo.correo_cc, data_send_correo.correo_bcc, data_send_correo.cuerpo, listafileattachment, true, data_send_correo.correo_from);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                mensaje = _.Mensaje("edit", nrows > 0, data_partida, idpartida);

            }

            return mensaje;
        }

        public string FinalizarEnEstadoPendiente()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);

            int nrows = bl.save_Rows_Out("usp_FinalizarPartidaEnEstadoPendiente_JSON", par, Util.ERP);
            string mensaje = string.Empty;
            if (nrows > 0)
            {
                int idpartida = int.Parse(_.Get_Par(par, "idpartida"));
                string data_partida = bl.get_Data("usp_GetPartidaById_JSON", idpartida.ToString(), false, Util.ERP);

                List<SolicitudPartida> lista = new List<SolicitudPartida>();
                lista = JsonConvert.DeserializeObject<List<SolicitudPartida>>(data_partida);
                beCorreo data_send_correo = GetDatosCorreoByEstado(lista[0], FuncionesConstantesEnumeradores.Finished);

                AsyncManager.OutstandingOperations.Increment();
                /* INICIO ADJUNTAR ARCHIVO PARTIDA*/
                #region ADJUNTAR ARCHIVO PARTIDA
                FileMailAttachment fileattachment = new FileMailAttachment();
                List<FileMailAttachment> listafileattachment = new List<FileMailAttachment>();

                byte[] pdfbyte = new byte[0];
                string data = partida_bl.Bl_GetData_ReportePartida(idpartida);

                List<ReporteLaboratorio> reporte = new List<ReporteLaboratorio>();
                reporte = JsonConvert.DeserializeObject<List<ReporteLaboratorio>>(data);
                ReporteLaboratorio oreporte = (reporte != null) ? reporte[0] : null;

                List<SolicitudPartida> lstsolicitudpartida = new List<SolicitudPartida>();
                lstsolicitudpartida = JsonConvert.DeserializeObject<List<SolicitudPartida>>(oreporte.dataPartida);
                string nombrePDF = lstsolicitudpartida[0].reportetecnico + ".pdf";

                //// PARA EL NOMBRE DEL REPORTE
                pdfbyte = partida_bl.CrearPdf_Partida(oreporte); //CrearPdf_Partida(oreporte);

                fileattachment = new FileMailAttachment();
                fileattachment.NombreArchivo = nombrePDF;
                fileattachment.Archivo = pdfbyte;
                listafileattachment.Add(fileattachment);
                #endregion
                /* FIN ADJUNTAR ARCHIVO PARTIDA*/
                ThreadPool.QueueUserWorkItem((s) =>
                {
                    utilEnvioCorreo.EnviarCorreo(data_send_correo.asunto, data_send_correo.correo_to, data_send_correo.correo_cc, data_send_correo.correo_bcc, data_send_correo.cuerpo, listafileattachment, true, data_send_correo.correo_from);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                mensaje = _.Mensaje("edit", idpartida > 0, data_partida, idpartida);
            }

            return mensaje;
        }

        public string Get_solicitudCodigoTela_workflow() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetSolicitudServicioFromOrigenWorkflowByIdSolicitudPartida_JSON", par, false, Util.ERP);
            return data;
        }

        public JsonResult EnviarCorreo_SolicitudCodigoTelaPo()
        {
            string par = _.Get("par");
            int pIdSolicitud = int.Parse(_.Get_Par(par, "idsolicitud"));
            int pIdServicio = int.Parse(_.Get_Par(par, "idservicio"));
            int pOrigen = int.Parse(_.Get_Par(par, "origen"));
            int pIdUsuarioEdita = _.GetUsuario().IdUsuario;

            JsonResponse response = new JsonResponse();
            blPartida oblPartida = new blPartida();
            NotificadorCorreoWorkflow oblNotiCorreoWorkflow = new NotificadorCorreoWorkflow();

            int ndestino = oblPartida.DevolverDestino(pIdSolicitud, pOrigen, Util.ERP);
            beCorreo oCorreo = oblPartida.Correos(pIdSolicitud, pIdServicio, pOrigen, ndestino, Util.ERP);
            
            try
            {
                AsyncManager.OutstandingOperations.Increment();
                if (ndestino != 0)
                {
                    string cEnvio = "";
                    string cCopia = "";
                    string cTitulo = "";
                    string cCuerpo = "";
                    if (oCorreo != null)
                    {
                        beUser oPersonal = oblPartida.DatosPersonal(pIdUsuarioEdita, Util.ERP);
                        string nombrepersonal = oPersonal.NombrePersonal;

                        oblNotiCorreoWorkflow.CrearMensaje(pOrigen, ndestino, pIdSolicitud, oCorreo.nombre_servicio, nombrepersonal);
                        cTitulo = oblNotiCorreoWorkflow.DevolverDiccionario("Titulo");  // ASUNTO
                        cCuerpo = oblNotiCorreoWorkflow.DevolverDiccionario("Cuerpo");
                        cEnvio = oCorreo.correo;
                        cCopia = oCorreo.correo_cc;

                        ThreadPool.QueueUserWorkItem((s) =>
                        {
                            utilEnvioCorreo.EnviarCorreo(cTitulo, cEnvio, cCopia, "", cCuerpo, null, true);
                            AsyncManager.OutstandingOperations.Decrement();
                        }, null);

                        response.Success = true;
                        response.Data = 1;
                        response.Message = "Se ha enviado el correo de solicitud de codigo de tela po.\n Solicitud: #" + pIdSolicitud.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Data = 0;
                response.Message = "Mail could not be sent: " + ex.ToString();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        
    }

    
}