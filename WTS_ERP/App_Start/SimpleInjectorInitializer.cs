[assembly: WebActivator.PostApplicationStartMethod(typeof(WTS_ERP.App_Start.SimpleInjectorInitializer), "Initialize")]

namespace WTS_ERP.App_Start
{
    using System.Reflection;
    using System.Web.Mvc;
    using SimpleInjector;
    using SimpleInjector.Integration.Web;
    using SimpleInjector.Integration.Web.Mvc;
    using WTS_ERP.Areas.Maestra.Services;
    using WTS_ERP.Areas.Requerimiento.Services;
    using WTS_ERP.Areas.Facturacion.Services;
    using WTS_ERP.Areas.Mailbox.Services;
    using WTS_ERP.Areas.Seguridad.Services;

    public static class SimpleInjectorInitializer
    {
        /// <summary>Initialize the container and register it as MVC3 Dependency Resolver.</summary>
        public static void Initialize()
        {
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebRequestLifestyle();
            
            InitializeContainer(container);

            container.RegisterMvcControllers(Assembly.GetExecutingAssembly());
            
            container.Verify();
            
            DependencyResolver.SetResolver(new SimpleInjectorDependencyResolver(container));
        }
     
        private static void InitializeContainer(Container container)
        {
            // For instance:
            // container.Register<IUserRepository, SqlUserRepository>(Lifestyle.Scoped);
            //container.Register<IFacturaSeguimientoService, FacturaSeguimientoService>(Lifestyle.Scoped);
            container.Register<IProgramaService, ProgramaService>(Lifestyle.Scoped);
            container.Register<ITesoreriaBolService, TesoreriaBolService>(Lifestyle.Scoped);
            container.Register<IClienteMarcaService, ClienteMarcaService>(Lifestyle.Scoped);
            container.Register<IClienteDivisionService, ClienteDivisionService>(Lifestyle.Scoped);
            container.Register<IClienteDivisionPersonalService, ClienteDivisionPersonalService>(Lifestyle.Scoped);
            container.Register<IClienteTemporadaService, ClienteTemporadaService>(Lifestyle.Scoped);
            container.Register<IEstiloService, EstiloService>(Lifestyle.Scoped);
            container.Register<ITelaService, TelaService>(Lifestyle.Scoped);
            container.Register<IColorService, ColorService>(Lifestyle.Scoped);
            container.Register<IOrnamentoService, OrnamentoService>(Lifestyle.Scoped);
            container.Register<IAvioService, AvioService>(Lifestyle.Scoped);
            container.Register<IRequerimientoMuestraService, RequerimientoMuestraService>(Lifestyle.Scoped);
            container.Register<IProveedorService, ProveedorService>(Lifestyle.Scoped);
            container.Register<ISolicitudService, SolicitudService>(Lifestyle.Scoped);
            container.Register<IPrecioService, PrecioService>(Lifestyle.Scoped);
            container.Register<IPermisosService, PermisosService>(Lifestyle.Scoped);
            container.Register<IInboxService, InboxService>(Lifestyle.Scoped);
            container.Register<IFacturacionSampleInicial, FacturacionSampleInicial>(Lifestyle.Scoped);
            container.Register<IOrdenPedidoService, OrdenPedidoService>(Lifestyle.Scoped);
            container.Register<IFacturaFabricaService, FacturaFabricaService>(Lifestyle.Scoped);
            container.Register<IFacturaClienteService, FacturaClienteService>(Lifestyle.Scoped);
        }
    }
}