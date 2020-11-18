using System.Web.Mvc;
using WTS_ERP.Models;
using BL_ERP;
using System;
using System.Text;
using BE_ERP;
using System.Web;
using System.IO;
using System.Configuration;
using Utilitario;

namespace WTS_ERP.Areas.DesarrolloTextil.Controllers
{
    public class PresentacionController : Controller
    {
        // GET: DesarrolloTextil/Presentaciones
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Edit()
        {
            return View();
        }

        public string GetDataPresentaciones_CSV()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Presentaciones_Listar_csv", par, true, Util.ERP);
            return data;
        }

        public string GetDataPresentaciones_Listar_Detalle()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Presentaciones_Listar_Detalle", par, true, Util.ERP);
            return data;
        }

        public string GetData_Inicial()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Presentaciones_GetDataInicial", par, true, Util.ERP);
            return data;
        }

        public string GetData_ListaEstilosClienteTemporada()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_ListaEstilosClienteTemporada", par, true, Util.ERP);
            return data;
        }

        public string GetData_BuscarStyloCodigo()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_BuscarStyloCodigo", par, true, Util.ERP);
            return data;
        }

        public string Save_Edit_Presentacion()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            int rows = bl.save_Row("usp_save_edit_presentacion", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string Save_New_Presentacion()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            int id = bl.save_Rows_Out("usp_save_new_presentacion", par, Util.ERP);
            string mensaje = _.Mensaje("new", id > 0, null, id); ;
            return mensaje;
        }

        public string Eliminar_Presentacion()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_Eliminar_Presentacion", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }
    }
}