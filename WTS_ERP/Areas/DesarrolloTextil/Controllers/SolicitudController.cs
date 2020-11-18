using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using System;
using System.Text;
using BE_ERP;
using System.Web;
using System.IO;
using System.Configuration;
using Utilitario;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class SolicitudController : Controller
    {
        // GET: DesarrolloTextil/Solicitud
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        public ActionResult _AprobarRechazarSolicitudAtx()
        {
            return View();
        }

        public ActionResult _AprobarRechazarEntregableAtx()
        {
            return View();
        }

        public ActionResult _Asignar() {
            return View();
        }

        public ActionResult _BuscarAtx()
        {
            return View();
        }

        public ActionResult _CambiarEstado()
        {
            return View();
        }

        public ActionResult _BuscarAtxEstandar()
        {
            return View();
        }

        public ActionResult _SeleccionarInstruccionCuidado()
        {
            return View();
        }

        public string getsolicitudcambiarestado()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_ObtenerSolicitudCambiarEstado_Get_csv", par, true, Util.ERP);
            return data;
        }

        public ActionResult SolicitudImprimir()
        {
            string par = _.Get("par");
            ViewBag.parametro = par;
            return View();
        }
         
        public string GetDataInicial()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            string data = blm.get_Data("usp_ObtenerDataSolicitud_Get", par, true, Util.ERP);
            //string data = blm.get_Data("usp_ObtenerDataSolicitud_Get_TEMPORAL", par, true, Util.ERP);
            return data;
        }
        public string validarATX()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_ValidarATX_Get", par, false, Util.ERP);
            return data;
        }

        //public   JsonResult Codifica(string IdAnalisis)
        //{
        //    JsonResponse response = new JsonResponse();
        //    response.Success = true;
        //    response.Data = BitConverter.ToString(Encoding.ASCII.GetBytes(Encriptar(IdAnalisis))).Replace("-", ""); ;
        //    response.Message = "Mail successfully sent.";

        //    return Json(response, JsonRequestBehavior.AllowGet);
 
        //}

        public string Codifica()
        {
            string par = _.Get("par");
            string idanalisistextil = _.Get_Par(par, "idanalisistextilsolicitud");           
            return BitConverter.ToString(Encoding.ASCII.GetBytes(Encriptar(idanalisistextil))).Replace("-", "");
        }
         
        private static  string Encriptar(string cadenaAencriptar)
        {
            var encryted = System.Text.Encoding.Unicode.GetBytes(cadenaAencriptar);
            return Convert.ToBase64String(encryted);
        }

        public string Save_New() {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;
            string file = _.Post("filearchivo");

            // Guardar Archivo
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string cFolderThumbnail = @"\\" + urlFileServer + "\\erp\\textileanalysis\\FichaTecnicaProveedor\\";
                    
            byte[] fileByte = new byte[0];
            Random oAleatorio = new Random();
            MemoryStream target = new MemoryStream();
            HttpPostedFileBase fileArchivo = Request.Files["fileArchivo"];
            string NombreArchivo = "";
            string Extension = "";
            string NombreWeb = "";

            if (fileArchivo != null)
            {
                NombreArchivo = System.IO.Path.GetFileName(fileArchivo.FileName);
                Extension = Path.GetExtension(fileArchivo.FileName);
                NombreWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), Extension);

                fileArchivo.InputStream.CopyTo(target);
                fileByte = target.ToArray();               
            }          
            //
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "NombreArchivo", NombreArchivo);
            par = _.addParameter(par, "NombreWeb", NombreWeb);

            blMantenimiento oMantenimiento = new blMantenimiento();
            //// SE COMENTO TEMPORALMENTE POR SIN SDT
            int id = oMantenimiento.save_Rows_Out("usp_SolicitudWF_Insert_Csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            //int id = oMantenimiento.save_Rows_Out("usp_SolicitudWF_Insert_Csv_sin_sdt", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            // 
            if (id > 0) {
                if (fileArchivo != null)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, NombreWeb), fileByte);
                }
            }
         
            string mensaje = _.Mensaje("new", id > 0, oMantenimiento.get_Data("usp_SolicitudWF_GetById_Csv", id.ToString(), true, Util.ERP), id);
            return mensaje;             
        }

        public string Save_Edit()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;
            string file = _.Post("filearchivo");

            // Guardar Archivo
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string cFolderThumbnail = @"\\" + urlFileServer + "\\erp\\textileanalysis\\FichaTecnicaProveedor\\";

            byte[] fileByte = new byte[0];
            Random oAleatorio = new Random();
            MemoryStream target = new MemoryStream();
            HttpPostedFileBase fileArchivo = Request.Files["filearchivo"];
            string NombreArchivo = "";
            string Extension = "";
            string NombreWeb = "";
           
            if (fileArchivo != null) {
                 NombreArchivo = System.IO.Path.GetFileName(fileArchivo.FileName);
                 Extension = Path.GetExtension(fileArchivo.FileName);
                 NombreWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), Extension);
                fileArchivo.InputStream.CopyTo(target);
                fileByte = target.ToArray();
            }
           
            //
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            par = _.addParameter(par, "NombreArchivo", NombreArchivo);
            par = _.addParameter(par, "NombreWeb", NombreWeb);

            blMantenimiento oMantenimiento = new blMantenimiento();
            //// SE COMENTO TEMPORALMENTE POR SIN SDT
            int id = oMantenimiento.save_Rows_Out("usp_SolicitudWF_Update_Csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            //int id = oMantenimiento.save_Rows_Out("usp_SolicitudWF_Update_Csv_sin_sdt", par, Util.ERP, pardetalle, parsubdetail, parfoot);

            if (id > 0)
            {
                if (fileArchivo != null)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, NombreWeb), fileByte);
                }
            }
            string mensaje = _.Mensaje("edit", id > 0, oMantenimiento.get_Data("usp_SolicitudWF_GetById_Csv", id.ToString(), true, Util.ERP));
            return mensaje;
        }

        public string GetBandejaFiltro_CSV()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string par = _.Get("par");
            par = _.addParameter(par, "idrol", _.GetUsuario().Roles);
            par = _.addParameter(par, "idperfil", _.GetUsuario().Perfiles);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string data = bl.get_Data("uspGetSolicitudesAtx_Index_csv", par, true, Util.ERP);
            //string data = bl.get_Data("uspGetSolicitudesAtx_Index_csv_ESTEMPORAL", par, true, Util.ERP);
            //string data = bl.get_Data("uspGetSolicitudesAtx_Index_csv_jacob", par, true, Util.ERP);
            
            data = _.addParameter(data, "roles", ousuario.Roles, true);
            return data;
        }

        public string getDataSolicitudAtxtbyId() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idrol", _.GetUsuario().Roles);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            string data = bl.get_Data("uspGetSolicitudesAtxCuerpo_Index_csv", par, true, Util.ERP);
            //string data = bl.get_Data("uspGetSolicitudesAtxCuerpo_Index_csv_ESTEMPORAL", par, true, Util.ERP);
            
            return data;
        }
      
        public string GetData_foredit()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            //// SE COMENTO TEMPORALMENTE POR SIN SDT
            string data = blm.get_Data("usp_SolicitudWF_GetforEdit_Csv", par, true, Util.ERP);
            //string data = blm.get_Data("usp_SolicitudWF_GetforEdit_Csv_sin_sdt", par, true, Util.ERP);
            return data;
        }
        public string ObtenerAnalista()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_ObtenerAnalistaTextil_Get_Csv", par, false, Util.ERP);
            return data;
        }

        public string AsignarAnalista()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            blMantenimiento blm = new blMantenimiento();
            int data = blm.save_Row("usp_AsignarAnalistaTextil_Update", par, Util.ERP);
            //int data = blm.save_Row("usp_AsignarAnalistaTextil_Update_ESTEMPORAL", par, Util.ERP);
            
            return data.ToString();
        }

        public string IniciarSolicitudAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string url_recibiconforme_comercial = ConfigurationManager.AppSettings["url_ConformeRecibidoComercialSolicitudAtxFromFabrica"].ToString();
            string correooculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            par = _.addParameter(par, "url_recibiconforme", url_recibiconforme_comercial);
            par = _.addParameter(par, "correo_oculto", correooculto);

            //// SE COMENTA TEMPORALMENTE PARA PROBAR LAS NOTIFICACIONES
            int rows = bl.save_Rows("uspIniciarSolicitudAtx_csv", par, Util.ERP);
            //int rows = bl.save_Rows("uspIniciarSolicitudAtx_csv_notificacion", par, Util.ERP);
            
            //// PARA LAS NOTIFICACIONES
            var jo_get = JObject.Parse(par);
            int idsolicitud = int.Parse(jo_get.GetValue("idsolicitud").ToString());
            var jo_par = new JObject();
            jo_par.Add("idusuario", _.GetUsuario().IdUsuario.ToString());
            jo_par.Add("idsolicitud", idsolicitud.ToString());
            jo_par.Add("codaccion", "INI");
            jo_par.Add("url_modulo", _.Get_Par(par, "url_modulo"));
            jo_par.Add("url_foto_perfil_usuario_origen", _.Get_Par(par, "url_foto_perfil_usuario_origen"));

            string spar = JsonConvert.SerializeObject(jo_par);

            ///// SE MODIFICO PARA OBTENER LOS USUARIOS A NOTIFICAR
            ////string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            string data = bl.get_Data("usp_GetDataCorreo_Atx_Enviar_Aprobar_Rechazar_notificacion", spar, true, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, data, rows);

            // NOTA PENDIENTE AL INICIAR O ENVIAR ENVIAR CORREO AQUI ENVIAR CORREO
            // ENVIAR CORREO AL INICIAR O ENVIAR

            return mensaje;
        }

        public string Save_AprobarRechazarSolicitudAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            //// SE COMENTO TEMPORALMENTE POR SIN SDT
            int rows = bl.save_Rows("uspAprobarSolicitudAtx_csv", par, Util.ERP);
            //int rows = bl.save_Rows("uspAprobarSolicitudAtx_csv_sin_sdt", par, Util.ERP);

            string mensaje = _.Mensaje("edit", rows > 0, null, rows);

            // NOTA PENDIENTE AL INICIAR O ENVIAR ENVIAR CORREO AQUI ENVIAR CORREO
            // ENVIAR CORREO AL INICIAR O ENVIAR

            return mensaje;
        }

        public string AprobarRechazarEntregableAtx()
        {
            blMantenimiento bl = new blMantenimiento();

            string copiaoculta = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");
            par = _.addParameter(par, "correo_cco", copiaoculta.Replace(',', ';'));

            //encriptado 
            string idanalisistextil = _.Get_Par(par, "idanalisistextil");
            string URL = ConfigurationManager.AppSettings["UrlATX"].ToString();            
            string url = URL + "?idatx="+ Utilitario.Utils.Codifica(idanalisistextil.ToString());
            //cCuerpo += "<br>";
            //cCuerpo += "Para ver el Analisis Textil <a href='" + url + "' >Click Aqui</a>";

            par = _.addParameter(par, "url", url);

            //int rows = bl.save_Row("uspAprobarEntregableAtx_csv", par, Util.ERP);  //// SIN TRANSACCION
            int rows = bl.save_Rows("uspAprobarEntregableAtx_csv", par, Util.ERP);   //// CON TRANSACCION
            
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);

            // NOTA PENDIENTE AL INICIAR O ENVIAR ENVIAR CORREO AQUI ENVIAR CORREO
            // ENVIAR CORREO AL INICIAR O ENVIAR

            return mensaje;
        }
         
        public string IniciarAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int rows = bl.save_Row("uspIniciarAtx_csv", par, Util.ERP);
            //int rows = bl.save_Row("uspIniciarAtx_csv_ESTEMPORAL", par, Util.ERP);
            
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);

            return mensaje;
        }

        public string GetBuscarAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetSolicitudAtx_ATX_csv", par, true, Util.ERP);
            return data;
        }

        public string GetLoadIni_BuscarAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_LoadIni_BuscarAtx_EnSolicitud_csv", par, true, Util.ERP);
            return data;
        }

        public string EliminarSolicitudAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            int rows = bl.save_Row("usp_EliminarSolicitudAtx_csv", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string obtenerdata_print()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_analisistextilsolicitud_print_csv", par, true, Util.ERP);
            return data;
        }


        public string GetBandejaSolicitud_Filtro_estado_CSV()
        {
            blMantenimiento bl = new blMantenimiento();
            beUser ousuario = _.GetUsuario();
            string par = _.Get("par");
            par = _.addParameter(par, "idrol", _.GetUsuario().Roles);
            par = _.addParameter(par, "idperfil", _.GetUsuario().Perfiles);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string data = bl.get_Data("uspGetSolicitudesAtx_Index_filtroestado_csv", par, true, Util.ERP);
            data = _.addParameter(data, "roles", ousuario.Roles, true);
            return data;
        }

        public string AceptarCambiarEstado()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int rows = bl.save_Row("usp_GuardarCambioEstadoATX_csv", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);

            return mensaje;
        }


        public string GetData_FichaTecnica_ByCodigoTela()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("uspFichaTecnicaConsultaByCodigoTela_csv", par, true, Util.ERP);
            return data;
        }

        public string GetData_ValidacionSiEsNecesario_RecibirSolicitud()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("uspValidarSiSeNecesita_RecibirSolicitudAtx", par, false, Util.ERP);
            return data;
        }

        public string GetData_SolicitudDesarrolloTela_AtxEstandar()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idproveedor", _.GetUsuario().IdProveedor.ToString());
            //// SE COMENTO TEMPORALMENTE POR SIN SDT
            //string data = bl.get_Data("usp_GetSolicitudDesarrollo_AtxEstandar_csv", par, false, Util.ERP);
            string data = bl.get_Data("usp_GetAtxEstandar_sin_solicitud_desarrollotela_csv", par, false, Util.ERP);
            return data;
        }

        public FileResult DownloadFile_Proveedor(string nombrearchivo_original, string nombrearchivo_generado)
        {
            string fileserver = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutacompleta = @fileserver + "erp/textileanalysis/FichaTecnicaProveedor/" + nombrearchivo_generado;
            byte[] byte_file = System.IO.File.ReadAllBytes(rutacompleta);
            return File(byte_file, System.Net.Mime.MediaTypeNames.Application.Octet, nombrearchivo_original);
        }

        public string GetEstadosValidarAntesGenerarCodigoTela()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetListaEstadosBySolicitudAtx_csv", par, true, Util.ERP);
            return data;
        }

        public string FinalizarSolicitudColgador()
        {
            string correo_oculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "correooculto", correo_oculto);
            
            int rows = bl.save_Rows("usp_Estado_OperadorFinalizaSolicitudColgador_csv", parhead, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string Get_IniNew_InstruccionCuidadoSolicitudAtx()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("Laboratorio.uspGet_IniNew_InstruccionCuidadoSolicitudAtx", "", true, Util.ERP);
            return data;
        }

        public string Save_Leer_Notificacion()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Rows("usp_Save_LeerNotificacion", par, Util.ERP);
            string usuario = _.GetUsuario().Usuario;
            string mensaje = _.Mensaje("edit", rows > 0, bl.get_Data("usp_GetNotificacionesByUsuario", usuario, false, Util.ERP), rows);
            return mensaje;
        }

        public string GetNotificaciones_ByUsuario()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetNotificacionesByUsuario", par, false, Util.ERP);
            return data;
        }
    }
}