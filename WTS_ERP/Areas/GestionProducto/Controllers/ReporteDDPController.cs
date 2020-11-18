using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using BE_ERP;
 using BL_ERP.GestionProducto;


namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class ReporteDDPController : Controller
    {
        // GET: GestionProducto/ReporteDDP
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        public string GetData()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Requerimiento_ReporteDDP", par, true, Util.ERP);
            return data;
        }

        public JsonResult Export_ReporteDDP()
        {
            var jsonsession = new JsonResponse();

            string par = _.Get("par");

            var respuesta = new JsonResponse();
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Requerimiento_ReporteDDP", par, false, Util.ERP);

            blReporte Reporte = new blReporte();
            
            string strListaCabeceraTabla = string.Empty, strDatosFilasTabla = string.Empty, strTituloDocumento = string.Empty, strEstado = string.Empty;
             
            string TituloHoja = "Reporte";
              
            string strFecha = DateTime.Now.ToString("MM/dd/yyyy");

            strTituloDocumento = "Reporte";

            strListaCabeceraTabla = "#REQ¬#SUBMIT¬TYPE¬TEAM¬CLIENT¬SEASON¬DIVSION¬STYLE¬FABRIC 1¬FACTORY¬COLOR¬SIZE¬QTY¬COUNTERSAMPLE¬REMAINING QTY¬REMAINING COUNTERSAMPLE¬EX FACTORY¬CLIENT IN HOUSE¬MAX EXFTY¬REGISTER DATE¬FTY WEEK¬SHIPPED UNITS¬STATUS REQ¬TODAY VS EX FTY";
              
            byte[] filecontent = Reporte.Excel_ReporteDDP(TituloHoja, strListaCabeceraTabla, data, strTituloDocumento);
             
            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excel"] = jsonsession;

            if (filecontent != null)
            {
                respuesta.Success = true;
                respuesta.Message = "Exito";
            }
            else {                 
                    respuesta.Success = false;
                    respuesta.Message = "False";                
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public FileContentResult descargarexcel()
        {
            blReporte Reporte = new blReporte();
            byte[] filecontent;
            string tituloreporte = string.Empty;
            var jsonsession = (JsonResponse)System.Web.HttpContext.Current.Session["excel"];
            filecontent = (byte[])jsonsession.Data;
            //tituloreporte = jsonsession.Message + ".xlsx";
            tituloreporte = "Reporte DDP.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excel");
            return File(filecontent, Reporte.ExcelContentType(), tituloreporte);
        }

    }
}