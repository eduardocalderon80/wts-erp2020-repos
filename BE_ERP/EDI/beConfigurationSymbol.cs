using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beConfigurationSymbol
    {
        public int Configuration_ID { get; set; }
        public string Symbol_SeparatorElement { get; set; }
        public string Symbol_SeparatorSubElement { get; set; }
        public string Symbol_EndSegment { get; set; }
        public string Symbol_Decimal { get; set; }
    }
}
