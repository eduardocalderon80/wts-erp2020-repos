using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Avio
    {
        [Required]
        public int IdAvios { get; set; }

        [Required]
        public int IdRequerimiento { get; set; }
        [Required]
        public int IdRequerimientoAvio { get; set; }
        public int IdCliente { get; set; }
        public int IdPrograma { get; set; }
        [Required]
        public int DetailTrim { get; set; }
        //[Required]
        //public int IdRequerimiento { get; set; }

        [MaxLength(254)]
        public string ImagenOriginal { get; set; }


        [MaxLength(254)]
        public string ImagenNombre { get; set; }


        [MaxLength(254)]
        public string ImagenWebNombre { get; set; }

        public string TipoSolicitud { get; set; }

        public int IdRequerimientoPadre { get; set; }

        [MaxLength(50)]
        public string TipoAvio { get; set; }

        [Required]
        [MaxLength(10)]
        public string AvioCodigoWTS { get; set; }


        [MaxLength(500)]
        public string DescripcionName { get; set; }

        [MaxLength(500)]
        public string DescripcionModel { get; set; }
        [MaxLength(500)]
        public string DescripcionSize { get; set; }
        [MaxLength(500)]
        public string DescripcionColor { get; set; }

        [MaxLength(50)]
        public string IdTipoProveedor { get; set; }


        [MaxLength(50)]
        public string IdProveedor { get; set; }

        [MaxLength(50)]
        public string Contacto { get; set; }

        [MaxLength(1000)]
        public string Notes { get; set; }

        [MaxLength(50)]
        public string TiempoEspera { get; set; }


        [MaxLength(10)]
        public string Minima { get; set; }


        [MaxLength(50)]
        public string Comentario { get; set; }

        [Required]
        [MaxLength(3000)]
        public string IdEstado { get; set; }

        public int Eliminado { get; set; }

        public string UsuarioCreacion { get; set; }

        public string FechaCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public string StyleCode { get; set; }
        public int ChkStyleCode { get; set; }
        public string ListaStyleCode { get; set; }
        public int IdAvioStyleCode { get; set; }
        public string CodFase { get; set; }
    }
}