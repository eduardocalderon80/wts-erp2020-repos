using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoClienteEstiloDestino
    {
        public int IdPoClienteEstiloDestino { get; set; }
        public int IdPoClienteEstilo { get; set; }
        public int IdPoCliente { get; set; }
        public int IdPo { get; set; }
        public int IdClienteDireccion { get; set; }
        public decimal CantidadRequerida { get; set; }

        // CAMPOS ADICIONALES
        public int RegistroExistente { get; set; }
        public string DescripcionDireccion { get; set; }
        public string Linea1 { get; set; }
        public string Linea2 { get; set; }
        public string Linea3 { get; set; }

        public List<PoClienteEstiloDestinoTallaColor> ListaPoClienteEstiloDestinoTallaColor { get; set; }
    }
}
