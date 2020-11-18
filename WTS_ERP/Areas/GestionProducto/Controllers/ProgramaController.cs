using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class ProgramaController : Controller
    {
        private blMantenimiento oMantenimiento = null;
        
        public ProgramaController()
        {
            oMantenimiento = new blMantenimiento();            
        }

        [AccessSecurity]
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
        public string ObtenerPrograma()
        {
            string data = oMantenimiento.get_Data("uspProgramaObtener", _.Get("par"), true, Util.ERP);
            return data;
        }
        public string ObtenerDatosCarga()
        {
            string data = oMantenimiento.get_Data("uspProgramaObtenerDatosCarga", _.GetUsuario().IdUsuario.ToString(), true, Util.ERP);
            return data;
        }
        public string Buscar()
        {
            string par = _.Post("par") + "," + _.GetUsuario().IdUsuario.ToString();
            string data = oMantenimiento.get_Data("uspProgramaBuscar", par, true, Util.ERP);
            return data;
        }
        public string Eliminar()
        {
            bool exito = false;
            var par = _.Post("par") + "," + _.GetUsuario().Usuario;
            int nrows = oMantenimiento.save_Row("uspProgramaEliminar", par, Util.ERP);
            exito = nrows > 0;
            return _.Mensaje("remove", exito);
        }
        public string Save()
        {
            bool exito = false;
            var Programa = _.Post("Programa");
            var Usuario = _.GetUsuario().IdUsuario.ToString();
            Programa = _.addParameter(Programa, "Usuario", Usuario);
            int nrows = oMantenimiento.save_Row("uspProgramaGuardar", _.Post("Programa"), Util.ERP);
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }

    }
}