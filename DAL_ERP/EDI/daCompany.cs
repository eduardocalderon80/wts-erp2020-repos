using System;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BE_ERP;
namespace DAL_ERP
{
    public class daCompany
    {
        public List<beCompany> getCompanies(SqlConnection cn) {
            List<beCompany> Companies = null;
            string StoreProcedure = "sp_Company_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleResult))
            {
                if (dr != null)
                {
                    if (dr.HasRows)
                    {
                        Companies = new List<beCompany>();
                        beCompany obeCompany = null;
                        while (dr.Read())
                        {
                            obeCompany = new beCompany();
                            obeCompany.Company_ID = dr.GetInt32(0);
                            obeCompany.Company_Name = dr.GetString(1);
                            Companies.Add(obeCompany);
                        }
                    }
                }
            }
            return Companies;
        }
        public int getCompanyID(SqlConnection cn)
        {
            int CompanyID = 0;
            string StoreProcedure = "sp_CompanyID_Get";
            SqlCommand cmd = new SqlCommand(StoreProcedure, cn);
            cmd.CommandType = CommandType.StoredProcedure;
            CompanyID = (int)cmd.ExecuteScalar();
            return CompanyID;
        }
    }
}
