using System;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
namespace WTS_ERP.Areas.Aprobacion.Controllers
{
    public class AprobacionFabricaController : Controller
    {
        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AprobacionOCxFabrica()
        {            
            return View();
        }

        public string GetAprobacionOCxFabrica(string parFabrica=null)
        {
            string par =parFabrica ?? _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("ws_ReporteOperacionesxFabrica", par,true,Util.ERP);
            return result;
        }

        public string GrabarAprobacionOCxFabrica()
        {            
            string parHead = _.Post("parFabrica");
            string parDetail = _.Post("parJson");
            blMantenimiento oMantenimiento = new blMantenimiento();
            int idrows = oMantenimiento.save_Rows("ws_ReporteOperacionesxFabrica_Grabar", parHead, Util.ERP,parDetail);
            bool exito = idrows > 0;
            string data = exito ? GetAprobacionOCxFabrica(parHead) : string.Empty;
            string mensaje = _.Mensaje("edit", exito,data);
            return mensaje;
        }


    }
}