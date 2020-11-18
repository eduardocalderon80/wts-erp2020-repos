using System.Collections.Generic;
using System.Web.Mvc;
using WTS_ERP.Models;
using BE_ERP;
using BE_ERP.Laboratorio;
using BL_ERP;
using BL_ERP.Laboratorio;
using Newtonsoft.Json;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;
using Microsoft.Reporting.WebForms;
using System;
using System.Configuration;
using System.Linq;

namespace WTS_ERP.Areas.Laboratorio.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: Laboratorio/DashBoard
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Initial()
        {
            return View();
        }

        public ActionResult DashBoard_Primary()
        {
            return View();
        }

        public ActionResult DashBoard_Second()
        {
            return View();
        }

        public ActionResult DashBoard_Third()
        {
            return View();
        }

        public string DashBoard_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string par = _.Get("par");
            string data = oMantenimiento.get_Data("usp_Laboratorio_DashBoard_List", "", true, Util.Intranet);
            return data != null ? data : string.Empty;
        }
         
        /* Primary */
        public string Get_Cantidad_Pruebas_Mensual()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("Laboratorio.usp_DashBoard_Get_Cantidad_Pruebas_Mensual", "", true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Cantidad_Pruebas_PaquetePrueba_Mes()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("Laboratorio.usp_DashBoard_Get_Cantidad_Pruebas_PaquetePrueba_Mes", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Second */
        public string Get_Leadtime_Paqueteprueba_Mensual()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("Laboratorio.usp_DashBoard_Get_Leadtime_PaquetePrueba_Mensual", "", true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Third */
        public string Get_Pruebas_Dentro_LeadTime_Mensual()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("Laboratorio.usp_DashBoard_Get_Pruebas_Dentro_LeadTime_Mensual", "", true, Util.ERP);
            return data != null ? data : string.Empty;
        }

    }
}