using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class Ornamento
    {
        [Required]
        public int IdRequerimientoDetalle { get; set; }

        [Required]
        public int IdRequerimiento { get; set; }

        public int IdPrograma { get; set; }

        public int IdCliente { get; set; }

        [MaxLength(254)]
        public string ImagenOriginal { get; set; }

        [MaxLength(254)]
        public string ImagenNombre { get; set; }
                
        [MaxLength(254)]
        public string ImagenWebNombre { get; set; }

        public string Estado { get; set; }

        [MaxLength(50)]
        public string TipoSolicitud { get; set; }

        public int IdRequerimientoPadre { get; set; }
        public string FechaRequerimientoCliente { get; set; }

        [MaxLength(50)]
        public string TipoTela { get; set; }

        [Required]
        [MaxLength(10)]
        public string CodigoTelaWTS { get; set; }


        [MaxLength(500)]
        public string DescripcionTela { get; set; }


        [MaxLength(50)]
        public string IdTipoProveedor { get; set; }


        [MaxLength(50)]
        public string IdProveedor { get; set; }


        [MaxLength(1000)]
        public string Notes { get; set; }

        [MaxLength(50)]
        public string ArteCodigoWts { get; set; }


        [MaxLength(50)]
        public string ArteTipoWts { get; set; }


        [MaxLength(50)]
        public string ArteTecnica { get; set; }

        [Required]
        [MaxLength(3000)]
        public string ArteDescripcion { get; set; }

        public int flgCambioImagen { get; set; }
        public int flgEnvioTest { get; set; }
        public string IdProveedorTest { get; set; }

        public int Eliminado { get; set; }

        public string UsuarioCreacion { get; set; }

        public string FechaCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public string CodFase { get; set; }
    }
}