using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BE_ERP.Laboratorio
{
    public class ReporteDetalle
    {
        private bool _flagSubGrupo = false;
        private bool _flagSubItem = false;
        private int _row = 0;

        public int row
        {
            get { return _row; }
            set { _row = value; }
        }
        public int idgrupo { get; set; }
        public int idsubgrupo { get; set; }
        public string titulo { get; set; }
        public string codigo { get; set; }
        public string subgrupo { get; set; }
        public string campo1 { get; set; }
        public string campo2 { get; set; }
        public string campo3 { get; set; }
        public string campo4 { get; set; }
        public string campo5 { get; set; }
        public string campo6 { get; set; }
        public string campo7 { get; set; }
        public string campo8 { get; set; }

        public bool flagSubGrupo
        {
            get { return _flagSubGrupo; }
            set { _flagSubGrupo = value; }
        }

        public bool flagSubItem
        {
            get { return _flagSubItem; }
            set { _flagSubItem = value; }
        }
    }
}
