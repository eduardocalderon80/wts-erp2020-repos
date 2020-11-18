using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.TecnologiaInformacion.HelpDesk
{
    public class Archivo
    {
        public int IdArchivo { get; set; }
        public int IdSolicitud { get; set; }
        public int IdTicket { get; set; }
        public int TipoArchivo { get; set; }
        public string NombreArchivoOriginal { get; set; }
        public string NombreArchivo { get; set; }
        public byte[] bytearchivo { get; set; }
        public int modificado { get; set; }
    }
}
