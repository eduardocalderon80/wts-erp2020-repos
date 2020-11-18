using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using BE_ERP;
using System.Threading.Tasks;
using Newtonsoft.Json;
using WTS_ERP;
using Newtonsoft.Json.Linq;

namespace WTS_ERP
{
    public class Erpwtshub : Hub
    {
        //public void Hello()
        //{
        //    Clients.All.hello();
        //}

        //public static ConcurrentDictionary<string, string> Usernames = new ConcurrentDictionary<string, string>();
        //public static ConcurrentDictionary<string, string> UserList = new ConcurrentDictionary<string, string>();
        public static List<beUser> usuariosConectados { get; set; } = new List<beUser>();
        public static List<beUser> listagruposcomerciales { get; set; } = new List<beUser>();

        public void Connect(string username, string idgrupocomercial)
        {
            var lstusuario_filter = usuariosConectados.Where(x => x.Usuario.Trim() == username.Trim() && x.ContextId_WebSocket == Context.ConnectionId).ToList();
            var lstgrupo_filter = listagruposcomerciales.Where(x => idgrupocomercial.Trim() == idgrupocomercial.Trim()).ToList();

            if (lstusuario_filter.Count <= 0)
            {
                beUser usuario = new beUser
                {
                    Usuario = username,
                    ContextId_WebSocket = Context.ConnectionId,
                    IdGrupoComercial = idgrupocomercial
                };
                usuariosConectados.Add(usuario);
                if (idgrupocomercial != "" && idgrupocomercial != "0") {
                    Groups.Add(Context.ConnectionId, idgrupocomercial);
                }
            }

            if (lstgrupo_filter.Count <= 0)
            {
                beUser grupo = new beUser
                {
                    IdGrupoComercial = idgrupocomercial
                };
                
                listagruposcomerciales.Add(grupo);
            }
        }

        public bool SendMessageAll(string usuario, string mensaje)
        {
            Clients.All.mostrarMensajeToCliente(usuario, mensaje);
            return true;
        }

        public bool SendMessagePorGrupo(string usuario_origen, string pstring_obj)
        {
            var jo = JObject.Parse(pstring_obj);
            JArray ja_data = JArray.Parse(jo.GetValue("arr_obj").ToString()) as JArray;
            var ja_con_grupocomercial = new JArray();
            var ja_sin_grupocomercial = new JArray();
            foreach (JObject item in ja_data)
            {
                ja_con_grupocomercial = JArray.Parse(item.GetValue("data_grupo_comercial").ToString());
                if (item.GetValue("data_singrupo_comercial").ToString() != "") {
                    ja_sin_grupocomercial = JArray.Parse(item.GetValue("data_singrupo_comercial").ToString());
                }
            }
            
            foreach (JObject item in ja_con_grupocomercial)
            {
                string idgrupocomercial = item.GetValue("idgrupocomercial").ToString();
                Clients.Group(idgrupocomercial).mostrarMensajeToCliente(usuario_origen, pstring_obj);
            }

            foreach (JObject item in ja_sin_grupocomercial)
            {
                string connectionid = string.Empty;
                string usuario_singrupo = item.GetValue("usuario").ToString();
                var objusuarios_conectados = usuariosConectados.Where(x => x.Usuario.ToLower().Trim() == usuario_singrupo.ToLower()).ToList();
                if (objusuarios_conectados != null)
                {
                    if (objusuarios_conectados.Count > 0)
                    {
                        foreach (var item_usuario in objusuarios_conectados)
                        {
                            connectionid = item_usuario.ContextId_WebSocket;
                            Clients.Client(connectionid).mostrarMensajeToCliente(usuario_origen, pstring_obj);
                        }
                    }
                }
            }

            //// EL ANTERIOR
            //JArray ja = JArray.Parse(s_lst) as JArray;

            //foreach (JObject item in ja)
            //{
            //    string categoria_grupo = item.GetValue("categoria_grupo").ToString();
            //    string idgrupocomercial = item.GetValue("idgrupocomercial").ToString();
            //    string mensaje = item.GetValue("mensajenotificacion").ToString();

            //    if (categoria_grupo != "singrupo")
            //    {
            //        Clients.Group(idgrupocomercial).mostrarMensajeToCliente(usuario_origen, pstring_obj);
            //    }
            //    else if (categoria_grupo == "singrupo") {
            //        string connectionid = string.Empty;
            //        string usuario_singrupo = item.GetValue("usuariossingrupo").ToString();
            //        var objusuarios_conectados = usuariosConectados.Where(x => x.Usuario.ToLower().Trim() == usuario_singrupo.ToLower()).ToList();
            //        if (objusuarios_conectados != null)
            //        {
            //            if (objusuarios_conectados.Count > 0)
            //            {
            //                foreach (var item_usuario in objusuarios_conectados)
            //                {
            //                    connectionid = item_usuario.ContextId_WebSocket;
            //                    Clients.Client(connectionid).mostrarMensajeToCliente(usuario_origen, pstring_obj);
            //                }
            //            }
            //        }
            //    }
            //}
            return true;
        }

        public bool SendMessage(string usuario, string mensaje)  // , string usuario_destino
        {
            ////Clients.Client(Usernames[usuario_destino]).mostrarMensajeToCliente(usuario, mensaje);
            //string contextid_usuariodestino = usuariosConectados.Where(x => x.Usuario.Trim() == usuario_destino.Trim()).FirstOrDefault().ContextId_WebSocket;
            //Clients.Client(contextid_usuariodestino).mostrarMensajeToCliente(usuario, mensaje);

            FormatoMensajeWebSocket objmensaje_recibida = JsonConvert.DeserializeObject<FormatoMensajeWebSocket>(mensaje);
            string usuario_destino = objmensaje_recibida.usuario_destino.Trim();
            string connectionid = string.Empty;

            var objusuarios_conectados = usuariosConectados.Where(x => x.Usuario.ToLower().Trim() == usuario_destino.ToLower()).ToList();
            if (objusuarios_conectados != null)
            {
                if (objusuarios_conectados.Count > 0) {
                    foreach(var item in objusuarios_conectados)
                    {
                        connectionid = item.ContextId_WebSocket;
                        Clients.Client(connectionid).mostrarMensajeToCliente(usuario, mensaje);
                    }
                    
                }
                //connectionid = objusuarios_conectados.ContextId_WebSocket;
            }

            //Clients.Client(connectionid).mostrarMensajeToCliente(usuario, mensaje);

            return true;
        }

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopcalled)
        {
            string usuario = usuariosConectados.Find(x => x.ContextId_WebSocket == Context.ConnectionId).Usuario.Trim();
            FormatoMensajeWebSocket objmensaje = new FormatoMensajeWebSocket { mensaje_para_erp = "USUARIO DESCONECTADO: " + usuario + " Contexto : " + Context.ConnectionId, plataforma = "web", tipomensaje = "notificar", titulo_mensaje = "", usuario_origen = usuario };

            string cadenaserializada = JsonConvert.SerializeObject(objmensaje);
            usuariosConectados.RemoveAt(usuariosConectados.FindIndex(x => x.ContextId_WebSocket == Context.ConnectionId));

            Clients.All.mostrarMensajeToCliente(usuario, cadenaserializada);

            return base.OnDisconnected(stopcalled);
        }

        public override Task OnReconnected()
        {
            return base.OnReconnected();
        }
    }
}