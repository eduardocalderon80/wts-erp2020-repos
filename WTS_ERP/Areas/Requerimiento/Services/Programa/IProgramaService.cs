using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IProgramaService
    {
        string GetListaPrograma_Index(ProgramaViewModels parametro);
        string GetProgramaNew_JSON(ProgramaViewModels parametro);
        string GetProgramaEditar_JSON(ProgramaViewModels parametro);
        string Save_New_Programa(Programa parametro);
        string Save_Edit_Programa(Programa parametro);

        string Validate_ProgramaPK(Programa parametro);
        string GetListaCombosRequerimiento_JSON(string _idCliente);
        string GetListaProgramaIndexFilter_JSON(ProgramaViewModels parametro);
        string GetValidarModificarPrograma_JSON(ProgramaViewModels parametro);
        int DeleteProgramaById_JSON(ProgramaViewModels parametro);
        string SaveEnlaceRequerimiento(string parametro);
        string DeleteEnlaceRequerimiento(string parametro);
        string GetAllReqsDetails(string parametro);
        string InsertSendEmail(string parametro);
        string GetCorreoReq(string parametro);
    }
}
