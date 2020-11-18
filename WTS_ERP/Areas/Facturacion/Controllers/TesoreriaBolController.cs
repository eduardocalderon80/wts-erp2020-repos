using BE_ERP;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using Utilitario;
using WTS_ERP.Areas.Facturacion.Models;
using WTS_ERP.Areas.Facturacion.Services;
using WTS_ERP.Models;
/*comentario*/
namespace WTS_ERP.Areas.Facturacion.Controllers
{
    public class TesoreriaBolController : Controller
    {
        private readonly ITesoreriaBolService _tesoreriaService;

        public TesoreriaBolController(ITesoreriaBolService tesoreriaService)
        {
            this._tesoreriaService = tesoreriaService;
        }

        public ActionResult Index()
        {
            return View();
        }     

        public string GetListaTesoreriaBolIndex_JSON(string par)
        {            
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            TesoreriaBol parametro = JsonConvert.DeserializeObject<TesoreriaBol>(par);            
            return _tesoreriaService.GetListaTesoreria_Index(parametro);
        }

        public string GetListaInvoice_JSON(string par)
        {            
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            TesoreriaBol parametro = JsonConvert.DeserializeObject<TesoreriaBol>(par);
            return _tesoreriaService.GetListaInvoice(parametro);
        }

        public FileResult GetListaInvoice_Excel(string par)
        {            
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            TesoreriaBol parametro = JsonConvert.DeserializeObject<TesoreriaBol>(par);
            string data = _tesoreriaService.GetListaInvoice(parametro);
            
            ParametrosReporteExcel parametroExcel = new ParametrosReporteExcel
            {
                DataCSV = data,
                ContieneEstructura = true,
                NombreArchivo = "Reporte BOL.xlsx",
                NombreHoja = "Resumen,Resumen2"
            };
            byte[] byteExcel = ExportacionExcel.GenerarExcelfromCSV(parametroExcel);
            return File(byteExcel, MediaTypeNames.Application.Octet, parametroExcel.NombreArchivo);
        }


    }
}