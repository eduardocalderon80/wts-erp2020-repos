using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.TecnologiaInformacion.Controllers
{
    public class TICController : Controller
    {
        // GET: TecnologiaInformacion/TIC
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incidencias()
        {
            return View();
        }

        public string valid_SaveUser()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string strResult = "";
            string strUsuario = _.GetUsuario().IdUsuario.ToString();

            if (strUsuario == "118")
                strResult = "OK";
            else
                strResult = "HOLA";

            return strResult;
        }
    }
}