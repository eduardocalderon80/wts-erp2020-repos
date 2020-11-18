using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class AvioViewModels: Avio
    {
        public int IdGrupoPersonal { get; set; }       
        public int ActualizarImagen { get; set; }
        public string Accion { get; set; }
		public int IdRequerimientoCopia { get; set; }
    }
}