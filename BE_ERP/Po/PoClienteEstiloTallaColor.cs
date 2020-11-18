using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoClienteEstiloTallaColor
    {
        public int IdPoClienteEstiloTallaColor { get; set; }
        public int IdPoClienteEstilo { get; set; }
        public int IdPoCliente { get; set; }
        public int IdPo { get; set; }
        public int IdClienteColor { get; set; }
        public int IdClienteTalla { get; set; }
        public int Cantidad { get; set; }
        public int IdTipoColor { get; set; }

        // CAMPOS ADICIONALES
        public string NombreTipoColor { get; set; }
        public string NombreClienteColor { get; set; }
        public int RegistroExistente { get; set; }
        public string NombreClienteTalla { get; set; }
        public string TipoColor { get; set; }
    }
}
