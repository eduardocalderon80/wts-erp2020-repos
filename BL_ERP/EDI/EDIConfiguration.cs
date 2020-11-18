using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;

using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
using DAL_ERP;
namespace BL_ERP
{
    public class EDIConfiguration : blLog
    {
        public beConfiguration getConfiguration(int ConfigurationID,bool OnlyRequired)
        {
            beConfiguration obeConfiguration = null;
            try
            {
                daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    obeConfiguration = odaEDIConfiguration.getConfiguration(ConfigurationID, cn);
                    if (obeConfiguration != null)
                    {
                        obeConfiguration.Symbol = odaEDIConfiguration.getConfigurationSymbol(ConfigurationID, cn);
                        obeConfiguration.Elements = odaEDIConfiguration.getConfigurationElement(ConfigurationID, OnlyRequired, cn);
                        obeConfiguration.DefaultValues = odaEDIConfiguration.getConfigurationElementDefaultValues(ConfigurationID, cn);
                        obeConfiguration.NumberOfElementBySegment = odaEDIConfiguration.getConfigurationSegmentNumberOfElements(ConfigurationID, cn);
                        obeConfiguration.Segments = odaEDIConfiguration.getConfigurationSegment(ConfigurationID, cn);
                    }
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obeConfiguration;
        }
        public beConfiguration getConfiguration_forMonitorEDI(int ConfigurationID, bool OnlyRequired) {
            beConfiguration obeConfiguration = null;
            try
            {
                daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    obeConfiguration = odaEDIConfiguration.getConfiguration(ConfigurationID, cn);
                    if (obeConfiguration != null)
                    {
                        obeConfiguration.Symbol = odaEDIConfiguration.getConfigurationSymbol(ConfigurationID, cn);
                        obeConfiguration.Elements = odaEDIConfiguration.getConfigurationElement(ConfigurationID, OnlyRequired, cn);
                        obeConfiguration.DefaultValues = odaEDIConfiguration.getConfigurationElementDefaultValues(ConfigurationID, cn);
                        obeConfiguration.SectionSegment = odaEDIConfiguration.getConfiguration_SectionSegment(ConfigurationID, cn);
                        //obeConfiguration.Segments = odaEDIConfiguration.getConfigurationSegment(ConfigurationID, cn);
                    }
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obeConfiguration;
        }
        public List<beConfiguration> getConfigurations(int Company_ID,bool Required)
        {
            List<beConfiguration> Configurations = null;
            try
            {
                daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    Configurations = odaEDIConfiguration.getConfigurations(Company_ID, cn);
                    if (Configurations != null)
                    {
                        foreach (beConfiguration configuration in Configurations)
                        {
                            configuration.Symbol = odaEDIConfiguration.getConfigurationSymbol(configuration.Configuration_ID, cn);
                            configuration.Elements = odaEDIConfiguration.getConfigurationElement(configuration.Configuration_ID, Required, cn);
                            configuration.DefaultValues = odaEDIConfiguration.getConfigurationElementDefaultValues(configuration.Configuration_ID, cn);
                            configuration.Segments = odaEDIConfiguration.getConfigurationSegment(configuration.Configuration_ID, cn);
                            
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Configurations = null;
                GrabarArchivoLog(ex);
            }
            return Configurations;
        }
        public beConfigurationSymbol getConfigurationSymbol(int ConfigurationID)
        {
            beConfigurationSymbol obeConfigurationSymbol = null;
            try
            {
                daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    obeConfigurationSymbol = odaEDIConfiguration.getConfigurationSymbol(ConfigurationID, cn);
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return obeConfigurationSymbol;
        }
        public List<beConfigurationElement> getConfigurationElement(int ConfigurationID,bool Required)
        {
            List<beConfigurationElement> Elements = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    Elements = odaEDIConfiguration.getConfigurationElement(ConfigurationID, Required, cn);
                }
            }
            catch (Exception ex)
            {
                Elements = null;
                GrabarArchivoLog(ex);
            }
            return Elements;
        }
        public List<beConfigurationElement> getConfigurationElementDefaultValues(int ConfigurationID)
        {
            List<beConfigurationElement> Elements = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    Elements = odaEDIConfiguration.getConfigurationElementDefaultValues(ConfigurationID, cn);
                }
            }
            catch (Exception ex)
            {
                Elements = null;
                GrabarArchivoLog(ex);
            }
            return Elements;
        }
        public List<beConfigurationSegment> getConfigurationSegmentNumberOfElements(int Configuration_ID)
        {
            List<beConfigurationSegment> Segments = null;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    Segments = odaEDIConfiguration.getConfigurationSegmentNumberOfElements(Configuration_ID, cn);
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return Segments;
        }
        public int getControlID() {
            int ControlID = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    ControlID = odaEDIConfiguration.getControlID(cn);
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return ControlID;
        }
        public int getControlGroupID()
        {
            int ControlGroupID = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    ControlGroupID = odaEDIConfiguration.getControlGroupID(cn);
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return ControlGroupID;
        }
        public int getShipmentGroupID()
        {
            int ShipmentGroupID = 0;
            try
            {
                using (SqlConnection cn = new SqlConnection(Util.EDI))
                {
                    cn.Open();
                    daEDIConfiguration odaEDIConfiguration = new daEDIConfiguration();
                    ShipmentGroupID = odaEDIConfiguration.getControlGroupID(cn);
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
            }
            return ShipmentGroupID;
        }
    }
}
