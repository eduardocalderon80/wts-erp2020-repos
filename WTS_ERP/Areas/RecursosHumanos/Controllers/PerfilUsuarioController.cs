using BE_ERP;
using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Utilitario;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class PerfilUsuarioController : Controller
    {
        // GET: RecursosHumanos/PerfilUsuario
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult IrPerfilUsuario()
        {
            // Base64 parameter to string
            Redirection redirection = new Redirection();
            redirection.Modulo = "RecursosHumanos";
            redirection.Controlador = "PerfilUsuario";
            redirection.Vista = "Index";
            redirection.Accion = "index";
            redirection.Parametro = "";
            string json = JsonConvert.SerializeObject(redirection);
            string encrypt = Utils.EncryptString(json);
            return RedirectToAction("LoginERP", "Home", new { redirect = encrypt });
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_PerfilUsuario()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_Get_PerfilUsuario", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_PerfilUsuario()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);

            /* Inicia - Para guardar foto de personal en erp */
            string urlPersonal = ConfigurationManager.AppSettings["urlFilePersonal"].ToString();
            HttpPostedFileBase PersonalImagen = Request.Files["parimg"];
            string ImagenWebNombre = "";
            string dni = _.Get_Par(par, "dni");
            if (PersonalImagen != null)
            {
                string cImagenWeb = "";
                Utilitario.Imagen.Imagen oImagen = new Utilitario.Imagen.Imagen();
                string cRutaImagenWeb = Server.MapPath("~" + urlPersonal);
                MemoryStream target = new MemoryStream();
                PersonalImagen.InputStream.CopyTo(target);
                byte[] Imagen = target.ToArray();
                byte[] ImagenWeb = oImagen.DevolverImagenOptimizada(Imagen);
                string cExtension = "";
                cExtension = System.IO.Path.GetExtension(PersonalImagen.FileName);
                string cFolderThumbnail = cRutaImagenWeb;
                cImagenWeb = dni + cExtension;
                System.IO.File.WriteAllBytes(string.Format("{0}{1}", cFolderThumbnail, cImagenWeb), ImagenWeb);
                ImagenWebNombre = cImagenWeb;
            }
            /* Termina - Para guardar foto de personal en erp */

            par = _.addParameter(par, "imagenwebnombre", ImagenWebNombre);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_PerfilUsuario", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}