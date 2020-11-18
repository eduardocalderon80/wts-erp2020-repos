using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class CargoController : Controller
    {
        // GET: RecursosHumanos/Cargo
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _NewCargo()
        {
            return View();
        }

        public ActionResult _EditCargo()
        {
            return View();
        }

        public string Cargo_List()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Cargo_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Cargo_GetDataCombos()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Cargo_GetDataCombos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Cargo_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Cargo_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Cargo_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Cargo_Insert", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Cargo_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Cargo_Update", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

    }
}