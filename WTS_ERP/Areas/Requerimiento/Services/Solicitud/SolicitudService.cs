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
    public class SolicitudService : ISolicitudService
    {
        public int Save_ATX(SolicitudATX parametro, List<SolicitudATXDetalle> parDetalle)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "parhead", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "pardetail", Value = JsonConvert.SerializeObject(parDetalle), Size = -1 },
                new Parameter { Key = "parsubdetail", Value = "", Size = -1 },
                new Parameter { Key = "parfoot", Value = "", Size = -1 },
            };

            int IdAnalisisTextil = db.SaveRowsTransaction_Out("usp_SolicitudWF_Insert_Csv", Parameters);
            return IdAnalisisTextil;
        }

        public int Save_Colgadores(SolicitudColgador parametro, string parDetalle, string parSubDetalleJSON)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "parhead", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "pardetail", Value = parDetalle, Size = -1 },
                new Parameter { Key = "parsubdetail", Value = parSubDetalleJSON, Size = -1 },
                new Parameter { Key = "parfoot", Value = "", Size = -1 },
            };

            int IdSolicitud = db.SaveRowsTransaction_Out("usp_SaveNew_SolicitudColgador_csv", Parameters);
            return IdSolicitud;
        }

        public string Save_Cotizacion(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value = parametro }
            };

            string data = dbHelper.GetData("DesarrolloTextil.usp_Insert_SolicitudCotizarTela", Parameters);
            return data;
        }

        public string Save_Solicitud(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            string data = dbHelper.GetData("RequerimientoTela.usp_Insert_Solicitud", Parameters);
            return data;
        }

        public int Enviar_Solicitud(SolicitudEnviar parametro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "parhead", Value = JsonConvert.SerializeObject(parametro), Size = -1 },
                new Parameter { Key = "pardetail", Value = "", Size = -1 },
                new Parameter { Key = "parsubdetail", Value = "", Size = -1 },
                new Parameter { Key = "parfoot", Value = "", Size = -1 },
            };

            int rows = db.SaveRow("uspIniciarSolicitudAtx_csv", Parameters);
            return rows;
        }
    }
}