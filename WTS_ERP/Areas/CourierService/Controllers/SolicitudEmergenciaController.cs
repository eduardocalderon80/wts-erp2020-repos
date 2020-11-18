using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.CourierService.Controllers
{
    public class SolicitudEmergenciaController : Controller
    {
        // GET: CourierService/SolicitudEmergencia
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
        public ActionResult _ViewDetailEmergency()
        {
            return View();
        }

        public string Get_Informacion()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Index */

        public string Get_Suma_Total()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Emergencia_Get_Sum_Total", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string List_Informacion()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Emergencia_List_Informacion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        /* Ver Detalle */
        public string Get_Detalle()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Get_Detalle", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Program_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Emergencia_Program", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Add_Costo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Emergencia_Add_Costo", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Cancel_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Emergencia_Cancel", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Finish_Solicitud()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Emergencia_Finish", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        /* Nuevo */
        public string Get_Dias()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Dias", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Servicio()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Servicio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_TipoServicio()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_TipoServicio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Hora()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Hora", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Destino()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Destino", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Direccion()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Direccion", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }
        
        public string Insert_Courier()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Emergencia_Insert_Courier", parhead, Util.ERP, pardetail, parsubdetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

       
    }
}