using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beConfigurationSegment
    {
        public int Configuration_ID { get; set; }
        public int Configuration_Segment_ID { get; set; }
        public string Section_Code { get; set; }
        public string Segment_Code { get; set; }
        public string Segment_Requirement { get; set; }
        public int Segment_Order { get; set; }
        public int NumberOfElements { get; set; }
    }
}
