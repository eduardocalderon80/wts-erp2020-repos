using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using BL_ERP;
using System.Net;
using System.Net.Mail;
using System.IO;
using System.Configuration;
 
namespace Utilitario
{
    public class EnvioCorreo
    {
        public bool EnviarCorreo(string asunto, string destinatario, string cc, string bcc, string cuerpo, List<FileMailAttachment> Archivos, bool accephtml = true, string pfrom = "", AlternateView htmlView = null)
        {
            blLog bllog = new blLog();
            try
            {
                string host = ConfigurationManager.AppSettings["host"].ToString();
                string puerto = ConfigurationManager.AppSettings["puerto"].ToString();
                string strenablessl = ConfigurationManager.AppSettings["enablessl"].ToString();
                bool enablessl = false;
                if (strenablessl == "1") {
                    enablessl = true;
                }
                string credencial_usuario = ConfigurationManager.AppSettings["credencial_usuario"].ToString();
                string credencial_password = ConfigurationManager.AppSettings["credencial_password"].ToString();
                string from = "";
                if (!string.IsNullOrEmpty(pfrom))
                {
                    from = pfrom;
                }
                else {
                    from = ConfigurationManager.AppSettings["from"].ToString();
                }
                
                string displayname = ConfigurationManager.AppSettings["displayname"].ToString();

                string m_strHost = host;
                int m_strPuerto = int.Parse(puerto);
                bool m_strEnableSsl = enablessl;
                string m_strUsrCredential = credencial_usuario;
                string m_strPwdCredential = credencial_password;
                string m_strFrom = from;
                string m_strDisplayName = displayname;

                SmtpClient client = new SmtpClient();
                client.Host = m_strHost;//smtp.office365.com
                client.Port = m_strPuerto; //587
                client.EnableSsl = m_strEnableSsl; // true
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(m_strUsrCredential, m_strPwdCredential);// Usuario,Password

                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(m_strFrom, m_strDisplayName);//From,Sistemas WTS                
                mail.To.Add(destinatario);

                if (cc != null && cc != string.Empty) {
                    if (cc.Trim().Length != 0)
                    {
                        mail.CC.Add(cc);
                    }
                }
                
                if (bcc != null && bcc != string.Empty) {
                    if (bcc.Trim().Length != 0)
                    {
                        mail.Bcc.Add(bcc);
                    }
                }
                
                mail.Subject = asunto;
                mail.IsBodyHtml = accephtml;
                mail.Body = cuerpo;

                if (Archivos != null)
                {
                    if (Archivos.Count > 0)
                    {
                        foreach (var arch in Archivos)
                        {
                            MemoryStream stream = new MemoryStream(arch.Archivo);
                            Attachment attachment = new Attachment(stream, arch.NombreArchivo);
                            mail.Attachments.Add(attachment);
                        }
                    }                    
                }

                mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure | DeliveryNotificationOptions.Delay;

                // :edit => el correo de copia oculta se guardará en el [Web.config]
                string cco= ConfigurationManager.AppSettings["copiacorreoBCC"].ToString();
                
                if(cco.Length>0)
                    mail.Bcc.Add(cco);

                if (htmlView != null) {
                    mail.AlternateViews.Add(htmlView);
                }
                
                client.Send(mail);
                mail.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                bllog.GrabarArchivoLog(ex);
                return false;
            }
        }

        
    }
}
