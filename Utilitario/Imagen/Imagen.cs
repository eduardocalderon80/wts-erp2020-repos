using System;
using System.Drawing;
using System.IO;
namespace Utilitario.Imagen
{
    public class Imagen
    {
        Size TamanioThumbnail(Image original, int nMaxPixels)
        {
            // Maximum size of any dimension.
            int maxPixels = nMaxPixels;

            // Width and height.
            int originalWidth = original.Width;
            int originalHeight = original.Height;

            // Compute best factor to scale entire image based on larger dimension.
            double factor;
            if (originalWidth > originalHeight)
            {
                factor = (double)maxPixels / originalWidth;
            }
            else
            {
                factor = (double)maxPixels / originalHeight;
            }

            // Return thumbnail size.
            return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        }

        public byte[] DevolverImagenOptimizada(byte[] oImagenOriginalArray, int nMaxPixels = 250)
        {
            Image oImagenOriginal = null;
            using (var oMemoria = new MemoryStream(oImagenOriginalArray))
            {
                oImagenOriginal = Image.FromStream(oMemoria);
            }

            Size thumbnailSize = TamanioThumbnail(oImagenOriginal, nMaxPixels);

            // Get thumbnail.
            Image oImagenThumbnail = oImagenOriginal.GetThumbnailImage(thumbnailSize.Width,
                thumbnailSize.Height, null, IntPtr.Zero);

            // Save thumbnail.
            ImageConverter _imageConverter = new ImageConverter();
            byte[] oImagenThumbnailArray = (byte[])_imageConverter.ConvertTo(oImagenThumbnail, typeof(byte[]));
            return oImagenThumbnailArray;
        }

        public byte[] DevolverImagenTamanioFijo(byte[] oImagenOriginalArray, int nAncho = 20, int nAlto = 20)
        {
            Image oImagenOriginal = null;
            using (var oMemoria = new MemoryStream(oImagenOriginalArray))
            {
                oImagenOriginal = Image.FromStream(oMemoria);
            }

            Size thumbnailSize = new Size(nAncho, nAlto);

            // Get thumbnail.
            Image oImagenThumbnail = oImagenOriginal.GetThumbnailImage(thumbnailSize.Width,
                thumbnailSize.Height, null, IntPtr.Zero);

            // Save thumbnail.
            ImageConverter _imageConverter = new ImageConverter();
            byte[] oImagenThumbnailArray = (byte[])_imageConverter.ConvertTo(oImagenThumbnail, typeof(byte[]));
            return oImagenThumbnailArray;
        }
    }
}
