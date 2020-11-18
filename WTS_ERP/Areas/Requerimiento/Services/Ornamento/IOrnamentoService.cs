using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IOrnamentoService
    {
        int DeleteArteById_JSON(OrnamentoViewModels parametro);
        string GetListRequerimientoByPrograma_JSON(string _idPrograma);

        string GetOrnamentoLoadNew_JSON(OrnamentoViewModels parametro);

        int EnviarConcesion_JSON(OrnamentoConcesion parametro);

        string GetOrnamentoConcessionLoadNew_JSON(OrnamentoViewModels parametro);

        int Save_JSON(OrnamentoViewModels parametro, string ParameterComboColor, List<OrnamentoTest> ParameterTest, string sParameterFileProp, List<OrnamentoTestReport> ParameterTestReport);
        
        int SaveFile_JSON(OrnamentoFile parametro);
       
        string GetListaFileRequerimiento_JSON(OrnamentoFile parametro);
       
        int DeleteFile_JSON(OrnamentoFile parametro);
        
        string GetBuscarTela_JSON(string Codigo);

        int DeleteReport_JSON(OrnamentoTestReport parametro);

        int DeleteTest_JSON(OrnamentoTest parametro);

        int DeleteComboColor_JSON(OrnamentoComboColor parametro);

        int DeleteComboColorDetalle_JSON(OrnamentoComboColor parametro);
        string GuardarRespuestaConcesion(OrnamentoConcesion parametro);

        string GetArteSearchAll_csv();
    }
}
