using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class ReporteAsistenciaController : Controller
    {
        // GET: RecursosHumanos/ReporteAsistencia
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_ReporteAsistencia()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "idarea", _.GetUsuario().IdArea.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_ReporteAsistencia", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}