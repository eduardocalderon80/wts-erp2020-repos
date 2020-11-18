using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class OrnamentoTest
    {
        public int IdTestDetalle { get; set; }

        public int IdTest { get; set; }

        public string ColorCode { get; set; }

        public string TestCodigo { get; set; }

        public string TestDescripcion { get; set; }

        public int IdTipoProveedor { get; set; }

        public int IdProveedor { get; set; }

        public decimal CostTestDetalle { get; set; }

        public string Estado { get; set; }

        public int Eliminado { get; set; }
    }
}