using System;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using Utilitario.Seguridad;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class AprobacionController : Controller
    {
        // GET: DesarrolloTextil/Aprobacion
        public ActionResult ValidacionPasswordAprobacion()
        {
            return View();
        }
        public string validarCredencialesAprobacion()
        {
            //string par = _.Post("par");
            //string passwordAD = _.Get_Par(par, "pass");
            //string parametros = DesEncriptar(_.Get_Par(par, "params"));
            //string userAD = _.Get_Par(parametros, "usuario");

            //AccesoAD accesoAD = new AccesoAD();
            //string tipoaccesousuario = accesoAD.Access_Valid(userAD, passwordAD);
            //string exitoAD = (tipoaccesousuario == "ad" || tipoaccesousuario == "sistema") ? "si":"no";
            //par = _.addParameter(par, "exitoAD", exitoAD);

            //blMantenimiento oMantenimiento = new blMantenimiento();
            //string result = oMantenimiento.get_Data("uspValidarCredenciales_Aprobacion_Tela", par, true, Util.ERP);
            //return result;

            string par = _.Post("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string result = oMantenimiento.get_Data("uspValidarCredenciales_Aprobacion_Tela", par, true, Util.ERP);
            return result;

        }

        private string DesEncriptar(string _cadenaAdesencriptar)
        {
            string result = string.Empty;
            string exresult = string.Empty;
            try
            {
                byte[] decryted = Convert.FromBase64String(_cadenaAdesencriptar);                
                result = System.Text.Encoding.Unicode.GetString(decryted);
            }
            catch (Exception ex)
            {
                result = "none";
                exresult = ex.ToString();
            }
            return result;
        }

    }
}