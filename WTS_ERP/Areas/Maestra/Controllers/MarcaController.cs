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
    public class MarcaController : Controller
    {
        private readonly IClienteMarcaService _clienteMarcaService;

        public MarcaController(IClienteMarcaService clienteMarcaService)
        {
            this._clienteMarcaService = clienteMarcaService;
        }

        // GET: Maestra/Marca
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// parameters: par => [IdCliente = 0]
        /// </summary>        
        public string GetAll_ClienteMarcaByCliente_CSV()
        {            
            string IdCliente = _.Get("par");
            return _clienteMarcaService.GetAll_ClienteMarcaByCliente_Json(IdCliente);
        }

        /// <summary>
        /// parameters: par => {IdCliente:'',NombreMarca:''}
        /// return : objeto.data
        /// </summary>        
        public string SaveNew_ClienteMarca()
        {
            string mensaje = "";
            string sParModelo = _.Post("par");
            ClienteMarca model = JsonConvert.DeserializeObject<ClienteMarca>(sParModelo);

            TryValidateModel(model);

            if (!ModelState.IsValid)
            {
                //return Convert.ToString(-1);
                return mensaje = _.Mensaje("new", false, null, -1);
            }
            model.UsuarioCreacion = _.GetUsuario().Usuario;
            string IdCliente = model.IdCliente.ToString();
            int IdClienteMarca = Convert.ToInt32(_clienteMarcaService.SaveNew_ClienteMarca(model));
            string DataCSV = _clienteMarcaService.GetAll_ClienteMarcaByCliente_Json(IdCliente);

            mensaje = _.Mensaje("new", IdClienteMarca > 0, DataCSV, IdClienteMarca);

            return mensaje;
        }
    }
}