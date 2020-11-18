using BL_ERP;
using BE_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using System.IO;
using BE_ERP.TecnologiaInformacion.HelpDesk;
using BL_ERP.RecursosHumanos;
using Newtonsoft.Json;
using System.Configuration;
using System.Text;
using Utilitario;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class LicenciasController : Controller
    {
        // GET: RecursosHumanos/Licencias        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        // GET: Redireccionar
        public ActionResult ConfirmarLicencias(string id)
        {
            // Base64 parameter to string
            byte[] data = Convert.FromBase64String(id);
            string decodedString = Encoding.UTF8.GetString(data);
            Redirection redirection = new Redirection();
            redirection.Modulo = "RecursosHumanos";
            redirection.Controlador = "Licencias";
            redirection.Vista = "New";
            redirection.Accion = "edit";
            redirection.Parametro = decodedString;
            string json = JsonConvert.SerializeObject(redirection);
            string encrypt = Utils.EncryptString(json);
            return RedirectToAction("LoginERP", "Home", new { redirect = encrypt });
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_Inicial()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idcategoria", "4");
            string data = oMantenimiento.get_Data("GestionTalento.usp_Get_Licencias", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_Licencias()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "idpersonal", Convert.ToString(_.GetUsuario().IdPersonal));
            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_Licencias", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string GetAllData_FechasCoincidentes_Vacaciones()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "idpersonal", Convert.ToString(_.GetUsuario().IdPersonal));

            //par = _.addParameter(par, "rdfechas", "2");
            //par = _.addParameter(par, "fechainicio", "20191021");
            //par = _.addParameter(par, "fechafin", "20191031");
            //par = _.addParameter(par, "fechas", "");

            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_FechasCoincidentes", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string InsertData_Licencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string par = _.Post("par");
            string parhead = _.Post("par");
            string pardetail = _.Post("pararraprobador");
            string parsubdetail = string.Empty;
            string parfoot = _.Post("pararrfileuser");
            string detparfoot = string.Empty;

            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            parhead = _.addParameter(parhead, "idarea", Convert.ToString(_.GetUsuario().IdArea));

            //Guardar File Server            
            blGestionTalento oGestiontalento = new blGestionTalento();
            string urlFileServer = @"\\" + ConfigurationManager.AppSettings["urlGestionTalento"].ToString() + "Licencias\\";
            string cFolderThumbnail = urlFileServer;
            detparfoot = oGestiontalento.GestionTalento_GuardarArchivos(parfoot, detparfoot, cFolderThumbnail);

            //Insertar Data            
            //string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_Permiso", par, false, Util.ERP);
            string data = oMantenimiento.save_Rows_Out("GestionTalento.usp_Insert_Licencia", parhead, Util.ERP, pardetail, parsubdetail, detparfoot).ToString();

            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string UpdateData_Licencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            string data = oMantenimiento.get_Data("GestionTalento.usp_Update_Licencia", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        public FileResult Download_Licencia(string pNombreArchivoOriginal, string pNombreArchivo)
        {
            string urlFileServer = ConfigurationManager.AppSettings["urlGestionTalento"].ToString() + "Licencias/";

            string cFolderThumbnail = Server.MapPath("~" + urlFileServer) + pNombreArchivo;

            //string ruta = @"\\" + urlFileServer + "\\erp\\ddp\\ArchivoComentario\\" + pNombreArchivoWeb;
            byte[] byteArchivo = System.IO.File.ReadAllBytes(@cFolderThumbnail);
            return File(byteArchivo, System.Net.Mime.MediaTypeNames.Application.Octet, pNombreArchivoOriginal);
        }
    }
}