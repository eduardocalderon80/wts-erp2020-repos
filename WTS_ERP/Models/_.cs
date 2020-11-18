using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using BE_ERP;
using System.Web;

namespace WTS_ERP.Models
{
    public class _
    {
        public static string Post(string campo)
        {
            bool existeParametro = HttpContext.Current.Request.Form[campo] != null;
            string parametro = existeParametro ? HttpContext.Current.Request.Form[campo].ToString().Trim() : string.Empty;
            return parametro;
        }

        public static string Get(string campo)
        {
            bool existeParametro = HttpContext.Current.Request.QueryString[campo] != null;
            string parametro = existeParametro ? HttpContext.Current.Request.QueryString[campo].ToString().Trim() : string.Empty;
            return parametro;
        }


        public static string Get_Par(string ParametroBase, string NombreParametroABuscar)
        {
            ParametroBase = ParametroBase.Replace("\"", "").Replace("{", "").Replace("}", "").Trim();
            string[] apar = ParametroBase.Split(','); //ParametroBase.IndexOf(',') > 0 ? ParametroBase.Split(',') : null;
            if (apar != null)
            {
                string[] par = { };
                string valor = string.Empty;
                int contador = 0;
                foreach (string item in apar)
                {
                    par = item.IndexOf(":") > 0 ? apar[contador].Split(':') : null;
                    if (par != null && par[0].Trim() == NombreParametroABuscar)
                    {
                        valor = par[1].Trim();
                        break;
                    }
                    contador++;
                }
                return valor;
            }
            //else if (ParametroBase != string.Empty) {
            //    string[] par = { };
            //    string valor = string.Empty;
            //    int contador = 0;
            //    foreach (string item in apar)
            //    {
            //        par = item.IndexOf(":") > 0 ? apar[contador].Split(':') : null;
            //        if (par != null && par[0].Trim() == NombreParametroABuscar)
            //        {
            //            valor = par[1].Trim();
            //            break;
            //        }
            //        contador++;
            //    }
            //    return valor;
            //}
            return string.Empty;
        }

        // :edu 20171017 se agrego parametro id despues de grabar
        public static string Mensaje(string accion, bool exito, string data = null, int id = 0, bool idiomaspaniol = false)
        {
            JObject mensaje = new JObject();
            if (accion == "edit")
            {
                mensaje.Add("mensaje", (exito) ? (idiomaspaniol == false) ? "Updated Successfully" : "Actualizado con Éxito" : (idiomaspaniol == false) ? "Could not update" : "No se pudo Actualizar");
                mensaje.Add("estado", (exito) ? "success" : "Error");
                mensaje.Add("data", (exito && data != null) ? data : "");
            }
            else if (accion == "new")
            {
                mensaje.Add("mensaje", (exito) ? (idiomaspaniol == false) ? "Successfully inserted" : "Insertado con Éxito" : (idiomaspaniol == false) ? "Could not insert" : "No se pudo Insertar");
                mensaje.Add("estado", (exito) ? "success" : "error");
                mensaje.Add("data", (exito && data != null) ? data : "");
            }
            else if (accion == "remove")
            {
                mensaje.Add("mensaje", (exito) ? (idiomaspaniol == false) ? "Successfully deleted" : "Eliminado con Éxito" : (idiomaspaniol == false) ? "Could not delete" : "No se pudo Eliminar");
                mensaje.Add("estado", (exito) ? "success" : "error");
                mensaje.Add("data", (exito && data != null) ? data : "");
            }
            else if (accion == "add")
            {
                mensaje.Add("mensaje", (exito) ? (idiomaspaniol == false) ? "Added successfully" : "Agregado con Éxito" : (idiomaspaniol == false) ? "Could not be added" : "No se pudo Agregar");
                mensaje.Add("estado", (exito) ? "success" : "error");
                mensaje.Add("data", (exito && data != null) ? data : "");
            }
            else if (accion == "sendmail") {
                mensaje.Add("mensaje", (exito) ? (idiomaspaniol == false) ? "Sent" : "Enviado" : (idiomaspaniol == false) ? "it could not send" : "No se pudo Enviar");
                mensaje.Add("estado", (exito) ? "success" : "error");
                mensaje.Add("data", (exito && data != null) ? data : "");
            }

            mensaje.Add("id", id);
            return mensaje.ToString();
        }

        public static string MensajePersonalizado(bool exito, string mensaje, int id = 0, string data = null)
        {
            JObject jObject = new JObject();
            jObject.Add("success", exito);
            jObject.Add("status", (exito) ? "success" : "Error");
            jObject.Add("msg", mensaje);
            jObject.Add("data", data != null ? data : "");
            jObject.Add("id", id);
            return jObject.ToString();
        }

        public static beUser GetUsuario()
        {
            beUser oUser = new beUser();
            oUser = HttpContext.Current.Session["Usuario"] != null ? HttpContext.Current.Session["Usuario"] as beUser : null;
            return oUser;
        }

        public static string addParameter(string parametroPrincipal, string parNombre, string parValor, bool isJsonArray = false)
        {
            if (parametroPrincipal != null && parametroPrincipal.Length > 0)
            {
                if (parNombre != null && parValor != null)
                {
                    if (!isJsonArray)
                    {
                        string parCadena = parametroPrincipal.Substring(0, parametroPrincipal.Length - 1);
                        string parAdicional = ",\"" + parNombre + "\"";
                        parAdicional += ":\"" + parValor + "\"";
                        parAdicional += "}";
                        parametroPrincipal = parCadena + parAdicional;
                    }
                    else
                    {
                        string parCadena = parametroPrincipal.Substring(0, parametroPrincipal.Length - 2);
                        string parAdicional = ",\"" + parNombre + "\"";
                        parAdicional += ":\"" + parValor + "\"";
                        parAdicional += "}]";
                        parametroPrincipal = parCadena + parAdicional;
                    }
                }
            }
            return parametroPrincipal.Length > 0 ? parametroPrincipal : string.Empty;
        }

        public static string addParameterList(string parametroPrincipal, Dictionary<string, string> lista)
        {
            string parItems = string.Empty;
            if (parametroPrincipal != null && parametroPrincipal.Length > 0)
            {
                string parSubCadena = parametroPrincipal.Substring(0, parametroPrincipal.Length - 1);

                if (lista != null && lista.Count > 0)
                {
                    foreach (KeyValuePair<string, string> item in lista)
                    {
                        parItems += string.Format(",\"{1}\":\"{2}\"", item.Key, item.Value);
                    }

                    if (parItems.Length > 0)
                    {
                        parametroPrincipal = string.Format("{0}{1}}", parSubCadena, parItems);
                    }
                }
            }
            return parametroPrincipal.Length > 0 ? parametroPrincipal : string.Empty;
        }

    }
}