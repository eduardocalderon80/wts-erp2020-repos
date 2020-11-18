using System;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
// :edu 20171017 EXPORTAR A PDF
using BE_ERP;
using System.Collections.Generic;

namespace DAL_ERP
{
    public class daPo
    {
        // :edu 20171017 EXPORTAR A PDF
        public Po UltimoPoInd(SqlConnection con, int pIdPo)
        {
            Po objPo = new Po();
            PoCliente objPoCliente = new PoCliente();
            List<PoCliente> listaPoCliente = new List<PoCliente>();
            PoClienteProducto objPoClienteProducto = new PoClienteProducto();
            List<PoClienteProducto> listaPoClienteProducto = new List<PoClienteProducto>();
            PoClienteProductoDestino objPoClienteProductoDestino = new PoClienteProductoDestino();
            List<PoClienteProductoDestino> listaPoClienteProductoDestino = new List<PoClienteProductoDestino>();

            // objetos para po cliente estilo
            List<PoClienteEstilo> listaPoClienteEstilo = new List<PoClienteEstilo>();
            PoClienteEstiloTallaColor objPoClienteEstiloTallaColor = new PoClienteEstiloTallaColor();
            List<PoClienteEstiloTallaColor> listaPoClienteEstiloTallaColor = new List<PoClienteEstiloTallaColor>();
            PoClienteEstilo objPoClienteEstilo = new PoClienteEstilo();
            List<PoClienteEstiloDestino> listaPoClienteEstiloDestino = new List<PoClienteEstiloDestino>();
            PoClienteEstiloDestino objPoClienteEstiloDestino = new PoClienteEstiloDestino();
            List<PoClienteEstiloDestinoTallaColor> listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColor>();
            PoClienteEstiloDestinoTallaColor objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColor();

            SqlCommand cmd = new SqlCommand("uspPoUltimoInd", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@IdPo", SqlDbType.Int).Value = pIdPo;

            SqlParameter oParametroIdPo = new SqlParameter();
            //    = cmd.Parameters.Add("@IdPo", SqlDbType.Int);
            //oParametroIdPo.Direction = ParameterDirection.Input;
            //oParametroIdPo.Value = pIdPo;

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
            if (oReader != null)
            {
                while (oReader.Read())
                {
                    objPo = new Po();
                    objPo.IdPo = int.Parse(oReader["IdPO"].ToString());
                    objPo.Codigo = oReader["Codigo"].ToString();
                    objPo.IdEmpresa = int.Parse(oReader["IdEmpresa"].ToString());
                    objPo.IdTipo = int.Parse(oReader["IdTipo"].ToString());
                    objPo.IdCliente = int.Parse(oReader["IdCliente"].ToString());
                    objPo.IdClienteTemporada = int.Parse(oReader["IdClienteTemporada"].ToString());
                    objPo.Monto = decimal.Parse(oReader["Monto"].ToString());
                    objPo.Costo = decimal.Parse(oReader["Costo"].ToString());
                    objPo.TerminoPagoDescripcion = oReader["TerminoPagoDescripcion"].ToString();
                    objPo.FechaCreacion = DateTime.Parse(oReader["FechaCreacion"].ToString());
                    objPo.FechaActualizacion = DateTime.Parse(oReader["FechaActualizacion"].ToString());
                }
                oReader.Close();
                if (objPo.IdPo > 0)
                {
                    #region ARMAR EL OBJETO
                    cmd = new SqlCommand("uspPoClienteUltimoListarByIdPo", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@IdPo", SqlDbType.Int).Value = pIdPo;
                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoCliente = new PoCliente();
                            objPoCliente.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoCliente.IdPo = int.Parse(oReader["IdPo"].ToString());
                            objPoCliente.ArrivalPO = DateTime.Parse(oReader["ArrivalPO"].ToString());
                            objPoCliente.ArrivalPOCadena = objPoCliente.ArrivalPO.ToShortDateString();
                            objPoCliente.Codigo = oReader["Codigo"].ToString();
                            objPoCliente.CodigoLST = oReader["CodigoLST"].ToString();
                            objPoCliente.Monto = decimal.Parse(oReader["Monto"].ToString());
                            objPoCliente.Costo = decimal.Parse(oReader["Costo"].ToString());
                            objPoCliente.RegistroExistente = 1;

                            objPoCliente.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                            objPoCliente.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                            objPoCliente.SaldoCantidadRequerida = decimal.Parse(oReader["SaldoCantidadRequerida"].ToString());
                            objPoCliente.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                            objPoCliente.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                            objPoCliente.NombreTipoPo_BuyPo = oReader["NombreTipoPo_BuyPo"].ToString();

                            listaPoCliente.Add(objPoCliente);
                        }
                        oReader.Close();
                        if (listaPoCliente.Count > 0)
                        {
                            foreach (var item in listaPoCliente)
                            {
                                if (objPo.IdTipo == 1)
                                {
                                    listaPoClienteEstilo = new List<PoClienteEstilo>();
                                    cmd = new SqlCommand("uspPoClienteEstiloUltimoListarByIdPoCliente", con);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    SqlParameter oParametroIdPoCliente = cmd.Parameters.Add("@IdPoCliente", SqlDbType.Int);
                                    oParametroIdPoCliente.Direction = ParameterDirection.Input;
                                    oParametroIdPoCliente.Value = item.IdPoCliente;

                                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                    if (oReader != null)
                                    {
                                        while (oReader.Read())
                                        {
                                            objPoClienteEstilo = new PoClienteEstilo();
                                            objPoClienteEstilo.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                            objPoClienteEstilo.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                            objPoClienteEstilo.IdPo = int.Parse(oReader["IdPO"].ToString());
                                            objPoClienteEstilo.IdEstilo = int.Parse(oReader["IdEstilo"].ToString());
                                            objPoClienteEstilo.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                                            objPoClienteEstilo.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                                            objPoClienteEstilo.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                                            objPoClienteEstilo.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                                            //objPoClienteEstilo.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                            objPoClienteEstilo.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                                            objPoClienteEstilo.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                                            objPoClienteEstilo.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                                            objPoClienteEstilo.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());
                                            objPoClienteEstilo.FechaDespachoFabrica = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString());
                                            objPoClienteEstilo.FechaDespachoFabricaCadena = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.FechaDespachoCliente = DateTime.Parse(oReader["FechaDespachoCliente"].ToString());
                                            objPoClienteEstilo.FechaDespachoClienteCadena = DateTime.Parse(oReader["FechaDespachoCliente"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.FechaEntregaCliente = DateTime.Parse(oReader["FechaEntregaCliente"].ToString());
                                            objPoClienteEstilo.FechaEntregaClienteCadena = DateTime.Parse(oReader["FechaEntregaCliente"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.FechaDespachoFabricaUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString());
                                            objPoClienteEstilo.FechaDespachoFabricaUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.FechaDespachoClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString());
                                            objPoClienteEstilo.FechaDespachoClienteUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.FechaEntregaClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString());
                                            objPoClienteEstilo.FechaEntregaClienteUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString()).ToShortDateString();
                                            objPoClienteEstilo.Monto = decimal.Parse(oReader["Monto"].ToString());
                                            objPoClienteEstilo.Costo = decimal.Parse(oReader["Costo"].ToString());
                                            objPoClienteEstilo.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                                            objPoClienteEstilo.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                                            objPoClienteEstilo.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                                            objPoClienteEstilo.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                                            objPoClienteEstilo.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                                            objPoClienteEstilo.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                                            objPoClienteEstilo.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                                            objPoClienteEstilo.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                                            objPoClienteEstilo.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                                            objPoClienteEstilo.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                                            objPoClienteEstilo.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                                            objPoClienteEstilo.Hts = oReader["Hts"].ToString();

                                            objPoClienteEstilo.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                                            objPoClienteEstilo.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                                            objPoClienteEstilo.SaldoCantidadRequerida = int.Parse(oReader["SaldoCantidadRequerida"].ToString());
                                            objPoClienteEstilo.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());

                                            objPoClienteEstilo.CodigoEstilo = oReader["CodigoEstilo"].ToString();
                                            objPoClienteEstilo.DescripcionEstilo = oReader["DescripcionEstilo"].ToString();
                                            objPoClienteEstilo.NombreProveedor = oReader["NombreProveedor"].ToString();
                                            objPoClienteEstilo.NombreTipoPoClienteEstilo = oReader["NombreTipoPo"].ToString();
                                            objPoClienteEstilo.RegistroExistente = 1;

                                            listaPoClienteEstilo.Add(objPoClienteEstilo);
                                        }
                                        oReader.Close();
                                        item.PoClienteEstilo = listaPoClienteEstilo;
                                    }


                                }
                                else if (objPo.IdTipo == 2)
                                {  // 1 = GARMENT/ESTILO; 2 = OTHERS/PRODUCTO 
                                    cmd = new SqlCommand("uspPoClienteProductoUltimoListarByIdPoCliente", con);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.Add("@IdPoCliente", SqlDbType.Int).Value = item.IdPoCliente;
                                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

                                    listaPoClienteProducto = new List<PoClienteProducto>();
                                    if (oReader != null)
                                    {
                                        while (oReader.Read())
                                        {
                                            objPoClienteProducto = new PoClienteProducto();
                                            objPoClienteProducto.IdPoClienteProducto = int.Parse(oReader["IdPoClienteProducto"].ToString());
                                            objPoClienteProducto.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                            objPoClienteProducto.IdPo = int.Parse(oReader["IdPO"].ToString());
                                            objPoClienteProducto.IdProducto = int.Parse(oReader["IdProducto"].ToString());
                                            objPoClienteProducto.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                                            objPoClienteProducto.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                                            objPoClienteProducto.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                                            objPoClienteProducto.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                                            objPoClienteProducto.IdClienteDireccion = oReader.IsDBNull(oReader.GetOrdinal("IdClienteDireccion")) ? 0 : int.Parse(oReader["IdClienteDireccion"].ToString());
                                            objPoClienteProducto.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                                            objPoClienteProducto.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                                            objPoClienteProducto.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                                            objPoClienteProducto.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());
                                            objPoClienteProducto.FechaDespachoFabrica = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString());
                                            objPoClienteProducto.FechaDespachoFabricaCadena = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString()).ToShortDateString();

                                            objPoClienteProducto.FechaDespachoCliente = DateTime.Parse(oReader["FechaDespachoCliente"].ToString());
                                            objPoClienteProducto.FechaDespachoClienteCadena = DateTime.Parse(oReader["FechaDespachoCliente"].ToString()).ToShortDateString();

                                            objPoClienteProducto.FechaEntregaCliente = DateTime.Parse(oReader["FechaEntregaCliente"].ToString());
                                            objPoClienteProducto.FechaEntregaClienteCadena = DateTime.Parse(oReader["FechaEntregaCliente"].ToString()).ToShortDateString();

                                            objPoClienteProducto.FechaDespachoFabricaUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString());
                                            objPoClienteProducto.FechaDespachoFabricaUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString()).ToShortDateString();

                                            objPoClienteProducto.FechaDespachoClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString());
                                            objPoClienteProducto.FechaDespachoClienteUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString()).ToShortDateString();

                                            objPoClienteProducto.FechaEntregaClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString());
                                            objPoClienteProducto.FechaEntregaClienteUPTCadena = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString()).ToShortDateString();

                                            objPoClienteProducto.Monto = decimal.Parse(oReader["Monto"].ToString());
                                            objPoClienteProducto.Costo = decimal.Parse(oReader["Costo"].ToString());
                                            objPoClienteProducto.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                                            objPoClienteProducto.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                                            objPoClienteProducto.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                                            objPoClienteProducto.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                                            objPoClienteProducto.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                                            objPoClienteProducto.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                                            objPoClienteProducto.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                                            objPoClienteProducto.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                                            objPoClienteProducto.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                                            objPoClienteProducto.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                                            objPoClienteProducto.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                                            objPoClienteProducto.Hts = oReader["Hts"].ToString();
                                            objPoClienteProducto.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                                            objPoClienteProducto.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                                            objPoClienteProducto.SaldoCantidadRequerida = decimal.Parse(oReader["SaldoCantidadRequerida"].ToString());
                                            objPoClienteProducto.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());

                                            objPoClienteProducto.CodigoProducto = oReader["CodigoProducto"].ToString();
                                            objPoClienteProducto.NombreProveedor = oReader["NombreProveedor"].ToString();
                                            objPoClienteProducto.NombreTipoPoClienteProducto = oReader["NombreTipoPo"].ToString();
                                            objPoClienteProducto.NombreProducto = oReader["NombreProducto"].ToString();
                                            objPoClienteProducto.DescripcionProducto = oReader["DescripcionProducto"].ToString();

                                            objPoClienteProducto.RegistroExistente = 1;

                                            listaPoClienteProducto.Add(objPoClienteProducto);
                                        }
                                        oReader.Close();
                                        item.PoClienteProducto = listaPoClienteProducto;
                                    }
                                }
                            }

                            // 
                            if (objPo.IdTipo == 1)
                            {
                                foreach (var item in listaPoCliente)
                                {
                                    foreach (var itemPoClienteEstilo in item.PoClienteEstilo)
                                    {
                                        cmd = new SqlCommand("uspPoClienteEstiloTallaColorUltimoListarByIdPoClienteEstilo", con);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter oParametroIdPoClienteEstilo = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                                        oParametroIdPoClienteEstilo.Direction = ParameterDirection.Input;
                                        oParametroIdPoClienteEstilo.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                                        listaPoClienteEstiloTallaColor = new List<PoClienteEstiloTallaColor>();
                                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                        if (oReader != null)
                                        {
                                            while (oReader.Read())
                                            {
                                                objPoClienteEstiloTallaColor = new PoClienteEstiloTallaColor();
                                                objPoClienteEstiloTallaColor.IdPoClienteEstiloTallaColor = int.Parse(oReader["IdPoClienteEstiloTallaColor"].ToString());
                                                objPoClienteEstiloTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                                objPoClienteEstiloTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                                objPoClienteEstiloTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                                                objPoClienteEstiloTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                                                objPoClienteEstiloTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                                                objPoClienteEstiloTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                                                objPoClienteEstiloTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                                                objPoClienteEstiloTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                                                objPoClienteEstiloTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                                                objPoClienteEstiloTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                                                objPoClienteEstiloTallaColor.RegistroExistente = 1;

                                                listaPoClienteEstiloTallaColor.Add(objPoClienteEstiloTallaColor);
                                            }
                                            oReader.Close();
                                            itemPoClienteEstilo.PoClienteEstiloTallaColor = listaPoClienteEstiloTallaColor;
                                        }

                                        // POCLIENTEESTILODESTINO
                                        cmd = new SqlCommand("uspPoClienteEstiloDestinoUltimoListarByIdPoClienteEstilo", con);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter oParametroIdPoClienteEstiloDestino = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                                        oParametroIdPoClienteEstiloDestino.Direction = ParameterDirection.Input;
                                        oParametroIdPoClienteEstiloDestino.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                                        listaPoClienteEstiloDestino = new List<PoClienteEstiloDestino>();
                                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                        if (oReader != null)
                                        {
                                            while (oReader.Read())
                                            {
                                                objPoClienteEstiloDestino = new PoClienteEstiloDestino();
                                                objPoClienteEstiloDestino.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                                                objPoClienteEstiloDestino.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                                objPoClienteEstiloDestino.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                                objPoClienteEstiloDestino.IdPo = int.Parse(oReader["IdPo"].ToString());
                                                objPoClienteEstiloDestino.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                                objPoClienteEstiloDestino.CantidadRequerida = int.Parse(oReader["CantidadRequerida"].ToString());
                                                objPoClienteEstiloDestino.DescripcionDireccion = oReader["DescripcionDireccion"].ToString();
                                                objPoClienteEstiloDestino.RegistroExistente = 1;

                                                listaPoClienteEstiloDestino.Add(objPoClienteEstiloDestino);
                                            }
                                            oReader.Close();
                                            itemPoClienteEstilo.PoClienteEstiloDestino = listaPoClienteEstiloDestino;
                                        }

                                        foreach (var itemPoClienteEstiloDestino in itemPoClienteEstilo.PoClienteEstiloDestino)
                                        {
                                            cmd = new SqlCommand("uspPoClienteEstiloDestinoTallaColorUltimoListarByIdPoClienteEstiloDestino", con);
                                            cmd.CommandType = CommandType.StoredProcedure;

                                            SqlParameter oParametroIdPoClienteEstiloDestino1 = cmd.Parameters.Add("@IdPoClienteEstiloDestino", SqlDbType.Int);
                                            oParametroIdPoClienteEstiloDestino1.Direction = ParameterDirection.Input;
                                            oParametroIdPoClienteEstiloDestino1.Value = itemPoClienteEstiloDestino.IdPoClienteEstiloDestino;

                                            listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColor>();
                                            oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                            if (oReader != null)
                                            {
                                                while (oReader.Read())
                                                {
                                                    objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColor();
                                                    objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestinoTallaColor = int.Parse(oReader["IdPoClienteEstiloDestinoTallaColor"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                                                    objPoClienteEstiloDestinoTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                                                    objPoClienteEstiloDestinoTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                                                    objPoClienteEstiloDestinoTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                                                    objPoClienteEstiloDestinoTallaColor.RegistroExistente = 1;

                                                    listaPoClienteEstiloDestinoTallaColor.Add(objPoClienteEstiloDestinoTallaColor);
                                                }
                                                oReader.Close();
                                                itemPoClienteEstiloDestino.ListaPoClienteEstiloDestinoTallaColor = listaPoClienteEstiloDestinoTallaColor;
                                            }
                                        }
                                    }
                                }
                            }
                            else if (objPo.IdTipo == 2)
                            { // 1 = GARMENT/ESTILOS; 2 = OTHERS/PRODUCTO
                                foreach (var item in listaPoCliente)
                                {
                                    foreach (var itemPoClienteProducto in item.PoClienteProducto)
                                    {
                                        // POCLIENTEPRODUCTODESTINO
                                        cmd = new SqlCommand("uspPoClienteProductoDestinoUltimoListarByIdPoClienteProducto", con);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.Add("@IdPoClienteProducto", SqlDbType.Int).Value = itemPoClienteProducto.IdPoClienteProducto;
                                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

                                        listaPoClienteProductoDestino = new List<PoClienteProductoDestino>();
                                        if (oReader != null)
                                        {
                                            while (oReader.Read())
                                            {
                                                objPoClienteProductoDestino = new PoClienteProductoDestino();
                                                objPoClienteProductoDestino.IdPoClienteProductoDestino = int.Parse(oReader["IdPoClienteProductoDestino"].ToString());
                                                objPoClienteProductoDestino.IdPoClienteProducto = int.Parse(oReader["IdPoClienteProducto"].ToString());
                                                objPoClienteProductoDestino.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                                objPoClienteProductoDestino.IdPo = int.Parse(oReader["IdPo"].ToString());
                                                objPoClienteProductoDestino.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                                objPoClienteProductoDestino.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                                                objPoClienteProductoDestino.DescripcionDireccion = oReader["DescripcionDireccion"].ToString();
                                                objPoClienteProductoDestino.RegistroExistente = 1;

                                                listaPoClienteProductoDestino.Add(objPoClienteProductoDestino);
                                            }
                                            oReader.Close();
                                            itemPoClienteProducto.PoClienteProductoDestino = listaPoClienteProductoDestino;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion

                    // :EDU PENDIENTE PARA GARMENT/ESTILOS
                    #region LISTA POCLIENTEESTILO POR IDPO
                    listaPoClienteEstilo = new List<PoClienteEstilo>();
                    cmd = new SqlCommand("uspPoClienteEstiloUltimoListarByIdPo", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    oParametroIdPo = cmd.Parameters.Add("@IdPo", SqlDbType.Int);
                    oParametroIdPo.Direction = ParameterDirection.Input;
                    oParametroIdPo.Value = pIdPo;

                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoClienteEstilo = new PoClienteEstilo();
                            objPoClienteEstilo.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                            objPoClienteEstilo.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoClienteEstilo.IdPo = int.Parse(oReader["IdPO"].ToString());
                            objPoClienteEstilo.IdEstilo = int.Parse(oReader["IdEstilo"].ToString());
                            objPoClienteEstilo.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                            objPoClienteEstilo.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                            objPoClienteEstilo.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                            objPoClienteEstilo.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                            //objPoClienteEstilo.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                            objPoClienteEstilo.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                            objPoClienteEstilo.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                            objPoClienteEstilo.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                            objPoClienteEstilo.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());

                            objPoClienteEstilo.FechaDespachoFabrica = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString());
                            objPoClienteEstilo.FechaDespachoCliente = DateTime.Parse(oReader["FechaDespachoCliente"].ToString());
                            objPoClienteEstilo.FechaEntregaCliente = DateTime.Parse(oReader["FechaEntregaCliente"].ToString());

                            objPoClienteEstilo.FechaDespachoFabricaUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString());
                            objPoClienteEstilo.FechaDespachoClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString());
                            objPoClienteEstilo.FechaEntregaClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString());

                            objPoClienteEstilo.Monto = decimal.Parse(oReader["Monto"].ToString());
                            objPoClienteEstilo.Costo = decimal.Parse(oReader["Costo"].ToString());
                            objPoClienteEstilo.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                            objPoClienteEstilo.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                            objPoClienteEstilo.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                            objPoClienteEstilo.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                            objPoClienteEstilo.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                            objPoClienteEstilo.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                            objPoClienteEstilo.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                            objPoClienteEstilo.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                            objPoClienteEstilo.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                            objPoClienteEstilo.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                            objPoClienteEstilo.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                            objPoClienteEstilo.Hts = oReader["Hts"].ToString();

                            objPoClienteEstilo.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                            objPoClienteEstilo.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                            objPoClienteEstilo.SaldoCantidadRequerida = int.Parse(oReader["SaldoCantidadRequerida"].ToString());
                            objPoClienteEstilo.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());

                            objPoClienteEstilo.CodigoEstilo = oReader["CodigoEstilo"].ToString();
                            objPoClienteEstilo.DescripcionEstilo = oReader["DescripcionEstilo"].ToString();
                            objPoClienteEstilo.NombreProveedor = oReader["NombreProveedor"].ToString();
                            objPoClienteEstilo.NombreTipoPoClienteEstilo = oReader["NombreTipoPo"].ToString();
                            objPoClienteEstilo.CodigoTela = oReader["CodigoTela"].ToString();
                            objPoClienteEstilo.NombreTela = oReader["NombreTela"].ToString();
                            objPoClienteEstilo.DescripcionFormaEnvio = oReader["DescripcionFormaEnvio"].ToString();
                            objPoClienteEstilo.ProveedorDireccion = oReader["ProveedorDireccion"].ToString();
                            objPoClienteEstilo.ProveedorTelefono1 = oReader["ProveedorTelefono1"].ToString();
                            objPoClienteEstilo.ImagenNombre = oReader["ImagenNombre"].ToString();
                            objPoClienteEstilo.RegistroExistente = 1;

                            listaPoClienteEstilo.Add(objPoClienteEstilo);
                        }
                        oReader.Close();
                        objPo.ListaPoClienteEstilo = listaPoClienteEstilo;
                    }

                    foreach (var itemPoClienteEstilo in objPo.ListaPoClienteEstilo)
                    {
                        // POCLIENTEESTILOTALLACOLOR
                        cmd = new SqlCommand("uspPoClienteEstiloTallaColorUltimoListarByIdPoClienteEstilo", con);
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter oParametroIdPoClienteEstilo = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                        oParametroIdPoClienteEstilo.Direction = ParameterDirection.Input;
                        oParametroIdPoClienteEstilo.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                        listaPoClienteEstiloTallaColor = new List<PoClienteEstiloTallaColor>();
                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                        if (oReader != null)
                        {
                            while (oReader.Read())
                            {
                                objPoClienteEstiloTallaColor = new PoClienteEstiloTallaColor();
                                objPoClienteEstiloTallaColor.IdPoClienteEstiloTallaColor = int.Parse(oReader["IdPoClienteEstiloTallaColor"].ToString());
                                objPoClienteEstiloTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                objPoClienteEstiloTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                objPoClienteEstiloTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                                objPoClienteEstiloTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                                objPoClienteEstiloTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                                objPoClienteEstiloTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                                objPoClienteEstiloTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                                objPoClienteEstiloTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                                objPoClienteEstiloTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                                objPoClienteEstiloTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                                objPoClienteEstiloTallaColor.RegistroExistente = 1;

                                listaPoClienteEstiloTallaColor.Add(objPoClienteEstiloTallaColor);
                            }
                            oReader.Close();
                            itemPoClienteEstilo.PoClienteEstiloTallaColor = listaPoClienteEstiloTallaColor;
                        }

                        // POCLIENTEESTILODESTINO
                        cmd = new SqlCommand("uspPoClienteEstiloDestinoUltimoListarByIdPoClienteEstilo", con);
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter oParametroIdPoClienteEstiloDestino = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                        oParametroIdPoClienteEstiloDestino.Direction = ParameterDirection.Input;
                        oParametroIdPoClienteEstiloDestino.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                        listaPoClienteEstiloDestino = new List<PoClienteEstiloDestino>();
                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                        if (oReader != null)
                        {
                            while (oReader.Read())
                            {
                                objPoClienteEstiloDestino = new PoClienteEstiloDestino();
                                objPoClienteEstiloDestino.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                                objPoClienteEstiloDestino.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                objPoClienteEstiloDestino.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                objPoClienteEstiloDestino.IdPo = int.Parse(oReader["IdPo"].ToString());
                                objPoClienteEstiloDestino.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                objPoClienteEstiloDestino.CantidadRequerida = int.Parse(oReader["CantidadRequerida"].ToString());
                                objPoClienteEstiloDestino.DescripcionDireccion = oReader["DescripcionDireccion"].ToString();
                                objPoClienteEstiloDestino.RegistroExistente = 1;

                                listaPoClienteEstiloDestino.Add(objPoClienteEstiloDestino);
                            }
                            oReader.Close();
                            itemPoClienteEstilo.PoClienteEstiloDestino = listaPoClienteEstiloDestino;
                        }
                    }

                    // OBTENER TODOS LOS POCLIENTEESTILODESTINOTALLACOLOR POR IDPO
                    cmd = new SqlCommand("uspPoClienteEstiloDestinoTallaColorUltimoListarByIdPo", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    oParametroIdPo = cmd.Parameters.Add("@IdPo", SqlDbType.Int);
                    oParametroIdPo.Direction = ParameterDirection.Input;
                    oParametroIdPo.Value = pIdPo;

                    listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColor>();
                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColor();
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestinoTallaColor = int.Parse(oReader["IdPoClienteEstiloDestinoTallaColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                            objPoClienteEstiloDestinoTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                            objPoClienteEstiloDestinoTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                            objPoClienteEstiloDestinoTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                            objPoClienteEstiloDestinoTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                            objPoClienteEstiloDestinoTallaColor.RegistroExistente = 1;

                            listaPoClienteEstiloDestinoTallaColor.Add(objPoClienteEstiloDestinoTallaColor);
                        }
                        oReader.Close();
                        objPo.ListaPoClienteEstiloDestinoTallaColor = listaPoClienteEstiloDestinoTallaColor;
                    }
                    #endregion

                    #region LISTA POCLIENTEPRODUCTO POR IDPO
                    //listaPoClienteProducto = new List<PoClienteProducto>();
                    //cmd = new SqlCommand("uspPoClienteProductoUltimoListarByIdPo", con);
                    //cmd.CommandType = CommandType.StoredProcedure;

                    //cmd.Parameters.Add("@IdPo", SqlDbType.Int).Value = pIdPo;

                    //oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    //if (oReader != null)
                    //{
                    //    while (oReader.Read())
                    //    {
                    //        objPoClienteProducto = new PoClienteProducto();
                    //        objPoClienteProducto.IdPoClienteProducto = int.Parse(oReader["IdPoClienteProducto"].ToString());
                    //        objPoClienteProducto.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                    //        objPoClienteProducto.IdPo = int.Parse(oReader["IdPO"].ToString());
                    //        objPoClienteProducto.IdProducto = int.Parse(oReader["IdProducto"].ToString());
                    //        objPoClienteProducto.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                    //        objPoClienteProducto.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                    //        objPoClienteProducto.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                    //        objPoClienteProducto.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                    //        //objPoClienteProducto.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                    //        objPoClienteProducto.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                    //        objPoClienteProducto.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                    //        objPoClienteProducto.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                    //        objPoClienteProducto.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());
                    //        objPoClienteProducto.FechaDespachoFabrica = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString());
                    //        objPoClienteProducto.FechaDespachoCliente = DateTime.Parse(oReader["FechaDespachoCliente"].ToString());
                    //        objPoClienteProducto.FechaEntregaCliente = DateTime.Parse(oReader["FechaEntregaCliente"].ToString());

                    //        objPoClienteProducto.FechaDespachoFabricaUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString());
                    //        objPoClienteProducto.FechaDespachoClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString());
                    //        objPoClienteProducto.FechaEntregaClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString());

                    //        objPoClienteProducto.Monto = decimal.Parse(oReader["Monto"].ToString());
                    //        objPoClienteProducto.Costo = decimal.Parse(oReader["Costo"].ToString());
                    //        objPoClienteProducto.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                    //        objPoClienteProducto.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                    //        objPoClienteProducto.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                    //        objPoClienteProducto.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                    //        objPoClienteProducto.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                    //        objPoClienteProducto.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                    //        objPoClienteProducto.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                    //        objPoClienteProducto.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                    //        objPoClienteProducto.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                    //        objPoClienteProducto.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                    //        objPoClienteProducto.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                    //        objPoClienteProducto.Hts = oReader["Hts"].ToString();
                    //        objPoClienteProducto.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                    //        objPoClienteProducto.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                    //        objPoClienteProducto.SaldoCantidadRequerida = decimal.Parse(oReader["SaldoCantidadRequerida"].ToString());
                    //        objPoClienteProducto.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());
                    //        objPoClienteProducto.CodigoProducto = oReader["CodigoProducto"].ToString();
                    //        objPoClienteProducto.NombreProveedor = oReader["NombreProveedor"].ToString();
                    //        objPoClienteProducto.NombreTipoPoClienteProducto = oReader["NombreTipoPo"].ToString();
                    //        objPoClienteProducto.DescripcionFormaEnvio = oReader["DescripcionFormaEnvio"].ToString();
                    //        objPoClienteProducto.ProveedorDireccion = oReader["ProveedorDireccion"].ToString();
                    //        objPoClienteProducto.ProveedorTelefono1 = oReader["ProveedorTelefono1"].ToString();
                    //        objPoClienteProducto.ImagenNombre = oReader["ImagenNombre"].ToString();

                    //        objPoClienteProducto.NombreProducto = oReader["NombreProducto"].ToString();
                    //        objPoClienteProducto.DescripcionProducto = oReader["DescripcionProducto"].ToString();

                    //        objPoClienteProducto.RegistroExistente = 1;

                    //        listaPoClienteProducto.Add(objPoClienteProducto);
                    //    }

                    //    oReader.Close();
                    //    objPo.ListaPoClienteProducto = listaPoClienteProducto;
                    //}

                    //foreach (var itemPoClienteProducto in objPo.ListaPoClienteProducto)
                    //{
                    //    // POCLIENTEESTILODESTINO
                    //    cmd = new SqlCommand("uspPoClienteProductoDestinoUltimoListarByIdPoClienteProducto", con);
                    //    cmd.CommandType = CommandType.StoredProcedure;

                    //    SqlParameter oParametroIdPoClienteProductoDestino = cmd.Parameters.Add("@IdPoClienteProducto", SqlDbType.Int);
                    //    oParametroIdPoClienteProductoDestino.Direction = ParameterDirection.Input;
                    //    oParametroIdPoClienteProductoDestino.Value = itemPoClienteProducto.IdPoClienteProducto;

                    //    listaPoClienteProductoDestino = new List<PoClienteProductoDestino>();
                    //    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    //    if (oReader != null)
                    //    {
                    //        while (oReader.Read())
                    //        {
                    //            objPoClienteProductoDestino = new PoClienteProductoDestino();
                    //            objPoClienteProductoDestino.IdPoClienteProductoDestino = int.Parse(oReader["IdPoClienteProductoDestino"].ToString());
                    //            objPoClienteProductoDestino.IdPoClienteProducto = int.Parse(oReader["IdPoClienteProducto"].ToString());
                    //            objPoClienteProductoDestino.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                    //            objPoClienteProductoDestino.IdPo = int.Parse(oReader["IdPo"].ToString());
                    //            objPoClienteProductoDestino.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                    //            objPoClienteProductoDestino.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                    //            objPoClienteProductoDestino.DescripcionDireccion = oReader["DescripcionDireccion"].ToString();
                    //            objPoClienteProductoDestino.RegistroExistente = 1;

                    //            listaPoClienteProductoDestino.Add(objPoClienteProductoDestino);
                    //        }
                    //        oReader.Close();
                    //        itemPoClienteProducto.PoClienteProductoDestino = listaPoClienteProductoDestino;
                    //    }
                    //}
                    #endregion
                    objPo.PoCliente = listaPoCliente;
                }
            }

            return objPo;
        }
        // :edu 20171017 EXPORTAR A PDF
        public List<Empresa> GetAllEmpresa(SqlConnection con)
        {
            SqlCommand cmd = new SqlCommand("uspEmpresaListar", con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            List<Empresa> listaEmpresa = new List<Empresa>();
            Empresa oEmpresa = new Empresa();
            if (oReader != null)
            {
                while (oReader.Read())
                {
                    oEmpresa = new Empresa();
                    oEmpresa.IdEmpresa = oReader.GetInt32(0);
                    oEmpresa.Nombre = oReader.GetString(1);
                    oEmpresa.Direccion = oReader["Direccion"].ToString();
                    oEmpresa.NombreLogo = oReader["NombreLogo"].ToString();
                    listaEmpresa.Add(oEmpresa);
                }
            }

            return listaEmpresa;
        }

        public List<PoClienteEstiloTallaColor> GetListaPoClienteEstiloTallaColor(SqlConnection con, int pIdPoClienteEstilo)
        {
            PoClienteEstiloTallaColor objPoClienteEstiloTallaColor = new PoClienteEstiloTallaColor();
            List<PoClienteEstiloTallaColor> listaPoClienteEstiloTallaColor = new List<PoClienteEstiloTallaColor>();

            SqlCommand cmd = new SqlCommand("uspReporte_POEstilo_PDF", con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter paramIdPoClienteEstilo = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
            paramIdPoClienteEstilo.Direction = ParameterDirection.Input;
            paramIdPoClienteEstilo.Value = pIdPoClienteEstilo;

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null) {
                while (oReader.Read())
                {
                    objPoClienteEstiloTallaColor = new PoClienteEstiloTallaColor();
                    objPoClienteEstiloTallaColor.IdPoClienteEstiloTallaColor = int.Parse(oReader["IdPoClienteEstiloTallaColor"].ToString());
                    objPoClienteEstiloTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                    objPoClienteEstiloTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                    objPoClienteEstiloTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                    objPoClienteEstiloTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                    objPoClienteEstiloTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                    objPoClienteEstiloTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                    objPoClienteEstiloTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                    objPoClienteEstiloTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                    objPoClienteEstiloTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                    objPoClienteEstiloTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                    objPoClienteEstiloTallaColor.RegistroExistente = 1;

                    listaPoClienteEstiloTallaColor.Add(objPoClienteEstiloTallaColor);
                }
                oReader.Close();
            }

            return listaPoClienteEstiloTallaColor;
        }

        public int SavePOMarmaxx(SqlConnection cn,SqlTransaction ts,string Po,string PoCliente,string PoClienteEstilo,string PoClienteEstiloDestino,string PoClienteEstiloDestinoTallaColor,string Usuario)
        {
            SqlCommand cmd = new SqlCommand("uspPOMarmaxxSave", cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;           

            SqlParameter pPo = cmd.Parameters.Add("@Po", SqlDbType.VarChar);
            pPo.Direction = ParameterDirection.Input;
            pPo.Value = Po;

            SqlParameter pPoCliente = cmd.Parameters.Add("@PoCliente", SqlDbType.VarChar);
            pPoCliente.Direction = ParameterDirection.Input;
            pPoCliente.Value = PoCliente;

            SqlParameter pPoClienteEstilo = cmd.Parameters.Add("@PoClienteEstilo", SqlDbType.VarChar);
            pPoClienteEstilo.Direction = ParameterDirection.Input;
            pPoClienteEstilo.Value = PoClienteEstilo;

            SqlParameter pPoClienteEstiloDestino = cmd.Parameters.Add("@PoClienteEstiloDestino", SqlDbType.VarChar);
            pPoClienteEstiloDestino.Direction = ParameterDirection.Input;
            pPoClienteEstiloDestino.Value = PoClienteEstiloDestino;

            SqlParameter pPoClienteEstiloDestinoTallaColor = cmd.Parameters.Add("@PoClienteEstiloDestinoTallaColor", SqlDbType.VarChar);
            pPoClienteEstiloDestinoTallaColor.Direction = ParameterDirection.Input;
            pPoClienteEstiloDestinoTallaColor.Value = PoClienteEstiloDestinoTallaColor;

            SqlParameter pUsuario = cmd.Parameters.Add("@Usuario", SqlDbType.VarChar);
            pUsuario.Direction = ParameterDirection.Input;
            pUsuario.Value = Usuario;

            int rows = cmd.ExecuteNonQuery();

            return rows;

        }
        
    }
}
