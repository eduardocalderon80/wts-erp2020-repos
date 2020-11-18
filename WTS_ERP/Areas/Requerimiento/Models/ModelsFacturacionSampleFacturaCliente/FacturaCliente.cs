using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WTS_ERP.Areas.Requerimiento.Models
{
    public class FacturaCliente
    {
        public int IdFacturaCliente                          {get; set;}  
        public int IdPrograma                                {get; set;}
        public int IdProveedor                               {get; set;}
        public string BoardingDate                           {get; set;}
        public int IdCatalogo_Boarding                       {get; set;}
        public int IdCatalogo_FormaEnvio                     {get; set;}
        public int IdCatalogo_QuienAsumeFlete                {get; set;}
        public string NumeroGuia                             {get; set;}
        public string NombreArchivoPackingListOriginal       {get; set;}
        public string NombreArchivoPackingListGenerado       {get; set;}
        public string NombreArchivoDeclaracionJuradaOriginal {get; set;}
        public string NombreArchivoDeclaracionJuradaGenerado {get; set;}
        public string NombreArchivoGuiaAereaOriginal         {get; set;}
        public string NombreArchivoGuiaAereaGenerado         {get; set;}
        public string NombreArchivoCerfiticadoOrigenOriginal {get; set;}
        public string NombreArchivoCerfiticadoOrigenGenerado {get; set;}
        public string Comentario                             {get; set;}
        public string CabeceraFacturaClienteSeller           {get; set;}
        public string CabeceraFacturaClienteBank             {get; set;}
        public string CabeceraFacturaClienteTerms            {get; set;}
        public string CabeceraFacturaClienteOrigin           {get; set;}
        public string CabeceraFacturaClienteBillTo           {get; set;}
        public string CabeceraFacturaClienteConsignee        {get; set;}
        public string CabeceraFacturaClienteShipMode         {get; set;}
        public string CabeceraFacturaClienteOtherReference   {get; set;}
        public string Estado                                 {get; set;}
        public int Eliminado                                 {get; set;}
        public string UsuarioCreacion                        {get; set;}
        public string UsuarioActualizacion                   {get; set;}
        public string FechaCreacion                          {get; set;}
        public string FechaActualizacion { get; set; }
        public string Ip                                     { get; set; }
        public string HostName { get; set; }
        public int IdClienteDireccion_BillTo { get; set; }
        public int IdClienteDireccion_ShipTo { get; set; }
    }
}