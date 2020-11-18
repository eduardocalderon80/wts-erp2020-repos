using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WTS_ERP.Areas.Mailbox.Services
{
    public interface IInboxService
    {
        int Insert_Mail(string parametro);
    }
}
