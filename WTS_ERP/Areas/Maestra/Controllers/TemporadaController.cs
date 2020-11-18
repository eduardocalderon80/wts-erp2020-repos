using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Maestra.Models;
using WTS_ERP.Areas.Maestra.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class TemporadaController : Controller
    {
        private readonly IClienteTemporadaService _clienteTemporadaService;

        public TemporadaController(IClienteTemporadaService clienteTemporadaService)
        {
            this._clienteTemporadaService = clienteTemporadaService;
        }

        // GET: Maestra/Temporada
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// parameters: par => [IdCliente = 0]
        /// </summary>
        /// return : data CSV
        public string GetAll_ClienteTemporadaByCliente()
        {
            string IdCliente = _.Get("par");
            string data = _clienteTemporadaService.GetAll_ClienteTemporadaByCliente_Json(IdCliente);
            return data;
        }

        /// <summary>
        /// parameters: par => {IdCliente:'',NombreTemporada:''}
        /// return : objeto.data
        /// </summary>        
        public string SaveNew_ClienteTemporada()
        {
            string mensaje = "";
            string sParModelo = _.Post("par");
            sParModelo = _.addParameter(sParModelo, "UsuarioCreacion", _.GetUsuario().Usuario);
            ClienteTemporada modelo = JsonConvert.DeserializeObject<ClienteTemporada>(sParModelo);
            TryValidateModel(modelo);
            if (!ModelState.IsValid)
            {
                return mensaje = _.Mensaje("new", false, null, -1);
            }

            string IdCliente = modelo.IdCliente.ToString();
            int IdClienteTemporada = Convert.ToInt32(_clienteTemporadaService.SaveNew_ClienteTemporada(modelo));
            string dataCSV = _clienteTemporadaService.GetAll_ClienteTemporadaByCliente_Json(IdCliente);
            mensaje = _.Mensaje("new", IdClienteTemporada > 0, dataCSV, IdClienteTemporada);
            return mensaje;
        }
    }
}