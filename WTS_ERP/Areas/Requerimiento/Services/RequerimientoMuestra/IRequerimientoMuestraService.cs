using BE_ERP;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IRequerimientoMuestraService
    {
        int SaveNew_RequerimientoWithDetalle_JSON(RequerimientoMuestraViewModels requerimientoMuestra, List<RequerimientoMuestraDetalle> lstRequerimientoMuestraDetalle
            , List<RequerimientoArchivoViewModels> lstRequerimientoArchivo, string usuario, string ip, string hostName);
        string GetRequerimientoDetalleLoadNew_JSON(RequerimientoMuestra requerimientoMuestra);
        string GetRequerimientoDetalleLoadEdit_JSON(RequerimientoMuestra requerimientoMuestra);
        string GetRequerimientoWithDetalleById_JSON(int idRequerimiento);
        int DeleteRequerimientoMuetraById_JSON(RequerimientoMuestraViewModels requerimientoMuestra);
        string GetRequerimientoByIdEstilo_JSON(int idEstilo);
        int DeleteRequerimientoMuestraDetalleById_JSON(RequerimientoMuestraDetalle requerimientoMuestraDetalle);
        string GetRequerimientoDetalleByIdRequerimiento_JSON(int idRequerimientoMuestraDetalle);
        int DeleteArchivoRequerimientoById_JSON(RequerimientoArchivoViewModels requerimientoArchivo);
        string GetArchivoRequerimientoByIdRequerimiento_or_IdEstilo_JSON(int idRequerimiento, int idEstilo = 0);
        //// PARA OSCAR - DESPACHOS
        string GetLoadIndexRequerimientoDespachoDDP_JSON(int IdPersonal);
        string GetListaFiltroRequerimientoDespachoDDP_JSON(RequerimientoMuestraFiltroDDPViewModels filtro);
        string GetListaFiltroRequerimientoDespachoDDPExportar_JSON(RequerimientoMuestraFiltroDDPViewModels filtro);
        string GetCombosFiltroDespachoByIdsClientes_JSON(string idsClientes);
        string GetLoadDetalleRequerimientoDespachoDDP_JSON(int idEstilo);
        int SaveDetalleRequerimientoDespacho_JSON(EstiloViewModels estilo);
        string GetListaDespachoDetalleByIdRequerimientoForSave_JSON(int IdRequerimiento);
        int SaveNewActividadxRequerimiento_JSON(RequerimientoxActividadViewModels requerimientoxActividad,
            RequerimientoMuestraViewModels requerimientoMuestra);
        int SaveEditActividadxRequerimiento_JSON(RequerimientoxActividadViewModels requerimientoxActividad, RequerimientoMuestraViewModels requerimientoMuestra);
        string GetRequerimientoActividadById_JSON(int idRequerimientoxActividad);
        int DeleteRequerimientoxActividadById_JSON(RequerimientoxActividadViewModels requerimientoxactividad);
        int SaveDespachoDetalle_BotonActualizar_JSON(List<DespachoDetalleViewModels> lstDespachoDetalle);
        int DeleteDespachoDetalleById_JSON(DespachoDetalleViewModels despachoDetalle, DespachoDetalleViewModels despachoDetalleCopiaUltima);
        int SaveArchivoRequerimiento_JSON(RequerimientoArchivoViewModels requerimientoArchivo, int IdRequerimiento, int IdEstilo, string Usuario, string Ip, string HostName);
        string GetListaClientesDDPByIdPersonal_ByReglaCliente_JSON(int idPersonal);
        string GetListaResponsablesAnalistasDDP_JSON(int idPersonalJefaDDP_EquipoDDP, int idPersonal_Logged);
        //// PARA OSCAR - DESPACHOS - COMENTARIOS
        int SaveNewRequerimientoMuestraComentario_JSON(RequerimientoComentarioViewModels requerimientoComentario);
        string GetListaRequerimientoMuestraComentarioByIdRequerimiento_JSON(int IdRequerimiento);
        string GetRequerimientoMuestraWithActividadesByEstilo_JSON(int IdEstilo);
        int SaveSendEmail_DDP_Muestras(beCorreo correo);
    }
}
