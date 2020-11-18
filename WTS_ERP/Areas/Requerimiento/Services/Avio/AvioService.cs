using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Models;
using Newtonsoft.Json;
using BE_ERP;
using BL_ERP;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public class AvioService : IAvioService
    {
        public string GetListRequeriminetoByPrograma_JSON(string _idPrograma)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {
                    Key = "par",
                    Value = _idPrograma,
                    Size = 20
                }
            };

            string data = dBHelper.GetData("RequerimientoAvio.usp_GetListaByPrograma_JSON", Parameters);
            return data;
        }
        public string GetAvioLoadNew_JSON(AvioViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key="IdRequerimiento", Value = parametro.IdRequerimiento.ToString() },
                new Parameter { Key="IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString() },
                  new Parameter { Key = "TipoSolicitud", Value = parametro.TipoSolicitud.ToString() }
            };

            string data = db.GetData("RequerimientoAvio.usp_GetRequerimientoLoadNew_JSON", Parameters);
            return data;
        }
        public string GetAvioLoadEditar_JSON(AvioViewModels parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = parametro.IdRequerimiento.ToString() },
                new Parameter { Key = "IdCliente", Value = parametro.IdCliente.ToString() },
                new Parameter { Key = "IdGrupoPersonal", Value = parametro.IdGrupoPersonal.ToString() }
            };

            string data = dbHelper.GetData("RequerimientoAvio.usp_GetRequerimientoLoadEditar_JSON", Parameters);
            return data;
        }
        public string GetStyleCode_JSON(AvioViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key="StyleCodeJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }                
            };

            string data = db.GetData("RequerimientoAvio.usp_GetStyleCode_JSON", Parameters);
            return data;
        }

        public int Save_JSON(AvioViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "AvioJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdAvio = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_Save_JSON", Parameters);
            return IdAvio;
        }
        public int SaveFileAvio_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileAvio = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_SaveFile_JSON", Parameters);
            return IdFileAvio;
        }
        public int UpdateFileAvio_JSON(AvioFile[] parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                  new Parameter { Key = "ParameterFile", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileAvio = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_UpdateFile_JSON", Parameters);
            return IdFileAvio;
        }
        public string GetListaFileRequerimiento_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoAvio.usp_GetFileRequerimiento_JSON", Parameters);
            return data;
        }
        public int DeleteFileAvio_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_DeleteFile_JSON", Parameters);
            return rows;
        }


        public int SaveFileAvioSummary_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {

                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            int IdFileAvio = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_SaveFileSummary_JSON", Parameters);
            return IdFileAvio;
        }
        public string GetListaFileRequerimientoAvioSummary_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                  new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
            };

            string data = db.GetData("RequerimientoAvio.usp_GetFileRequerimientoSummary_JSON", Parameters);
            return data;
        }
        public int DeleteFileAvioSummary_JSON(AvioFile parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "FileJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_DeleteFileSummary_JSON", Parameters);
            return rows;
        }


        public int DeleteStyleCodeAvio_JSON(AvioViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "StyleCodeAvioJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            int rows = db.SaveRowsTransaction_Out("RequerimientoAvio.usp_DeleteStyleCodeSummary_JSON", Parameters);
            return rows;            
        }
        public string GetListaStyleCodeAvio_JSON(AvioViewModels parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "StyleCodeAvioJSON", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };

            string data = db.GetData("RequerimientoAvio.usp_GetListaStyleCodeSummary_JSON", Parameters);
            return data;
        }

        public string GetAvioSearchAll_csv(string parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };
            string data = db.GetData("Requerimiento.usp_GetAvioSearchAll_csv", Parameters);
            return data;
        }

        public string DeleteAvio(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoAvio.usp_DeleteAvio_JSON", Parameters);
            return data;
        }

        public int SaveLinkAvioEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value = parametro }
            };

            int data = dbHelper.SaveRowsTransaction_Out("RequerimientoAvio.usp_Insert_LinkAvioEstilo", Parameters);
            return data;
        }

        public string DeleteLinkAvioEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value = parametro }
            };

            string data = dbHelper.GetData("RequerimientoAvio.usp_Delete_LinkAvioEstilo", Parameters);
            return data;
        }
    }
}