using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Facturacion.Models;

namespace WTS_ERP.Areas.Facturacion.Services
{
    public interface ITesoreriaBolService
    {
        string GetListaTesoreria_Index(TesoreriaBol parametro);
        string GetListaInvoice(TesoreriaBol parametro);

    }
}
