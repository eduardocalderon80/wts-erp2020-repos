using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using BE_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult LoginERP()
        {
            return View();
        }

        public string accesoERP()
        {            
            blMantenimiento odata = new blMantenimiento();
            string par = string.Format("{0}^{1}", _.Post("usuario"), _.Post("password"));
            string respuesta = odata.get_Data("sp_Login", par, false, Util.Seguridad);
            if (respuesta != "")
            {
                beUser Usuario = new beUser();
                Usuario.CodUsuario = respuesta;
                //Usuario.nomUsuario = respuesta;// :falta
                System.Web.HttpContext.Current.Session.Add("Usuario", Usuario);
            }
            return respuesta;
        }

    }
}