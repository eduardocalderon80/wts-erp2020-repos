using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BL_ERP;
using WTS_ERP.Models;
using Newtonsoft.Json;
using BE_ERP.PortalFactory.PackingList;
using BE_ERP.PortalFactory.ServicioPackingList;
using BL_ERP.PortalFabrica.PackingList;
using System.Text;


namespace WTS_ERP.Areas.PortalFabrica.Controllers
{
    public class PackingListController : Controller
    {
        protected int cantidadCarrito = 0;
        protected int cantidadCarritoDES = 0;
        // GET: PortalFabrica/PackingList
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult PackingListEDIAddStyle()
        {
            string IdServiciopackinglist = _.Get("id");
            string NumeroPackingList = _.Get("NumPackingList");
            string PO = _.Get("PO");
            string CodUsuarioCreacionPO = _.Get("CodUsuarioCreacionPO");
            string CodCliente = _.Get("CodCliente");
            string CodFabrica = _.Get("CodFabrica");
            string NombreCliente = _.Get("NombreCliente");
            string NombreProveedor = _.Get("NombreProveedor");
            string NPacking = _.Get("NPacking");
            string IdUsuarioFabricaSession = _.Get("IdUsuarioFabricaSession");
            ViewBag.IdServicioPackinglist = IdServiciopackinglist;
            ViewBag.NumeroPackingList = NumeroPackingList;
            ViewBag.PO = PO;
            ViewBag.CodUsuarioCreacionPO = CodUsuarioCreacionPO;
            ViewBag.CodCliente = CodCliente;
            ViewBag.CodFabrica = CodFabrica;
            ViewBag.NombreCliente = NombreCliente;
            ViewBag.NombreProveedor = NombreProveedor;
            ViewBag.Listadestinos = CargarCombos(CodUsuarioCreacionPO).listaDestino;
            ViewBag.NPacking = NPacking;
            ViewBag.IdUsuarioFabricaSession = IdUsuarioFabricaSession;
            //blPackingList oblPackingList = new blPackingList();
            //ServicioPackingList oServicioPackingList = new ServicioPackingList();
            //oServicioPackingList = oblPackingList.traer_PackingListCartonxId(Util.ERP, int.Parse(IdServiciopackinglist));

            return View();
        }

        [HttpPost]
        public string UploadPLCSV()
        {
            if (_.Post("NPacking") != "0")
            {
                return CargaListaCarton(_.Post("NPacking"), "[{\"Mensaje\":\"\"}]");               
            }

            string result = "";
            string hfNoGrabar = "";
            string Mensaje = "";
            try
            {

                hfNoGrabar = _.Post("hfNoGrabar");
                List<bePackingListDetalleCarton> Carton = null;
                blPackingList oblPackingList = new blPackingList();
                ServicioPackingList oServicioPackingList = new ServicioPackingList();

                oServicioPackingList = oblPackingList.traer_PackingListCartonxId(Util.ERP, int.Parse(_.Post("IdPackinglist")));

                Carton = new List<bePackingListDetalleCarton>();


                foreach (ServicioPackingListBoxDetail sbd in oServicioPackingList.BoxDetail)
                {
                    bePackingListDetalleCarton obePackingListDetalleCarton = null;

                    obePackingListDetalleCarton = new bePackingListDetalleCarton();
                    obePackingListDetalleCarton.BOX = sbd.BoxNumber;
                    obePackingListDetalleCarton.CodPurord = sbd.PO;
                    obePackingListDetalleCarton.CodEstilo = sbd.Style;
                    obePackingListDetalleCarton.CodColor = sbd.Color;
                    obePackingListDetalleCarton.CodTalla = sbd.Size;
                    obePackingListDetalleCarton.Ratio = sbd.Qty;
                    obePackingListDetalleCarton.TotalBox = sbd.TotalPCS;
                    obePackingListDetalleCarton.NetWeight = sbd.NetWeight;
                    obePackingListDetalleCarton.GrossWeight = sbd.GrossWeight;
                    obePackingListDetalleCarton.DCNumber = sbd.StoreNumber;
                    obePackingListDetalleCarton.Comentario = sbd.Descripcion;
                    Carton.Add(obePackingListDetalleCarton);
                }


                if (_.Post("Cliente") == "00186")// Soft surrounding . Split Style
                {
                    List<bePackingListDetalleCarton> Cartons = new List<bePackingListDetalleCarton>();
                    bePackingListDetalleCarton oCarton = null;
                    foreach (var item in Carton)
                    {
                        oCarton = item;
                        string[] Style = item.CodEstilo.Split('-');
                        item.CodEstiloUPC = item.CodEstilo;
                        item.CodEstilo = Style[0];
                        Cartons.Add(oCarton);
                    }
                    Carton = Cartons;
                }

                List<bePackingListDetalle> Lotes = new List<bePackingListDetalle>();
                List<bePackingListDetalleSKU> Skus = new List<bePackingListDetalleSKU>();

                string codEmpresa = "02"; //Session["Cod_Empresa"].ToString();
                blPackingList blPackingList = new blPackingList();
                bePackingListHeader obePackingListHeader = null;
                if (Carton.Count > 0)
                {
                    IEnumerable<string> Pos = Carton.Select(x => x.CodPurord).Distinct();
                    int ConPO = 0;
                    foreach (string po in Pos)
                    {
                        if (ConPO >= 1)
                        {
                            Mensaje = "[{\"mensaje\":\"El packing list contiene mas de una PO. Solo se puede realizar un Packing List por PO\" }]";
                            return Mensaje;
                            //ScriptManager.RegisterStartupScript(this, this.GetType(), "mensaje", "javascript:alert('El packing list contiene mas de una PO. Solo se puede realizar un Packing List por PO');", true);
                            //return;
                        }
                       
                        obePackingListHeader = blPackingList.listaPoDetallesSKU(Util.Intranet, _.Post("Cliente"), _.Post("Fabrica"), _.Post("Destino"), po, codEmpresa);
                        if (obePackingListHeader != null)
                        {
                            Lotes.AddRange(obePackingListHeader.Lote);
                            Skus.AddRange(obePackingListHeader.SKU);


                            foreach (var carton in Carton.FindAll(x => x.CodPurord == po))
                            {
                                //Inicio bloque1 LA 16052019
                                //Se comento este bloque para no validar que cada item de la PO este dentro del Packinglist en proceso                                
                                int index = obePackingListHeader.SKU.FindIndex(x => x.Cod_PurOrd.Trim() == carton.CodPurord.Trim() && x.Cod_EstCli.Trim() == carton.CodEstilo.Trim() && x.Cod_ColorCliente.Trim().ToUpper() == carton.CodColor.Trim().ToUpper() && x.Cod_Talla.Trim().ToUpper() == carton.CodTalla.Trim().ToUpper());
                                if (index >= 0)
                                {
                                    carton.CodLotest = obePackingListHeader.SKU[index].Cod_LotPurOrd;
                                    carton.QtyReq = obePackingListHeader.SKU[index].Cant_Requerida;
                                    obePackingListHeader.SKU[index].Relacionado = true;
                                }
                                else
                                {
                                    //cod1 += carton.CodPurord.Trim() + "," + carton.CodEstilo.Trim() + "," + carton.CodColor.Trim().ToUpper() + "," + carton.CodTalla.Trim().ToUpper();
                                    carton.CodLotest = "XXX";
                                    hfNoGrabar = "1";
                                }
                                //Fin bloque1 LA 16052019
                            }
                        }
                        ConPO++;
                    }

                    var CartonGroup = Carton.Select(x => new { x.CodPurord, x.CodEstilo, x.CodLotest }).GroupBy(x => new { x.CodPurord, x.CodEstilo, x.CodLotest });
                    var Group = Carton.FindAll(x => x.CodLotest != null).GroupBy(x => new { x.CodPurord, x.CodEstilo, x.CodLotest }).Select(group => new { PO = group.Key.CodPurord, Style = group.Key.CodEstilo, Lot = group.Key.CodLotest, Qty = group.Sum(x => x.Ratio) });
                    var GroupTotals = Carton.FindAll(x => x.CodLotest != null).GroupBy(x => new { x.CodPurord, x.CodEstilo, x.CodLotest, x.CodColor, x.CodTalla, x.QtyReq }).Select(x => new { Po = x.Key.CodPurord, Style = x.Key.CodEstilo, Lot = x.Key.CodLotest, Color = x.Key.CodColor, Size = x.Key.CodTalla, ReqQty = x.Key.QtyReq, ShipQty = x.Sum(z => z.Ratio) });

                    foreach (var item in Group)
                    {
                        int index = Lotes.FindIndex(x => x.CodPurord.Trim() == item.PO.Trim() && x.CodEstilo.Trim() == item.Style.Trim() && x.CodLotest.Trim() == item.Lot.Trim());
                        if (index >= 0)
                        {
                            Lotes[index].CantidadxDespachar = item.Qty;
                            Lotes[index].Mapped = true;
                        }
                    }
                    Session["ASN"] = null;
                    if (Lotes.Count > 0)
                    {
                        beASN obeASN = new beASN();
                        obeASN.ListaDetalle = Lotes;
                        obeASN.Carton = Carton;
                        Session["ASN"] = obeASN;
                        Lotes.ForEach(x => { cantidadCarrito += x.CantidadxDespachar; cantidadCarritoDES += x.CantidadDespachadas; });
                        var jsonStringResultLotes = Newtonsoft.Json.JsonConvert.SerializeObject(Lotes);

                        Newtonsoft.Json.Linq.JObject oJResultLotes = new Newtonsoft.Json.Linq.JObject();
                        oJResultLotes.Add("CantidadCarrito", cantidadCarrito);
                        oJResultLotes.Add("CantidadCarritoDES", cantidadCarritoDES);

                        Newtonsoft.Json.Linq.JArray oJArrResultLotes = new Newtonsoft.Json.Linq.JArray();
                        oJArrResultLotes.Add(oJResultLotes);

                        var jsonjsonStringResultLotesTotales = Newtonsoft.Json.JsonConvert.SerializeObject(oJArrResultLotes);
                        var jsonStringResultGroupTotals = Newtonsoft.Json.JsonConvert.SerializeObject(GroupTotals);

                        //var jsonjsonStringResultLotesTotales = "[{\"CantidadCarrito\":\"" + cantidadCarrito + "\",\"CantidadCarritoDES\":\"" + cantidadCarritoDES + "\"}]";
                        //var jsonStringResultGroupTotals = Newtonsoft.Json.JsonConvert.SerializeObject(GroupTotals);
                        
                        result = jsonStringResultLotes + "¬" + jsonjsonStringResultLotesTotales + "^" + jsonStringResultGroupTotals;

                        //ScriptManager.RegisterStartupScript(this, this.GetType(), "MostrarFileDetail", "javascript:MostrarFileDetail();", true);
                        //if (hfNoGrabar != "")
                        //{
                        //  Mensaje = "[{\"mensaje\":\"Existen items dentro del packing que no se han relacionado con una PO/Estilo. Por favor revise el contenido del packing list\",\"hfNoGrabar\":\"" + hfNoGrabar + "\" }]";
                            //ScriptManager.RegisterStartupScript(this, this.GetType(), "mensaje", "javascript:alert('Existen items dentro del packing que no se han relacionado con una PO/Estilo. Por favor revise el contenido del packing list');", true);
                        //}
                    }
                }
            }
            catch (Exception ex)
            {
                hfNoGrabar = "2";

                Newtonsoft.Json.Linq.JObject oJMensaje = new Newtonsoft.Json.Linq.JObject();
                oJMensaje.Add("mensaje", ex.Message);
                oJMensaje.Add("hfNoGrabar", hfNoGrabar);

                Newtonsoft.Json.Linq.JArray oJArrMensaje = new Newtonsoft.Json.Linq.JArray();
                oJArrMensaje.Add(oJMensaje);
                return Mensaje = Newtonsoft.Json.JsonConvert.SerializeObject(oJArrMensaje);
                //Mensaje = "[{\"mensaje\":\"" + ex.Message + "\",\"hfNoGrabar\":\"" + hfNoGrabar + "\" }]";               
                //ScriptManager.RegisterStartupScript(this, this.GetType(), "mensaje", "javascript:alert('" + ex.Message + "');", true);
            }
            if (result != string.Empty)
            {
                return result;
            }
            else {
                return Mensaje;
            }
            //return result + "^" + Mensaje;
        }

        [HttpPost]
        public string GrabarPackingList(string NumeroPackingList, string NumPackingList, string Cliente, string Fabrica, string Destino, string FechaDespacho, int MasDespachos)
        {
            int idPackinList = 0;
            bool bresult = false;
            string xresult = ""; 
            //string guid = hfGuid.Value;
            //Insertar        
            blPackingList blPackingList = new blPackingList();
            bePackingList obePackingList = new bePackingList();
            bePackingListHeader obePackingHeader = new bePackingListHeader();
            obePackingHeader.NumeroPackingList = NumPackingList.Trim();
            obePackingHeader.Cod_Cliente = Cliente.Trim();
            obePackingHeader.Cod_Empresa = "02";
            obePackingHeader.Cod_fabrica = Fabrica.Trim();
            obePackingHeader.Cod_Destino = Destino.Trim();
            obePackingHeader.FechaDespacho = DateTime.Today.ToString("MM/dd/yyyy");
            obePackingHeader.NumPackingList = NumeroPackingList.Trim();
            obePackingHeader.MasDespachos = MasDespachos;
            //Utils.ConvierteFormatoANSI(txtFechaDespacho.Text);
            //obePackingHeader.Fecha_BL_HAWBL = CUtiles.ConvierteFormatoANSI(txtDeliveryDate.Text);
            //obePackingHeader.NumeroGuia = txtGuide.Text.Trim();
            //obePackingHeader.TBC_BL_HAWBL = chkTBCGuia.Checked ? "TBC" : "";
            obePackingList.bePackingListEncabezado = obePackingHeader;
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();
            if (Session["ASN"] != null)
            {
                beASN obeASN = (beASN)Session["ASN"];

                listaPackingListDetalle = obeASN.ListaDetalle;
                if (listaPackingListDetalle.Count > 0)
                {
                    obePackingList.listaPackingListDetalle = obeASN.ListaDetalle.FindAll(x => x.Mapped);
                    var Packs = obeASN.Carton.Select(x => x.BOX).Distinct();
                    List<beCarton> Carton = new List<beCarton>();
                    string PO = obeASN.Carton[0].CodPurord; // Un packing list es por una PO . Una PO puede tener varios estilos
                    int Arrival = blPackingList.NumeroDeDespachos(Util.Intranet, PO, obePackingHeader.Cod_Cliente, obePackingHeader.Cod_Empresa);
                    if (Arrival < 0)
                    {
                        Arrival = 0;
                    }
                    Arrival++;//Se suma un despacho 
                    beCarton obeCarton = null;
                    beCartonDetail obeCartonDetail = null;
                    foreach (var pack in Packs)
                    {
                        obeCarton = new beCarton();
                        obeCarton.Detail = new List<beCartonDetail>();
                        obeCarton.BoxNumber = pack;
                        obeCarton.BoxCode = PO + "X" + Arrival.ToString() + "X" + pack.ToString();
                        foreach (var item in obeASN.Carton.FindAll(x => x.BOX == pack))
                        {
                            obeCartonDetail = new beCartonDetail();
                            obeCartonDetail.PO = item.CodPurord;
                            obeCartonDetail.Style = item.CodEstilo;
                            obeCartonDetail.BuyerStyle = item.CodEstiloUPC;
                            obeCartonDetail.Lote = item.CodLotest;
                            obeCartonDetail.Descripcion = item.Comentario;
                            obeCartonDetail.Color = item.CodColor;
                            obeCartonDetail.Size = item.CodTalla;
                            obeCartonDetail.Qty = item.Ratio;
                            obeCarton.Detail.Add(obeCartonDetail);
                        }
                        Carton.Add(obeCarton);
                    }
                    obePackingList.Carton = Carton;
                    idPackinList = blPackingList.insertarPackingListV2_Carton_ServicioPackingList(Util.Intranet, obePackingList);
                    if (idPackinList > 0)
                    {
                        Session["ASN"] = null;

                        bresult = true;
                        xresult = "[{\"mensaje\":\"\",\"hfIdPackingList\":\"" + idPackinList.ToString() + "\",\"bresult\":\"" + bresult + "\"}]";
                        //hfIdPackingList.Value = idPackinList.ToString();
                        //btnCancelar_Click(null, null);
                    }
                    else
                    {
                        xresult = "[{\"mensaje\":\"Se ha producido un error.\",\"hfIdPackingList\":\"" + idPackinList.ToString() + "\",\"bresult\":\"" + bresult + "\"}]";
                        //ScriptManager.RegisterStartupScript(this, this.GetType(), "mensaje", "javascript:alert('Se ha producido un error.');", true);
                    }
                }
            }

            return CargaListaCarton(idPackinList.ToString(), xresult);
        }
        [HttpPost]
        public string CargaListaCarton(string idPackingList, string xresult)
        {
            string xres = xresult;
            JsonResult oJsonResult = new JsonResult();
            if (idPackingList != "")
            {
                oJsonResult = buscarPackingListxId(int.Parse(idPackingList));
                xres += "¬" + JsonConvert.SerializeObject(oJsonResult.Data);
            }
            return xres;
        }
        private bePackingList CargarCombos(string codusuario)
        {
            blPackingList oblPackingList = new blPackingList();

            bePackingList obePackingList = oblPackingList.traerPackingList_Default(Util.ERP, codusuario);
            return obePackingList;
        }
        [HttpPost]
        public JsonResult buscarPackinList(string idPackingList, string codCliente, string codFabrica, string codDestino)
        {
            blPackingList blPackingList = new blPackingList();
            List<bePackingListDetalle> listaBusqueda = new List<bePackingListDetalle>();
            bePackingListHeader obePackingListHeader = new bePackingListHeader();

            obePackingListHeader.IdPackingList = int.Parse(idPackingList);
            obePackingListHeader.NumeroPackingList = "";
            obePackingListHeader.Cod_Cliente = codCliente;
            obePackingListHeader.Cod_fabrica = codFabrica;
            obePackingListHeader.Cod_Empresa = "02";
            obePackingListHeader.Cod_Destino = codDestino;
            obePackingListHeader.FechaIni = "";//CUtiles.ConvierteFormatoANSI(txtFechaA.Text);
            obePackingListHeader.FechaFin = "";// CUtiles.ConvierteFormatoANSI(txtFechaB.Text);
            obePackingListHeader.tienedi = "";

            listaBusqueda = blPackingList.listaPackingList(Util.Intranet, obePackingListHeader);
            return Json(listaBusqueda, JsonRequestBehavior.AllowGet);
            //llenar la grilla
        }

        [HttpPost]
        public JsonResult buscarPackingListxId(int idPackingList)
        {
            blPackingList blPackingList = new blPackingList();
            List<bePackingListDetalle> listaBusqueda = new List<bePackingListDetalle>();
            listaBusqueda = blPackingList.listaPackingListxID(Util.Intranet, idPackingList);
            return Json(listaBusqueda, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult CartonLabelSS(int id)
        {
            int IdPackingList = id;
            blPackingList blPackingList = new blPackingList();
            List<beCarton> Carton = blPackingList.PackingList_Carton_GET(Util.Intranet, IdPackingList);
            bool lastloop = false;
            int EtiquetasPorCarton = 4;
            if (Carton != null && Carton.Count > 0)
            {
                int cont = 1;
                StringBuilder sb = new StringBuilder();
                string idPostalCodeBarcode = "";

                int length = Carton.Count;
                if (length < EtiquetasPorCarton)
                {
                    EtiquetasPorCarton = length;
                }
                int Cartons = length / EtiquetasPorCarton;
                int Resto = length % EtiquetasPorCarton;
                bool resto = false;
                if (Resto > 0) resto = true;
                int index = 0;
                int BoxesperCartonSize = 4;
                if (EtiquetasPorCarton < BoxesperCartonSize)
                {
                    BoxesperCartonSize = EtiquetasPorCarton;
                }

                for (int i = 1; i <= Cartons; i++)
                {
                    sb.Append("<div class='Hoja'>");
                    sb.Append("<div class='CartonSize'>");
                    for (int x = 1; x <= BoxesperCartonSize; x++)
                    {
                        idPostalCodeBarcode = "ShipTobarcode" + cont;
                        sb.Append("<div class='CartonSizeSoftSur'>");
                        //sb.Append("<div style='padding-left:0.2in;padding-top:0.08in;padding-bottom:2px;'><strong><span style='font - size: 16pt; border - top: 20px;'>Soft Surroundings</span></strong></div>");
                        sb.Append("<div class='CartonTitle'><strong><span>Soft Surroundings</span></strong></div>");
                        //sb.Append("<div id='" + idPostalCodeBarcode + "' style='position: relative; width: 100%; height: 0.7in; padding - left: 0.1205in; padding - right: 0.1205in;display: block;'></div>");
                        sb.Append("<div id='" + idPostalCodeBarcode + "' class='CartonBarcode'></div>");
                        //sb.Append("<div style='text-align:center'><span style='font - size:16pt; border - top:20px; padding - left:18px; font: 16pt Consolas, Monaco, Sans Mono,monospace,sans - serif;'>*" + Carton[index].BoxCode + "*</span></div>");
                        sb.Append("<div class='CartonBarCodeValue'><span>*" + Carton[index].BoxCode + "*</span></div>");
                        sb.Append("</div>");
                        sb.Append("<script>drawBarcode39('" + idPostalCodeBarcode + "','" + Carton[index].BoxCode + "')</script>");
                        sb.Append("<br>");
                        cont++;
                        index++;
                    }
                    sb.Append("</div>");
                    sb.Append("</div>");
                    if (Cartons == i && !lastloop)
                    {
                        lastloop = true;
                        if (resto)
                        {
                            BoxesperCartonSize = Resto;
                            Cartons++;
                        }
                    }
                }

                ViewBag.litSSCC = sb.ToString();
            }
            else
            {
                ViewBag.litSSCC = "<h3 style='color:red;font-weight:bold;'>No hay cartones</h3>";
            }

            return View();
        }
        [HttpPost]
        public ActionResult VerificarpackingList(string idServicioPackingList, string codCliente, string IdUsuarioFabrica)
        {
            var oJRespuesta = new JsonResponse();
            blMantenimiento oblMantenimiento = new blMantenimiento();
            oJRespuesta.Success = false;

            string par = idServicioPackingList + "^" + codCliente + "^" + IdUsuarioFabrica;
            string data = oblMantenimiento.get_Data("uspObservacionPackingList_GenerarCartons", par.ToString(), false, Util.Intranet);
            if (data != "")
            {
                oJRespuesta.Success = true;
                oJRespuesta.Data = data;
            }
            return Json(oJRespuesta, JsonRequestBehavior.AllowGet);
        }
    }
}
public class JsonResponse
{
    public string Message { get; set; }

    public bool Success { get; set; }

    public object Data { get; set; }
}