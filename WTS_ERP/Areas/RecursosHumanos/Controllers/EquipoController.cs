using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class EquipoController : Controller
    {
        // GET: RecursosHumanos/Equipo
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _NewEquipo()
        {
            return View();
        }

        public ActionResult _EditEquipo()
        {
            return View();
        }

        public string Equipo_List()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Equipo_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Equipo_GetDataCombos()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Equipo_GetDataCombos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Equipo_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Equipo_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Equipo_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Equipo_Insert", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Equipo_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Equipo_Update", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }
    }
}