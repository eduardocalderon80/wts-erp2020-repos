using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using BE_ERP;
using Newtonsoft.Json;

namespace WTS_ERP.Controllers
{
    public class RedireccionarController : Controller
    {
        /* Luis */
        // GET: Redireccionar
        //public ActionResult loginredireccionar(string usuario, string password, string url, int idempresa)
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    var obj = new {
        //        usuario = usuario,
        //        password = password
        //    };
        //    //string par = JsonConvert.SerializeObject(obj);
        //    string par = usuario + "^" + password; //"caspillaga^claudia010";
        //    string data = oMantenimiento.get_Data("uspLogin_v2", par, true, Util.SeguridadERP);
        //    //ViewBag.data = data;

        //    int total = data.Length;
        //    string xd = data.Substring(1, total-2);

        //    beUtil util = new beUtil();
        //    util = JsonConvert.DeserializeObject<beUtil>(xd);
        //    util.control = url;

        //    //Usuario.nomUsuario = respuesta;// :falta
        //    System.Web.HttpContext.Current.Session.Add("Util", util);

        //    beUser Usuario = JsonConvert.DeserializeObject<beUser>(util.usuario);
        //    Usuario.IdEmpresa = idempresa;
        //    System.Web.HttpContext.Current.Session.Add("Usuario", Usuario);

        //    return RedirectToAction("Index", "Home");
        //}

        // GET: Redireccionar
        public ActionResult loginredireccionar(string usuarioAD, string password, string tipoaccesousuario, string url, int idempresa)
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            string par = string.Format("{0}^{1}^{2}", usuarioAD, password, tipoaccesousuario);
            //// ACTIVAR LUEGO ESTO ES PARA EL SUBMENU
            string respuesta = oMantenimiento.get_Data("usp_AccesAD", par, true, Util.SeguridadERP);
            //string respuesta = oMantenimiento.get_Data("usp_AccesAD_DELETE", par, true, Util.SeguridadERP);

            int total = respuesta.Length;
            string xd = respuesta.Substring(1, total - 2);

            beUtil util = new beUtil();
            util = JsonConvert.DeserializeObject<beUtil>(xd);
            util.control = url;
            
            System.Web.HttpContext.Current.Session.Add("Util", util);

            beUser Usuario = JsonConvert.DeserializeObject<beUser>(util.usuario);
            Usuario.IdEmpresa = idempresa;
            System.Web.HttpContext.Current.Session.Add("Usuario", Usuario);

            return RedirectToAction("Index", "Home");
        }



        //get sp_login_v2
        //session=
        //redireccionamos a la ventana correspondiente (url)

        public ActionResult redirectlogincerrarsesion(string p)
        {
            // :p = 1 = cerrar session; ORDEN DE CERRAR SESSION DESDE EL ERP 1
            if (p == "1") {
                if (System.Web.HttpContext.Current.Session["Usuario"] != null)
                {
                    System.Web.HttpContext.Current.Session["Usuario"] = null;
                    System.Web.HttpContext.Current.Session.Abandon();
                    System.Web.HttpContext.Current.Session.Clear();
                }
            }
            
            return View();
        }

    }
}