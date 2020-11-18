﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class RequerimientoComentario
    {
        public int IdComentario { get; set; }

        [Required]
        [Range(1, 1000000)]
        public int IdRequerimiento { get; set; }

        [Required]
        public string Comentario { get; set; }

        public string NombreArchivo { get; set; }

        public string NombreArchivoWeb { get; set; }

        public string UsuarioRegistro { get; set; }

        public string FechaRegistro { get; set; }

        public string FechaCreacion { get; set; }

        public string FechaActualizacion { get; set; }

        public string UsuarioCreacion { get; set; }

        public string UsuarioActualizacion { get; set; }

        public string Ip { get; set; }

        public string HostName { get; set; }

        public int Eliminado { get; set; }
    }
}