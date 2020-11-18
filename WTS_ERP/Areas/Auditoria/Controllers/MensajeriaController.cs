using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;

namespace WTS_ERP.Areas.Auditoria.Controllers
{
    public class MensajeriaController : Controller
    {
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult AdministrarMensajeria()
        {
            return View();
        }

        public string traerMensajes_Fabricas() {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("getFabricas_Mensaje", _.Get("par"), false, Util.QC);
            return data != null ? data : string.Empty;
        }

        public string traerMensajes()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("getMensaje", _.Get("par"), false, Util.QC);
            return data != null ? data : string.Empty;
        }

        public string grabarMensaje() {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par= _.addParameter(_.Post("par"), "idusuario", _.GetUsuario().CodUsuario.Trim());            
            bool exito = oMantenimiento.save_Row("insertMensaje", par, Util.QC) > 0;
            return _.Mensaje("new", exito);
        }

        


    }
}