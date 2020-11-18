using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WTS_ERP.Startup))]
namespace WTS_ERP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
