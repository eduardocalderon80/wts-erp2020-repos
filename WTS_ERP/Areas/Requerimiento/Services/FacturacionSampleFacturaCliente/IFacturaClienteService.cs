using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IFacturaClienteService
    {
        string GetFacturaClienteLoadNew_JSON(string par);
        string GetRequerimientoMuestraDetalle_JSON(string listaRequerimientosSeleccionados);
        int SaveNewFacturaCliente_JSON(FacturaClienteViewModels parFacturaCliente,
            List<FacturaClienteDetalleViewModels> parFacturaClienteDetalle,
            List<FacturaClienteDetalleViewModels> parListaCadenaColoresModificados);

        int SaveEditFacturaCliente_JSON(FacturaClienteViewModels parFacturaCliente,
            List<FacturaClienteDetalleViewModels> parFacturaClienteDetalle,
            List<FacturaClienteDetalleViewModels> parListaCadenaColoresModificados, string sParListaOrdenPedidos);

        int SaveCancelarFacturaCliente_JSON(int idFacturaCliente, string usuario);
        string GetFacturaClienteLoadEdit_JSON(string sPar);
        string GetFacturaClienteForReporteByIdJSON(int IdFacturaCliente);
    }
}
