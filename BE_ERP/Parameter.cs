using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
   public class Parameter
    {
        public Parameter()
        {

        }

        public Parameter(string Key, string Value, int Size = -1)
        {

        }

        private int _size = -1;
        
        public string Key { get; set; }
        
        public int Size
        {
            get { return _size; }
            set { _size = value; }
        }
        public string Value { get; set; }
    }
}
