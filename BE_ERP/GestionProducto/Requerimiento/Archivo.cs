using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto.Requerimiento
{
    public class Archivo
    {
        public int idarchivo { get; set; }
        public int idrequerimiento { get; set; }
        public string nombrearchivooriginal { get; set; }
        public string nombrearchivo { get; set; }
        public byte[] bytearchivo { get; set; }
        public int modificado { get; set; }
        public long size { get; set; }
    }
}
