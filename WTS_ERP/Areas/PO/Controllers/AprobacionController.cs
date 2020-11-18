using System;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.PO.Controllers
{
    public class AprobacionController : Controller
    {
        // GET: PO/Aprobacion
        public ActionResult ValidacionPasswordAprobacion()
        {
            return View();
        }
        public string validarCredencialesAprobacion()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("uspSolicitudValidarCredenciales_Aprobacion_PO", par, true, Util.ERP);
            return result;
        }
    }
}