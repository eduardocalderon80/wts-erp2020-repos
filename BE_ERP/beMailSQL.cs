using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP
{
    public class beMailSQL
    {
        private string _from = string.Empty;
        private string _file_attachments = string.Empty;
        private string _copiacorreo = string.Empty;
        private string _copiacorreo_oculta = string.Empty;

        public string codigo_usuario { get; set; }
        public string correo_usuario { get; set; }

        public string from
        {
            get
            {
                return _from;
            }
            set
            {
                _from = value;
            }
        }


        public string to_address { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        
        public string file_attachments
        {
            get
            {
                return _file_attachments;
            }
            set
            {
                _file_attachments = value;
            }
        }


        
        public string copiacorreo
        {
            get
            {
                return _copiacorreo;
            }
            set
            {
                _copiacorreo = value;
            }
        }


        public string copiacorreo_oculta
        {
            get
            {
                return _copiacorreo_oculta;
            }
            set
            {
                _copiacorreo_oculta = value;
            }
        }



    }
}
