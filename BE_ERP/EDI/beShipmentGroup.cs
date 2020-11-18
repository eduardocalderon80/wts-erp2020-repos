using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beShipmentGroup
    {
        public int Shipment_Group_ID { get; set; }
        public int Company_ID { get; set; }
        public int File_ID { get; set; }
        public string CreationDate { get; set; }
        public string Created_By { get; set; }
        public string Status { get; set; }
    }
}
