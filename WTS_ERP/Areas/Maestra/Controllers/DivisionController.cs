using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Maestra.Models;
using WTS_ERP.Models;
using WTS_ERP.Areas.Maestra.Services;
using Newtonsoft.Json;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class DivisionController : Controller
    {
        private readonly IClienteDivisionService _clienteDivisionService;

        public DivisionController(IClienteDivisionService clienteDivisionService)
        {
            this._clienteDivisionService = clienteDivisionService;
        }
               
        // GET: Maestra/Division
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// parameters: par => [IdCliente = 0]
        /// </summary>
        /// <returns></returns>
        public string GetAll_ClienteDivisionByCliente()
        {
            string IdCliente = _.Get("par");
            string data = _clienteDivisionService.GetAll_ClienteDivisionByCliente_Json(IdCliente);
            return data;
        }

        /// <summary>
        /// parameters: par => {IdCliente:'',NombreDivision:''}
        /// return : objeto.data
        /// </summary>        
        public string SaveNew_ClienteDivision()
        {
            string mensaje = ""; ;
            string sParModelo = _.Post("par");
            sParModelo = _.addParameter(sParModelo, "UsuarioCreacion", _.GetUsuario().Usuario);
            sParModelo = _.addParameter(sParModelo, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial);
            ClienteDivision modelo = JsonConvert.DeserializeObject<ClienteDivision>(sParModelo);
            TryValidateModel(modelo);
            if (!ModelState.IsValid)
            {
                //return Convert.ToString(-1);
                return mensaje = _.Mensaje("new", false, null, -1);
            }
            string IdCliente = modelo.IdCliente.ToString();
            int IdClienteDivision = Convert.ToInt32(_clienteDivisionService.SaveNew_ClienteDivision(modelo));
            string DataCSV = _clienteDivisionService.GetAll_ClienteDivisionByCliente_Json(IdCliente);
            mensaje = _.Mensaje("new", IdClienteDivision > 0, DataCSV, IdClienteDivision);
            return mensaje;
        }
    }
}