using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beEDIFileData
    {
        public int ID { get; set; }
        public int File_ID { get; set; }
        public string Section_Code { get; set; }
        public string Segment_Code { get; set; }
        public string Element_Code { get; set; }
        public string Element_Value { get; set; }
        
        public int Line { get; set; }
        public string Description { get; set; }
        public bool DeleteElement { get; set; }
        //private string _Description;
        
        public bool Checked { get; set; }
        public int Element_Iteration { get; set; }
        public int ISA_ID { get; set; }
        public int GS_ID { get; set; }
        public int ST_ID { get; set;}
        public int Detail_ID { get; set; }
    }
}
