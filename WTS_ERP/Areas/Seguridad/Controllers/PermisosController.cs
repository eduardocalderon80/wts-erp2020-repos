using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Seguridad.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Seguridad.Controllers
{
    public class PermisosController : Controller
    {
        private readonly  IPermisosService _permisosService;
        public PermisosController(IPermisosService permisosService)
        {
            _permisosService = permisosService;
        }
        // GET: Maestra/Permisos
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _New()
        {
            return View();
        }

        [AccessSecurity]
        [HttpGet]
        public string GetAll_Permisos()
        {
            string par = _.Get("par");
            return _permisosService.GetAll_Permisos(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string Get_Combos()
        {
            string par = _.Get("par");
            return _permisosService.Get_Combos(par);
        }

        [AccessSecurity]
        [HttpPost]
        public string Insert_Permisos()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int Id = _permisosService.Insert_Permisos(sParModel);
            string mensaje = _.Mensaje("new", Id > 0, Id.ToString(), Id);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string Delete_Permisos()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int Id = _permisosService.Delete_Permisos(sParModel);
            string mensaje = _.Mensaje("remove", Id > 0, Id.ToString(), Id);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public bool Validate_Permisos_Client()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            return _permisosService.Validate_Permisos_Client(sParModel);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetUserPermissions()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdPersonal", _.GetUsuario().IdPersonal.ToString());
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            return _permisosService.GetUserPermissions(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetRowInfo()
        {
            string par = _.Get("par");
            return _permisosService.GetRowInfo(par);
        }

        [AccessSecurity]
        [HttpGet]
        public string GetUserInfo()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            return _permisosService.GetUserInfo(par);
        }
    }
}