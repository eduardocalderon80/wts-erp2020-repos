using System;
using System.Configuration;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Utilitario
{
    public sealed class Utils
    {
        /// <summary>
        /// NOTA: ESTA FUNCION SE USA PARA DECODIFICAR CODIGO HTML DESDE JAVASCRIPT; EN JAVASCRIPT SE USA LA FUNCION ESCAPE(codifica) Y EN C# SE USA UNESCAPE(decodifica; 
        /// </summary>
        /// <returns></returns>
        public static string unescape(string code)
        {
            var str = Regex.Replace(code, @"\+", "\x20");
            str = Regex.Replace(str, @"%([a-fA-F0-9][a-fA-F0-9])", new MatchEvaluator((mach) => {
                var _tmp = mach.Groups[0].Value;
                var _hexC = mach.Groups[1].Value;
                var _hexV = int.Parse(_hexC, System.Globalization.NumberStyles.HexNumber);
                return ((char)_hexV).ToString();
            }));

            return str;
        }

        #region AES ENCRYPT
        public static string AesKey = ConfigurationManager.AppSettings["AesKey"].ToString();
        public static string EncryptString(string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(AesKey);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }
        public static string DecryptString(string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(AesKey);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }
        #endregion

        #region ENCRIPTAR_DESENCRIPTAR
        public static string Codifica(string cadena)
        {
            return BitConverter.ToString(Encoding.ASCII.GetBytes(Encriptar(cadena))).Replace("-", "");
        }

        public static string DeCodificar(string codificado)
        {
            var arr = new String[codificado.Length / 2];// = codificado.Split('-');
            var j = 0;
            for (var i = 0; i < codificado.Length; i += 2)
            {
                arr[j] = codificado.Substring(i, 2);
                j++;
            }

            var array = new byte[arr.Length];
            for (var i = 0; i < arr.Length; i++) array[i] = Convert.ToByte(arr[i], 16);

            var nuevoOrigen = System.Text.Encoding.ASCII.GetString(array);
            var desencriptado = DesEncriptar(nuevoOrigen);
            return desencriptado;
        }

        /// <summary>
        /// Encriptar Cadena ToBase64
        /// </summary>
        /// <param name="cadena">Campo a Cifrar</param>
        /// <param name="encoding">TipoEncoding: default UTF8</param>
        /// <returns></returns>
        private static string Encriptar(string cadena, Encoding encoding = null)
        {
            if (cadena.Length > 0){
                encoding = encoding ?? Encoding.UTF8;
                var bytes = encoding.GetBytes(cadena);
                return Convert.ToBase64String(bytes);
            }
            return string.Empty;
            
        }

      /// <summary>
      /// Desencriptar
      /// </summary>
      /// <param name="cadena"></param>
      /// <param name="encoding"></param>
      /// <returns></returns>
        private static string DesEncriptar(string cadena, Encoding encoding = null)
        {            
            encoding = encoding ?? Encoding.UTF8;
            var bytes = Convert.FromBase64String(cadena);
            return encoding.GetString(bytes);
        }
        public static string DesEncriptarBase64(string cadena, Encoding encoding = null)
        {
            encoding = encoding ?? Encoding.UTF8;
            var bytes = Convert.FromBase64String(cadena);
            return encoding.GetString(bytes);
        }
        #endregion
    }
}
