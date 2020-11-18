using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class ComboColor
    {
     
        public int IdComboColorDetalle { get; set; }

        public int IdComboColor { get; set; }

        public int DescCombo { get; set; }

        [MaxLength(200)]
        public string Metodo { get; set; }

        [MaxLength(200)]
        public string WtsCode { get; set; }

        [MaxLength(200)]
        public string WtsDescripcion { get; set; }

        [MaxLength(200)]
        public string TipoTenido { get; set; }

        public string ColorCode { get; set; }
        
        [MaxLength(150)]
        public string ColorName { get; set; }

        public string Pantone { get; set; }

        [MaxLength(500)]
        public string Alternative { get; set; }

        [MaxLength(500)]
        public string ClienteSelection { get; set; }      

        public int IdEmpresa { get; set; }

        public int Eliminado { get; set; }

        public string UsuarioCreacion { get; set; }

        public string FechaCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }
    }
}