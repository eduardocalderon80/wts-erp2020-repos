using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class Base
    {
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }
        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }
        public string HostName { get; set; }
        public int Eliminado { get; set; }
        public int IdUsuario { get; set; }

        /* Luis */
        public string servidor { get; set; }
        public string dominio { get; set; }
    }
}
