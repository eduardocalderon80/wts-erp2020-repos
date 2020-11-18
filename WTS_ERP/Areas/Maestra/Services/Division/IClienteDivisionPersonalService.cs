using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public interface IClienteDivisionPersonalService
    {
        string GetAll_ClienteDivisionByCliente_Json(string _idCliente);
        string SaveNew_ClienteDivision(ClienteDivision _clienteDivision);
        string DivisionClient_List(string _idCliente);
        string CargarClienteMarcaDivision(string Params); 

        string ClientDivisionLoad_List(string Params);
    }
}
