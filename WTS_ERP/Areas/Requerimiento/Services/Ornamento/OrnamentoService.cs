
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
    public class OrnamentoService : IOrnamentoService
    {

        public int DeleteArteById_JSON(OrnamentoViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key = "UsuarioActualizacion", Value = parametro.UsuarioActualizacion, Size=50 }
            };
            int rows = db.SaveRow("RequerimientoArte.usp_DeleteArteById", Parameters);
            return rows;
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

            string data = dBHelper.GetData("RequerimientoArte.usp_GetListaByPrograma_JSON", Parameters);
            return data;
        }

        public string GetOrnamentoLoadNew_JSON(OrnamentoViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                new Parameter { Key="IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                 new Parameter { Key="TipoSolicitud", Value = parametro.TipoSolicitud },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString()}

            };

            string data = db.GetData("RequerimientoArte.usp_GetRequerimientoArteLoadNew_JSON", Parameters);
            return data;
        }


        public string GetOrnamentoConcessionLoadNew_JSON(OrnamentoViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                 new Parameter { Key="IdRequerimientoDetalle", Value = parametro.IdRequerimientoDetalle.ToString() },
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString()}

            };

            string data = db.GetData("RequerimientoArte.usp_GetRequerimientoOrnamentoConcessionLoad_JSON", Parameters);
            return data;
        }

        public int EnviarConcesion_JSON(OrnamentoConcesion parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int IdConcesion = db.SaveRowsTransaction_Out("RequerimientoArte.usp_SendConcesion_JSON", Parameters);
            return IdConcesion;
        }

        public int Save_JSON(OrnamentoViewModels parametro, string ParameterComboColor, List<OrnamentoTest> ParameterTest, string sParameterFileProp, List<OrnamentoTestReport> ParameterTestReport)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "ParameterComboColor", Value = ParameterComboColor.ToString()  },
                 new Parameter { Key = "ParameterFileProp", Value = sParameterFileProp.ToString()  },
                new Parameter { Key = "ParameterTestDetalle", Value = JsonConvert.SerializeObject(ParameterTest), Size = -1 },
                 new Parameter { Key = "ParameterTestReport", Value = JsonConvert.SerializeObject(ParameterTestReport), Size = -1 }
            };

            int IdOrnament = db.SaveRowsTransaction_Out("RequerimientoArte.usp_Save_JSON", Parameters);
            return IdOrnament;
        }
        
        //funcionalidad file: inicio
        public int SaveFile_JSON(OrnamentoFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileTela = db.SaveRowsTransaction_Out("RequerimientoArte.usp_SaveFile_JSON", Parameters);
            return IdFileTela;
        }

        public string GetListaFileRequerimiento_JSON(OrnamentoFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoArte.usp_GetFileRequerimiento_JSON", Parameters);
            return data;
        }

        public int DeleteFile_JSON(OrnamentoFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoArte.usp_DeleteFile_JSON", Parameters);
            return rows;
        }

        //funcionalidad file: fin

        public string GetBuscarTela_JSON(string Codigo)
        {

            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                 new Parameter { Key = "Codigotela", Value = Codigo}

            };

            string data = db.GetData("RequerimientoArte.usp_GetBuscarTela_JSON", Parameters);
            return data;
        }

        public int DeleteReport_JSON(OrnamentoTestReport parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoArte.usp_DeleteReportList_JSON", Parameters);
            return rows;
        }

        public int DeleteTest_JSON(OrnamentoTest parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoArte.usp_DeleteTest_JSON", Parameters);
            return rows;
        }

        public int DeleteComboColor_JSON(OrnamentoComboColor parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoArte.usp_DeleteComboColor_JSON", Parameters);
            return rows;
        }

        public int DeleteComboColorDetalle_JSON(OrnamentoComboColor parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ParamsJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoArte.usp_DeleteComboColorDetalle_JSON", Parameters);
            return rows;
        }

        //Registro de respuesta de concesion: Inicio

        public string GuardarRespuestaConcesion(OrnamentoConcesion parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "Parameter", Value = JsonConvert.SerializeObject(parametro), Size = -1 }

            };

            string data = db.GetData("RequerimientoArte.usp_GuardarRespuestaConcesion_JSON", Parameters);
            return data;
        }

        //Registro de respuesta de concesion: Fin

        public string GetArteSearchAll_csv()
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>();
            string data = db.GetData("RequerimientoArte.usp_GetArteSearchAll_csv", Parameters);
            return data;
        }


    }
}