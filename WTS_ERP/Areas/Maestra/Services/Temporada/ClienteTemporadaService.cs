using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public class ClienteTemporadaService : IClienteTemporadaService
    {
        public string GetAll_ClienteTemporadaByCliente_Json(string _idCliente)
        {
            blMantenimiento bl = new blMantenimiento();
            string IdCliente = _idCliente;
            string data = bl.get_Data("ERP.usp_GetAllListaTemporadaxCliente_CSV", IdCliente, false, Util.ERP);
            return data;
        }

        public string SaveNew_ClienteTemporada(ClienteTemporada _clienteTemporada)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(_clienteTemporada);

            int id = bl.save_Row_Out("ERP.usp_SaveNew_ClienteTemporada_y_Asociar", sPar, Util.ERP);
            return id.ToString();
        }
    }
}