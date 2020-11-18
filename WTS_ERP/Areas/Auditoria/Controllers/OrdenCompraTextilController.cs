using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.Auditoria.Controllers
{
    public class OrdenCompraTextilController : Controller
    {
        // GET: Auditoria/OrdenCompraTextil
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _Insert()
        {
            return View();
        }

        public string OrdenCompraTextil_Master()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = "{\"usuarioad\":\"" + _.GetUsuario().UsuarioAD.ToString().Trim() + "\"}";
            string data = oMantenimiento.get_Data("usp_PO_OC_Master", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string OrdenCompraTextil_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuarioad", _.GetUsuario().UsuarioAD.ToString());
            string data = oMantenimiento.get_Data("usp_PO_OC_List", par, true, Util.Intranet);
            return data != null ? data : string.Empty;
        }

        public string OrdenCompraTextil_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_PO_OC_Insert", parhead, Util.Intranet, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }


    }
}