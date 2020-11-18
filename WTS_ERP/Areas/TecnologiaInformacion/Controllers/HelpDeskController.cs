using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.IO;
using System.Text;
using WTS_ERP.Models;
using BE_ERP;
using BL_ERP;
using BE_ERP.TecnologiaInformacion.HelpDesk;
using Utilitario;
using Newtonsoft.Json;
using Utilitario;
using System.Threading;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;

namespace WTS_ERP.Areas.TecnologiaInformacion.Controllers
{
    public class HelpDeskController : Controller
    {
        // GET: TecnologiaInformacion/HelpDesk
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Select()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult Update()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult Finish()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult Reject()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult Cancel()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult Configuration()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Detail()
        {
            return View();
        }

        public string HelpDesk_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";
            string data = oMantenimiento.get_Data("usp_HelpDesk_List", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string HelpDesk_Info()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = "{\"IdUsuario\":\"" + _.GetUsuario().IdUsuario.ToString() + "\"}";
            string data = oMantenimiento.get_Data("usp_HelpDesk_Info", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string HelpDesk_Master()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_HelpDesk_Master", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string HelpDesk_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_HelpDesk_Get", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string HelpDesk_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            string pardetail = _.Post("pararraprobador");
            string parsubdetail = string.Empty;
            string parfoot = _.Post("pararrfileuser");
            string detparfoot = string.Empty;
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            //Generar Lista Archivo

            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parfoot);
            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer);

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
                    objArchivo.TipoArchivo = 1;
                    objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                    objArchivo.NombreArchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string TempdesFoot = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                TempdesFoot = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        TempdesFoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        TempdesFoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                TempdesFoot += "]";
                detparfoot = TempdesFoot;
            }

            if (parfoot == "[]") { parfoot = ""; }
            if (detparfoot == "[]") { detparfoot = ""; }

            //Insertar Data
            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Insert", parhead, Util.ERP, pardetail, parsubdetail, detparfoot);

            //Guardar File Server
            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }

            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string HelpDesk_Edit()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            string pardetail = _.Post("pararray");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Edit", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public string HelpDesk_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("pararrfileticdelete");
            string detparfoot = string.Empty;
            string parsubfoot = _.Post("pararrfiletic");
            string detparsubfoot = string.Empty;
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parsubfoot);
            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer);

            int contador = 0;

            foreach (string item in Request.Files)
            {
                target = new MemoryStream();
                Imagen = new byte[0];
                var requestArchivo = Request.Files[item];

                if (listaarchivosfromjavascript.Count > 0)
                {
                    if (listaarchivosfromjavascript[contador].modificado == 1)
                    {
                        string NombreArchivoOriginal = System.IO.Path.GetFileName(requestArchivo.FileName);

                        cExtension = Path.GetExtension(requestArchivo.FileName);

                        requestArchivo.InputStream.CopyTo(target);
                        Imagen = target.ToArray();

                        string cImagenWebNombre = string.Format("{0:yyyyMMddHHmmss}{1}{2}", DateTime.Now, oAleatorio.Next(10, 100), cExtension);

                        objArchivo = new Archivo();
                        objArchivo.TipoArchivo = 2;
                        objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                        objArchivo.NombreArchivo = cImagenWebNombre;
                        objArchivo.modificado = 1;
                        objArchivo.bytearchivo = Imagen;
                        listaArchivo.Add(objArchivo);
                    }

                    contador++;
                }
            }

            string tempsubfoot = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                tempsubfoot = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        tempsubfoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        tempsubfoot += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                tempsubfoot += "]";
                detparsubfoot = tempsubfoot;
            }

            if (parfoot == "[]")
            {
                parfoot = "";
            }

            if (parsubfoot == "[]")
            {
                parsubfoot = "";
            }

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Update", parhead, Util.ERP, pardetail, parsubdetail, parfoot, detparsubfoot);

            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }


            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;

        }

        public FileResult HelpDesk_Download(string pNombreArchivoOriginal, string pNombreArchivo)
        {
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer) + pNombreArchivo;

            //string ruta = @"\\" + urlFileServer + "\\erp\\ddp\\ArchivoComentario\\" + pNombreArchivoWeb;
            byte[] byteArchivo = System.IO.File.ReadAllBytes(@cFolderThumbnail);
            return File(byteArchivo, System.Net.Mime.MediaTypeNames.Application.Octet, pNombreArchivoOriginal);
        }

        public string HelpDesk_Configuration_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_HelpDesk_Configuration_List", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string HelpDesk_Categoria_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Categoria_Insert", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string HelpDesk_Categoria_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Categoria_Update", parhead, Util.ERP);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public string HelpDesk_Categoria_Delete()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Categoria_Delete", parhead, Util.ERP);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public string HelpDesk_Aprobador_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");
            string pardetail = _.Post("par_area");
            string parsubdetail = _.Post("par_modulo");

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Aprobador_Insert", parhead, Util.ERP, pardetail, parsubdetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string HelpDesk_Aprobador_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");
            string pardetail = _.Post("par_area");
            string parsubdetail = _.Post("par_modulo");
            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Aprobador_Update", parhead, Util.ERP, pardetail, parsubdetail);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        public string HelpDesk_Aprobador_Delete()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_HelpDesk_Aprobador_Delete", parhead, Util.ERP);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }

        /* V2*/
        [AccessSecurity]
        public ActionResult Inicio()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Nuevo()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Editar()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _Rechazar()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult _Cancelar()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult _Asignar()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult _Detener()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult _Terminar()
        {
            return PartialView();
        }

        [AccessSecurity]
        public ActionResult _Observar()
        {
            return PartialView();
        }



        public string Get_Usuario_Informacion()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("HelpDesk.usp_Get_Usuario_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string List_Ticket()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("HelpDesk.usp_Ticket_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Ticket_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parsubdetail);
            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer);

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
                    objArchivo.TipoArchivo = 1;
                    objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                    objArchivo.NombreArchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string tmp_parsubdetail = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                tmp_parsubdetail = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                tmp_parsubdetail += "]";
                parsubdetail = tmp_parsubdetail;
            }
            
            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Insert", par, Util.ERP, pardetail, parsubdetail);

            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }

            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Ticket_Get()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Ticket_Insert_Comentario()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            //string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parsubdetail);
            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer);

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
                    objArchivo.TipoArchivo = 1;
                    objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                    objArchivo.NombreArchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string tmp_parsubdetail = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                tmp_parsubdetail = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                tmp_parsubdetail += "]";
                parsubdetail = tmp_parsubdetail;
            }

            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Insert_Comentario", par, Util.ERP, "", parsubdetail);

            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }            

            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Ticket_Delete_Archivo() {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Delete_Archivo", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Ticket_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            //string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            List<Archivo> listaarchivosfromjavascript = JsonConvert.DeserializeObject<List<Archivo>>(parsubdetail);
            Random oAleatorio = new Random();

            string cExtension = "";
            byte[] Imagen = new byte[0];
            MemoryStream target = new MemoryStream();
            string urlFileServer = ConfigurationManager.AppSettings["urlFileHelpDesk"].ToString();

            Archivo objArchivo = new Archivo();
            List<Archivo> listaArchivo = new List<Archivo>();

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer);

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
                    objArchivo.TipoArchivo = 1;
                    objArchivo.NombreArchivoOriginal = NombreArchivoOriginal;
                    objArchivo.NombreArchivo = cImagenWebNombre;
                    objArchivo.modificado = 1;
                    objArchivo.bytearchivo = Imagen;
                    listaArchivo.Add(objArchivo);
                }

                contador++;
            }

            string tmp_parsubdetail = string.Empty;
            contador = 0;
            int totalarchivos = listaArchivo.Count;

            if (listaArchivo.Count > 0)
            {
                tmp_parsubdetail = "[";
                foreach (var item in listaArchivo)
                {
                    contador++;
                    if (contador < totalarchivos)
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"},";
                    }
                    else
                    {
                        tmp_parsubdetail += "{" + "\"idarchivo\":\"" + item.IdArchivo.ToString() + "\",\"tipoarchivo\":\"" + item.TipoArchivo + "\",\"nombrearchivooriginal\":\"" + item.NombreArchivoOriginal + "\", \"nombrearchivo\":\"" + item.NombreArchivo + "\", \"modificado\":\"" + item.modificado.ToString() + "\"}";
                    }
                }
                tmp_parsubdetail += "]";
                parsubdetail = tmp_parsubdetail;
            }

            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Update", par, Util.ERP, "", parsubdetail);

            if (id > 0)
            {
                foreach (var item in listaArchivo)
                {
                    System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, item.NombreArchivo), item.bytearchivo);
                }
            }

            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }
        
        public string Ticket_Update_Estado_Motivo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Update_Estado_Motivo", par, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Ticket_Edit()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
                       

            int id = oMantenimiento.save_Rows_Out("HelpDesk.usp_Ticket_Edit", par, Util.ERP, pardetail);
            
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

    }
}