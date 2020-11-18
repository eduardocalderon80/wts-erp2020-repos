using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using System.Net.Mail;

namespace Utilitario
{
    public class NotificadorCorreo
    {
        public async Task<bool> EnviarCorreo_Notificar(string asunto, string destinatario, string cc, string bcc, string cuerpo, List<FileMailAttachment> Archivos, bool accephtml = true, string pfrom = "", AlternateView htmlView = null)
        {
            EnvioCorreo utilEnvioCorro = new EnvioCorreo();
            bool correoenviado = false;
            correoenviado = await Task.Run(() => utilEnvioCorro.EnviarCorreo(asunto, destinatario, cc, bcc, cuerpo, Archivos, accephtml, pfrom, htmlView));
            return correoenviado;
        }
    }
}
