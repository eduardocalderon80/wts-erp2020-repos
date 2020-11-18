using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class ConfiguracionController : Controller
    {
        // GET: RecursosHumanos/Configuracion
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_Configuracion()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_Configuracion", string.Empty, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_Configuracion()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Update_Configuracion", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_GoldenTicketAsignar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_GoldenTicketAsignar", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_PermisosAsignar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_PermisosAsignar", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_VacacionesAsignar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_VacacionesAsignar", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_Feriado()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_Feriado", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}