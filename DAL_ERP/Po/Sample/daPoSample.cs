using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using System.Data;
using System.Data.SqlClient;

namespace DAL_ERP
{
    public class daPoSample
    {

        // :edu 20171017 EXPORTAR A PDF
        public PoSample UltimoPoInd(SqlConnection con, int pIdPo)
        {
            PoSample objPo = new PoSample();
            PoClienteSample objPoCliente = new PoClienteSample();
            List<PoClienteSample> listaPoCliente = new List<PoClienteSample>();
            // objetos para PoSample cliente estilo
            List<PoClienteEstiloSample> listaPoClienteEstilo = new List<PoClienteEstiloSample>();
            PoClienteEstiloSample objPoClienteEstilo = new PoClienteEstiloSample();
            List<PoClienteEstiloDestinoSample> listaPoClienteEstiloDestino = new List<PoClienteEstiloDestinoSample>();
            PoClienteEstiloDestinoSample objPoClienteEstiloDestino = new PoClienteEstiloDestinoSample();
            List<PoClienteEstiloDestinoTallaColorSample> listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColorSample>();
            PoClienteEstiloDestinoTallaColorSample objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColorSample();

            SqlCommand cmd = new SqlCommand("usp_PoUltimoInd_Sample", con);
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
                    objPo = new PoSample();
                    objPo.IdPo = int.Parse(oReader["IdPO"].ToString());
                    objPo.Codigo = oReader["Codigo"].ToString();
                    objPo.IdEmpresa = int.Parse(oReader["IdEmpresa"].ToString());
                    //objPo.IdTipo = int.Parse(oReader["IdTipo"].ToString());
                    objPo.IdCliente = int.Parse(oReader["IdCliente"].ToString());
                    objPo.IdClienteTemporada = int.Parse(oReader["IdClienteTemporada"].ToString());
                    //objPo.Monto = decimal.Parse(oReader["Monto"].ToString());
                    //objPo.Costo = decimal.Parse(oReader["Costo"].ToString());
                    objPo.TerminoPagoDescripcion = oReader["TerminoPagoDescripcion"].ToString();
                    objPo.FechaCreacion = DateTime.Parse(oReader["FechaCreacion"].ToString());
                    objPo.FechaActualizacion = DateTime.Parse(oReader["FechaActualizacion"].ToString());
                    objPo.FlgSeIncluyeContramuestraSinCobro = int.Parse(oReader["FlgSeIncluyeContramuestraSinCobro"].ToString());
                }
                oReader.Close();
                if (objPo.IdPo > 0)
                {
                    #region ARMAR EL OBJETO
                    cmd = new SqlCommand("usp_PoClienteUltimoListarByIdPo_Sample", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@IdPo", SqlDbType.Int).Value = pIdPo;
                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoCliente = new PoClienteSample();
                            objPoCliente.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoCliente.IdPo = int.Parse(oReader["IdPo"].ToString());
                            objPoCliente.ArrivalPO = DateTime.Parse(oReader["ArrivalPO"].ToString());
                            objPoCliente.ArrivalPOCadena = objPoCliente.ArrivalPO.ToShortDateString();
                            objPoCliente.Codigo = oReader["Codigo"].ToString();
                            objPoCliente.CodigoLST = oReader["CodigoLST"].ToString();
                            //objPoCliente.Monto = decimal.Parse(oReader["Monto"].ToString());
                            //objPoCliente.Costo = decimal.Parse(oReader["Costo"].ToString());
                            //objPoCliente.RegistroExistente = 1;

                            objPoCliente.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                            objPoCliente.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                            //objPoCliente.SaldoCantidadRequerida = decimal.Parse(oReader["SaldoCantidadRequerida"].ToString());
                            //objPoCliente.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                            //objPoCliente.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                            //objPoCliente.NombreTipoPo_BuyPo = oReader["NombreTipoPo_BuyPo"].ToString();

                            listaPoCliente.Add(objPoCliente);
                        }
                        oReader.Close();
                        if (listaPoCliente.Count > 0)
                        {
                            foreach (var item in listaPoCliente)
                            {
                                listaPoClienteEstilo = new List<PoClienteEstiloSample>();
                                cmd = new SqlCommand("usp_PoClienteEstiloUltimoListarByIdPoCliente_Sample", con);
                                cmd.CommandType = CommandType.StoredProcedure;

                                SqlParameter oParametroIdPoCliente = cmd.Parameters.Add("@IdPoCliente", SqlDbType.Int);
                                oParametroIdPoCliente.Direction = ParameterDirection.Input;
                                oParametroIdPoCliente.Value = item.IdPoCliente;

                                oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                if (oReader != null)
                                {
                                    while (oReader.Read())
                                    {
                                        objPoClienteEstilo = new PoClienteEstiloSample();
                                        objPoClienteEstilo.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                        objPoClienteEstilo.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                        objPoClienteEstilo.IdPo = int.Parse(oReader["IdPO"].ToString());
                                        objPoClienteEstilo.IdEstilo = int.Parse(oReader["IdEstilo"].ToString());
                                        objPoClienteEstilo.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                                        //objPoClienteEstilo.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                                        //objPoClienteEstilo.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                                        //objPoClienteEstilo.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                                        //objPoClienteEstilo.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                        objPoClienteEstilo.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                                        //objPoClienteEstilo.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                                        //objPoClienteEstilo.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                                        //objPoClienteEstilo.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());
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
                                        //objPoClienteEstilo.Monto = decimal.Parse(oReader["Monto"].ToString());
                                        //objPoClienteEstilo.Costo = decimal.Parse(oReader["Costo"].ToString());
                                        //objPoClienteEstilo.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                                        //objPoClienteEstilo.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                                        objPoClienteEstilo.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                                        objPoClienteEstilo.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                                        objPoClienteEstilo.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                                        objPoClienteEstilo.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                                        objPoClienteEstilo.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                                        //objPoClienteEstilo.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                                        objPoClienteEstilo.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                                        objPoClienteEstilo.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                                        objPoClienteEstilo.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                                        //objPoClienteEstilo.Hts = oReader["Hts"].ToString();
                                        //objPoClienteEstilo.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                                        //objPoClienteEstilo.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                                        //objPoClienteEstilo.SaldoCantidadRequerida = int.Parse(oReader["SaldoCantidadRequerida"].ToString());
                                        //objPoClienteEstilo.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());
                                        objPoClienteEstilo.CodigoEstilo = oReader["CodigoEstilo"].ToString();
                                        objPoClienteEstilo.DescripcionEstilo = oReader["DescripcionEstilo"].ToString();
                                        objPoClienteEstilo.NombreProveedor = oReader["NombreProveedor"].ToString();
                                        objPoClienteEstilo.ComentarioContramuestra = oReader["ComentarioContramuestra"].ToString();
                                        //objPoClienteEstilo.NombreTipoPoClienteEstilo = oReader["NombreTipoPo"].ToString();
                                        //objPoClienteEstilo.RegistroExistente = 1;

                                        listaPoClienteEstilo.Add(objPoClienteEstilo);
                                    }
                                    oReader.Close();
                                    item.PoClienteEstilo = listaPoClienteEstilo;
                                }
                            }

                            // 
                            foreach (var item in listaPoCliente)
                            {
                                foreach (var itemPoClienteEstilo in item.PoClienteEstilo)
                                {
                                    // PoClienteEstiloDestinoSample
                                    cmd = new SqlCommand("usp_PoClienteEstiloDestinoUltimoListarByIdPoClienteEstilo_Sample", con);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    SqlParameter oParametroIdPoClienteEstiloDestino = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                                    oParametroIdPoClienteEstiloDestino.Direction = ParameterDirection.Input;
                                    oParametroIdPoClienteEstiloDestino.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                                    listaPoClienteEstiloDestino = new List<PoClienteEstiloDestinoSample>();
                                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                    if (oReader != null)
                                    {
                                        while (oReader.Read())
                                        {
                                            objPoClienteEstiloDestino = new PoClienteEstiloDestinoSample();
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
                                        cmd = new SqlCommand("usp_PoClienteEstiloDestinoTallaColorUltimoListarByIdPoClienteEstiloDestino_Sample", con);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter oParametroIdPoClienteEstiloDestino1 = cmd.Parameters.Add("@IdPoClienteEstiloDestino", SqlDbType.Int);
                                        oParametroIdPoClienteEstiloDestino1.Direction = ParameterDirection.Input;
                                        oParametroIdPoClienteEstiloDestino1.Value = itemPoClienteEstiloDestino.IdPoClienteEstiloDestino;

                                        listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColorSample>();
                                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                                        if (oReader != null)
                                        {
                                            while (oReader.Read())
                                            {
                                                objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColorSample();
                                                objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestinoTallaColor = int.Parse(oReader["IdPoClienteEstiloDestinoTallaColor"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                                                //objPoClienteEstiloDestinoTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                                                objPoClienteEstiloDestinoTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                                                //objPoClienteEstiloDestinoTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                                                objPoClienteEstiloDestinoTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                                                objPoClienteEstiloDestinoTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                                                //objPoClienteEstiloDestinoTallaColor.RegistroExistente = 1;

                                                listaPoClienteEstiloDestinoTallaColor.Add(objPoClienteEstiloDestinoTallaColor);
                                            }
                                            oReader.Close();
                                            itemPoClienteEstiloDestino.ListaPoClienteEstiloDestinoTallaColor = listaPoClienteEstiloDestinoTallaColor;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion

                    // :EDU PENDIENTE PARA GARMENT/ESTILOS
                    #region LISTA PoClienteEstiloSample POR IDPO
                    listaPoClienteEstilo = new List<PoClienteEstiloSample>();
                    cmd = new SqlCommand("usp_PoClienteEstiloUltimoListarByIdPo_Sample", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    oParametroIdPo = cmd.Parameters.Add("@IdPo", SqlDbType.Int);
                    oParametroIdPo.Direction = ParameterDirection.Input;
                    oParametroIdPo.Value = pIdPo;

                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoClienteEstilo = new PoClienteEstiloSample();
                            objPoClienteEstilo.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                            objPoClienteEstilo.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoClienteEstilo.IdPo = int.Parse(oReader["IdPO"].ToString());
                            objPoClienteEstilo.IdEstilo = int.Parse(oReader["IdEstilo"].ToString());
                            objPoClienteEstilo.IdProveedor = int.Parse(oReader["IdProveedor"].ToString());
                            //objPoClienteEstilo.IdTipoPrecio = int.Parse(oReader["IdTipoPrecio"].ToString());
                            //objPoClienteEstilo.IdFlete = int.Parse(oReader["IdFlete"].ToString());
                            //objPoClienteEstilo.IdFormaEnvio = int.Parse(oReader["IdFormaEnvio"].ToString());
                            //objPoClienteEstilo.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                            objPoClienteEstilo.IdDivisionCliente = int.Parse(oReader["IdDivisionCliente"].ToString());
                            //objPoClienteEstilo.IdDivisionAsociado = int.Parse(oReader["IdDivisionAsociado"].ToString());
                            //objPoClienteEstilo.IdEstadoPoCliente = int.Parse(oReader["IdEstadoPoCliente"].ToString());
                            //objPoClienteEstilo.IdEstadoRegistro = int.Parse(oReader["IdEstadoRegistro"].ToString());
                            objPoClienteEstilo.FechaDespachoFabrica = DateTime.Parse(oReader["FechaDespachoFabrica"].ToString());
                            objPoClienteEstilo.FechaDespachoCliente = DateTime.Parse(oReader["FechaDespachoCliente"].ToString());
                            objPoClienteEstilo.FechaEntregaCliente = DateTime.Parse(oReader["FechaEntregaCliente"].ToString());
                            objPoClienteEstilo.FechaDespachoFabricaUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoFabricaUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoFabricaUPT"].ToString());
                            objPoClienteEstilo.FechaDespachoClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaDespachoClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaDespachoClienteUPT"].ToString());
                            objPoClienteEstilo.FechaEntregaClienteUPT = oReader.IsDBNull(oReader.GetOrdinal("FechaEntregaClienteUPT")) ? (DateTime?)null : DateTime.Parse(oReader["FechaEntregaClienteUPT"].ToString());
                            //objPoClienteEstilo.Monto = decimal.Parse(oReader["Monto"].ToString());
                            //objPoClienteEstilo.Costo = decimal.Parse(oReader["Costo"].ToString());
                            //objPoClienteEstilo.MontoLST = decimal.Parse(oReader["MontoLST"].ToString());
                            //objPoClienteEstilo.CostoLST = decimal.Parse(oReader["CostoLST"].ToString());
                            objPoClienteEstilo.PrecioCliente = decimal.Parse(oReader["PrecioCliente"].ToString());
                            objPoClienteEstilo.PrecioFabrica = decimal.Parse(oReader["PrecioFabrica"].ToString());
                            objPoClienteEstilo.PrecioClienteUPT = decimal.Parse(oReader["PrecioClienteUPT"].ToString());
                            objPoClienteEstilo.PrecioFabricaUPT = decimal.Parse(oReader["PrecioFabricaUPT"].ToString());
                            objPoClienteEstilo.CantidadRequerida = decimal.Parse(oReader["CantidadRequerida"].ToString());
                            //objPoClienteEstilo.CantidadDespachada = decimal.Parse(oReader["CantidadDespachada"].ToString());
                            objPoClienteEstilo.CantidadRequeridaLST = decimal.Parse(oReader["CantidadRequeridaLST"].ToString());
                            objPoClienteEstilo.ComentarioFabrica = oReader["ComentarioFabrica"].ToString();
                            objPoClienteEstilo.InstruccionEmpaque = oReader["InstruccionEmpaque"].ToString();
                            //objPoClienteEstilo.Hts = oReader["Hts"].ToString();
                            //objPoClienteEstilo.IdTipoPo = int.Parse(oReader["IdTipoPo"].ToString());
                            //objPoClienteEstilo.EstadoPo = int.Parse(oReader["EstadoPo"].ToString());
                            //objPoClienteEstilo.SaldoCantidadRequerida = int.Parse(oReader["SaldoCantidadRequerida"].ToString());
                            //objPoClienteEstilo.CartonLabel = int.Parse(oReader["CartonLabel"].ToString());
                            objPoClienteEstilo.CodigoEstilo = oReader["CodigoEstilo"].ToString();
                            objPoClienteEstilo.DescripcionEstilo = oReader["DescripcionEstilo"].ToString();
                            objPoClienteEstilo.NombreProveedor = oReader["NombreProveedor"].ToString();
                            //objPoClienteEstilo.NombreTipoPoClienteEstilo = oReader["NombreTipoPo"].ToString();
                            objPoClienteEstilo.CodigoTela = oReader["CodigoTela"].ToString();
                            objPoClienteEstilo.NombreTela = oReader["NombreTela"].ToString();
                            //objPoClienteEstilo.DescripcionFormaEnvio = oReader["DescripcionFormaEnvio"].ToString();
                            objPoClienteEstilo.ProveedorDireccion = oReader["ProveedorDireccion"].ToString();
                            objPoClienteEstilo.ProveedorTelefono1 = oReader["ProveedorTelefono1"].ToString();
                            objPoClienteEstilo.ImagenNombre = oReader["ImagenNombre"].ToString();
                            objPoClienteEstilo.ImagenWebNombre = oReader["ImagenWebNombre"].ToString();
                            objPoClienteEstilo.ComentarioContramuestra = oReader["ComentarioContramuestra"].ToString();
                            //objPoClienteEstilo.RegistroExistente = 1;

                            listaPoClienteEstilo.Add(objPoClienteEstilo);
                        }
                        oReader.Close();
                        objPo.ListaPoClienteEstilo = listaPoClienteEstilo;
                    }

                    foreach (var itemPoClienteEstilo in objPo.ListaPoClienteEstilo)
                    {
                        // PoClienteEstiloDestinoSample
                        cmd = new SqlCommand("usp_PoClienteEstiloDestinoUltimoListarByIdPoClienteEstilo_Sample", con);
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlParameter oParametroIdPoClienteEstiloDestino = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
                        oParametroIdPoClienteEstiloDestino.Direction = ParameterDirection.Input;
                        oParametroIdPoClienteEstiloDestino.Value = itemPoClienteEstilo.IdPoClienteEstilo;

                        listaPoClienteEstiloDestino = new List<PoClienteEstiloDestinoSample>();
                        oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                        if (oReader != null)
                        {
                            while (oReader.Read())
                            {
                                objPoClienteEstiloDestino = new PoClienteEstiloDestinoSample();
                                objPoClienteEstiloDestino.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                                objPoClienteEstiloDestino.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                                objPoClienteEstiloDestino.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                                objPoClienteEstiloDestino.IdPo = int.Parse(oReader["IdPo"].ToString());
                                objPoClienteEstiloDestino.IdClienteDireccion = int.Parse(oReader["IdClienteDireccion"].ToString());
                                objPoClienteEstiloDestino.CantidadRequerida = int.Parse(oReader["CantidadRequerida"].ToString());
                                objPoClienteEstiloDestino.DescripcionDireccion = oReader["DescripcionDireccion"].ToString();
                                //objPoClienteEstiloDestino.RegistroExistente = 1;

                                listaPoClienteEstiloDestino.Add(objPoClienteEstiloDestino);
                            }
                            oReader.Close();
                            itemPoClienteEstilo.PoClienteEstiloDestino = listaPoClienteEstiloDestino;
                        }
                    }

                    // OBTENER TODOS LOS PoClienteEstiloDestinoTallaColorSample POR IDPO
                    cmd = new SqlCommand("usp_PoClienteEstiloDestinoTallaColorUltimoListarByIdPo_Sample", con);
                    cmd.CommandType = CommandType.StoredProcedure;

                    oParametroIdPo = cmd.Parameters.Add("@IdPo", SqlDbType.Int);
                    oParametroIdPo.Direction = ParameterDirection.Input;
                    oParametroIdPo.Value = pIdPo;

                    listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColorSample>();
                    oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);
                    if (oReader != null)
                    {
                        while (oReader.Read())
                        {
                            objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColorSample();
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestinoTallaColor = int.Parse(oReader["IdPoClienteEstiloDestinoTallaColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloDestino = int.Parse(oReader["IdPoClienteEstiloDestino"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                            //objPoClienteEstiloDestinoTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                            objPoClienteEstiloDestinoTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                            objPoClienteEstiloDestinoTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                            //objPoClienteEstiloDestinoTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                            objPoClienteEstiloDestinoTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                            objPoClienteEstiloDestinoTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                            //objPoClienteEstiloDestinoTallaColor.RegistroExistente = 1;

                            listaPoClienteEstiloDestinoTallaColor.Add(objPoClienteEstiloDestinoTallaColor);
                        }
                        oReader.Close();
                        objPo.ListaPoClienteEstiloDestinoTallaColor = listaPoClienteEstiloDestinoTallaColor;
                    }
                    #endregion
                    
                    objPo.PoCliente = listaPoCliente;
                }
            }

            return objPo;
        }

        public List<PoClienteEstiloDestinoTallaColorSample> GetListaPoClienteEstiloDestinoTallaColor(SqlConnection con, int pIdPoClienteEstilo)
        {
            PoClienteEstiloDestinoTallaColorSample objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColorSample();
            List<PoClienteEstiloDestinoTallaColorSample> listaPoClienteEstiloDestinoTallaColor = new List<PoClienteEstiloDestinoTallaColorSample>();

            SqlCommand cmd = new SqlCommand("usp_GetPoClienteEstiloDestinoTallaColorByIdPoClienteEstilo_SamplePdf", con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter paramIdPoClienteEstilo = cmd.Parameters.Add("@IdPoClienteEstilo", SqlDbType.Int);
            paramIdPoClienteEstilo.Direction = ParameterDirection.Input;
            paramIdPoClienteEstilo.Value = pIdPoClienteEstilo;

            SqlDataReader oReader = cmd.ExecuteReader(CommandBehavior.SingleResult);

            if (oReader != null)
            {
                while (oReader.Read())
                {
                    objPoClienteEstiloDestinoTallaColor = new PoClienteEstiloDestinoTallaColorSample();
                    //objPoClienteEstiloDestinoTallaColor.IdPoClienteEstiloTallaColor = int.Parse(oReader["IdPoClienteEstiloTallaColor"].ToString());
                    objPoClienteEstiloDestinoTallaColor.IdPoClienteEstilo = int.Parse(oReader["IdPoClienteEstilo"].ToString());
                    objPoClienteEstiloDestinoTallaColor.IdPoCliente = int.Parse(oReader["IdPoCliente"].ToString());
                    objPoClienteEstiloDestinoTallaColor.IdPo = int.Parse(oReader["IdPo"].ToString());
                    //objPoClienteEstiloDestinoTallaColor.IdTipoColor = int.Parse(oReader["IdTipoColor"].ToString());
                    objPoClienteEstiloDestinoTallaColor.IdClienteColor = int.Parse(oReader["IdClienteColor"].ToString());
                    objPoClienteEstiloDestinoTallaColor.IdClienteTalla = int.Parse(oReader["IdClienteTalla"].ToString());
                    objPoClienteEstiloDestinoTallaColor.Cantidad = int.Parse(oReader["Cantidad"].ToString());
                    //objPoClienteEstiloDestinoTallaColor.NombreTipoColor = oReader["NombreEstado"].ToString();
                    objPoClienteEstiloDestinoTallaColor.NombreClienteColor = oReader["NombreClienteColor"].ToString();
                    objPoClienteEstiloDestinoTallaColor.NombreClienteTalla = oReader["NombreClienteTalla"].ToString();
                    //objPoClienteEstiloDestinoTallaColor.RegistroExistente = 1;

                    listaPoClienteEstiloDestinoTallaColor.Add(objPoClienteEstiloDestinoTallaColor);
                }
                oReader.Close();
            }

            return listaPoClienteEstiloDestinoTallaColor;
        }
    }
}
