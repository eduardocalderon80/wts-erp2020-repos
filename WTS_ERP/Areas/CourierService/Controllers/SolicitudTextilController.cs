using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.CourierService.Controllers
{
    public class SolicitudTextilController : Controller
    {
        // GET: CourierService/SolicitudTextil
        public ActionResult Index()
        {
            return View();
        }
                
        public ActionResult New()
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

        ///* Index */
        //public string List_Informacion()
        //{
        //    string par = _.Get("par");
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_List_Informacion", par, true, Util.ERP);
        //    return data != null ? data : string.Empty;
        //}

        ///* Asignar Chofer */
        //public string Get_Programacion()
        //{
        //    string par = _.Get("par");
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Get_Programacion", par, true, Util.ERP);
        //    return data != null ? data : string.Empty;
        //}

        //public string Save_Asignar_Chofer()
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string parhead = _.Post("parhead");
        //    parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
        //    parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

        //    int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Save_Asignar_Chofer", parhead, Util.ERP);
        //    string dataResult = _.Mensaje("new", id >= 0);
        //    return dataResult;
        //}

        ///* Ver Detalle */
        //public string Get_Detalle()
        //{
        //    string par = _.Get("par");

        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string data = oMantenimiento.get_Data("CourierService.usp_Solicitud_Get_Detalle", par, true, Util.ERP);
        //    return data != null ? data : string.Empty;
        //}

        //public string Change_Vehiculo()
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string parhead = _.Post("parhead");
        //    parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
        //    parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

        //    int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Change_Vehiculo", parhead, Util.ERP);
        //    string dataResult = _.Mensaje("new", id > 0);
        //    return dataResult;
        //}

        //public string Cancel_Solicitud()
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string parhead = _.Post("parhead");
        //    parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
        //    parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

        //    int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Cancel", parhead, Util.ERP);
        //    string dataResult = _.Mensaje("new", id > 0);
        //    return dataResult;
        //}

        //public string Finish_Solicitud()
        //{
        //    blMantenimiento oMantenimiento = new blMantenimiento();
        //    string parhead = _.Post("parhead");
        //    parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
        //    parhead = _.addParameter(parhead, "usuarioactualizacion", _.GetUsuario().UsuarioAD.ToString().Trim());

        //    int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Finish", parhead, Util.ERP);
        //    string dataResult = _.Mensaje("new", id > 0);
        //    return dataResult;
        //}

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

        public string Get_Hora()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Hora", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_TipoServicio()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_TipoServicio", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Get_Vehiculo()
        {
            string par = _.Get("par");

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("CourierService.usp_Get_Vehiculo", par, true, Util.ERP);
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
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Insert_Courier", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Insert_Reunion()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");

            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("CourierService.usp_Solicitud_Insert_Reunion", parhead, Util.ERP, pardetail, parsubdetail, parfoot, parsubfoot);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

    }
}