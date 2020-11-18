using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using BE_ERP;
using Newtonsoft.Json.Linq;
using System.IO;
using Newtonsoft.Json;
using System.Configuration;
using WTS_ERP.Areas.DesarrolloTextil.Models;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class SolicitudDesarrolloTelaController : Controller
    {
        // GET: DesarrolloTextil/SolicitudDesarrolloTela

        public ActionResult IndexSDT() {  // SDT = SOLICITUDDERARROLLOTELA
            return View();
        }
        public ActionResult NewSDT()
        {
            return View();
        }

        public ActionResult _AprobarSDT()
        {
            return View();
        }

        public ActionResult ValidacionAprobacion()
        {
            return View();
        }

        public ActionResult _BuscarDesarrolloReferenciaComplemento()
        {
            return View();
        }

        public ActionResult _EnviarCorreoFabricaSolicitudDesarrollotela()
        {
            return View();
        }

        public ActionResult _PreguntarAntesCrearNuevoComplemento()
        {
            return View();
        }

        public ActionResult _BuscarAtx()
        {
            return View();
        }

        public ActionResult _TerminarProcesoLeadTime()
        {
            return View();
        }

        public ActionResult _BuscarProyecto()
        {
            return View();
        }

        public ActionResult ConformeRecibidoFabricaSolicitudDesarrollo(string idsolicituddetalledesarrollotela)
        {
            string par = "";
            //string idDecodificado = Utilitario.Utils.DeCodificar(idsolicituddetalledesarrollotela);
            par = "idsolicituddetalledesarrollotela:" + idsolicituddetalledesarrollotela;

            ViewBag.par = par;

            return View();
        }

        public ActionResult ConformeRecibidoComercialLeadTime(string idsolicituddetalledesarrollotela)
        {
            string par = "";
            //string idDecodificado = Utilitario.Utils.DeCodificar(idsolicituddetalledesarrollotela);
            par = "idsolicituddetalledesarrollotela:" + idsolicituddetalledesarrollotela;

            ViewBag.par = par;

            return View();
        }

        public ActionResult ConformeRecibidoComercialSolicitudAtxMuestraFisica(string idsolicituddetalledesarrollotela, string idanalisistextilsolicitud)
        {
            string par = "";
            par = "idsolicituddetalledesarrollotela:" + idsolicituddetalledesarrollotela + ",idanalisistextilsolicitud:" + idanalisistextilsolicitud;

            ViewBag.par = par;

            return View();
        }

        public string GetDataAprobar()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_SolicitudDesarrolloTela_getdataaprobar_csv", par, true, Util.ERP);
            return data;
        }

        public string AprobarSDT() {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            //
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int rows = oMantenimiento.save_Rows("usp_SolicitudDesarrolloTela_aprobarsolicitud_csv", par, Util.ERP, pardetalle);

            string mensaje = _.Mensaje("new", rows > 0, null, rows);
            return mensaje;
        }

        public string GetDataNew()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("Usp_SolicitudDesarrolloTela_get_csv", par, true, Util.ERP);
            return data;
        }

        public string Getdataatx()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("Usp_SolicitudDesarrolloTela_getatx_csv", par, true, Util.ERP);
            return data;
        }

        public string Getdataedit()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_SolicitudDesarrolloTelaedit_atx_Get", par, true, Util.ERP);
            return data;
        }

        public string Save_New()
        {
            JArray jarr_file_grabar = new JArray();
            string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();

            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");

            //
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();

            Random aleatorio = new Random();
            JArray jarr_file = JArray.Parse(parfoot) as JArray;
            var arrfile = jarr_file.ToArray();
            foreach (string item in Request.Files)
            {
                var file = Request.Files[item];
                MemoryStream memory = new MemoryStream();
                string nombrearchivooriginal = System.IO.Path.GetFileName(file.FileName);
                string extension = System.IO.Path.GetExtension(file.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);

                string comentario_file = string.Empty;
                for (int i = 0; i < arrfile.Count(); i++)
                {
                    if (nombrearchivooriginal == arrfile[i]["nombrearchivooriginal"].ToString()) {
                        comentario_file = arrfile[i]["comentario"].ToString();
                        break;
                    }
                }

                JObject objfile = new JObject();
                objfile.Add("nombrearchivooriginal", nombrearchivooriginal);
                objfile.Add("nombrearchivogenerado", nombrearchivogenerado);
                objfile.Add("comentario", comentario_file);

                file.InputStream.CopyTo(memory);
                byte[] bfile = memory.ToArray();
                string rutafile = @Ruta + "erp/textileanalysis/SolicitudDesarrolloTela/" + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(rutafile, bfile);
                jarr_file_grabar.Add(objfile);
            }

            parfoot = "";
            parfoot = JsonConvert.SerializeObject(jarr_file_grabar);

            int id = oMantenimiento.save_Rows_Out("usp_SolicitudDesarrolloTela_insert_csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            //// ACTIVAR EL QUE DICE _TEMPORAL SOLO PARA EL MOCKUP DE SWATCH
            ////int id = oMantenimiento.save_Rows_Out("usp_SolicitudDesarrolloTela_insert_csv_TEMPORAL", par, Util.ERP, pardetalle, parsubdetail, parfoot);

            string mensaje = _.Mensaje("new", id > 0, null, id);
            return mensaje;
        }

        public string Save_Update()
        {
            JArray jarr_file_grabar = new JArray();
            string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            //string parsubfoot = _.Post("parsubfoot");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            Random aleatorio = new Random();
            JArray jarr_file = JArray.Parse(parfoot) as JArray;
            var arrfile = jarr_file.ToArray();

            foreach (string item in Request.Files)
            {
                var file = Request.Files[item];
                MemoryStream memory = new MemoryStream();
                string nombrearchivooriginal = System.IO.Path.GetFileName(file.FileName);
                string extension = System.IO.Path.GetExtension(file.FileName);
                string nombrearchivogenerado = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, aleatorio.Next(10, 100), extension);
                string comentario_file = string.Empty, estado = string.Empty;
                int idsolicituddesarrollotelaarchivos = 0;
                for (int i = 0; i < arrfile.Count(); i++)
                {
                    if (nombrearchivooriginal == arrfile[i]["nombrearchivooriginal"].ToString()) {
                        comentario_file = arrfile[i]["comentario"].ToString();
                        idsolicituddesarrollotelaarchivos = Convert.ToInt32(arrfile[i]["idsolicituddesarrollotelaarchivos"]);
                        estado = arrfile[i]["estado"].ToString();
                        break;
                    }
                }

                JObject objfile = new JObject();
                objfile.Add("idsolicituddesarrollotelaarchivos", idsolicituddesarrollotelaarchivos);
                objfile.Add("nombrearchivooriginal", nombrearchivooriginal);
                objfile.Add("nombrearchivogenerado", nombrearchivogenerado);
                objfile.Add("comentario", comentario_file);
                objfile.Add("estado", estado);

                file.InputStream.CopyTo(memory);
                byte[] bfile = memory.ToArray();
                string rutafile = @Ruta + "erp/textileanalysis/SolicitudDesarrolloTela/" + nombrearchivogenerado;
                System.IO.File.WriteAllBytes(rutafile, bfile);
                jarr_file_grabar.Add(objfile);
            }

            for (int i = 0; i < arrfile.Count(); i++)
            {
                string comentario_file = string.Empty, estado = string.Empty;
                int idsolicituddesarrollotelaarchivos = 0;
                if (arrfile[i]["estado"].ToString() == "edit" || arrfile[i]["estado"].ToString() == "delete")
                {
                    idsolicituddesarrollotelaarchivos = Convert.ToInt32(arrfile[i]["idsolicituddesarrollotelaarchivos"]);
                    if (idsolicituddesarrollotelaarchivos > 0)
                    {
                        comentario_file = arrfile[i]["comentario"].ToString();
                        estado = arrfile[i]["estado"].ToString();

                        JObject objfile = new JObject();
                        objfile.Add("idsolicituddesarrollotelaarchivos", idsolicituddesarrollotelaarchivos);
                        objfile.Add("nombrearchivooriginal", string.Empty);
                        objfile.Add("nombrearchivogenerado", string.Empty);
                        objfile.Add("comentario", comentario_file);
                        objfile.Add("estado", estado);
                        jarr_file_grabar.Add(objfile);
                    }
                }
            }

            parfoot = "";
            parfoot = JsonConvert.SerializeObject(jarr_file_grabar);

            int id = oMantenimiento.save_Rows_Out("usp_SolicitudDesarrolloTela_update_csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);

            string mensaje = _.Mensaje("edit", id > 0, null, id);
            return mensaje;
        }

        public string GetSolicitudDesarrollo()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string par = _.Get("par");
            par = _.addParameter(par, "idrol", _.GetUsuario().Roles);
            par = _.addParameter(par, "idperfil", _.GetUsuario().Perfiles);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "idproveedor", _.GetUsuario().IdProveedor.ToString());
            string data = bl.get_Data("usp_solicituddesarrollotela_getindex_csv", par, true, Util.ERP);
            data = _.addParameter(data, "roles", ousuario.Roles, true);
            data = _.addParameter(data, "isproveedor", _.GetUsuario().IdProveedor > 0 ? "si" : "no", true);
            data = _.addParameter(data, "idarea", _.GetUsuario().IdArea.ToString(), true);
            return data;
        }

        public string GetDataforedit()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string par = _.Get("par");
            par = _.addParameter(par, "idrol", ousuario.Roles);
            par = _.addParameter(par, "idperfil", ousuario.Perfiles);
            par = _.addParameter(par, "idusuario", ousuario.IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", ousuario.IdPersonal.ToString());
            par = _.addParameter(par, "idgrupocomercial", ousuario.IdGrupoComercial);   // :add
            string data = bl.get_Data("usp_solicituddesarrollotela_GetDataforEdit_csv", par, true, Util.ERP);
            //// ACTIVAR EL QUE DICE _TEMPORAL SOLO PARA EL MOCKUP DE SWATCH
            //string data = bl.get_Data("usp_solicituddesarrollotela_GetDataforEdit_csv_TEMPORAL", par, true, Util.ERP);
            data = _.addParameter(data, "roles", ousuario.Roles, true);
            data = _.addParameter(data, "idproveedor", ousuario.IdProveedor.ToString(), true);
            return data;
        }

        //public string Enviar()
        //{
        //    blMantenimiento bl = new blMantenimiento();
        //    beUser ousuario = _.GetUsuario();

        //    string par = _.Post("par");

        //    par = _.addParameter(par, "usuario", ousuario.Usuario);
        //    par = _.addParameter(par, "ip", "");
        //    par = _.addParameter(par, "hostname", "");
        //    par = _.addParameter(par, "IdUsuario", ousuario.IdUsuario.ToString());
        //    par = _.addParameter(par, "IdPersonal", ousuario.IdPersonal.ToString());
        //    par = _.addParameter(par, "IdGrupoPersonal", ousuario.IdGrupoComercial.ToString());
        //    string detail = "";
        //    int rows = bl.save_Rows("usp_SolicitudDesarrolloTela_enviar_csv", par, Util.ERP, detail);
        //    string mensaje = _.Mensaje("edit", rows > 0, null, rows);
        //    return mensaje;            
        //}

        public string Enviar()
        {
            blMantenimiento bl = new blMantenimiento();

            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();
            string url_recibiconforme = ConfigurationManager.AppSettings["url_ConformeRecibidoFabricaSolicitudDesarrollo"].ToString();

            beUser ousuario = _.GetUsuario();

            string parHead = _.Post("parHead");

            parHead = _.addParameter(parHead, "usuario", ousuario.Usuario);
            parHead = _.addParameter(parHead, "ip", "");
            parHead = _.addParameter(parHead, "hostname", "");
            parHead = _.addParameter(parHead, "idusuario", ousuario.IdUsuario.ToString());
            parHead = _.addParameter(parHead, "idgrupopersonal", ousuario.IdGrupoComercial.ToString());
            parHead = _.addParameter(parHead, "correooculto", correooculto);
            parHead = _.addParameter(parHead, "url_recibiconforme", url_recibiconforme);

            //int rows = bl.save_Rows("usp_SolicitudDesarrolloTela_enviocorreo_fabrica", parHead, Util.ERP);
            int rows = bl.save_Rows_Out("usp_SolicitudDesarrolloTela_EnviarCorreoProveedor_csv", parHead, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string VerificarEnvioCorreoFabrica()
        {
            blMantenimiento bl = new blMantenimiento();

            beUser ousuario = _.GetUsuario();

            string par = _.Post("par");

            par = _.addParameter(par, "IdPersonal", ousuario.IdPersonal.ToString());
            par = _.addParameter(par, "IdGrupoPersonal", ousuario.IdGrupoComercial.ToString());

            string mensaje = bl.get_Data("usp_SolicitudDesarrolloTela_verificar_enviocorreo_fabrica", par, false, Util.ERP);
            return mensaje;
        }

        public string Save_leadtime()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();
            string url_recibiconforme = ConfigurationManager.AppSettings["url_ConformeRecibidoComercialLeadTimeDesarrolloTela"].ToString();

            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = _.Post("parsubdetalle");
            string parfoot = string.Empty;

            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "correooculto", correooculto);
            par = _.addParameter(par, "url_recibiconforme", url_recibiconforme);

            int rows = bl.save_Rows("usp_SolicitudDesarrolloTela_guardarleadtime_csv", par, Util.ERP); // , pardetalle,parsubdetail
            //// ACTIVAR EL QUE DICE _TEMPORAL SOLO PARA EL MOCKUP DE SWATCH
            //int rows = bl.save_Rows("usp_SolicitudDesarrolloTela_guardarleadtime_csv_TEMPORAL", par, Util.ERP); // , pardetalle,parsubdetail
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string Bloquearleadtime()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();

            string par = _.Post("par");

            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());

            int rows = bl.save_Row("usp_SolicitudDesarrolloTela_cerrarleadtime_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }
        public string validarCredencialesAprobacion()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("usp_SolicitudDesarrolloTela_aprobarsolicitudcorreo_csv", par, true, Util.ERP);
            return result;
        }


        public string GetDataProveedorxCliente()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            string data = bl.get_Data("usp_solicituddesarrollotela_GetDataProveedorxCliente_csv", par, false, Util.ERP);
            return data;
        }

        public string GetDataLeadtimes()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial.ToString());
            string data = bl.get_Data("usp_solicituddesarrollotelaLeadtimes_getindex_csv", par, true, Util.ERP);
            return data;
        }

        public string Enviar_notificacion_leadtime()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string par = _.Post("par");

            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "correooculto", correooculto);

            int rows = bl.save_Rows("usp_sendmail_notificacion_leadtimes", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);

            return mensaje;
        }

        public string DownloadFile_Excel_leaddtime()
        {
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            string parfoot = _.Post("parfoot");
            string titulo, strListaCabeceraTabla, strDatosFilasTabla, strDatosColorTabla, strTituloDocumento;
            titulo = "Procesos Pendiente Fabricas";
            strListaCabeceraTabla = par;
            strDatosFilasTabla = pardetail;
            strDatosColorTabla = parfoot;
            strTituloDocumento = "Procesos Pendiente Fabricas";
            byte[] bfile = SolicitudDesarrolloTelaModel.crearExcel_LeadTimes(titulo, strListaCabeceraTabla, strDatosFilasTabla, strDatosColorTabla, strTituloDocumento);
            string base64 = Convert.ToBase64String(bfile);
            return base64;
        }

        public string Get_DesarrolloTela_PaReferenciaComplemento()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetSolicitudDesarrolloteTela_ForComplemento", par, false, Util.ERP);
            return data;
        }

        public FileResult DownloadFile(string nombrearchivogenerado, string nombrearchivooriginal) {
            string fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string ruta = @fileserver + "erp/textileanalysis/solicituddesarrollotela/" + nombrearchivogenerado;
            byte[] bfile = System.IO.File.ReadAllBytes(ruta);
            return File(bfile, System.Net.Mime.MediaTypeNames.Application.Octet, nombrearchivooriginal);
        }

        public string Save_EstadoFinalizado()
        {
            blMantenimiento bl = new blMantenimiento();

            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "correooculto", correooculto);

            int rows = bl.save_Rows("usp_GuardarEstadoFinal_SolicitudDesarrolloTela", par, Util.ERP);
            string data = _.Mensaje("edit", rows > 0);
            return data;
        }

        public string ValidarSiExistenCorreosFabrica()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_validarsiexistecorreodefabrica", par, false, Util.ERP);
            return data;
        }

        public string Get_Buscar_LeadTime_SolicitudPadrexProveedor()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            string data = bl.get_Data("usp_Buscar_LeadTime_SolicitudPadrexProveedor", par, true, Util.ERP);
            return data;
        }


        public string SolicitarReproceso()
        {
            blMantenimiento bl = new blMantenimiento();

            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "ip", string.Empty);
            parhead = _.addParameter(parhead, "hostname", string.Empty);
            parhead = _.addParameter(parhead, "correooculto", correooculto);

            int id = bl.save_Rows_Out("usp_SolicitarReprocesoDesarrolloTela_csv", parhead, Util.ERP);
            string mensaje = _.Mensaje("edit", id > 0, null, id);
            return mensaje;
        }

        public string SolicitudRehacer()
        {
            blMantenimiento bl = new blMantenimiento();
            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "ip", string.Empty);
            parhead = _.addParameter(parhead, "hostname", string.Empty);
            parhead = _.addParameter(parhead, "correooculto", correooculto);

            int id = bl.save_Rows_Out("usp_SolicitarRehacerDesarrolloTela_csv", parhead, Util.ERP);
            string mensaje = _.Mensaje("edit", id > 0, null, id);
            return mensaje;
        }

        public string ValidarSiLaSolicitudTieneAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_validarsisolicitud_tiene_atx_csv", par, false, Util.ERP);
            return data;
        }

        public string GetListaFabrica_TelaPrincipal_Complementos_EnviarCorreo()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetListaFabrica_TelaPrincipal_Complementos_EnviarCorreo", par, false, Util.ERP);
            return data;
        }

        public string ActualizarRecibidoConformeSolicitudDesarrolloFabrica()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Row("uspActualizarRecibidoConformeSolicitudDesarrolloFabrica", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, 0);
            return mensaje;
        }

        public string ActualizarConformeRecibidoComercialLeadTime()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Row("uspActualizarConformeRecibidoComercialLeadTime_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, 0);
            return mensaje;
        }

        public string ActualizarConformeRecibidoComercialSolicitudAtxMuestraFisica()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Rows("uspActualizarConformeRecibidoComercialSolicitudAtxMuestraFisica_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, 0);
            return mensaje;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_Proyecto()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Get_BuscarProyecto", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string UpdateData_LeadTime()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Update_LeadTimeWTS", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_LeadTime()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_LeadTimesReport", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_CrearProceso()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Insert_CreateNewProcess", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_AgregarProceso()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Insert_AddNewProcess", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string DeleteData_BorrarProceso()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Delete_Process", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}