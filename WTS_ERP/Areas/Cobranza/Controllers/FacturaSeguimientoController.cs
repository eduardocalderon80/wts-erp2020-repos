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
using Microsoft.Reporting.WebForms;
using System.Net.Mime;

namespace WTS_ERP.Areas.Cobranza.Controllers
{
    public class FacturaSeguimientoController : Controller
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

        public ActionResult _Seguimiento()
        {
            return View();
        }

        public ActionResult _Historico()
        {
            return View();
        }

        public ActionResult _Contacto()
        {
            return View();
        }

        public ActionResult _FechaPagoFactor()
        {
            return View();
        }
        public FileResult ExportarExcel(string par)
        {            
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("usp_Cobranza_GetAllFacturasSeguimiento", par, false, Util.Intranet);

            ParametrosReporteExcel parametroExcel = new ParametrosReporteExcel
            {
                DataCSV = data,
                ContieneEstructura = true,
                NombreArchivo ="Reporte de Seguimiento.xlsx",
                NombreHoja = "Resumen"
            };
            byte[] byteExcel = ExportacionExcel.GenerarExcelfromCSV(parametroExcel);
            return File(byteExcel, MediaTypeNames.Application.Octet, parametroExcel.NombreArchivo);
        }

        public string Get_InvoiceList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Cobranza_GetAllFacturasSeguimiento", par, false, Util.Intranet);
            return data;
        }

        public string listFiltroIndex()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("[Cobranza].[usp_Getall_FiltrosSeguimiento]", "", true, Util.ERP);
            return data;
        }

        public string Get_Contacto()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("[Cobranza].[usp_Contacto_Get]", par, false, Util.ERP);
            return data;
        }

        public string GuardarSeguimiento()
        {

            string par = _.Post("par");

            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("[Cobranza].[usp_Insert_SeguimientoFactura]", par, Util.ERP, null, null, null, null);
            string mensaje = id.ToString();
            return mensaje;
        }

        public string Get_SeguimientoList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("[Cobranza].[usp_GetAll_SeguimientoList]", par, false, Util.ERP);
            return data;
        }     

        public string Get_Historico()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Cobranza_GetAllFacturasSeguimientoHistorico", par, false, Util.Intranet);
            return data;
        }

        public string GuardarFechaPagoFactor()
        {

            string par = _.Post("par");

            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_Cobranza_UpdateFechaPagoFactor", par, Util.Intranet, null, null, null, null);
            string mensaje = id.ToString();
            return mensaje;
        }


    }
}