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
    public class AprobacionController : Controller
    {
        AccesoAD accesoAD = new AccesoAD();

        // GET: TecnologiaInformacion/Aprobacion
        public ActionResult Confirmacion()
        {
            return View();
        }

       

        public ActionResult ValidacionPasswordAprobacion()
        {
            return View();
        }

        public ActionResult ValidacionPasswordRechazo()
        {
            return View();
        }

        public ActionResult ValidacionPasswordTermino()
        {
            return View();
        }


        public string validarCredencialesAprobacion()
        {
            string par = _.Post("par");                        
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("usp_HelpDesk_ValidCredential", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string tipoacceso = accesoAD.Access_Valid(usuario, password);

            if (tipoacceso == "ad")
            {
                string resultadoingreso = oMantenimiento.get_Data("uspSolicitudValidarCredenciales_Aprobacion", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;
        }

         public string validarCredencialesAprobacionRechazo()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("usp_HelpDesk_ValidCredential", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string tipoacceso = accesoAD.Access_Valid(usuario, password);

            if (tipoacceso == "ad")
            {
                string resultadoingreso = oMantenimiento.get_Data("uspSolicitudValidarCredenciales_Rechazo", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;
        }

        public string validarCredencialesAprobacionTermino()
        {
            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("usp_HelpDesk_ValidCredential", par, true, Util.ERP);
            string data = "";
            string resultado = result.Replace("[", "").Replace("]", "");
            string usuario = _.Get_Par(resultado, "usuario");
            string password = _.Get_Par(resultado, "password");
            string tipoacceso = accesoAD.Access_Valid(usuario, password);
            
            if (tipoacceso == "ad")
            {
                string resultadoingreso = oMantenimiento.get_Data("uspSolicitudValidarCredenciales_Termino", par, true, Util.ERP);
                data = resultadoingreso;
            }

            return data != "" ? data : string.Empty;          

        }

    }
}