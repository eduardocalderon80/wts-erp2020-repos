using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IColorService
    {
        int DeleteColorById_JSON(ColorViewModels parametro);
        int Save_JSON(ColorViewModels parametro, string ParameterComboColor, List<ColorTest> ParameterTest, string sParameterFileProp, List<ColorTestReport> ParameterTestReport);
        
        string GetColorConcessionLoadNew_JSON(ColorViewModels parametro);
        
        string GetColorLoadNew_JSON(ColorViewModels parametro);
        
        int EnviarConcesion_JSON(ColorConcesion parametro);
        
        string GetListRequerimientoByPrograma_JSON(string _idPrograma);
       
        int SaveFile_JSON(ColorFile parametro);
       
        string GetListaFileRequerimiento_JSON(ColorFile parametro);
       
        int DeleteFile_JSON(ColorFile parametro);
        
        string GetBuscarTela_JSON(string Codigo);
        
        int DeleteReport_JSON(ColorTestReport parametro);

        int DeleteTest_JSON(ColorTest parametro);
       
        int DeleteComboColor_JSON(ComboColor parametro);
        
        int DeleteComboColorDetalle_JSON(ComboColor parametro);

        string GuardarRespuestaConcesion(ColorConcesion parametro);

        string GetColorSearchAll_csv();
    }
}
