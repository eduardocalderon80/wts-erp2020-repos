using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
namespace DAL_ERP
{
    public class daEDIFile
    {
        public int SaveFile(beEDIFile obeEDIFile, SqlConnection cn, SqlTransaction ts = null)
        {
            int file_ID = 0;
            string storeProcedure = "sp_EDIFile_Insert";
            SqlCommand cmd = new SqlCommand(storeProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@File_Name", SqlDbType.VarChar, 200);
            par1.Direction = ParameterDirection.Input;
            par1.Value = obeEDIFile.File_Name;
            SqlParameter par2 = cmd.Parameters.Add("@File_Path", SqlDbType.VarChar, 200);
            par2.Direction = ParameterDirection.Input;
            par2.Value = obeEDIFile.File_Path;
            SqlParameter par3 = cmd.Parameters.Add("@Status_ID", SqlDbType.VarChar);
            par3.Direction = ParameterDirection.Input;
            par3.Value = obeEDIFile.Status_ID;
            SqlParameter par4 = cmd.Parameters.Add("@Process_ID", SqlDbType.VarChar);
            par4.Direction = ParameterDirection.Input;
            par4.Value = obeEDIFile.Process_ID;
            SqlParameter par5 = cmd.Parameters.Add("@Company_ID", SqlDbType.Int);
            par5.Direction = ParameterDirection.Input;
            par5.Value = obeEDIFile.Company_ID;
            SqlParameter par6 = cmd.Parameters.Add("@@IDENTITY", SqlDbType.Int);
            par6.Direction = ParameterDirection.ReturnValue;
            int result = cmd.ExecuteNonQuery();
            file_ID = (int)par6.Value;
            return file_ID;
        }
        public bool SaveFileLine(beEDIFile obeEDIFile, SqlConnection cn, SqlTransaction ts = null)
        {
            int result = 0;
            string storeProcedure = "sp_EDIFile_Line_Insert";
            SqlCommand cmd = new SqlCommand(storeProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@File_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            SqlParameter par2 = cmd.Parameters.Add("@Line_Text", SqlDbType.VarChar);
            par2.Direction = ParameterDirection.Input;
            SqlParameter par3 = cmd.Parameters.Add("@Line_Number", SqlDbType.Int);
            par3.Direction = ParameterDirection.Input;
            par1.Value = obeEDIFile.File_ID;
            foreach (beEDIFileLine line in obeEDIFile.FileLine)
            {
                par2.Value = line.Line_Text;
                par3.Value = line.Line_Number;
                result = cmd.ExecuteNonQuery();
            }
            return result > 0;
        }
        
        public bool SaveFileData(beEDIFile obeEDIFile, SqlConnection cn, SqlTransaction ts = null)
        {
            int resul = 0;
            string StoreProcedure = "sp_EDI_File_Data_Insert";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@File_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            SqlParameter par2 = cmd.Parameters.Add("@Section_Code", SqlDbType.VarChar);
            par2.Direction = ParameterDirection.Input;
            SqlParameter par3 = cmd.Parameters.Add("@Segment_Code", SqlDbType.VarChar);
            par3.Direction = ParameterDirection.Input;
            SqlParameter par4 = cmd.Parameters.Add("@Element_Code", SqlDbType.VarChar);
            par4.Direction = ParameterDirection.Input;
            SqlParameter par5 = cmd.Parameters.Add("@Element_Value", SqlDbType.VarChar);
            par5.Direction = ParameterDirection.Input;
            SqlParameter par6 = cmd.Parameters.Add("@Element_Iteration", SqlDbType.Int);
            par6.Direction = ParameterDirection.Input;
            SqlParameter par7 = cmd.Parameters.Add("@Line", SqlDbType.Int);
            par7.Direction = ParameterDirection.Input;
            foreach (beEDIFileData item in obeEDIFile.EdiData)
            {
                par1.Value = obeEDIFile.File_ID;
                par2.Value = item.Section_Code;
                par3.Value = item.Segment_Code;
                par4.Value = item.Element_Code;
                par5.Value = item.Element_Value;
                par6.Value = item.Element_Iteration;
                par7.Value = item.Line;
                resul = cmd.ExecuteNonQuery();
            }
            return resul > 0;
        }
        public bool SaveControl(int Control_Number, int File_ID, string CreatedBy,SqlConnection cn,SqlTransaction ts = null)
        {
            int resul = 0;
            string StoreProcedure = "sp_EDI_Control_Insert";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Control_Number", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Control_Number;
            SqlParameter par2 = cmd.Parameters.Add("@File_ID", SqlDbType.Int);
            par2.Direction = ParameterDirection.Input;
            par2.Value = File_ID;
            SqlParameter par3 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);
            par3.Direction = ParameterDirection.Input;
            par3.Value = CreatedBy;
            resul = cmd.ExecuteNonQuery();
            return resul > 0;
        }
        public bool SaveControlGroup(int Control_Number,int Control_Group_Number,string CreatedBy,SqlConnection cn , SqlTransaction ts = null) {
            int resul = 0;
            string StoreProcedure = "sp_EDI_Control_Group_Insert";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Control_Number", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Control_Number;
            SqlParameter par2 = cmd.Parameters.Add("@Control_Group_Number", SqlDbType.Int);
            par2.Direction = ParameterDirection.Input;
            par2.Value = Control_Group_Number;
            SqlParameter par3 = cmd.Parameters.Add("@Created_By", SqlDbType.VarChar);
            par3.Direction = ParameterDirection.Input;
            par3.Value = CreatedBy;
            resul = cmd.ExecuteNonQuery();
            return resul > 0;
        }

        public bool UpdateEDIFile_Status(int FileID, string Status, int Response_FileID, SqlConnection cn, SqlTransaction ts = null)
        {
            int resul = 0;
            string StoreProcedure = "sp_EDIFile_UpdateFileStatus";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@File_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = FileID;
            SqlParameter par2 = cmd.Parameters.Add("@Status", SqlDbType.VarChar);
            par2.Direction = ParameterDirection.Input;
            par2.Value = Status;
            SqlParameter par3 = cmd.Parameters.Add("@Response_File_ID", SqlDbType.VarChar);
            par3.Direction = ParameterDirection.Input;
            par3.Value = Response_FileID;
            resul = cmd.ExecuteNonQuery();
            return resul > 0;
        }
    }
}
