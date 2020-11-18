using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IFacturaFabricaService
    {
        string GetFacturaFabricaLoadNew_JSON(int idPrograma, int idCliente, int idGrupoPersonal);
        int SaveNewFacturaFabrica_JSON(FacturaFabricaViewModels facturaFabricaJSON
            , List<FacturaFabricaDetalleViewModels> facturaFabricaDetalleJSON);
        int SaveEditFacturaFabrica_JSON(FacturaFabricaViewModels facturaFabricaJSON
            , List<FacturaFabricaDetalleViewModels> facturaFabricaDetalleJSON);
        int SaveCancelarFacturaFabrica_JSON(int idFacturaFabrica, string usuario);
        string GetFacturaFabricaLoadEdit_JSON(string sPar);
    }
}
