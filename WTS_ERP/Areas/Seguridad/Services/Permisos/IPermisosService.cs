using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Seguridad.Services
{
    public interface IPermisosService
    {
        string GetAll_Permisos(string parametro);
        string Get_Combos(string parametro);
        int Insert_Permisos(string parametro);
        int Delete_Permisos(string parametro);
        bool Validate_Permisos(string controller, string view, int idpersonal);
        bool Validate_Permisos_Client(string parametro);
        string GetUserPermissions(string parametro);
        string GetRowInfo(string parametro);
        string GetUserInfo(string parametro);
    }
}