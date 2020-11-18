using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beCorreo
    {
        public beCorreo()
        {
            correoarchivo = new List<CorreoArchivo>();
        }

        public string correo_from { get; set; }
        public string correo_to { get; set; }
        public string correo_cc { get; set; }
        public string correo_bcc { get; set; }

        public string nombre_origen { get; set; }
        public string nombre_destino { get; set; }
        public int idservicio { get; set; }
        public string nombre_servicio { get; set; }
        public string correo { get; set; }

        public int idsolicitud { get; set; }
        public string asunto { get; set; }
        public string cuerpo { get; set; }
        public List<CorreoArchivo> correoarchivo { get; set; }
        public string cadena_lista_archivos_adjuntos { get; set; }

        // DATOS USADOS PARA SOLICTUD DE PARTIDA
        public string accion { get; set; }
        public string usuario { get; set; }
    }

    public class CorreoArchivo
    {
        public string nombrearchivo { get; set; }
        public string nombrearchivooriginal { get; set; }

        public byte[] archivo { get; set; }
    }
}
