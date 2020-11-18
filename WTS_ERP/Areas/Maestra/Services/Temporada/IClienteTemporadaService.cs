using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public interface IClienteTemporadaService
    {
        string GetAll_ClienteTemporadaByCliente_Json(string _idCliente);
        string SaveNew_ClienteTemporada(ClienteTemporada _clienteTemporada);
    }
}
