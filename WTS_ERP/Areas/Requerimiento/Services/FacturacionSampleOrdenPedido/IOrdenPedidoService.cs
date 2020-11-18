using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IOrdenPedidoService
    {
        int SaveNewOrdenPedido_JSON(OrdenPedidoViewModels parOrdenPedido, List<OrdenPedidoDetalleViewModels> parOrdenPedidoDetalle,
            List<OrdenPedidoArchivoHojaDeCostosViewModels> parListaArchivos, List<OrdenPedidoDetalleViewModels> parListaCadenaColoresModificados);

        int SaveEditOrdenPedido_JSON(OrdenPedidoViewModels parOrdenPedido,
            List<OrdenPedidoDetalleViewModels> parOrdenPedidoDetalle,
            List<OrdenPedidoArchivoHojaDeCostosViewModels> parListaArchivos,
            List<OrdenPedidoDetalleViewModels> parListaCadenaColoresModificados);
        string GetOrdenPedidoLoadNew_JSON(string par);
        string GetRequerimientoMuestraDetalle_JSON(string listaRequerimientosSeleccionados);
        int SaveCancelarOrdenPedido_JSON(int idOrdenPedido, string usuario);
        string GetOrdenPedidoByIdForFacturaFabricaSave_CSV(int IdOrdenPedido);
        string GetOrdenPedidoLoadSeleccionarOP_JSON(int idPrograma, int idCliente, int idGrupoPersonal, int idProveedor);
        string GetOrdenPedidoForSeleccionarOP_FacturaClienteJSON(int idOrdenPedido);
        int SaveActualizarOrdenPedidoFromBuscarOrdenPeidoJSON(OrdenPedidoViewModels ordenPedido);
        string GetOrdenPedidoLoadEdit_JSON(string par);

        string test_ordenpedido(int idOrdenPedido);
    }
}
