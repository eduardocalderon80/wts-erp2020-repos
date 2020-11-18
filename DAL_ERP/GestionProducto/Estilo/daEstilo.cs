using System;
using System.Data;
using System.Collections;
using System.Data.SqlClient;
using BE_ERP.GestionProducto;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data.SqlTypes;

namespace DAL_ERP.GestionProducto
{
    public class daEstilo
    {
        public int Save(SqlConnection con, SqlTransaction transaction,Estilo oEstilo)
        {
            SqlCommand cmd = new SqlCommand("uspEstiloGuardar", con, transaction);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter preturn = new SqlParameter();
            preturn.ParameterName = "@return";
            preturn.DbType = DbType.Int32;
            preturn.Direction = ParameterDirection.Output;

            cmd.Parameters.Add("@estilo", SqlDbType.VarChar).Value = oEstilo.EstiloJSON;
            cmd.Parameters.Add("@callout", SqlDbType.VarChar).Value = oEstilo.CalloutJSON;
            cmd.Parameters.Add("@fabric", SqlDbType.VarChar).Value = oEstilo.FabricJSON;
            cmd.Parameters.Add("@process", SqlDbType.VarChar).Value = oEstilo.ProcessJSON;
            cmd.Parameters.Add("@artwork", SqlDbType.VarChar).Value = oEstilo.ArtworkJSON;
            cmd.Parameters.Add("@artworkfile", SqlDbType.VarChar).Value = oEstilo.ArtworkFileJSON;
            cmd.Parameters.Add("@trim", SqlDbType.VarChar).Value = oEstilo.TrimJSON;
            cmd.Parameters.Add("@processcolor", SqlDbType.VarChar).Value = oEstilo.ProcessColorJSON;
            cmd.Parameters.Add("@artworkcolor", SqlDbType.VarChar).Value = oEstilo.ArtworkColorJSON;
            cmd.Parameters.Add("@trimcolor", SqlDbType.VarChar).Value = oEstilo.TrimColorJSON;
            cmd.Parameters.Add("@procesoE", SqlDbType.VarChar).Value = oEstilo.ProcessE;
            cmd.Parameters.Add("@artworkE", SqlDbType.VarChar).Value = oEstilo.ArtworkE;
            cmd.Parameters.Add("@trimE", SqlDbType.VarChar).Value = oEstilo.TrimE;
            cmd.Parameters.Add("@processcolorE", SqlDbType.VarChar).Value = oEstilo.ProcessColorE;
            cmd.Parameters.Add("@artworkcolorE", SqlDbType.VarChar).Value = oEstilo.ArtworkColorE;
            cmd.Parameters.Add("@trimcolorE", SqlDbType.VarChar).Value = oEstilo.TrimColorE;
            cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = oEstilo.Usuario;
            cmd.Parameters.Add("@idempresa", SqlDbType.VarChar).Value = oEstilo.Empresa;
            cmd.Parameters.Add("@estiloxcombojson", SqlDbType.VarChar).Value = oEstilo.EstiloxComboJSON;
            cmd.Parameters.Add("@estiloxcombocolorjson", SqlDbType.VarChar).Value = oEstilo.EstiloxComboColorJSON;
            cmd.Parameters.Add("@estiloxfabriccombojson", SqlDbType.VarChar).Value = oEstilo.EstiloxFabricComboJSON;
            cmd.Parameters.Add("@estiloxfabriccombocolorjson", SqlDbType.VarChar).Value = oEstilo.EstiloxFabricComboColorJSON;
            cmd.Parameters.Add("@estilotechpack", SqlDbType.VarChar).Value = oEstilo.estilotechpack;
            cmd.Parameters.Add(preturn);
            
            int iresult = cmd.ExecuteNonQuery();
            int idvalue = iresult > 0 ? int.Parse(preturn.Value.ToString()) : 0;
            transaction.Commit();
            return idvalue;
        }

        public int Save_edit_estilo(SqlConnection con, SqlTransaction transaction, Estilo oEstilo)
        {
            SqlCommand cmd = new SqlCommand("uspEstiloGuardar_update", con, transaction);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@estilo", SqlDbType.VarChar).Value = oEstilo.EstiloJSON;
            cmd.Parameters.Add("@callout", SqlDbType.VarChar).Value = oEstilo.CalloutJSON;
            cmd.Parameters.Add("@fabric", SqlDbType.VarChar).Value = oEstilo.FabricJSON;
            cmd.Parameters.Add("@telascolor", SqlDbType.VarChar).Value = oEstilo.TelasColorJSON;
            cmd.Parameters.Add("@process", SqlDbType.VarChar).Value = oEstilo.ProcessJSON;
            cmd.Parameters.Add("@artwork", SqlDbType.VarChar).Value = oEstilo.ArtworkJSON;
            cmd.Parameters.Add("@artworkfile", SqlDbType.VarChar).Value = oEstilo.ArtworkFileJSON;
            cmd.Parameters.Add("@trim", SqlDbType.VarChar).Value = oEstilo.TrimJSON;
            cmd.Parameters.Add("@processcolor", SqlDbType.VarChar).Value = oEstilo.ProcessColorJSON;
            cmd.Parameters.Add("@artworkcolor", SqlDbType.VarChar).Value = oEstilo.ArtworkColorJSON;
            cmd.Parameters.Add("@trimcolor", SqlDbType.VarChar).Value = oEstilo.TrimColorJSON;
            cmd.Parameters.Add("@procesoE", SqlDbType.VarChar).Value = oEstilo.ProcessE;
            cmd.Parameters.Add("@artworkE", SqlDbType.VarChar).Value = oEstilo.ArtworkE;
            cmd.Parameters.Add("@trimE", SqlDbType.VarChar).Value = oEstilo.TrimE;
            cmd.Parameters.Add("@processcolorE", SqlDbType.VarChar).Value = oEstilo.ProcessColorE;
            cmd.Parameters.Add("@artworkcolorE", SqlDbType.VarChar).Value = oEstilo.ArtworkColorE;
            cmd.Parameters.Add("@trimcolorE", SqlDbType.VarChar).Value = oEstilo.TrimColorE;
            cmd.Parameters.Add("@usuario", SqlDbType.VarChar).Value = oEstilo.Usuario;
            cmd.Parameters.Add("@idempresa", SqlDbType.VarChar).Value = oEstilo.Empresa;
            cmd.Parameters.Add("@estiloxcombojson", SqlDbType.VarChar).Value = oEstilo.EstiloxComboJSON;
            cmd.Parameters.Add("@estiloxcombocolorjson", SqlDbType.VarChar).Value = oEstilo.EstiloxComboColorJSON;
            cmd.Parameters.Add("@estiloxfabriccombojson", SqlDbType.VarChar).Value = oEstilo.EstiloxFabricComboJSON;
            cmd.Parameters.Add("@estiloxfabriccombocolorjson", SqlDbType.VarChar).Value = oEstilo.EstiloxFabricComboColorJSON;
            cmd.Parameters.Add("@estilotechpack", SqlDbType.VarChar).Value = oEstilo.estilotechpack;

            int iresult = cmd.ExecuteNonQuery();
            transaction.Commit();
            return iresult;
        }
         
        public PdChart GetPdChart(SqlConnection con, string sp, string par)
        {
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@par", SqlDbType.VarChar).Value = par;

            SqlDataReader oreader = cmd.ExecuteReader(CommandBehavior.SingleRow);

            PdChart pdchart = null;
            if (oreader != null)
            {
                if (oreader.Read())
                {
                    pdchart = new PdChart();

                   //estilos telas   colorfichatecnica proceso procesocolor artwork artworkcolor trim    trimColor requerimientos  requerimientodetalle
                    pdchart.estilos = oreader["estilos"].ToString();
                    pdchart.telas = oreader["telas"].ToString();
                    pdchart.colorfichatecnica = oreader["colorfichatecnica"].ToString();
                    pdchart.colorproyectotela = oreader["colorproyectotela"].ToString();
                    pdchart.proyectotelaproceso = oreader["proyectotelaproceso"].ToString();
                    pdchart.proceso = oreader["proceso"].ToString();
                    pdchart.procesocolor = oreader["procesocolor"].ToString();
                    pdchart.artwork = oreader["artwork"].ToString();
                    pdchart.artworkcolor = oreader["artworkcolor"].ToString();
                    pdchart.trim = oreader["trim"].ToString();
                    pdchart.trimcolor = oreader["trimcolor"].ToString();
                    pdchart.requerimientos = oreader["requerimientos"].ToString();
                    pdchart.requerimientodetalle = oreader["requerimientodetalle"].ToString();
                    pdchart.requerimientocomentario = oreader["requerimientocomentario"].ToString();
                    pdchart.titulos_columnas_reporte = oreader["titulos_columnas_reporte"].ToString();
                    pdchart.callout = oreader["callout"].ToString();
                    pdchart.estiloxcombo = oreader["estiloxcombo"].ToString();
                    pdchart.estiloxcombocolor = oreader["estiloxcombocolor"].ToString();
                    pdchart.estiloxfabriccombo = oreader["estiloxfabriccombo"].ToString();
                    pdchart.estiloxfabriccombocolor = oreader["estiloxfabriccombocolor"].ToString();
                }

                oreader.Close();
            }
            return pdchart;
        }

        public int Migrar(SqlConnection cnx, SqlTransaction trx, Estilo oEstilo)
        {
            SqlCommand cmd = new SqlCommand("usp_Estilo_MigrarIntranet", cnx, trx);
            cmd.CommandType = CommandType.StoredProcedure;
             
            cmd.Parameters.Add("@Estilo", SqlDbType.VarChar).Value = oEstilo.EstiloJSON;
            cmd.Parameters.Add("@Imagen", SqlDbType.VarBinary).Value = oEstilo.imagenbyte ==  null ? SqlBinary.Null : oEstilo.imagenbyte;
            cmd.Parameters.Add("@Color", SqlDbType.VarChar).Value = oEstilo.ColorJSON;
         
            int iresult = cmd.ExecuteNonQuery();         
            int idvalue = iresult > 0 ? iresult : 0;
            trx.Commit();
            return idvalue;
        }
    }
}
