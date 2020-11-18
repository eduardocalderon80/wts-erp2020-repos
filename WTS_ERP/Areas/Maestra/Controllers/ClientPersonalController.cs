using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Configuration;

using WTS_ERP.Models;
using BE_ERP;
using BL_ERP;
using Utilitario;

using Newtonsoft.Json;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ClientPersonalController : Controller
    {
        // GET: Maestra/ClientPersonal
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Inicio()
        {
            return View();
        }

        public string ClientPersonal_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string par = "{\"IdGrupoPersonal\":\"" + _.Get("idgrupopersonal") + "\"}";
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_PersonalCliente_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string ClientPersonal_Get()
        {
            blMantenimiento oMantemiento = new blMantenimiento();
            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantemiento.get_Data("usp_PersonalCliente_Get", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string ClientPersonal_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string parhead = _.Post("pardata");
            string pardetail = _.Post("pararray");

            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_PersonalCliente_Update", parhead, Util.ERP, pardetail);
            /*string mensaje = _.Mensaje("new", id > 0, null, id);
            return mensaje;*/
            
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_PersonalCliente_List", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        /*V2*/
        public string ClientePersonal_Listar()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("ERP.usp_ClientePersonal_Listar", par, true, Util.ERP);
            return data != null ? data : string.Empty;
        }

        public string ClientePersonal_Guardar()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("parhead");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            parhead = _.addParameter(parhead, "idusuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "usuariocreacion", _.GetUsuario().UsuarioAD.ToString().Trim());

            int id = oMantenimiento.save_Rows_Out("ERP.usp_ClientePersonal_Guardar", parhead, Util.ERP, pardetail,parsubdetail);

            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }
    }
}