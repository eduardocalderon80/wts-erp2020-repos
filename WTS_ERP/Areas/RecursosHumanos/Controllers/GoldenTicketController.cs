using BL_ERP;
using BE_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using System.IO;
using BE_ERP.TecnologiaInformacion.HelpDesk;
using BL_ERP.RecursosHumanos;
using Newtonsoft.Json;
using System.Configuration;
using System.Text;
using Utilitario;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class GoldenTicketController : Controller
    {
        // GET: RecursosHumanos/GoldenTicket
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }

        // GET: Redireccionar
        public ActionResult ConfirmarGoldenTicket(string id)
        {
            // Base64 parameter to string
            byte[] data = Convert.FromBase64String(id);
            string decodedString = Encoding.UTF8.GetString(data);
            Redirection redirection = new Redirection();
            redirection.Modulo = "RecursosHumanos";
            redirection.Controlador = "GoldenTicket";
            redirection.Vista = "New";
            redirection.Accion = "edit";
            redirection.Parametro = decodedString;
            string json = JsonConvert.SerializeObject(redirection);
            string encrypt = Utils.EncryptString(json);
            return RedirectToAction("LoginERP", "Home", new { redirect = encrypt });
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_Inicial()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idcategoria", "5");
            string data = oMantenimiento.get_Data("GestionTalento.usp_Get_SolicitudDataInicial", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_GoldenTicket()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_GoldenTicket", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string GetAllData_FechasCoincidentes_GoldenTicket()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", Convert.ToString(_.GetUsuario().IdUsuario));
            par = _.addParameter(par, "idpersonal", Convert.ToString(_.GetUsuario().IdPersonal));

            //par = _.addParameter(par, "rdfechas", "2");
            //par = _.addParameter(par, "fechainicio", "20191021");
            //par = _.addParameter(par, "fechafin", "20191031");
            //par = _.addParameter(par, "fechas", "");

            string data = oMantenimiento.get_Data("GestionTalento.usp_GetAll_FechasCoincidentes", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string InsertData_GoldenTicket()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idarea", _.GetUsuario().IdArea.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_Insert_GoldenTicket", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpPost]
        [AccessSecurity]
        public string UpdateData_GoldenTicket()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "idpersonal", _.GetUsuario().IdPersonal.ToString());
            string data = oMantenimiento.get_Data("GestionTalento.usp_Update_GoldenTicket", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}