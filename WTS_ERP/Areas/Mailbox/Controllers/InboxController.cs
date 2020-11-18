using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WTS_ERP.Areas.Mailbox.Services;
using WTS_ERP.Models;

namespace WTS_ERP.Areas.Mailbox.Controllers
{
    public class InboxController : Controller
    {
        private readonly IInboxService _inboxService;
        public InboxController(IInboxService inboxService)
        {
            _inboxService = inboxService;
        }

        // GET: Mailbox/Inbox
        [AccessSecurity]
        public ActionResult Index()
        {
            return View();
        }
        [AccessSecurity]
        public ActionResult _Mail()
        {
            return View();
        }

        [AccessSecurity]
        [HttpPost]
        [ValidateInput(false)]
        public string Insert_Mail()
        {
            string sParModel = _.Post("par");
            sParModel = _.addParameter(sParModel, "Usuario", _.GetUsuario().Usuario);
            int Id = _inboxService.Insert_Mail(sParModel);
            string mensaje = _.Mensaje("new", Id > 0, Id.ToString(), Id);
            return mensaje;
        }
    }
}