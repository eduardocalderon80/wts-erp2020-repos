using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BE_ERP;
using DAL_ERP;
namespace BL_ERP
{
    public class EDI_856 : blLog
    {
        public void BuildASN(int Shipment_Code, int Company_ID, string pathVAN, bool OnlyRequired, bool IsTest, out beEDIFile EDIFile)
        {
            EDIFile = new beEDIFile();
            try
            {
                EDIFile.Process_ID = "E";
                EDIFile.Status_ID = "S";
                EDIFile.File_Name = "856";

                EDIConfiguration oEDIConfiguration = new EDIConfiguration();
                ASN oASN = new ASN();
                //Se obtiene las configuraciones EDI para el cliente.
                List<beConfiguration> Configurations = oEDIConfiguration.getConfigurations(Company_ID, OnlyRequired);
                //Se obtiene la configuracion de EDI 856
                beConfiguration Configuration = Configurations.Find(x => x.Document_Extension == ".856");
                //Se obtiene los datos de la ASN
                beASN ASN = oASN.getASN(Shipment_Code);
                List<beEDIFileData> EDIFileData = new List<beEDIFileData>();
                beEDIFileData obeEDIFileData = null;
                if (IsTest)
                {
                    //ISA-15 contiene 2 valores por defecto. Se elimina el valor P(Produccion) cuando el archivo es un TEST
                    //Los valores por defecto tienen un orden. Siempre se toma el valor en base al orden. Es de 1 a 1 
                    Configuration.DefaultValues.RemoveAll(x => x.Element_Code == "ISA-15" && x.Element_Value == "P");
                }
                // Se agregan los valores que son IDS generados por el sistema. 
                //ISA -13
                int ControlID = oEDIConfiguration.getControlID();
                EDIFile.ControlID = ControlID;
                beConfigurationElement obeConfigurationElementISA13 = new beConfigurationElement();
                obeConfigurationElementISA13.Section_Code = "IHS";
                obeConfigurationElementISA13.Segment_Code = "ISA";
                obeConfigurationElementISA13.Element_Code = "ISA-13";
                obeConfigurationElementISA13.Element_Value = ControlID.ToString();
                Configuration.DefaultValues.Add(obeConfigurationElementISA13);
                //GS-06
                int ControlGroupID = oEDIConfiguration.getControlGroupID();
                EDIFile.ControlGroupID = ControlGroupID;
                beConfigurationElement obeConfigurationElementGS06 = new beConfigurationElement();
                obeConfigurationElementGS06.Section_Code = "FGH";
                obeConfigurationElementGS06.Segment_Code = "GS";
                obeConfigurationElementGS06.Element_Code = "GS-06";
                obeConfigurationElementGS06.Element_Value = ControlGroupID.ToString();
                Configuration.DefaultValues.Add(obeConfigurationElementGS06);
                //BSN-02
                int ShipmentGroupID = oEDIConfiguration.getShipmentGroupID();
                beConfigurationElement obeConfigurationElementBSN02 = new beConfigurationElement();
                obeConfigurationElementBSN02.Section_Code = "H";
                obeConfigurationElementBSN02.Segment_Code = "BSN";
                obeConfigurationElementBSN02.Element_Code = "BSN-02";
                obeConfigurationElementBSN02.Element_Value = "11";
                Configuration.DefaultValues.Add(obeConfigurationElementBSN02);
                //

                int Line = 1; // Linea del archivo . (Un segmento es una linea)
                int LineM = 0;
                dynamic Element_Value = "";
                string Element_Value_STR = "";
                bool IsMultiple;
                string Segment = "";
                Type type = null;
                string SegmentI = "";

                if (Configuration != null && ASN != null)
                {
                    //IHS
                    foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "IHS").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                    {
                        Segment = segment;
                        foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "IHS" && x.Segment_Code == Segment))
                        {
                            obeEDIFileData = new beEDIFileData();
                            obeEDIFileData.Section_Code = element.Section_Code;
                            obeEDIFileData.Segment_Code = element.Segment_Code;
                            obeEDIFileData.Element_Code = element.Element_Code;
                            obeEDIFileData.Line = Line;

                            switch (element.ValidationField_ID)
                            {
                                case 2:
                                    Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value == null ? "" : Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                    type = Element_Value.GetType();
                                    if (type.Name == "DateTime")
                                    {
                                        if (!string.IsNullOrWhiteSpace(element.Mask))
                                        {
                                            Element_Value = Element_Value.ToString(element.Mask);
                                        }
                                    }
                                    else
                                    {
                                        if (element.Element_MinLenght == element.Element_MaxLenght)
                                        {
                                            if (Element_Value == "[BLANK]")
                                            {
                                                Element_Value = "";
                                            }
                                            switch (element.Path)
                                            {
                                                case "L":
                                                    Element_Value = Element_Value.PadLeft(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                    break;
                                                case "R":
                                                    Element_Value = Element_Value.PadRight(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                    break;
                                            }

                                        }
                                    }
                                    break;
                                case 4:
                                    if (!string.IsNullOrWhiteSpace(element.Mask))
                                    {
                                        Element_Value = DateTime.Now.ToString(element.Mask);
                                    }
                                    else
                                    {
                                        Element_Value = "";
                                    }
                                    break;
                            }
                            Element_Value_STR = Element_Value.ToString();
                            obeEDIFileData.Element_Value = Element_Value_STR;
                            Element_Value_STR = string.Empty;
                            EDIFileData.Add(obeEDIFileData);

                        }
                        Line++;
                    }
                    //FIN IHS

                    //FGH
                    foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "FGH").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                    {
                        Segment = segment;
                        foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "FGH" && x.Segment_Code == Segment))
                        {
                            obeEDIFileData = new beEDIFileData();
                            obeEDIFileData.Section_Code = element.Section_Code;
                            obeEDIFileData.Segment_Code = element.Segment_Code;
                            obeEDIFileData.Element_Code = element.Element_Code;
                            obeEDIFileData.Line = Line;
                            switch (element.ValidationField_ID)
                            {
                                case 2:
                                    Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value == null ? "" : Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                    type = Element_Value.GetType();
                                    if (type.Name == "DateTime")
                                    {
                                        if (!string.IsNullOrWhiteSpace(element.Mask))
                                        {
                                            Element_Value = Element_Value.ToString(element.Mask);
                                        }
                                    }
                                    if (element.Element_MinLenght == element.Element_MaxLenght)
                                    {
                                        if (Element_Value == "[BLANK]")
                                        {
                                            Element_Value = "";
                                        }
                                        switch (element.Path)
                                        {
                                            case "L":
                                                Element_Value = Element_Value.PadLeft(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                            case "R":
                                                Element_Value = Element_Value.PadRight(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                        }
                                    }
                                    break;
                                case 4:
                                    if (!string.IsNullOrWhiteSpace(element.Mask))
                                    {
                                        Element_Value = DateTime.Now.ToString(element.Mask);
                                    }
                                    else
                                    {
                                        Element_Value = "";
                                    }
                                    break;
                            }
                            Element_Value_STR = Element_Value.ToString();
                            obeEDIFileData.Element_Value = Element_Value_STR;
                            Element_Value_STR = string.Empty;
                            EDIFileData.Add(obeEDIFileData);
                        }
                        Line++;
                    }
                    //FIN FGH

                    //H
                    foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "H").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                    {
                        Segment = segment;
                        foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "H" && x.Segment_Code == Segment))
                        {
                            obeEDIFileData = new beEDIFileData();
                            obeEDIFileData.Section_Code = element.Section_Code;
                            obeEDIFileData.Segment_Code = element.Segment_Code;
                            obeEDIFileData.Element_Code = element.Element_Code;
                            obeEDIFileData.Line = Line;

                            if (element.Segment_Code == "BSN")
                            {
                                string hola = "";
                            }

                            switch (element.ValidationField_ID)
                            {
                                case 2:

                                    var obj = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code);
                                    Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value == null ? "" : Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                    type = Element_Value.GetType();
                                    if (type.Name == "DateTime")
                                    {
                                        if (!string.IsNullOrWhiteSpace(element.Mask))
                                        {
                                            Element_Value = Element_Value.ToString(element.Mask);
                                        }
                                    }
                                    if (element.Element_MinLenght == element.Element_MaxLenght)
                                    {
                                        if (Element_Value == "[BLANK]")
                                        {
                                            Element_Value = "";
                                        }
                                        switch (element.Path)
                                        {
                                            case "L":
                                                Element_Value = Element_Value.PadLeft(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                            case "R":
                                                Element_Value = Element_Value.PadRight(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                        }
                                    }
                                    break;
                                case 4:
                                    if (!string.IsNullOrWhiteSpace(element.Mask))
                                    {
                                        Element_Value = DateTime.Now.ToString(element.Mask);
                                    }
                                    else
                                    {
                                        Element_Value = "";
                                    }
                                    break;
                                case 5:
                                    int cont = EDIFileData.FindAll(x => x.Segment_Code == element.Segment_Code).Count;
                                    if (cont == 1) cont = 0;
                                    Element_Value = (cont + 1).ToString();
                                    if (!string.IsNullOrWhiteSpace(element.Path))
                                    {
                                        if (Element_Value == "[BLANK]")
                                        {
                                            Element_Value = "";
                                        }
                                        switch (element.Path)
                                        {
                                            case "L":
                                                Element_Value = Element_Value.PadLeft(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                            case "R":
                                                Element_Value = Element_Value.PadRight(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                break;
                                        }
                                    }

                                    break;
                            }
                            Element_Value_STR = Element_Value.ToString();
                            obeEDIFileData.Element_Value = Element_Value_STR;
                            Element_Value_STR = string.Empty;
                            EDIFileData.Add(obeEDIFileData);

                        }
                        Line++;
                    }

                    //FIN H

                    //DS
                    foreach (beShipment shipment in ASN.Shipments)
                    {
                        foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "DS").OrderBy(x => x.Element_Order).Select(x => new { x.Segment_Code, x.Configuration_Segment_ID }).Distinct())
                        {
                            Segment = segment.Segment_Code;
                            foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "DS" && x.Segment_Code == Segment && x.Configuration_Segment_ID == segment.Configuration_Segment_ID))
                            {
                                if (SegmentI == element.Segment_Code) continue;
                                else SegmentI = "";
                                IsMultiple = false;
                                obeEDIFileData = new beEDIFileData();
                                obeEDIFileData.Section_Code = element.Section_Code;
                                obeEDIFileData.Segment_Code = element.Segment_Code;
                                obeEDIFileData.Element_Code = element.Element_Code;
                                obeEDIFileData.Line = Line;
                                switch (element.ValidationField_ID)
                                {
                                    case 1:
                                        Element_Value = shipment.GetType().GetProperty(element.Field_Name.Trim()).GetValue(shipment, null);
                                        type = Element_Value.GetType();
                                        if (type.Name == "DateTime")
                                        {
                                            if (!string.IsNullOrWhiteSpace(element.Mask))
                                            {
                                                Element_Value = Element_Value.ToString(element.Mask);
                                            }
                                        }
                                        break;
                                    case 2:
                                        Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code && x.Configuration_Element_ID == element.Configuration_Element_ID).Element_Value;
                                        type = Element_Value.GetType();
                                        if (type.Name == "DateTime")
                                        {
                                            if (!string.IsNullOrWhiteSpace(element.Mask))
                                            {
                                                Element_Value = Element_Value.ToString(element.Mask);
                                            }
                                        }
                                        break;
                                    case 3:
                                        beEDIFileData obeEDIFileDataM = null;
                                        LineM = Line;
                                        var Multiple = Configuration.Elements.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code);
                                        foreach (var SegmentID in Multiple.Select(x => x.Configuration_Segment_ID).Distinct())
                                        {
                                            foreach (beConfigurationElement elementMultiple in Multiple.FindAll(x => x.Configuration_Segment_ID == SegmentID))/*.OrderBy(x=> x.Segment_Code).ThenBy(x=> x.Segment_Iteration).ThenBy(x=> x.Element_Order))*/
                                            {
                                                obeEDIFileDataM = new beEDIFileData();
                                                obeEDIFileDataM.Section_Code = elementMultiple.Section_Code;
                                                obeEDIFileDataM.Segment_Code = elementMultiple.Segment_Code;
                                                obeEDIFileDataM.Element_Code = elementMultiple.Element_Code;
                                                obeEDIFileDataM.Line = LineM;
                                                switch (elementMultiple.ValidationField_ID)
                                                {
                                                    case 1:
                                                        Element_Value = shipment.GetType().GetProperty(elementMultiple.Field_Name.Trim()).GetValue(shipment, null);//.ToString();
                                                        break;
                                                    case 2:
                                                        Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == elementMultiple.Section_Code && x.Segment_Code == elementMultiple.Segment_Code && x.Element_Code == elementMultiple.Element_Code && x.Element_Order == elementMultiple.Element_Order).Element_Value;
                                                        break;
                                                }
                                                type = Element_Value.GetType();
                                                if (type.Name == "DateTime")
                                                {
                                                    if (!string.IsNullOrWhiteSpace(elementMultiple.Mask))
                                                    {
                                                        Element_Value = Element_Value.ToString(elementMultiple.Mask);
                                                    }
                                                }
                                                Element_Value_STR = Element_Value.ToString();
                                                obeEDIFileDataM.Element_Value = Element_Value_STR;

                                                EDIFileData.Add(obeEDIFileDataM);
                                                Element_Value_STR = string.Empty;
                                            }
                                            LineM++;
                                            SegmentI = element.Segment_Code;
                                            Line = LineM - 1;
                                        }

                                        IsMultiple = true;
                                        break;
                                    case 4:
                                        if (!string.IsNullOrWhiteSpace(element.Mask))
                                        {
                                            Element_Value = DateTime.Now.ToString(element.Mask);
                                        }
                                        else
                                        {
                                            Element_Value = "";
                                        }
                                        break;
                                    case 5:
                                        int cont = EDIFileData.FindAll(x => x.Segment_Code == element.Segment_Code).Count;
                                        Element_Value = (cont + 1).ToString();
                                        if (!string.IsNullOrWhiteSpace(element.Path))
                                        {
                                            switch (element.Path)
                                            {
                                                case "L":
                                                    Element_Value = Element_Value.PadLeft(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                    break;
                                                case "R":
                                                    Element_Value = Element_Value.PadRight(element.Element_MinLenght, Convert.ToChar(element.Path_Symbol));
                                                    break;
                                            }
                                        }
                                        break;
                                }
                                if (!IsMultiple)
                                {
                                    Element_Value_STR = Element_Value.ToString();
                                    obeEDIFileData.Element_Value = Element_Value_STR;
                                    Element_Value_STR = string.Empty;
                                    EDIFileData.Add(obeEDIFileData);
                                }
                            }
                            Line++;
                        }
                        /*Order*/
                        foreach (var order in ASN.Orders.FindAll(x => x.Shipment_Code == shipment.Shipment_Code))
                        {
                            foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "DO").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                            {
                                Segment = segment;
                                foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "DO" && x.Segment_Code == Segment))
                                {
                                    if (SegmentI == element.Segment_Code) continue;
                                    else SegmentI = "";
                                    IsMultiple = false;
                                    obeEDIFileData = new beEDIFileData();
                                    obeEDIFileData.Section_Code = element.Section_Code;
                                    obeEDIFileData.Segment_Code = element.Segment_Code;
                                    obeEDIFileData.Element_Code = element.Element_Code;
                                    obeEDIFileData.Line = Line;
                                    switch (element.ValidationField_ID)
                                    {
                                        case 0:
                                            Element_Value = string.Empty;
                                            break;
                                        case 1:
                                            Element_Value = order.GetType().GetProperty(element.Field_Name.Trim()).GetValue(order, null);
                                            type = Element_Value.GetType();
                                            if (type.Name == "DateTime")
                                            {
                                                if (!string.IsNullOrWhiteSpace(element.Mask))
                                                {
                                                    Element_Value = Element_Value.ToString(element.Mask);
                                                }
                                            }
                                            break;
                                        case 2:
                                            Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                            type = Element_Value.GetType();
                                            if (type.Name == "DateTime")
                                            {
                                                if (!string.IsNullOrWhiteSpace(element.Mask))
                                                {
                                                    Element_Value = Element_Value.ToString(element.Mask);
                                                }
                                            }
                                            break;
                                        case 3:
                                            beEDIFileData obeEDIFileDataM = null;
                                            LineM = Line;
                                            foreach (var iteration in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code).Select(x => x.Segment_Iteration).Distinct())
                                            {
                                                foreach (beConfigurationElement elementMultiple in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Segment_Iteration == iteration))/*.OrderBy(x=> x.Segment_Code).ThenBy(x=> x.Segment_Iteration).ThenBy(x=> x.Element_Order))*/
                                                {
                                                    obeEDIFileDataM = new beEDIFileData();
                                                    obeEDIFileDataM.Section_Code = elementMultiple.Section_Code;
                                                    obeEDIFileDataM.Segment_Code = elementMultiple.Segment_Code;
                                                    obeEDIFileDataM.Element_Code = elementMultiple.Element_Code;
                                                    obeEDIFileDataM.Line = LineM;
                                                    switch (elementMultiple.ValidationField_ID)
                                                    {
                                                        case 1:
                                                            Element_Value = order.GetType().GetProperty(elementMultiple.Field_Name.Trim()).GetValue(order, null).ToString();
                                                            break;
                                                        case 2:
                                                            Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == elementMultiple.Section_Code && x.Segment_Code == elementMultiple.Segment_Code && x.Element_Code == elementMultiple.Element_Code).Element_Value;
                                                            break;
                                                    }
                                                    type = Element_Value.GetType();
                                                    if (type.Name == "DateTime")
                                                    {
                                                        if (!string.IsNullOrWhiteSpace(element.Mask))
                                                        {
                                                            Element_Value = Element_Value.ToString(element.Mask);
                                                        }
                                                    }
                                                    Element_Value_STR = Element_Value.ToString();
                                                    obeEDIFileDataM.Element_Value = Element_Value_STR;
                                                    Element_Value_STR = string.Empty;
                                                    EDIFileData.Add(obeEDIFileDataM);
                                                }
                                                LineM++;
                                            }
                                            SegmentI = element.Segment_Code;
                                            Line = LineM - 1;
                                            IsMultiple = true;
                                            break;
                                        case 4:
                                            if (!string.IsNullOrWhiteSpace(element.Mask))
                                            {
                                                Element_Value = DateTime.Now.ToString(element.Mask);
                                            }
                                            else
                                            {
                                                Element_Value = "";
                                            }
                                            break;
                                        case 5:
                                            int cont = EDIFileData.FindAll(x => x.Element_Code == element.Element_Code).Count;
                                            Element_Value = (cont + 1).ToString().PadLeft(element.Element_MinLenght, '0');
                                            break;
                                    }
                                    if (!IsMultiple)
                                    {
                                        Element_Value_STR = Element_Value.ToString();
                                        obeEDIFileData.Element_Value = Element_Value_STR;
                                        EDIFileData.Add(obeEDIFileData);
                                    }
                                    Element_Value_STR = string.Empty;
                                }
                                Line++;
                            }
                            //pack
                            foreach (var pack in ASN.Packs.FindAll(x => x.Shipment_Code == shipment.Shipment_Code && x.Order_Code == order.Order_Code))
                            {
                                foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "DP").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                                {
                                    Segment = segment;
                                    foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "DP" && x.Segment_Code == Segment))
                                    {
                                        if (SegmentI == element.Segment_Code) continue;
                                        else SegmentI = "";
                                        IsMultiple = false;
                                        obeEDIFileData = new beEDIFileData();
                                        obeEDIFileData.Section_Code = element.Section_Code;
                                        obeEDIFileData.Segment_Code = element.Segment_Code;
                                        obeEDIFileData.Element_Code = element.Element_Code;
                                        obeEDIFileData.Line = Line;
                                        switch (element.ValidationField_ID)
                                        {
                                            case 1:
                                                Element_Value = pack.GetType().GetProperty(element.Field_Name.Trim()).GetValue(pack, null).ToString();
                                                break;
                                            case 2:
                                                Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                                break;
                                            case 3:
                                                beEDIFileData obeEDIFileDataM = null;
                                                LineM = Line;
                                                foreach (var iteration in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code).Select(x => x.Segment_Iteration).Distinct())
                                                {
                                                    foreach (beConfigurationElement elementMultiple in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Segment_Iteration == iteration))/*.OrderBy(x=> x.Segment_Code).ThenBy(x=> x.Segment_Iteration).ThenBy(x=> x.Element_Order))*/
                                                    {
                                                        obeEDIFileDataM = new beEDIFileData();
                                                        obeEDIFileDataM.Section_Code = elementMultiple.Section_Code;
                                                        obeEDIFileDataM.Segment_Code = elementMultiple.Segment_Code;
                                                        obeEDIFileDataM.Element_Code = elementMultiple.Element_Code;
                                                        obeEDIFileDataM.Line = LineM;
                                                        switch (elementMultiple.ValidationField_ID)
                                                        {
                                                            case 1:
                                                                Element_Value = pack.GetType().GetProperty(elementMultiple.Field_Name.Trim()).GetValue(pack, null).ToString();
                                                                break;
                                                            case 2:
                                                                Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == elementMultiple.Section_Code && x.Segment_Code == elementMultiple.Segment_Code && x.Element_Code == elementMultiple.Element_Code).Element_Value;
                                                                break;
                                                        }
                                                        Element_Value_STR = Element_Value.ToString();
                                                        obeEDIFileDataM.Element_Value = Element_Value_STR;
                                                        Element_Value_STR = string.Empty;
                                                        EDIFileData.Add(obeEDIFileDataM);
                                                    }
                                                    LineM++;
                                                }
                                                SegmentI = element.Segment_Code;
                                                Line = LineM - 1;
                                                IsMultiple = true;
                                                break;
                                            case 4:
                                                if (!string.IsNullOrWhiteSpace(element.Mask))
                                                {
                                                    Element_Value = DateTime.Now.ToString(element.Mask);
                                                }
                                                else
                                                {
                                                    Element_Value = "";
                                                }
                                                break;
                                            case 5:
                                                int cont = EDIFileData.FindAll(x => x.Element_Code == element.Element_Code).Count;
                                                Element_Value = (cont + 1).ToString().PadLeft(element.Element_MinLenght, '0');
                                                break;
                                        }
                                        if (!IsMultiple)
                                        {
                                            Element_Value_STR = Element_Value.ToString();
                                            obeEDIFileData.Element_Value = Element_Value_STR;
                                            Element_Value_STR = string.Empty;
                                            EDIFileData.Add(obeEDIFileData);
                                        }
                                    }
                                    Line++;
                                }

                                // Items 

                                // Element_Value = string.Empty;
                                foreach (var item in ASN.Items.FindAll(x => x.Shipment_Code == shipment.Shipment_Code && x.Order_Code == order.Order_Code && x.Pack_Code == pack.Pack_Code))
                                {
                                    foreach (var segment in Configuration.Elements.FindAll(x => x.Section_Code == "DI").OrderBy(x => x.Element_Order).Select(x => x.Segment_Code).Distinct())
                                    {
                                        Segment = segment;
                                        foreach (beConfigurationElement element in Configuration.Elements.FindAll(x => x.Section_Code == "DI" && x.Segment_Code == Segment))
                                        {
                                            if (SegmentI == element.Segment_Code) continue;
                                            else SegmentI = "";
                                            IsMultiple = false;
                                            Element_Value = string.Empty;
                                            obeEDIFileData = new beEDIFileData();
                                            obeEDIFileData.Section_Code = element.Section_Code;
                                            obeEDIFileData.Segment_Code = element.Segment_Code;
                                            obeEDIFileData.Element_Code = element.Element_Code;
                                            obeEDIFileData.Line = Line;
                                            switch (element.ValidationField_ID)
                                            {
                                                case 1:
                                                    Element_Value = item.GetType().GetProperty(element.Field_Name.Trim()).GetValue(item, null).ToString();
                                                    break;
                                                case 2:
                                                    Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Element_Code == element.Element_Code).Element_Value;
                                                    break;
                                                case 3:
                                                    beEDIFileData obeEDIFileDataM = null;
                                                    LineM = Line;
                                                    foreach (var iteration in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code).Select(x => x.Segment_Iteration).Distinct())
                                                    {
                                                        foreach (beConfigurationElement elementMultiple in Configuration.MultiplesValues.FindAll(x => x.Section_Code == element.Section_Code && x.Segment_Code == element.Segment_Code && x.Segment_Iteration == iteration))/*.OrderBy(x=> x.Segment_Code).ThenBy(x=> x.Segment_Iteration).ThenBy(x=> x.Element_Order))*/
                                                        {
                                                            obeEDIFileDataM = new beEDIFileData();
                                                            obeEDIFileDataM.Section_Code = elementMultiple.Section_Code;
                                                            obeEDIFileDataM.Segment_Code = elementMultiple.Segment_Code;
                                                            obeEDIFileDataM.Element_Code = elementMultiple.Element_Code;
                                                            obeEDIFileDataM.Line = LineM;
                                                            switch (elementMultiple.ValidationField_ID)
                                                            {
                                                                case 1:
                                                                    Element_Value = pack.GetType().GetProperty(elementMultiple.Field_Name.Trim()).GetValue(pack, null).ToString();
                                                                    break;
                                                                case 2:
                                                                    Element_Value = Configuration.DefaultValues.Find(x => x.Section_Code == elementMultiple.Section_Code && x.Segment_Code == elementMultiple.Segment_Code && x.Element_Code == elementMultiple.Element_Code).Element_Value;
                                                                    break;
                                                            }
                                                            Element_Value_STR = Element_Value.ToString();
                                                            obeEDIFileDataM.Element_Value = Element_Value_STR;
                                                            Element_Value_STR = string.Empty;
                                                            EDIFileData.Add(obeEDIFileDataM);
                                                        }
                                                        LineM++;
                                                    }
                                                    SegmentI = element.Segment_Code;
                                                    Line = LineM - 1;
                                                    IsMultiple = true;
                                                    break;
                                                case 4:
                                                    if (!string.IsNullOrWhiteSpace(element.Mask))
                                                    {
                                                        Element_Value = DateTime.Now.ToString(element.Mask);
                                                    }
                                                    else
                                                    {
                                                        Element_Value = "";
                                                    }
                                                    break;
                                                case 5:
                                                    int cont = EDIFileData.FindAll(x => x.Element_Code == element.Element_Code).Count;
                                                    Element_Value = (cont + 1).ToString().PadLeft(element.Element_MinLenght, '0');
                                                    break;
                                            }
                                            if (!IsMultiple)
                                            {
                                                Element_Value_STR = Element_Value.ToString();
                                                obeEDIFileData.Element_Value = Element_Value_STR;
                                                Element_Value_STR = string.Empty;
                                                EDIFileData.Add(obeEDIFileData);
                                            }
                                        }
                                        Line++;
                                    }
                                }
                            }
                        }
                    }



                    //SE
                    int ST_Index = EDIFileData.Find(x => x.Segment_Code == "ST").Line;
                    int TotalSegments = EDIFileData.FindAll(x => x.Line >= ST_Index).Select(x => x.Line).Distinct().ToArray().Length + 1; // +1 porque se cuente el SE01
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "S";
                    obeEDIFileData.Segment_Code = "SE";
                    obeEDIFileData.Element_Code = "SE-01";
                    obeEDIFileData.Element_Value = TotalSegments.ToString();
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);
                    string SE02_Value = EDIFileData.Find(x => x.Segment_Code == "ST" && x.Element_Code == "ST-02").Element_Value;
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "S";
                    obeEDIFileData.Segment_Code = "SE";
                    obeEDIFileData.Element_Code = "SE-02";
                    obeEDIFileData.Element_Value = SE02_Value;
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);
                    Line++;
                    //GE
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "FGT";
                    obeEDIFileData.Segment_Code = "GE";
                    obeEDIFileData.Element_Code = "GE-01";
                    obeEDIFileData.Element_Value = "1";// Por ahora WTS solo utiliza una transacccion por documento. 
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);
                    string GE02_Value = EDIFileData.Find(x => x.Segment_Code == "GS" && x.Element_Code == "GS-06").Element_Value;
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "S";
                    obeEDIFileData.Segment_Code = "GE";
                    obeEDIFileData.Element_Code = "GE-02";
                    obeEDIFileData.Element_Value = GE02_Value;
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);
                    Line++;
                    //IEA
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "ICT";
                    obeEDIFileData.Segment_Code = "IEA";
                    obeEDIFileData.Element_Code = "IEA-01";
                    obeEDIFileData.Element_Value = "1";// Por ahora WTS solo utiliza un isa por documento. 
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);
                    string IEA02_Value = EDIFileData.Find(x => x.Segment_Code == "ISA" && x.Element_Code == "ISA-13").Element_Value;
                    obeEDIFileData = new beEDIFileData();
                    obeEDIFileData.Section_Code = "ICT";
                    obeEDIFileData.Segment_Code = "IEA";
                    obeEDIFileData.Element_Code = "IEA-02";
                    obeEDIFileData.Element_Value = IEA02_Value;
                    obeEDIFileData.Line = Line;
                    EDIFileData.Add(obeEDIFileData);

                    //dataGridView1.DataSource = EDIFileData;
                    int numeroFilas = EDIFileData[EDIFileData.Count - 1].Line;
                    List<beEDIFileLine> EDIFileLine = new List<beEDIFileLine>();
                    beEDIFileLine obeEDIFileLine = new beEDIFileLine();
                    List<beEDIFileData> EDIDataLine = null;
                    int contSymbol = 0;
                    StringBuilder sb;
                    //var Elements = Configuration.Elements.OrderBy(x => x.Element_Code).GroupBy(x => new { x.Segment_Code, x.Element_Code }).ToList();
                    string value = string.Empty;
                    string[] split = null;
                    // Build Structure
                    for (int i = 1; i <= numeroFilas; i++)
                    {
                        obeEDIFileLine = new beEDIFileLine();
                        sb = null;
                        EDIDataLine = EDIFileData.FindAll(x => x.Line == i);
                        if (EDIDataLine.Count == 0)
                        {
                            continue;
                        }
                        sb = new StringBuilder();
                        sb.Append(EDIDataLine[0].Segment_Code);
                        foreach (var item in EDIDataLine)
                        {
                            if (i == 7)
                            {

                            }
                            split = item.Element_Code.Split('-');
                            if (split[0] == "PO4")
                            {
                                if (item.Element_Value == "")
                                {

                                }
                            }
                            

                            if (!string.IsNullOrEmpty(item.Element_Value))
                            {
                                if (split[0] == "PO4")
                                {

                                }
                                contSymbol = Convert.ToInt32(split[1]) - contSymbol;
                                value = value.PadLeft(contSymbol, Convert.ToChar(Configuration.Symbol.Symbol_SeparatorElement));
                                sb.Append(value);
                                sb.Append(item.Element_Value);
                                contSymbol = Convert.ToInt32(split[1]);
                                value = string.Empty;
                            }

                        }
                        sb.Append(Configuration.Symbol.Symbol_EndSegment);
                        obeEDIFileLine.Line_Number = i;
                        obeEDIFileLine.Line_Text = sb.ToString();
                        contSymbol = 0;
                        EDIFileLine.Add(obeEDIFileLine);
                    }
                    // Validar las Fechas (USAR MASCARA)
                    // Poner las Cabeceras del ISA y footer del ST
                    //string pathVAN = ConfigurationManager.AppSettings["PathVANG"].ToString();

                    string Path = pathVAN + "Marmaxx" + DateTime.Now.ToString("ddMMyyyy HHmmss") + ".esx";  //  + Configuration.Document_Extension;
                    EDIFile.File_Path = Path;
                    //using (StreamWriter sw = new StreamWriter(Path))
                    //{
                    //    foreach (var item in EDIFileLine)
                    //    {
                    //        sw.WriteLine(item.Line_Text);
                    //    }
                    //}
                    EDIFile.Company_ID = Company_ID;
                    EDIFile.Process_ID = "E";
                    EDIFile.Status_ID = "A";
                    EDIFile.EdiData = EDIFileData;
                    EDIFile.FileLine = EDIFileLine;
                }
            }
            catch (Exception ex)
            {
                GrabarArchivoLog(ex);
                EDIFile = null;
            }
        }

        public bool SaveEDI856Data(beEDIFile obeEDIFile)
        {
            bool resul = false;
            SqlTransaction ts = null;
            SqlConnection cn = null;
            try
            {
                cn = new SqlConnection(Util.EDI);
                cn.Open();
                ts = cn.BeginTransaction();
                daEDIFile odaEDIFile = new daEDIFile();
                int file_ID = odaEDIFile.SaveFile(obeEDIFile, cn, ts);
                if (file_ID <= 0) throw new Exception("Save File");
                //obeEDIFile.File_ID = file_ID;
                //resul = odaEDIFile.SaveFileLine(obeEDIFile, cn, ts);
                //if (!resul) throw new Exception("Save File Line");
                //resul = odaEDIFile.SaveFileData(obeEDIFile, cn, ts);
                //if (!resul) throw new Exception("Save File Data");
                resul = odaEDIFile.SaveControl(obeEDIFile.ControlID, file_ID, "SISTEMAS", cn, ts);
                if (!resul) throw new Exception("Save Control");
                resul = odaEDIFile.SaveControlGroup(obeEDIFile.ControlID, obeEDIFile.ControlGroupID, "SISTEMAS", cn, ts);
                if (!resul) throw new Exception("Save Control Group");
                daASN odaASN = new daASN();
                resul = odaASN.UpdateShipmentGroup_FileID(obeEDIFile.ShipmentGroupID, file_ID, cn, ts);
                if (!resul) throw new Exception("Update Shipment Group");
                                
                obeEDIFile.File_PathASN = obeEDIFile.File_PathASN + Path.GetFileName(obeEDIFile.File_Path);

                using (StreamWriter sw = new StreamWriter(obeEDIFile.File_PathASN))
                {
                    foreach (var item in obeEDIFile.FileLine)
                    {
                        sw.WriteLine(item.Line_Text);
                    }
                }
                File.Copy(obeEDIFile.File_PathASN, obeEDIFile.File_Path, true);

                ts.Commit();
                cn.Close();
            }
            catch (Exception ex)
            {
                ts.Rollback();
                cn.Close();
                resul = false;
                GrabarArchivoLog(ex);
            }
            return resul;
        }
    }
}
