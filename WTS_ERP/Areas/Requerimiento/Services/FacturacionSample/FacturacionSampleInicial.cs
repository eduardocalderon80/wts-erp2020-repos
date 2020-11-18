using BE_ERP;
using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public class FacturacionSampleInicial : IFacturacionSampleInicial
    {
        public string GetRequerimientoMuestraFacturacionInicial_JSON(int IdPrograma)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "IdPrograma", Value = IdPrograma.ToString() }
            };
            string data = db.GetData("RequerimientoFacturaSample.usp_GetRequerimientoMuestraFacturacionInicial", Parameters);
            return data;
        }

        public int SaveUpdateRequerimientoMuestraFacturacionInicialJSON(List<RequerimientoMuestraViewModels> listaRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "RequerimientosJSON", Value=JsonConvert.SerializeObject(listaRequerimiento) }
            };

            int rows = db.SaveRow_Out("RequerimientoFacturaSample.usp_SaveUpdateRequerimientoMuestraFacturacionInicialJSON", parameters);
            return rows;
        }
    }
}