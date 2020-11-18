using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using BL_ERP;
using WTS_ERP.Models;
using WTS_ERP.Areas.Facturacion.Models;
using Newtonsoft.Json;
using BE_ERP;

namespace WTS_ERP.Areas.Facturacion.Services
{
    public class TesoreriaBolService : ITesoreriaBolService
    {
        public string GetListaTesoreria_Index(TesoreriaBol parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            string data = bl.get_Data("Facturacion.GetListaTesoreriaBolIndex_JSON", sPar, false, Util.ERP);
            return data;
        }

        public string GetListaInvoice(TesoreriaBol parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            string data = bl.get_Data("Facturacion.usp_FacturaPoBol_Tesoreria_Csv", sPar, false, Util.ERP);
            return data;
        }

    }
}