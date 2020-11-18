using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class FacturacionSampleController : Controller
    {
        private readonly IFacturacionSampleInicial _facturacionSampleInicial;
        public FacturacionSampleController(IFacturacionSampleInicial facturacionSampleInicial)
        {
            this._facturacionSampleInicial = facturacionSampleInicial;
        }

        // GET: Requerimiento/FacturacionSample
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _Inicio()
        {
            return View();
        }

    
        public string GetRequerimientoMuestraFacturacionInicial_JSON()
        {
            int idPrograma = Convert.ToInt32(_.Get("IdPrograma"));
            return _facturacionSampleInicial.GetRequerimientoMuestraFacturacionInicial_JSON(idPrograma);
        }

        public string SaveUpdateRequerimientoMuestraFacturacionInicialJSON()
        {
            string sParRequerimientoModel = _.Post("RequerimientosJSON");
            List<RequerimientoMuestraViewModels> listaRequerimiento = JsonConvert.DeserializeObject<List<RequerimientoMuestraViewModels>>(sParRequerimientoModel);
            int rows = _facturacionSampleInicial.SaveUpdateRequerimientoMuestraFacturacionInicialJSON(listaRequerimiento);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }
    }
}