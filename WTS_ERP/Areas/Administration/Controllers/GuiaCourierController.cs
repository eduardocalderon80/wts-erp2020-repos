using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BL_ERP;
using WTS_ERP.Models;
using System.Web.Mvc;
using System.Data;
using System.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BE_ERP;

namespace WTS_ERP.Areas.Administration.Controllers
{
    public class GuiaCourierController : Controller
    {
        // GET: Administration/GuiaCourier
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult Edit()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult Review()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult Assign()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult Add()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult Valid()
        {
            return PartialView();
        }

        public string GuiaCourier_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_GuiaCourier_List", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_Get()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_GuiaCourier_Get", "", false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_GuiasTemp(string par)
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            par = oUsuario.Usuario + "|" + par;
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionAdministrativa.usp_GetAll_GuiasTemp", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
        [HttpPost]
        [AccessSecurity]
        public string SaveData_GuiasTemp()
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parametro = oUsuario.Usuario + "¬" + _.Post("par");
            string data = oMantenimiento.get_Data("GestionAdministrativa.usp_Insert_GuiasTemp", parametro, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
        [HttpPost]
        [AccessSecurity]
        public string DeleteData_GuiasTemp()
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parametro = oUsuario.Usuario + "¬" + _.Post("par");
            string data = oMantenimiento.get_Data("GestionAdministrativa.usp_Delete_GuiasTemp", parametro, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_ObtenerPorId(string par)
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            blMantenimiento oMantenimiento = new blMantenimiento();
            par = oUsuario.IdPersonal.ToString() + "|" + par;
            string data = oMantenimiento.get_Data("usp_GuiaCourier_ObtenerPorId", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_SubResponsable_Insertar(string par)
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            //string parameter = oUsuario.Usuario + '^' + _.Post("data");
            par = oUsuario.Usuario + "¬" + par;
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_GuiaCourier_SubResponsable_Insertar", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_SubResponsable_Eliminar()
        {
            beUser oUsuario = (beUser)System.Web.HttpContext.Current.Session["Usuario"];
            string parameter = oUsuario.Usuario + '^' + _.Post("data");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_GuiaCourier_SubResponsable_Eliminar", parameter, false, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_Valid()
        {
            _Helper helper = new _Helper();
            string path = helper.Upload_file(Request.Files["archivo"]);
            DataTable tabla = !string.IsNullOrEmpty(path) ? helper.convertExceltoDataSet(path) : null;

            bool exito = false;
            string data = "";
            string nametable = "GuiaCourier_Temporal";

            string par = "{\"usuario\":\"" + _.GetUsuario().UsuarioAD.ToString() + "\"}";

            if (tabla != null)
            {
                blMantenimiento oMantenimiento = new blMantenimiento();
                exito = (oMantenimiento.save_Row("usp_GuiaCourier_Temporal_Delete", par, Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy(nametable, tabla, Util.ERP) : false;
                //exito = oMantenimiento.save_Rows_BulkCopy(nametable, tabla, Util.ERP);
                if (exito)
                {
                    data = oMantenimiento.get_Data("usp_GuiaCourier_Temporal_List", par, false, Util.ERP);
                }

                //exito = (oMantenimiento.save_Row("usp_PlanillaTemporal_Delete", par, Util.ERP) >= 0) ? oMantenimiento.save_Rows_BulkCopy(nametable, tabla, Util.ERP) : false;
                //result = oMantenimiento.get_Data("usp_PlanillaTemporal_List", par, false, Util.ERP);
            }
            return data != null ? data : string.Empty;
        }

        public string GuiaCourier_Insert_Group()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_GuiaCourier_Insert_Group", parhead, Util.ERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string GuiaCourier_Insert_Individual()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().UsuarioAD.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            string data = oMantenimiento.get_Data("usp_GuiaCourier_Insert_Individual", parhead, false, Util.ERP);
            return data != null ? data : string.Empty;

            //int id = oMantenimiento.save_Rows_Out("usp_GuiaCourier_Insert_Individual", parhead, Util.ERP);
            //string dataResult = _.Mensaje("new", id > 0, id.ToString());
            //return dataResult;
        }

    }
}