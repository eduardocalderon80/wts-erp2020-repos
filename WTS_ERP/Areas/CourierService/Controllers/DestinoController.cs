using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.CourierService.Controllers
{
    public class DestinoController : Controller
    {
        // GET: CourierService/Destino
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Edit()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Viewer()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _EditDireccion()
        {
            return View();
        }

        public string Destino_Get_Informacion()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Destino_Get_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Destino_List()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Destino_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Destino_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Destino_Insert", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Destino_Enabled() {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Destino_Enabled", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Destino_Get() {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Destino_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Destino_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Destino_Update", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }
        
        public string DestinoDireccion_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_DestinoDireccion_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string DestinoDireccion_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_DestinoDireccion_Update", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

    }
}