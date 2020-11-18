using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using System.IO;
using System.Configuration;
using Utilitario;
using Utilitario.Imagen;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class CotizarTelaController : Controller
    {
        // GET: DesarrolloTextil/CotizadorTela
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult NuevaSolicitud()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult Historial()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult BuscadorCotizacion()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _AprobarRechazarCotizacion()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _AsignarCotizacion()
        {
            return View();
        }

        public string GetData_Inicial()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_GetDataInicial_Cotizar_Tela", par, true, Util.ERP);
            return data;
        }

        public string GetData_BuscarATX()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Buscar_ATX", par, true, Util.ERP);
            return data;
        }

        public string Save_New_CotizarTela()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            int id = bl.save_Rows_Out("DesarrolloTextil.usp_Insert_OrdenCotizarTela", par, Util.ERP);
            string mensaje = _.Mensaje("new", id > 0, null, id); ;
            return mensaje;
        }

        public string Save_Edit_CotizarTela()
        {
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Row("DesarrolloTextil.usp_Edit_OrdenCotizarTela", parhead, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string GetData_Edit_Cotizar_Tela()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("DesarrolloTextil.usp_GetEdit_OrdenCotizarTela", par, true, Util.ERP);
            return data;
        }

        public string GetAll_Cotizar_Tela()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("DesarrolloTextil.usp_GetAll_OrdenCotizarTela", par, true, Util.ERP);
            return data;
        }

        public string Eliminar_OrdenCotizacion()
        {
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("par");
            parhead = _.addParameter(parhead, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Row("DesarrolloTextil.usp_Delete_OrdenCotizarTela", parhead, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;            
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_ListaATXCodigoTela()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_ATXCodigoTela", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_SolicitudCotizarTela()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Insert_SolicitudCotizarTela", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string Delete_SolicitudCotizarTela()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Delete_SolicitudCotizarTela", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_SolicitudCotizarTela()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_SolicitudCotizarTela", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string Get_SolicitudCotizarTela()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "idrol", _.GetUsuario().Roles);
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Get_SolicitudCotizarTela", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string EditData_CotizarTelaReprocesar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Edit_CotizarTelaReprocesar", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_CotizarTelaHistorial()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_SolicitudCotizarTelaHistorial", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string SaveData_FormaHilado()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario.ToString());
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Insert_FormaHilado", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string GetData_CambiarEstado()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string correo_oculto = ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "correooculto", correo_oculto);
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Get_CambiarEstadoCotizacion", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_CotizarDuplicados()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_Get_SolicitudCotizarDuplicados", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_DetallesCotizacion()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_DetallesCotizacion", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}