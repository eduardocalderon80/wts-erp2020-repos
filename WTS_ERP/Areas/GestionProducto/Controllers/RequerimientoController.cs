using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using BL_ERP.GestionProducto;
//using OfficeOpenXml;
//using OfficeOpenXml.Style;
using System.IO;
using System.Text;
using BE_ERP;
using BE_ERP.GestionProducto;
using Utilitario;
using Newtonsoft.Json;
using BE_ERP.GestionProducto.Requerimiento;
using System.Threading;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;

namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class RequerimientoController : Controller
    {
        string urlFileServer_general = ConfigurationManager.AppSettings["FileServer"].ToString();
        blLog log = new blLog();
        [AccessSecurity]
        public ActionResult Index()
        {
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";
            ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }
        [AccessSecurity]
        public ActionResult New()
        {
            ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }

        [AccessSecurity]
        public ActionResult NewMasivo()
        {
            ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }
        [AccessSecurity]
        public ActionResult _AddEstiloMasivo()
        {
            return PartialView();
        }
        [AccessSecurity]
        public ActionResult _EnviarCorreoRequerimiento()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _EnviarCorreoRequerimientoCom()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _EnviarCorreoMasivo()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Comentario()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult CorreoMasivo()
        {
            //string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            //// HA SIDO REEMPLAZADO VER EN EL METODO getData_combosIndIndex
            //ViewBag.PathStyleWeb = PathFileServer + "erp/style/thumbnail/";
            //ViewBag.perfil = _.GetUsuario().Perfiles;
            return View();
        }

        public string GetReqCorreoMasivo() {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            string data = blm.get_Data("Usp_Requerimiento_CorreoMasivo", par, true, Util.ERP);
            return data;
        }
        [AccessSecurity]
        public ActionResult _BuscarReq()
        {
            return View();
        }

        public string Validar()
        {
            string par = _.Post("par");
            blMantenimiento blm = new blMantenimiento();
            int data = blm.save_Row_Out("usp_RequerimientoDDP_Validar", par, Util.ERP);

            return data.ToString();
        }

        public string GuardarComentario()
        {
            string Ruta = ConfigurationManager.AppSettings["FileServer"].ToString();

            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            string pardetalle = string.Empty;
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;
            string parSubfoot = string.Empty;
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            string NombreArchivo = "", NombreArchivoWeb = "", Extension = "", rutaImagen = "";

            //Request.Files
            HttpPostedFileBase archivo = Request.Files["archivo"];
            if (archivo != null)
            {
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();

                rutaImagen = @"\\" + Ruta + @"erp\ddp\ArchivoComentario\";

                NombreArchivo = System.IO.Path.GetFileName(archivo.FileName);
                Extension = Path.GetExtension(archivo.FileName);

                byte[] file = new byte[0];
                file = new byte[0];
                MemoryStream target = new MemoryStream();
                archivo.InputStream.CopyTo(target);
                file = target.ToArray();

                Random oAleatorio = new Random();

                NombreArchivoWeb = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), Extension);
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", rutaImagen, NombreArchivoWeb), file);

                //rutaImagen = rutaImagen + NombreArchivo;
                //archivo.SaveAs(rutaImagen);
            }

            par = _.addParameter(par, "nombrearchivoweb", NombreArchivoWeb);

            int id = blm.save_Rows_Out("usp_RequerimientoComentario_Guardar", par, Util.ERP, pardetalle, parsubdetail, parfoot, parSubfoot);

            return id.ToString();
        }

        public FileResult DescargaArchivoCom(string pNombreArchivo, string pNombreArchivoWeb)
        {
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string ruta = @"\\" + urlFileServer + "\\erp\\ddp\\ArchivoComentario\\" + pNombreArchivoWeb;
            byte[] byteArchivo = System.IO.File.ReadAllBytes(@ruta);
            return File(byteArchivo, System.Net.Mime.MediaTypeNames.Application.Octet, pNombreArchivo);
        }

        public string EliminarComentario()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row("usp_RequerimientoComentario_Eliminar", par, Util.ERP);
            return id.ToString();
        }
        [AccessSecurity]
        public ActionResult _NewReq()
        {
            return PartialView();
        }

        public string NuevoReq()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row_Out("uspDesarrolloProductoRequerimientoCopiar", par, Util.ERP);
            return id.ToString();
        }

        public JsonResult getData_iniCombosNew()
        {
            string par = _.Get("par");

            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("uspGetIniCombosRequerimientos", par, true, Util.ERP);

            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutafileserver_imagenestilo = PathFileServer + "erp/style/thumbnail/";

            JsonResponse oresponse = new JsonResponse();

            oresponse.Data = data;
            oresponse.Message = rutafileserver_imagenestilo;

            return Json(oresponse, JsonRequestBehavior.AllowGet);
        }

        public string getData_iniCombosByCliente()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("uspGetCombosIniByCliente", par, true, Util.ERP);
            return data;
        }
        [AccessSecurity]
        public ActionResult _BuscarEstilo()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Despacho()
        {
            return View();
        }

        public string getData_filtroestilos()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetEstilosForRequerimiento", par, false, Util.ERP);
            return data;
        }

        public string save_new_Requerimiento()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuarioregistro", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            string pardetalle = _.Post("parDetail");
            string parsubdetail = string.Empty;
            string parfoot = _.Post("parfoot");

            #region GENERAR LISTA ARCHIVO
            // GENERAR LISTA ARCHIVO 
            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parfoot);

            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = @"\\" + urlFileServer + "\\erp\\ddp\\";

            int contador = 0;
            foreach (string item in Request.Files)
            {
                var requestArchivo = Request.Files[item];
                if (listaarchivosfromjavascript[contador].modificado == 1)
                {
                    string NombreArchivoOriginal = System.IO.Path.GetFileName(requestArchivo.FileName);

                    cExtension = Path.GetExtension(requestArchivo.FileName);

                    requestArchivo.InputStream.CopyTo(target);
                    Imagen = target.ToArray();

                    string cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                    objArchivo = new Archivo();
                    objArchivo.nombrearchivooriginal = NombreArchivoOriginal;
                    objArchivo.nombrearchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string subDetalle = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                subDetalle = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        subDetalle += "{" + "\"idarchivo\":\"" + item.idarchivo.ToString() + "\",\"nombrearchivooriginal\":\"" + item.nombrearchivooriginal + "\", \"nombrearchivo\":\"" + item.nombrearchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        subDetalle += "{" + "\"idarchivo\":\"" + item.idarchivo.ToString() + "\",\"nombrearchivooriginal\":\"" + item.nombrearchivooriginal + "\", \"nombrearchivo\":\"" + item.nombrearchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                subDetalle += "]";
                parsubdetail = subDetalle;
            }
            #endregion
            if (parfoot == "[]")
            {
                parfoot = "";
            }
            int id = blm.save_Rows_Out("uspInsertarRequerimiento", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            #region GUARDAR EN EL FILESERVER
            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.nombrearchivo), item.bytearchivo);
                }
            }
            #endregion
            string mensaje = _.Mensaje("new", id > 0, blm.get_Data("uspGetRequerimientoById", id.ToString(), true, Util.ERP));
            return mensaje;
        }

        public string getData_combosIndIndex()
        {
            blMantenimiento blm = new blMantenimiento();
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string sizemaximoarchivo = ConfigurationManager.AppSettings["sizemaximoarchivo_correo"].ToString();

            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            string data = blm.get_Data("uspGetCombosRequerimientoIniIndex", par, true, Util.ERP);

            data = _.addParameter(data, "perfiles", _.GetUsuario().Perfiles, true);
            data = _.addParameter(data, "rutafileserver", PathFileServer + "erp/style/thumbnail/", true);
            data = _.addParameter(data, "sizemaximoarchivo", sizemaximoarchivo, true);

            return data;
        }

        public string getData_requerimientoIndexSearch()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string stridgrupocomercial = _.GetUsuario().IdGrupoComercial.Trim();
            int idgrupocomercial = 0;
            if (stridgrupocomercial != "") {
                idgrupocomercial = int.Parse(stridgrupocomercial);
            }
            par = _.addParameter(par, "idgrupocomercial", idgrupocomercial.ToString());
            string data = blm.get_Data("uspGetRequerimientoIndexSearch", par, false, Util.ERP);
            return data;
        }

        public string getData_requerimientoModalSearch()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string stridgrupocomercial = _.GetUsuario().IdGrupoComercial.Trim();
            int idgrupocomercial = 0;
            if (stridgrupocomercial != "")
            {
                idgrupocomercial = int.Parse(stridgrupocomercial);
            }
            par = _.addParameter(par, "idgrupocomercial", idgrupocomercial.ToString());
            string data = blm.get_Data("uspGetReqSearchModalCorreoMasivo", par, false, Util.ERP);
            return data;
        }

        public string getData_requerimientoIndexSearchById()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetRequerimientoIndexSearchById", par, false, Util.ERP);
            return data;
        }

        public JsonResult getData_requerimiento_foredit()
        {
            blMantenimiento blm = new blMantenimiento();
            JsonResponse oresponse = new JsonResponse();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutafileserver_imagenestilo = PathFileServer + "erp/style/thumbnail/";

            string data = blm.get_Data("uspGetRequerimientoForEdit", par, true, Util.ERP);
            oresponse.Data = data;
            oresponse.Message = rutafileserver_imagenestilo;
            return Json(oresponse, JsonRequestBehavior.AllowGet);
        }

        public string save_edit_requerimiento()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            string pardetalle = _.Post("parDetail");
            string parsubdetail = string.Empty;
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");  // para los archivos eliminados

            #region GENERAR LISTA ARCHIVO
            // GENERAR LISTA ARCHIVO 
            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parfoot);

            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = @"\\" + urlFileServer + "\\erp\\ddp\\";

            int contador = 0;
            foreach (string item in Request.Files)
            {
                target = new MemoryStream();
                Imagen = new byte[0];
                var requestArchivo = Request.Files[item];
                if (listaarchivosfromjavascript[contador].modificado == 1)
                {
                    string NombreArchivoOriginal = System.IO.Path.GetFileName(requestArchivo.FileName);

                    cExtension = Path.GetExtension(requestArchivo.FileName);

                    requestArchivo.InputStream.CopyTo(target);
                    Imagen = target.ToArray();

                    string cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                    objArchivo = new Archivo();
                    objArchivo.nombrearchivooriginal = NombreArchivoOriginal;
                    objArchivo.nombrearchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string subDetalle = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                subDetalle = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        subDetalle += "{" + "\"idarchivo\":\"" + item.idarchivo.ToString() + "\",\"nombrearchivooriginal\":\"" + item.nombrearchivooriginal + "\", \"nombrearchivo\":\"" + item.nombrearchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        subDetalle += "{" + "\"idarchivo\":\"" + item.idarchivo.ToString() + "\",\"nombrearchivooriginal\":\"" + item.nombrearchivooriginal + "\", \"nombrearchivo\":\"" + item.nombrearchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                subDetalle += "]";
                parsubdetail = subDetalle;
            }
            #endregion
            //System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWebNombre), Imagen);
            if (parfoot == "[]") {
                parfoot = "";
            }

            if (parsubfoot == "[]")
            {
                parsubfoot = "";
            }

            int id = blm.save_Rows_Out("uspUpdateRequerimiento", par, Util.ERP, pardetalle, parsubdetail, parfoot, parsubfoot);
            #region GUARDAR EN EL FILESERVER
            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.nombrearchivo), item.bytearchivo);
                }
            }
            #endregion

            //string mensaje = _.Mensaje("edit", id > 0, null);
            string mensaje = _.Mensaje("edit", id > 0, blm.get_Data("uspGetRequerimientoById", id.ToString(), true, Util.ERP));
            return mensaje;
        }

        public string getRequerimientobyId()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetRequerimientoById", par, true, Util.ERP);
            return data;
        }

        public string ObtenerDespacho()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("uspRequerimientoDetalle_despacho_obtener", par, true, Util.ERP);
            return data;
        }

        public string ObtenerDespachoxId(string id)
        {
            // :sarone
            blMantenimiento blMantenimiento = new blMantenimiento();
            JObject opar = new JObject();
            opar.Add("idrequerimiento", id);
            string par = opar.ToString();
            string data = blMantenimiento.get_Data("uspRequerimientoDetalle_despacho_obtener", opar.ToString(), true, Util.ERP);
            return data;
        }

        public string InsertarDespacho()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = _.Post("parsubdetalle");
            string parfoot = string.Empty;
            string idrequerimiento = _.Get_Par(par, "idrequerimiento");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento oMantenimiento = new blMantenimiento();
            int idresultado = oMantenimiento.save_Rows_Out("uspDesarrolloProductoDespachoDetalleInsertar", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            string mensaje = _.Mensaje("new", idresultado > 0, ObtenerDespachoxId(idrequerimiento), idresultado);
            return mensaje;
        }

        public FileResult DescargaArchivo(string pNombreArchivoOriginal, string pNombreArchivoGenerado)
        {
            string urlFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string ruta = @"\\" + urlFileServer + "\\erp\\ddp\\" + pNombreArchivoGenerado;
            byte[] byteArchivo = System.IO.File.ReadAllBytes(@ruta);
            return File(byteArchivo, System.Net.Mime.MediaTypeNames.Application.Octet, pNombreArchivoOriginal);
        }

        public string getData_requerimientoParaEnviarCorreo() {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);
            string data = blm.get_Data("uspGetRequerimientoForEnviarCorreo", par, true, Util.ERP);
            return data;
        }

        public string EliminarReq()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row("usp_Requerimiento_Eliminar", par, Util.ERP);
            return id.ToString();
        }

        public string EliminarDespacho()
        {
            string par = _.Post("par");

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int id = blm.save_Row("uspDesarrolloProductoDespachoDetalleEliminar", par, Util.ERP);
            return id.ToString();
        }

        public JsonResult EnviarCorreoMuestra(string pCorreoAsunto, string pCorreosTo, string pCorreosCC, string pCorreoCuerpo, string pListaimagen, string pCadenaListaArchivosAdjunto)
        {
            string correoFrom = _.GetUsuario().Correo;
            NotificadorCorreo notificarCorreo = new NotificadorCorreo();
            string[] arrayFilaImagen, arrayColumnasImagen, arrayArchivosAdjunto;
            List<FileMailAttachment> listaArchivosAdjunto = new List<FileMailAttachment>();
            FileMailAttachment objCorreoArchivo = new FileMailAttachment();
            string nombreArchivoOriginal = string.Empty, nombreArchivoGenerado = string.Empty;
            JsonResponse jsonRespuesta = new JsonResponse();
            AsyncManager.OutstandingOperations.Increment();

            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutafileserver_imagenestilo = @"\\" + PathFileServer + "\\erp\\style\\thumbnail\\";
            try
            {
                //beUsuario oBeUsuario = (beUsuario)Session["UsuarioSesion"];
                ThreadPool.QueueUserWorkItem((s) => {
                    //string htmlCuerpo = pCorreoCuerpo.Replace("\n", "</br>") + "</br> </br>" + pTablaHtml;
                    AlternateView htmlView = AlternateView.CreateAlternateViewFromString(pCorreoCuerpo, Encoding.UTF8, MediaTypeNames.Text.Html);

                    // TRABAJAR CON LAS IMAGENES
                    if (pListaimagen.Length > 0)
                    {
                        arrayFilaImagen = pListaimagen.Split('^');
                        if (arrayFilaImagen.Length > 0)
                        {
                            for (int i = 0; i < arrayFilaImagen.Length; i++)
                            {
                                arrayColumnasImagen = arrayFilaImagen[i].Split('¬');

                                string strIdentificadorImg = arrayColumnasImagen[0];
                                var urlImagen = rutafileserver_imagenestilo + "\\" + arrayColumnasImagen[1];
                                LinkedResource img = new LinkedResource(urlImagen, MediaTypeNames.Image.Jpeg);

                                // EL VALOR DEL ContentId ESTA EN EL HTML QUE VIENE DESDE JAVASCRIPT; ACA SOLO LO RELACIONO
                                img.ContentId = strIdentificadorImg;
                                htmlView.LinkedResources.Add(img);

                                //for (int j = 0; j < arrayColumnasImagen.Length; j++)
                                //{

                                //}

                            }
                        }
                    }

                    // LISTA DE ARCHIVOS
                    if (pCadenaListaArchivosAdjunto.Length > 0)
                    {
                        arrayArchivosAdjunto = pCadenaListaArchivosAdjunto.Split('^');

                        if (arrayArchivosAdjunto.Length > 0)
                        {
                            for (int i = 0; i < arrayArchivosAdjunto.Length; i++)
                            {
                                var datosArchivo = arrayArchivosAdjunto[i].Split('¬');  // [0] = nombre archivo original; [1] = nombre archivo generado
                                nombreArchivoGenerado = datosArchivo[0];
                                nombreArchivoOriginal = datosArchivo[1];

                                //string CarpetaImagenMuestraDetalle = ConfigurationManager.AppSettings["FileMuestraDetalle"].ToString();

                                string cFolderOriginal = @"\\" + PathFileServer + "\\erp\\ddp\\" + nombreArchivoGenerado;

                                //FileInfo miFIle = new FileInfo(xddemo);
                                //var xd = miFIle.Length;
                                byte[] byteArchivo = System.IO.File.ReadAllBytes(cFolderOriginal);

                                //cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                                //File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), pAnalisisTextil.Imagen);
                                objCorreoArchivo = new FileMailAttachment();
                                objCorreoArchivo.NombreArchivo = nombreArchivoOriginal;
                                objCorreoArchivo.Archivo = byteArchivo;
                                listaArchivosAdjunto.Add(objCorreoArchivo);
                            }

                        }
                    }

                    TempData["send"] = notificarCorreo.EnviarCorreo_Notificar(pCorreoAsunto, pCorreosTo, pCorreosCC, string.Empty, pCorreoCuerpo, listaArchivosAdjunto, true, correoFrom, htmlView);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                jsonRespuesta.Success = true;
                jsonRespuesta.Data = 1;
                jsonRespuesta.Message = "Mail successfully sent.";
            }
            catch (Exception ex)
            {
                jsonRespuesta.Success = false;
                jsonRespuesta.Data = 0;
                jsonRespuesta.Message = "Mail could not be sent: " + ex.ToString();
                throw;
            }

            return Json(jsonRespuesta, JsonRequestBehavior.AllowGet);
        }


        public JsonResult EnviarCorreCom(string pCorreoAsunto, string pCorreosTo, string pCorreosCC, string pCorreoCuerpo, string pListaimagen, string pCadenaListaArchivosAdjunto)
        {
            string correoFrom = _.GetUsuario().Correo;
            NotificadorCorreo notificarCorreo = new NotificadorCorreo();
            string[] arrayFilaImagen, arrayColumnasImagen, arrayArchivosAdjunto;
            List<FileMailAttachment> listaArchivosAdjunto = new List<FileMailAttachment>();
            FileMailAttachment objCorreoArchivo = new FileMailAttachment();
            string nombreArchivoOriginal = string.Empty, nombreArchivoGenerado = string.Empty;
            JsonResponse jsonRespuesta = new JsonResponse();
            AsyncManager.OutstandingOperations.Increment();

            string PathFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
            string rutafileserver_imagenestilo = @"\\" + PathFileServer + "\\erp\\style\\thumbnail\\";
            try
            {
                //beUsuario oBeUsuario = (beUsuario)Session["UsuarioSesion"];
                ThreadPool.QueueUserWorkItem((s) => {
                    //string htmlCuerpo = pCorreoCuerpo.Replace("\n", "</br>") + "</br> </br>" + pTablaHtml;
                    AlternateView htmlView = AlternateView.CreateAlternateViewFromString(pCorreoCuerpo, Encoding.UTF8, MediaTypeNames.Text.Html);

                    // TRABAJAR CON LAS IMAGENES
                    if (pListaimagen.Length > 0)
                    {
                        arrayFilaImagen = pListaimagen.Split('^');
                        if (arrayFilaImagen.Length > 0)
                        {
                            for (int i = 0; i < arrayFilaImagen.Length; i++)
                            {
                                arrayColumnasImagen = arrayFilaImagen[i].Split('¬');

                                string strIdentificadorImg = arrayColumnasImagen[0];
                                var urlImagen = rutafileserver_imagenestilo + "\\" + arrayColumnasImagen[1];
                                LinkedResource img = new LinkedResource(urlImagen, MediaTypeNames.Image.Jpeg);

                                // EL VALOR DEL ContentId ESTA EN EL HTML QUE VIENE DESDE JAVASCRIPT; ACA SOLO LO RELACIONO
                                img.ContentId = strIdentificadorImg;
                                htmlView.LinkedResources.Add(img);

                                //for (int j = 0; j < arrayColumnasImagen.Length; j++)
                                //{

                                //}

                            }
                        }
                    }

                    // LISTA DE ARCHIVOS
                    if (pCadenaListaArchivosAdjunto.Length > 0)
                    {
                        arrayArchivosAdjunto = pCadenaListaArchivosAdjunto.Split('^');

                        if (arrayArchivosAdjunto.Length > 0)
                        {
                            for (int i = 0; i < arrayArchivosAdjunto.Length; i++)
                            {
                                var datosArchivo = arrayArchivosAdjunto[i].Split('¬');  // [0] = nombre archivo original; [1] = nombre archivo generado
                                nombreArchivoGenerado = datosArchivo[0];
                                nombreArchivoOriginal = datosArchivo[1];

                                //string CarpetaImagenMuestraDetalle = ConfigurationManager.AppSettings["FileMuestraDetalle"].ToString();

                                string cFolderOriginal = @"\\" + PathFileServer + "\\erp\\ddp\\ArchivoComentario\\" + nombreArchivoGenerado;

                                //FileInfo miFIle = new FileInfo(xddemo);
                                //var xd = miFIle.Length;
                                byte[] byteArchivo = System.IO.File.ReadAllBytes(cFolderOriginal);

                                //cImagenNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);
                                //File.WriteAllBytes(string.Format("{0}{1}", cFolderOriginal, cImagenNombre), pAnalisisTextil.Imagen);
                                objCorreoArchivo = new FileMailAttachment();
                                objCorreoArchivo.NombreArchivo = nombreArchivoOriginal;
                                objCorreoArchivo.Archivo = byteArchivo;
                                listaArchivosAdjunto.Add(objCorreoArchivo);
                            }

                        }
                    }

                    TempData["send"] = notificarCorreo.EnviarCorreo_Notificar(pCorreoAsunto, pCorreosTo, pCorreosCC, string.Empty, pCorreoCuerpo, listaArchivosAdjunto, true, correoFrom, htmlView);
                    AsyncManager.OutstandingOperations.Decrement();
                }, null);

                jsonRespuesta.Success = true;
                jsonRespuesta.Data = 1;
                jsonRespuesta.Message = "Mail successfully sent.";
            }
            catch (Exception ex)
            {
                jsonRespuesta.Success = false;
                jsonRespuesta.Data = 0;
                jsonRespuesta.Message = "Mail could not be sent: " + ex.ToString();
                throw;
            }

            return Json(jsonRespuesta, JsonRequestBehavior.AllowGet);
        }

        public string GetRequerimientosMasivoForEnvioCorreo() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            string data = bl.get_Data("uspGetReqMasivoForEnvioCorreo", par, true, Util.ERP);

            List<DataGeneral> lstDataGeneral = new List<DataGeneral>();
            lstDataGeneral = JsonConvert.DeserializeObject<List<DataGeneral>>(data);

            List<requerimiento> lstRequeriento = new List<requerimiento>();
            lstRequeriento = JsonConvert.DeserializeObject<List<requerimiento>>(lstDataGeneral[0].requerimiento);
            List<Archivo> lstArchivosReq = new List<Archivo>();
            lstArchivosReq = JsonConvert.DeserializeObject<List<Archivo>>(lstDataGeneral[0].archivos);
            string fileServer = ConfigurationManager.AppSettings["FileServer"].ToString();

            //JArray jsonArrayArchivos = JArray.Parse(lstDataGeneral[0].archivos);
            //var lstArchivosReq = jsonArrayArchivos.ToArray();

            foreach (var item in lstRequeriento)
            {
                // CREAR LAS IMAGENES
                byte[] img = new byte[0];
                string rutaImg = "";
                if (item.imagenweb_estilo != "")
                {
                    rutaImg = "erp/style/thumbnail/";
                    string rutaImg_Destino = Server.MapPath("~/Content/temp_filecorreo/") + item.guid_img;
                    img = System.IO.File.ReadAllBytes(@fileServer + rutaImg + item.imagenweb_estilo);
                    //System.IO.File.WriteAllBytes(@rutaImg_Destino, img);
                    item.base64imagenestilo = Convert.ToBase64String(img);
                }
                else {
                    rutaImg = Server.MapPath("~/Content/img/sinimagen.jpg");
                    img = System.IO.File.ReadAllBytes(rutaImg);
                    item.base64imagenestilo = Convert.ToBase64String(img);
                }
            }
            lstDataGeneral[0].requerimiento = JsonConvert.SerializeObject(lstRequeriento);

            long sizetotal = 0;
            if (lstArchivosReq != null)
            {
                foreach (var item in lstArchivosReq)
                {
                    var nombrearchivo = item.nombrearchivo;
                    //var byte_archivo = System.IO.File.ReadAllBytes(@fileServer + "erp/ddp/" + nombrearchivo);
                    FileInfo fi = new FileInfo(@fileServer + "erp/ddp/" + nombrearchivo);
                    long size = fi.Length;
                    if (size > 0)
                    {
                        item.size = size;
                        sizetotal += size;
                    }
                }
                lstDataGeneral[0].archivos = JsonConvert.SerializeObject(lstArchivosReq);
            }

            lstDataGeneral[0].size_totalarchivosadjuntos = sizetotal;

            string datareturn = JsonConvert.SerializeObject(lstDataGeneral);

            return datareturn;
        }

        [HttpPost]
        public ActionResult Pdf_Export_Save(string contentType, string base64, string fileName)
        {
            byte[] fileContents = Convert.FromBase64String(base64);
            System.IO.File.WriteAllBytes(Server.MapPath("~/Content/temp_filecorreo/" + fileName), fileContents);
            return File(Server.MapPath("~/Content/temp_filecorreo/" + fileName), contentType, fileName);
        }

        //public static string unescape(string code)
        //{
        //    var str = Regex.Replace(code, @"\+", "\x20");
        //    str = Regex.Replace(str, @"%([a-fA-F0-9][a-fA-F0-9])", new MatchEvaluator((mach) => {
        //        var _tmp = mach.Groups[0].Value;
        //        var _hexC = mach.Groups[1].Value;
        //        var _hexV = int.Parse(_hexC, System.Globalization.NumberStyles.HexNumber);
        //        return ((char)_hexV).ToString();
        //    }));

        //    return str;
        //}

        public string EnviarCorreoRequerimientoMasivo()
        {
            string par = Utils.unescape(_.Post("par"));
            string fileadjunto = _.Post("fileadjunto_generadopdf");
            string html_req_seleccionado = _.Post("html_req_seleccionados");

            string copiaoculta = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();

            par = _.addParameter(par, "codigo_usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "correo_usuario", _.GetUsuario().Correo);
            par = _.addParameter(par, "copia_hide_mail", copiaoculta.Replace(',', ';'));

            string rutacompleta_archivo = @"\\" + urlFileServer_general + "\\erp\\ddp\\";
            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
            string files_requerimientos = _.Get_Par(par, "files_requerimientos");
            string fileadjunto_generadopdf = _.Get_Par(fileadjunto, "fileadjunto");

            string file_attachments_mail = fileadjunto_generadopdf;

            string[] arrfilesreq = new string[] { };
            if (files_requerimientos != "") {
                arrfilesreq = files_requerimientos.Split(';');
            }

            if (arrfilesreq.Length > 0) {
                for (int i = 0; i < arrfilesreq.Length; i++)
                {
                    if (arrfilesreq[i] != "") {
                        string[] arr_nombrefile = new string[] { };
                        string nombrearchivooriginal, nombrearchivo;
                        arr_nombrefile = arrfilesreq[i].Split('|');
                        nombrearchivooriginal = arr_nombrefile[0];
                        nombrearchivo = arr_nombrefile[1];
                        string[] arr_nombrearchivosinextension = new string[3];
                        string[] arr_nombrearchivooriginal_extension = nombrearchivooriginal.Split('.');
                        arr_nombrearchivosinextension[0] = nombrearchivooriginal.Split('.')[0];
                        arr_nombrearchivosinextension[1] = nombrearchivo.Split('.')[0];
                        arr_nombrearchivosinextension[2] = arr_nombrearchivooriginal_extension[arr_nombrearchivooriginal_extension.Length - 1]; //nombrearchivooriginal.Split('.')[1];
                        string nombrearchivoconcatenado = arr_nombrearchivosinextension[0] + "_" + arr_nombrearchivosinextension[1] + "." + arr_nombrearchivosinextension[2];
                        string ruta_archivo = rutacompleta_archivo + nombrearchivo;
                        byte[] archivo = System.IO.File.ReadAllBytes(ruta_archivo);

                        file_attachments_mail += ";" + nombrearchivoconcatenado;

                        System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, nombrearchivoconcatenado), archivo);
                    }
                }
            }

            par = _.addParameter(par, "file_attachments_mail", file_attachments_mail);

            //Server.MapPath("~/Content/");
            //string asunto = _.Get_Par(par, "asunto");
            //string to = _.Get_Par(par, "to");
            //string mail_cc = _.Get_Par(par, "cc");
            //string body = _.Get_Par(par, "body");
            //string fileattachment = _.Get_Par(par, "adjunto");
            //string filerequerimientoadjunto = _.Get_Par(par, "filerequerimiento");

            //NotificadorCorreo notificadorCorreo = new NotificadorCorreo();
            //string correoFrom = _.GetUsuario().Correo;
            //string[] arrayArchivosAdjunto;
            //string rutafile = Server.MapPath("~/Content/temp_filecorreo");
            //rutafile = @rutafile + "/" + filerequerimientoadjunto;

            var xd = "hola demo";

            blMantenimiento bl = new blMantenimiento();
            int rows = bl.save_Row("usp_SendEmailCorreoMasivoCSV", par, Util.ERP);
            string mensaje = _.Mensaje("sendmail", (rows > 0));
            return mensaje;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_CorreoRequerimiento()
        {
            string par = _.Post("par");
            string files_requerimientos = _.Get_Par(par, "files_requerimientos");

            string rutacompleta_archivo = @"\\" + urlFileServer_general + "\\erp\\ddp\\";
            string ruta_downloadfile = Server.MapPath("~/Content/temp_filecorreo/");
            string file_attachments_mail = "";
            string[] arrfilesreq = new string[] { };
            if (files_requerimientos != "")
            {
                arrfilesreq = files_requerimientos.Split(';');
            }

            double sizemaximoarchivo = double.Parse(ConfigurationManager.AppSettings["sizemaximoarchivo_correo"]);
            long filesize = 0;
            string data = "";

            if (arrfilesreq.Length > 0)
            {
                for (int i = 0; i < arrfilesreq.Length; i++)
                {
                    if (arrfilesreq[i] != "")
                    {
                        string[] arr_nombrefile = new string[] { };
                        string nombrearchivooriginal, nombrearchivo;
                        arr_nombrefile = arrfilesreq[i].Split('|');
                        nombrearchivooriginal = arr_nombrefile[0];
                        nombrearchivo = arr_nombrefile[1];
                        string[] arr_nombrearchivosinextension = new string[3];
                        string[] arr_nombrearchivooriginal_extension = nombrearchivooriginal.Split('.');
                        arr_nombrearchivosinextension[0] = nombrearchivooriginal.Split('.')[0];
                        arr_nombrearchivosinextension[1] = nombrearchivo.Split('.')[0];
                        arr_nombrearchivosinextension[2] = arr_nombrearchivooriginal_extension[arr_nombrearchivooriginal_extension.Length - 1]; //nombrearchivooriginal.Split('.')[1];
                        string nombrearchivoconcatenado = arr_nombrearchivosinextension[0] + "_" + arr_nombrearchivosinextension[1] + "." + arr_nombrearchivosinextension[2];
                        string ruta_archivo = rutacompleta_archivo + nombrearchivo;
                        byte[] archivo = System.IO.File.ReadAllBytes(ruta_archivo);
                        filesize += new FileInfo(ruta_archivo).Length;

                        if (i == arrfilesreq.Length - 1) {
                            file_attachments_mail += nombrearchivoconcatenado;
                        } else {
                            file_attachments_mail += nombrearchivoconcatenado + ";";
                        }

                        System.IO.File.WriteAllBytes(string.Format("{0}{1}", ruta_downloadfile, nombrearchivoconcatenado), archivo);
                    }
                }
            }

            double tamanioarchivos = (filesize / 1024f) / 1024f;
            if (tamanioarchivos > sizemaximoarchivo)
            {
                data = "Fail";
            }
            else
            {
                par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
                par = _.addParameter(par, "pArchivos", file_attachments_mail);
                blMantenimiento oMantenimiento = new blMantenimiento();
                data = oMantenimiento.get_Data("DesarrolloProducto.usp_Insert_CorreoRequerimiento", par, false, Util.ERP);
            }

            return data != null ? data : string.Empty;
        }

        /* Luis */
        [AccessSecurity]
        public ActionResult ReqView() {
            return View();
        }

        [AccessSecurity]
        public ActionResult ReqNew()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult ReqEdit()
        {
            return View();
        }
        
        public string Requerimiento_GetDataCombos()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString().Trim());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloProducto.usp_Requerimiento_GetDataCombos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Requerimiento_List()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString().Trim());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloProducto.usp_Requerimiento_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

    }
}