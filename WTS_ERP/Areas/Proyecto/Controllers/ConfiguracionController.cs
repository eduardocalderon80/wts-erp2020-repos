using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using BE_ERP;


namespace WTS_ERP.Areas.Proyecto.Controllers
{
    public class ConfiguracionController : Controller
    {
        // GET: Proyecto/Configuracion
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult BuscarProyecto()
        {
            blMantenimiento blm = new blMantenimiento();
            JsonResponse oresponse = new JsonResponse();
            string par = _.Get("par"); 
             
            string data = blm.get_Data("usp_Proyecto_Buscar", par, true, Util.ERP);
            oresponse.Data = data;
         
            return Json(oresponse, JsonRequestBehavior.AllowGet);
        }

        public string Guardar()
        {
            bool exito = false;

            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);

            blMantenimiento blm = new blMantenimiento();
            int nrows = blm.save_Rows("uspProyectoConfiguracion", par, Util.ERP, pardetalle, parsubdetail, parfoot);
             
            exito = nrows > 0;
          
            return _.Mensaje("add", exito);
        }

    }
}