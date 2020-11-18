using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.RecursosHumanos.Controllers
{
    public class AreaController : Controller
    {
        // GET: RecursosHumanos/Area
        public ActionResult Index()
        {
            return View();
        }
                
        public ActionResult _NewArea()
        {
            return View();
        }

        public ActionResult _EditArea()
        {
            return View();
        }

        public string Area_List()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Area_List", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Area_GetDataCombos()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Area_GetDataCombos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Area_Get()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("GestionTalento.usp_Area_Get", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string Area_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Area_Insert", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string Area_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("GestionTalento.usp_Area_Update", parhead, Util.ERP);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

    }
}