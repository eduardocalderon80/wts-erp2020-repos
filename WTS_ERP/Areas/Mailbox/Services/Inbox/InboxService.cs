using BE_ERP;
using BL_ERP;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WTS_ERP.Areas.Requerimiento.Models;

namespace WTS_ERP.Areas.Mailbox.Services
{
    public class InboxService : IInboxService
    {
        public int Insert_Mail(string parametro)
        {
            DBHelper dbHelper = new DBHelper();
            List<Parameter> Parameters = new List<Parameter>() {
                new Parameter { Key = "par", Value =parametro }
            };

            int data = dbHelper.SaveRowsTransaction_Out("Mailbox.usp_Insert_Mail", Parameters);
            return data;
        }
    }
}