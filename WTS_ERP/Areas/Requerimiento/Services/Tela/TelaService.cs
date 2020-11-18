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
    public class TelaService : ITelaService
    {
        public string GetTelaLoadNew_JSON(TelaViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                //new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                //new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString() }
                 new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoTela.usp_GetRequerimientoTelaLoadNew_JSON", Parameters);
            return data;
        }

        public int Save_JSON(TelaViewModels parametro, string sParameterFileProp)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                 new Parameter { Key = "ParameterFileProp", Value = sParameterFileProp.ToString()}
            };

            int IdRequerimiento = db.SaveRowsTransaction_Out("RequerimientoTela.usp_SaveTela_JSON", Parameters);
            return IdRequerimiento;
        }    

        //funcionalidad file: inicio
        public int SaveFileTela_JSON(TelaFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {       

                  new Parameter { Key = "TelaFileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileTela = db.SaveRowsTransaction_Out("RequerimientoTela.usp_SaveFile_JSON", Parameters);
            return IdFileTela;
        }

        public string GetListaFileRequerimiento_JSON(TelaFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                  new Parameter { Key = "TelaFileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoTela.usp_GetFileRequerimiento_JSON", Parameters);
            return data;
        }

        public int DeleteFileTela_JSON(TelaFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "TelaFileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoTela.usp_DeleteFile_JSON", Parameters);
            return rows;
        }

        //funcionalidad file: fin
        public string GetListRequerimientoByPrograma_JSON(string _idPrograma)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {
                    Key = "par",
                    Value = _idPrograma,
                    Size = 20
                }
            };

            string data = dBHelper.GetData("RequerimientoTela.usp_GetListaTelaByPrograma_JSON", Parameters);
            return data;
        }

        public string UpdateEstadoTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoEstilo.usp_Update_EstadoReqEstilo", Parameters);
            return data;
        }

        public string GetEnlacesTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Get_EnlacesTela", Parameters);
            return data;
        }

        public string SaveEnlacesCombinaciones(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Insert_CombinacionesTela", Parameters);
            return data;
        }

        public string DeleteEnlacesCombinaciones(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Delete_CombinacionesTela", Parameters);
            return data;
        }

        public string DeleteTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Delete_Tela", Parameters);
            return data;
        }

        public string GetAllTelasCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_GetAll_TelasCarryOverNew", Parameters);
            return data;
        }

        public string GetTelaCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Get_TelaCarryOverNew", Parameters);
            return data;
        }

        public string SaveTelasCarryOverNew(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Insert_TelasCarryOverNew", Parameters);
            return data;
        }
    }
}