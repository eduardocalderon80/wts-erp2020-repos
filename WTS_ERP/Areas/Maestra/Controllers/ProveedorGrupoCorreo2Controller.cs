using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ProveedorGrupoCorreo2Controller : Controller
    {
        // GET: Maestra/ProveedorGrupoCorreo2
        public ActionResult Index()
        {
            return View();
        }

        public string getData_index_combos() {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idgrupocomercial", _.GetUsuario().IdGrupoComercial);

            string data = bl.get_Data("usp_GetProveedorGrupoCorreo_Combos_Index_JSON", par, true, Util.ERP);
            return data;
        }
    }
}