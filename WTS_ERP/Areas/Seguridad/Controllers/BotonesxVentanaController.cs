using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using BL_ERP.GestionProducto;
using System.IO;
using System.Text;
using BE_ERP;
using BE_ERP.GestionProducto;
using Utilitario;
using Newtonsoft.Json;
using BE_ERP.GestionProducto.Requerimiento;
using System.Threading;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;

namespace WTS_ERP.Areas.Seguridad.Controllers
{
    public class BotonesxVentanaController : Controller
    {
        // GET: Seguridad/BotonesxVentana
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

        public string BotonesxVentana_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("usp_BotonesxVentana_List", "", false, Util.SeguridadERP);
            return data != null ? data : string.Empty;
        }

        public string BotonesxVentana_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            string pardetail = _.Post("pardetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_BotonesxVentana_Insert", parhead, Util.SeguridadERP, pardetail);
            string dataResult = _.Mensaje("new", id > 0);
            return dataResult;
        }

        public string BotonesxVentana_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string parhead = _.Post("par");
            string pardetail = _.Post("pardetail");
            string parsubdetail = _.Post("parsubdetail");
            parhead = _.addParameter(parhead, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString().Trim());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_BotonesxVentana_Update", parhead, Util.SeguridadERP, pardetail, parsubdetail);
            string dataResult = _.Mensaje("edit", id > 0);
            return dataResult;
        }
    }
}