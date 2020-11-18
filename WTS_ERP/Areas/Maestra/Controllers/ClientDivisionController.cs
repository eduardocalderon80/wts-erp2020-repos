using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using WTS_ERP.Models;
using BL_ERP;

namespace WTS_ERP.Areas.Maestra.Controllers
{
    public class ClientDivisionController : Controller
    {
        // GET: Maestra/ClientDivision
        public ActionResult Index()
        {
            return View();
        }

        public string ClientDivision_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            int id = -1;
            string par = "{\"idgrupocomercial\":\"" + _.Get("idgrupocomercial") + "\"}";
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_ClienteDivision_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string DivisionClient_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_DivisionCliente_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string Division_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_Division_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string DivisionClientMarca_List()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();

            int id = -1;
            string par = _.Get("par");
            string dataResult = id < 0 ? oMantenimiento.get_Data("usp_DivisionClienteMarca_List", par, false, Util.ERP) : string.Empty;

            return dataResult;
        }

        public string ClientDivision_Insert()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string parhead = _.Post("par_CliDiv");
            string pardetail = _.Post("par_CliDivision");

            parhead = _.addParameter(parhead, "UsuarioCreacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_ClienteDivision_Insert", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_ClienteDivision_List", par, false, Util.ERP) : string.Empty;
            return dataResult;
        }

        public string ClientDivision_Update()
        {
            blMantenimiento oMantenimiento = new blMantenimiento();
            string par = _.Post("par");
            string parhead = _.Post("par_CliDiv");
            string pardetail = _.Post("par_CliDivision");

            parhead = _.addParameter(parhead, "UsuarioActualizacion", _.GetUsuario().Usuario.ToString());
            parhead = _.addParameter(parhead, "Ip", "");
            parhead = _.addParameter(parhead, "Hostname", "");

            int id = oMantenimiento.save_Rows_Out("usp_ClienteDivision_Update", parhead, Util.ERP, pardetail);
            string dataResult = id > 0 ? oMantenimiento.get_Data("usp_ClienteDivision_List", par, false, Util.ERP) : string.Empty;
            return dataResult;

        }

        public string GetListaCliente_DivisionCompartida_JSON()
        {
            blMantenimiento bl = new blMantenimiento();

            string par = _.Get("par");
            string data = bl.get_Data("usp_GetListaCliente_DivisionCompartida_JSON", par, true, Util.ERP);
            return data;
        }

        public string ActualizarCliente_Division_Compartido_JSON()
        {
            blMantenimiento bl = new blMantenimiento();
            string parhead = _.Post("parHead");
            parhead = _.addParameter(parhead, "Usuario", _.GetUsuario().Usuario);
            parhead = _.addParameter(parhead, "idgrupocomercial", _.GetUsuario().IdGrupoComercial.ToString());

            int rows = bl.save_Rows_Out("usp_Guardar_ClienteDivisionMarcaGrupo_JSON", parhead, Util.ERP);
            string dataResult = rows > 0 ? bl.get_Data("usp_ClienteDivision_List", parhead, false, Util.ERP) : string.Empty;
            string mensaje = _.Mensaje("edit", rows > 0, dataResult, rows);
            return mensaje;
        }
    }
}