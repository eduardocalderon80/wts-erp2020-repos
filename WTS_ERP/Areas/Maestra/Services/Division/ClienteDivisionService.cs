using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Maestra.Models;
using BE_ERP;
using WTS_ERP.Models;


namespace WTS_ERP.Areas.Maestra.Services
{
    public class ClienteDivisionService : IClienteDivisionService
    {
        public string GetAll_ClienteDivisionByCliente_Json(string _idCliente)
        {
            //blMantenimiento bl = new blMantenimiento();
            //string data = bl.get_Data("ERP.usp_GetAllListaDivisionxCliente_CSV", _idCliente, false, Util.ERP);
            //return data;

            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value = _idCliente, Size = 20 },
                new Parameter { Key = "IdGrupoComercial", Value = _.GetUsuario().IdGrupoComercial }
            };

            string data = dBHelper.GetData("ERP.usp_GetAllListaDivisionxCliente_CSV", Parameters);
            return data;
        }

        public string SaveNew_ClienteDivision(ClienteDivision _clienteDivision)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(_clienteDivision);
            
            int id = bl.save_Row_Out("ERP.usp_SaveNew_ClienteDivision_y_Asociar", sPar, Util.ERP);
            return id.ToString();
        }
    }
}