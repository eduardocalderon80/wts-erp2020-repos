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
    public class EstiloService : IEstiloService
    {
        public int DeleteEstiloById_JSON(EstiloViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdEstilo", Value = parametro.IdEstilo.ToString() },
                new Parameter { Key = "UsuarioActualizacion", Value = parametro.UsuarioActualizacion, Size=50 }
            };
            int rows = db.SaveRow("Producto.usp_DeleteEstiloById_JSON", Parameters);
            return rows;
        }

        public string GetEstiloLoadEditar_JSON(EstiloViewModels parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdEstilo", Value = parametro.IdEstilo.ToString() },
                new Parameter { Key = "IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString() }
            };

            string data = dbHelper.GetData("Producto.usp_GetEstiloLoadEditar_JSON", Parameters);
            return data;
        }

        public string GetEstiloLoadNew_JSON(EstiloViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString() }
            };

            string data = db.GetData("Producto.usp_GetEstiloLoadNew_JSON", Parameters);
            return data;
        }

        public string GetListaEstiloByPrograma_JSON(string _idPrograma)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {
                    Key = "par",
                    Value = _idPrograma,
                    Size = 20
                }
            };

            string data = dBHelper.GetData("Producto.usp_GetListaEstiloByPrograma_JSON", Parameters);
            return data;
        }

        public int SaveEditar_Estilo_JSON(EstiloViewModels parametro, List<RequerimientoMuestraViewModels> parRequerimiento
            , List<RequerimientoArchivoViewModels> parLstRequerimientoArchivo, int parIdRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "EstiloJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "RequerimientoJSON", Value = JsonConvert.SerializeObject(parRequerimiento), Size = -1 },
                new Parameter { Key = "RequerimientoArchivoJSON", Value = JsonConvert.SerializeObject(parLstRequerimientoArchivo), Size = -1 },
                new Parameter { Key = "IdRequerimiento", Value = parIdRequerimiento.ToString() }
            };

            int IdEstilo = db.SaveRowsTransaction_Out("Producto.usp_SaveEditar_Estilo_JSON", Parameters);
            return IdEstilo;
        }

        public int SaveNew_Estilo_JSON(EstiloViewModels parametro, List<RequerimientoMuestraViewModels> parRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "EstiloJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "RequerimientoJSON", Value = JsonConvert.SerializeObject(parRequerimiento), Size = -1 }
            };

            int IdEstilo = db.SaveRowsTransaction_Out("Producto.usp_SaveNew_Estilo_JSON", Parameters);
            return IdEstilo;
        }

        public string UpdateEstadoEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_Update_EstadoReqEstilo", Parameters);
            return data;
        }

        public string SendSamplesEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_Update_EnviarMuestras", Parameters);
            return data;
        }

        public string GetBuscarTela_JSON(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_GetBuscarTela_JSON", Parameters);
            return data;
        }

        public string GetAllStylesCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_GetAll_StylesCarryOverNew", Parameters);
            return data;
        }

        public string GetStyleCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_Get_StyleCarryOverNew", Parameters);
            return data;
        }

        public int SaveStylesCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            int data = dbHelper.SaveRowsTransaction_Out("RequerimientoEstilo.usp_Insert_StyleCarryOverNew", Parameters);
            return data;
        }

        public int SaveMainFabric(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            int data = dbHelper.SaveRowsTransaction_Out("RequerimientoEstilo.usp_Update_MainFabric", Parameters);
            return data;
        }
    }
}