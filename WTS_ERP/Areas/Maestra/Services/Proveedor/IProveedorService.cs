using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WTS_ERP.Areas.Maestra.Services
{
    public interface IProveedorService
    {
        string GetListaProveedorByTipoProveedorCSV(int IdTipoProveedor);
    }
}
