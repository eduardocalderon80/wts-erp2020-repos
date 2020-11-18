using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP
{
    public class FormatoMensajeWebSocket
    {
        public string plataforma { get; set; }
        public string tipomensaje { get; set; }
        public string usuario_destino { get; set; }
        public string mensaje_para_app { get; set; }
        public string usuario_origen { get; set; }
        public string titulo_mensaje { get; set; }

        public string mensaje_para_erp { get; set; }
        public string mensaje_todas_plataformas { get; set; }
    }
}