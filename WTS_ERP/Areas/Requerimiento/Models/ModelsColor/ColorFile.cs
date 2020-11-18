using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class ColorFile
    {
        public int IdRequerimiento { get; set; }
        public int IdRequerimientoDetalle { get; set; }

        public string IdFile { get; set; }

        public string IdFileTipo { get; set; }

        public string NombreArchivoOriginal { get; set; }
     
        public string NombreArchivo { get; set; }

        public string FechaCreacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Eliminado { get; set; }

        public int IdCliente { get; set; }

        public string IdRol { get; set; }

        public string IdPerfil { get; set; }

        public string IdPersonal { get; set; }

        public string IdUsuario { get; set; }


    }
}