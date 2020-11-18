using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WTS_ERP.Areas.Facturacion.Models
{
   
    public class TesoreriaBol 
    {
        public int IdGrupoPersonal { get; set; }
        public string codCliente { get; set; }
        public string codEstado { get; set; }
        public string tipoFecha { get; set; }
        public string fechaIni { get; set; }
        public string fechaFin { get; set; }
        public string exportacionExcel { get; set; }
    }
}