using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class ProgramaController : Controller
    {
        string CopiaOcultaCorreoRequerimiento = ConfigurationManager.AppSettings["CopiaOcultaCorreoRequerimiento"].ToString();
        string RutaFileServer = ConfigurationManager.AppSettings["FileServer"].ToString();
        string RutaFiletelaFile = ConfigurationManager.AppSettings["FileRequerientoTela"].ToString();
        string RutaFileAvioFile = ConfigurationManager.AppSettings["FileRequerientoAvio"].ToString();
        string RutaFileColorFile = ConfigurationManager.AppSettings["FileRequerientoColor"].ToString();
        string RutaFileEstiloFileArchivos = ConfigurationManager.AppSettings["FileRequerientoEstiloArchivos"].ToString();
        string RutaFileArteFile = ConfigurationManager.AppSettings["FileRequerientoArte"].ToString();
        private readonly IProgramaService _programaService;
        public ProgramaController(IProgramaService programaService)
        {
            this._programaService = programaService;
        }

        // GET: Requerimiento/Programa
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _NewProgram()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult _NewEmail()
        {
            ViewBag.RutaFileServerTela = @RutaFileServer + RutaFiletelaFile;
            ViewBag.RutaFileServerAvio = @RutaFileServer + RutaFileAvioFile;
            ViewBag.RutaFileServerColor = @RutaFileServer + RutaFileColorFile;
            ViewBag.RutaFileServerEstilo = @RutaFileServer + RutaFileEstiloFileArchivos;
            ViewBag.RutaFileServerArte = @RutaFileServer + RutaFileArteFile;
            return View();
        }

        [AccessSecurity]
        public ActionResult Stages()
        {
            return View();
        }

        /// <summary>
        /// par = {IdGrupoPersonal, IdCatalogo_IdEstado}
        /// </summary>
        /// <returns></returns>
        public string GetListaProgramaIndex_JSON()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ProgramaViewModels parametro = JsonConvert.DeserializeObject<ProgramaViewModels>(par);
            return _programaService.GetListaPrograma_Index(parametro);
        }

        public string GetListaProgramaIndexFilter_JSON()
        {
            string par = _.Get("par");
            ProgramaViewModels parametro = JsonConvert.DeserializeObject<ProgramaViewModels>(par);
            return _programaService.GetListaProgramaIndexFilter_JSON(parametro);
        }

        public string GetValidarModificarPrograma_JSON()
        {
            string par = _.Post("par");
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ProgramaViewModels parametro = JsonConvert.DeserializeObject<ProgramaViewModels>(par);
            return _programaService.GetValidarModificarPrograma_JSON(parametro);
        }

        public string GetProgramaNew_JSON()
        {
            //// PARAMETRO: {idpersonal, idgrupopersonal}       
            string parModelo = _.Get("par");
            parModelo = _.addParameter(parModelo, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            parModelo = _.addParameter(parModelo, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ProgramaViewModels model = JsonConvert.DeserializeObject<ProgramaViewModels>(parModelo);

            return _programaService.GetProgramaNew_JSON(model);
        }

        public string GetProgramaEditar_JSON()
        {
            //// PARAMETRO: {idprograma, idpersonal, idgrupopersonal}            
            string parModelo = _.Get("par");
            parModelo = _.addParameter(parModelo, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            parModelo = _.addParameter(parModelo, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            ProgramaViewModels model = JsonConvert.DeserializeObject<ProgramaViewModels>(parModelo);

            return _programaService.GetProgramaEditar_JSON(model);
        }

        public string Save_New_Programa()
        {
            string parModelo = _.Post("par");
            parModelo = _.addParameter(parModelo, "UsuarioCreacion", _.GetUsuario().Usuario);
            parModelo = _.addParameter(parModelo, "UsuarioActualizacion", _.GetUsuario().Usuario);
            parModelo = _.addParameter(parModelo, "IdGrupoPersonal", _.GetUsuario().IdGrupoComercial.ToString());
            parModelo = _.addParameter(parModelo, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            Programa model = JsonConvert.DeserializeObject<Programa>(parModelo);

            TryValidateModel(model);

            if (!ModelState.IsValid) {
                //return Convert.ToString(-1);
                return _.Mensaje("new", false, null, -1);
            }

            string mensaje = string.Empty;
            //bool existePrograma = _programaService.Validate_ProgramaPK(model).Length>0;
            //if (!existePrograma)
            //{
                int IdPrograma = Convert.ToInt32(_programaService.Save_New_Programa(model));
                mensaje = _.Mensaje("new", IdPrograma > 0, null, IdPrograma);
            //}
            //else {
            //    JObject JO = new JObject();
            //    mensaje.Add("mensaje","Ingrese");
            //    mensaje.Add("estado", (exito) ? "success" : "Error");
            //    mensaje.Add("data", (exito && data != null) ? data : "");
            //}

            return mensaje;
        }
        

        public string Save_Edit_Programa()
        {
            string parModelo = _.Post("par");
            parModelo = _.addParameter(parModelo, "UsuarioCreacion", _.GetUsuario().Usuario);
            parModelo = _.addParameter(parModelo, "UsuarioActualizacion", _.GetUsuario().Usuario);
            Programa model = JsonConvert.DeserializeObject<Programa>(parModelo);

            TryValidateModel(model);

            if (!ModelState.IsValid)
            {
                //return Convert.ToString(-1);
                return _.Mensaje("edit", false, null, -1);
            }
            int IdPrograma = Convert.ToInt32(_programaService.Save_Edit_Programa(model));
            string mensaje = _.Mensaje("edit", IdPrograma > 0, null, IdPrograma);
            return mensaje;
        }

        /// <summary>
        /// parametro => [par(IdCliente)]
        /// </summary>
        /// <returns></returns>
        public string GetListaCombosRequerimiento_JSON()
        {
            string IdCliente = _.Get("par");
            return _programaService.GetListaCombosRequerimiento_JSON(IdCliente);
        }

        /// <summary>
        /// par => { IdPrograma, UsuarioActualizacion, IdGrupoPersonal, IdCatalogo_IdEstado }
        /// </summary>
        /// <returns></returns>
        public string DeleteProgramaById_JSON()
        {
            string dataReturn = "";
            string sParModelo = _.Post("par");
            sParModelo = _.addParameter(sParModelo, "UsuarioActualizacion", _.GetUsuario().Usuario);
            ProgramaViewModels parametro = JsonConvert.DeserializeObject<ProgramaViewModels>(sParModelo);
            
            int rowsAfectados = _programaService.DeleteProgramaById_JSON(parametro);
            if (rowsAfectados > 0)
            {
                dataReturn = _programaService.GetListaProgramaIndexFilter_JSON(parametro);
            }
            string mensaje = _.Mensaje("edit", rowsAfectados > 0, dataReturn, rowsAfectados);

            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string SaveEnlaceRequerimiento()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _programaService.SaveEnlaceRequerimiento(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string DeleteEnlaceRequerimiento()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            string IdRequerimiento = _programaService.DeleteEnlaceRequerimiento(sParModel);
            string mensaje = _.Mensaje("new", IdRequerimiento != "", IdRequerimiento, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAllReqsDetails()
        {
            string par = _.Get("par");
            return _programaService.GetAllReqsDetails(par);
        }

        [AccessSecurity]
        [HttpPost]
        [ValidateInput(false)]
        public string SendSamplesEstilo()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "CCO", CopiaOcultaCorreoRequerimiento);
            sParModel = _.addParameter(sParModel, "Correo", _.GetUsuario().Correo);
            string IdEmail = _programaService.InsertSendEmail(sParModel);
            string mensaje = _.Mensaje("new", IdEmail != "", IdEmail, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpGet]
        public string GetCorreoReq()
        {
            string par = _.Get("par");
            return _programaService.GetCorreoReq(par);
        }
    }
}