using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beConfigurationElement
    {
        public int Configuration_Element_ID { get;set; }
        public int Configuration_ID { get; set; }
        public string Section_Code { get; set; }
        public string Segment_Code { get; set; }
        public string Element_Code { get; set; }
        public string Element_ValueType { get; set; }
        public string Element_EDIDataType { get; set; }
        public string Element_Requirement { get; set; }
        public int Element_MinLenght { get; set; }
        public int Element_MaxLenght { get; set; }
        public string Element_Comment { get; set; }
        public int Element_Order { get; set; }
        public string Element_Value { get; set; }
        public int ByElement_Code { get; set; }
        public int Validation_ID { get; set; }
        public string Mask { get; set; }
        public string Field_Name { get; set; }
        public int ValidationField_ID { get; set; }
        public int Segment_Iteration { get; set; }
        public int Segment_Order { get; set; }
        public string Path { get; set; }
        public string Path_Symbol { get; set; }
        public int Configuration_Segment_ID { get; set; }
        public string Segment_Requirement { get; set; }
        public int Element_CanBeNull { get; set; }
        public string System_Element_Required { get; set; }
        public string System_Element_ValueType { get; set; }
        public int Segment_Multiple { get; set; }
        public string Segment_Required_byElementValue_Element { get; set; }
        public int Value_Required { get; set; }
    }
}
