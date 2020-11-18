using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.GestionProducto.Controllers
{
    public class TipoMuestraxClienteController : Controller
    {
        // GET: GestionProducto/TipoMuestraxCliente
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }

        public string GetData()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_TipoMuestraxCliente_Obtener", par, true, Util.ERP);
            return data;
        }

        public string Guardar()
        {
            string par = _.Post("par");
            string pardetalle = _.Post("parDetail");
            string parsubdetail = string.Empty;
            string parfoot = string.Empty;

            par = _.addParameter(par, "idempresa", _.GetUsuario().IdEmpresa.ToString());
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);

            blMantenimiento oMantenimiento = new blMantenimiento();
            int id = oMantenimiento.save_Rows("usp_TipoMuestraxCliente_insert", par, Util.ERP, pardetalle, parsubdetail, parfoot);
            return id.ToString();
        }



    }
}