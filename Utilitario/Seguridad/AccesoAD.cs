using System;
using System.Text;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.DirectoryServices.AccountManagement;
using System.Security.Principal;
using System.DirectoryServices;
using BL_ERP;
using System.Configuration;

namespace Utilitario.Seguridad
{
    public class AccesoAD
    {
        private string _path;
        private string _filterAttribute;
        public string info;
        private ArrayList listaPropiedades = new ArrayList();

        public AccesoAD()
        {

        }
        
        /* Luis */
        public string Access_Valid(string _usuarioAD, string _contrasena)       
        {
            string usuarioAD = _usuarioAD;
            string contrasena = _contrasena;   
            string servidor = ConfigurationManager.AppSettings["ServidorActiveDirectory"].ToString();
            string dominio = ConfigurationManager.AppSettings["DominioWTS"].ToString();
            string path = @"LDAP://" + servidor;
            string tipoaccesousuario = "ninguno";
            string domusuario = dominio + @"\" + usuarioAD;

            DirectoryEntry directoryEntryValidation = validDirectoryEntry(path);

            string samaccountname = string.Format("(SAMAccountName={0})", usuarioAD);

            DirectorySearcher directorySearchValidation = validDirectorySearch(directoryEntryValidation, samaccountname);
            SearchResult searchresult = directorySearchValidation.FindOne();

            if (searchresult != null)
            {
                if (autenticado(dominio, usuarioAD, contrasena) == true)
                {
                    tipoaccesousuario = "ad";
                }
            }
            else
            {
                tipoaccesousuario = "sistema";
            }

            return tipoaccesousuario;
        }

        //Crea ruta del AD
        public static DirectoryEntry validDirectoryEntry(String _path)
        {
            DirectoryEntry ldapValidation = new DirectoryEntry(_path);
            return ldapValidation;
        }

        //Busqueda 
        public static DirectorySearcher validDirectorySearch(DirectoryEntry _parameters, string _samaccountname)
        {
            DirectorySearcher ladpSearch = new DirectorySearcher(_parameters);
            ladpSearch.Filter = _samaccountname;
            return ladpSearch;
        }

        //Crea Ruta para verificar Usuario, Contrasena 
        public static DirectoryEntry createDirectoryEntry(String path, String user, String pass)
        {
            DirectoryEntry ldapConnection = new DirectoryEntry(path, user, pass, AuthenticationTypes.Secure);

            return ldapConnection;
        }

        //Validad xistenia del Usuario y contraseña en el Dominio
        public bool autenticado(string _dominio, string _usuario, string _pass)
        {
            bool autenticado = true;

            string acceso = _dominio + @"\" + _usuario;
            DirectoryEntry entry = createDirectoryEntry(_path, _usuario, _pass);
            entry.AuthenticationType = AuthenticationTypes.Secure;

            try
            {
                object obj = entry.NativeObject;
                DirectorySearcher search = new DirectorySearcher(entry);

                search.Filter = "(SAMAccountName=" + _usuario + ")";
                string[] requiredProperties = new string[] { "cn", "givenname", "sn" };
                foreach (String property in requiredProperties)
                    search.PropertiesToLoad.Add(property);

                SearchResult result = search.FindOne();

                if (null == result)
                {
                    autenticado = false;
                }
                else
                {

                    foreach (String property in requiredProperties)
                        foreach (Object myCollection in result.Properties[property])
                            listaPropiedades.Add(myCollection.ToString());
                }
                
                _path = result.Path;
                _filterAttribute = (string)result.Properties["cn"][0];
            }
            catch (Exception ex)
            {
                return false;
            }

            return autenticado;
        }



        public ArrayList getListaPropiedades()
        {
            return listaPropiedades;
        }

        public string getCN()
        {
            return _filterAttribute;
        }

        public string getInfo()
        {
            return info;
        }

        public ArrayList GetGroups(string cn)
        {
            DirectorySearcher search = new DirectorySearcher(_path);
            search.Filter = "(cn=" + cn + ")";
            search.PropertiesToLoad.Add("memberOf");
            ArrayList grupos = new ArrayList();

            try
            {
                SearchResult result = search.FindOne();
                int propertyCount = result.Properties["memberOf"].Count;
                string dn;
                int equalsIndex, commaIndex;

                for (int propertyCounter = 0; propertyCounter < propertyCount; propertyCounter++)
                {
                    dn = (string)result.Properties["memberOf"][propertyCounter];
                    equalsIndex = dn.IndexOf("=", 1);
                    commaIndex = dn.IndexOf(",", 1);
                    if (-1 == equalsIndex)
                    {
                        return null;
                    }
                    grupos.Add(dn.Substring((equalsIndex + 1), (commaIndex - equalsIndex) - 1));
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error obtaining group names. " + ex.Message);
            }
            return grupos;
        }
        
        public ArrayList getTodosUsuarios()
        {
            ArrayList cnUsuarios = new ArrayList();
            try
            {
                DirectoryEntry entry = new DirectoryEntry();
                entry.Path = _path;
                DirectorySearcher search = new DirectorySearcher(entry);
                search.PropertiesToLoad.Add("cn");


                SearchResultCollection allUsers = search.FindAll();

                foreach (SearchResult result in allUsers)
                {
                    if (result.Properties["cn"].Count > 0)
                    {
                        cnUsuarios.Add(String.Format("{0,-20} : {1}", result.Properties["cn"][0].ToString()));
                    }
                }

            }
            catch (Exception exc)
            {
                cnUsuarios.Add("Error: " + exc.ToString());
            }

            return cnUsuarios;
        }
        
        public string modificaPass(string nuevapass, string usuario, string viejapass)
        {
            string mensaje;
            try
            {
                DirectoryEntry entry = new DirectoryEntry();
                entry.Path = _path;
                DirectorySearcher search = new DirectorySearcher(entry);
                search.Filter = "(SAMAccountName=" + usuario + ")";
                search.PropertiesToLoad.Add("password");
                SearchResult result = search.FindOne();

                if (result != null)
                {
                    // create new object from search result  
                    DirectoryEntry entryToUpdate = result.GetDirectoryEntry();
                    entryToUpdate.Invoke("ChangePassword", new object[] { viejapass, nuevapass });
                    entryToUpdate.CommitChanges();
                    mensaje = "Contraseña modificada :)";
                }

                else mensaje = "No se pudo cambiar contraseña. Usuario no valido :(";
            }
            catch (Exception e)
            {
                mensaje = "Error: " + e.ToString();
            }
            return mensaje;
        }

    }
}
