using BE_ERP;
using BL_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Maestra.Services
{
    public class ProveedorService : IProveedorService
    {
        public string GetListaProveedorByTipoProveedorCSV(int IdTipoProveedor)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdTipoProveedor", Value = IdTipoProveedor.ToString() }
            };

            string data = db.GetData("ERP.usp_GetListaProveedorByTipoProveedorCSV", Parameters);
            return data;
        }
    }
}