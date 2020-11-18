using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoClienteEstiloDestinoTallaColor
    {
        public int IdPoClienteEstiloDestinoTallaColor { get; set; }
        public int IdPoClienteEstiloDestino { get; set; }
        public int IdPoClienteEstilo { get; set; }
        public int IdPoCliente { get; set; }
        public int IdClienteDireccion { get; set; }
        public int IdPo { get; set; }
        public int IdTipoColor { get; set; }
        public int IdClienteColor { get; set; }
        public int IdClienteTalla { get; set; }
        public int Cantidad { get; set; }

        // CAMPOS ADICIONALES
        public int RegistroExistente { get; set; }

        public string NombreTipoColor { get; set; }
        public string NombreClienteColor { get; set; }
        public string NombreClienteTalla { get; set; }
        public string TipoColor { get; set; }
        public int Orden { get; set; }
        public string CodigoPoCliente { get; set; }
        public string CodigoEstilo { get; set; }
    }
}
