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
    public class InventarioColgadorController : Controller
    {
        // GET: DesarrolloTextil/InventarioColgador
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New(){
            return View();
        }

        public ActionResult Edit()
        {
            return View();
        }

        public ActionResult CerrarPeriodo()
        {
            return View();
        }

        public ActionResult AgregarMotivo()
        {
            return View();
        }

        public ActionResult _AgregarMotivo()
        {
            return View();
        }

        public string GetDataInicialInventario()
        {
            string par = _.Get("par");
            par = _.addParameter(par, "idusuario", _.GetUsuario().IdUsuario.ToString());
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("DesarrolloTextil.usp_Get_InventarioColgadorInicial", par, true, Util.ERP);
            return data;
        }

        public string GetDataInventarioColgador()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("DesarrolloTextil.usp_GetAll_InventarioColgador", par, true, Util.ERP);
            return data;
        }

        public string GetDataInventarioColgadorMovimiento()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("usp_Inventario_MovimientosListar_csv", par, true, Util.ERP);
            return data;
        }

        public string EliminarMovimiento()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            string data = bl.get_Data("usp_Eliminar_Movimiento", par, true, Util.ERP);
            return data;
        }

        public string Save_Edit_Colgador()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_Editar_Colgador", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string Save_Registrar_Movimientos()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_SaveRegistrarMovimiento", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string Save_Registrar_MovimientosSalida()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocreacion", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_SaveRegistrarMovimientoSalida", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string Cambiar_Estado_Inventario_Colgador()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuarioactualizacion", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_CambiarEstado_Inventario_Colgador", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        public string Cierre_Inventario_Colgador()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuariocierre", _.GetUsuario().Usuario);
            int rows = bl.save_Row("usp_CierreInventarioColgador", par, Util.ERP);
            string mensaje = _.Mensaje("remove", rows > 0, null, 0);
            return mensaje;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_Motivo()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_Motivo", "", true, Util.ERP);
            return data;
        }

        [HttpPost]
        [AccessSecurity]
        public string SaveData_Motivo()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            par = _.addParameter(par, "usuario", _.GetUsuario().Usuario);
            int rows = bl.save_Row("DesarrolloTextil.usp_Insert_Motivo", par, Util.ERP);
            string mensaje = _.Mensaje("new", rows > 0, bl.get_Data("DesarrolloTextil.usp_GetAllTipoMotivos_csv", string.Empty, false, Util.ERP), rows);
            //return data != null ? data : string.Empty;
            return mensaje;
        }

        [HttpPost]
        [AccessSecurity]
        public string DeleteData_Motivo()
        {
            blMantenimiento bl = new blMantenimiento();
            string par = _.Post("par");
            int rows = bl.save_Row("DesarrolloTextil.usp_Delete_Motivo", par, Util.ERP);
            string mensaje = _.Mensaje("edit", rows > 0, bl.get_Data("DesarrolloTextil.usp_GetAllTipoMotivos_csv", string.Empty, false, Util.ERP), rows);
            //return data != null ? data : string.Empty;
            return mensaje;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetData_InventarioCodigoTela()
        {
            string par = _.Get("par");
            blMantenimiento blm = new blMantenimiento();
            string data = blm.get_Data("DesarrolloTextil.usp_Get_InventarioCodigoTela", par, true, Util.ERP);
            return data;
        }

        [HttpGet]
        [AccessSecurity]
        public string GetAllData_InventarioCodigoTela()
        {
            string par = _.Get("par");
            blMantenimiento oMantenimiento = new blMantenimiento();
            string data = oMantenimiento.get_Data("DesarrolloTextil.usp_GetAll_InventarioCodigoTela", par, false, Util.ERP);
            return data != null ? data : string.Empty;
        }
    }
}