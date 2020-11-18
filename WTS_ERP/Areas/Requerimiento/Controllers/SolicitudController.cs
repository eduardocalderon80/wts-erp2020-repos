using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Requerimiento.Models;
using WTS_ERP.Areas.Requerimiento.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Requerimiento.Controllers
{
    public class SolicitudController : Controller
    {
        private readonly ISolicitudService _solicitudService;

        public SolicitudController(ISolicitudService solicitudService)
        {
            _solicitudService = solicitudService;
        }

        // GET: Requerimiento/Solicitud
        public ActionResult Index()
        {
            return View();
        }

        [AccessSecurity]
        [HttpPost]
        public string Save_ATX()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "usuariocreacion", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "IdUsuario", _.GetUsuario().IdUsuario.ToString());
            sParModel = _.addParameter(sParModel, "IdPersonal", _.GetUsuario().IdPersonal.ToString());

            string sParModelDetalle = _.Post("parDetalle");
            SolicitudATX solicitudATX = JsonConvert.DeserializeObject<SolicitudATX>(sParModel);
            List<SolicitudATXDetalle> solicitudATXDetalles = JsonConvert.DeserializeObject<List<SolicitudATXDetalle>>(sParModelDetalle);

            int IdAnalisisTextil = _solicitudService.Save_ATX(solicitudATX, solicitudATXDetalles);
            string IdRequerimientoSolicitud = "";

            if (IdAnalisisTextil > 0)
            {
                sParModel = _.addParameter(sParModel, "IdSolicitud", IdAnalisisTextil.ToString());
                sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
                IdRequerimientoSolicitud = _solicitudService.Save_Solicitud(sParModel);
            }

            // ENVIAR LA SOLICITUD EN DESARROLLO TEXTIL
            string sParEnviarModel = _.Post("parEnviar");
            sParEnviarModel = _.addParameter(sParEnviarModel, "usuario", _.GetUsuario().Usuario);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idusuario", _.GetUsuario().IdUsuario.ToString());
            sParEnviarModel = _.addParameter(sParEnviarModel, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idsolicitud", IdAnalisisTextil.ToString());
            SolicitudEnviar solicitudEnviar = JsonConvert.DeserializeObject<SolicitudEnviar>(sParEnviarModel);
            int rows = _solicitudService.Enviar_Solicitud(solicitudEnviar);

            string mensaje = _.Mensaje("new", IdRequerimientoSolicitud != "", IdRequerimientoSolicitud, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string Save_Colgadores()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "usuario", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "idusuario", _.GetUsuario().IdUsuario.ToString());

            string sParModelDetalle = _.Post("parDetalle");
            string sParModelSubDetalle = _.Post("parSubDetalleJSON");
            SolicitudColgador solicitudColgador = JsonConvert.DeserializeObject<SolicitudColgador>(sParModel);

            int IdSolicitud = _solicitudService.Save_Colgadores(solicitudColgador, sParModelDetalle, sParModelSubDetalle);
            string IdRequerimientoSolicitud = "";

            if (IdSolicitud > 0)
            {
                sParModel = _.addParameter(sParModel, "IdSolicitud", IdSolicitud.ToString());
                sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
                IdRequerimientoSolicitud = _solicitudService.Save_Solicitud(sParModel);
            }

            // ENVIAR LA SOLICITUD EN DESARROLLO TEXTIL
            string sParEnviarModel = _.Post("parEnviar");
            sParEnviarModel = _.addParameter(sParEnviarModel, "usuario", _.GetUsuario().Usuario);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idusuario", _.GetUsuario().IdUsuario.ToString());
            sParEnviarModel = _.addParameter(sParEnviarModel, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idsolicitud", IdSolicitud.ToString());
            SolicitudEnviar solicitudEnviar = JsonConvert.DeserializeObject<SolicitudEnviar>(sParEnviarModel);
            int rows = _solicitudService.Enviar_Solicitud(solicitudEnviar);

            string mensaje = _.Mensaje("new", IdRequerimientoSolicitud != "", IdRequerimientoSolicitud, 0);
            return mensaje;
        }

        [AccessSecurity]
        [HttpPost]
        public string Save_Cotizacion()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "usuario", _.GetUsuario().Usuario);
            sParModel = _.addParameter(sParModel, "idusuario", _.GetUsuario().IdUsuario.ToString());

            string IdSolicitud = _solicitudService.Save_Cotizacion(sParModel);
            string IdRequerimientoSolicitud = "";

            if (int.Parse(IdSolicitud) > 0)
            {
                sParModel = _.addParameter(sParModel, "IdSolicitud", IdSolicitud);
                sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
                IdRequerimientoSolicitud = _solicitudService.Save_Solicitud(sParModel);
            }

            // ENVIAR LA SOLICITUD EN DESARROLLO TEXTIL
            string sParEnviarModel = _.Post("parEnviar");
            sParEnviarModel = _.addParameter(sParEnviarModel, "usuario", _.GetUsuario().Usuario);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idusuario", _.GetUsuario().IdUsuario.ToString());
            sParEnviarModel = _.addParameter(sParEnviarModel, "idgrupopersonal", _.GetUsuario().IdGrupoComercial);
            sParEnviarModel = _.addParameter(sParEnviarModel, "idsolicitud", IdSolicitud);
            SolicitudEnviar solicitudEnviar = JsonConvert.DeserializeObject<SolicitudEnviar>(sParEnviarModel);
            int rows = _solicitudService.Enviar_Solicitud(solicitudEnviar);

            string mensaje = _.Mensaje("new", IdRequerimientoSolicitud != "", IdRequerimientoSolicitud, 0);
            return mensaje;
        }
    }
}