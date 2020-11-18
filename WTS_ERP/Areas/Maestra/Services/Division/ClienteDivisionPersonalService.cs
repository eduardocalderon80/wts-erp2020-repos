using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public class ClienteDivisionPersonalService : IClienteDivisionPersonalService
    {


        public string GetAll_ClienteDivisionByCliente_Json(string _idCliente)
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("ERP.usp_GetAllListaDivisionxCliente_CSV", _idCliente, false, Util.ERP);
            return data;
        }

        public string SaveNew_ClienteDivision(ClienteDivision _clienteDivision)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(_clienteDivision);
            
            int id = bl.save_Row_Out("ERP.usp_SaveNew_ClienteDivision_y_Asociar", sPar, Util.ERP);
            return id.ToString();
        }

        public string DivisionClient_List(string _idCliente)
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("ERP.usp_ClienteDivisionPersonal_List", _idCliente, false, Util.ERP);
            return data;
        }

        public string CargarClienteMarcaDivision(string Params)
        {
            blMantenimiento bl = new blMantenimiento();
            string data = bl.get_Data("ERP.usp_ClienteMarcaDivisionPersonal_List", Params, false, Util.ERP);
            return data;
        }

        public string ClientDivisionLoad_List(string Params)
        {
            blMantenimiento bl = new blMantenimiento();
                string data = bl.get_Data("ERP.usp_GetClienteMarcaDivisionLoadNew_JSON", Params, false, Util.ERP);
            return data;
        }
    }
}