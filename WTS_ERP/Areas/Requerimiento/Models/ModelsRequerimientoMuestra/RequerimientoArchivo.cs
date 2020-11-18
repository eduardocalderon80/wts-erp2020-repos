using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoArchivo
    {
        public int IdArchivo { get; set; }
        [Required]
        [Range(1, 1000000)]
        public int IdRequerimiento { get; set; }
        
        public string NombreArchivoOriginal { get; set; }

        public string NombreArchivo { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public int Eliminado { get; set; }
        [Required]
        [Range(1, 1000000)]
        public int IdTipoArchivo { get; set; }

        [Required]
        [Range(1, 1000000)]
        public int IdEstilo { get; set; }
    }
}