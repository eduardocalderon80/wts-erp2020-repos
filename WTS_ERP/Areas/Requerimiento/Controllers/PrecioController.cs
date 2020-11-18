using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class PrecioController : Controller
    {
        /// <summary>
        /// * Constructor con injeccion de dependencia
        /// </summary>
        private readonly IPrecioService _precioService;

        public PrecioController(IPrecioService precioService)
        {
            _precioService = precioService;
        }
        
        /// <summary>
        /// * Vistas Principales
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Summary()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Search()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Resume()
        {
            return View();
        }

        /// <summary>
        /// * Vistas de Fichas
        /// </summary>
        /// <returns></returns>
        [AccessSecurity]
        public ActionResult _PriceTrim()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _PriceStyle()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _PriceOrnament()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _PriceFabric()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _PriceFabricAll()
        {
            return View();
        }

        /// <summary>
        /// * Metodos de Precios
        /// </summary>
        /// <returns></returns>
        [AccessSecurity]
        [HttpGet]
        public string GetFlashCostByProgram()
        {
            string par = _.Get("par");
            return _precioService.GetFlashCostByProgram(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetFlashCost()
        {
            string par = _.Get("par");
            return _precioService.GetFlashCost(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllFlashCost_New()
        {
            string par = _.Get("par");
            return _precioService.GetAllFlashCost_New(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllFlashCost()
        {
            string par = _.Get("par");
            return _precioService.GetAllFlashCost(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetPrecioAvios()
        {
            string par = _.Get("par");
            return _precioService.GetPrecioAvios(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetPrecioEstilo()
        {
            string par = _.Get("par");
            return _precioService.GetPrecioEstilo(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetPrecioArte()
        {
            string par = _.Get("par");
            return _precioService.GetPrecioArte(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetPrecioTela()
        {
            string par = _.Get("par");
            return _precioService.GetPrecioTela(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllPrecioTela()
        {
            string par = _.Get("par");
            return _precioService.GetAllPrecioTela(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string InsertPrecioAvio()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.InsertPrecioAvio(sParModel);
            string mensaje = _.Mensaje("new", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string InsertPrecioArte()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.InsertPrecioArte(sParModel);
            string mensaje = _.Mensaje("new", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string InsertPrecioEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.InsertPrecioEstilo(sParModel);
            string mensaje = _.Mensaje("new", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string InsertPrecioTela()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.InsertPrecioTela(sParModel);
            string mensaje = _.Mensaje("new", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeletePrecioTela()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.DeletePrecioTela(sParModel);
            string mensaje = _.Mensaje("remove", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string InsertRequerimientoFlashCost()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.InsertRequerimientoFlashCost(sParModel);
            string mensaje = _.Mensaje("remove", IdReturn != "", IdReturn, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeletePrice()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdReturn = _precioService.DeletePrice(sParModel);
            string mensaje = _.Mensaje("remove", IdReturn != "", IdReturn, 0);
            return mensaje;
        }
    }
}