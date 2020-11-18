using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WTS_ERP.Areas.Reporte.Controllers
{
    public class ControlAsistenciaController : Controller
    {
        // GET: Reporte/ControlAsistencia
        public ActionResult Index()
        {
            return View();
        }

        public string GetDatosCarga(string par)
        {
            string IdPersonal = ((BE_ERP.beUser)Session["Usuario"]).IdPersonal.ToString();
            par = IdPersonal + "^" + par;

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("uspTG_ReporteControlAsistencia", par.ToString(), false, Util.ERP);
            return data;
        }

    }
}