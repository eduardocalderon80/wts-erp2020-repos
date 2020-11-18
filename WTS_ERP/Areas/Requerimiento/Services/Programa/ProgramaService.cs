using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Services;
using BL_ERP;
using WTS_ERP.Models;
using WTS_ERP.Areas.Requerimiento.Models;
using Newtonsoft.Json;
using BE_ERP;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public class ProgramaService : IProgramaService
    {
        public string GetListaPrograma_Index(ProgramaViewModels parametro)
        {
            //blMantenimiento bl = new blMantenimiento();
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>()
            {
                new Parameter { Key = "par", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };
            //string data = bl.get_Data("Producto.GetListaProgramaIndex_JSON", "", false, Util.ERP);
            string data = dbHelper.GetData("Producto.GetListaProgramaIndex_JSON", Parameters);
            return data;
        }

        public string GetProgramaNew_JSON(ProgramaViewModels parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            string data = bl.get_Data("Producto.GetProgramaNew_JSON", sPar, false, Util.ERP);
            return data;
        }

        public string GetProgramaEditar_JSON(ProgramaViewModels parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            string data = bl.get_Data("Producto.GetProgramaEditar_JSON", sPar, false, Util.ERP);
            return data;
        }

        public string Save_Edit_Programa(Programa parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            int id = bl.save_Row_Out("Producto.SaveEdit_Programa_JSON", sPar, Util.ERP);
            return id.ToString();
        }

        public string Save_New_Programa(Programa parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            int id = bl.save_Row_Out("Producto.SaveNew_Programa_JSON", sPar, Util.ERP);
            return id.ToString();
        }

        public string GetListaCombosRequerimiento_JSON(string _idCliente)
        {
            DBHelper dBHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value = _idCliente, Size = 20 },
                new Parameter { Key = "IdGrupoComercial", Value = _.GetUsuario().IdGrupoComercial }
            };

            string data = dBHelper.GetData("ERP.usp_GetListaCombosRequerimientoByCliente_JSON", Parameters);
            return data;
        }

        public string GetListaProgramaIndexFilter_JSON(ProgramaViewModels parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {  Key = "par", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };
            string data = dbHelper.GetData("Producto.GetListaProgramaIndexFilter_JSON", Parameters);
            return data;
        }

        public string GetValidarModificarPrograma_JSON(ProgramaViewModels parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter {  Key = "par", Value = JsonConvert.SerializeObject(parametro), Size = -1 }
            };
            string data = dbHelper.GetData("Producto.GetValidarModificarPrograma_JSON", Parameters);
            return data;
        }        

        public int DeleteProgramaById_JSON(ProgramaViewModels parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdPrograma", Value = parametro.IdPrograma.ToString() },
                new Parameter { Key = "UsuarioActualizacion", Value = parametro.UsuarioActualizacion }
            };

            int rowsAfectados = dbHelper.SaveRow("Producto.usp_DeleteProgramaById_JSON", Parameters);
            return rowsAfectados;
        }

        public string SaveEnlaceRequerimiento(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Requerimiento.usp_Save_EnlaceRequerimiento", Parameters);
            return data;
        }

        public string DeleteEnlaceRequerimiento(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Requerimiento.usp_Delete_EnlaceRequerimiento", Parameters);
            return data;
        }

        public string GetAllReqsDetails(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Requerimiento.usp_GetAll_ReqsDetails", Parameters);
            return data;
        }

        public string InsertSendEmail(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Requerimiento.usp_Insert_SendEmail", Parameters);
            return data;
        }

        public string GetCorreoReq(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Requerimiento.usp_Get_CorreosReq", Parameters);
            return data;
        }

        public string Validate_ProgramaPK(Programa parametro)
        {
            blMantenimiento bl = new blMantenimiento();
            string sPar = JsonConvert.SerializeObject(parametro);
            int id = bl.save_Row_Out("Producto.usp_Get_ValidarProgramaPK", sPar, Util.ERP);
            return id.ToString();
        }
    }
}