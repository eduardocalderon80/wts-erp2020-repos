using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ClienteDivisionTrimController : Controller
    {
        // GET: Maestra/ClienteDivisionTrim
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New_Trim() {
            return View();
        }

        public ActionResult _EstilosAfectadosCambioTrim() {
            return View();
        }

        public string GetDataTrim_iniindex() {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetTrimIndex_csv", par, true, Util.ERP);
            return data;
        }

        public string GetDataBuscarTrim()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetTrim_Buscar_Index", par, true, Util.ERP);
            return data;
        }

        public string GetData_NewTrim_Ini()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetIni_NewTrim_csv", par, true, Util.ERP);
            return data;
        }

        public string GetData_EditTrim_Ini()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetIni_EditTrim_csv", par, true, Util.ERP);
            return data;
        }

        public string Save_new_trim()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int id = blm.save_Rows_Out("usp_savenew_trim_csv", par, Util.ERP);
            string mensaje = _.Mensaje("new", id > 0, null, id);
            return mensaje;
        }

        public string Save_edit_trim()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "ip", "");
            par = _.addParameter(par, "hostname", "");

            int id = blm.save_Rows_Out("usp_saveedit_trim_csv", par, Util.ERP, pardetail);
            string mensaje = _.Mensaje("edit", id > 0, null, id);
            return mensaje;
        }

        public string GetTrimByIdTrim()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspGetTrimByIdTrim_json", par, true, Util.ERP);
            return data;
        }

        public string ValidarTrimSiAfecta_OtrosEstilos()
        {
            blMantenimiento blm = new blMantenimiento();
            string par = _.Get("par");
            string data = blm.get_Data("uspValidarAntesEditarTrimFromEstilos_csv", par, true, Util.ERP);
            return data;
        }
    }
}