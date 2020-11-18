using System;

namespace BE_ERP
{
  public  class beLog
    {
        public string LogArchivo { get; set; }
        public string LogUsuario { get; set; }
        public string LogAplicacion { get; set; }
        public string LogMensajeError { get; set; }
        public string LogDetalleError { get; set; }
        public System.DateTime LogFechaHora { get; set; }
    }
}
