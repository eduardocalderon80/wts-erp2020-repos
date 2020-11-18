using System.Web.Mvc;
using BL_ERP;

namespace WTS_ERP.Areas.PO.Controllers
{
    public class ConfirmacionPendientesPCPController : Controller
    {
        
        public ActionResult PCP(string gc)
        {
            string decodeGC = Utilitario.Utils.DesEncriptarBase64(gc);
            int res = 0;
            int.TryParse(decodeGC, out res);
            ViewBag.idGrupoComercial = res.ToString();
            ViewBag.idGrupoComercialBase64 = gc;
            return View();
        }
        [HttpPost]
        public bool SavePCP(string data)
        {
            int? resultado = null;
            blMantenimiento oblMantenimiento = new blMantenimiento();
            resultado = oblMantenimiento.save_Row("Operaciones.usp_INSERT_AvisosPendientes", data.ToString(), Util.ERP);
            return (resultado > 0);
        }
        [HttpPost]
        public string CargarPendientes(string gc)
        {
            string resultado = null;
            blMantenimiento oblMantenimiento = new blMantenimiento();            
            resultado = oblMantenimiento.get_Data("Operaciones.getAvisodePendientesOperaciones", gc.ToString(), false, Util.ERP);            
            return resultado;
        }
     
    }
}