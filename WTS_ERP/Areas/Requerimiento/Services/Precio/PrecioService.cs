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
    public class PrecioService : IPrecioService
    {
        public string GetFlashCost(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_FlashCost", Parameters);
            return data;
        }

        public string GetPrecioAvios(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_PrecioAvios", Parameters);
            return data;
        }

        public string GetPrecioArte(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_PrecioArte", Parameters);
            return data;
        }

        public string GetPrecioEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_PrecioEstilo", Parameters);
            return data;
        }

        public string GetPrecioTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_PrecioTela", Parameters);
            return data;
        }

        public string InsertPrecioAvio(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Insert_PrecioAvio", Parameters);
            return data;
        }

        public string InsertPrecioArte(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Insert_PrecioArte", Parameters);
            return data;
        }

        public string InsertPrecioEstilo(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Insert_PrecioEstilo", Parameters);
            return data;
        }

        public string InsertPrecioTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Insert_PrecioTela", Parameters);
            return data;
        }

        public string DeletePrecioTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Delete_PrecioTela", Parameters);
            return data;
        }

        public string GetAllPrecioTela(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_GetAll_PrecioTela", Parameters);
            return data;
        }

        public string GetAllFlashCost(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_GetAll_FlashCost", Parameters);
            return data;
        }

        public string GetAllFlashCost_New(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_GetAll_FlashCost_New", Parameters);
            return data;
        }

        public string InsertRequerimientoFlashCost(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Insert_RequerimientoFlashCost", Parameters);
            return data;
        }

        public string GetFlashCostByProgram(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Get_FlashCostByProgram", Parameters);
            return data;
        }

        public string DeletePrice(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoPrecio.usp_Delete_Price", Parameters);
            return data;
        }
    }
}