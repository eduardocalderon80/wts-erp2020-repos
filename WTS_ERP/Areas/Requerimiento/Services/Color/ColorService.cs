
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
    public class ColorService : IColorService
    {

        public int DeleteColorById_JSON(ColorViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key = "UsuarioActualizacion", Value = parametro.UsuarioActualizacion, Size=50 }
            };
             int rows = db.SaveRow("RequerimientoColor.usp_DeleteColorById", Parameters);
            return rows;
        }
        public string GetColorLoadNew_JSON(ColorViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                 new Parameter { Key="IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key="TipoSolicitud", Value = parametro.TipoSolicitud },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString()}
               
            };

            string data = db.GetData("RequerimientoColor.usp_GetRequerimientoColorLoadNew_JSON", Parameters);
            return data;
        }

        public string GetColorConcessionLoadNew_JSON(ColorViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                 new Parameter { Key="IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString()}

            };

            string data = db.GetData("RequerimientoColor.usp_GetRequerimientoColorConcessionLoad_JSON", Parameters);
            return data;
        }

        public int EnviarConcesion_JSON(ColorConcesion parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int IdConcesion = db.SaveRowsTransaction_Out("RequerimientoColor.usp_SendConcesion_JSON", Parameters);
            return IdConcesion;
        }

        public int Save_JSON(ColorViewModels parametro, string ParameterComboColor, List<ColorTest> ParameterTest,string sParameterFileProp, List<ColorTestReport> ParameterTestReport)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "ParameterComboColor", Value = ParameterComboColor.ToString()  },
                 new Parameter { Key = "ParameterFileProp", Value = sParameterFileProp.ToString()  },
                new Parameter { Key = "ParameterTestDetalle", Value = JsonConvert.SerializeObject(ParameterTest), Size = -1 },
                new Parameter { Key = "ParameterTestReport", Value = JsonConvert.SerializeObject(ParameterTestReport), Size = -1 }
            };

            int IdColor = db.SaveRowsTransaction_Out("RequerimientoColor.usp_SaveColor_JSON", Parameters);
            return IdColor;
        }        
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

            string data = dBHelper.GetData("RequerimientoColor.usp_GetListaColorByPrograma_JSON", Parameters);
            return data;
        }

        //funcionalidad file: inicio
        public int SaveFile_JSON(ColorFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileTela = db.SaveRowsTransaction_Out("RequerimientoColor.usp_SaveFile_JSON", Parameters);
            return IdFileTela;
        }

        public string GetListaFileRequerimiento_JSON(ColorFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoColor.usp_GetFileRequerimiento_JSON", Parameters);
            return data;
        }

        public int DeleteFile_JSON(ColorFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoColor.usp_DeleteFile_JSON", Parameters);
            return rows;
        }

        public string GetBuscarTela_JSON(string Codigo)
        {

            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                 new Parameter { Key = "Codigotela", Value = Codigo}

            };

            string data = db.GetData("RequerimientoColor.usp_GetBuscarTela_JSON", Parameters);
            return data;
        }

        //funcionalidad file: fin

        public int DeleteReport_JSON(ColorTestReport parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoColor.usp_DeleteReportList_JSON", Parameters);
            return rows;
        }

        public int DeleteTest_JSON(ColorTest parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoColor.usp_DeleteTest_JSON", Parameters);
            return rows;
        }

        public int DeleteComboColor_JSON(ComboColor parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoColor.usp_DeleteComboColor_JSON", Parameters);
            return rows;
        }

        public int DeleteComboColorDetalle_JSON(ComboColor parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoColor.usp_DeleteComboColorDetalle_JSON", Parameters);
            return rows;
        }

        //Registro de respuesta de concesion: Inicio

        public string GuardarRespuestaConcesion(ColorConcesion parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
                
            };

            string data = db.GetData("RequerimientoColor.usp_GuardarRespuestaConcesion_JSON", Parameters);
            return data;
        }

        //Registro de respuesta de concesion: Fin

        public string GetColorSearchAll_csv()
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>();
            string data = db.GetData("RequerimientoColor.usp_GetColorSearchAll_csv", Parameters);
            return data;
        }

    }
}