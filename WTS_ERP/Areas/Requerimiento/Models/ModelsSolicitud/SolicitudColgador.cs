using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class SolicitudColgador
    {
        public int idusuario { get; set; }
        public int idcliente { get; set; }
        public string comentario { get; set; }
        public string usuario { get; set; }
        public string descripciontela { get; set; }
    }
}