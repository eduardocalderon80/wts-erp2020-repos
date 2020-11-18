using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface ITelaService
    {       
        string GetTelaLoadNew_JSON(TelaViewModels parametro);
        int Save_JSON(TelaViewModels parametro, string sParameterFileProp);
        int SaveFileTela_JSON(TelaFile parametro);
        string GetListaFileRequerimiento_JSON(TelaFile parametro);
        int DeleteFileTela_JSON(TelaFile parametro);
        string GetListRequerimientoByPrograma_JSON(string _idPrograma);
        string UpdateEstadoTela(string parametro);
        string GetEnlacesTela(string parametro);
        string SaveEnlacesCombinaciones(string parametro);
        string DeleteEnlacesCombinaciones(string parametro);
        string DeleteTela(string parametro);
        string GetAllTelasCarryOverNew(string parametro);
        string GetTelaCarryOverNew(string parametro);
        string SaveTelasCarryOverNew(string parametro);
    }
}
