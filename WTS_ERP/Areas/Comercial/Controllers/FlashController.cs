using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using System;
using System.Text;
using BE_ERP;
using System.Web;
using System.IO;
using System.Configuration;
using Utilitario;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using BL_ERP.GestionProducto;

namespace WTS_ERP.Areas.Comercial.Controllers
{
    public class FlashController : Controller
    {
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
        public ActionResult _View()
        {
            return View();
        }

        public ActionResult _BuscarTelaFlashCost()
        {
            return View();
        }

        public ActionResult _BuscarBusquedaInteligente()
        {
            return View();
        }

        public string listFiltroInicial()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strid = _.GetUsuario().IdUsuario.ToString();
            string stridgrup = _.GetUsuario().IdGrupoComercial.ToString();
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());
            string data = oMantenimiento.get_Data("usp_FlashA_Filtros", par, true, Util.ERP);
            return data;
        }


        public string obtenerFlash()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_FlashA_Consulta", par, true, Util.ERP);
            return data;
        }




        public string listFiltroReporte()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string strid = _.GetUsuario().IdUsuario.ToString();
            string stridgrup = _.GetUsuario().IdGrupoComercial.ToString();
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());
            string data = oMantenimiento.get_Data("usp_FlashA_Reporte_Filtros", par, true, Util.ERP);
            return data;
        }

        public string Get_FlashList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            var usu = _.GetUsuario();
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());
            par = _.addParameter(par, "IdRol", _.GetUsuario().Roles.ToString());
            par = _.addParameter(par, "IdArea", _.GetUsuario().IdArea.ToString());

            string data = bl.get_Data("usp_Flash_reporte", par, false, Util.ERP);
            return data;
        }

        public string listFlashClienteComercial()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_FlashA_Cliente", par, true, Util.ERP);
            return data;
        }

        public string BuscarTelaFlashCostLoad()
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_BuscarTelaFlashCostLoad_csv", "", true, Util.ERP);

            return data;
        }

        public string GetFiltroTelaFlashCost()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_GetFiltroTelaFlashCost_csv", par, true, Util.ERP);
            return data;
        }

        public ActionResult _personalizarFabric()
        {
            return View();
        }

        public ActionResult _personalizarMensaje()
        {
            return View();
        }

        public ActionResult _videotutorialA()
        {

            return View();
        }

        public ActionResult _personalizarMargin()
        {
            return View();
        }


        public string GuardarFlash()
        {

            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = _.Post("parsubdetail");
            string parfoot = _.Post("parfoot");
            string parsubfoot = _.Post("parsubfoot");

            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "idGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_Flash_Insertar", par, Util.ERP, pardetalle, parsubdetail, parfoot, parsubfoot);

            //string mensaje = _.Mensaje("new", id > 0, null, id);
            string mensaje = id.ToString();
            return mensaje;
        }

        public string GuardarMensajeFlash()
        {

            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");

            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "idGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_Flash_Mensaje_Insertar", par, Util.ERP, pardetalle, null, null, null);

            //string mensaje = _.Mensaje("new", id > 0, null, id);
            string mensaje = id.ToString();
            return mensaje;
        }

        public string GuardarMargenFlash()
        {

            string par = _.Post("par");

            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "idGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_Flash_Margen_Insertar", par, Util.ERP, null, null, null, null);

            //string mensaje = _.Mensaje("new", id > 0, null, id);
            string mensaje = id.ToString();
            return mensaje;
        }

        public JsonResult Export_ListFlash()
        {
            var jsonsession = new JsonResponse();

            string par = _.Get("par");
            var usu = _.GetUsuario();
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdGrupoComercial", _.GetUsuario().IdGrupoComercial.ToString());
            par = _.addParameter(par, "IdRol", _.GetUsuario().Roles.ToString());
            par = _.addParameter(par, "IdArea", _.GetUsuario().IdArea.ToString());

            var respuesta = new JsonResponse();
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Flash_reporte_export", par, false, Util.ERP);

            blReporte Reporte = new blReporte();

            string strListaCabeceraTabla = string.Empty, strDatosFilasTabla = string.Empty, strTituloDocumento = string.Empty, strEstado = string.Empty;

            string TituloHoja = "Reporte";

            string strFecha = DateTime.Now.ToString("MM/dd/yyyy");

            strTituloDocumento = "Reporte";

            strListaCabeceraTabla = "Flashid¬Type¬Date¬leaderShip¬leader¬User¬Client¬Client_Status¬Style¬Description¬MinFabric¬MinColor¬MinStyle¬Structure¬CostDk¬Weight¬Width¬Efficiency¬Code¬Content¬Wash¬Stock¬AtxCode¬TypeDye¬Observation";

            byte[] filecontent = Reporte.Excel_ReporteFLASHA(TituloHoja, strListaCabeceraTabla, data, strTituloDocumento);

            jsonsession.Data = filecontent;

            System.Web.HttpContext.Current.Session["excel_flashA"] = jsonsession;

            if (filecontent != null)
            {
                respuesta.Success = true;
                respuesta.Message = "Exito";
            }
            else
            {
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
            var jsonsession = (JsonResponse)System.Web.HttpContext.Current.Session["excel_flashA"];
            filecontent = (byte[])jsonsession.Data;
            //tituloreporte = jsonsession.Message + ".xlsx";
            tituloreporte = "Flash List.xlsx";
            System.Web.HttpContext.Current.Session.Remove("excel");
            return File(filecontent, Reporte.ExcelContentType(), tituloreporte);
        }

    }
}