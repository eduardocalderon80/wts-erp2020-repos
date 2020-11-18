using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL_ERP.Laboratorio
{
    public class NotificadorCorreoWorkflow
    {
        Dictionary<string, string> oListaMensajes = new Dictionary<string, string>();
        public NotificadorCorreoWorkflow()
        {
            oListaMensajes.Add("Titulo", "");
            oListaMensajes.Add("Cuerpo", "");
        }

        public string DevolverDiccionario(string pClave)
        {
            return oListaMensajes[pClave];
        }

        /// <summary>
        /// Creación de Mensaje para el Envio de Correo
        /// </summary>
        /// <param name="pOrigen"></param>
        /// <param name="pDestino"> PO => 2 [OPERADOR], PAS=> 3 [ASIGNADOR], CR=> 1 [CON RECHAZO] </param>
        /// <param name="pCodigoSolicitud"></param>
        /// <param name="pServicio"></param>
        /// <param name="pEmisor"></param>

        public void CrearMensaje(int pOrigen, int pDestino, int pCodigoSolicitud, string pServicio, string pEmisor)
        {
            if (pOrigen == 1)
            {
                if (pDestino == 4)
                {
                    oListaMensajes["Titulo"] = string.Format("Aprobación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} le ha enviado una solicitud {1} para su aprobación, por favor revise su bandeja de aprobaciones.", pEmisor, pServicio);

                }
                else if (pDestino == 3)
                {
                    oListaMensajes["Titulo"] = string.Format("Asignación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} le ha enviado una solicitud {1} para su asignación, por favor revise su bandeja de asignaciones.", pEmisor, pServicio);
                }
                else if (pDestino == 2)
                {
                    oListaMensajes["Titulo"] = string.Format("Operación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} le ha enviado una solicitud {1} para su operacón, por favor revise su bandeja de operaciones.", pEmisor, pServicio);
                }
            }
            else if (pOrigen == 4)
            {                
                if (pDestino == 1)
                {
                    oListaMensajes["Titulo"] = string.Format("Rechazo de su solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} ha rechazado su solicitud de {1}, por favor revise su bandeja de solicitudes pendientes.", pEmisor, pServicio);
                }
                else if (pDestino == 3)
                {
                    oListaMensajes["Titulo"] = string.Format("Asignación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} le ha enviado una solicitud {1} para su asignación, por favor revise su bandeja de asignaciones.", pEmisor, pServicio);
                }
                else if (pDestino == 2)
                {
                    oListaMensajes["Titulo"] = string.Format("Operación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} le ha enviado una solicitud {1} para su operacón, por favor revise su bandeja de operaciones.", pEmisor, pServicio);
                }
            }

            if (pOrigen == 3)
            {
                if (pDestino == 2)
                {
                    oListaMensajes["Titulo"] = string.Format("Asignación de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0}  ha enviado la solicitud {1} para su atención, por favor revise su bandeja de operaciones.", pEmisor, pServicio);
                }
            }

            if (pOrigen == 2)
            {
                if (pDestino == 1)
                {
                    oListaMensajes["Titulo"] = string.Format("Fin de la Ejecución de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} ha concluido la operación de la solicitud {1} .", pEmisor, pServicio);
                }

                if (pDestino == 3)
                {
                    oListaMensajes["Titulo"] = string.Format("Inicio de Ejecución de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} ha iniciado la ejecución de la solicitud {1} .", pEmisor, pServicio);
                }

                if (pDestino == 5)
                {
                    oListaMensajes["Titulo"] = string.Format("Fin de la Ejecución de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} ha enviado la solicitud {1} para su revisión , por favor revise su bandeja de revisión.", pEmisor, pServicio);
                }
            }

            if (pOrigen == 5)
            {
                if (pDestino == 2)
                {
                    oListaMensajes["Titulo"] = string.Format("Revisión de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0}  ha enviado la solicitud {1} para la corrección de las observaciones, por favor revise su bandeja de operaciones..", pEmisor, pServicio);
                }
                if (pDestino == 1)
                {
                    oListaMensajes["Titulo"] = string.Format("Revisión de la solicitud N°{0}", pCodigoSolicitud);
                    oListaMensajes["Cuerpo"] = string.Format("El usuario {0} ha concluido con  la solicitud {1} .", pEmisor, pServicio);
                }
            }
        }
    }
}
