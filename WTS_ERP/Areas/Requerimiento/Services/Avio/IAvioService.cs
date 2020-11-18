using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IAvioService
    {
        string GetListRequeriminetoByPrograma_JSON(string _idPrograma);
        string GetAvioLoadNew_JSON(AvioViewModels parametro);
        string GetAvioLoadEditar_JSON(AvioViewModels parametro);
        string GetStyleCode_JSON(AvioViewModels parametro);
        int Save_JSON(AvioViewModels parametro);
        int SaveFileAvio_JSON(AvioFile parametro);
        int UpdateFileAvio_JSON(AvioFile[] parametro);
        string GetListaFileRequerimiento_JSON(AvioFile parametro);
        int DeleteFileAvio_JSON(AvioFile parametro);

        int SaveFileAvioSummary_JSON(AvioFile parametro);
        string GetListaFileRequerimientoAvioSummary_JSON(AvioFile parametro);
        int DeleteFileAvioSummary_JSON(AvioFile parametro);

        int DeleteStyleCodeAvio_JSON(AvioViewModels parametro);
        string DeleteAvio(string parametro);
        string GetListaStyleCodeAvio_JSON(AvioViewModels parametro);
        string GetAvioSearchAll_csv(string parametro);
        int SaveLinkAvioEstilo(string parametro);
        string DeleteLinkAvioEstilo(string parametro);
    }
}
