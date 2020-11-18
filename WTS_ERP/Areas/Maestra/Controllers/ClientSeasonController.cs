using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ClientSeasonController : Controller
    {
        // GET: Maestra/ClientSeason
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        public ActionResult New()
        {
            return View();
        }

        public string ClientSeason_List()
        {
            blMantenimiento oMantemiento = new blMantenimiento();

            int id = -1;
            string par = "{\"idgrupocomercial\":\"" + _.Get("idgrupocomercial") + "\"}";
            string dataResult = id < 0 ? oMantemiento.get_Data("usp_ClienteTemporada_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string SeasonClient_List()
        {
            blMantenimiento oMantemiento = new blMantenimiento();
            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantemiento.get_Data("usp_TemporadaCliente_List", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string ClientSeason_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string parhead = _.Post("par_CliSe");
            string pardetail = _.Post("par_CliSeason");

            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_ClienteTemporada_Insert", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_ClienteTemporada_List", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string ClientSeason_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string parhead = _.Post("par_CliSe");
            string pardetail = _.Post("par_CliSeason");

            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_ClienteTemporada_Update", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_ClienteTemporada_List", par, false, Util.ERP) : string.Empty;
            return dataResult;

        }



        public string ClienteTemporada_Get_Data_Combos()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("ERP.usp_ClienteTemporada_Get_Data_Combos", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string ClienteTemporada_Get_Data()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("ERP.usp_ClienteTemporada_Get_Data", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string ClienteTemporada_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string pardetail = _.Post("pardetail");

            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString());

            int id = oMantenimiento.save_Rows_Out("usp_ClienteTemporada_Insert", par, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("ClienteTemporada_Get_Data", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

    }
}