using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public interface IClienteDivisionService
    {
        string GetAll_ClienteDivisionByCliente_Json(string _idCliente);
        string SaveNew_ClienteDivision(ClienteDivision _clienteDivision);
    }
}
