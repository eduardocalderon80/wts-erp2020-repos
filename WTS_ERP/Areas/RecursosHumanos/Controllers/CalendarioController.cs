using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class CalendarioController : Controller
    {
        // GET: RecursosHumanos/Calendario
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_Calendario()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "idpersonal", Convert.ToString(_.GetUsuario().IdPersonal));
            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_Calendario", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}