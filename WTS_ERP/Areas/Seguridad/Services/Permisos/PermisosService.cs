using BE_ERP;
using BL_ERP;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Seguridad.Services
{
    public class PermisosService : IPermisosService
    {
        public int Delete_Permisos(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            int rows = dbHelper.SaveRow("Seguridad.usp_Delete_Permisos", Parameters, Util.SeguridadERP);
            return rows;
        }

        public string GetAll_Permisos(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_GetAll_Permisos", Parameters, false, Util.SeguridadERP);
            return data;
        }

        public string Get_Combos(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Get_CombosPermisos", Parameters, false, Util.SeguridadERP);
            return data;
        }

        public int Insert_Permisos(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            int data = dbHelper.SaveRowsTransaction_Out("Seguridad.usp_Insert_Permisos", Parameters, Util.SeguridadERP);
            return data;
        }

        public bool Validate_Permisos(string controller, string view, int idpersonal)
        {
            JObject jObject = new JObject();
            jObject.Add("Controller", controller);
            jObject.Add("View", view);
            jObject.Add("IdPersonal", idpersonal);

            string parametro = JsonConvert.SerializeObject(jObject);

            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Validate_Permisos", Parameters, false, Util.SeguridadERP);
            return int.Parse(data) > 0 ? true : false;
        }

        public bool Validate_Permisos_Client(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Validate_Permisos", Parameters, false, Util.SeguridadERP);
            return int.Parse(data) > 0 ? true : false;
        }

        public string GetUserPermissions(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Get_PermisosxPersonal", Parameters, false, Util.SeguridadERP);
            return data;
        }

        public string GetRowInfo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Get_GetRowInfo", Parameters, false, Util.SeguridadERP);
            return data;
        }

        public string GetUserInfo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("Seguridad.usp_Get_UserInfo", Parameters, false, Util.SeguridadERP);
            return data;
        }
    }
}