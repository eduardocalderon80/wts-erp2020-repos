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
    public class daEDIConfiguration
    {
        public beConfiguration getConfiguration(int ConfigurationID, SqlConnection cn, SqlTransaction ts = null)
        {
            beConfiguration obeConfiguration = null;
            string StoreProcedure = "sp_EDIConfiguration_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ConfigurationID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleRow))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        if (dr.Read())
                        {
                            obeConfiguration = new beConfiguration();
                            obeConfiguration.Configuration_ID = dr.GetInt32(0);
                            obeConfiguration.Configuration_Description = dr.GetString(1);
                            obeConfiguration.Company_ID = dr.GetInt32(2);
                            obeConfiguration.Document_Code = dr.GetString(3);
                            obeConfiguration.Document_Encode = dr.GetString(4);
                            obeConfiguration.Document_Extension = dr.GetString(5);
                        }
                    }
                }
            }
            return obeConfiguration;
        }
        public List<beConfiguration> getConfigurations(int ConfigurationID, SqlConnection cn)
        {
            List<beConfiguration> Configurations = null;
            string StoreProcedure = "sp_EdiConfiguration_Get_by_Company";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Company_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ConfigurationID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Configurations = new List<beConfiguration>();
                        beConfiguration obeConfiguration = null;
                        while (dr.Read())
                        {
                            obeConfiguration = new beConfiguration();
                            obeConfiguration.Configuration_ID = dr.GetInt32(0);
                            obeConfiguration.Configuration_Description = dr.GetString(1);
                            obeConfiguration.Company_ID = dr.GetInt32(2);
                            obeConfiguration.Document_Code = dr.GetString(3);
                            obeConfiguration.Document_Encode = dr.GetString(4);
                            obeConfiguration.Document_Extension = dr.GetString(5);
                            Configurations.Add(obeConfiguration);
                        }
                    }
                }
            }
            return Configurations;
        }
        public beConfigurationSymbol getConfigurationSymbol(int ConfigurationID, SqlConnection cn, SqlTransaction ts = null)
        {
            beConfigurationSymbol obeConfigurationSymbol = null;
            string StoreProcedure = "sp_EDIConfiguration_Symbol_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ConfigurationID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleRow))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        if (dr.Read())
                        {
                            obeConfigurationSymbol = new beConfigurationSymbol();
                            obeConfigurationSymbol.Symbol_SeparatorElement = dr.GetString(0);
                            obeConfigurationSymbol.Symbol_SeparatorSubElement = dr.GetString(1);
                            obeConfigurationSymbol.Symbol_EndSegment = dr.GetString(2);
                            obeConfigurationSymbol.Symbol_Decimal = dr.GetString(3);
                        }
                    }
                }
            }
            return obeConfigurationSymbol;
        }
        public List<beConfigurationElement> getConfigurationElement(int ConfigurationID, bool OnlyRequired, SqlConnection cn, SqlTransaction ts = null)
        {
            List<beConfigurationElement> Elements = null;
            string StoreProcedure = "sp_EDIConfiguration_Element_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ConfigurationID;
            SqlParameter par2 = cmd.Parameters.Add("@Required", SqlDbType.Int);
            par2.Direction = ParameterDirection.Input;
            par2.Value = Convert.ToInt32(OnlyRequired);
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Elements = new List<beConfigurationElement>();
                        beConfigurationElement obeConfigurationElement = null;
                        while (dr.Read())
                        {
                            obeConfigurationElement = new beConfigurationElement();
                            obeConfigurationElement.Section_Code = dr.GetString(0);
                            obeConfigurationElement.Segment_Code = dr.GetString(1);
                            obeConfigurationElement.Element_Code = dr.GetString(2);
                            obeConfigurationElement.Validation_ID = dr.GetInt32(3);
                            obeConfigurationElement.Field_Name = dr.GetString(4);
                            obeConfigurationElement.Mask = dr.GetString(5);
                            obeConfigurationElement.ValidationField_ID = dr.GetInt32(6);
                            obeConfigurationElement.Element_Order = dr.GetInt32(7);
                            obeConfigurationElement.Segment_Order = dr.GetInt32(8);
                            obeConfigurationElement.Element_MinLenght = dr.GetInt32(9);
                            obeConfigurationElement.Element_MaxLenght = dr.GetInt32(10);
                            obeConfigurationElement.Path = dr.GetString(11);
                            obeConfigurationElement.Path_Symbol = dr.GetString(12);
                            obeConfigurationElement.ByElement_Code = dr.GetInt32(13);
                            obeConfigurationElement.Configuration_Element_ID = dr.GetInt32(14);
                            obeConfigurationElement.Configuration_Segment_ID = dr.GetInt32(15);
                            obeConfigurationElement.Element_Requirement = dr.GetString(16);
                            obeConfigurationElement.Segment_Requirement = dr.GetString(17);
                            obeConfigurationElement.Element_EDIDataType = dr.GetString(18);
                            obeConfigurationElement.Element_ValueType = dr.GetString(19);
                            obeConfigurationElement.Element_CanBeNull = dr.GetInt32(20);
                            obeConfigurationElement.System_Element_Required = dr.GetString(21);
                            obeConfigurationElement.System_Element_ValueType = dr.GetString(22);
                            obeConfigurationElement.Segment_Multiple = dr.GetInt32(23);
                            Elements.Add(obeConfigurationElement);
                        }
                    }
                }
            }
            return Elements;
        }
        public List<beConfigurationElement> getConfigurationElementDefaultValues(int ConfigurationID, SqlConnection cn, SqlTransaction ts = null)
        {
            List<beConfigurationElement> Elements = null;
            string StoreProcedure = "sp_EdiConfiguration_ElementDefaultValues_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = ConfigurationID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Elements = new List<beConfigurationElement>();
                        beConfigurationElement obeConfigurationElement = null;
                        while (dr.Read())
                        {
                            obeConfigurationElement = new beConfigurationElement();
                            obeConfigurationElement.Section_Code = dr.GetString(0);
                            obeConfigurationElement.Segment_Code = dr.GetString(1);
                            obeConfigurationElement.Element_Code = dr.GetString(2);
                            obeConfigurationElement.Element_Value = dr.GetString(3);
                            obeConfigurationElement.Element_Order = dr.GetInt32(4);
                            obeConfigurationElement.Configuration_Element_ID = dr.GetInt32(5);
                            obeConfigurationElement.Field_Name = dr.GetString(6);
                            obeConfigurationElement.Value_Required = dr.GetInt32(7);
                            obeConfigurationElement.Configuration_Segment_ID = dr.GetInt32(8);
                            Elements.Add(obeConfigurationElement);
                        }
                    }
                }
            }
            return Elements;
        }
        public List<beConfigurationSegment> getConfigurationSegmentNumberOfElements(int Configuration_ID, SqlConnection cn)
        {
            List<beConfigurationSegment> Segments = null;
            string StoreProcedure = "sp_Configuration_Segments_NumberofElements";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Configuration_ID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Segments = new List<beConfigurationSegment>();
                        beConfigurationSegment obeConfigurationSegment = null;
                        while (dr.Read())
                        {
                            obeConfigurationSegment = new beConfigurationSegment();
                            obeConfigurationSegment.Segment_Code = dr.GetString(0);
                            obeConfigurationSegment.NumberOfElements = dr.GetInt32(1);
                            Segments.Add(obeConfigurationSegment);
                        }
                    }
                }
            }
            return Segments;
        }
        public List<beConfigurationSegment> getConfigurationSegment(int Configuration_ID, SqlConnection cn)
        {
            List<beConfigurationSegment> Segments = null;
            string StoreProcedure = "sp_Configuration_Segment";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Configuration_ID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Segments = new List<beConfigurationSegment>();
                        beConfigurationSegment obeConfigurationSegment = null;
                        while (dr.Read())
                        {
                            obeConfigurationSegment = new beConfigurationSegment();
                            obeConfigurationSegment.Configuration_ID = dr.GetInt32(0);
                            obeConfigurationSegment.Configuration_Segment_ID = dr.GetInt32(1);
                            obeConfigurationSegment.Section_Code = dr.GetString(2);
                            obeConfigurationSegment.Segment_Code = dr.GetString(3);
                            obeConfigurationSegment.Segment_Requirement = dr.GetString(4);
                            obeConfigurationSegment.Segment_Order = dr.GetInt32(5);
                            Segments.Add(obeConfigurationSegment);
                        }
                    }
                }
            }
            return Segments;
        }
        public List<beConfigurationElement> getConfiguration_SectionSegment(int Configuration_ID, SqlConnection cn)
        {
            List<beConfigurationElement> SegmentElement = null;
            string StoreProcedure = "sp_Configuration_SectionSegment_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlParameter par1 = cmd.Parameters.Add("@Configuration_ID", SqlDbType.Int);
            par1.Direction = ParameterDirection.Input;
            par1.Value = Configuration_ID;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        SegmentElement = new List<beConfigurationElement>();
                        beConfigurationElement obeConfigurationElement = null;
                        while (dr.Read())
                        {
                            obeConfigurationElement = new beConfigurationElement();
                            obeConfigurationElement.Section_Code = dr.GetString(0);
                            obeConfigurationElement.Element_Code = dr.GetString(1);
                            obeConfigurationElement.Segment_Requirement = dr.GetString(2);
                            obeConfigurationElement.Segment_Order = dr.GetInt32(3);
                            obeConfigurationElement.Segment_Multiple = dr.GetInt32(4);
                            obeConfigurationElement.Element_Value = dr.GetString(5);
                            SegmentElement.Add(obeConfigurationElement);
                        }
                    }
                }
            }
            return SegmentElement;
        }
        public int getControlID(SqlConnection cn, SqlTransaction ts = null)
        {
            int ControlID = 0;
            string StoreProcedure = "sp_EDI_Control_GET_ID";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            ControlID = (int)cmd.ExecuteScalar();
            return ControlID;
        }
        public int getControlGroupID(SqlConnection cn, SqlTransaction ts = null)
        {
            int ControlGroupID = 0;
            string StoreProcedure = "sp_EDI_Control_Group_GET_ID";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            ControlGroupID = (int)cmd.ExecuteScalar();
            return ControlGroupID;
        }
        public int getShipmentGroupID(SqlConnection cn, SqlTransaction ts = null)
        {
            int ShipmentGroupID = 0;
            string StoreProcedure = "sp_ASN_ShipmentGroup_GET_ID";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.Transaction = ts;
            cmd.CommandType = CommandType.StoredProcedure;
            ShipmentGroupID = (int)cmd.ExecuteScalar();
            return ShipmentGroupID;
        }
    }
}
