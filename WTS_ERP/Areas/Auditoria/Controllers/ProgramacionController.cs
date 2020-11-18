
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Text;
using System.IO;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using System.Net.Mime;
using WTS_ERP.Models;
using BL_ERP;
using BE_ERP;
using Excel;
using Utilitario;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Dynamic;

namespace WTS_ERP.Areas.TecnologiaInformacion.Controllers
{
    public class ProgramacionController : Controller
    {
        // GET: TecnologiaInformacion/Planner
        public ActionResult Index()
        {
            return View();
        }

        public string Upload_Programacion()
        {
            _Helper helper = new _Helper();
            string path = helper.Upload_file(Request.Files["archivo"]);

            DataTable tabla = !String.IsNullOrEmpty(path) ? helper.convertExceltoDataSet(path) : null;
            string data = (tabla != null && tabla.Rows.Count > 0) ? helper.convertDataTabletoCSV(tabla, '¬', '^') : string.Empty;

            JObject obj = new JObject();
            obj.Add("data", data);

            return obj.ToString();
        }


        public string TransformarData_ProgramacionExcel()
        {
            string data = _.Post("dataCSV");
            _Helper helper = new _Helper();
            ParametrosReporteExcel parametroExcel = new ParametrosReporteExcel
            {
                DataCSV = data,
                ContieneEstructura = false,
                NombreArchivo = "Reporte Planner.xlsx",
                NombreHoja = "Resumen"
            };
            byte[] byteExcel = ExportacionExcel.GenerarExcelfromCSV(parametroExcel);
            string path = helper.GetPathUpload(parametroExcel.NombreArchivo);
            System.IO.File.WriteAllBytes(path, byteExcel);

            JObject obj = new JObject();
            obj.Add("nameFile", parametroExcel.NombreArchivo);
            obj.Add("path", path);

            return obj.ToString();
        }


        public FileResult DonwloadPlannerExcel(string path, string nameFile)
        {
            if (path.Trim().Length > 0)
            {
                if (System.IO.File.Exists(path))
                {                    
                    string ruta = Server.MapPath(String.Format("~/{0}/{1}", Util.RutaUpload, nameFile));                    
                    byte[] byteExcel = System.IO.File.ReadAllBytes(ruta);
                    return File(byteExcel, MediaTypeNames.Application.Octet, nameFile);
                }
            }
            return null;
        }


    }
}