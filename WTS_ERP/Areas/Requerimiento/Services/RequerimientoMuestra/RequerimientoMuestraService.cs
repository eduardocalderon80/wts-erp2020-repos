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
    public class RequerimientoMuestraService : IRequerimientoMuestraService
    {
        //public string GetRequerimientoById_JSON(int idRequerimiento)
        //{
        //    DBHelper db = new DBHelper();
        //    List<Parameter> Parameters = new List<Parameter>() {
        //        new Parameter { Key = "IdRequerimiento", Value = idRequerimiento.ToString() }
        //    };

        //    string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoById_JSON", Parameters);
        //    return data;
        //}

        public string GetRequerimientoDetalleLoadEdit_JSON(RequerimientoMuestra requerimientoMuestra)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = requerimientoMuestra.IdRequerimiento.ToString() },
                new Parameter { Key = "IdCliente", Value = requerimientoMuestra.IdCliente.ToString() },
                new Parameter { Key = "IdPrograma", Value = requerimientoMuestra.IdPrograma.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoDetalleLoadEdit_JSON", Parameters);
            return data;
        }

        public string GetRequerimientoDetalleLoadNew_JSON(RequerimientoMuestra requerimientoMuestra)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdCliente", Value = requerimientoMuestra.IdCliente.ToString() },
                new Parameter { Key = "IdPrograma", Value = requerimientoMuestra.IdPrograma.ToString() }  //// POR MIENTRAS PASAR ESTE DATO CON CERO = 0
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoDetalleLoadNew_JSON", Parameters);
            return data;
        }

        public int SaveNew_RequerimientoWithDetalle_JSON(RequerimientoMuestraViewModels requerimientoMuestra
            , List<RequerimientoMuestraDetalle> lstRequerimientoMuestraDetalle
            , List<RequerimientoArchivoViewModels> lstRequerimientoArchivo
            , string usuario, string ip, string hostName)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key="RequerimientoJSON", Value = JsonConvert.SerializeObject(requerimientoMuestra), Size = -1 },
                new Parameter { Key = "RequerimientoDetalleJSON", Value = JsonConvert.SerializeObject(lstRequerimientoMuestraDetalle), Size = -1 },
                new Parameter { Key = "RequerimientoArchivoJSON", Value = JsonConvert.SerializeObject(lstRequerimientoArchivo), Size = -1 },
                new Parameter { Key = "Usuario", Value = usuario, Size = 50 },
                new Parameter { Key = "Ip", Value = ip, Size = 50 },
                new Parameter { Key = "HostName", Value = hostName, Size = 50 }
            };

            int IdRequerimiento = db.SaveRowsTransaction_Out("DesarrolloProducto.usp_SaveNew_RequerimientoWithDetalle_JSON", Parameters);
            return IdRequerimiento;
        }

        public string GetRequerimientoWithDetalleById_JSON(int idRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = idRequerimiento.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoWithDetalleById_JSON", Parameters);
            return data;
        }

        public int DeleteRequerimientoMuetraById_JSON(RequerimientoMuestraViewModels requerimientoMuestra)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoJSON", Value = JsonConvert.SerializeObject(requerimientoMuestra), Size = -1 }
            };

            int rows = db.SaveRow("DesarrolloProducto.usp_DeleteRequerimientoMuetraById_JSON", Parameters);
            return rows;
        }

        public string GetRequerimientoByIdEstilo_JSON(int idEstilo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdEstilo", Value = idEstilo.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoByIdEstilo_JSON", Parameters);
            return data;
        }

        public int DeleteRequerimientoMuestraDetalleById_JSON(RequerimientoMuestraDetalle requerimientoMuestraDetalle)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoDetalleJSON", Value = JsonConvert.SerializeObject(requerimientoMuestraDetalle), Size = -1 }
            };

            int rows = db.SaveRow("DesarrolloProducto.usp_DeleteRequerimientoMuestraDetalleById_JSON", Parameters);
            return rows;

        }

        public string GetRequerimientoDetalleByIdRequerimiento_JSON(int idRequerimientoMuestraDetalle)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = idRequerimientoMuestraDetalle.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoDetalleByIdRequerimiento_JSON", Parameters);
            return data;
        }

        public int DeleteArchivoRequerimientoById_JSON(RequerimientoArchivoViewModels requerimientoArchivo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "ArchivoJSON", Value = JsonConvert.SerializeObject(requerimientoArchivo), Size = -1 }
            };

            int rows = db.SaveRow("DesarrolloProducto.usp_DeleteArchivoRequerimientoById_JSON", Parameters);
            return rows;
        }

        public string GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON(int idRequerimiento, int idEstilo = 0)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = idRequerimiento.ToString() },
                new Parameter { Key = "IdEstilo", Value = idEstilo.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON", Parameters);
            return data;
        }

        //// **** DDP - DESPACHOS - OSCAR
        public string GetLoadIndexRequerimientoDespachoDDP_JSON(int IdPersonal)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdPersonal", Value = IdPersonal.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetLoadIndexRequerimientoDespachoDDP_JSON", Parameters);
            return data;
        }

        public string GetListaFiltroRequerimientoDespachoDDP_JSON(RequerimientoMuestraFiltroDDPViewModels filtro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoJSON", Value = JsonConvert.SerializeObject(filtro) }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaFiltroRequerimientoDespachoDDP_JSON", Parameters);
            return data;
        }

        public string GetListaFiltroRequerimientoDespachoDDPExportar_JSON(RequerimientoMuestraFiltroDDPViewModels filtro)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoJSON", Value = JsonConvert.SerializeObject(filtro) }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaFiltroRequerimientoDespachoDDP_JSON_EXCEL", Parameters);
            return data;
        }

        public string GetCombosFiltroDespachoByIdsClientes_JSON(string idsClientes)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdsClientes", Value = idsClientes }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetCombosFiltroDespachoByIdsClientes_JSON", Parameters);
            return data;
        }

        public string GetLoadDetalleRequerimientoDespachoDDP_JSON(int idEstilo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "IdEstilo", Value = idEstilo.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetLoadDetalleRequerimientoDespachoDDP_JSON", Parameters);
            return data;
        }

        public int SaveDetalleRequerimientoDespacho_JSON(EstiloViewModels estilo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "EstiloJSON", Value = JsonConvert.SerializeObject(estilo) }
            };

            int rows = db.SaveRowsTransaction_Out("DesarrolloProducto.usp_SaveDetalleRequerimientoDespacho_JSON", Parameters);
            return rows;
        }

        public string GetListaDespachoDetalleByIdRequerimientoForSave_JSON(int IdRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "IdRequerimiento", Value = IdRequerimiento.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaDespachoDetalleByIdRequerimientoForSave_JSON", Parameters);
            return data;
        }

        public int SaveNewActividadxRequerimiento_JSON(RequerimientoxActividadViewModels requerimientoxActividad,
            RequerimientoMuestraViewModels requerimientoMuestra)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoxActividadJSON", Value = JsonConvert.SerializeObject(requerimientoxActividad) },
                new Parameter { Key = "RequerimientoAprobadoRechazadoJSON", Value = requerimientoMuestra != null ? JsonConvert.SerializeObject(requerimientoMuestra) : "" }
            };

            int IdActividadxRequerimiento = db.SaveRowsTransaction_Out("DesarrolloProducto.usp_SaveNewActividadxRequerimiento_JSON", Parameters);
            return IdActividadxRequerimiento;
        }

        public int SaveEditActividadxRequerimiento_JSON(RequerimientoxActividadViewModels requerimientoxActividad,
            RequerimientoMuestraViewModels requerimientoMuestra)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoxActividadJSON", Value = JsonConvert.SerializeObject(requerimientoxActividad) },
                new Parameter { Key = "RequerimientoAprobadoRechazadoJSON", Value = requerimientoMuestra != null ? JsonConvert.SerializeObject(requerimientoMuestra) : "" }
            };

            int IdActividadxRequerimiento = db.SaveRowsTransaction_Out("DesarrolloProducto.usp_SaveEditActividadxRequerimiento_JSON", Parameters);
            return IdActividadxRequerimiento;
        }

        public string GetRequerimientoActividadById_JSON(int idRequerimientoxActividad)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimientoxActividad", Value = idRequerimientoxActividad.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoActividadById_JSON", Parameters);
            return data;
        }

        public int DeleteRequerimientoxActividadById_JSON(RequerimientoxActividadViewModels requerimientoxactividad)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "requerimientoxActividadJSON", Value = JsonConvert.SerializeObject(requerimientoxactividad) }
            };

            int rows = db.SaveRow("DesarrolloProducto.usp_DeleteRequerimientoxActividadById_JSON", Parameters);
            return rows;
        }

        public int SaveDespachoDetalle_BotonActualizar_JSON(List<DespachoDetalleViewModels> lstDespachoDetalle)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() { 
                new Parameter { Key = "DespachoDetalleJSON", Value = JsonConvert.SerializeObject(lstDespachoDetalle) }
            };

            int rows = db.SaveRowsTransaction("DesarrolloProducto.usp_SaveDespachoDetalle_BotonActualizar_JSON", Parameters);
            return rows;
        }

        public int DeleteDespachoDetalleById_JSON(DespachoDetalleViewModels despachoDetalle, DespachoDetalleViewModels despachoDetalleCopiaUltima)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "DespachoDetalleJSON", Value = JsonConvert.SerializeObject(despachoDetalle) },
                new Parameter { Key = "DespachoDetalleUltimoJSON", Value = JsonConvert.SerializeObject(despachoDetalleCopiaUltima) }
            };

            int rows = db.SaveRowsTransaction("DesarrolloProducto.usp_DeleteDespachoDetalleById_JSON", Parameters);
            return rows;
        }

        public int SaveArchivoRequerimiento_JSON(RequerimientoArchivoViewModels requerimientoArchivo, int IdRequerimiento, int IdEstilo, string Usuario, string Ip, string HostName)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoArchivoJSON", Value = JsonConvert.SerializeObject(requerimientoArchivo) },
                new Parameter { Key = "IdRequerimiento", Value = IdRequerimiento.ToString() },
                new Parameter { Key = "IdEstilo", Value = IdEstilo.ToString() },
                new Parameter { Key = "Usuario", Value = Usuario },
                new Parameter { Key = "Ip", Value = Ip },
                new Parameter { Key = "HostName", Value = HostName }
            };

            int rows = db.SaveRowsTransaction_Out("DesarrolloProducto.usp_SaveArchivoRequerimiento_JSON", Parameters);
            return rows;
        }

        public string GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON(int idPersonal)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdPersonal", Value = idPersonal.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON", Parameters);
            return data;
        }

        public string GetListaResponsablesAnalistasDDP_JSON(int idPersonalJefaDDP_EquipoDDP, int idPersonal_Logged)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdPersonalJefaDDP_EquipoDDP", Value = idPersonalJefaDDP_EquipoDDP.ToString() },
                new Parameter { Key = "IdPersonal_Logged", Value = idPersonal_Logged.ToString() },
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaResponsablesAnalistasDDP_JSON", Parameters);
            return data;
        }

        //// PARA OSCAR DDP - COMENTARIOS
        public int SaveNewRequerimientoMuestraComentario_JSON(RequerimientoComentarioViewModels requerimientoComentario)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "RequerimientoComentarioJSON", Value = JsonConvert.SerializeObject(requerimientoComentario) }
            };

            int IdComentario = db.SaveRow_Out("DesarrolloProducto.usp_SaveNewRequerimientoMuestraComentario_JSON", Parameters);
            return IdComentario;
        }

        public string GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON(int IdRequerimiento)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdRequerimiento", Value = IdRequerimiento.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON", Parameters);
            return data;
        }

        public string GetRequerimientoMuestraWithActividadesByEstilo_JSON(int IdEstilo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "IdEstilo", Value = IdEstilo.ToString() }
            };

            string data = db.GetData("DesarrolloProducto.usp_GetRequerimientoMuestraWithActividadesByEstilo_JSON", Parameters);
            return data;
        }

        

        public int SaveSendEmail_DDP_Muestras(beCorreo correo)
        {
            DBHelper db = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "CorreoJSON", Value = JsonConvert.SerializeObject(correo) }
            };
            int data = db.SaveRowsTransaction_Out("Requerimiento.usp_SaveSendEmail_DDP_Muestras", Parameters);
            return data;
        }
    }
}