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
    public class FacturacionSampleFacturaFabricaController : Controller
    {
        private readonly IFacturaFabricaService _facturaFabricaServicio;

        public FacturacionSampleFacturaFabricaController(IFacturaFabricaService facturaFabricaServicio)
        {
            this._facturaFabricaServicio = facturaFabricaServicio;   
        }

        // GET: Requerimiento/FacturacionSampleFacturaFabrica
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult _FacturaFabricaFacturacionSample()
        {
            return View();
        }

        public string GetFacturaFabricaLoadNew_JSON()
        {
            int idPrograma = Convert.ToInt32(_.Get("IdPrograma"));
            int idCliente = Convert.ToInt32(_.Get("IdCliente"));
            int idGrupoPersonal = Convert.ToInt32(_.GetUsuario().IdGrupoComercial);

            string data = _facturaFabricaServicio.GetFacturaFabricaLoadNew_JSON(idPrograma, idCliente, idGrupoPersonal);
            return data;
        }

        public string SaveNewFacturaFabrica_JSON()
        {
            string sParModelFacturaFabrica = _.Post("FacturaFabricaJSON");
            string sParModelFacturaFabricaDetalle = _.Post("FacturaFabricaDetalleJSON");

            FacturaFabricaViewModels facturaFabrica = JsonConvert.DeserializeObject<FacturaFabricaViewModels>(sParModelFacturaFabrica);
            List<FacturaFabricaDetalleViewModels> facturaFabricaDetalle = JsonConvert.DeserializeObject<List<FacturaFabricaDetalleViewModels>>(sParModelFacturaFabricaDetalle);
            facturaFabrica.Usuario = _.GetUsuario().Usuario;
            facturaFabrica.Ip = "";
            facturaFabrica.HostName = "";

            TryValidateModel(facturaFabrica);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int idFacturaFabrica = _facturaFabricaServicio.SaveNewFacturaFabrica_JSON(facturaFabrica, facturaFabricaDetalle);
            string mensaje = _.Mensaje("new", idFacturaFabrica > 0, null, idFacturaFabrica);
            return mensaje;
        }

        public string SaveEditFacturaFabrica_JSON()
        {
            string sParModelFacturaFabrica = _.Post("FacturaFabricaJSON");
            string sParModelFacturaFabricaDetalle = _.Post("FacturaFabricaDetalleJSON");

            FacturaFabricaViewModels facturaFabrica = JsonConvert.DeserializeObject<FacturaFabricaViewModels>(sParModelFacturaFabrica);
            List<FacturaFabricaDetalleViewModels> facturaFabricaDetalle = JsonConvert.DeserializeObject<List<FacturaFabricaDetalleViewModels>>(sParModelFacturaFabricaDetalle);
            facturaFabrica.Usuario = _.GetUsuario().Usuario;
            facturaFabrica.Ip = "";
            facturaFabrica.HostName = "";

            TryValidateModel(facturaFabrica);
            if (!ModelState.IsValid)
            {
                return _.Mensaje("new", false, null, -1);
            }

            int idFacturaFabrica = _facturaFabricaServicio.SaveEditFacturaFabrica_JSON(facturaFabrica, facturaFabricaDetalle);
            string mensaje = _.Mensaje("new", idFacturaFabrica > 0, null, idFacturaFabrica);
            return mensaje;
        }

        public string SaveCancelarFacturaFabrica_JSON()
        {
            int idFacturaFabrica = Convert.ToInt32(_.Post("IdFacturaFabrica"));
            string usuario = _.GetUsuario().Usuario;
            int rows = _facturaFabricaServicio.SaveCancelarFacturaFabrica_JSON(idFacturaFabrica, usuario);
            string mensaje = _.Mensaje("edit", rows > 0, null, rows);
            return mensaje;
        }

        public string GetFacturaFabricaLoadEdit_JSON()
        {
            string sPar = _.Get("par");
            sPar = _.addParameter(sPar, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial);
            string data = _facturaFabricaServicio.GetFacturaFabricaLoadEdit_JSON(sPar);
            return data;
        }
    }
}