using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Mvc;
using WTS_ERP.Models;
using Newtonsoft.Json.Linq;
using BL_ERP;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.IO;
using System.Text;
using BE_ERP;
using System.Data;

namespace WTS_ERP.Areas.Auditoria.Controllers
{
    public class EDIController : Controller
    {
        private blMantenimiento oMantenimiento = null;
        private blEdi oEdi = null;
        public EDIController()
        {
            oMantenimiento = new blMantenimiento();
            oEdi = new blEdi();
        }

        [AccessSecurity]
        public ActionResult Monitor()
        {
            return View();
        }
        public ActionResult ListarPO()
        {
            return View();
        }
        public ActionResult PoEDI()
        {
            ViewBag.Usuario = _.GetUsuario().CodUsuario;
            return View();
        }
        public ActionResult PoMarmaxx()
        {
            return View();
        }
        public ActionResult PoFlete()
        {
            return View();
        }
        public ActionResult PackingList()
        {
            return View();
        }
        public string POPendiente()
        {
            string data = oMantenimiento.get_Data("uspPurchaseOrderPendiente", "", true, Util.EDI);
            return data;
        }
        public string ObtenerDatosMarmaxx()
        {
            string data = oMantenimiento.get_Data("uspObtenerDatosEDIMarmaxx", "", true, Util.Intranet);
            return data;
        }
        public string ObtenerDatosMarmaxxERP()
        {
            string data = oMantenimiento.get_Data("uspPOMarmaxxDatosGet", "", true, Util.ERP);
            return data;
        }
        public string ObtenerEstilloTallaColorMarmaxxERP()
        {
            string data = oMantenimiento.get_Data("uspPOMarmaxxEstiloTallaColorGet", _.Post("par"), true, Util.ERP);
            return data;
        }
        public string ObtenerEstilosCreados(string par)
        {
            string data = oMantenimiento.get_Data("uspObtenerEstilosCreadosEDIMarmaxx", par, true, Util.Intranet);
            return data;
        }
        public string ObtenerTelaPorFamilia(string par)
        {
            string data = oMantenimiento.get_Data("uspObtenerTelaPorFamilia", par, true, Util.Intranet);
            return data;
        }
        public string ObtenerTelaPorFamiliaERP(string par)
        {
            string data = oMantenimiento.get_Data("uspPOMarmaxxFamiliaTelasGet", par, true, Util.ERP);
            return data;
        }
        public string SaveStyles()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Rows("uspRegistrarEstiloEDIMarmaxx", _.Post("par"), Util.Intranet, "", "", "");
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SaveStylesERP()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Rows("uspPOMarmaxxStyleSave", _.Post("par"), Util.ERP, "", "", "");
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SaveColor()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Row("uspRegistrarColorEDIMarmaxx", _.Post("Color"), Util.Intranet);
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SaveSize()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Row("uspRegistrarTallaEDIMarmaxx", _.Post("Talla"), Util.Intranet);
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SaveSizeERP()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Row("uspPOMarmaxxTallaSave", _.Post("Talla"), Util.ERP);
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SaveColorERP()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Row("uspPOMarmaxxColorSave", _.Post("Color"), Util.ERP);
            exito = nrows > 0;
            return _.Mensaje("new", exito);
        }
        public string SavePO()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Rows("uspRegistrarPoEDIMarmaxx", _.Post("po"), Util.Intranet, _.Post("lote"), _.Post("tallacolor"), "");
            exito = nrows > 0;
            if (exito)
            {
                nrows = oMantenimiento.save_Row("uspPurchaseOrderActualizarEnviado", _.Post("poedi"), Util.EDI);
            }
            return _.Mensaje("new", exito);
        }
        public string SavePoERP()
        {
            bool exito = false;
            blPo oplPo = new blPo();
            int nrows = oplPo.SavePOMarmaxx(_.Post("Po"), _.Post("PoCliente"), _.Post("PoClienteEstilo"), _.Post("PoClienteEstiloDestino"), _.Post("PoClienteEstiloDestinoTallaColor"), _.GetUsuario().CodUsuario);
            exito = nrows > 0;
            if (exito)
            {
                nrows = oMantenimiento.save_Row("usppurchaseorderactualizarenviado", _.Post("PoEdi"), Util.EDI);
            }
            return _.Mensaje("new", exito);
        }
        public string ObtenerDatosCarga()
        {
            string data = oMantenimiento.get_Data("uspProyectoTelaObtenerDatosCarga", _.GetUsuario().IdUsuario.ToString(), true, Util.ERP);
            return data;
        }
        public string PoMarmaxxFabrica()
        {
            string data = oMantenimiento.get_Data("uspPoMarmaxxFabrica", "", true, Util.Intranet);
            return data;
        }

        public string PoMarmaxxObtener()
        {
            string data = oMantenimiento.get_Data("uspPoMarmaxxObtener", _.Post("par"), true, Util.Intranet);
            return data;
        }
        public string PoMarmaxxBuscar()
        {
            string data = oMantenimiento.get_Data("uspPoMarmaxxBuscar", _.Post("par"), true, Util.Intranet);
            return data;
        }
        public string PoMarmaxxUpdate()
        {
            bool exito = false;
            int nrows = oMantenimiento.save_Rows("uspPoMarmaxxUpdate", _.Post("po"), Util.Intranet, _.Post("lote"), _.Post("lotedetalle"), "");
            exito = nrows > 0;
            return _.Mensaje("edit", exito);
        }
        public string PackingListObtenerFabrica()
        {
            string data = oMantenimiento.get_Data("uspPackingListFabricas", "", true, Util.Intranet);
            return data;
        }

        public string PackingListCambiarFabrica()
        {
            var par = _.Post("par"); //+ "," + _.GetUsuario().IdUsuario.ToString();
            bool exito = false;
            int nrows = oMantenimiento.save_Row("uspPackingListCambiarFabrica", par, Util.Intranet);
            exito = nrows > 0;
            return _.Mensaje("edit", exito);
        }

        public string POFleteObtener()
        {
            string data = oMantenimiento.get_Data("usp_PoFleteObtener", _.Get("season"), true, Util.Intranet);
            return data;
        }
        public string PoFleteTemporadaObtener()
        {
            string data = oMantenimiento.get_Data("usp_PoFleteMarmaxxTemporadaObtener", "", true, Util.Intranet);
            return data;
        }

        public string UpdatePoFlete()
        {

            bool exito = false;
            int nrows = oMantenimiento.save_Rows("usp_PoFleteActualizar", _.Post("Po"), Util.Intranet, "", "", "");
            exito = nrows > 0;
            return _.Mensaje("edit", exito);
        }

        public FileResult Exportar()
        {

            string FileName = _.Get("seasonname") + ".xlsx";
            byte[] bytes = new byte[0];

            try
            {
                DataTable dt = oMantenimiento.get_DataDT("usp_PoFleteObtener", _.Get("season"), Util.Intranet);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        ExcelPackage objExcelPackage = new ExcelPackage();
                        ExcelWorksheet ws = objExcelPackage.Workbook.Worksheets.Add("PO");

                        int Row = 1;
                        ws.Cells[1, 1, 2, 9].Merge = true;
                        ws.Cells[1, 1, 2, 9].Value = "MARMAXX " + _.Get("seasonname") + " - FREIGHT COST";
                        ws.Cells[1, 1, 2, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        ws.Cells[1, 1, 2, 9].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        ws.Cells[1, 1, 2, 9].Style.Font.Bold = true;
                        ws.Cells[1, 1, 2, 9].Style.Font.Size = 16;

                        Row = 3;
                        ws.Cells[Row, 1].Value = "PO";
                        ws.Cells[Row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 1].Style.Font.Bold = true;
                        ws.Cells[Row, 1].AutoFitColumns();
                        ws.Cells[Row, 2].Value = " STYLE#";
                        ws.Cells[Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 2].Style.Font.Bold = true;
                        ws.Cells[Row, 2].AutoFitColumns();
                        ws.Cells[Row, 3].Value = " LOTE";
                        ws.Cells[Row, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 3].Style.Font.Bold = true;
                        ws.Cells[Row, 3].AutoFitColumns();
                        ws.Cells[Row, 4].Value = "FTY";
                        ws.Cells[Row, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 4].Style.Font.Bold = true;
                        ws.Cells[Row, 4].AutoFitColumns();
                        ws.Cells[Row, 5].Value = "UNITS";
                        ws.Cells[Row, 5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 5].Style.Font.Bold = true;
                        ws.Cells[Row, 5].AutoFitColumns();
                        ws.Cells[Row, 6].Value = "SHIPPED";
                        ws.Cells[Row, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 6].Style.Font.Bold = true;
                        ws.Cells[Row, 6].AutoFitColumns();
                        ws.Cells[Row, 7].Value = "FLETE";
                        ws.Cells[Row, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 7].Style.Font.Bold = true;
                        ws.Cells[Row, 7].AutoFitColumns();
                        ws.Cells[Row, 8].Value = "FLETE TOTAL US$ ";
                        ws.Cells[Row, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 8].Style.Font.Bold = true;
                        ws.Cells[Row, 8].AutoFitColumns();
                        ws.Cells[Row, 9].Value = "VIA";
                        ws.Cells[Row, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        ws.Cells[Row, 9].Style.Font.Bold = true;
                        ws.Cells[Row, 9].AutoFitColumns();

                        Row = 4;
                        foreach (DataRow item in dt.Rows)
                        {

                            ws.Cells[Row, 1].Value = item[0].ToString();
                            ws.Cells[Row, 2].Value = item[1].ToString();
                            ws.Cells[Row, 3].Value = item[2].ToString();
                            ws.Cells[Row, 4].Value = item[6].ToString();
                            ws.Cells[Row, 5].Value = Convert.ToInt32(item[3]);
                            ws.Cells[Row, 6].Value = Convert.ToInt32(item[4]);
                            ws.Cells[Row, 7].Value = Convert.ToDecimal(item[7]);
                            ws.Cells[Row, 8].Value = Math.Round((Convert.ToDecimal(item[7].ToString()) * Convert.ToDecimal(item[4].ToString())), 2);
                            ws.Cells[Row, 9].Value = item[5].ToString();
                            Row++;
                        }

                        ws.Cells[1, 1, dt.Rows.Count + 4, 9].AutoFitColumns();
                        bytes = objExcelPackage.GetAsByteArray();

                    }
                }

            }
            catch (Exception)
            {
                FileName = "Empty.xlsx";
            }

            return File(bytes, "application/ms-excel", FileName);
        }

       
        public FileResult DownloadPO(string filename)
        {
            string Path = System.Web.HttpContext.Current.Server.MapPath("~/Content/");
            return File(string.Format(Path + "{0}", filename), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        }
        public string SendASN()
        {
            bool exito = false;
            int IdPackingLsit = int.Parse(_.Post("IdPackingList"));
            int ShipmentGroupId = oEdi.SaveASN(IdPackingLsit);
            exito = ShipmentGroupId > 0;
            if (exito)
            {
                EDI_856 oEDI_856 = new EDI_856();
                string EDIGenerationPath = ConfigurationManager.AppSettings["PathVAN"];//PathVAN
                beEDIFile obeEDIFile = new beEDIFile();
                oEDI_856.BuildASN(ShipmentGroupId, 1, EDIGenerationPath, true, false, out obeEDIFile);

                if (obeEDIFile != null)
                {
                    obeEDIFile.ShipmentGroupID = ShipmentGroupId;
                    obeEDIFile.File_PathASN = System.Web.HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["PathASN"]);
                    exito = oEDI_856.SaveEDI856Data(obeEDIFile);
                    string StatusEDI = "ErrorASN";
                    if (exito) StatusEDI = "Enviado";
                    oMantenimiento.save_Row("uspPackingListStatusEDIActualizar", string.Format("{0},{1}", IdPackingLsit, StatusEDI), Util.Intranet);
                }
            }
            return _.Mensaje("new", exito);
        }

        public string SearchPackingList()
        {
            string data = oMantenimiento.get_Data("uspPackingListASNPendiente", _.Post("par"), true, Util.Intranet);
            return data;
        }






    }
}