using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IFacturacionSampleInicial
    {
        string GetRequerimientoMuestraFacturacionInicial_JSON(int IdPrograma);
        int SaveUpdateRequerimientoMuestraFacturacionInicialJSON(List<RequerimientoMuestraViewModels> listaRequerimiento);
    }
}
