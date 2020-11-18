using BL_ERP;
using BE_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Maestra.Models;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public class ClienteMarcaService : IClienteMarcaService
    {
        public string GetAll_ClienteMarcaByCliente_Json(string _idCliente)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdCliente", Value = _idCliente, Size = 20 },
                new Parameter { Key = "IdGrupoComercial", Value = _.GetUsuario().IdGrupoComercial }
            };
            
            string data = dBHelper.GetData("ERP.usp_GetAllListaMarcaxCliente_CSV", Parameters);
            return data;
        }

        public string SaveNew_ClienteMarca(ClienteMarca _clienteMarca)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {
                    Key = "par",
                    Value = JsonConvert.SerializeObject(_clienteMarca),
                    Size = -1
                }
            };

            int id = dBHelper.SaveRow_Out("ERP.usp_SaveNew_Marca_y_Asociar",Parameters);
            return id.ToString();
        }
    }
}