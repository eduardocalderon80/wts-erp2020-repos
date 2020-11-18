using System;
using System.Data;
using System.Data.SqlClient;
using BE_ERP;

namespace DAL_ERP
{
    public class daMail
    {
        public int sendMail(beMailSQL oMailSQL, SqlConnection con)
        {
            string sp = "usp_SendEmail";
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;

            SqlParameter preturn = new SqlParameter();
            preturn.ParameterName = "@returncode";
            preturn.DbType = DbType.Int32;            
            preturn.Direction = ParameterDirection.Output;

            cmd.Parameters.Add(preturn);
            cmd.Parameters.Add("@to_address_mail", SqlDbType.VarChar, 8000).Value=oMailSQL.to_address.Trim().Replace(",",";");
            cmd.Parameters.Add("@subject_mail", SqlDbType.VarChar, 5000).Value = oMailSQL.subject.Trim();
            cmd.Parameters.Add("@body_mail", SqlDbType.VarChar, -1).Value = oMailSQL.body.Trim();
            cmd.Parameters.Add("@file_attachments_mail", SqlDbType.VarChar, 8000).Value = oMailSQL.file_attachments.Trim();

            int iresult = cmd.ExecuteNonQuery();            
            int returncode = int.Parse(preturn.Value.ToString());
            return returncode;
        }

        public int sendMail_Bandeja(beMailSQL oMailSQL, SqlConnection con)
        {
            string sp = "usp_SendEmailBandeja";
            SqlCommand cmd = new SqlCommand(sp, con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.Add("@codigo_usuario", SqlDbType.VarChar, 100).Value = oMailSQL.codigo_usuario.Trim();
            cmd.Parameters.Add("@correo_usuario", SqlDbType.VarChar, 100).Value = oMailSQL.correo_usuario.Trim();

            cmd.Parameters.Add("@to_address_mail", SqlDbType.VarChar, 8000).Value = oMailSQL.to_address.Trim().Replace(",",";");
            cmd.Parameters.Add("@subject_mail", SqlDbType.VarChar, 5000).Value = oMailSQL.subject.Trim().Replace(",", ";");
            cmd.Parameters.Add("@body_mail", SqlDbType.VarChar, -1).Value = oMailSQL.body.Trim();
            cmd.Parameters.Add("@file_attachments_mail", SqlDbType.VarChar, 8000).Value = oMailSQL.file_attachments.Trim();
            
            cmd.Parameters.Add("@copy_recipients_mail", SqlDbType.VarChar, 5000).Value = oMailSQL.copiacorreo.Trim();
            cmd.Parameters.Add("@copia_hide_mail", SqlDbType.VarChar, 300).Value = oMailSQL.copiacorreo_oculta.Trim();
            cmd.Parameters.Add("@correo_from", SqlDbType.VarChar, 5000).Value = oMailSQL.from.Trim();
            
            int iresult = cmd.ExecuteNonQuery();            
            return iresult;
        }
    }
}
