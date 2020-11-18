using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class SolicitudEnviar
    {
        public int idsolicitud { get; set; }
        public string estadonuevo { get; set; }
        public string estadoactual { get; set; }
        public int idgrupopersonal { get; set; }
        public int idservicio { get; set; }
        public string usuario { get; set; }
        public int idusuario { get; set; }
    }
}