using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Maestra.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ProveedorController : Controller
    {
        // GET: Maestra/Proveedor
        private readonly IProveedorService _proveedorService;

        public ProveedorController(IProveedorService proveedorService)
        {
            this._proveedorService = proveedorService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public string GetListaProveedorByTipoProveedorCSV()
        {
            int idProveedor = Convert.ToInt32(_.Get("IdTipoProveedor"));
            string data = _proveedorService.GetListaProveedorByTipoProveedorCSV(idProveedor);
            return data;
        }
    }
}