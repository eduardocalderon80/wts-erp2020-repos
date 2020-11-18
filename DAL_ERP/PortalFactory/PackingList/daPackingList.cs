using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.PortalFactory;
using BE_ERP.PortalFactory.PackingList;
using BE_ERP.PortalFactory.ServicioPackingList;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace DAL_ERP.PortalFactory.PackingList
{
    public class daPackingList
    {
        //V1.0
        public List<bePackingListDetalle> listaPoDetalles(string nombreBD, string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTES";

            //db.AddParameter("@CODCLIENTE", codCliente);
            //db.AddParameter("@CODFABRICA", codFabrica);
            //db.AddParameter("@COD_DESTINO", codDestino);
            //db.AddParameter("@PO", po);
            //db.AddParameter("@CODEMPRESA", codEmpresa);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);
            //                obePakingDetalle.CantidadRequerida = rdr.GetInt32(5);
            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
            //                obePakingDetalle.CantidadxDespachar = rdr.GetInt32(7);
            //                obePakingDetalle.idPoLotest = rdr.GetInt32(8);      //add
            //                obePakingDetalle.CantidadDespachadas_PkList = rdr.GetInt32(9); //add

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{

            //   // GrabarArchivoLog(ex);
            //}

            return lista;
        }

        //public string Validacion_traerfacturasxPackingList(int idPackingList)
        //{
        //    string facturas = string.Empty;

        //    string sqlStatement = "WS_PACKINGLIST_TIENEFACTURAS";
        //    DatabaseHelper db = new DatabaseHelper(Util.Default);
        //    db.AddParameter("@IDPACKINGLIST", idPackingList);
        //    try
        //    {
        //        facturas = db.ExecuteScalar(sqlStatement, CommandType.StoredProcedure).ToString();
        //    }
        //    catch (Exception ex)
        //    {
        //        GrabarLog(ex);
        //        facturas = string.Empty;
        //    }
        //    return facturas;
        //}

        public int NumeroDeDespachos(SqlConnection con, string codPurOrd, string codCliente, string codEmpresa)
        {
            int NumeroDespachos = 0;
            try
            {
                SqlCommand cmd = new SqlCommand("USP_TRAERNUMERODEDESPACHOPACKINGLIST_EDI", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Cod_purord", codPurOrd);
                cmd.Parameters.AddWithValue("@Cod_Cliente", codCliente);
                cmd.Parameters.AddWithValue("@cod_empresa", codEmpresa);

                NumeroDespachos = (int)cmd.ExecuteScalar();
            }
            catch (Exception ex)
            {
                NumeroDespachos = -1;
                //GrabarArLog(ex);
            }


            //try
            //{
            //    DatabaseHelper db = new DatabaseHelper(Util.Default);
            //    string sqlStatement = "USP_TRAERNUMERODEDESPACHOPACKINGLIST_EDI";
            //    db.AddParameter("@Cod_purord", codPurOrd);
            //    db.AddParameter("@Cod_Cliente", codCliente);
            //    db.AddParameter("@cod_empresa", codEmpresa);
            //    NumeroDespachos = (int)db.ExecuteScalar(sqlStatement, CommandType.StoredProcedure);
            //}
            //catch (Exception ex)
            //{
            //    NumeroDespachos = -1;
            //    GrabarLog(ex);
            //}


            return NumeroDespachos;
        }

        public bePackingListHeader listaPoDetallesSKU(SqlConnection con, string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            bePackingListHeader obePackingListHeader = null;
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            List<bePackingListDetalleSKU> SKU = new List<bePackingListDetalleSKU>();


            bePackingListDetalle obePakingDetalle = null;

            SqlCommand cmd = new SqlCommand("WS_PKLIST_LISTAR_PO_PENDIENTES_CON_SKU", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@CODCLIENTE", codCliente);
            cmd.Parameters.AddWithValue("@CODFABRICA", codFabrica);
            cmd.Parameters.AddWithValue("@COD_DESTINO", codDestino);
            cmd.Parameters.AddWithValue("@PO", po);
            cmd.Parameters.AddWithValue("@CODEMPRESA", codEmpresa);


            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.Default);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    obePackingListHeader = new bePackingListHeader();
                    //ServicioPackingListBoxDetail oServicioPackingListBoxDetail = null;
                    while (oReader.Read())
                    {
                        obePakingDetalle = new bePackingListDetalle();
                        obePakingDetalle.CodPurord = oReader.GetString(0).Trim();
                        obePakingDetalle.CodLotest = oReader.GetString(1).Trim();
                        obePakingDetalle.CodEstilo = oReader.GetString(2).Trim();

                        obePakingDetalle.Tienda = oReader.GetString(3).Trim();
                        obePakingDetalle.Hts = oReader.GetString(4).Trim();
                        obePakingDetalle.CantidadRequerida = oReader.GetInt32(5);
                        obePakingDetalle.CantidadDespachadas = oReader.GetInt32(6);
                        obePakingDetalle.CantidadxDespachar = 0;// rdr.GetInt32(7); EDI by Ricky
                        obePakingDetalle.idPoLotest = oReader.GetInt32(8);      //add
                        obePakingDetalle.CantidadDespachadas_PkList = oReader.GetInt32(9); //add

                        lista.Add(obePakingDetalle);
                    }

                    if (oReader.NextResult())
                    {
                        bePackingListDetalleSKU obePackingListDetalleSKU = null;
                        while (oReader.Read())
                        {
                            obePackingListDetalleSKU = new bePackingListDetalleSKU();
                            obePackingListDetalleSKU.Cod_PurOrd = oReader.GetString(0).Trim();
                            obePackingListDetalleSKU.Cod_EstCli = oReader.GetString(1).Trim();
                            obePackingListDetalleSKU.Cod_LotPurOrd = oReader.GetString(2).Trim();
                            obePackingListDetalleSKU.Cod_ColorCliente = oReader.GetString(3).Trim();
                            obePackingListDetalleSKU.Cod_Talla = oReader.GetString(4).Trim();
                            obePackingListDetalleSKU.Cant_Requerida = oReader.GetInt32(5);
                            SKU.Add(obePackingListDetalleSKU);
                        }
                    }
                }
            }
            if (obePackingListHeader != null)
            {
                foreach (var lote in lista)
                {
                    lote.SKU = SKU.FindAll(x => x.Cod_PurOrd == lote.CodPurord && x.Cod_EstCli == lote.CodEstilo && x.Cod_LotPurOrd == lote.CodLotest);
                }
                obePackingListHeader.Lote = lista;
                obePackingListHeader.SKU = SKU;
            }

            return obePackingListHeader;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTES_CON_SKU";

            //db.AddParameter("@CODCLIENTE", codCliente);
            //db.AddParameter("@CODFABRICA", codFabrica);
            //db.AddParameter("@COD_DESTINO", codDestino);
            //db.AddParameter("@PO", po);
            //db.AddParameter("@CODEMPRESA", codEmpresa);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            obePackingListHeader = new bePackingListHeader();
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);
            //                obePakingDetalle.CantidadRequerida = rdr.GetInt32(5);
            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
            //                obePakingDetalle.CantidadxDespachar = 0;// rdr.GetInt32(7); EDI by Ricky
            //                obePakingDetalle.idPoLotest = rdr.GetInt32(8);      //add
            //                obePakingDetalle.CantidadDespachadas_PkList = rdr.GetInt32(9); //add

            //                lista.Add(obePakingDetalle);
            //            }

            //            if (rdr.NextResult())
            //            {
            //                bePackingListDetalleSKU obePackingListDetalleSKU = null;
            //                while (rdr.Read())
            //                {
            //                    obePackingListDetalleSKU = new bePackingListDetalleSKU();
            //                    obePackingListDetalleSKU.Cod_PurOrd = rdr.GetString(0);
            //                    obePackingListDetalleSKU.Cod_EstCli = rdr.GetString(1);
            //                    obePackingListDetalleSKU.Cod_LotPurOrd = rdr.GetString(2);
            //                    obePackingListDetalleSKU.Cod_ColorCliente = rdr.GetString(3);
            //                    obePackingListDetalleSKU.Cod_Talla = rdr.GetString(4);
            //                    obePackingListDetalleSKU.Cant_Requerida = rdr.GetInt32(5);
            //                    SKU.Add(obePackingListDetalleSKU);
            //                }
            //            }
            //        }
            //    }
            //    if (obePackingListHeader != null)
            //    {
            //        foreach (var lote in lista)
            //        {
            //            lote.SKU = SKU.FindAll(x => x.Cod_PurOrd == lote.CodPurord && x.Cod_EstCli == lote.CodEstilo && x.Cod_LotPurOrd == lote.CodLotest);
            //        }
            //        obePackingListHeader.Lote = lista;
            //        obePackingListHeader.SKU = SKU;
            //    }


            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //    obePackingListHeader = null;
            //}

            //return obePackingListHeader;
        }

        public List<bePackingListDetalle> listaPoDetallesporTienda(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa, string DcNumber)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTES_porTienda";

            //db.AddParameter("@CODCLIENTE", codCliente);
            //db.AddParameter("@CODFABRICA", codFabrica);
            //db.AddParameter("@COD_DESTINO", codDestino);
            //db.AddParameter("@PO", po);
            //db.AddParameter("@CODEMPRESA", codEmpresa);
            //db.AddParameter("@DC_Number", DcNumber);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);
            //                obePakingDetalle.CantidadRequerida = rdr.GetInt32(5);
            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
            //                obePakingDetalle.CantidadxDespachar = rdr.GetInt32(7);
            //                obePakingDetalle.idPoLotest = rdr.GetInt32(8);      //add
            //                obePakingDetalle.CantidadDespachadas_PkList = rdr.GetInt32(9); //add

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            return lista;
        }

        //V2.0
        public List<bePackingListDetalle> listaPoDetallesV2(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTESV2";

            //db.AddParameter("@CODCLIENTE", codCliente);
            //db.AddParameter("@CODFABRICA", codFabrica);
            //db.AddParameter("@COD_DESTINO", codDestino);
            //db.AddParameter("@PO", po);
            //db.AddParameter("@CODEMPRESA", codEmpresa);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);

            //                obePakingDetalle.Color = rdr.GetString(5);
            //                obePakingDetalle.Talla = rdr.GetString(6);

            //                obePakingDetalle.CantidadRequerida = rdr.GetInt32(7);
            //                obePakingDetalle.CantidadDespachadas = 0;
            //                obePakingDetalle.CantidadxDespachar = rdr.GetInt32(7);

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            return lista;
        }

        //V3.0
        public bePackingList listaPoDetallesV3(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {

            bePackingList obePackingList = new bePackingList();
            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //List<bePackingListDetalle> listaDetalles = new List<bePackingListDetalle>();
            //List<bePackingListDetalle> listaDetallesFiltro = new List<bePackingListDetalle>();


            //string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTESV3";

            //db.AddParameter("@CODCLIENTE", codCliente);
            //db.AddParameter("@CODFABRICA", codFabrica);
            //db.AddParameter("@COD_DESTINO", codDestino);
            //db.AddParameter("@PO", po);
            //db.AddParameter("@CODEMPRESA", codEmpresa);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);

            //                listaDetalles.Add(obePakingDetalle);
            //            }

            //            rdr.NextResult();

            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obePakingDetalle = new bePackingListDetalle();
            //                    obePakingDetalle.CodPurord = rdr.GetString(0);
            //                    obePakingDetalle.CodLotest = rdr.GetString(1);
            //                    obePakingDetalle.CodEstilo = rdr.GetString(2);

            //                    obePakingDetalle.Tienda = rdr.GetString(3);
            //                    obePakingDetalle.Hts = rdr.GetString(4);

            //                    obePakingDetalle.Color = rdr.GetString(5);
            //                    obePakingDetalle.Talla = rdr.GetString(6);

            //                    obePakingDetalle.CantidadRequerida = rdr.GetInt32(7);
            //                    obePakingDetalle.CantidadDespachadas = rdr.GetInt32(8);
            //                    obePakingDetalle.CantidadxDespachar = rdr.GetInt32(9);
            //                    obePakingDetalle.idPoLotest = rdr.GetInt32(10);

            //                    listaDetallesFiltro.Add(obePakingDetalle);
            //                }
            //            }

            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //obePackingList.listaPackingListDetalle = listaDetalles;
            //obePackingList.listaPackingListDetalle_Filtro = listaDetallesFiltro;

            return obePackingList;
        }

        public bePackingList traerPackingList_Default(SqlConnection con, string codusuario)
        {
            bePackingList obePackingList = new bePackingList();
            beDestino obeDestino = null;
            obePackingList.listaDestino = new List<beDestino>();

            SqlCommand cmd = new SqlCommand("uspServicioPackingListTraerDestinosxCodUsuario", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@CodUsuario", codusuario);


            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.Default);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    if (oReader.NextResult())
                    {
                        while (oReader.Read())
                        {
                            obeDestino = new beDestino();
                            obeDestino.Cod_Destino = oReader.GetString(0).Trim();
                            obeDestino.Des_Destino = oReader.GetString(1).Trim();

                            obePackingList.listaDestino.Add(obeDestino);
                        }
                    }
                }
            }

            return obePackingList;




            //string Ex = string.Empty;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_TRAERDEFAULT";      //cambiar

            //List<beFabrica> listaFabrica = new List<beFabrica>();
            //List<beDestino> listaDestino = new List<beDestino>();
            //List<beCliente> listaCliente = new List<beCliente>();
            //beFabrica obeFabrica = null;
            //beDestino obeDestino = null;
            //beCliente obeCliente = null;

            //db.AddParameter("@Cod_Empresa", codEmpresa);
            //db.AddParameter("@idperfil", idperfil);
            //db.AddParameter("@idgrupo", idgrupo);
            //db.AddParameter("@codusuario", codusuario);

            //try
            //{
            //    //FABRICA
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {

            //                obeFabrica = new beFabrica();

            //                obeFabrica.Cod_Fabrica = rdr.GetString(0); //Cod_Fabrica
            //                obeFabrica.Nom_Fabrica = rdr.GetString(1);   //Nom_Fabrica

            //                listaFabrica.Add(obeFabrica);
            //            }
            //        }

            //        //DESTINO
            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obeDestino = new beDestino();

            //                    obeDestino.Cod_Destino = rdr.GetString(0);
            //                    obeDestino.Des_Destino = rdr.GetString(1);

            //                    listaDestino.Add(obeDestino);
            //                }
            //            }
            //        }
            //        //CLIENTE
            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obeCliente = new beCliente();
            //                    obeCliente.codigo = rdr.GetString(0);
            //                    obeCliente.nombre = rdr.GetString(1);
            //                    listaCliente.Add(obeCliente);
            //                }
            //            }
            //        }

            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //obePackingList.listaDestino = listaDestino;
            //obePackingList.listaFabrica = listaFabrica;
            //obePackingList.listaCliente = listaCliente;

            return obePackingList;

        }


        public int insertarPackingList(bePackingList objPackingList)
        {
            int iresult = -1;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_Header_INSERTAR";
            //string Ex = string.Empty;

            //DbParameter parIdPackingList = db.Command.CreateParameter();
            //parIdPackingList.ParameterName = "@IdPackingList";
            //parIdPackingList.DbType = DbType.Int32;
            //parIdPackingList.Direction = ParameterDirection.Output;
            //db.AddParameter(parIdPackingList);

            //db.AddParameter("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //db.AddParameter("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //db.AddParameter("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);

            //try
            //{
            //    db.BeginTransaction();

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

            //    //PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTARV2";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);

            //        //db.AddParameter("@COLOR", objDetalle.Color);
            //        //db.AddParameter("@TALLA", objDetalle.Talla);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }


            //    sqlStatement = "WS_LOTEST_ACTUALIZARMONTO";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    iresult = iresult > 0 ? IdPackingList : iresult;
            //    //Fin
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult);
        }

        public int insertarPackingListV2(bePackingList objPackingList)
        {
            int iresult = -1;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_Header_INSERTAR_V2";
            //string Ex = string.Empty;

            //DbParameter parIdPackingList = db.Command.CreateParameter();
            //parIdPackingList.ParameterName = "@IdPackingList";
            //parIdPackingList.DbType = DbType.Int32;
            //parIdPackingList.Direction = ParameterDirection.Output;
            //db.AddParameter(parIdPackingList);

            //db.AddParameter("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //db.AddParameter("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //db.AddParameter("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
            //db.AddParameter("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
            //db.AddParameter("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);        //add
            //db.AddParameter("@TBC_GUIA", objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add

            //try
            //{
            //    db.BeginTransaction();

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

            //    ////PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTAR_V2";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    sqlStatement = "WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2"; //WS_LOTEST_ACTUALIZARMONTO
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        //db.AddParameter("@COLOR", objDetalle.Color);
            //        //db.AddParameter("@TALLA", objDetalle.Talla);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    iresult = iresult > 0 ? IdPackingList : iresult;

            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult);
        }


        public int insertarPackingListV3(bePackingList objPackingList)
        {
            int iresult = -1;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_Header_INSERTAR";
            //string Ex = string.Empty;

            //DbParameter parIdPackingList = db.Command.CreateParameter();
            //parIdPackingList.ParameterName = "@IdPackingList";
            //parIdPackingList.DbType = DbType.Int32;
            //parIdPackingList.Direction = ParameterDirection.Output;
            //db.AddParameter(parIdPackingList);

            //db.AddParameter("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //db.AddParameter("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //db.AddParameter("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
            //db.AddParameter("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);
            //db.AddParameter("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);


            //try
            //{
            //    db.BeginTransaction();

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);  //PACKINGLIST_HEADER
            //    int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

            //    //PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTARV3";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingList_Detalle_FiltroCarrito)
            //    {
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);

            //        db.AddParameter("@COLOR", objDetalle.Color);
            //        db.AddParameter("@TALLA", objDetalle.Talla);
            //        db.AddParameter("@CIERRE", objDetalle.cierre); //add

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);//PACKINGLIST_DETALLE
            //    }


            //    sqlStatement = "WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V3"; //WS_LOTEST_ACTUALIZARMONTO
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingList_Detalle_FiltroCarrito)
            //    {
            //        db.AddParameter("@IDLOTESDETALLE", objDetalle.idPoLotest);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);
            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen); //TG_LOTEST_DETALLE
            //    }

            //    sqlStatement = "WS_LOTEST_ACTUALIZARMONTO_V3"; //WS_LOTEST_ACTUALIZARMONTO  --WS_LOTEST_ACTUALIZARMONTOV2
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingList_Detalle_Carrito) //listaPackingListDetalle
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);  //TG_LOTEST
            //    }


            //    iresult = iresult > 0 ? IdPackingList : iresult;
            //    //Fin
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult);
        }

        public bool insertarPackingListV2_1(bePackingList objPackingList)
        {
            int iresult = -1;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = string.Empty;
            //string Ex = string.Empty;


            //try
            //{
            //    db.BeginTransaction();

            //    //PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTAR_V2";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@IdPackingList", objPackingList.bePackingListEncabezado.IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    sqlStatement = "WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2"; //WS_LOTEST_ACTUALIZARMONTO
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }


            //    //Fin
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult >= 0);
        }

        public int insertarPackingListV2_Carton(SqlConnection con, bePackingList objPackingList)
        {
            int iresult = -1;
            string Ex = string.Empty;
            SqlTransaction trans = con.BeginTransaction();

            try
            {
                SqlCommand cmd = new SqlCommand("WS_PKLIST_Header_INSERTAR_V2", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Transaction = trans;

                SqlParameter parIdPackingList = new SqlParameter();
                parIdPackingList.ParameterName = "@IdPackingList";
                parIdPackingList.Direction = ParameterDirection.Output;
                parIdPackingList.SqlDbType = SqlDbType.Int;
                cmd.Parameters.Add(parIdPackingList);

                cmd.Parameters.AddWithValue("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
                cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                cmd.Parameters.AddWithValue("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                cmd.Parameters.AddWithValue("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
                cmd.Parameters.AddWithValue("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
                cmd.Parameters.AddWithValue("@FEC_GUIA", DateTime.Today.ToString("MM/dd/yyyy")); //objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
                cmd.Parameters.AddWithValue("@NUM_GUIA", "0"); // objPackingList.bePackingListEncabezado.NumeroGuia);        //add
                cmd.Parameters.AddWithValue("@TBC_GUIA", "");// objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add
                //cmd.Parameters.AddWithValue("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
                //cmd.Parameters.AddWithValue("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);        //add
                //cmd.Parameters.AddWithValue("@TBC_GUIA", objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add

                iresult = cmd.ExecuteNonQuery();
                int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

                //PackingList Detalle

                foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
                {
                    cmd = new SqlCommand("WS_PKLIST_Detalles_INSERTAR_V2", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Transaction = trans;

                    cmd.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                    cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                    cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                    cmd.Parameters.AddWithValue("@Cod_Purord", objDetalle.CodPurord);
                    cmd.Parameters.AddWithValue("@Cod_LotPurord", objDetalle.CodLotest);

                    cmd.Parameters.AddWithValue("@Cod_EstCli", objDetalle.CodEstilo);
                    cmd.Parameters.AddWithValue("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                    cmd.Parameters.AddWithValue("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
                    cmd.Parameters.AddWithValue("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
                    cmd.Parameters.AddWithValue("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

                    iresult = cmd.ExecuteNonQuery();
                }


                foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
                {
                    cmd = new SqlCommand("WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2", con);//WS_LOTEST_ACTUALIZARMONTO
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Transaction = trans;

                    cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                    cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                    cmd.Parameters.AddWithValue("@Cod_Purord", objDetalle.CodPurord);
                    cmd.Parameters.AddWithValue("@Cod_LotPurord", objDetalle.CodLotest);

                    cmd.Parameters.AddWithValue("@Cod_EstCli", objDetalle.CodEstilo);
                    cmd.Parameters.AddWithValue("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                    cmd.Parameters.AddWithValue("@Num_PreDes", objDetalle.CantidadxDespachar);
                    cmd.Parameters.AddWithValue("@cierre", objDetalle.cierre);

                    //db.AddParameter("@COLOR", objDetalle.Color);
                    //db.AddParameter("@TALLA", objDetalle.Talla);

                    iresult = cmd.ExecuteNonQuery();
                }

                int IdCarton = 0;


                foreach (var carton in objPackingList.Carton)
                {
                    SqlCommand cmd1 = new SqlCommand("sp_PackingList_Carton_Insertar", con);
                    cmd1.CommandType = CommandType.StoredProcedure;
                    cmd1.Transaction = trans;

                    cmd1.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                    cmd1.Parameters.AddWithValue("@BoxNumber", carton.BoxNumber);
                    cmd1.Parameters.AddWithValue("@BoxCode", carton.BoxCode);

                    SqlParameter parIDCarton = new SqlParameter();
                    parIDCarton.ParameterName = "@@IDENTITY";
                    parIDCarton.Direction = ParameterDirection.ReturnValue;
                    parIDCarton.SqlDbType = SqlDbType.Int;
                    cmd1.Parameters.Add(parIDCarton);

                    iresult = cmd1.ExecuteNonQuery();

                    IdCarton = (int)parIDCarton.Value;
                    foreach (var cartonDetail in carton.Detail)
                    {
                        SqlCommand cmd2 = new SqlCommand("sp_PackingList_Carton_Detail", con);
                        cmd2.CommandType = CommandType.StoredProcedure;
                        cmd2.Transaction = trans;

                        cmd2.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                        cmd2.Parameters.AddWithValue("@IdPackingListCarton", IdCarton);
                        cmd2.Parameters.AddWithValue("@PO", cartonDetail.PO);
                        cmd2.Parameters.AddWithValue("@Style", cartonDetail.Style);
                        cmd2.Parameters.AddWithValue("@BuyerStyle", cartonDetail.BuyerStyle);
                        cmd2.Parameters.AddWithValue("@Lote", cartonDetail.Lote);
                        cmd2.Parameters.AddWithValue("@Descripcion", cartonDetail.Descripcion);
                        cmd2.Parameters.AddWithValue("@Color", cartonDetail.Color);
                        cmd2.Parameters.AddWithValue("@Size", cartonDetail.Size);
                        cmd2.Parameters.AddWithValue("@Qty", cartonDetail.Qty);
                        iresult = cmd2.ExecuteNonQuery();
                    }
                }
                iresult = iresult > 0 ? IdPackingList : iresult;
                trans.Commit();
            }
            catch (Exception ex)
            {
                trans.Rollback();
            }

            return (iresult);

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_Header_INSERTAR_V2";
            //string Ex = string.Empty;

            //DbParameter parIdPackingList = db.Command.CreateParameter();
            //parIdPackingList.ParameterName = "@IdPackingList";
            //parIdPackingList.DbType = DbType.Int32;
            //parIdPackingList.Direction = ParameterDirection.Output;
            //db.AddParameter(parIdPackingList);

            //db.AddParameter("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //db.AddParameter("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //db.AddParameter("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
            //db.AddParameter("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
            //db.AddParameter("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);        //add
            //db.AddParameter("@TBC_GUIA", objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add

            //try
            //{
            //    db.BeginTransaction();

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

            //    //PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTAR_V2";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    sqlStatement = "WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2"; //WS_LOTEST_ACTUALIZARMONTO
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        //db.AddParameter("@COLOR", objDetalle.Color);
            //        //db.AddParameter("@TALLA", objDetalle.Talla);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }




            //    int IdCarton = 0;
            //    foreach (var carton in objPackingList.Carton)
            //    {
            //        sqlStatement = "sp_PackingList_Carton_Insertar";
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@BoxNumber", carton.BoxNumber);
            //        db.AddParameter("@BoxCode", carton.BoxCode);
            //        DbParameter parIDCarton = db.Command.CreateParameter();
            //        parIDCarton.ParameterName = "@@IDENTITY";
            //        parIDCarton.DbType = DbType.Int32;
            //        parIDCarton.Direction = ParameterDirection.ReturnValue;
            //        db.AddParameter(parIDCarton);
            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //        sqlStatement = "sp_PackingList_Carton_Detail";
            //        IdCarton = (int)parIDCarton.Value;
            //        foreach (var cartonDetail in carton.Detail)
            //        {
            //            db.AddParameter("@IdPackingList", IdPackingList);
            //            db.AddParameter("@IdPackingListCarton", IdCarton);
            //            db.AddParameter("@PO", cartonDetail.PO);
            //            db.AddParameter("@Style", cartonDetail.Style);
            //            db.AddParameter("@BuyerStyle", cartonDetail.BuyerStyle);
            //            db.AddParameter("@Lote", cartonDetail.Lote);
            //            db.AddParameter("@Descripcion", cartonDetail.Descripcion);
            //            db.AddParameter("@Color", cartonDetail.Color);
            //            db.AddParameter("@Size", cartonDetail.Size);
            //            db.AddParameter("@Qty", cartonDetail.Qty);
            //            iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //        }
            //    }
            //    iresult = iresult > 0 ? IdPackingList : iresult;
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            //return (iresult);
        }

        public int insertarPackingListV2_Carton_ServicioPackingList(SqlConnection con, bePackingList objPackingList)
        {
            int iresult = -1;
            string Ex = string.Empty;
            SqlTransaction trans = con.BeginTransaction();

            try
            {
                SqlCommand cmd = new SqlCommand("WS_PKLIST_Header_INSERTAR_V2_ServicioPackingList", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Transaction = trans;

                SqlParameter parIdPackingList = new SqlParameter();
                parIdPackingList.ParameterName = "@IdPackingList";
                parIdPackingList.Direction = ParameterDirection.Output;
                parIdPackingList.SqlDbType = SqlDbType.Int;
                cmd.Parameters.Add(parIdPackingList);

                cmd.Parameters.AddWithValue("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
                cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                cmd.Parameters.AddWithValue("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                cmd.Parameters.AddWithValue("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
                cmd.Parameters.AddWithValue("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
                cmd.Parameters.AddWithValue("@FEC_GUIA", DateTime.Today.ToString("MM/dd/yyyy")); //objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
                cmd.Parameters.AddWithValue("@NUM_GUIA", "0"); // objPackingList.bePackingListEncabezado.NumeroGuia);        //add
                cmd.Parameters.AddWithValue("@TBC_GUIA", "");// objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add
                //cmd.Parameters.AddWithValue("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
                //cmd.Parameters.AddWithValue("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);        //add
                //cmd.Parameters.AddWithValue("@TBC_GUIA", objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add
                cmd.Parameters.AddWithValue("@NumeroPackingList", objPackingList.bePackingListEncabezado.NumPackingList);

                iresult = cmd.ExecuteNonQuery();
                int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

                //PackingList Detalle

                foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
                {
                    cmd = new SqlCommand("WS_PKLIST_Detalles_INSERTAR_V2", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Transaction = trans;

                    cmd.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                    cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                    cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                    cmd.Parameters.AddWithValue("@Cod_Purord", objDetalle.CodPurord);
                    cmd.Parameters.AddWithValue("@Cod_LotPurord", objDetalle.CodLotest);

                    cmd.Parameters.AddWithValue("@Cod_EstCli", objDetalle.CodEstilo);
                    cmd.Parameters.AddWithValue("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                    cmd.Parameters.AddWithValue("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
                    cmd.Parameters.AddWithValue("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
                    cmd.Parameters.AddWithValue("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

                    iresult = cmd.ExecuteNonQuery();
                }


                foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
                {
                    cmd = new SqlCommand("WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2_ServicioPackingList", con);//WS_LOTEST_ACTUALIZARMONTO
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Transaction = trans;

                    cmd.Parameters.AddWithValue("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
                    cmd.Parameters.AddWithValue("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
                    cmd.Parameters.AddWithValue("@Cod_Purord", objDetalle.CodPurord);
                    cmd.Parameters.AddWithValue("@Cod_LotPurord", objDetalle.CodLotest);

                    cmd.Parameters.AddWithValue("@Cod_EstCli", objDetalle.CodEstilo);
                    cmd.Parameters.AddWithValue("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
                    cmd.Parameters.AddWithValue("@Num_PreDes", objDetalle.CantidadxDespachar);
                    cmd.Parameters.AddWithValue("@cierre", objDetalle.cierre);                    
                    cmd.Parameters.AddWithValue("@NumeroPackingList", objPackingList.bePackingListEncabezado.NumPackingList);
                    cmd.Parameters.AddWithValue("@MasDespachos", objPackingList.bePackingListEncabezado.MasDespachos);
                    //db.AddParameter("@COLOR", objDetalle.Color);
                    //db.AddParameter("@TALLA", objDetalle.Talla);

                    iresult = cmd.ExecuteNonQuery();
                }

                int IdCarton = 0;


                foreach (var carton in objPackingList.Carton)
                {
                    SqlCommand cmd1 = new SqlCommand("sp_PackingList_Carton_Insertar", con);
                    cmd1.CommandType = CommandType.StoredProcedure;
                    cmd1.Transaction = trans;

                    cmd1.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                    cmd1.Parameters.AddWithValue("@BoxNumber", carton.BoxNumber);
                    cmd1.Parameters.AddWithValue("@BoxCode", carton.BoxCode);

                    SqlParameter parIDCarton = new SqlParameter();
                    parIDCarton.ParameterName = "@@IDENTITY";
                    parIDCarton.Direction = ParameterDirection.ReturnValue;
                    parIDCarton.SqlDbType = SqlDbType.Int;
                    cmd1.Parameters.Add(parIDCarton);

                    iresult = cmd1.ExecuteNonQuery();

                    IdCarton = (int)parIDCarton.Value;
                    foreach (var cartonDetail in carton.Detail)
                    {
                        SqlCommand cmd2 = new SqlCommand("sp_PackingList_Carton_Detail", con);
                        cmd2.CommandType = CommandType.StoredProcedure;
                        cmd2.Transaction = trans;

                        cmd2.Parameters.AddWithValue("@IdPackingList", IdPackingList);
                        cmd2.Parameters.AddWithValue("@IdPackingListCarton", IdCarton);
                        cmd2.Parameters.AddWithValue("@PO", cartonDetail.PO);
                        cmd2.Parameters.AddWithValue("@Style", cartonDetail.Style);
                        cmd2.Parameters.AddWithValue("@BuyerStyle", cartonDetail.BuyerStyle);
                        cmd2.Parameters.AddWithValue("@Lote", cartonDetail.Lote);
                        cmd2.Parameters.AddWithValue("@Descripcion", cartonDetail.Descripcion);
                        cmd2.Parameters.AddWithValue("@Color", cartonDetail.Color);
                        cmd2.Parameters.AddWithValue("@Size", cartonDetail.Size);
                        cmd2.Parameters.AddWithValue("@Qty", cartonDetail.Qty);
                        iresult = cmd2.ExecuteNonQuery();
                    }
                }
                iresult = iresult > 0 ? IdPackingList : iresult;
                trans.Commit();
            }
            catch (Exception ex)
            {
                trans.Rollback();
            }

            return (iresult);

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_Header_INSERTAR_V2";
            //string Ex = string.Empty;

            //DbParameter parIdPackingList = db.Command.CreateParameter();
            //parIdPackingList.ParameterName = "@IdPackingList";
            //parIdPackingList.DbType = DbType.Int32;
            //parIdPackingList.Direction = ParameterDirection.Output;
            //db.AddParameter(parIdPackingList);

            //db.AddParameter("@NumPackingList", objPackingList.bePackingListEncabezado.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //db.AddParameter("@Cod_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //db.AddParameter("@Fec_Despacho", objPackingList.bePackingListEncabezado.FechaDespacho);
            //db.AddParameter("@FEC_GUIA", objPackingList.bePackingListEncabezado.Fecha_BL_HAWBL);    //add
            //db.AddParameter("@NUM_GUIA", objPackingList.bePackingListEncabezado.NumeroGuia);        //add
            //db.AddParameter("@TBC_GUIA", objPackingList.bePackingListEncabezado.TBC_BL_HAWBL);        //add

            //try
            //{
            //    db.BeginTransaction();

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    int IdPackingList = Convert.ToInt32(parIdPackingList.Value);

            //    //PackingList Detalle
            //    sqlStatement = "WS_PKLIST_Detalles_INSERTAR_V2";
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //        db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@CIERRE", objDetalle.cierre);                              //add (x ver ya no debería de ir)

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }

            //    sqlStatement = "WS_LOTEST_DETALLE_ACTUALIZAR_CANTIDAD_Y_CIERRE_V2"; //WS_LOTEST_ACTUALIZARMONTO
            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {
            //        db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //        db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //        db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //        db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //        db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //        db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //        db.AddParameter("@Num_PreDes", objDetalle.CantidadxDespachar);
            //        db.AddParameter("@cierre", objDetalle.cierre);

            //        //db.AddParameter("@COLOR", objDetalle.Color);
            //        //db.AddParameter("@TALLA", objDetalle.Talla);

            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    }




            //    int IdCarton = 0;
            //    foreach (var carton in objPackingList.Carton)
            //    {
            //        sqlStatement = "sp_PackingList_Carton_Insertar";
            //        db.AddParameter("@IdPackingList", IdPackingList);
            //        db.AddParameter("@BoxNumber", carton.BoxNumber);
            //        db.AddParameter("@BoxCode", carton.BoxCode);
            //        DbParameter parIDCarton = db.Command.CreateParameter();
            //        parIDCarton.ParameterName = "@@IDENTITY";
            //        parIDCarton.DbType = DbType.Int32;
            //        parIDCarton.Direction = ParameterDirection.ReturnValue;
            //        db.AddParameter(parIDCarton);
            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //        sqlStatement = "sp_PackingList_Carton_Detail";
            //        IdCarton = (int)parIDCarton.Value;
            //        foreach (var cartonDetail in carton.Detail)
            //        {
            //            db.AddParameter("@IdPackingList", IdPackingList);
            //            db.AddParameter("@IdPackingListCarton", IdCarton);
            //            db.AddParameter("@PO", cartonDetail.PO);
            //            db.AddParameter("@Style", cartonDetail.Style);
            //            db.AddParameter("@BuyerStyle", cartonDetail.BuyerStyle);
            //            db.AddParameter("@Lote", cartonDetail.Lote);
            //            db.AddParameter("@Descripcion", cartonDetail.Descripcion);
            //            db.AddParameter("@Color", cartonDetail.Color);
            //            db.AddParameter("@Size", cartonDetail.Size);
            //            db.AddParameter("@Qty", cartonDetail.Qty);
            //            iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //        }
            //    }
            //    iresult = iresult > 0 ? IdPackingList : iresult;
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            //return (iresult);
        }

        public List<bePackingListDetalle> listaPackingList(SqlConnection con, bePackingListHeader obePackingListHeader)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            bePackingListDetalle obePakingDetalle = null;

            SqlCommand cmd = new SqlCommand("WS_PKLISTDETALLES_XID", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdPackingList", obePackingListHeader.IdPackingList);
            cmd.Parameters.AddWithValue("@NumPackingList", obePackingListHeader.NumeroPackingList);
            cmd.Parameters.AddWithValue("@Cod_Cliente", obePackingListHeader.Cod_Cliente);
            cmd.Parameters.AddWithValue("@Cod_fabrica", obePackingListHeader.Cod_fabrica);
            cmd.Parameters.AddWithValue("@Cod_Empresa", obePackingListHeader.Cod_Empresa);

            cmd.Parameters.AddWithValue("@Cod_Destino", obePackingListHeader.Cod_Destino);
            cmd.Parameters.AddWithValue("@Fec_DespachoINI", obePackingListHeader.FechaIni);
            cmd.Parameters.AddWithValue("@Fec_DespachoFIN", obePackingListHeader.FechaFin);
            cmd.Parameters.AddWithValue("@edi", obePackingListHeader.tienedi);

            try
            {
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            obePakingDetalle = new bePackingListDetalle();
                            obePakingDetalle.IdPackingList = rdr.GetInt32(0);
                            obePakingDetalle.NumeroPackingList = rdr.GetString(1);
                            obePakingDetalle.Nom_Fabrica = rdr.GetString(2);
                            obePakingDetalle.Nom_Cliente = rdr.GetString(3);
                            obePakingDetalle.CodigoDestino = rdr.GetString(4);

                            obePakingDetalle.FechaDespacho = rdr.GetString(5);
                            obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);

                            obePakingDetalle.NumeroGuia = rdr.GetString(7);
                            obePakingDetalle.Fecha_BL_HAWBL = rdr.GetString(8);
                            obePakingDetalle.edi = rdr.GetString(9);

                            lista.Add(obePakingDetalle);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //GrabarLog(ex);
            }

            return lista;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PKLIST_BUSQUEDA";

            //db.AddParameter("@IdPackingList", obePackingListHeader.IdPackingList);
            //db.AddParameter("@NumPackingList", obePackingListHeader.NumeroPackingList);
            //db.AddParameter("@Cod_Cliente", obePackingListHeader.Cod_Cliente);
            //db.AddParameter("@Cod_fabrica", obePackingListHeader.Cod_fabrica);
            //db.AddParameter("@Cod_Empresa", obePackingListHeader.Cod_Empresa);

            //db.AddParameter("@Cod_Destino", obePackingListHeader.Cod_Destino);
            //db.AddParameter("@Fec_DespachoINI", obePackingListHeader.FechaIni);
            //db.AddParameter("@Fec_DespachoFIN", obePackingListHeader.FechaFin);
            //db.AddParameter("@edi", obePackingListHeader.tienedi);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.IdPackingList = rdr.GetInt32(0);
            //                obePakingDetalle.NumeroPackingList = rdr.GetString(1);
            //                obePakingDetalle.Nom_Fabrica = rdr.GetString(2);
            //                obePakingDetalle.Nom_Cliente = rdr.GetString(3);
            //                obePakingDetalle.CodigoDestino = rdr.GetString(4);

            //                obePakingDetalle.FechaDespacho = rdr.GetString(5);
            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);

            //                obePakingDetalle.NumeroGuia = rdr.GetString(7);
            //                obePakingDetalle.Fecha_BL_HAWBL = rdr.GetString(8);
            //                obePakingDetalle.edi = rdr.GetString(9);

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //return lista;
        }

        public List<beCarton> PackingList_Carton_GET(SqlConnection con, int IdPackingList)
        {
            List<beCarton> Carton = new List<beCarton>();
            List<beCartonDetail> CartonDetail = new List<beCartonDetail>();
            SqlCommand cmd = new SqlCommand("sp_PackingList_Carton_GET", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdPackingList", IdPackingList);

            try
            {
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.HasRows)
                    {
                        beCarton obeCarton = null;
                        while (rdr.Read())
                        {
                            obeCarton = new beCarton();
                            obeCarton.IdPackingListCarton = rdr.GetInt32(0);
                            obeCarton.BoxNumber = rdr.GetInt32(1);
                            obeCarton.BoxCode = rdr.GetString(2);
                            Carton.Add(obeCarton);
                        }
                        if (rdr.NextResult())
                        {
                            beCartonDetail obeCartonDetail = null;
                            while (rdr.Read())
                            {
                                obeCartonDetail = new beCartonDetail();
                                obeCartonDetail.IdPackingListCarton = rdr.GetInt32(0);
                                obeCartonDetail.IdPackingListCartonDetail = rdr.GetInt32(1);
                                obeCartonDetail.PO = rdr.GetString(2);
                                obeCartonDetail.Style = rdr.GetString(3);
                                obeCartonDetail.BuyerStyle = rdr.GetString(4);
                                obeCartonDetail.Lote = rdr.GetString(5);
                                obeCartonDetail.Descripcion = rdr.GetString(6);
                                obeCartonDetail.Color = rdr.GetString(7);
                                obeCartonDetail.Size = rdr.GetString(8);
                                obeCartonDetail.Qty = rdr.GetInt32(9);
                                CartonDetail.Add(obeCartonDetail);
                            }
                        }
                    }
                }
                if (Carton.Count > 0 && CartonDetail.Count > 0)
                {
                    foreach (var carton in Carton)
                    {
                        carton.Detail = new List<beCartonDetail>();
                        carton.Detail.AddRange(CartonDetail.FindAll(x => x.IdPackingListCarton == carton.IdPackingListCarton));
                    }
                }
            }
            catch (Exception ex)
            {
                //GrabarLog(ex);
            }
            return Carton;

            //DatabaseHelper db = new DatabaseHelper(Util.Default);

            //List<beCartonDetail> CartonDetail = new List<beCartonDetail>();
            //string sqlStatement = "sp_PackingList_Carton_GET";
            //db.AddParameter("@IdPackingList", IdPackingList);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            beCarton obeCarton = null;
            //            while (rdr.Read())
            //            {
            //                obeCarton = new beCarton();
            //                obeCarton.IdPackingListCarton = rdr.GetInt32(0);
            //                obeCarton.BoxNumber = rdr.GetInt32(1);
            //                obeCarton.BoxCode = rdr.GetString(2);
            //                Carton.Add(obeCarton);
            //            }
            //            if (rdr.NextResult())
            //            {

            //                beCartonDetail obeCartonDetail = null;
            //                while (rdr.Read())
            //                {
            //                    obeCartonDetail = new beCartonDetail();
            //                    obeCartonDetail.IdPackingListCarton = rdr.GetInt32(0);
            //                    obeCartonDetail.IdPackingListCartonDetail = rdr.GetInt32(1);
            //                    obeCartonDetail.PO = rdr.GetString(2);
            //                    obeCartonDetail.Style = rdr.GetString(3);
            //                    obeCartonDetail.BuyerStyle = rdr.GetString(4);
            //                    obeCartonDetail.Lote = rdr.GetString(5);
            //                    obeCartonDetail.Descripcion = rdr.GetString(6);
            //                    obeCartonDetail.Color = rdr.GetString(7);
            //                    obeCartonDetail.Size = rdr.GetString(8);
            //                    obeCartonDetail.Qty = rdr.GetInt32(9);
            //                    CartonDetail.Add(obeCartonDetail);
            //                }
            //            }
            //        }
            //    }
            //    if (Carton.Count > 0 && CartonDetail.Count > 0)
            //    {
            //        foreach (var carton in Carton)
            //        {
            //            carton.Detail = new List<beCartonDetail>();
            //            carton.Detail.AddRange(CartonDetail.FindAll(x => x.IdPackingListCarton == carton.IdPackingListCarton));
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //return Carton;
        }

        public List<bePackingListDetalle> listaPackingListxID(SqlConnection con, int idPackingList)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            bePackingListDetalle obePakingDetalle = null;
            SqlCommand cmd = new SqlCommand("WS_PKLIST_BUSQUEDAxID", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdPackingList", idPackingList);
            try
            {
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            obePakingDetalle = new bePackingListDetalle();
                            obePakingDetalle.IdPackingList = rdr.GetInt32(0);
                            obePakingDetalle.NumeroPackingList = rdr.GetString(1);
                            obePakingDetalle.Nom_Fabrica = rdr.GetString(2);
                            obePakingDetalle.Nom_Cliente = rdr.GetString(3);
                            obePakingDetalle.CodigoDestino = rdr.GetString(4);

                            obePakingDetalle.FechaDespacho = rdr.GetString(5);
                            obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
                            obePakingDetalle.edi = rdr.GetString(7);
                            lista.Add(obePakingDetalle);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //GrabarLog(ex);
            }
            return lista;


            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PKLIST_BUSQUEDAxID";

            //db.AddParameter("@IdPackingList", idPackingList);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.IdPackingList = rdr.GetInt32(0);
            //                obePakingDetalle.NumeroPackingList = rdr.GetString(1);
            //                obePakingDetalle.Nom_Fabrica = rdr.GetString(2);
            //                obePakingDetalle.Nom_Cliente = rdr.GetString(3);
            //                obePakingDetalle.CodigoDestino = rdr.GetString(4);

            //                obePakingDetalle.FechaDespacho = rdr.GetString(5);
            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
            //                obePakingDetalle.edi = rdr.GetString(7);
            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //return lista;
        }

        public bePackingList traerPackingList_xId(string codEmpresa, string codUsuario, int idPackingList)
        {
            bePackingList obePackingList = new bePackingList();
            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLIST_TRAERXIDv2";

            //List<beFabrica> listaFabrica = new List<beFabrica>();
            //List<beDestino> listaDestino = new List<beDestino>();
            //List<beCliente> listaCliente = new List<beCliente>();
            //beFabrica obeFabrica = null;
            //beDestino obeDestino = null;
            //beCliente obeCliente = null;
            //bePackingListDetalle obePackingListDetalle = null;
            //bePackingListHeader obePackingListHeader = new bePackingListHeader();
            //List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();

            //db.AddParameter("@IDPACKINGLIST", idPackingList);
            //db.AddParameter("@Cod_Empresa", codEmpresa);
            //db.AddParameter("@Cod_Usuario", codUsuario);

            //try
            //{
            //    //FABRICA
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {

            //                obeFabrica = new beFabrica();

            //                obeFabrica.Cod_Fabrica = rdr.GetString(0); //Cod_Fabrica
            //                obeFabrica.Nom_Fabrica = rdr.GetString(1);   //Nom_Fabrica

            //                listaFabrica.Add(obeFabrica);
            //            }
            //        }

            //        //DESTINO
            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obeDestino = new beDestino();

            //                    obeDestino.Cod_Destino = rdr.GetString(0);
            //                    obeDestino.Des_Destino = rdr.GetString(1);

            //                    listaDestino.Add(obeDestino);
            //                }
            //            }
            //        }
            //        //CLIENTE
            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obeCliente = new beCliente();
            //                    obeCliente.codigo = rdr.GetString(0);
            //                    obeCliente.nombre = rdr.GetString(1);
            //                    listaCliente.Add(obeCliente);
            //                }
            //            }
            //        }

            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                if (rdr.Read())
            //                {
            //                    //HEADER
            //                    obePackingListHeader.IdPackingList = rdr.GetInt32(0);
            //                    obePackingListHeader.NumeroPackingList = rdr.GetString(1);
            //                    obePackingListHeader.Cod_Cliente = rdr.GetString(2);
            //                    obePackingListHeader.Cod_fabrica = rdr.GetString(3);
            //                    obePackingListHeader.Cod_Destino = rdr.GetString(4);
            //                    obePackingListHeader.FechaDespacho = rdr.GetString(5);

            //                    obePackingListHeader.NumeroGuia = rdr.GetString(6);
            //                    obePackingListHeader.Fecha_BL_HAWBL = rdr.GetString(7);

            //                }
            //            }
            //        }
            //        //DETAILS
            //        if (rdr.NextResult())
            //        {
            //            if (rdr.HasRows)
            //            {
            //                while (rdr.Read())
            //                {
            //                    obePackingListDetalle = new bePackingListDetalle();
            //                    obePackingListDetalle.CodPurord = rdr.GetString(0);
            //                    obePackingListDetalle.CodLotest = rdr.GetString(1);
            //                    obePackingListDetalle.CodEstilo = rdr.GetString(2);

            //                    obePackingListDetalle.Tienda = rdr.GetString(3);
            //                    obePackingListDetalle.Hts = rdr.GetString(4);
            //                    obePackingListDetalle.CantidadDespachadas = rdr.GetInt32(5);
            //                    obePackingListDetalle.CantidadxDespachar = rdr.GetInt32(5);

            //                    obePackingListDetalle.Color = rdr.GetString(6);    //Add
            //                    obePackingListDetalle.Talla = rdr.GetString(7);        //Add
            //                    obePackingListDetalle.IdPackingListDetalle = rdr.GetInt32(8); //Add

            //                    listaPackingListDetalle.Add(obePackingListDetalle);
            //                }
            //            }
            //        }

            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            //obePackingList.listaDestino = listaDestino;
            //obePackingList.listaFabrica = listaFabrica;
            //obePackingList.listaCliente = listaCliente;
            //obePackingList.bePackingListEncabezado = obePackingListHeader;
            //obePackingList.listaPackingListDetalle = listaPackingListDetalle;

            return obePackingList;

        }

        //nueva
        public List<bePackingListDetalle> traer_PackingListxId(SqlConnection con, int idPackingList)
        {
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();
            bePackingListDetalle obePackingListDetalle = null;

            SqlCommand cmd = new SqlCommand("WS_PKLISTDETALLES_XID", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IDPACKINGLIST", idPackingList);

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        obePackingListDetalle = new bePackingListDetalle();
                        obePackingListDetalle.CodPurord = oReader.GetString(0);
                        obePackingListDetalle.CodLotest = oReader.GetString(1);
                        obePackingListDetalle.CodEstilo = oReader.GetString(2);

                        obePackingListDetalle.Tienda = oReader.GetString(3);
                        obePackingListDetalle.Hts = oReader.GetString(4);
                        obePackingListDetalle.CantidadDespachadas = oReader.GetInt32(5);
                        obePackingListDetalle.CantidadxDespachar = oReader.GetInt32(5);

                        obePackingListDetalle.Color = oReader.GetString(6);    //Add
                        obePackingListDetalle.Talla = oReader.GetString(7);        //Add
                        obePackingListDetalle.IdPackingListDetalle = oReader.GetInt32(8); //Add

                        listaPackingListDetalle.Add(obePackingListDetalle);
                    }
                }
            }



            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = "WS_PKLISTDETALLES_XID";

            //bePackingListDetalle obePackingListDetalle = null;


            //db.AddParameter("@IDPACKINGLIST", idPackingList);

            //try
            //{
            //    //FABRICA
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {

            //        //DETAILS

            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePackingListDetalle = new bePackingListDetalle();
            //                obePackingListDetalle.CodPurord = rdr.GetString(0);
            //                obePackingListDetalle.CodLotest = rdr.GetString(1);
            //                obePackingListDetalle.CodEstilo = rdr.GetString(2);

            //                obePackingListDetalle.Tienda = rdr.GetString(3);
            //                obePackingListDetalle.Hts = rdr.GetString(4);
            //                obePackingListDetalle.CantidadDespachadas = rdr.GetInt32(5);
            //                obePackingListDetalle.CantidadxDespachar = rdr.GetInt32(5);

            //                obePackingListDetalle.Color = rdr.GetString(6);    //Add
            //                obePackingListDetalle.Talla = rdr.GetString(7);        //Add
            //                obePackingListDetalle.IdPackingListDetalle = rdr.GetInt32(8); //Add

            //                listaPackingListDetalle.Add(obePackingListDetalle);
            //            }
            //        }


            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}

            return listaPackingListDetalle;
        }
        public ServicioPackingList traer_PackingListCartonxId(SqlConnection con, int idPackingList)
        {
            //la conexion debe ser a WTS
            ServicioPackingList oServicioPackingList = new ServicioPackingList();
            ServicioPackingListBoxDetail oServicioPackingListBoxDetail = null;

            SqlCommand cmd = new SqlCommand("uspServicioPackingListConsultarDetalle", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdServicioPackingList", idPackingList);

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {

                    oServicioPackingList.BoxDetail = new List<ServicioPackingListBoxDetail>();
                    //ServicioPackingListBoxDetail oServicioPackingListBoxDetail = null;
                    while (oReader.Read())
                    {
                        oServicioPackingListBoxDetail = new ServicioPackingListBoxDetail();
                        oServicioPackingListBoxDetail.BoxNumber = oReader.GetInt32(0);
                        oServicioPackingListBoxDetail.CPOrder = oReader.GetString(1);
                        oServicioPackingListBoxDetail.Style = oReader.GetString(2);
                        oServicioPackingListBoxDetail.Color = oReader.GetString(3);
                        oServicioPackingListBoxDetail.Size = oReader.GetString(4);
                        oServicioPackingListBoxDetail.Qty = oReader.GetInt32(5);
                        oServicioPackingListBoxDetail.TotalPCS = oReader.GetInt32(6);
                        oServicioPackingListBoxDetail.NetWeight = oReader.GetDecimal(7);
                        oServicioPackingListBoxDetail.GrossWeight = oReader.GetDecimal(8);
                        oServicioPackingListBoxDetail.Descripcion = oReader.GetString(9);
                        oServicioPackingListBoxDetail.TotalBoxes = oReader.GetInt32(10);
                        oServicioPackingListBoxDetail.StoreNumber = oReader.GetString(11);
                        oServicioPackingListBoxDetail.OrdenSize = oReader.GetInt32(12);
                        oServicioPackingListBoxDetail.PO = oReader.GetString(13);
                        oServicioPackingListBoxDetail.NumeroPackingList = oReader.GetString(14);
                        oServicioPackingList.BoxDetail.Add(oServicioPackingListBoxDetail);
                    }
                }
            }
            return oServicioPackingList;
        }
        public bool editarPackingList(bePackingList objPackingList)
        {
            int iresult = -1;
            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = string.Empty;


            //try
            //{
            //    db.BeginTransaction();


            //    // :desactivado :17
            //    //EDITAR EN TG_LOTEST
            //    //sqlStatement = "WS_LOTEST_QDESPACHADAS_EDITAR";
            //    //foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle) //Add Filtro
            //    //{
            //    //    db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //    //    db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //    //    db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //    //    db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //    //    db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //    //    db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //    //    db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //    //    db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //    //    db.AddParameter("@IDPK", objPackingList.bePackingListEncabezado.IdPackingList);
            //    //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    //}

            //    sqlStatement = "WS_PKLIST_Detalles_EDITAR";

            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {

            //        if (objDetalle.CantidadxDespachar > 0)
            //        {
            //            db.AddParameter("@IdPackingList", objPackingList.bePackingListEncabezado.IdPackingList);
            //            db.AddParameter("@IdPackingListDetalle", objDetalle.IdPackingListDetalle);
            //            db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //            //db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //            //db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //            //db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //            //db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);
            //            //db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //            //db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //            //db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //            //db.AddParameter("@color", objDetalle.Color);
            //            //db.AddParameter("@talla", objDetalle.Talla);
            //            iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //        }
            //    }

            //    //sqlStatement = "WS_PKLIST_DETALLES_DELETE";

            //    //foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    //{

            //    //    if (objDetalle.CantidadxDespachar == 0)
            //    //    {
            //    //        db.AddParameter("@IdPackingList", objPackingList.bePackingListEncabezado.IdPackingList);
            //    //        db.AddParameter("@IdPackingListDetalle", objDetalle.IdPackingListDetalle);
            //    //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    //    }
            //    //}



            //    //Fin
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult > 0);
        }
        public bool eliminarPackingList_x_Po(bePackingList objPackingList)
        {
            int iresult = -1;
            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = string.Empty;


            //try
            //{
            //    db.BeginTransaction();

            //    // :desactivado 17
            //    //EDITAR EN TG_LOTEST
            //    //sqlStatement = "WS_LOTEST_QDESPACHADAS_EDITAR_DELETE"; // :NUEVO 04/03/2015
            //    //foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle) //Add Filtro
            //    //{
            //    //    db.AddParameter("@Cod_Empresa", objPackingList.bePackingListEncabezado.Cod_Empresa);
            //    //    db.AddParameter("@Cod_Cliente", objPackingList.bePackingListEncabezado.Cod_Cliente);
            //    //    db.AddParameter("@Cod_Purord", objDetalle.CodPurord);
            //    //    db.AddParameter("@Cod_LotPurord", objDetalle.CodLotest);

            //    //    db.AddParameter("@Cod_EstCli", objDetalle.CodEstilo);
            //    //    db.AddParameter("@Cod_Fabrica", objPackingList.bePackingListEncabezado.Cod_fabrica);
            //    //    db.AddParameter("@Codigo_Destino", objPackingList.bePackingListEncabezado.Cod_Destino);
            //    //    db.AddParameter("@Cantidad_Despachada", objDetalle.CantidadxDespachar);
            //    //    db.AddParameter("@IDPK", objPackingList.bePackingListEncabezado.IdPackingList);
            //    //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);
            //    //}

            //    sqlStatement = "WS_PKLIST_DETALLES_DELETE";

            //    foreach (bePackingListDetalle objDetalle in objPackingList.listaPackingListDetalle)
            //    {

            //        db.AddParameter("@IdPackingList", objPackingList.bePackingListEncabezado.IdPackingList);
            //        db.AddParameter("@IdPackingListDetalle", objDetalle.IdPackingListDetalle);
            //        iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure, ConnectionState.KeepOpen);

            //    }

            //    //Fin
            //    db.CommitTransaction();
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //    db.RollbackTransaction();
            //}

            return (iresult > 0);
        }
        public bool editarPackingList_NumeroFechaGuia(int idPackingList, string fechaGuia, string numeroGuia)
        {
            int iresult = -1;
            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //string sqlStatement = string.Empty;

            //sqlStatement = "WS_PACKINLIST_HEADER_ACTUALIZAR_FECHA_NUMERO";

            //try
            //{
            //    db.AddParameter("@IDPACKINGLIST", idPackingList);
            //    db.AddParameter("@FECHA_GUIA", fechaGuia);
            //    db.AddParameter("@NUMERO_GUIA", numeroGuia);

            //    iresult = db.ExecuteNonQuery(sqlStatement, CommandType.StoredProcedure);
            //}
            //catch (Exception ex)
            //{
            //    iresult = -1;
            //    GrabarLog(ex);
            //}

            return (iresult >= 0);
        }
        public List<bePackingListDetalle> Reporte_PackingList_EncabezadoxId(SqlConnection con, int idPackingList)
        {
            //List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();
            bePackingListDetalle obePackingListDetalle = null;

            SqlCommand cmd = new SqlCommand("WS_PACKINGLIST_REPORTE_ENCABEZADOXID", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdPackingList", idPackingList);

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        obePackingListDetalle = new bePackingListDetalle();
                        obePackingListDetalle.IdPackingList = oReader.GetInt32(0);
                        obePackingListDetalle.NumeroPackingList = oReader.GetString(1);
                        obePackingListDetalle.Nom_Fabrica = oReader.GetString(2);
                        obePackingListDetalle.Nom_Cliente = oReader.GetString(3);
                        obePackingListDetalle.CodigoDestino = oReader.GetString(4);

                        obePackingListDetalle.FechaDespacho = oReader.GetString(5);
                        obePackingListDetalle.Fecha_BL_HAWBL = oReader.GetString(6);

                        obePackingListDetalle.NumeroGuia = oReader.GetString(7);
                        obePackingListDetalle.FechaRegistro = oReader.GetString(8);
                        obePackingListDetalle.TotalCantidadDespachada = oReader.GetInt32(9);

                        listaPackingListDetalle.Add(obePackingListDetalle);
                    }
                }
            }

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PACKINGLIST_REPORTE_ENCABEZADOXID";

            //db.AddParameter("@IdPackingList", idPackingList);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            if (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.IdPackingList = rdr.GetInt32(0);
            //                obePakingDetalle.NumeroPackingList = rdr.GetString(1);
            //                obePakingDetalle.Nom_Fabrica = rdr.GetString(2);
            //                obePakingDetalle.Nom_Cliente = rdr.GetString(3);
            //                obePakingDetalle.CodigoDestino = rdr.GetString(4);

            //                obePakingDetalle.FechaDespacho = rdr.GetString(5);
            //                obePakingDetalle.Fecha_BL_HAWBL = rdr.GetString(6);

            //                obePakingDetalle.NumeroGuia = rdr.GetString(7);
            //                obePakingDetalle.FechaRegistro = rdr.GetString(8);
            //                obePakingDetalle.TotalCantidadDespachada = rdr.GetInt32(9);

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}
            //return lista;
            return listaPackingListDetalle;
        }

        public List<bePackingListDetalle> Reporte_PackingList_DetallexId(SqlConnection con, int idPackingList)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();
            bePackingListDetalle obePackingDetalle = null;

            SqlCommand cmd = new SqlCommand("WS_PACKINGLIST_REPORTE_DETALLEXID", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@IdPackingList", idPackingList);

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                if (oReader.HasRows)
                {
                    while (oReader.Read())
                    {
                        obePackingDetalle = new bePackingListDetalle();
                        obePackingDetalle.CodPurord = oReader.GetString(0);
                        obePackingDetalle.CodLotest = oReader.GetString(1);
                        obePackingDetalle.CodEstilo = oReader.GetString(2);
                        obePackingDetalle.Tienda = oReader.GetString(3);
                        obePackingDetalle.Hts = oReader.GetString(4);

                        obePackingDetalle.CantidadDespachadas = oReader.GetInt32(5);
                        obePackingDetalle.Color = oReader.GetString(6);
                        obePackingDetalle.Talla = oReader.GetString(7);

                        listaPackingListDetalle.Add(obePackingDetalle);
                    }
                }
            }

            //DatabaseHelper db = new DatabaseHelper(Util.Default);
            //bePackingListDetalle obePakingDetalle = null;

            //string sqlStatement = "WS_PACKINGLIST_REPORTE_DETALLEXID";

            //db.AddParameter("@IdPackingList", idPackingList);

            //try
            //{
            //    using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
            //    {
            //        if (rdr.HasRows)
            //        {
            //            while (rdr.Read())
            //            {
            //                obePakingDetalle = new bePackingListDetalle();
            //                obePakingDetalle.CodPurord = rdr.GetString(0);
            //                obePakingDetalle.CodLotest = rdr.GetString(1);
            //                obePakingDetalle.CodEstilo = rdr.GetString(2);
            //                obePakingDetalle.Tienda = rdr.GetString(3);
            //                obePakingDetalle.Hts = rdr.GetString(4);

            //                obePakingDetalle.CantidadDespachadas = rdr.GetInt32(5);
            //                obePakingDetalle.Color = rdr.GetString(6);
            //                obePakingDetalle.Talla = rdr.GetString(7);

            //                lista.Add(obePakingDetalle);
            //            }
            //        }
            //    }
            //}
            //catch (Exception ex)
            //{
            //    GrabarLog(ex);
            //}
            //return lista;
            return listaPackingListDetalle;
        }

    }
}

