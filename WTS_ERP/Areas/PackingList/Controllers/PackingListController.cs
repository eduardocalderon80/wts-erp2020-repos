using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using BE_ERP;

namespace WTS_ERP.Areas.PackingList.Controllers
{
    public class PackingListController : Controller
    {
        private blMantenimiento oMantenimiento = null;
               
        public PackingListController() {
            oMantenimiento = new blMantenimiento();
        }
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Nuevo()
        {
            return View();
        }
        public ActionResult Editar()
        {
            return View();
        }

        public string GetCustomer()
        {
            string data = oMantenimiento.get_Data("uspClienteObtener", "", true, Util.ERP);
            return data;
        }
        public string GetSupplier()
        {
            string data = oMantenimiento.get_Data("uspProveedorObtener", "", true, Util.ERP);
            return data;
        }
        public string GetClientAddress()
        {
            string data = oMantenimiento.get_Data("uspPackingListClienteDireccionObtener", _.Get("par"), true, Util.ERP);
            return data;
        }
        public string GetPL()
        {
            string data = oMantenimiento.get_Data("uspPackingListObtener",_.Get("par"), true, Util.ERP);
            return data;
        }
        public string SearchPo()
        {
            string data = oMantenimiento.get_Data("uspPackingListPoObtener", _.Post("par"), true, Util.ERP);
            return data;
        }
        public string SearchPackingList()
        {
            string data = oMantenimiento.get_Data("uspPackingListBuscar", _.Post("par"), true, Util.ERP);
            return data;
        }
        public string SavePK()
        {
            bool exito = false;
            var packinglist = _.Post("packinglist");
            packinglist = _.addParameter(packinglist, "UsuarioCreacion", _.GetUsuario().IdUsuario.ToString());
            packinglist = _.addParameter(packinglist, "Ip","Ip");
            packinglist = _.addParameter(packinglist, "Hostname","Hostname");
            int nrows = oMantenimiento.save_Rows("uspPackingListGuardar", packinglist, Util.ERP, _.Post("packinglistpocliente"), _.Post("packinglistpoclienteproducto"), "");
            exito = nrows > 0;
            //if (exito)
            //{
            //    nrows = oMantenimiento.save_Row("uspPurchaseOrderActualizarEnviado", _.Post("poedi"), Util.EDI);
            //}
            return _.Mensaje("new", exito);
        }
        public string SavePKG()
        {
            bool exito = false;
            var packinglist = _.Post("packinglist");
            packinglist = _.addParameter(packinglist, "UsuarioCreacion", _.GetUsuario().IdUsuario.ToString());
            packinglist = _.addParameter(packinglist, "Ip", "Ip");
            packinglist = _.addParameter(packinglist, "Hostname", "Hostname");
            int nrows = oMantenimiento.save_Rows("uspPackingListGuardar", packinglist, Util.ERP, _.Post("packinglistpoclienteestilodestinotallacolor"), "", "");
            exito = nrows > 0;
            //if (exito)
            //{
            //    nrows = oMantenimiento.save_Row("uspPurchaseOrderActualizarEnviado", _.Post("poedi"), Util.EDI);
            //}
            return _.Mensaje("new", exito);
        }
    }
}