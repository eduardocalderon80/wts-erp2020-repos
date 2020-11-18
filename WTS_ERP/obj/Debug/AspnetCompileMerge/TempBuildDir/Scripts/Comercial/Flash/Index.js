var appNewFlash = (
    function (d, idpadre) {
        var ovariables = {
            idCliente: '',
            link_video: '',
            flg_mantMensaje: '',
            adata: [],
            adataresult: [],
            msg_tmp: '',
            regresar: '',
        }

        var oUtil = {
            adata: [],
            adataresult: [],
            indiceactualpagina: 0,
            registrospagina: 30,
            paginasbloques: 3,
            indiceactualbloque: 0
        }

        function vervideoTutorial() {

            let params = '';

            _modalBody_new({
                url: 'Comercial/Flash/_videotutorialA',
                ventana: '_videotutorialA',
                titulo: 'Flash Cost A',
                parametro: '',
                alto: '500',
                ancho: '500',
                responsive: 'modal-lg'
            });
        }

        function load() {
            //$(".chosen-select").chosen({ width: "100%", placeholder_text_multiple: 'Seleccione Sub Área' }); multiselect
            _('btnFlashA').addEventListener('click', crearNuevo);
            _('btnupdatereporte').addEventListener('click', buscarFlash);   
            _('btn_Export').addEventListener('click', exportListFlash);
            _('btnRestaure').addEventListener('click', restaurarFiltros);  
            _('btnTutorial').addEventListener('click', vervideoTutorial); 
            _('btnUI01').addEventListener('click', customizarMensaje);
            _('btnUI02').addEventListener('click', customizarMensaje);
            _('btnUI03').addEventListener('click', customizarMensaje);
            _('btnUI05').addEventListener('click', customizarMensaje);
            _('btnUI06').addEventListener('click', customizarMensaje);
            _('btnUI08').addEventListener('click', customizarMensaje);
            _('btnUI09').addEventListener('click', customizarMensaje);           

         /*document.getElementById("iconflasha").title = titulo*///"Flash cost A: &#10; - Flash type that allows you to quote items one by one in detail. &#10; - See the tutorial for more information.";
          /*  $("#iconflasha").trigger()*/;          

            $('.input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
            fn_getDate();

            // Se obtiene parametro si tuviera
            const par = _('txtpar_index').value;
            if (!_isEmpty(par)) {
                ovariables.regresar = _par(par, 'regresar') !== '' ? _par(par, 'regresar') : '';
                if (ovariables.regresar) {
                    _('btnReturnRequerimiento').style.display = '';
                    _('btnReturnRequerimiento').onclick = function () {
                        const urlAccion = 'Requerimiento/Programa/Stages';
                        _Go_Url(urlAccion, urlAccion, par);
                    }
                }
            }
        }
               

        function remplazartodo(cadena, buscar, reemplazar) {

            var replace = buscar;
            var re = new RegExp(replace, "g");
            cadena = cadena.replace(re, reemplazar);
            return cadena;
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

        function buscarFlash() {

            let strfecini = '';
            let strfecfin = '';
            let fecini = '';
            let fecfin = '';

            strfecini = _('txtfechadesde').value;
            strfecfin = _('txtfechahasta').value;

            if (strfecini != '') {
                let ini = (strfecini).split('/');
                fecini = ini[2] + ini[0] + ini[1];
            }

            if (strfecfin != '') {
                let fin = (strfecfin).split('/');
                fecfin = fin[2] + fin[0] + fin[1];
            }

            let usu = _('cbousu').value;
            let cli = _('cbocli').value;
            let cliest = _('cbocliest').value; 
            let estilo = _('_txtstyle').value;
            let descripcion = _('_txtdescripcion').value;
            let fabricini = _('fabricini').value;
            let fabricfin = _('fabricfin').value;
            let colorini = _('colorini').value;
            let colorfin = _('colorfin').value;
            let estiloini = _('estiloini').value;
            let estilofin = _('estilofin').value;
            let estructura = _('_txtestructura').value;
            let costini = _('costini').value;
            let costfin = _('costfin').value;
            let pesoini = _('pesoini').value;
            let pesofin = _('pesofin').value;
            let anchoini = _('anchoini').value;
            let anchofin = _('anchofin').value;
            let efiini = _('efiini').value;
            let efifin = _('efifin').value;

            let leadership = _('_txtleadership').value;
            let leader = _('_txtleader').value;

            let code = _('_txtcode').value;
            let content = _('_txtcontent').value;
            let wash = _('cbowash').value;
            let stock = _('cbostock').value;
            let atx = _('_txtatx').value;
            let dye = _('cbodye').value;
            let obs = _('_txtobs').value;
            let listcabacera ='Flashid¬Tipo¬Fecha¬leaderShip¬leader¬Usuario¬Cliente¬Style¬Descripcion¬MinFabric¬MinColor¬MinStyle¬Structure¬CostDk¬Peso¬Ancho¬Eficiencia'

            let par = {
                fecini: fecini,
                fecfin: fecfin,
                usu: usu,
                cli: cli,
                cliest: cliest,
                estilo: estilo,
                descripcion: descripcion,
                fabricini: fabricini,
                fabricfin: fabricfin,
                colorini: colorini,
                colorfin: colorfin,
                estiloini: estiloini,
                estilofin: estilofin,
                estructura: estructura,
                costini: costini,
                costfin: costfin,
                pesoini: pesoini,
                pesofin: pesofin,
                anchoini: anchoini,
                anchofin: anchofin,
                efiini: efiini,
                efifin: efifin,

                leadership: leadership,
                leader: leader,

                code: code,
                content: content,
                wash: wash,
                stock: stock,
                atx: atx,
                dye: dye,
                obs: obs,

                listCabecera: listcabacera
            },
                url = 'Comercial/Flash/Get_FlashList?par=' + JSON.stringify(par);

            _Get(url)
                .then((rpta) => {
                    let odata = rpta !== '' ? CSVtoJSON(rpta) : null;
                    oUtil.adata = odata;
                    oUtil.adataresult = oUtil.adata;
                    llenartabla(odata);
                });
        }

        function restaurarFiltros() {

            fn_getDate();
            _('cbousu').value='0';
            _('cbocli').value = '0'; 
            _('_txtleadership').value = '0';
            _('_txtleader').value = '0';
            _('_txtstyle').value = ''; 
            _('_txttipo').value = '';
            _('_txtdescripcion').value = '';
            _('fabricini').value = '';
            _('fabricfin').value = '';
            _('colorini').value = '';
            _('colorfin').value = '';
            _('estiloini').value = '';
            _('estilofin').value = '';
            _('_txtestructura').value = '';
            _('costini').value = '';
            _('costfin').value = '';
            _('pesoini').value = '';
            _('pesofin').value = '';
            _('anchoini').value = '';
            _('anchofin').value = '';
            _('efiini').value = '';
            _('efifin').value = '';

            _('_txtcode').value = '';
            _('_txtcontent').value = '';
            _('cbowash').value = '0';
            _('cbostock').value = '2';
            _('_txtatx').value = '';
            _('cbodye').value = '0';
            _('_txtobs').value = '';

            _('cbocliest').value = '2';
            _('cbocli').value = '0';

            buscarFlash();

        }

        function exportListFlash() {

            let strfecini = '';
            let strfecfin = '';
            let fecini = '';
            let fecfin = '';

            strfecini = _('txtfechadesde').value;
            strfecfin = _('txtfechahasta').value;

            if (strfecini != '') {
                let ini = (strfecini).split('/');
                fecini = ini[2] + ini[0] + ini[1];
            }

            if (strfecfin != '') {
                let fin = (strfecfin).split('/');
                fecfin = fin[2] + fin[0] + fin[1];
            }
            
            let usu = _('cbousu').value;
            let cli = _('cbocli').value;
            let cliest = _('cbocliest').value;
            let estilo = _('_txtstyle').value;
            let descripcion = _('_txtdescripcion').value;
            let fabricini = _('fabricini').value;
            let fabricfin = _('fabricfin').value;
            let colorini = _('colorini').value;
            let colorfin = _('colorfin').value;
            let estiloini = _('estiloini').value;
            let estilofin = _('estilofin').value;
            let estructura = _('_txtestructura').value;
            let costini = _('costini').value;
            let costfin = _('costfin').value;
            let pesoini = _('pesoini').value;
            let pesofin = _('pesofin').value;
            let anchoini = _('anchoini').value;
            let anchofin = _('anchofin').value;
            let efiini = _('efiini').value;
            let efifin = _('efifin').value;

            let leadership = _('_txtleadership').value;
            let leader = _('_txtleader').value;

            let code = _('_txtcode').value;
            let content = _('_txtcontent').value;
            let wash = _('cbowash').value;
            let stock = _('cbostock').value;
            let atx = _('_txtatx').value;
            let dye = _('cbodye').value;
            let obs = _('_txtobs').value;
            let listcabacera = 'Flashid¬Tipo¬Fecha¬leaderShip¬leader¬Usuario¬Cliente¬Style¬Descripcion¬MinFabric¬MinColor¬MinStyle¬Structure¬CostDk¬Peso¬Ancho¬Eficiencia'

            let par = {
                fecini: fecini,
                fecfin: fecfin,
                usu: usu,
                cli: cli,
                cliest: cliest,
                estilo: estilo,
                descripcion: descripcion,
                fabricini: fabricini,
                fabricfin: fabricfin,
                colorini: colorini,
                colorfin: colorfin,
                estiloini: estiloini,
                estilofin: estilofin,
                estructura: estructura,
                costini: costini,
                costfin: costfin,
                pesoini: pesoini,
                pesofin: pesofin,
                anchoini: anchoini,
                anchofin: anchofin,
                efiini: efiini,
                efifin: efifin,

                leadership: leadership,
                leader: leader,

                code: code,
                content: content,
                wash: wash,
                stock: stock,
                atx: atx,
                dye: dye,
                obs: obs,

                listCabecera: listcabacera
            }
            let urlaccion = urlBase() + 'Comercial/Flash/Export_ListFlash?par=' + JSON.stringify(par);
            $.ajax({
                type: 'GET',
                url: urlaccion,
                dataType: 'json',
                async: false,
                //data: { idfacturav: idfacturav }
            }).done(function (data) {
                if (data.Success) {
                    urlaccion = urlBase() + 'Comercial/Flash/descargarexcel';
                    window.location.href = urlaccion;
                }
            });

        }


        function llenartabla(odata, indice) {
            let html = '';
            let tbody = _('tbody_FlashList');
            if (indice == undefined) {
                indice = 0;
            }

            /* funcionalidad de paginacion*/

            oUtil.adataresult = odata;
            let inicio = oUtil.indiceactualpagina * oUtil.registrospagina;

            if (odata !== null && odata != '') {

                let fin = inicio + oUtil.registrospagina, i = 0, x = odata.length;

                for (let i = inicio; i < fin; i++) {
                    if (i < x) {
                        html += `<tr data-par='CodigoFlash:${odata[i].Flashid}}'>                                                                                
                                            <td class='text-center' style='vertical-align: middle;'>
                                                <button type='button' class='btn btn-xs btn-success cls_copy_Flash' data-idflash='${odata[i].Flashid}' title='Copiar'>
                                                    <span class='fa fa-copy'></span>
                                                </button>
                                                <button type='button' class='btn btn-xs btn-primary cls_edit_Flash' data-idflash='${odata[i].Flashid}' title='Ver Flash'>
                                                    <span class='fa fa-eye'></span>
                                                </button>
                                            </td>
                                            <td>${odata[i].Flashid}</td>
                                            <td>${odata[i].Type}</td>
                                            <td>${odata[i].Date}</td>
                                            <td>${odata[i].leaderShip}</td>
                                            <td>${odata[i].leader}</td>
                                            <td>${odata[i].User}</td>
                                            <td>${odata[i].Client}</td>
                                            <td>${odata[i].Client_Status}</td>
                                            <td>${odata[i].Style}</td>
                                            <td>${odata[i].Description}</td>
                                            <td>${odata[i].MinFabric}</td>
                                            <td>${odata[i].MinColor}</td>
                                            <td>${odata[i].MinStyle}</td>
                                            <td>${odata[i].Structure}</td>
                                             <td>${odata[i].CostDk}</td>
                                             <td>${odata[i].Weight}</td>
                                            <td>${odata[i].Width}</td>
                                             <td>${odata[i].Efficiency}</td>
                                            <td>${odata[i].Code}</td>
                                            <td>${odata[i].Content}</td>
                                            <td>${odata[i].Wash}</td>
                                            <td>${odata[i].Stock}</td>
                                            <td>${odata[i].AtxCode}</td>
                                            <td>${odata[i].TypeDye}</td>
                                            <td>${odata[i].Observation}</td></tr>`;
                    }
                }

                tbody.innerHTML = html;

                _('foot_paginacion').innerHTML = page_result(odata, indice);
                _('lbldesRegistro').innerHTML = '&nbsp;'+(i + 1) +' results of   '+x+' found';

            } else {
                tbody.innerHTML = '';
                _('lbldesRegistro').innerHTML = '';
            }

            handler_tbl();

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
                    contenido += "<li data-indice='-1'> <a onclick='appNewFlash.paginar(-1, appNewFlash.llenartabla);' > << </a></li>";
                    contenido += "<li data-indice='-2'> <a onclick='appNewFlash.paginar(-2, appNewFlash.llenartabla);' > < </a></li>";
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
                        contenido += `<a class='${clsactivo}' onclick='appNewFlash.paginar(`;
                        contenido += i.toString();
                        contenido += `, appNewFlash.llenartabla);'>`;
                        contenido += (i + 1).toString();
                        contenido += `</a>`;
                        contenido += `</li>`;
                    }
                    else break;
                }
                if (oUtil.indiceactualbloque < indiceultimobloque) {
                    contenido += "<li data-indice='-3'> <a onclick='appNewFlash.paginar(-3, appNewFlash.llenartabla);' > > </a></li>";
                    contenido += "<li data-indice='-4'> <a onclick='appNewFlash.paginar(-4, appNewFlash.llenartabla);' > >> </a></li>";
                }
            }

            let foot = `<nav>
                            ${contenido}
                        </nav>
                `;
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

            ////pintartablaindex(oUtil.adataresult, indice);
            callback_pintartabla(oUtil.adataresult, indice);
        }

        function handler_tbl() {
            let tbody = _('tbody_FlashList');
            let arr = Array.from(tbody.rows);
            if (tbody.rows.length > 0) {
                arr.forEach(x => {
                    let btnedit = x.getElementsByClassName('cls_edit_Flash')[0];
                    btnedit.addEventListener('click', fn_edit_flash, false);

                    let btncopy = x.getElementsByClassName('cls_copy_Flash')[0];
                    btncopy.addEventListener('click', fn_copiar_flash, false);
                });
            }
        }

        function fn_edit_flash(e) {
            let o = e.currentTarget;
            let idFlash = o.getAttribute('data-idflash'),
                parametro = `id:${idFlash}`,
                url = 'Comercial/Flash/_View';
            _Go_Url(url, url, parametro);
        }

        function fn_copiar_flash(e) {
            let o = e.currentTarget;
            let idFlash = o.getAttribute('data-idflash'),
                parametro = `id:${idFlash}`,
                url = 'Comercial/Flash/New';
            _Go_Url(url, url, parametro);
        }

        function crearNuevo() {
            req_new('0')
        }

        function req_new(idFlash) {

            let urlaccion = 'Comercial/Flash/New';
            let urljs = 'Comercial/Flash/New';
            let parametro = `id:${idFlash}`;
            _Go_Url(urlaccion, urljs, parametro);
        }
        function req_ini() {

            obtenerFiltros();        

        }

        function obtenerFiltros() {

            let par = { valor: 1 };
            var urlaccion = 'Comercial/Flash/listFiltroReporte?par=' + JSON.stringify(par);
            Get(urlaccion, llenarComboInicial)
        }
        
        function llenarComboInicial(data) {
            let rpta = data != null ? JSON.parse(data) : null;
            if (rpta != null) {

                let datacsv = rpta[0].listCliente;
                let odata = _comboFromCSV(datacsv);
                let filasdata = odata.length;
                let cbo_cliente = '';
                    
                //for (let i = 0; i < filasdata; i++) {

                //    let label = odata[i].label;
                //    let valor = odata[i].valor
                //    cbo_cliente += `<option value='${valor}'>${label}</option>`;                   
                //}
                //$(".chosen-container").css("pointer-events", "");
                //$(".chosen-choices").css("background-color", "");
                $(".chosen-container").css("pointer-events", "");
                $(".chosen-choices").css("background-color", "");
                _('cbocli').innerHTML = odata;
                //$(".chosen-select").trigger('chosen:updated');
                //$(".chosen-select").trigger('chosen:updated');
                _('cbousu').innerHTML = _comboFromCSV(rpta[0].listUsuario);
                _('cbocliest').innerHTML = _comboFromCSV(rpta[0].listClienteEst);

                ovariables.link_video = rpta[0].videoflash; 
                ovariables.flg_mantMensaje = rpta[0].flg_mantMensaje;                 

                _('cbowash').innerHTML = _comboFromCSV(rpta[0].listWash);
                _('cbodye').innerHTML = _comboFromCSV(rpta[0].listDye);
                _('cbostock').innerHTML = _comboFromCSV(rpta[0].stock);

                _('_txtleadership').innerHTML = _comboFromCSV(rpta[0].leadership);
                _('_txtleader').innerHTML = _comboFromCSV(rpta[0].leader);

                cargartoltip(rpta);
                buscarFlash();
            }
        }

        function cargartoltip(rpta) {
            cargarmensaje('btnUI01', rpta[0].UI01)
            cargarmensaje('btnUI02', rpta[0].UI02)
            cargarmensaje('btnUI03', rpta[0].UI03)
            //cargarmensaje('btnUI04', rpta[0].UI04)
            cargarmensaje('btnUI05', rpta[0].UI05)
            cargarmensaje('btnUI06', rpta[0].UI06)
            //cargarmensaje('btnUI07', rpta[0].UI07)
            cargarmensaje('btnUI08', rpta[0].UI08)
            cargarmensaje('btnUI09', rpta[0].UI09)
            //cargarmensaje('btnUI10', rpta[0].UI10)

        }

        function cargarmensaje(control, mensaje) {

            var titulo = `linea1
                        linea2
                        linea3
                        linea4
                        linea5
                        linea6
                        linea7
                        linea8
                        linea9
                        `;
           
            let aData = mensaje.split('*');
            let reg = aData.length;

            for (x = 0; x < reg; x++) {
                let y = x + 1;
                let linea = aData[x];
                titulo = remplazartodo(titulo, 'linea' + y, linea);
               
            }

            for (x = reg; x < 9; x++) {
                let y = x + 1;
                titulo = remplazartodo(titulo, 'linea' + y, '');
               
            }

            document.getElementById(control).title = titulo
            //document.getElementById(control).title2 = titulo2

        }

        function customizarMensaje(e) {

            if (ovariables.flg_mantMensaje == 'S') {

                let o = e.currentTarget;
                let strId = o.getAttribute('id');
                let mensaje = document.getElementById(strId).title;
                ovariables.msg_tmp = mensaje
                let params = strId ;

                _modalBody_new({
                    url: 'Comercial/Flash/_personalizarMensaje',
                    ventana: '_personalizarMensaje',
                    titulo: 'Customize Message',
                    parametro: params,
                    alto: '325',
                    ancho: '500',
                    responsive: 'modal-lg'
                });

            }
        }

        return {
            load: load,
            req_ini: req_ini,
            llenartabla: llenartabla,
            paginar: paginar,
            ovariables: ovariables,
            cargarmensaje: cargarmensaje,
        }
    }

)(document, 'panelencabezado_Flash_list');
(function ini() {
    appNewFlash.load();
    appNewFlash.req_ini();

})()