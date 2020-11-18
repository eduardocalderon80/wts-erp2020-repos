using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class AnalistaxClienteController : Controller
    {
        // GET: GestionProducto/AnalistaxCliente
        public ActionResult Index()
        {
            return View();
        }

        public string AnalistaCliente_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = -1;
            string par = "{\"idgrupocomercial\":\"" + _.Get("idgrupocomercial") + "\" }";
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_AnalistaCliente_List", "", false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string AnalistaCliente_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();            
            //string par = _.Post("par");
            string parhead = _.Post("pardata");
            string pardetail = _.Post("pararray");

            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_AnalistaCliente_Insert", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_AnalistaCliente_List", "", false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string AnalistaCliente_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            //string par = _.Post("par");
            string parhead = _.Post("pardata");
            string pardetail = _.Post("pararray");

            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_AnalistaCliente_Update", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_AnalistaCliente_List", "", false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string AnalistaCliente_Delete()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Get("par");

            par = _.addParameter(par, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            par = _.addParameter(par, "Ip", "");
            par = _.addParameter(par, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_AnalistaCliente_Delete", par, Util.ERP);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_AnalistaCliente_List", "", false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string AnalistaCliente_Get()
        {
            blMantenimiento oMantemiento = new blMantenimiento();
            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantemiento.get_Data("usp_AnalistaCliente_Get", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

    }
}