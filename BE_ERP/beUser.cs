using System;

namespace BE_ERP
{
   public class beUser
    {
        public int IdUsuario { get; set; }
        public string CodUsuario { get; set; }
        //public string nomUsuario { get; set; }

        ////
        public int IdUsuarioBD { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        //public string UsuarioBD { get; set; }

        public string Usuario { get; set; }

        public string Contrasena { get; set; }
        public string Correo { get; set; }
        public bool Habilitado { get; set; }
        public bool HabilitadoSTR { get; set; }
        public int IdEmpresa { get; set; }
        //public List<PerfilPorUsuario> PerfilPorUsuario { get; set; }
        //public List<RolPorUsuario> RolPorUsuario { get; set; }
        public string PerfilPorUsuarioSTR { get; set; }
        public string RolPorUsuarioSTR { get; set; }
        public string EmpresaPorUsuarioSTR { get; set; }
        //public List<RolPorPerfil> RolPorPerfil { get; set; }
        //public List<EmpresaPorUsuario> EmpresaPorUsuario { get; set; }
        public bool RegistrarPersonal { get; set; }
        public int IdArea { get; set; }
        public int IdCargo { get; set; }
        public int IdPersonal { get; set; }
        public string NombreCompleto { get { return Nombre + " " + Apellido; } }
        //public List<Empresa> Empresa { get; set; }
        //public List<Modulo> Modulo { get; set; }
        //public List<Ventana> Ventana { get; set; }
        //public List<Funcion> Funcion { get; set; }
        public string Mensaje { get; set; }
        public string Area { get; set; }
        public string Cargo { get; set; }
        public string ModuloSeleccionado { get; set; }
        public string VentanaSeleccionada { get; set; }
        public int CantidadEmpresas { get; set; }
        public string PERFILUSUARIO { get; set; }
        public string Roles { get; set; }
        public string Perfiles { get; set; }
        public string PerfilesNombres { get; set; }
        public int IdProveedor { get; set; }
        public string IdGrupoComercial { get; set; }
        
        /// CAMPOS ADICIONALES PARA ENVIAR CORREO DE SOLICITUD DE CODIGO TELA PO; DESDE LABORATORIO
        public string NombrePersonal { get; set; }
        
        /* Luis */
        public string UsuarioAD { get; set; }
        public string tipoaccesousuario { get; set; }

        public string ContextId_WebSocket { get; set; }
    }
}
