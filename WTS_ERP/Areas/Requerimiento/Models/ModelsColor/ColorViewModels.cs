﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class ColorViewModels : Color
    {
        public int IdGrupoPersonal { get; set; }       
        public int ActualizarImagenEstilo { get; set; }
    }
}