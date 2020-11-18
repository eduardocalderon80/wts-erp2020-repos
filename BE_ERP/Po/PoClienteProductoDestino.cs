// :edu 20171017
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class PoClienteProductoDestino
    {
        public int IdPoClienteProductoDestino { get; set; }

        public int IdPoClienteProducto { get; set; }

        public int IdPoCliente { get; set; }

        public int IdClienteDireccion { get; set; }

        public decimal CantidadRequerida { get; set; }

        public int IdPo { get; set; }

        // CAMPOS ADICIONALES
        public int RegistroExistente { get; set; }
        public string DescripcionDireccion { get; set; }
        public string NombreProducto { get; set; }
        public string DescripcionProducto { get; set; }
        public int IdProducto { get; set; }
    }
}
