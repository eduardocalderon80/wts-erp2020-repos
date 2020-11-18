var app_NewFabric = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: 0,
            idPrograma: 0,
            actualizarimagen: 0,
            actualizardoc: 0,
            docnombre: '',
            docoriginal: '',

            ListaTipoClienteFabricCSV: [],
            ListaEstructuraCsv: [],
            ListaRespuestaGeneralCsv: [],
            ListaFabricOwnerCsv: [],

            ListaTipoLavadoCsv: [],
            ListaTipoProveedorCsv: [],
            ListaProveedorCsv: [],
            ListaEstadoCsv: [],
            ListaCategoriaTelaCsv: [],
            ListRegistros: [],
            tmpCboTipoFile: '',
            flgCambioImagen: 0,
            ListaSistemasTitulosCsv: [],
            ListaTitulosCsv: [],
            ListaMateriaPrimaCsv: [],
            ListaRequests: [],

            ArrayGuardarTitulo: [],
            ArrayGuardarContenido: [],

            rutaFileServer: '',

            ListaProductoColor: [],
            ListaEnlacesColor: [],
            ListaEnlacesArte: [],
            ListaComboEstado: []
        }

        function load() {
            _('btnSaveFabric').addEventListener('click', guardarRequerimientoTela);
            _('btnFabricSendRqs').addEventListener('click', fn_reqs_fabric_tabs);
            _('btnFabricAddYarn').addEventListener('click', fn_addyarn);
            _('btnFabricAddContent').addEventListener('click', fn_addcontent);
            _('btnFabricAddCombination').addEventListener('click', fn_addcombination);
            // Change Status
            _('btnHoldFabric').addEventListener('click', fn_changestatushold);
            _('btnDropFabric').addEventListener('click', fn_changestatusdrop);

            //setear el id que recibe:inicio
            const par = _('ParamsTela').value;
            _('IdRequerimiento').value = _par(par, 'Idrequerimiento') !== '' ? _parseInt(_par(par, 'Idrequerimiento')) : 0;
            _('IdRequerimientoDetalle').value = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
            _('IdPrograma').value = _par(par, 'Idprograma') !== '' ? _parseInt(_par(par, 'Idprograma')) : 0;
            _('IdCliente').value = _par(par, 'Idcliente') !== '' ? _parseInt(_par(par, 'Idcliente')) : 0;
            ovariables.idPrograma = _par(par, 'Idprograma') !== '' ? _parseInt(_par(par, 'Idprograma')) : 0;
            ovariables.idcliente = _par(par, 'Idcliente') !== '' ? _parseInt(_par(par, 'Idcliente')) : 0;
            ovariables.id = _('IdRequerimiento').value = _par(par, 'Idrequerimiento') !== '' ? _parseInt(_par(par, 'Idrequerimiento')): 0;
            //setear el id que recibe:fin

            fn_createscroll();
            loadimage();
            loadFileRequerimento();

            $("#cbo_facolor, #cboCorreosTela, #cboFabricColor").select2({
                width: '100%'
            });
            
            //fn_console_table();
                        
        }

        function habilitarRequerimiento() {

            // SI ES NUEVO O EDITAR
                        
            if (_('IdRequerimiento').value !== '0') {
                
                _('modal_title_NewFabric').innerText = 'Edit Fabric';
                _('btnFabricSendRqs').style = "";
                _('btnFabricValidationRQs').style.display = "";

                if (_('IdEstado').value === 1007) {

                    _('btnHoldFabric').style.display = "";
                    _('btnDropFabric').style.display = "";

                } else {
                    _('btnHoldFabric').style.display = "none";
                    _('btnDropFabric').style.display = "none";
                }

                // Tabs
                $("#modal_NewFabric .nav-tabs").children().eq(1).css("display", "");
                $("#modal_NewFabric .nav-tabs").children().eq(2).css("display", "");
                $("#modal_NewFabric .nav-tabs").children().eq(3).css("display", "");
                $("#modal_NewFabric .nav-tabs").children().eq(4).css("display", "");

                _('btnSaveFabric').innerHTML = `<span class="fa fa-save"></span> Update`;

                _('tabfa-2').style.display = "";
                _('tabfa-3').style.display = "";
                _('tabfa-4').style.display = "";
                _('tabfa-5').style.display = "";

                $("#cboStatusFabric").closest(".form-group").css("display", "");
            } else {

                _('modal_title_NewFabric').innerText = 'New Fabric';
                $("#modal_NewFabric .nav-tabs").children().eq(1).css("display", "none");
                $("#modal_NewFabric .nav-tabs").children().eq(2).css("display", "none");
                $("#modal_NewFabric .nav-tabs").children().eq(3).css("display", "none");
                $("#modal_NewFabric .nav-tabs").children().eq(4).css("display", "none");

                // Tabs
                _('tabfa-2').style.display = "none";
                _('tabfa-3').style.display = "none";
                _('tabfa-4').style.display = "none";
                _('tabfa-5').style.display = "none";

                _('btnSaveFabric').innerHTML = `<span class="fa fa-save"></span> Save`;
                $("#cboStatusFabric").closest(".form-group").css("display", "none");
                
            }

        }
        // TEMPORAL
        function Reqs(RequestName, FieldName, Id, DataId, Parent, ClassName) {
            this.RequestName = RequestName;
            this.FieldName = FieldName;
            this.Id = Id;
            this.DataId = DataId;
            this.Parent = Parent;
            this.ClassName = ClassName;
        }
        function fn_console_table() {
            var fabric_reqs = [
                new Reqs("Textile analysis", "Fabric Description", "txtFabricDescription", "descripcion", 3, "form-group"),
                new Reqs("Textile analysis", "Fabric Category", "cboFabricCategory", "category", 3, "form-group"),
                new Reqs("Textile analysis", "Structure", "cboFabricStructure", "structure", 3, "form-group"),
                new Reqs("Search for hangers by fabric description", "Fabric Description", "txtFabricDescription", "descripcion", 3, "form-group"),
                new Reqs("Projected textile analysis", "Fabric Description", "txtFabricDescription", "descripcion", 3, "form-group"),
                new Reqs("Projected textile analysis", "Fabric Category", "cboFabricCategory", "category", 3, "form-group"),
                new Reqs("Projected textile analysis", "Structure", "cboFabricStructure", "structure", 3, "form-group"),
                new Reqs("Fabric quotation", "Fabric Description", "txtFabricDescription", "descripcion", 3, "form-group"),
                new Reqs("Fabric quotation", "Fabric Category", "cboFabricCategory", "category", 3, "form-group"),
                new Reqs("Fabric quotation", "Structure", "cboFabricStructure", "structure", 3, "form-group"),
                new Reqs("Fabric quotation", "Denstity", "txtFabricDensity", "density", 5, "form-group"),
                new Reqs("Fabric quotation", "Wash", "cboFabricWash", "wash", 5, "form-group"),
                new Reqs("Laboratory testing", "Client Color RQs", "cboFabricColor", "color", 0, "form-group"),
                new Reqs("Laboratory testing", "Fabric Description", "txtFabricDescription", "descripcion", 3, "form-group"),
                new Reqs("Laboratory testing", "Direct Supplier Name", "cboFabricSupplierName", "directsuppliername", 3, "form-group"),
                new Reqs("Laboratory testing", "Density", "txtFabricDensity", "density", 5, "form-group"),
                new Reqs("Laboratory testing", "Wash", "cboFabricWash", "wash", 5, "form-group")
            ];
            console.table(fabric_reqs);
        }
        // FIN TEMPORAL

        function req_ini() {
            ovariables.rutaFileServer = _('rutaFileServerTela').value;
            _promise()
                .then(obtenerCargaInicialTela())
                .then(obtenerEnlacesTela())    
                .then(habilitarRequerimiento())    
        
            //listarFileRequerimiento();
        }
         
        //FUNCIONALIDAD CARGA DE PANTALLA:INICIO

        function fn_createscroll() {
            $('#scrollSummary').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#div_tbl_samples').slimScroll({
                height: '310px',
                width: '100%',
                railOpacity: 0.9
            });
            $('.feed-activity-list').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#div_tbl_files_fa').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#fa_scroll_summary').slimScroll({
                height: '420px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function obtenerCargaInicialTela() {

            let err = function (__err) { console.log('err', __err) };
            let IdRequerimiento = _('IdRequerimiento').value;

            let parametro = { IdCliente: ovariables.idcliente, IdRequerimiento: IdRequerimiento };

            _Get('Requerimiento/Tela/GetFabricLoadNew_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {

                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        ovariables.ListaTipoClienteFabricCSV = rpta.ListaTipoClienteFabricCSV !== '' ? CSVtoJSON(rpta.ListaTipoClienteFabricCSV) : [];
                        ovariables.ListaEstructuraCsv = rpta.ListaEstructuraCsv !== '' ? CSVtoJSON(rpta.ListaEstructuraCsv) : [];
                        ovariables.ListaRespuestaGeneralCsv = rpta.ListaRespuestaGeneralCsv !== '' ? CSVtoJSON(rpta.ListaRespuestaGeneralCsv) : [];
                        ovariables.ListaFabricOwnerCsv = rpta.ListaFabricOwnerCsv !== '' ? CSVtoJSON(rpta.ListaFabricOwnerCsv) : [];
                        ovariables.ListaTipoLavadoCsv = rpta.ListaTipoLavadoCsv !== '' ? CSVtoJSON(rpta.ListaTipoLavadoCsv) : [];
                        ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                        ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                        ovariables.ListaEstadoCsv = rpta.ListaEstadoCsv !== '' ? CSVtoJSON(rpta.ListaEstadoCsv) : [];
                        ovariables.ListaCategoriaTelaCsv = rpta.ListaCategoriaTelaCsv !== '' ? CSVtoJSON(rpta.ListaCategoriaTelaCsv) : [];
                        ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : [];
                        ovariables.ListaRequests = rpta.ListaRequests !== '' ? JSON.parse(rpta.ListaRequests) : [];

                        ovariables.ListaSistemasTitulosCsv = rpta.ListaSistemasTitulosCsv !== '' ? CSVtoJSON(rpta.ListaSistemasTitulosCsv) : [];
                        ovariables.ListaTitulosCsv = rpta.ListaTitulosCsv !== '' ? CSVtoJSON(rpta.ListaTitulosCsv) : [];
                        ovariables.ListaMateriaPrimaCsv = rpta.ListaMateriaPrimaCsv !== '' ? CSVtoJSON(rpta.ListaMateriaPrimaCsv) : [];

                        /*Para estados*/
                        const estadosdt = rpta.ListaEstadosDT !== '' ? CSVtoJSON(rpta.ListaEstadosDT) : [];
                        let json_estados = {};
                        estadosdt.forEach(x => {
                            json_estados[x.codigo] = x.descripcion;
                        });
                        ovariables.ListaEstadosDT = json_estados;

                        _promise()
                            .then(llenarControlesTela())
                            .then(setearCamposTela(rpta)) 
                            .then(habilitarRequerimiento()) 
                       
                    }
                }, (p) => { err(p); });
        }

        function setearCamposTela(rpta) {
            let idRequerimiento = _('IdRequerimiento').value;
            if (parseInt(idRequerimiento) > 0) {
                rpta.ListaTipoFileCsv
                _('cboFabricTypeReq').value = rpta.TipoSolicitud;
                _('cboFabricOwner').value = rpta.Duenio;
                _('txtFabricWTSCode').value = rpta.CodigoTelaWTS;
                _('txtFabricDescription').value = rpta.DescripcionTela;
                _('txtFabricReportATX').value = rpta.ReporteAtx;
                _('txtFabricReportLab').value = rpta.ReporteLaboratorio;
                _('txtFabricTradeName').value = rpta.NombreComercial;
                _('cboFabricCategory').value = rpta.Categoria;
                forzarOnchange('cboFabricCategory');
                
                _('txtFabricDensity').value = rpta.Densidad;
                _('cboFabricWash').value = rpta.TipoLavado;
                _('txtFabricTitle').value = fn_get_titulo_text(rpta.TituloHilado !== '' ? JSON.parse(rpta.TituloHilado) : []);
                _('txtFabricContent').value = fn_get_contenido_text(rpta.Contenido !== '' ? JSON.parse(rpta.Contenido) : []);
                ovariables.ArrayGuardarTitulo = rpta.TituloHilado !== '' ? JSON.parse(rpta.TituloHilado) : [];
                ovariables.ArrayGuardarContenido = rpta.Contenido !== '' ? JSON.parse(rpta.Contenido) : [];
                _('cboFabricColor').value = rpta.ColorCliente;
                _('cboFabricSupplierDirecType').value = rpta.IdTipoProveedorDirecto;
                forzarOnchange('cboFabricSupplierDirecType');
                _('cboFabricSupplierDirecName').value = rpta.IdProveedorDirecto;
             
                _('cboFabricSupplierType').value = rpta.IdTipoProveedor;
                forzarOnchange('cboFabricSupplierType');
                _('cboFabricSupplierName').value = rpta.IdProveedor;
                _('txtFabricSupplierCode').value = rpta.CodigoProveedor;
                _('txtFabricBulkNumer').value = rpta.NumeroBulk;
                _('txtFabricNotes').value = rpta.Nota;
                _('IdEstado').value = rpta.IdEstado;
                _('cboFabricStructure').value = rpta.Estructura;
                forzarOnchange('cboFabricColor');
                _('cboStatusFabric').value = _capitalizePhrase(rpta.estadoNombre);
                // Llena foto
                if (rpta.ImagenNombre !== '') {
                    _('imgSketchTela').src = 'http:' + ovariables.rutaFileServer + rpta.ImagenNombre;
                } else {
                    _('imgSketchTela').src = 'http:' + `${ovariables.rutaFileServer}sinimagen.jpg`;
                }
                // Documento
                _('txtNameFileTela').innerHTML = rpta.DocOriginal;
                ovariables.docnombre = rpta.DocNombre;
                ovariables.docoriginal = rpta.DocOriginal;
                pintar_tbl_combinaciones(rpta.ListaCombinaciones !== '' ? JSON.parse(rpta.ListaCombinaciones) : []);
                fn_req_correos();
            } else {

                _('cboFabricSupplierDirecName').value = '';
                _('cboFabricSupplierName').value = '';
                //_('cboFabricOwner').value = '';
                _('cboFabricCategory').value = '';
                _('cboFabricStructure').value = '';
                _('cboFabricWash').value = '';
            }
        }

        function pintar_tbl_combinaciones(json) {
            let html = '';
            if (json.length > 0) {
                json.forEach(x => {
                    html += `<tr data-id="${x.IdCombinacion}">
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="app_NewFabric.fn_delete_combination(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>${x.TipoProducto}</td>
                                <td>${x.ComboColor}</td>
                                <td>${x.ComboArte}</td>
                                <td>${x.ReqType}</td>
                                <td>${x.ArtCode}</td>
                                <td>${x.ArtType}</td>
                                <td>${x.Technique}</td>
                                <td>${x.ArtDescripcion}</td>
                                <td>${x.Estado}</td>
                            </tr>`;
                });
            }
            _('tbody_tbl_combinations').innerHTML = html;
        }

        function obtenerEnlacesTela() {
            let idRequerimiento = _('IdRequerimiento').value;
            if (parseInt(idRequerimiento) > 0) {
                let err = function (__err) { console.log('err', __err) };
                let IdRequerimiento = _('IdRequerimiento').value;
                let parametro = { IdRequerimiento: IdRequerimiento };
                _Get('Requerimiento/Tela/GetEnlacesTela?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.ListaProductoColor = rpta.ListaProductoColor !== '' ? JSON.parse(rpta.ListaProductoColor) : [];
                            ovariables.ListaEnlacesColor = rpta.ListaEnlacesColor !== '' ? JSON.parse(rpta.ListaEnlacesColor) : [];
                            ovariables.ListaEnlacesArte = rpta.ListaEnlacesArte !== '' ? JSON.parse(rpta.ListaEnlacesArte) : [];
                            ovariables.ListaComboEstado = rpta.ListaComboEstado !== '' ? JSON.parse(rpta.ListaComboEstado) : [];
                        }
                    }, (p) => { err(p); });
            }
        }

        function fn_delete_combination(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this combination",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                if (id !== null) {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            IdCombinacion: id,
                        }, frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Tela/DeleteEnlacesCombinaciones', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                button.parentElement.parentElement.remove();
                                req_ini();
                                swal({ title: "Good job!", text: "The combination was deleted successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                } else {
                    button.parentElement.parentElement.remove();
                    swal({ title: "Good job!", text: "The combination was deleted successfully", type: "success", timer: 5000 });
                }
            });
        }

        function fn_combo_product() {
            let html = '<option value="">Select</option>';
            if (ovariables.ListaProductoColor.length > 0) {
                html += ovariables.ListaProductoColor.map(x => {
                    return `<option value="${x.codigo}">${x.descripcion}</option>`;
                }).join('');
            }
            return html;
        }

        function fn_combo_status() {
            let html = '<option value="">Select</option>';
            if (ovariables.ListaComboEstado.length > 0) {
                html += ovariables.ListaComboEstado.map(x => {
                    return `<option value="${x.codigo}">${x.descripcion}</option>`;
                }).join('');
            }
            return html;
        }

        function fn_combo_arte() {
            let html = '<option value="">Select</option>';
            if (ovariables.ListaEnlacesArte.length > 0) {
                html += ovariables.ListaEnlacesArte.map(x => {
                    return `<option value="${x.idcombocolor}">${x.descripcion}</option>`;
                }).join('');
            }
            return html;
        }

        function fn_combo_arte_change(e) {
            const val = e.value;
            const tr = e.parentElement.parentElement;
            if (val !== '' && val !== '0') {
                const filter = ovariables.ListaEnlacesArte.filter(x => x.idcombocolor === _parseInt(val))[0];
                tr.children[4].innerHTML = filter.reqtype;
                tr.children[5].innerHTML = filter.artcode;
                tr.children[6].innerHTML = filter.arttype;
                tr.children[7].innerHTML = filter.technique;
                tr.children[8].innerHTML = filter.artdescripcion;
            } else {
                tr.children[4].innerHTML = "";
                tr.children[5].innerHTML = "";
                tr.children[6].innerHTML = "";
                tr.children[7].innerHTML = "";
                tr.children[8].innerHTML = "";
            }
        }

        function fn_combo_color(e) {
            const val = e.value;
            const select = e.parentElement.nextElementSibling.children[0];
            const filter = ovariables.ListaEnlacesColor.filter(x => x.tipoproducto === val);
            if (filter.length > 0) {
                select.innerHTML = `<option value="">Select</option> ${filter.map(x => {
                    return `<option value="${x.idcombocolor}">${x.descripcion}</option>`;
                }).join('')}`;
            } else {
                select.innerHTML = `<option value="">Select</option>`;
            }
        }

        function fn_val_tblempty() {
            let bool = true;
            [...document.querySelectorAll("#tbody_tbl_combinations .input-sm")].forEach(x => {
                if (x.value === '' || x.value === '0') {
                    bool = false;
                    x.style = 'border: 1px solid red !important;';
                } else {
                    x.style = '';
                }
            });
            return bool;
        }

        function fn_getval_tbl() {
            let array = [];
            const tbody = [..._('tbody_tbl_combinations').children];
            if (tbody.length > 0) {
                tbody.forEach(x => {
                    if (x.getAttribute("data-id") === null) {
                        let json = {};
                        json.TipoProducto = x.children[1].children[0].value;
                        json.IdComboColor = x.children[2].children[0].value;
                        json.IdComboArte = x.children[3].children[0].value;
                        json.Estado = x.children[9].children[0].value;
                        array.push(json);
                    }
                });
            }
            return array;
        }

        function fn_addcombination() {
            if (ovariables.ListaEnlacesColor.length > 0) {
                if (ovariables.ListaEnlacesArte.length > 0) {
                    const tbody = _('tbody_tbl_combinations');
                    tbody.innerHTML += `<tr>
                                            <td>
                                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewFabric.fn_delete_combination(this)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <select class="form-control input-sm" onchange="app_NewFabric.fn_combo_color(this)">${fn_combo_product()}</select>
                                            </td>
                                            <td>
                                                <select class="form-control input-sm">
                                                    <option value="">Select</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select class="form-control input-sm" onchange="app_NewFabric.fn_combo_arte_change(this)">
                                                    ${fn_combo_arte()}
                                                </select>    
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <select class="form-control input-sm">
                                                    ${fn_combo_status()}
                                                </select>
                                            </td>
                                        </tr>`;
                } else {
                    swal({ title: "Warning", text: "There are no ornaments linked to this requirement", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "There are no colors linked to this requirement", type: "warning", timer: 5000 });
            }
        }

        /* FUNCION PARA JSON */
        function fn_get_titulo_text(array) {
            let texto = '';
            if (array.length > 0) {
                array.forEach(x => {
                    // Save text
                    if (texto !== '') {
                        texto += `, ${x.NombreTituloHiladoTela} ${x.NombreSistemaTitulacion}`;
                    } else {
                        texto += `${x.NombreTituloHiladoTela} ${x.NombreSistemaTitulacion}`;
                    }
                });
            }
            return texto;
        }
        function fn_get_contenido_text(array) {
            let texto = '';
            if (array.length > 0) {
                array.forEach(x => {
                    // Save text
                    if (texto !== '') {
                        texto += `, ${x.PorcentajeComposicion} ${x.NombreMateriaPrima}`;
                    } else {
                        texto += `${x.PorcentajeComposicion} ${x.NombreMateriaPrima}`;
                    }
                });
            }
            return texto;
        }
        /* FIN */

        function forzarOnchange(controlId) {

            var element = document.getElementById(controlId);
            var event = new Event('change');
            element.dispatchEvent(event);
        }

        function llenarControlesTela() {

            llenarComboCsv('cboFabricTypeReq', ovariables.ListaTipoClienteFabricCSV, 0, 0)
            //llenarComboCsv('cboFabricStructure', ovariables.ListaEstructuraCsv, 1, 0)
            llenarComboCsv('cboFabricOwner', ovariables.ListaFabricOwnerCsv, 0, 0)
            llenarComboCsv('cboFabricWash', ovariables.ListaTipoLavadoCsv, 1, 0)
            llenarComboCsv('cboFabricSupplierDirecType', ovariables.ListaTipoProveedorCsv, 0, 0)
            llenarComboCsv('cboFabricSupplierDirecName', ovariables.ListaProveedorCsv, 0, 0)
            llenarComboCsv('cboFabricSupplierType', ovariables.ListaTipoProveedorCsv, 0, 0)
            //llenarComboCsv('cboFabricSupplierName', ovariables.ListaProveedorCsv, 0, 0)
            llenarComboCsv('cboFabricCategory', ovariables.ListaCategoriaTelaCsv, 0, 0)

            ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');

            // Default & Onchange -- Structure
            let lststructure = app_NewFabric.ovariables.ListaEstructuraCsv.filter(x => (x.Tipo === _('cboFabricCategory').value || x.Tipo ==='') );
            llenarComboCsv('cboFabricStructure', lststructure, 1, 0);

            _('cboFabricCategory').onchange = function () {
                let lststructure = ovariables.ListaEstructuraCsv.filter(x => x.Tipo === _('cboFabricCategory').value);
                llenarComboCsv('cboFabricStructure', lststructure, 1, 0);
            }

            // Default & Onchange -- Suppliername
            let lstsupplier = ovariables.ListaProveedorCsv.filter(x => (x.Tipo === _('cboFabricSupplierType').value || x.Tipo ===''));
            llenarComboCsv('cboFabricSupplierName', lstsupplier, 1, 0);
            _('cboFabricSupplierType').onchange = function () {
                let lstsupplier = ovariables.ListaProveedorCsv.filter(x => x.Tipo === _('cboFabricSupplierType').value || x.Tipo === '');
                llenarComboCsv('cboFabricSupplierName', lstsupplier, 1, 0);
            }

            // Fill request table
            llenarTablaRequests();
            // Listar files
            listarFileRequerimiento();
        }

        function llenarTablaRequests() {
            const tbody = _('tbody_tbl_files_comm');
            if (ovariables.ListaRequests.length > 0) {
                const requests = ovariables.ListaRequests.map(x => {
                    return `<tr>
                                <td>${x.FechaCreacion}</td>
                                <td>${x.Nombre}</td>
                                <td></td>
                                <td>${x.IdSolicitud}</td>
                                <td>
                                    <button type="button" class="btn btn-xs btn-primary">
                                        <i class="fa fa-paperclip"></i>
                                    </button>
                                </td>
                                <td>${x.Descripcion}</td>
                                <td>${x.Proveedor}</td>
                                <td>${x.Comentario}</td>
                                <td>${x.Estado !== '' ? ovariables.ListaEstadosDT[x.Estado] : ''}</td>
                                <td>${x.FechaEstado}</td>
                                <td>${x.NombreOperador}</td>
                                <td>${x.DTComentario}</td>
                                <td></td>
                            </tr>`;
                }).join('');
                tbody.innerHTML = requests;
            }
        }

        function llenarComboCsv(control, listCsv) {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;
        }

        //FUNCIONALIDAD CARGA DE PANTALLA:FIN

        //FUNCIONALIDAD DE IMAGEN:INICIO

        function loadimage() {

            _('inputImageTela').onchange = function () {
               
                ovariables.actualizarimagen = 1;
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();

                if (ext != '') {
                    switch (ext) {
                        case 'jpg':
                        case 'jpeg':
                        case 'png':
                            showimage(this);
                            break;
                        default:
                            swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
                            this.value = '';
                            _('imgSketchTela').src = '';
                        }
                }
            }
                        

            _('btnDeleteUploadTela').onclick = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                _('imgSketchTela').src = '';
                _('inputImageTela').value = '';
            }

            _('inputTelaDoc').onchange = function () {
                ovariables.actualizardoc = 1;
            }
            _('btnDeleteUploadDoc').onclick = function () {
                ovariables.actualizardoc = 1;
            }
            _('btnDownloadUploadDoc').onclick = function () {
                const docnombre = ovariables.docnombre;
                const docoriginal = ovariables.docoriginal;
                if (_isnotEmpty(docnombre) && _isnotEmpty(docoriginal)) {
                    downloadfile(docnombre, docoriginal);
                }
            }
        }

        function showimage(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('imgSketchTela').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        //FUNCIONALIDAD DE IMAGEN: FIN
               
        //FUNCIONALIDAD FILE REQUERIMIENTO:INICIO

        function InicializarTablaFile() {
            $("#tbl_files_fa").DataTable({
                info: false,
                lengthChange: false,
                ordering: true,
                order: [1, 'asc'],
                paging: false,
                searching: false
            });
        }

        function loadFileRequerimento() {
            _('inputFileRequerimientoTela').onchange = function () {
                // Set actualizar              
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'pdf':
                    case 'doc':
                    case 'docx':
                    case 'txt':
                        guardarFileRequerimientoTela(this);
                        break;
                    default:
                        swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                        input.value = '';
                }
            }
        }

        function fn_listFileProperty() {

            let resultado = [];
            let arrRows = Array.from(_('tbody_files_fa').rows);

            let i = 0;
            arrRows.forEach(x => {

                let IdFile = x.getAttribute('data-id');
                let selects = x.getElementsByTagName('select');
                if (selects.length > 0) {

                    let Tipo = selects[0].value;

                    let obj = {};
                    obj.IdFile = IdFile;
                    obj.Tipo = Tipo;

                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function guardarFileRequerimientoTela() {

            let IdRequerimiento = ovariables.id;
            let IdFile = '0';

            let objRequerimientoTela = {
                IdRequerimiento: IdRequerimiento,
                IdFile: IdFile
            }

            let frm = new FormData();

            frm.append('requerimientoTelaJSON', JSON.stringify(objRequerimientoTela));
            frm.append('archivoTela', $("#inputFileRequerimientoTela")[0].files[0]);

            _Post('Requerimiento/Tela/SaveFileRequerimiento', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {

                        listarFileRequerimiento();
                        swal({
                            title: "Good job!",
                            text: "The file was created successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });
                      
                        _('btnUpdate').click();
                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
        }

        function listarFileRequerimiento() {

            dibujarTablaFile();
            let IdRequerimiento = ovariables.id;
            let IdFile = '0';            
            let objRequerimientoTela = {
                IdRequerimiento: IdRequerimiento,
                IdFile: IdFile
            }

            let frm = new FormData();
            frm.append('requerimientoTelaJSON', JSON.stringify(objRequerimientoTela));            

            _Post('Requerimiento/Tela/GetListaFileRequerimiento_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta !== null) {
                        ovariables.ListRegistros = orpta;
                        _promise()
                            .then(crearTablaFileRequerimiento(ovariables.ListRegistros))
                            .then(InicializarTablaFile())                        
                            .then(setearTipoFileRequerimiento(ovariables.ListRegistros))  
                    }
                }, (p) => { err(p); });
        }

        function dibujarTablaFile() {

            document.getElementById("div_tbl_files_fa").innerHTML = "";
            document.getElementById("div_tbl_files_fa").innerHTML = `<table class="table table-hover table-bordered table-vertical-center" id="tbl_files_fa">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="no-sort" width="6%"></th>
                                                                            <th width="32%">Name</th>
                                                                            <th width="20%">User</th>
                                                                            <th width="22%">Type</th>
                                                                            <th width="20%">Upload Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="tbody_files_fa"></tbody>
                                                                </table>`;
        }

        function crearTablaFileRequerimiento(data) {

            const html = data.map(x => {
                return `<tr data-id="${x.IdFile}" data-req="${x.IdRequerimiento}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewFabric.deletefile(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewFabric.downloadfile('${x.FileNombre}', '${x.FileOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.FileOriginal}</td>
                            <td>${_capitalizePhrase(x.UsuarioCreacion)}</td>
                            <td><select class="input-sm form-control _enty_buscar" style="width: 100%;"  data-required="true" data-min="1" data-max="200" id="cboTipoFile_${x.IdFile}">${ovariables.tmpCboTipoFile}</select></td>
                            <td>${x.FechaCreacion}</td>
                        </tr>`;
            }).join('');
            _('tbody_files_fa').innerHTML = '';
            _('tbody_files_fa').innerHTML = html;
        }

        function setearTipoFileRequerimiento(data) {

            data.forEach(x => {
                _('cboTipoFile_' + x.IdFile).value = x.Tipo;
            });
        }

        function downloadfile(nombrearchivo, nombrearchivooriginal) {

            let urlaccion = `../Requerimiento/Tela/DownLoadFile?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            window.location.href = urlaccion;
        }

        function deletefile(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            const idreq = button.parentElement.parentElement.getAttribute("data-req");
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this file",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },

                    parametro = {
                        IdFile: id,
                        IdRequerimiento: idreq

                    }, frm = new FormData();
                frm.append('requerimientoFileTelaJSON', JSON.stringify(parametro));
                _Post('Requerimiento/Tela/DeleteFileRequerimiento_jSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            listarFileRequerimiento();
                            swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        //FUNCIONALIDAD FILE REQUERIMIENTO:FIN

        function fn_after_saved() {
            if (_('IdRequerimiento').value !== '0') {
                _('btnFabricSendRqs').style = "";
                _('btnFabricValidationRQs').style.display = "";
                _('btnHoldFabric').style.display = '';
                _('btnDropFabric').style.display = '';

                _('btnSaveFabric').innerHTML = `<span class="fa fa-save"></span> Update`;

                $("#cboStatusFabric").closest(".form-group").css("display", "");
            } else {
                _('btnFabricSendRqs').style.display = "none";
                _('btnFabricValidationRQs').style.display = "none";
                _('btnHoldFabric').style.display = 'none';
                _('btnDropFabric').style.display = 'none';

                _('btnSaveFabric').innerHTML = `<span class="fa fa-save"></span> Save`;

                $("#cboStatusFabric").closest(".form-group").css("display", "none");
            }
        }

        function guardarCombinacionesTela() {
            if (_('IdRequerimiento').value !== '' && _('IdRequerimiento').value !== '0') {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdRequerimiento: _('IdRequerimiento').value,
                        JsonInfo: fn_getval_tbl()
                    }, frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Tela/SaveEnlacesCombinaciones', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        console.log(orpta);
                    }, (p) => { err(p); });
            }
        }
               
        //FUNCIONALIDAD DE REQUERIMIENTO TELA : INICIO   
        function guardarRequerimientoTela() {
            if (fn_val_tblempty()) {

                var objRequerimientoTela = _getParameter({ id: 'tabfa-1', clase: 'enty_fabric' });
                var resultadoFileProp = fn_listFileProperty();
                objRequerimientoTela.IdPrograma = ovariables.idPrograma;
                objRequerimientoTela.IdCliente = ovariables.idcliente;
                objRequerimientoTela.TituloHilado = JSON.stringify(ovariables.ArrayGuardarTitulo);
                objRequerimientoTela.Contenido = JSON.stringify(ovariables.ArrayGuardarContenido);
                objRequerimientoTela.ActualizarImagen = ovariables.actualizarimagen;
                objRequerimientoTela.ActualizarDoc = ovariables.actualizardoc;

                if (validarRequerimientoTela(objRequerimientoTela)) {
                    const req_enty = _required({ clase: '_enty_buscar', id: 'tabfa-2' });
                    if (req_enty) {

                        let frm = new FormData();

                        frm.append('RequerimientoTelaJSON', JSON.stringify(objRequerimientoTela));
                        frm.append('ImagenTela', $("#inputImageTela")[0].files[0]);
                        frm.append('ImagenDoc', $("#inputTelaDoc")[0].files[0]);
                        frm.append('requerimientoFilePropJSON', JSON.stringify(resultadoFileProp));

                        _Post('Requerimiento/Tela/SaveRequerimientoTela_JSON', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    _('IdRequerimiento').value = orpta.id;
                                    guardarCombinacionesTela();
                                    swal({
                                        title: "Good job!",
                                        text: "The style was created successfully",
                                        type: "success",
                                        timer: 5000,
                                        showCancelButton: false,
                                        confirmButtonColor: "#1c84c6",
                                        confirmButtonText: "OK",
                                        closeOnConfirm: false
                                    });
                                    fn_after_saved();
                                    req_ini();
                                    _('btnUpdate').click();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    } else {
                        swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
                    }
                }
            } else {
                swal({ title: "Warning", text: "Complete the red fields in Combinations", type: "warning", timer: 5000 });
            }
        }
        
        function validarRequerimientoTela(parametroJS) {
            var result = true;
            return result;
        }

        //FUNCIONALIDAD DE REQUERIMIENTO TELA : FIN

        function fn_show_reqs(e) {
            let button = $(e).find('span');
            let element = $('#div_fabric_reqs');
            element.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        }

        $("input[name='reqs_fabric_select']").click(function () {
            const index = $("input[name='reqs_fabric_select']").index(this);
            $("input[name='reqs_fabric_select']").prop("disabled", true);
            $(this).prop("disabled", false);

            // Validacion solicitud B y C
            if (index === 1 || index === 4) {
                $("input[name='reqs_fabric_select']").eq(5).prop("disabled", false);
                if ($("input[name='reqs_fabric_select']").eq(5).prop("checked") && $("input[name='reqs_fabric_select']:checked").length === 1) {
                    $("input[name='reqs_fabric_select']").eq(1).prop("disabled", false);
                    $("input[name='reqs_fabric_select']").eq(4).prop("disabled", false);
                }
            }

            if (index === 5) {
                if ($("input[name='reqs_fabric_select']").eq(5).prop("checked") && $("input[name='reqs_fabric_select']:checked").length === 1) {
                    $("input[name='reqs_fabric_select']").eq(1).prop("disabled", false);
                    $("input[name='reqs_fabric_select']").eq(4).prop("disabled", false);
                }
            }

            $("input[name='reqs_fabric_select']:checked").prop("disabled", false);

            if (!$(this).prop("checked") && $("input[name='reqs_fabric_select']:checked").length === 0) {
                $("input[name='reqs_fabric_select']").prop("disabled", false);
                // Fijos
                $("input[name='reqs_fabric_select']").eq(0).prop("disabled", true);
                $("input[name='reqs_fabric_select']").eq(6).prop("disabled", true);
                $("input[name='reqs_fabric_select']").eq(8).prop("disabled", true);
            }
            //$("input[name='reqs_fabric_select']:not(:disabled)")
        });

        function fn_reqs_fabric_tabs() {
            const marcado = $("input[name='reqs_fabric_select']:checked").length;
            if (marcado === 1) {
                const index = $("input[name='reqs_fabric_select']").index($("input[name='reqs_fabric_select']:checked"));
                // SHOW MODAL
                if (val_fields([index])) {
                    fn_modal_tabs_reqs_fabric(index, 0);
                } else {
                    swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
                }
            } else if (marcado === 2) {
                const index1 = $("input[name='reqs_fabric_select']").index($("input[name='reqs_fabric_select']:checked")[0]);
                const index2 = $("input[name='reqs_fabric_select']").index($("input[name='reqs_fabric_select']:checked")[1]);
                // SHOW MODAL
                if (val_fields([index1, index2])) {
                    fn_modal_tabs_reqs_fabric(index1, index2);
                } else {
                    swal({ title: "Warning", text: "Complete the red fields", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "You have to select at least 1 requirement", type: "warning", timer: 5000 });
            }
        }

        function val_fields(array) {
            let bool = false;
            array.forEach(x => {
                const index = _parseInt(x);
                if (index === 1) {
                    // ANALISIS TEXTIL
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#cboFabricTypeReq', '#txtFabricDensity', '#txtFabricTitle', '#txtFabricContent']
                    });
                } else if (index === 2) {
                    // TEST DE LABORATORIO
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#cboFabricSupplierDirecType', '#cboFabricSupplierDirecName', '#txtFabricDescription', '#txtFabricDensity']
                    });
                } else if (index === 3) {
                    // COLGADORES WTS
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#txtFabricDescription']
                    });
                } else if (index === 4) {
                    // FICHA DE INSPIRACION
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#cboFabricTypeReq', '#txtFabricDensity', '#txtFabricTitle', '#txtFabricContent']
                    });
                } else if (index === 5) {
                    // COTIZACION TELA
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#txtFabricDescription', '#txtFabricContent', '#txtFabricDensity', '#cboFabricCategory']
                    });
                } else if (index === 7) {
                    // ANALISIS TEXTIL PASADO
                    bool = _required_arrayid({
                        id: "#panelEncabezado_NewFabric",
                        array: ['#cboFabricTypeReq', '#txtFabricDensity', '#txtFabricTitle', '#txtFabricContent']
                    });
                }
            });
            return bool;
        }

        function fn_modal_tabs_reqs_fabric(index1, index2) {
            _modalBody_Backdrop({
                url: 'Requerimiento/Tela/_FabricReqs',
                idmodal: 'FabricRequirements',
                paremeter: `id:${ovariables.id},accion:new,idcliente:${ovariables.idcliente},index1:${index1},index2:${index2}`,
                title: 'Fabric Requirements',
                width: '',
                height: '600',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        function fn_addyarn() {
            const accion = _('txtFabricTitle').value !== '' ? 'edit' : 'new';
            _modalBody_Backdrop({
                url: 'Requerimiento/Tela/_AddYarns',
                idmodal: 'AddYarnsSize',
                paremeter: `id:${ovariables.id},accion:${accion},idcliente:${ovariables.idcliente}`,
                title: 'Add Yarns Size',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_addcontent() {
            const accion = _('txtFabricContent').value !== '' ? 'edit' : 'new';
            _modalBody_Backdrop({
                url: 'Requerimiento/Tela/_AddContent',
                idmodal: 'AddContent',
                paremeter: `id:${ovariables.id},accion:${accion},idcliente:${ovariables.idcliente}`,
                title: 'Add Content',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_changestatushold() {
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will change the status for this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                let parametro = {
                    IdRequerimiento: ovariables.id,
                    IdEstado: 108
                };
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Tela/UpdateEstadoTela', frm, true)
                    .then((resultado) => {
                        if (resultado !== '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            _('btnUpdate').click();
                            req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_changestatusdrop() {
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will change the status for this requirement",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                let parametro = {
                    IdRequerimiento: ovariables.id,
                    IdEstado: 109
                };
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Tela/UpdateEstadoTela', frm, true)
                    .then((resultado) => {
                        if (resultado !== '') {
                            swal({ title: "Good job!", text: "The requirement was send successfully", type: "success", timer: 5000 });
                            _('btnUpdate').click();
                            req_ini();
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_req_correos() {
            const err = function (__err) { console.log('err', __err) };
            const parametro = { IdRequerimiento: ovariables.id };
            _Get('Requerimiento/Programa/GetCorreoReq?par=' + JSON.stringify(parametro))
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        ovariables.lstcorreos = rpta;
                        fn_create_mailbox(ovariables.lstcorreos);
                    }
                }, (p) => { err(p); });
        }

        function fn_create_mailbox(data) {
            if (data.length > 0) {
                const mail_header = _('mailbox_header_fabric');
                const html = data.map(x => {
                    return `<div class="feed-element feed-cursor" data-id="${x.IdBandeja}" onclick="app_NewFabric.fn_load_mail(this)">
                                <div class="media-body">
                                    <strong>${_capitalizePhrase(x.NombreUsuario)}</strong> send a new email. <br>
                                    <strong>Subject</strong>: ${x.Titulo} <br>
                                    <small class="text-muted">${x.FechaRegistro}</small>
                                </div>
                            </div>`;
                }).join("");
                mail_header.innerHTML = html;
            }
        }

        function fn_load_mail(button) {
            const id = button.getAttribute("data-id");
            if (id !== "" && id !== null) {
                const mail_body = _('mailbox_body_fabric');
                const filter = ovariables.lstcorreos.filter(x => x.IdBandeja === _parseInt(id))[0];
                const html = `<div class="mail-box-header" style="background: inherit !important;">
                                    <h2>${filter.NombreUsuario}</h2>
                                    <h3>${filter.Titulo}</h3>
                                    <h5>
                                        <span class="pull-right font-noraml">${filter.FechaRegistro}</span>
                                        <span class="font-noraml">To: </span>${filter.Para} <br />
                                        <span class="font-noraml">CC: </span>${filter.Copia}
                                    </h5>
                                </div>
                                <div class="mail-body">${filter.Contenido}</div>`;
                mail_body.innerHTML = html;
            }
        }
              
        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            deletefile: deletefile,
            downloadfile: downloadfile,
            fn_show_reqs: fn_show_reqs,
            fn_delete_combination: fn_delete_combination,
            fn_combo_color: fn_combo_color,
            fn_val_tblempty: fn_val_tblempty,
            fn_getval_tbl: fn_getval_tbl,
            fn_combo_arte_change: fn_combo_arte_change,
            fn_load_mail: fn_load_mail
        }
    }
)(document, 'panelEncabezado_NewFabric');
(
    function ini() {
        app_NewFabric.load();
        app_NewFabric.req_ini();
    }
)();