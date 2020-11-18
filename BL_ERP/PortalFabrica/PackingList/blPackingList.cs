using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP.PortalFactory.PackingList;
using BE_ERP.PortalFactory.ServicioPackingList;
using System.Data;
using System.Data.SqlClient;
using DAL_ERP;
using DAL_ERP.PortalFactory.PackingList;

namespace BL_ERP.PortalFabrica.PackingList
{
    public class blPackingList : blLog
    {

        //V1.0
        public List<bePackingListDetalle> listaPoDetalles(string nombreBD, string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            string conexion = nombreBD ?? Util.Default;

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    lista = new daPackingList().listaPoDetalles(nombreBD, codCliente, codFabrica, codDestino, po, codEmpresa);
                }
                catch (Exception ex)
                {
                    lista = null;
                    GrabarArchivoLog(ex);
                }
            }
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

        public int NumeroDeDespachos(string nombreBD, string codPurOrd, string codCliente, string codEmpresa)
        {
            string conexion = nombreBD ?? Util.Intranet;
            int NumeroDespachos = 0;
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    NumeroDespachos = new daPackingList().NumeroDeDespachos(con, codPurOrd, codCliente, codEmpresa);
                }
                catch (Exception ex)
                {
                    NumeroDespachos = -1;
                    GrabarArchivoLog(ex);
                }
            }
            return NumeroDespachos;
        }

        public bePackingListHeader listaPoDetallesSKU(string nombreBD, string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            bePackingListHeader obePackingListHeader = new bePackingListHeader();
            string conexion = nombreBD ?? Util.Default;
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    obePackingListHeader = new daPackingList().listaPoDetallesSKU(con, codCliente, codFabrica, codDestino, po, codEmpresa);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }

            return obePackingListHeader;
        }

        //public List<bePackingListDetalle> listaPoDetallesporTienda(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa, string DcNumber)
        //{
        //    List<bePackingListDetalle> lista = new List<bePackingListDetalle>();

        //    DatabaseHelper db = new DatabaseHelper(Util.Default);
        //    bePackingListDetalle obePakingDetalle = null;

        //    string sqlStatement = "WS_PKLIST_LISTAR_PO_PENDIENTES_porTienda";

        //    db.AddParameter("@CODCLIENTE", codCliente);
        //    db.AddParameter("@CODFABRICA", codFabrica);
        //    db.AddParameter("@COD_DESTINO", codDestino);
        //    db.AddParameter("@PO", po);
        //    db.AddParameter("@CODEMPRESA", codEmpresa);
        //    db.AddParameter("@DC_Number", DcNumber);

        //    try
        //    {
        //        using (DbDataReader rdr = db.ExecuteReader(sqlStatement, CommandType.StoredProcedure))
        //        {
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
        //                    obePakingDetalle.CantidadRequerida = rdr.GetInt32(5);
        //                    obePakingDetalle.CantidadDespachadas = rdr.GetInt32(6);
        //                    obePakingDetalle.CantidadxDespachar = rdr.GetInt32(7);
        //                    obePakingDetalle.idPoLotest = rdr.GetInt32(8);      //add
        //                    obePakingDetalle.CantidadDespachadas_PkList = rdr.GetInt32(9); //add

        //                    lista.Add(obePakingDetalle);
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        GrabarLog(ex);
        //    }

        //    return lista;
        //}

        //V2.0
        public List<bePackingListDetalle> listaPoDetallesV2(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            try
            {
                lista = new daPackingList().listaPoDetallesV2(codCliente, codFabrica, codDestino, po, codEmpresa);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return lista;
        }

        //V3.0
        public bePackingList listaPoDetallesV3(string codCliente, string codFabrica, string codDestino, string po, string codEmpresa)
        {
            bePackingList obePackingList = new bePackingList();
            try
            {
                obePackingList = new daPackingList().listaPoDetallesV3(codCliente, codFabrica, codDestino, po, codEmpresa);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obePackingList;
        }

        public bePackingList traerPackingList_Default(string nombreBD, string codusuario)
        {
            string conexion = nombreBD ?? Util.ERP;
            bePackingList obePackingList = new bePackingList();
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    obePackingList = new daPackingList().traerPackingList_Default(con, codusuario);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return obePackingList;
        }
        public int insertarPackingList(bePackingList objPackingList)
        {
            int iresult = 0;
            try
            {
                iresult = new daPackingList().insertarPackingList(objPackingList);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return (iresult);
        }

        public int insertarPackingListV2(bePackingList objPackingList)
        {
            int iresult = 0;
            try
            {
                iresult = new daPackingList().insertarPackingListV2(objPackingList);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return (iresult);
        }


        public int insertarPackingListV3(bePackingList objPackingList)
        {
            int iresult = 0;
            try
            {
                iresult = new daPackingList().insertarPackingListV3(objPackingList);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return (iresult);
        }

        public bool insertarPackingListV2_1(bePackingList objPackingList)
        {
            bool iresult = false; ;
            try
            {
                iresult = new daPackingList().insertarPackingListV2_1(objPackingList);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return iresult;
        }

        public int insertarPackingListV2_Carton(string nombreBD, bePackingList objPackingList)
        {
            string conexion = nombreBD ?? Util.Intranet;
            int iresult = 0;

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    iresult = new daPackingList().insertarPackingListV2_Carton(con, objPackingList);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return (iresult);
        }
        public int insertarPackingListV2_Carton_ServicioPackingList(string nombreBD, bePackingList objPackingList)
        {
            string conexion = nombreBD ?? Util.Intranet;
            int iresult = 0;

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    iresult = new daPackingList().insertarPackingListV2_Carton_ServicioPackingList(con, objPackingList);
                }
                catch (Exception ex)
                {
                    GrabarArchivoLog(ex);
                }
            }
            return (iresult);
        }
        public List<bePackingListDetalle> listaPackingList(string nombreBD,bePackingListHeader obePackingListHeader)
        {
            string conexion = nombreBD ?? Util.Intranet;
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    lista = new daPackingList().listaPackingList(con, obePackingListHeader);
                }
                catch (Exception ex)
                {
                    lista = null;
                    GrabarArchivoLog(ex);
                }
            }
            return lista;
        }

        public List<beCarton> PackingList_Carton_GET(string nombreBD,int IdPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            List<beCarton> Carton = new List<beCarton>();           
            
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    Carton = new daPackingList().PackingList_Carton_GET(con, IdPackingList);
                }
                catch (Exception ex)
                {                   
                    //GrabarArchivoLog(ex);
                }
            }
            return Carton;           
        }

        public List<bePackingListDetalle> listaPackingListxID(string nombreBD,int idPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            List<bePackingListDetalle> lista = new List<bePackingListDetalle>();
            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    lista = new daPackingList().listaPackingListxID(con, idPackingList);
                }
                catch (Exception ex)
                {
                    lista = null;
                    GrabarArchivoLog(ex);
                }
            }
            return lista;           
        }

        public bePackingList traerPackingList_xId(string codEmpresa, string codUsuario, int idPackingList)
        {
            bePackingList obePackingList = new bePackingList();
            try
            {
                obePackingList = new daPackingList().traerPackingList_xId(codEmpresa, codUsuario, idPackingList);
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obePackingList;
        }

        //nueva
        public List<bePackingListDetalle> traer_PackingListxId(string nombreBD, int idPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    listaPackingListDetalle = new daPackingList().traer_PackingListxId(con, idPackingList);
                }
                catch (Exception ex)
                {
                    listaPackingListDetalle = null;
                    GrabarArchivoLog(ex);
                }
            }
            return listaPackingListDetalle;
        }
        public ServicioPackingList traer_PackingListCartonxId(string nombreBD, int idPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            ServicioPackingList oServicioPackingList = new ServicioPackingList();

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    oServicioPackingList = new daPackingList().traer_PackingListCartonxId(con, idPackingList);
                }
                catch (Exception ex)
                {
                    oServicioPackingList = null;
                    GrabarArchivoLog(ex);
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

        public List<bePackingListDetalle> Reporte_PackingList_EncabezadoxId(string nombreBD, int idPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    listaPackingListDetalle = new daPackingList().Reporte_PackingList_EncabezadoxId(con, idPackingList);
                }
                catch (Exception ex)
                {
                    listaPackingListDetalle = null;
                    GrabarArchivoLog(ex);
                }
            }
            return listaPackingListDetalle;
        }

        public List<bePackingListDetalle> Reporte_PackingList_DetallexId(string nombreBD, int idPackingList)
        {
            string conexion = nombreBD ?? Util.Default;
            List<bePackingListDetalle> listaPackingListDetalle = new List<bePackingListDetalle>();

            using (SqlConnection con = new SqlConnection(conexion))
            {
                try
                {
                    con.Open();
                    listaPackingListDetalle = new daPackingList().Reporte_PackingList_DetallexId(con, idPackingList);
                }
                catch (Exception ex)
                {
                    listaPackingListDetalle = null;
                    GrabarArchivoLog(ex);
                }
            }
            return listaPackingListDetalle;
        }
    }
}

