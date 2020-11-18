using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Requerimiento.Services
{
    public interface ISolicitudService
    {
        int Save_ATX(SolicitudATX parametro, List<SolicitudATXDetalle> parDetalle);
        int Save_Colgadores(SolicitudColgador parametro, string parDetalle, string parSubDetalleJSON);
        string Save_Cotizacion(string parametro);
        string Save_Solicitud(string parametro);
        int Enviar_Solicitud(SolicitudEnviar parametro);
    }
}
