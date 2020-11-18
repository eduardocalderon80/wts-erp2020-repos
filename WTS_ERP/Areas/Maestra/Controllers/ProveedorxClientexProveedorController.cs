using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ProveedorxClientexProveedorController : Controller
    {
        // GET: Maestra/ProveedorxClientexProveedor
        public ActionResult Index()
        {
            return View();
        }

        public string getData_IndexInit()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            par = par.Trim().Length == 0 ? _.GetUsuario().IdGrupoComercial : par;
            string data = blm.get_Data("usp_ProveedorxClientexGrupoComercial_init", par, true, Util.ERP);
            return data;
        }

        public string Save_New_Update() {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            //int idgrupocomercial = int.Parse(_.Get_Par(par, "idgrupocomercial"));
            //int idcliente = int.Parse(_.Get_Par(par, "idcliente"));

            string pardetail = _.Post("pardetail");
            int totalregistrosguardados = blm.save_Rows_Out("usp_Save_New_Update_ProveedorClienteGrupoComercial", par, Util.ERP, pardetail, "", "");
            string mensaje = _.Mensaje("edit", totalregistrosguardados > 0, blm.get_Data("usp_GetProveedorClienteGrupoComercial_BuscarByGrupoComercial_Cliente", par, true, Util.ERP));
            return mensaje;
        }

        public string Search_ProveedorClienteGrupoComercial()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("usp_GetProveedorClienteGrupoComercial_BuscarByGrupoComercial_Cliente", par, true, Util.ERP);
            return data;
        }
    }
}
