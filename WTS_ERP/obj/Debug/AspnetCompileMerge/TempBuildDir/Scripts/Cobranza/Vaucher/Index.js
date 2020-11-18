var appBuscarVaucher = (
    function (d, idpadre) {
        var ovariables_Vaucher = {
            arrcliente: '',
            nroFactura: '',
            nroVaucher: '',
            fechaIni: '',
            fechaFin: '',
            adata: [],
            adataresult: []
        }

        var oUtil = {
            adata: [],
            adataresult: [],
            indiceactualpagina: 0,
            registrospagina: 10,
            paginasbloques: 3,
            indiceactualbloque: 0
        }

        function load() {
            _('btnnew').addEventListener('click', crearNuevo); 
            _('btnBuscarVaucher').addEventListener('click', listarVaucher); 
            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();
         }

        function fn_getDate() {

                let odate = new Date();
                let mes = odate.getMonth() + 1;
                let day = odate.getDate();
                let anio = odate.getFullYear();
                if (day < 10) { day = '0' + day }
                if (mes < 10) { mes = '0' + mes }
                let desde = `01/01/${(anio - 1)}`;
                let hasta = `${mes}/${day}/${anio}`;
                _('txtfechadesde').value = desde;
                _('txtfechahasta').value = hasta;
        }

        function crearNuevo() {
            req_new('0')
        }  

        function req_ini() {

            obtenerFiltros();
            listarVaucher();
        }

        function obtenerFiltros() {
            var urlaccion = 'Cobranza/Vaucher/listFiltroIndex';
            Get(urlaccion, llenarCombo)
        }

            function llenarCombo(data) {

          let rpta = data != null ? JSON.parse(data) : null, html = '';
          if (rpta != null) { _('cbocliente').innerHTML = _comboFromCSV(rpta[0].listCliente);}
        }

        function listarVaucher() {

            let cliente = _('cbocliente').value;
            let vaucher = _('txtvaucher').value;
            let factura = _('txtfactura').value;
            let fecIni = (_('txtfechadesde').value).split("/");
            let fecFin = (_('txtfechahasta').value).split("/");

             let par = {
                 cliente: cliente,
                 vaucher: vaucher,
                 factura: factura,
                 fecIni: fecIni[2] + fecIni[0] + fecIni[1],
                 fecFin: fecFin[2] + fecFin[0] + fecFin[1]
             },
              url = 'Cobranza/Vaucher/Get_VaucherList?par=' + JSON.stringify(par);

                _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    oUtil.adata = odata;
                    oUtil.adataresult = oUtil.adata;
                    llenartabla(odata);
                });
        }

        function llenartabla(odata, indice) {

            let html = '';
            let tbody = _('tbody_vaucherList');

            if (indice == undefined) {indice = 0;}

            /* funcionalidad de paginacion*/

            oUtil.adataresult = odata;            
           
            if (odata !== null) {

                let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;
                let fin = odata.length - 1, i = 0, x = odata.length;

                for (let i = inicio; i <= fin; i++) {
                    if (i < x) {
                        //<td>${odata[i].idVaucher}</td>
                        let colorRow = '';//odata[i].idVaucher == '1' ? 'bgcolor="#FAFAFA"' : '';
                        let strBotton = '';
                        let strBottonReporte = '';
                        let strBottonOcultar = '';
                        let display = '';
                        let Aling = 'center';
                        let trid = '';
                        let id = odata[i].codCliente + '_' + odata[i].codFecha;
                        let strPrefijo = '';
                        let strFecha = '';
                        let vbuttonDlt = '';
                        let name

                        if (odata[i].idVaucher == '1') {

                            colorRow = 'bgcolor="#fafafa"';
                            Aling = 'left';
                            strFecha = odata[i].Fecha;

                            strBotton += " <button id='btn_v_" + id +"' type='button' style='display:none;' class='btn btn-xs btn-success cls_view_Vaucher' data-idVaucher='" + odata[i].Cliente + "' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Show'>"
                            strBotton = strBotton + "<span class='fa fa-plus-square' ></span>"
                            strBotton = strBotton + "</button >"

                            strBottonOcultar += " <button id='btn_o_" + id +"'  type='button' class='btn btn-xs btn-danger cls_ocultar_Vaucher' data-idVaucher='" + odata[i].Cliente + "' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Hide'>"
                            strBottonOcultar = strBottonOcultar + "<span class='fa fa-minus-square' ></span>"
                            strBottonOcultar = strBottonOcultar + "</button >"

                            strBottonReporte += " <button id='btn_rpt_" + id + "'  type='button' class='btn btn-xs btn-success cls_rpt_cab_Vaucher' data-idVaucher='0' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Download report'>"
                            strBottonReporte = strBottonReporte + "<span class='fa fa-download' ></span>"
                            strBottonReporte = strBottonReporte + "</button >"                      

                        } else {
                       
                            strPrefijo = 'Voucher Nro: '
                            display = ' style="" ';
                            trid = id;
                            strBotton += " <button type='button' class='btn btn-xs btn-primary cls_edit_Vaucher' data-idVaucher='" + odata[i].Cliente + "' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Edit'>"
                            strBotton = strBotton + "<span class='fa fa-edit' ></span>"
                            strBotton = strBotton + "</button >"

                            vbuttonDlt += " <button type='button' class='btn btn-xs btn-danger cls_dlt_Vaucher' data-idVaucher='" + odata[i].Cliente + "' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Delete voucher'>"
                            vbuttonDlt = vbuttonDlt + "<span  class='fa fa-trash' ></span>"
                            vbuttonDlt = vbuttonDlt + "</button >"


                            strBottonReporte += " <button id='btn_rpt_" + id + "'  type='button' class='btn btn-xs btn-success cls_rpt_det_Vaucher' data-idVaucher='" + odata[i].Cliente + "' codCliente='" + odata[i].codCliente + "' Cliente='" + odata[i].desCliente + "'  codFecha='" + odata[i].codFecha + "'  Fecha='" + odata[i].Fecha + "'    title='Download report'>"
                            strBottonReporte = strBottonReporte + "<span class='fa fa-download' ></span>"
                            strBottonReporte = strBottonReporte + "</button >"
                        }

                        html += ` <tr ` + colorRow + `  ` + display + `  class='` + trid + `'  codCliente='${odata[i].codCliente}' codFecha='${odata[i].codFecha}'  data-par='CodigoVaucher:${odata[i].idVaucher}'>
                                    <td class='text-` + Aling + `' style='vertical-align: middle;'> ` + vbuttonDlt + `  ` + strBotton + `  ` + strBottonOcultar + `  ` + strBottonReporte +`</td>
                                    <td>` + strPrefijo + ` ${odata[i].Cliente}</td>
                                    <td style="text-align:right">${odata[i].Facturas}</td>
                                    <td style="text-align:right">` + strFecha + `</td> 
                                    <td style="text-align:right">${odata[i].Monto}</td>
                                    </tr>
                                `;
                    }
                }
                tbody.innerHTML = html;
                //let htmlfoot = page_result(odata, indice);
                //_('foot_paginacion').innerHTML = htmlfoot;
                handler_tbl();
                handler_tbl_view();

            } else {
                tbody.innerHTML = '';
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'No se encontro ningun Registro!'
                });
            }         
         }

        function ConfirmEliminar_document(e) {

            let o = e.currentTarget;
            let idVaucher = o.getAttribute('data-idVaucher');

            swal({
                title: "Desea Eliminar el Voucher?",
                text: '',
                type: "warning",
                //html: '<p>Mensaje de texto con <strong>formato</strong>.</p>',
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true
            }, function (rpta_confirmacion) {
                if (rpta_confirmacion) {
                    Eliminar_vaucher(idVaucher);
                }
                return;
            });
        }

        function Eliminar_vaucher(idVaucher) {

            let vaucher = '{ "hf_idVaucher": "' + idVaucher + '" }';
            let form = new FormData();
            let urlaccion = 'Cobranza/Vaucher/EliminarVaucher';
            form.append('par', vaucher);

            _Post(urlaccion, form, true)
                .then((rpta) => {
                    listarVaucher();
                }, (p) => {
                    err(p);
                });
        }

    function handler_tbl() {

        let tbody = _('tbody_vaucherList');
        let arr = Array.from(tbody.rows);
            arr = arr.filter(function (el) { return el.bgColor=='' });

        if (tbody.rows.length > 0) {
            arr.forEach(x => {
                let btnedit = x.getElementsByClassName('cls_edit_Vaucher')[0];
                btnedit.addEventListener('click', fn_edit_Vaucher, false);

                let btnrptDet = x.getElementsByClassName('cls_rpt_det_Vaucher')[0];
                btnrptDet.addEventListener('click', DescargaReporteVaucher, false); 

                let btnrptDlt = x.getElementsByClassName('cls_dlt_Vaucher')[0];
                btnrptDlt.addEventListener('click', ConfirmEliminar_document, false); 

                
            });
        }
    }

    function DescargaReporteVaucher(e) {

            let o = e.currentTarget;
            let codCliente = o.getAttribute('codCliente');
            let codFecha = o.getAttribute('codFecha');
            let idVaucher = o.getAttribute('data-idVaucher');

            var params = '{"cod_cliente":"' + codCliente + '","id_voucher":"' + idVaucher + '","fecha_inicio":"' + codFecha + '","fecha_fin":"' + codFecha +'"}';
            //url = '@Url.Action("DownloadReport", "Vaucher" , new { par = "xxxx"})';
            //params = 'vvvvv';
            //url = url.replace("xxxx", params);
            let url = "../Cobranza/Vaucher/DownloadReport?par=" + params;
            location.href = url;
     }

    function handler_tbl_view() {

        let tbody = _('tbody_vaucherList');
        let arr = Array.from(tbody.rows);
        arr = arr.filter(function (el) { return el.bgColor == '#fafafa' });

        if (tbody.rows.length > 0) {
            arr.forEach(x => {
                let btnVer = x.getElementsByClassName('cls_view_Vaucher')[0];
                btnVer.addEventListener('click', fn_ver_Vaucher, false);

                let btnOcu = x.getElementsByClassName('cls_ocultar_Vaucher')[0];
                btnOcu.addEventListener('click', fn_ocultar_Vaucher, false);

                let btnrptDet = x.getElementsByClassName('cls_rpt_cab_Vaucher')[0];
                btnrptDet.addEventListener('click', DescargaReporteVaucher, false);
            });
        }
    }

    function fn_ver_Vaucher(e) {

        let o = e.currentTarget;    
        let codCliente = o.getAttribute('codCliente');
        let codFecha = o.getAttribute('codFecha');
        let tbody = _('tbody_vaucherList');
        let arr = Array.from(tbody.rows);

        document.getElementById("btn_o_" + codCliente + '_' + codFecha).style.display = "";
        document.getElementById("btn_v_" + codCliente + '_' + codFecha).style.display = "none";

        arr = arr.filter(function (el) {
            return el.className == codCliente + '_' + codFecha;
        });

        arr.forEach(x => {
            x.style.display = '';           
        });      
     }

    function fn_ocultar_Vaucher(e) {

        let o = e.currentTarget;
        let codCliente = o.getAttribute('codCliente');
        let codFecha = o.getAttribute('codFecha');
        let tbody = _('tbody_vaucherList');
        let arr = Array.from(tbody.rows);

        document.getElementById("btn_o_" + codCliente + '_' + codFecha).style.display = "none";
        document.getElementById("btn_v_" + codCliente + '_' + codFecha).style.display = "";

        arr = arr.filter(function (el) {
            return el.className == codCliente + '_' + codFecha;
        });

        arr.forEach(x => {
            x.style.display = 'none';
        });
    }

    function fn_edit_Vaucher(e) {
        let o = e.currentTarget;
        let idVaucher = o.getAttribute('data-idVaucher');
        let codCliente = o.getAttribute('codCliente');
        let codFecha = o.getAttribute('codFecha');
        let Cliente = o.getAttribute('Cliente');
        let Fecha = o.getAttribute('Fecha');
        let params = idVaucher + '_' + codCliente + '_' + codFecha + '_' + Cliente + '_' + Fecha;
        req_new(params);           
    }

    function req_new(idVaucher) {

        let urlaccion = 'Cobranza/Vaucher/New';
        let urljs = 'Cobranza/Vaucher/New';         
        let parametro = idVaucher;           
        _Go_Url(urlaccion, urljs, parametro);
    }

    function page_result(padata, indice) {  // padata es la data parseada databdenbruto.JSON.parse(databrutodesdebd)
            var contenido = "";
            if (padata != null && padata.length > 0) {
                var nregistros = padata.length;
                var indiceultimapagina = Math.floor(nregistros / oUtil.registrospagina);
                if (nregistros % oUtil.registrospagina == 0) indiceultimapagina--;

                var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                if (nregistros % registrosbloque == 0) indiceultimobloque--;

                contenido += "<ul class='pagination'>";
                if (oUtil.indiceactualbloque > 0) {
                    contenido += "<li data-indice='-1'> <a onclick='appBuscarVaucher.paginar(-1, appBuscarVaucher.llenartabla);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appBuscarVaucher.paginar(-2, appBuscarVaucher.llenartabla);' > < </a></li>";
                }
                var inicio = oUtil.indiceactualbloque * oUtil.paginasbloques;
                var fin = inicio + oUtil.paginasbloques;
                let clsactivo = '';
                for (let i = inicio; i < fin; i++) {
                    if (i <= indiceultimapagina) {
                        if (indice == i) {
                            clsactivo = 'active_paginacion'
                        } else {
                            clsactivo = ''
                        }
                        if (indice == -1) {
                            if (i == 0) {
                                clsactivo = 'active_paginacion';
                            }
                        } else if (indice == -4) {
                            if (i == indiceultimapagina) {
                                clsactivo = 'active_paginacion';
                            }
                        } else if (indice == -2 || indice == -3) {
                            if (i == inicio) {
                                clsactivo = 'active_paginacion'
                            }
                        }
                        contenido += `<li class='${clsactivo}' data-indice='${i}'>`;
                        contenido += `<a class='${clsactivo}' onclick='appBuscarVaucher.paginar(`;
                        contenido += i.toString();
                        contenido += `, appBuscarVaucher.llenartabla);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appBuscarVaucher.paginar(-3, appBuscarVaucher.llenartabla);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appBuscarVaucher.paginar(-4, appBuscarVaucher.llenartabla);' > >> </a></li>";
                }
            }

            let foot = `<nav>${contenido}</nav>`;
            return foot;
    }

    function paginar(indice, callback_pintartabla) {
        if (indice > -1) {
            oUtil.indiceactualpagina = indice;
        }
        else {
            switch (indice) {
                case -1:
                    oUtil.indiceactualbloque = 0;
                    oUtil.indiceactualpagina = 0;
                    break;
                case -2:
                    oUtil.indiceactualbloque--;
                    oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                    break;
                case -3:
                    oUtil.indiceactualbloque++;
                    oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                    break;
                case -4:
                    var nregistros = oUtil.adataresult.length;
                    var registrosbloque = oUtil.registrospagina * oUtil.paginasbloques;
                    var indiceultimobloque = Math.floor(nregistros / registrosbloque);
                    if (nregistros % registrosbloque == 0) indiceultimobloque--;
                    oUtil.indiceactualbloque = indiceultimobloque;
                    oUtil.indiceactualpagina = oUtil.indiceactualbloque * oUtil.paginasbloques;
                    break;
            }
        }
        callback_pintartabla(oUtil.adataresult, indice);
    }
        return {
            load: load,
            paginar: paginar,
            req_ini: req_ini
        }
    }

)(document, 'panelencabezado_Vaucher');
(function ini() {
    appBuscarVaucher.load();
    appBuscarVaucher.req_ini();
  
})()