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

namespace WTS_ERP.Areas.Cobranza.Controllers
{
    public class VaucherController : Controller
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

     
        public string listFiltroInicial()
        {
           
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_CobranzaParamsGet", "", true, Util.ERP);
            return data;
        }

        public string listFiltroIndex()
        {

            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_CobranzaParamsIndexGet", "", true, Util.ERP);
            return data;
        }

        public string Get_FacturaList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_CobranzaFind_list_csv", par, false, Util.ERP);
            return data;
        }

        public string Get_VaucherList()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_Vaucher_list_csv", par, false, Util.ERP);
            return data;
        }

        public string Get_vaucherInd()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Get("par");
            string data = bl.get_Data("usp_CobranzaVaucher_Ind_csv", par, false, Util.ERP);
            return data;
        }

        public ActionResult _buscarFactura()
        {
            return View();
        }

        public string Save_New()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("pardetalle");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            string usu = _.GetUsuario().Usuario.ToString();

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows_Out("usp_Vaucher_Insert_Csv", par, Util.ERP, pardetalle, parsubdetail, parfoot);

            /* string mensaje = _.Mensaje("new", id > 0, oMantenimiento.get_Data("usp_FacturaPoBol_GetById_Csv", id.ToString(), true, Util.ERP), id);*/
            string mensaje = id.ToString();
            return mensaje;
        }

        public string EliminarDetalle()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            int rows = bl.save_Row("usp_EliminarDetalleVaucher_csv", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string EliminarVaucher()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            string usu = _.GetUsuario().Usuario.ToString();

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            int rows = bl.save_Row("usp_EliminarVaucher_csv", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

      
        public FileResult DownloadReport(string par)
        {
            byte[] bytes = new byte[0];
            try
            {
                ReportViewer rpt = new ReportViewer();
                rpt.ProcessingMode = ProcessingMode.Local;
                string filename = string.Empty;
                string url = ConfigurationManager.AppSettings["ReportingServicesURL"];
                string reportPath = ConfigurationManager.AppSettings["ReportingServicesCarpetaVaucher"];  
                //string url = "http://172.16.2.73/ReportServer";
                //string reportPath = "/Reportes/Reporte_Proyecto";
                rpt.PromptAreaCollapsed = false;
                rpt.ShowCredentialPrompts = false;
                rpt.ShowParameterPrompts = false;
                rpt.ProcessingMode = Microsoft.Reporting.WebForms.ProcessingMode.Remote;
                rpt.ServerReport.ReportServerCredentials = new ReportServerCredentials();
                rpt.ServerReport.ReportServerUrl = new System.Uri(url);              

                List<ReportParameter> paramList = new List<ReportParameter>();
                paramList.Add(new ReportParameter("par", par, false));

                rpt.ServerReport.ReportPath = reportPath;
                rpt.ServerReport.SetParameters(paramList);
                while (rpt.ServerReport.IsDrillthroughReport)
                {
                    rpt.PerformBack();
                };
                Warning[] warnings;
                string[] streamIds;
                string mimeType = string.Empty;
                string encoding = string.Empty;
                string extension = string.Empty;
                bytes = rpt.ServerReport.Render("EXCELOPENXML", null, out mimeType, out encoding, out extension, out streamIds, out warnings);
            }
            catch (Exception ex)
            {
             
            }
            return File(bytes, "application/ms-excel", "Report_Vaucher.xlsx");
        }


    }
}