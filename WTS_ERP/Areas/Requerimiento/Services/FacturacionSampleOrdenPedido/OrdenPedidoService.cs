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
    public class OrdenPedidoService : IOrdenPedidoService
    {
        public int SaveNewOrdenPedido_JSON(OrdenPedidoViewModels parOrdenPedido,
            List<OrdenPedidoDetalleViewModels> parOrdenPedidoDetalle,
            List<OrdenPedidoArchivoHojaDeCostosViewModels> parListaArchivos,
            List<OrdenPedidoDetalleViewModels> parListaCadenaColoresModificados)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "OrdenPedidoJSON", Value = JsonConvert.SerializeObject(parOrdenPedido), Size = -1 },
                new Parameter { Key = "OrdenPedidoDetalleJSON", Value = JsonConvert.SerializeObject(parOrdenPedidoDetalle), Size = -1 },
                new Parameter { Key = "ListaArchivosJSON", Value = JsonConvert.SerializeObject(parListaArchivos), Size = -1 },
                new Parameter { Key = "ListaColoresModificadosJSON", Value = JsonConvert.SerializeObject(parListaCadenaColoresModificados), Size = -1 }
            };

            int IdOrdenPedido = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveNewOrdenPedido_JSON", Parameters);
            return IdOrdenPedido;
        }

        public int SaveEditOrdenPedido_JSON(OrdenPedidoViewModels parOrdenPedido,
            List<OrdenPedidoDetalleViewModels> parOrdenPedidoDetalle,
            List<OrdenPedidoArchivoHojaDeCostosViewModels> parListaArchivos,
            List<OrdenPedidoDetalleViewModels> parListaCadenaColoresModificados)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "OrdenPedidoJSON", Value = JsonConvert.SerializeObject(parOrdenPedido), Size = -1 },
                new Parameter { Key = "OrdenPedidoDetalleJSON", Value = JsonConvert.SerializeObject(parOrdenPedidoDetalle), Size = -1 },
                new Parameter { Key = "ListaArchivosJSON", Value = JsonConvert.SerializeObject(parListaArchivos), Size = -1 },
                new Parameter { Key = "ListaColoresModificadosJSON", Value = JsonConvert.SerializeObject(parListaCadenaColoresModificados), Size = -1 }
            };

            int IdOrdenPedido = db.SaveRowsTransaction_Out("RequerimientoFacturaSample.usp_SaveEditOrdenPedido_JSON", Parameters);
            return IdOrdenPedido;
        }

        public string GetOrdenPedidoLoadNew_JSON(string par)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>()
            {
                new Parameter { Key = "par", Value = par }
            };
            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoLoadNew_JSON", parameters);
            return data;
        }

        public string GetRequerimientoMuestraDetalle_JSON(string listaRequerimientosSeleccionados)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>()
            {
                new Parameter { Key = "ListaRequerimientosCadena", Value = listaRequerimientosSeleccionados }
            };
            string data = db.GetData("RequerimientoFacturaSample.usp_GetRequerimientoMuestraDetalleOrdenPedido_JSON", Parameters);
            return data;
        }

        public int SaveCancelarOrdenPedido_JSON(int idOrdenPedido, string usuario)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "IdOrdenPedido", Value = idOrdenPedido.ToString() },
                new Parameter { Key = "Usuario", Value = usuario }
            };

            int rows = db.SaveRow("RequerimientoFacturaSample.usp_SaveCancelarOrdenPedido_JSON", parameters);

            return rows;
        }

        public string GetOrdenPedidoByIdForFacturaFabricaSave_CSV(int IdOrdenPedido)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key="IdOrdenPedido", Value=IdOrdenPedido.ToString() }
            };

            //// SE CAMBIO DE NOMBRE DE STORE
            ////string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoById_CSV", parameters);
            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoByIdForFacturaFabricaSave_CSV", parameters);
            return data;
        }

        public string GetOrdenPedidoLoadSeleccionarOP_JSON(int idPrograma, int idCliente, 
            int idGrupoPersonal, int idProveedor)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() {
                new Parameter { Key="IdPrograma", Value=idPrograma.ToString() },
                new Parameter { Key="IdCliente", Value=idCliente.ToString() },
                new Parameter { Key="IdGrupoPersonal", Value=idGrupoPersonal.ToString() },
                new Parameter { Key = "IdProveedor", Value = idProveedor.ToString() }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoLoadSeleccionarOP_JSON", parameters);
            return data;
        }

        public string GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON(int idOrdenPedido)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>()
            {
                new Parameter { Key = "IdOrdenPedido", Value = idOrdenPedido.ToString() }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON", parameters);
            return data;
        }

        public int SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON(OrdenPedidoViewModels ordenPedido)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "OrdenPedidoJSON", Value= JsonConvert.SerializeObject(ordenPedido) }
            };

            int rows = db.SaveRow("RequerimientoFacturaSample.usp_SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON", parameters);
            return rows;
        }

        public string GetOrdenPedidoLoadEdit_JSON(string par)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>() { 
                new Parameter { Key = "par", Value = par }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoLoadEdit_JSON", parameters);
            return data;
        }

        public string test_ordenpedido(int idOrdenPedido)
        {
            DBHelper db = new DBHelper();
            List<Parameter> parameters = new List<Parameter>()
            {
                new Parameter { Key = "IdOrdenPedido", Value = idOrdenPedido.ToString() }
            };

            string data = db.GetData("RequerimientoFacturaSample.usp_GetOrdenPedidoForReportePoByIdJSON", parameters);
            return data;
        }
    }
}