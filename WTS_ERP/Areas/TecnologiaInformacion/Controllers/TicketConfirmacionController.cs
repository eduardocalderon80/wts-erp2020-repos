using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using Utilitario.Seguridad;


namespace WTS_ERP.Areas.TecnologiaInformacion.Controllers
{
    public class TicketConfirmacionController : Controller
    {
        AccesoAD accesoAD = new AccesoAD();

        // GET: TecnologiaInformacion/TicketConfirmacion
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Ticket_Aprobar()
        {
            return View();
        }

        public ActionResult Ticket_Rechazar()
        {
            return View();
        }

        public ActionResult Ticket_Terminar()
        {
            return View();
        }

        public string Ticket_Validar_Aprobar()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Get_Data_Encriptacion", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string logear_ad = _.Get_Par(resultado, "logear_ad");
            par = _.addParameter(par, "logear_ad", logear_ad);
            string tipoacceso = tipoacceso = accesoAD.Access_Valid(usuario, password);

            if (logear_ad == "SI")
            {
                if (tipoacceso == "ad")
                {
                    string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Aprobar", par, true, Util.ERP);
                    data = resultadoingreso;
                }
            }
            else {
                string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Aprobar", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;
        }

        public string Ticket_Validar_Rechazar()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Get_Data_Encriptacion", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string logear_ad = _.Get_Par(resultado, "logear_ad");
            par = _.addParameter(par, "logear_ad", logear_ad);
            string tipoacceso = tipoacceso = accesoAD.Access_Valid(usuario, password);

            if (logear_ad == "SI")
            {
                if (tipoacceso == "ad")
                {
                    string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Rechazar", par, true, Util.ERP);
                    data = resultadoingreso;
                }
            }
            else
            {
                string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Rechazar", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;
        }

        public string Ticket_Validar_Terminar()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Get_Data_Encriptacion", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string logear_ad = _.Get_Par(resultado, "logear_ad");
            par = _.addParameter(par, "logear_ad", logear_ad);
            string tipoacceso = tipoacceso = accesoAD.Access_Valid(usuario, password);

            if (logear_ad == "SI")
            {
                if (tipoacceso == "ad")
                {
                    string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Terminar", par, true, Util.ERP);
                    data = resultadoingreso;
                }
            }
            else
            {
                string resultadoingreso = oMantenimiento.get_Data("HelpDesk.usp_Ticket_Validar_Terminar", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;

        }


    }
}