using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.GestionProducto.Requerimiento
{
    public class requerimiento
    {
        public int idrequerimiento { get; set; }
        public string codigo { get; set; }
        public string codigoestilo { get; set; }
        public int version { get; set; }
        public string descripcion_estilo { get; set; }
        public string nombrecliente { get; set; }
        public string nombreproveedor { get; set; }
        public string temporada { get; set; }
        public string nombreestado { get; set; }
        public string nombretipomuestra { get; set; }
        public string nombretela { get; set; }
        public DateTime fechaactualizacion { get; set; }
        public string comentario_additionalinstruction { get; set; }
        public string imagenweb_estilo { get; set; }
        public string guid_img { get; set; }
        public string base64imagenestilo { get; set; }
        public string nombretemporada { get; set; }
        public string nombredivision { get; set; }
    }
}
