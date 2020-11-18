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
    public class FacturaFabricaService : IFacturaFabricaService
    {
        public string GetFacturaFabricaLoadNew_JSON(int idPrograma, int idCliente, int idGrupoPersonal)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key="IdPrograma", Value= idPrograma.ToString() },
                new Parameter { Key="IdCliente", Value=idCliente.ToString() },
                new Parameter { Key="IdGrupoPersonal", Value=idGrupoPersonal.ToString() }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetFacturaFabricaLoadNew_JSON", parameters);
            return data;
        }

        public int SaveNewFacturaFabrica_JSON(FacturaFabricaViewModels facturaFabricaJSON
            , List<FacturaFabricaDetalleViewModels> facturaFabricaDetalleJSON)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key="FacturaFabricaJSON", Value=JsonConvert.SerializeObject(facturaFabricaJSON) },
                new Parameter { Key="FacturaFabricaDetalleJSON", Value=JsonConvert.SerializeObject(facturaFabricaDetalleJSON) }
            };

            int idFacturaFabrica = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveNewFacturaFabrica_JSON", parameters);
            return idFacturaFabrica;
        }

        public int SaveEditFacturaFabrica_JSON(FacturaFabricaViewModels facturaFabricaJSON
            , List<FacturaFabricaDetalleViewModels> facturaFabricaDetalleJSON)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() {
                new Parameter { Key="FacturaFabricaJSON", Value=JsonConvert.SerializeObject(facturaFabricaJSON) },
                new Parameter { Key="FacturaFabricaDetalleJSON", Value=JsonConvert.SerializeObject(facturaFabricaDetalleJSON) }
            };

            int idFacturaFabrica = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveEditFacturaFabrica_JSON", parameters);
            return idFacturaFabrica;
        }

        public int SaveCancelarFacturaFabrica_JSON(int idFacturaFabrica, string usuario)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() {
                new Parameter { Key = "IdFacturaFabrica", Value = idFacturaFabrica.ToString() },
                new Parameter { Key = "Usuario", Value = usuario }
            };

            int rows = db.SaveRow("RequerimientoFacturaSample.usp_SaveCancelarFacturaFabrica_JSON", parameters);

            return rows;
        }

        public string GetFacturaFabricaLoadEdit_JSON(string sPar)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "par", Value = sPar }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetFacturaFabricaLoadEdit_JSON", parameters);
            return data;
        }
    }
}