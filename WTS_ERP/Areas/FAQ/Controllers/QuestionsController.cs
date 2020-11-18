using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.FAQ.Controllers
{
    public class QuestionsController : Controller
    {
        // GET: FAQ/Questions
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_Questions()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("FAQ.usp_GetAll_Questions", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_Questions()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("FAQ.usp_Insert_Questions", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}