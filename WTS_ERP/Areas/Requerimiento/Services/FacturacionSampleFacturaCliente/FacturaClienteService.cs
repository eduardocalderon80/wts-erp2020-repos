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
    public class FacturaClienteService : IFacturaClienteService
    {
        public string GetFacturaClienteLoadNew_JSON(string par)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>()
            {
                new Parameter { Key = "par", Value = par }
            };
            string data = db.GetData("RequerimientoFacturaSample.usp_GetFacturaClienteLoadNew_JSON", parameters);
            return data;
        }

        public string GetRequerimientoMuestraDetalle_JSON(string listaRequerimientosSeleccionados)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>()
            {
                new Parameter { Key = "ListaRequerimientosCadena", Value = listaRequerimientosSeleccionados }
            };
            string data = db.GetData("RequerimientoFacturaSample.usp_GetRequerimientoMuestraDetalleFacturaCliente_JSON", Parameters);
            return data;
        }

        public int SaveNewFacturaCliente_JSON(FacturaClienteViewModels parFacturaCliente,
            List<FacturaClienteDetalleViewModels> parFacturaClienteDetalle,
            List<FacturaClienteDetalleViewModels> parListaCadenaColoresModificados)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FacturaClienteJSON", Value = JsonConvert.SerializeObject(parFacturaCliente), Size = -1 },
                new Parameter { Key = "FacturaClienteDetalleJSON", Value = JsonConvert.SerializeObject(parFacturaClienteDetalle), Size = -1 },
                new Parameter { Key = "ListaColoresModificadosJSON", Value = JsonConvert.SerializeObject(parListaCadenaColoresModificados), Size = -1 }
            };

            int IdFacturaCliente = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveNewFacturaCliente_JSON", Parameters);
            return IdFacturaCliente;
        }

        public int SaveEditFacturaCliente_JSON(FacturaClienteViewModels parFacturaCliente,
            List<FacturaClienteDetalleViewModels> parFacturaClienteDetalle,
            List<FacturaClienteDetalleViewModels> parListaCadenaColoresModificados, string sParListaOrdenPedidos)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FacturaClienteJSON", Value = JsonConvert.SerializeObject(parFacturaCliente), Size = -1 },
                new Parameter { Key = "FacturaClienteDetalleJSON", Value = JsonConvert.SerializeObject(parFacturaClienteDetalle), Size = -1 },
                new Parameter { Key = "ListaColoresModificadosJSON", Value = JsonConvert.SerializeObject(parListaCadenaColoresModificados), Size = -1 },
                new Parameter { Key = "ListaOrdenesPedidosJSON", Value = sParListaOrdenPedidos }
            };

            int IdFacturaCliente = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveEditFacturaCliente_JSON", Parameters);
            return IdFacturaCliente;
        }

        public int SaveCancelarFacturaCliente_JSON(int idFacturaCliente, string usuario)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() {
                new Parameter { Key = "IdFacturaCliente", Value = idFacturaCliente.ToString() },
                new Parameter { Key = "Usuario", Value = usuario }
            };

            int rows = db.SaveRowsTransaction("RequerimientoFacturaSample.usp_SaveCancelarFacturaCliente_JSON", parameters);

            return rows;
        }

        public string GetFacturaClienteLoadEdit_JSON(string sPar)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "par", Value = sPar }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetFacturaClienteLoadEdit_JSON", parameters);
            return data;
        }

        public string GetFacturaClienteForReporteByIdJSON(int IdFacturaCliente)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>()
            {
                new Parameter { Key = "IdFacturaCliente", Value = IdFacturaCliente.ToString() }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetFacturaClienteForReporteByIdJSON", parameters);
            return data;
        }
    }
}