﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WTS_ERP.Areas.Maestra.Models;

namespace WTS_ERP.Areas.Maestra.Services
{
    public interface IDivisionService
    {
        string GetAll_DivisionByCliente(string _idCliente);
        string SaveNew_Division(ClienteDivision _clienteDivision);
    }
}
