using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.CourierService
{
    public class Solicitud
    {
        public string idsolicitud { get; set; }
        public string usuario { get; set; }
        public string contacto { get; set; }
        public string destino { get; set; }
        public string fecha { get; set; }
    }
}
