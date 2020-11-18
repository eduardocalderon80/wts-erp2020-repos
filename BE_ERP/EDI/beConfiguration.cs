using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beConfiguration
    {
        public int Configuration_ID { get; set; }
        public string Configuration_Description { get; set; }
        public string Configuration_CreationDate { get; set; }
        public string Configuration_CreatedBy { get; set; }
        public string Configuration_ModificationDate { get; set; }
        public string Configuration_ModifiedBy { get; set; }
        public int Company_ID { get; set; }
        public string Document_Code { get; set; }
        public string Document_Encode { get; set; }
        public string Document_Extension { get; set; }
        public beConfigurationSymbol Symbol { get; set; }
        public List<beConfigurationElement> Elements { get; set; }
        public List<beConfigurationElement> DefaultValues { get; set; }
        public List<beConfigurationElement> MultiplesValues { get; set; }
        public List<beConfigurationSegment> NumberOfElementBySegment { get; set; }
        public List<beConfigurationSegment> Segments { get; set; }
        public List<beConfigurationElement> SectionSegment { get; set; }
    }
}
