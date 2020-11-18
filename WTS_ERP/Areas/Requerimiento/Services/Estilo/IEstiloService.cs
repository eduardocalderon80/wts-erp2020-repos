using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IEstiloService
    {
        string GetListaEstiloByPrograma_JSON(string _idPrograma);
        string GetEstiloLoadEditar_JSON(EstiloViewModels parametro);
        int SaveNew_Estilo_JSON(EstiloViewModels parametro, List<RequerimientoMuestraViewModels> parRequerimiento);
        string GetEstiloLoadNew_JSON(EstiloViewModels parametro);
        int SaveEditar_Estilo_JSON(EstiloViewModels parametro, List<RequerimientoMuestraViewModels> parRequerimiento
            , List<RequerimientoArchivoViewModels> parLstRequerimientoArchivo, int parIdRequerimiento);
        int DeleteEstiloById_JSON(EstiloViewModels parametro);
        string UpdateEstadoEstilo(string parametro);
        string SendSamplesEstilo(string parametro);
        string GetBuscarTela_JSON(string parametro);
        string GetAllStylesCarryOverNew(string parametro);
        string GetStyleCarryOverNew(string parametro);
        int SaveStylesCarryOverNew(string parametro);
        int SaveMainFabric(string parametro);
    }
}
