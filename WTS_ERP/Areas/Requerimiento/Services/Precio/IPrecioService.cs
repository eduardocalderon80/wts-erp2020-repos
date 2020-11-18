using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface IPrecioService
    {
        string GetFlashCost(string parametro);
        string GetAllFlashCost(string parametro);
        string GetAllFlashCost_New(string parametro);
        string GetPrecioAvios(string parametro);
        string GetPrecioEstilo(string parametro);
        string GetPrecioArte(string parametro);
        string GetPrecioTela(string parametro);
        string GetAllPrecioTela(string parametro);
        string InsertPrecioAvio(string parametro);
        string InsertPrecioArte(string parametro);
        string InsertPrecioEstilo(string parametro);
        string InsertPrecioTela(string parametro);
        string DeletePrecioTela(string parametro);
        string InsertRequerimientoFlashCost(string parametro);
        string GetFlashCostByProgram(string parametro);
        string DeletePrice(string parametro);
    }
}
