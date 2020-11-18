using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.PortalFactory
{
    public class beCliente
    {
        public string codigo { get; set; }
        public string abreviatura { get; set; }
        public int TerminoPago { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public string direccion { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string telefono2 { get; set; }
        public string ruc { get; set; }
        public int tipo { get; set; }
        public int grupo { get; set; }
        public string nombregrupo { get; set; }
        public string cod_empresa { get; set; }
        public int IdPerfil { get; set; }
        public string TipoSeguro { get; set; }
        public decimal MontoSeguro { get; set; }
        public string Referencias { get; set; }


        public beCliente()
        { }

        public beCliente(int _idGrupo, string _nomGrupo)
        {
            grupo = _idGrupo;
            nombregrupo = _nomGrupo;
        }
    }
}
