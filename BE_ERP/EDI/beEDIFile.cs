using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beEDIFile
    {
        public int File_ID { get; set; }
        public string File_Name { get; set; }
        public string File_Path { get; set; }
        public string File_PathASN { get; set; }
        public string File_Date { get; set; }
        public string Status_ID { get; set; }
        public string Process_ID { get; set; }
        public byte[] File { get; set; }
        public int Company_ID { get; set; }
        public List<beEDIFileLine> FileLine { get; set; }
        public List<beEDIFileData> EdiData { get; set; }
        //public beMonitorEDI MonitorEDI { get; set; }
        public int ControlID { get; set; }
        public int ControlGroupID { get; set; }
        public string PurchaseOrderIDs { get; set; }
        public int ShipmentGroupID { get; set; }
        public int ControlGroupNumber { get; set; }
        public string EDI997Status { get; set; }
    }
}
