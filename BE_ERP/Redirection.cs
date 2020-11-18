using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class Redirection
    {
        public string Modulo { get; set; }
        public string Controlador { get; set; }
        public string Vista { get; set; }
        public string Accion { get; set; }
        public string Parametro { get; set; }
    }
}
