var app_NewColor = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            idcliente: 0,
            ListaEstadoRqCSV: [],
            ListaTipoClienteFabricCSV: [],
            ListaTipoTelaCsv: [],
            ListaTipoProveedorCsv: [],
            ListaProveedorCsv: [],
            ListaTipoFileCsv: [],
            ListaTestPacknameCsv: [],
            ListaTipoTenidoCsv: [],
            ListaTipoProductoComboCsv: [],
            ListaTipoProductoComboStr: '',
            ListaTipoProductoComboMetodoCsv: [], 
            ListaColorTelaCsv: [], 
            strColorTela: '',
            strComboDetalle:'',
            ListaTipoTenidoStr: '',
            ListaReporteTestEstadotStr: '',
            tmpCboTipoFile: '',
            tmpCboProvTest: '',
            tmpCboTestList: '',
            tmpCboReportTestList: '',
            idPrograma: 0,
            rutaFileServer: '',
            flgCambioImagen: 0,
            flgEnvioTest: 0,
            codfase: appStages.ovariables.codfase,
            TipoSolicitud: 'SE',
            flgCopy: 0,
            TipoSolicitudDescrip :'Seasonal',
            flgCarryOver: false,
            IdRequerimientoPadre:0
        }

        function load() {    
            // Disable autocomplete by default
            _disableAutoComplete();

            //setear el id que recibe:inicio
            const par = _('ParamsColor').value;
            _('IdRequerimientoDetalle').value = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
            ovariables.id = _par(par, 'Idrequerimiento') !== '' ? _parseInt(_par(par, 'Idrequerimiento')) : 0;
            ovariables.idPrograma = _par(par, 'Idprograma') !== '' ? _parseInt(_par(par, 'Idprograma')) : 0;
            ovariables.idcliente = _par(par, 'Idcliente') !== '' ? _parseInt(_par(par, 'Idcliente')) : 0;
            //setear el id que recibe:fin

            _('btnAddNewColor').addEventListener('click', fn_new);           
            _('btnAddNewPackNameColor').addEventListener('click', fn_addtests_list_item);
            _('btnSave').addEventListener('click', fn_ejecutarbtnSave);
            _('btnEnviarTest').addEventListener('click', fn_ejecutarbtnEnvio);
            _('btnAddReportList').addEventListener('click', AddReportList); 
            _('btnBuscarTela').addEventListener('click', buscarTela); 
            _('cboFabricType').addEventListener('change', ValidarTipoTela);

            loadimage(); 
            loadFileRequerimento();

            $('#scrollSummaryColor').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $(".scroll-fieldset2").slimScroll({
                height: '90px',
                width: '100%',
                railOpacity: 0.9
            });
            $(".scroll-fieldset3").slimScroll({
                height: '110px',
                width: '100%',
                railOpacity: 0.9
            });
            $('#scrollSummary').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('.feed-activity-list').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            // Summernote
            $(".summernote").summernote({
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    //['table', ['table']],
                    //['insert', ['link', 'picture', 'hr']],
                    //['view', ['fullscreen', 'codeview']],
                    //['help', ['help']]
                ]
            });
            // Select2 multiple para combos
            $("#cboCorreosColor").select2({
                width: '100%'
            });
            $(".select-multiple").select2({
                width: '100%'
            });
            $('.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true
            });

            //$('#modal_AddColor').on('hidden.bs.modal', function () {
            //    if ($('.modal.in').length > 0) {
            //        $('body').addClass('modal-open');
            //    }
            //});
        }

        function req_ini() {

            ovariables.rutaFileServer = _('rutaFileServer').value;  

            _promise()
                .then(ValidarCarryOver())
                .then(obtenerCargaInicial())
                .then(validarRequerimientoHabilitar())  
                .then(ValidarTipoTela())                      
        }

        function ValidarCarryOver() {

            let IdRequerimientoDetalle = _('IdRequerimientoDetalle').value;

            if (IdRequerimientoDetalle < 0) {
                IdRequerimientoDetalle = IdRequerimientoDetalle * -1;
                _('IdRequerimientoDetalle').value = IdRequerimientoDetalle;
                ovariables.TipoSolicitud = 'CO';
                ovariables.TipoSolicitudDescrip =  'Carry Over'
                ovariables.flgCarryOver = true;
                ovariables.flgCopy = 1;
            } else {
                ovariables.flgCarryOver = false;
            }

            if (IdRequerimientoDetalle == 0) {
                ovariables.TipoSolicitud = 'SE';
                ovariables.TipoSolicitudDescrip = 'Seasonal'
            }
        }
        
        //FUNCIONALIDAD CARGA DE PANTALLA:INICIO

        function obtenerCargaInicial() {

            let err = function (__err) { console.log('err', __err) };
            let IdRequerimientoDetalle = _('IdRequerimientoDetalle').value;

            let parametro = {
                IdCliente: ovariables.idcliente,
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                TipoSolicitud: ovariables.TipoSolicitud
            };

            _Get('Requerimiento/Color/GetColorLoadNew_JSON?par=' + JSON.stringify(parametro))
                .then((resultado) => {

                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        ovariables.ListaTipoClienteFabricCSV = rpta.ListaTipoClienteFabricCSV !== '' ? CSVtoJSON(rpta.ListaTipoClienteFabricCSV) : [];
                        ovariables.ListaTipoTelaCsv = rpta.ListaTipoTelaCsv !== '' ? CSVtoJSON(rpta.ListaTipoTelaCsv) : [];
                        ovariables.ListaTipoProveedorCsv = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                        ovariables.ListaProveedorCsv = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                        ovariables.ListaTipoFileCsv = rpta.ListaTipoFileCsv !== '' ? CSVtoJSON(rpta.ListaTipoFileCsv) : []; 
                        ovariables.ListaEstadoRqCSV = rpta.ListaEstadoRqCSV !== '' ? CSVtoJSON(rpta.ListaEstadoColorCsv) : [];
                        ovariables.ListaTestPacknameCsv = rpta.ListaTestPacknameCsv !== '' ? CSVtoJSON(rpta.ListaTestPacknameCsv) : [];
                        ovariables.ListaTipoTenidoCsv = rpta.ListaTipoTenidoCsv !== '' ? CSVtoJSON(rpta.ListaTipoTenidoCsv) : [];
                        ovariables.ListaTipoProductoComboCsv = rpta.ListaTipoProductoComboCsv !== '' ? CSVtoJSON(rpta.ListaTipoProductoComboCsv) : [];
                        ovariables.ListaTipoProductoComboMetodoCsv = rpta.ListaTipoProductoComboMetodoCsv !== '' ? CSVtoJSON(rpta.ListaTipoProductoComboMetodoCsv) : [];
                        ovariables.ListaColorTelaCsv = rpta.ListaColorTelaCsv !== '' ? CSVtoJSON(rpta.ListaColorTelaCsv) : [];
                        

                        ovariables.tmpCboTipoFile = ovariables.ListaTipoFileCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                        ovariables.ListaTipoTenidoStr = ovariables.ListaTipoTenidoCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                        ovariables.ListaTipoProductoComboStr = ovariables.ListaTipoProductoComboCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                        ovariables.strColorTela = ovariables.ListaColorTelaCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                    }
                        
                        _promise()
                            .then(llenarControles(rpta))
                            .then(setearCampos(rpta))                       
                            .then(recargarCamposDependientes(rpta))     

                        
                       
                }, (p) => { err(p); });
        }

        function setearCampos(rpta) {

            let idRequerimiento = _('IdRequerimientoDetalle').value;
            if (parseInt(idRequerimiento) > 0) {
                
                ovariables.TipoSolicitud = rpta.TipoSolicitud;

                if (ovariables.TipoSolicitud == 'CO') { ovariables.TipoSolicitudDescrip = 'Carry Over'; }
                
                _('cboFabricType').value = rpta.TipoTela;
                _('cboColorSupplierType').value = rpta.IdTipoProveedor;
                _('cboColorSupplierName').value = rpta.IdProveedor;
                _('txtNotes').value = rpta.Notes;
                _('txtColorFabricCode').value = rpta.CodigoTelaWTS;
                 _('txtColorFabricDes').value = rpta.DescripcionTela; 
                 _('cboColorStatus').value = rpta.IdEstado; 
                _('cboColorReqDate').value = rpta.FechaRequerimientoCliente; 
                if (rpta.ImagenNombre !== '' && ovariables.flgCopy === 0) {
                    _('imgSketch').src = 'http:' + ovariables.rutaFileServer + rpta.ImagenNombre;
                } else {
                    _('imgSketch').src = 'http:' + ovariables.rutaFileServer + 'sinimagen.jpg';
                }
              
                cargarComboColor(CSVtoJSON(rpta.ListaComboColorCsv));
                cargarComboColorDetalle(CSVtoJSON(rpta.ListaComboColorDetalleCsv));

                fn_req_correos();

                if (!(ovariables.flgCarryOver)) {

                    cargarTestColor(CSVtoJSON(rpta.ListaTestColorCsv));
                    cargarTestColorDetalle(CSVtoJSON(rpta.ListaTestColorDetalleCsv));

                    let ListaReporteTestCsv = rpta.ListaReporteTestCsv !== '' ? CSVtoJSON(rpta.ListaReporteTestCsv) : [];
                    cargarTestReport(ListaReporteTestCsv);

                    listarFileRequerimiento();

                }
                
            }
        }

        function llenarControles(rpta) {

            //llenarComboCsv('cboFabricTypeReq', ovariables.ListaTipoClienteFabricCSV);
            ovariables.IdRequerimientoPadre = rpta.IdRequerimientoPadre;
            llenarComboCsv('cboFabricType', ovariables.ListaTipoTelaCsv);
            llenarComboCsv('cboColorSupplierType', ovariables.ListaTipoProveedorCsv);
            llenarComboCsv('cboColorSupplierName', ovariables.ListaProveedorCsv);
            llenarComboCsv('cboColorPackName', ovariables.ListaTestPacknameCsv);
            llenarComboCsv('cboColorStatus', ovariables.ListaEstadoRqCSV);

            let idRequerimiento = _('IdRequerimientoDetalle').value;
            if (parseInt(idRequerimiento) > 0) {

                let ListaProveedorTestCsv = [];
                let ListaTestListCsv = [];
                let ListaEstadoReporteTestCsv = [];
                let ListaReporteTestCboCsv = [];

                ListaProveedorTestCsv = rpta.ListaProveedorTestCsv !== '' ? CSVtoJSON(rpta.ListaProveedorTestCsv) : [];
                ListaTestListCsv = rpta.ListaTestListCsv !== '' ? CSVtoJSON(rpta.ListaTestListCsv) : [];
                ListaEstadoReporteTestCsv = rpta.ListaEstadoReporteTestCsv !== '' ? CSVtoJSON(rpta.ListaEstadoReporteTestCsv) : [];
                ListaReporteTestCboCsv = rpta.ListaReporteTestCboCsv !== '' ? CSVtoJSON(rpta.ListaReporteTestCboCsv) : [];

                ovariables.tmpCboProvTest = (ListaProveedorTestCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.tmpCboTestList = (ListaTestListCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.ListaReporteTestEstadotStr = (ListaEstadoReporteTestCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                ovariables.tmpCboReportTestList = (ListaReporteTestCboCsv).map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
                
            }
        }

        function recargarCamposDependientes(rpta) {
            fn_add_suppliername_tosend();
        }

        function llenarComboCsv(control, listCsv) {

            const cbolist = listCsv.map(x => { return `<option value="${x.codigo}">${x.descripcion}</option>` }).join('');
            _(control).innerHTML = cbolist;
        }

        function cargarComboColor(arrComboColor) {
            $(`.colornameCOLOR table tbody tr`).remove(); 

            if (arrComboColor.length > 0) { $("#listComboColor").empty();}

            arrComboColor.forEach(x => {
                let idcombo = x.IdComboColor;
                let colorname = x.ComboColor;
                let tipoProducto = x.idTipoProducto;
                let tipoProductoName = x.TipoProducto;
               
                dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName)
            })
        }
       
        function setComboColorDetalle(idColor, Metodo, WtsCode, WtsDescripcion, TipoTenido, ColorCode, ColorName, Pantone, Alternative, ClienteSelection) {

            _('metodo_' + idColor).value = Metodo;
            _('codeWts_' + idColor).value = WtsCode;
            _('descWts_' + idColor).value = WtsDescripcion;
            _('tipoTenido_' + idColor).value = TipoTenido;
            _('codColor_' + idColor).value = ColorCode;
            _('desColor_' + idColor).value = ColorName;
            _('pantColor_' + idColor).value = Pantone;
            //_('seleccion_' + idColor).value = ClienteSelection;
            //forzarOnchange('seleccion_' + idColor);
            forzarOnchange('desColor_' + idColor);
        }
      

        function forzarOnchange(controlId) {

            var element = document.getElementById(controlId);
            var event = new Event('change');
            element.dispatchEvent(event);
        }

        function remplazartodo(cadena, buscar, reemplazar) {

            var replace = buscar;
            var re = new RegExp(replace, "g");
            cadena = cadena.replace(re, reemplazar);
            return cadena;
        }

                
        function cargarTestColor(arrTest) {

            arrTest.forEach(x => {
                let IdTest = x.IdTest;
                _('IdTest').value = IdTest;              
            })
        }

        function cargarTestColorDetalle(arrTestColorDetalle) {

            $("#bodyListTest tr").remove();

            arrTestColorDetalle.forEach(x => {

                let IdTestDetalle = x.IdTestDetalle;
                let idTest = x.IdTest;
                let IdTipoProveedor = x.IdTipoProveedor;
                let idProveedor = x.IdProveedor;
                let testCode = x.TestCodigo;
                let testName = x.TestDescripcion;
                let Cost = x.CostTestDetalle;
                let Status = x.Estado;
                let wtscode = x.WtsCode;
                let codEstado = x.codEstado;

                dibujarTest(idTest, IdTestDetalle, testCode, testName, idProveedor, Cost, Status, wtscode, codEstado)

            })
        } 
       
        //FUNCIONALIDAD CARGA DE PANTALLA:FIN      

        //FUNCIONALIDAD BUSCAR TELA : INICIO
        function buscarTela(e) {

            let err = function (__err) { console.log('err', __err) };
            let codigoTela = _('txtColorFabricCode').value;            
            e = _('btnBuscarTela');

            if (codigoTela != '') {

                const classname = e.getAttribute("class");

                if (classname === 'btn btn-primary') {
                    _Get('Requerimiento/Color/GetBuscarTela_JSON?par=' + codigoTela)
                        .then((resultado) => {

                            let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (rpta !== null) {
                                _('txtColorFabricDes').value = rpta.Descripcion;

                                e.innerHTML = `<span class="fa fa-eraser"></span>`;
                                e.classList.remove('btn-primary');
                                e.classList.add('btn-danger');
                                _('txtColorFabricCode').setAttribute('disabled', 'disabled');
                                _('txtColorFabricDes').setAttribute('disabled', 'disabled');

                            } else {
                                swal({ title: "Warning", text: "Fabric not found.", type: "warning", timer: 5000 });
                                _('txtColorFabricCode').value = '';
                                _('txtColorFabricCode').removeAttribute('disabled');
                            }
                        }, (p) => { err(p); });

                } else {

                    e.innerHTML = `<span class="fa fa-search"></span>`;
                    e.classList.remove('btn-danger');
                    e.classList.add('btn-primary');
                    _('txtColorFabricCode').removeAttribute('disabled');
                    _('txtColorFabricCode').value = '';
                    _('txtColorFabricDes').removeAttribute('disabled');
                    _('txtColorFabricDes').value = '';
                }

            } else {
                swal({ title: "Warning", text: "You must enter fabric code.", type: "warning", timer: 5000 });
            }
        }


        //FUNCIONALIDAD BUSCAR TELA : FIN

        //FUNCIONALIDAD CARGA REPORT LIST:INICIO

        function fn_listReportTest() {

            let resultado = [];
            let arrRows = Array.from(_('tbodyReportList').rows);            
            arrRows.forEach(x => {

                let IdReportList = x.getAttribute('idreportlist');             
                let selects = x.getElementsByTagName('select');

                if (selects.length > 0) {

                    let TestCode = selects[0].value;
                    let EstadoReportTest = selects[1].value;                  

                    let obj = {};
                    obj.IdReportTest = IdReportList;
                    obj.TestCode = TestCode;
                    obj.EstadoReportTest = EstadoReportTest;
                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function cargarTestReport(arrTestReport) {

            $("#tbodyReportList tr").remove();

            arrTestReport.forEach(x => {

                let idReportList = x.IdReporte;
                let testCode = x.TestCode;
                let fechaCreacion = x.FechaCreacion;
                let Estado = x.Estado;
                let aprobador = x.Aprobador;
                let fechaAprobacion = x.FechaAprobacion;
               
                dibujarReporteList(idReportList, testCode, fechaCreacion, Estado, aprobador, fechaAprobacion)
            })
        }

        function AddReportList() {
            dibujarReporteList(0, '', '', 0, '', '')
        }

        function dibujarReporteList(idReportList, testCode, fechaCreacion, Estado, aprobador, fechaAprobacion) {

            let btnConsecion = '';
            let btnEliminar = ` <button type="button" class="btn btn-xs btn-danger" onclick="app_NewColor.deleteReporte(this)" >
                                    <i class="fa fa-trash"></i>
                                </button>`

            if (Estado == 'R' && aprobador=='') {
                btnConsecion = `<button type="button" class="btn btn-xs btn-primary" id="btnRequestConcessionColor"  onclick="app_NewColor.fn_concession(this)">
                                                        <i class="fa fa-plus"></i> Request
                                </button>`
        
            }

            let strDisable = ''
            if (aprobador != '') {
                btnConsecion = '';
                btnEliminar = '';
                strDisable = 'disabled="disabled"';
            }

            let table_testlist = `<tr class="test_${idReportList}" id="${idReportList}" idReportList="${idReportList}">
                                            <td>
                                                ${btnEliminar}
                                            </td>
                                            <td>
                                                <select class="input-sm form-control"  ${strDisable} style = "width: 100%;" id = "RptTestCode_${idReportList}" >
                                                ${ovariables.tmpCboReportTestList}
                                                 </select >
                                            </td>                                            
                                            <td>
                                                ${fechaCreacion}
                                            </td>
                                            <td>
                                               <select class="input-sm form-control" style = "width: 100%;"   ${strDisable}  id ="RptEstado_${idReportList}"  >
                                                ${ovariables.ListaReporteTestEstadotStr}
                                                </select >
                                            </td>
                                            <td>
                                                 ${btnConsecion}
                                            </td>
                                            <td>
                                                 ${aprobador}
                                            </td>
                                            <td>
                                                 ${fechaAprobacion}
                                            </td>
                                        </tr>`;

            $("#tbodyReportList").append(table_testlist);

            if (idReportList > 0) {

                _('RptTestCode_' + idReportList).value = testCode;
                _('RptEstado_' + idReportList).value = Estado;
            }

        }

        //FUNCIONALIDAD CARGA REPORT LIST:FIN


        //FUNCIONALIDAD FILE REQUERIMIENTO:INICIO

        function InicializarTablaFile() {
            $("#tbl_files_co").DataTable({
                info: false,
                lengthChange: false,
                ordering: true,
                order: [1, 'asc'],
                paging: false,
                searching: false
            });
        }       

        function loadFileRequerimento() {
            _('inputFileRequerimiento_co').onchange = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
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
                        guardarFileRequerimiento(this);
                        break;
                    default:
                        swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                        input.value = '';
                }
            }
        }

        function guardarFileRequerimiento() {

            let IdRequerimientoDetalle = _('IdRequerimientoDetalle').value;
            let IdFile = '0';

            let objRequerimientoTela = {
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                IdFile: IdFile
            }

            let frm = new FormData();

            frm.append('requerimientoFileJSON', JSON.stringify(objRequerimientoTela));
            frm.append('archivoFile', $("#inputFileRequerimiento_co")[0].files[0]);

            _Post('Requerimiento/Color/SaveFileRequerimiento', frm, true)
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
            let IdRequerimientoDetalle = _('IdRequerimientoDetalle').value;
            let IdFile = '0';
            let objRequerimientoTela = {
                IdRequerimientoDetalle: IdRequerimientoDetalle,
                IdFile: IdFile
            }

            let frm = new FormData();
            frm.append('requerimientoFileJSON', JSON.stringify(objRequerimientoTela));

            _Post('Requerimiento/Color/GetListaFileRequerimiento_JSON', frm, true)
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

            document.getElementById("div_tbl_files_co").innerHTML = "";
            document.getElementById("div_tbl_files_co").innerHTML = `<table class="table table-hover table-bordered table-vertical" id="tbl_files_co">
                                                                    <thead>
                                                                        <tr>
                                                                            <th class="no-sort" width="6%"></th>
                                                                            <th width="32%">Name</th>
                                                                            <th width="20%">User</th>
                                                                            <th width="22%">Type</th>
                                                                            <th width="20%">Upload Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="tbody_files_co"></tbody>
                                                                </table>`;
        }

        function crearTablaFileRequerimiento(data) {

            const html = data.map(x => {
                return `<tr data-id="${x.IdFile}" data-req="${x.IdRequerimiento}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewColor.deletefile(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewColor.downloadfile('${x.FileNombre}', '${x.FileOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.FileOriginal}</td>
                            <td>${_capitalizePhrase(x.UsuarioCreacion)}</td>
                            <td><select class="input-sm form-control no-borders" style="width: 100%;" id="cboTipoFile_${x.IdFile}">${ovariables.tmpCboTipoFile}</select></td>
                            <td>${x.FechaCreacion}</td>
                        </tr>`;
            }).join('');
            _('tbody_files_co').innerHTML = '';
            _('tbody_files_co').innerHTML = html;
        }

        function setearTipoFileRequerimiento(data) {

            data.forEach(x => {
                _('cboTipoFile_' + x.IdFile).value = x.Tipo;
            });
        }

        function downloadfile(nombrearchivo, nombrearchivooriginal) {

            let urlaccion = `../Requerimiento/Color/DownLoadFile?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
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
                frm.append('requerimientoFileJSON', JSON.stringify(parametro));
                _Post('Requerimiento/Color/DeleteFileRequerimiento_jSON', frm)
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

        //FUNCIONALIDAD DE IMAGEN:INICIO

        function loadimage() {

            _('inputImage').onchange = function () {

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
                            _('imgSketch').src = '';
                    }
                }
            }          

            _('btnDeleteUpload').onclick = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                _('imgSketch').src = '';
                _('inputImage').value = '';
            }
        }

        function showimage(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('imgSketch').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
                ovariables.flgCambioImagen = 1
            }
        }

        //FUNCIONALIDAD DE IMAGEN: FIN

        //FUNCIONALIDAD GUARDADO:INICIO

        function fn_listCombo() {           
            
            let arrRows = Array.from(_('tbodyColor').rows);
            let i = 0;
            let resultado = [];         

            arrRows.forEach(x => {
                               
                let cells = x.getElementsByTagName('td');                           
                let Inputs = x.getElementsByTagName('input');                          
                let selects = x.getElementsByTagName('select');
                let areas = x.getElementsByTagName('textarea');

                if (Inputs.length > 0) {

                    let IdComboColor = x.getAttribute('data-comboid');
                    let Combo = x.getAttribute('data-combo');
                    let IdComboColorDetalle = x.getAttribute('data-idcolor');
                    let IdComboColorTipoProducto = x.getAttribute('data-combotipoproducto');
                   
                    let wtsdescripcion = areas[0].value;
                    let rqType = cells[1].textContent.trim();

                    let wtsCode = Inputs[0].value;
                    let colorcode = Inputs[1].value;                  
                    let pantone = Inputs[2].value;

                    let metodTenido = selects[0].value;
                    let tipoTenido = selects[1].value;
                    let color = selects[2].value;
                 
                    let objAlternativa = obtenerlista(selects[3])
                    let alternative = objAlternativa.strList;
                    let objSelection = obtenerlista(selects[4])
                    let ClienteSelection = objSelection.strList;

                    let obj = {};
                    
                    obj.IdComboColorDetalle = ovariables.flgCarryOver == true ? 0 : IdComboColorDetalle;
                    obj.IdComboColor = ovariables.flgCarryOver == true ? 0 : IdComboColor; 
                    obj.DescCombo = Combo;
                    obj.IdComboColorTipoProducto = IdComboColorTipoProducto;                    
                    obj.Metodo = metodTenido;
                    obj.WtsCode = wtsCode;
                    obj.WtsDescripcion = wtsdescripcion;
                    obj.TipoTenido = tipoTenido;
                    obj.ColorCode = colorcode;
                    obj.ColorName = color;                    
                    obj.Pantone = pantone;
                    obj.Alternative = alternative;
                    obj.ClienteSelection = ClienteSelection;                   
                    
                    resultado.push(obj);
                }
            })

            return resultado;
        }

        function obtenerlista(select) {
            let td = select.parentElement;
            let _arrli = Array.from(td.getElementsByTagName('li'));
            let strList = '';
            let optionList = '';

            _arrli.forEach(x => {
                let title = x.getAttribute('title'); 
                if (title != '' && title !== null) {
                    strList += title + ',';
                    optionList += `<option value="${title}">${title}</option>`
                }
            })

            strList = strList.length > 0 ? strList.slice(0, -1) : strList;

            let objNumeros = {};
            objNumeros.strList = strList;
            objNumeros.optionList = optionList;

            return objNumeros;
        }

        function fn_listTest() {

            let resultado = [];          
            let arrRows = Array.from(_('bodyListTest').rows);

            let i = 0;
            arrRows.forEach(x => {

                let IdTest = x.getAttribute('id'); 
                let IdTestDetalle = x.getAttribute('idTestDetalle');
                let cells = x.getElementsByTagName('td');
                let Inputs = x.getElementsByTagName('input');
                let selects = x.getElementsByTagName('select');
                if (Inputs.length > 0) {

                    let testCode = Inputs[0].value;
                    let testname = Inputs[1].value;
                    let cost = Inputs[2].value == '' ? 0 : Inputs[2].value;
                    let estado = cells[6].textContent.trim();
                    let WtsCode = selects[0].value;
                    let idProveedor = selects[1].value;

                    let obj = {};
                    obj.IdTestDetalle = IdTestDetalle;
                    obj.IdTest = IdTest;
                    obj.WtsCode = WtsCode;
                    obj.TestCodigo = testCode;
                    obj.TestDescripcion = testname;
                    obj.IdTipoProveedor = 0;
                    obj.IdProveedor = idProveedor;
                    obj.CostTestDetalle = cost;
                    obj.Estado = estado;

                    resultado.push(obj);
                }
            })              
           
            return resultado;
        }

        function fn_listFileProperty() {

            let resultado = [];
            let arrRows = Array.from(_('tbody_files_co').rows);

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

        function fn_ejecutarbtnSave() {

            fn_guardarRequerimiento(0);
        } 

        function fn_ejecutarbtnEnvio() {

            if (validarEnvioTest()) {
                fn_guardarRequerimiento(1);
            }
        }

        function validarEnvioTest() {

            bResult = true;

            if (_('cboColorSupplierTest').value === '0') {
                swal({ title: "Alert", text: "Select Supplier Test.", type: "warning" });
                bResult = false;
            }

            return bResult
        }
        
        function fn_guardarRequerimiento(flgEnvioTest) {

            var resultado = fn_listCombo();
            var resultadoTest = fn_listTest();
            var resultadoTestReport = fn_listReportTest();
            var resultadoFileProp = fn_listFileProperty();
            var parametroJS = _getParameter({ id: 'tabcolor-1', clase: '_enty_buscar' });  
            parametroJS.IdPrograma = ovariables.idPrograma;
            parametroJS.IdCliente = ovariables.idcliente;
            parametroJS.flgCambioImagen = ovariables.flgCambioImagen
            parametroJS.flgEnvioTest = flgEnvioTest;
            parametroJS.IdProveedorTest = _('cboColorSupplierTest').value; 
            parametroJS.TipoSolicitud = ovariables.TipoSolicitud;
            parametroJS.CodFase = ovariables.codfase; 
            parametroJS.IdRequerimientoPadre = ovariables.IdRequerimientoPadre; 

            if (ovariables.flgCarryOver) {
                parametroJS.IdRequerimiento = 0;
                parametroJS.IdRequerimientoDetalle = 0;
            }               

            var mensajeConfirmacion = "The Requeriment was created successfully";

            if (flgEnvioTest === 1) {
                mensajeConfirmacion = "The Test Sent.";
            } else if (parseInt(_('IdRequerimientoDetalle').value) > 0) {
                mensajeConfirmacion = "The Requeriment was update successfully";
            }

            const req_enty = _required({ clase: '_enty_buscar', id: 'tabcolor-1' });
            if (req_enty) {           

                if (fn_validarRequerimiento(parametroJS, resultado, resultadoTest, resultadoTestReport, resultadoFileProp)) {

                    let frm = new FormData();

                    frm.append('requerimientoJSON', JSON.stringify(parametroJS));
                    frm.append('requerimientoComboColorJSON', JSON.stringify(resultado));
                    frm.append('requerimientoTestJSON', JSON.stringify(resultadoTest));
                    frm.append('requerimientoTestReportJSON', JSON.stringify(resultadoTestReport));
                    frm.append('requerimientoFilePropJSON', JSON.stringify(resultadoFileProp));
                    frm.append('Imagen', $("#inputImage")[0].files[0]);

                    _Post('Requerimiento/Color/SaveRequerimiento_JSON', frm, true)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                _('IdRequerimientoDetalle').value = orpta.id;
                            
                                _promise()
                                    .then(appStages.fn_color())
                                    .then(ValidarCarryOver())
                                    .then(obtenerCargaInicial()) 
                                    .then(validarRequerimientoHabilitar())     
                                    

                                swal({
                                    title: "Good job!",
                                    text: mensajeConfirmacion,
                                    type: "success",
                                    timer: 5000,
                                    showCancelButton: false,
                                    confirmButtonColor: "#1c84c6",
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false
                                });

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                    }

            } else {
                swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
            }
        }
        
        function GenerarConcesion() {
           
            var parametroJS = _getParameter({ id: 'tabcolor-1', clase: '_enty_buscar' });
            parametroJS.IdReportTest = _('IdReportListConcesion').value;
            parametroJS.IdContacto = _('cboConParaColor').value;
            parametroJS.Nota = _('txtNotaConColor').value;          
           
            var mensajeConfirmacion = "Sent Concession.";         

            let frm = new FormData();

            frm.append('requerimientoJSON', JSON.stringify(parametroJS));
      
            _Post('Requerimiento/Color/SaveRequerimientoConcesion_JSON', frm, true)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {
                        
                        _promise()                            
                            .then(obtenerCargaInicial())
                            .then(validarRequerimientoHabilitar())

                        swal({
                            title: "Good job!",
                            text: mensajeConfirmacion,
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });

                        $("#modal_RequestConcession").modal("hide");

                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
            
        }
        
        function fn_validarRequerimiento(parametroJS, resultado, resultadoTest, resultadoTestReport, resultadoFileProp) {
            var result = true;

            //validacion combo color : inicio
            let ncomboColor = $(`.colornameCOLOR table tbody tr[data-control='combocolor']`).length;
            let nCboColor = ([... new Set(resultado.map(x => x.DescCombo))]).length;

            if (ncomboColor != nCboColor) {
                swal({ title: "Alert", text: "Color combo has no elements.", type: "warning" });
                result = false;
            }

            //validacion combo color : fin 


            return result;
        }
        //FUNCIONALIDAD GUARDADO:FIN

        //FUNCIONALIDAD VALIDACION DE EXISTENCIA:INICIO

        function validarRequerimientoHabilitar() {
            let idRequerimiento = _('IdRequerimientoDetalle').value;
            if (parseInt(idRequerimiento) > 0) {

                if (!(ovariables.flgCarryOver)) {
                    _('modal_title_NewColor').innerText = 'Edit Color';
                    _('litabcolor-2').style.display = '';
                    _('litabcolor-3').style.display = '';
                    _('litabcolor-5').style.display = '';
                    _('tabcolor-2').style.display = '';
                    _('tabcolor-3').style.display = '';
                    _('tabcolor-5').style.display = '';

                    _('txtColorFabricCode').disabled = true;
                    _('txtColorFabricDes').disabled = true;
                    _('btnBuscarTela').disabled = true;
                    _('btnAddNewColor').disabled = false;
                    _('cboFabricType').disabled = true;
                } else {

                    _('modal_title_NewColor').innerText = 'Copy Color';                   

                    _('txtColorFabricCode').disabled = false;
                    _('txtColorFabricDes').disabled = false;
                    _('btnBuscarTela').disabled = false;
                    _('btnAddNewColor').disabled = false;
                    _('cboFabricType').disabled = false;
                }                

            } else {

                _('btnAddNewColor').disabled = true;

            }
        }

        //ACCIONES DE CHANGE DE CONTROLES : INICIO
        function ValidarTipoTela() {

            let tipoTela = _('cboFabricType').value
            _('txtColorFabricCode').value = '';
            _('txtColorFabricDes').value = '';
            //if (tipoTela == '0' || tipoTela == 'D') {
            if (tipoTela == 'D') {
                _('txtColorFabricCode').disabled = false;
                _('txtColorFabricDes').disabled = false;
                _('btnBuscarTela').disabled = false;
                //document.getElementById('btnBuscarTela').style.display = "";

            } else {

                _('txtColorFabricCode').disabled = true;
                _('txtColorFabricDes').disabled = true;
                _('btnBuscarTela').disabled = true;
                //document.getElementById('btnBuscarTela').style.display = "none";
               
            }

        }
          

        //ACCIONES DE CHANGE DE CONTROLES : INICIO


         //FUNCIONALIDAD VALIDACION DE EXISTENCIA:FIN      
              
        function fn_new() {
            _modalBody_Backdrop({
                url: 'Requerimiento/Color/_AddColor',
                idmodal: 'AddColor',
                paremeter: `id:0,accion:newcolor`,
                title: 'Add Color Combo',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }

        function fn_concession(button) {

            let id = button.parentElement.parentElement.getAttribute("id");

            _modalBody_Backdrop({
                url: 'Requerimiento/Color/_Concession',
                idmodal: 'RequestConcession',
                paremeter: `id:${id},accion:new`,
                title: 'Request Concession',
                width: '',
                height: '',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: '',
                bloquearteclado: false,
            });
        }
                
        //inicio LA - TAB SUMMARY
        const fn_addcomboitem = () => {           

                const select = document.getElementById("IdTipoProducto");                         
                const colorname = _("txtColorName").value;
                const tipoProducto = _("IdTipoProducto").value;
                const tipoProductoName = select.options[select.selectedIndex].innerText;;
                const idcombo = 0;
                dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName);           
        }        

        function dibujarComboColor(idcombo, colorname, tipoProducto, tipoProductoName) {

            _promise()
                .then(filtrarMetodoTipoProducto(tipoProducto))
                .then(setearComboColor(idcombo, colorname, tipoProducto, tipoProductoName))       
           
        }

        function filtrarMetodoTipoProducto(tipoProducto) {

            var objMetodos = ovariables.ListaTipoProductoComboMetodoCsv.filter(function (number) { return number.Padre.includes(tipoProducto); });
                ovariables.strComboDetalle = objMetodos.map(x => { return `<option value='${x.codigo}'>${x.descripcion}</option>` }).join('');
        }

        function setearComboColor(idcombo, colorname, tipoProducto, tipoProductoName) {

            let count_comboitem = parseInt($(".combo-item").length, 10) + 1;
            const td_eliminar_colorname = `<td>
                                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewColor.deleteCombo(this)">
                                                    <i class="fa fa-trash"></i>
                                                </button>
                                                <button class="btn btn-xs pull-right" onclick="app_NewColor.toogle_colorname_ocultar(this,'${colorname}');">
                                                    <i class="fa fa-angle-down"></i>
                                                </button>
                                            </td>`
            const td_colorname = `<td class="text-left">${colorname} <button class="btn btn-xs pull-right" onclick="app_NewColor.fn_add_items_colorname(this, 'dye_${count_comboitem}');"><i class="fa fa-plus"></i></button></td>`
            const td_after_colorname = `<td class="text-left" colspan="10"> <b>Type Product :</b>   ${tipoProductoName}</td>`;
            // para tabla colorname
            // SI NO EXISTE LA TABLA SE CREA
            if ($(".colornameCOLOR table").length === 0) {
                const table_colorname = `<table class="table table-vertical-center table-hover table-bordered tablecolor${count_comboitem}" id="tb_${colorname}" style="margin-bottom: 0;">
                                                <thead>
                                                    <tr>
                                                        <th width="5%"></th>
                                                        <th width="12%">Combo Name</th>
                                                        <th width="8%">RQ Type</th>
                                                        <th width="12%">Dyeing Method</th>
                                                        <th width="10%">WTS Code</th>
                                                        <th width="10%">Description</th>
                                                        <th width="10%">Dyeing Type</th>
                                                        <th width="10%">Color Code</th>
                                                        <th width="12%">Color Name</th>
                                                        <th width="10%"># Pantone</th>
                                                        <th width="15%">Alternative</th>
                                                        <th width="15%">Client Selection</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="tbodyColor" >
                                                    <tr id="trCombo_${idcombo}" data-par="colorname:${colorname}" data-comboid="${idcombo}" data-idTipoProducto="${tipoProducto}" data-comboDetalle="${ovariables.strComboDetalle}"  data-combo="${colorname}" data-control='combocolor'>
                                                        ${td_eliminar_colorname}
                                                        ${td_colorname}
                                                        ${td_after_colorname}
                                                    </tr>
                                                </tbody>
                                            </table>`;

                const div_comboitem = `<div class="combo-item" id="div_${colorname}">
                                        <div class="col-sm-12 "> 
                                            ${table_colorname}
                                        </div>
                                    </div>`

                $(".colornameCOLOR").append(div_comboitem);
                $("#modal_AddColor").modal("hide");                
                
            } else {
                // SI YA EXISTE SOLO AGREGA COLUMNA
                let tr = `<tr id="trCombo_${idcombo}" data-par="colorname:${colorname}"  data-comboid="${idcombo}" data-idTipoProducto="${tipoProducto}"   data-comboDetalle="${ovariables.strComboDetalle}"  data-combo="${colorname}" data-control='combocolor'>
                            ${td_eliminar_colorname}
                            ${td_colorname}
                            ${td_after_colorname}
                        </tr>`;
                $(".colornameCOLOR table").children("tbody").append(tr);
                $("#modal_AddColor").modal("hide");
            }
        } 

        function cargarComboColorDetalle(arrComboColorDetalle) {

            arrComboColorDetalle.forEach(x => {

                let idcombo = x.IdComboColor;
                let Comboname = x.ComboColor;
                let idColor = x.IdComboColorDetalle;

                let ColorCode = x.ColorCode;
                let ColorName = x.ColorName;
                let Pantone = x.Pantone;
                let Alternative = x.Alternative;
                let ClienteSelection = x.ClienteSelection;
                let Metodo = x.Metodo;
                let TipoTenido = x.TipoTenido;
                let WtsCode = x.WtsCode;
                let WtsDescripcion = x.WtsDescripcion;

                _promise()
                    .then(dibujarComboColorDetalle_consulta(idColor, idcombo, Alternative, ClienteSelection ))
                    .then(setComboColorDetalle(idColor, Metodo, WtsCode, WtsDescripcion, TipoTenido, ColorCode, ColorName, Pantone, Alternative, ClienteSelection))

            })
        }

        function dibujarComboColorDetalle_consulta(idColor, idcombo, Alternative, ClienteSelection) {

            const tr_main = _('trCombo_' + idcombo);          
            const Comboname = tr_main.getAttribute("data-combo");
            const combotipoProducto = tr_main.getAttribute("data-idtipoproducto");
            const ComboDetalle = tr_main.getAttribute("data-comboDetalle");       

            dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, Alternative, ClienteSelection);
        }
        
        const fn_add_items_colorname = (e, dying_clase) => {

            const tr_main = e.parentElement.parentElement;
            const idcombo = tr_main.getAttribute("data-comboid");
            const Comboname = tr_main.getAttribute("data-combo");
            const combotipoProducto = tr_main.getAttribute("data-idtipoproducto");
            const ComboDetalle = tr_main.getAttribute("data-comboDetalle"); 
            const idColor = 0;                  
                       
            dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, '','');
        }

        function retornarlistAlternative(Alternative) {

            let arr = (Alternative).split(',');
            let arr2 = ('1,2,3,4,5').split(',');
            let seleccionado = 'selected="selected"'
            let coleccion = `<option eleccion1 value="1">1</option>
                            <option eleccion2 value="2">2</option>
                            <option eleccion3 value="3">3</option>
                            <option eleccion4 value="4">4</option>
                            <option eleccion5 value="5">5</option>` 

            
            arr.forEach(function (name) {
                if (name != '') {
                    let valor = 'eleccion' + name;
                    coleccion = remplazartodo(coleccion, valor, seleccionado)
                }
            });

            arr2.forEach(function (name2) {
                let valor = 'eleccion' + name2;
                coleccion = remplazartodo(coleccion, valor, '')
            });

            return coleccion;
        }

        function retornarlistSelectCliente(Alternative, ClienteSelection) {

            let arr = (Alternative).split(',');
            let arr2 = (ClienteSelection).split(',');
            let optionSelecCliente = '';
            let seleccionado = 'selected="selected"'           

            arr.forEach(function (name) {
                if (name != '') {
                    optionSelecCliente += `<option eleccion${name} value="${name}">${name}</option>` ;                  
                }
            });

            arr2.forEach(function (name2) {
                if (name2 != '') {
                    let valor = 'eleccion' + name2;
                    optionSelecCliente = remplazartodo(optionSelecCliente, valor, seleccionado)
                }
            });

            arr.forEach(function (name3) {
                if (name3 != '') {
                    let valor = 'eleccion' + name3;
                    optionSelecCliente = remplazartodo(optionSelecCliente, valor, '')
                }
            });

            return optionSelecCliente;
        }

        function dibujarComboColorDetalle(idColor, idcombo, Comboname, ComboDetalle, combotipoProducto, Alternative, ClienteSelection) {

            let listAlternative = retornarlistAlternative(Alternative);           
            let listClienteSelection = retornarlistSelectCliente(Alternative, ClienteSelection);   
            
            const colorname_tr = `<tr data-par="colorname:${Comboname}"  data-comboid="${idcombo}"  data-combo="${Comboname}" data-combotipoproducto="${combotipoProducto}" data-idColor="${idColor}"  class="colorname-ocultar">
                                    <td colspan="2">
                                        <button type="button" class="btn btn-xs btn-danger pull-right" onclick="app_NewColor.deleteComboDetalle(this)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                    <td>${ovariables.TipoSolicitudDescrip}</td> 
                                    <td>
                                        <select id="metodo_${idColor}" class="input-sm form-control style="width: 100%;">
                                            ${ComboDetalle}
                                        </select>
                                    </td>
                                    <td>
                                        <input id="codeWts_${idColor}"  type="text" class="input-sm form-control" style="width: 100%;">
                                    </td>
                                    <td>
                                          <textarea id="descWts_${idColor}"  class="form-control _enty_list"  rows="2" placeholder="Description" style="width: 100%;"></textarea>
                                    </td>
                                    <td>
                                        <select id="tipoTenido_${idColor}" class="input-sm form-control style="width: 100%;">
                                             ${ovariables.ListaTipoTenidoStr}
                                        </select>
                                    </td>
                                    <td>
                                        <input id="codColor_${idColor}" type="text" class="input-sm form-control" value="Available" style="width: 100%;">
                                    </td>
                                    <td>
                                        <div class="text-left">
                                            <select class="form-control input-sm select2_tags" id="desColor_${idColor}">
                                                ${ovariables.strColorTela}
                                            </select>                                                             
                                        </div>
                                    </td>
                                    <td>
                                        <input  id="pantColor_${idColor}"  type="text" class="input-sm form-control" value="" style="width: 100%;">
                                    </td>
                                    <td id="tdAlternative_${idColor}" >
                                        <select id="alternative_${idColor}"  class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                            ${listAlternative}
                                        </select>
                                    </td>
                                    <td>
                                        <select  id="seleccion_${idColor}" class="input-sm form-control select-multiple" multiple="multiple" style="width: 100%;">
                                             ${listClienteSelection}
                                        </select>
                                    </td>
                                  </tr>`;


            $(`.colornameCOLOR table tbody tr[data-par='colorname:${Comboname}']:last`).after(`${colorname_tr}`);

            $(".select-multiple").select2({
                width: '100%'
            });

            $(".select2_tags").select2({
                tags: true,
                width: '100%'
            });
           
        }

        const toogle_colorname_ocultar = (e, colorname) => {
            const icon = e.children[0].getAttribute("class");
            if (icon === "fa fa-angle-up") {
                e.children[0].setAttribute("class", "fa fa-angle-down");
                $(`.colornameCOLOR table tbody tr[data-par='colorname:${colorname}'].colorname-ocultar`).removeClass("hide");;
            } else {
                e.children[0].setAttribute("class", "fa fa-angle-up");
                $(`.colornameCOLOR table tbody tr[data-par='colorname:${colorname}'].colorname-ocultar`).addClass("hide");
            }
        }

        const toogle_colorname_ocultar_additem = (e, dying_clase) => {
            const tbody = e.parentElement.parentElement.parentElement;
            const jq_tbody = $(tbody);
            $(e.parentElement.parentElement.parentElement).children("tr.colorname-ocultar").removeClass("hide");
            $(`.${dying_clase}`).removeClass("hide");
        }
      
        function fn_addtests_list_item () {

            if (_('cboColorPackName').value != '0') { 

                var value = _('cboColorPackName').value;
                var select = document.getElementById("cboColorPackName");
                var IdTest = _('IdTest').value;
                var IdTestDetalle = 0;
                var desComboTest = select.options[select.selectedIndex].innerText;
                var wtscode = 0;
                var codEstado = '01'
                dibujarTest(IdTest, IdTestDetalle, value, desComboTest, 0, '', 'Create', wtscode,codEstado);
            }
        }

        function dibujarTest(idTest, IdTestDetalle, testCode, testName, idProveedor, Cost, Status, wtscode, codEstado) {

            let btnEliminar = `<button type="button" class="btn btn-xs btn-danger" onclick="app_NewColor.deleteTest(this)">
                                    <i class="fa fa-trash"></i>
                                </button>`
            let strDisable = ''

            if (codEstado == '02') {
                btnEliminar = '';
                strDisable = 'disabled="disabled"'
            }

            $("#bodyListTest > tr.row_empty").remove();

            const lenTableTest = parseInt($("#bodyListTest > tr").length, 10) + 1;

            const td_supplier = `<select class="input-sm form-control" style="width: 100%;" id="prov_${IdTestDetalle}" ${strDisable} onchange="app_NewColor.fn_add_suppliername_tosend();">
                                            ${ovariables.tmpCboProvTest}
                                 </select>`;

            const td_TestList = `<select class="input-sm form-control" style="width: 100%;" id="wtsCode_${IdTestDetalle}" ${strDisable}  >
                                            ${ovariables.tmpCboTestList}
                                 </select>`;

            const table_testlist = `<tr class="test_${lenTableTest}" id="${idTest}" idTestDetalle="${IdTestDetalle}" estado="${codEstado}">
                                            <td>
                                                 ${btnEliminar}
                                            </td>
                                            <td>
                                                ${td_TestList}
                                            </td>
                                            <td>
                                                <input type="text" class="input-sm form-control" disabled style="width: 100%;" value="${testCode}">
                                            </td>
                                            <td>
                                                <input type="text" class="input-sm form-control" disabled style="width: 100%;" value="${testName}">
                                            </td>
                                            <td>
                                                ${td_supplier}
                                            </td>
                                            <td>
                                                <input type="text" class="input-sm form-control" style="width: 100%;" value="${Cost}" ${strDisable}" />
                                            </td>
                                            <td>
                                                <label class="control-label text-center" style="width: 100%;">${Status}</label>
                                            </td>
                                        </tr>`;

            $("#bodyListTest").append(table_testlist);
            if(idProveedor!=0)
                _('prov_' + IdTestDetalle).value = idProveedor;

            if (wtscode != 0)
                _('wtsCode_' + IdTestDetalle).value = wtscode;          

        }

        const fn_add_suppliername_tosend = () => {           

            let array_options_table_test = [];
            let array_options_table_test_new = []

            Array.from($("#bodyListTest > tr")).map(x => {
                let el = $(x).children("td").eq(4).children("select").val();
                let obj = {
                    key: $(x).children("td").eq(4).children("select").val(),
                    text: $(x).children("td").eq(4).children(`select`).children(`option[value='${el}']`).text()
                }

                if (x.getAttribute('estado') == '01') {
                    array_options_table_test.push(obj);
                }
            });

            let set = new Set(array_options_table_test.map(JSON.stringify))
            array_options_table_test_new = Array.from(set).map(JSON.parse);
           
            let option = array_options_table_test_new.map(x => {
                return `<option value='${x.key}'>${x.text}</option>`;
            }).join('');

            $("#cboColorSupplierTest > option").remove();
            $("#cboColorSupplierTest").append(`<option value="0">select</option>${option}`);
        }
        //fin LA - TAB TESTS
        function fn_fullscreen(e) {
            let element = $('#fullscreen_combocolor');
            let button = $(e).find('i');
            $('body').toggleClass('fullscreen-ibox-mode');
            button.toggleClass('fa-expand').toggleClass('fa-compress');
            element.toggleClass('div_fullscreen2');
            setTimeout(function () {
                $(window).trigger('resize');
            }, 100);
        }

        //ELIMINACION DE REPORTE:INICIO
        function deleteReporte(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                 let id = button.parentElement.parentElement.getAttribute("id");

                if (id != 0) {

                    let parametro = {
                        IdReportTest: id
                    }, frm = new FormData();

                    frm.append('paramsJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/Color/DeleteReport_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {

                                swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                $(button.parentElement.parentElement).remove()

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });
        }

        //ELIMINACION DE REPORTE: FIN

        //ELIMINACION DE TEST:INICIO
        function deleteTest(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                let id = button.parentElement.parentElement.getAttribute("id");

                if (id != 0) {

                    let parametro = {
                        IdTestDetalle: id
                    }, frm = new FormData();

                    frm.append('paramsJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/Color/DeleteTest_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {

                                swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                $(button.parentElement.parentElement).remove()

                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });

        }

        //ELIMINACION DE TEST: FIN

        //ELIMINACION DE COMBO DETALLE:INICIO
        function deleteComboDetalle(button) {

            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                    let id = button.parentElement.parentElement.getAttribute("data-idColor");

                if (id != 0) {

                    if (ovariables.flgCarryOver) {

                        $(button.parentElement.parentElement).remove();
                        swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                    } else {
                        let parametro = {
                            IdComboColorDetalle: id
                        }, frm = new FormData();

                        frm.append('paramsJSON', JSON.stringify(parametro));
                        _Post('Requerimiento/Color/DeleteComboColorDetalle_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {

                                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                    $(button.parentElement.parentElement).remove()

                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    }

                } else {
                    $(button.parentElement.parentElement).remove();
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });

                }
            });
        }

        function deleteCombo(button) {
            
            swal({
                html: true,
                title: "Are you sure?",
                text: "You will not be able to recover this registry",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) }

                    let id = button.parentElement.parentElement.getAttribute("data-comboid");
                    let nombreCombo = button.parentElement.parentElement.getAttribute("data-combo");

                if (id != 0) {

                    if (ovariables.flgCarryOver) {

                        swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                        fn_delete_row(nombreCombo);

                    } else {

                        let parametro = {
                            IdComboColor: id
                        }, frm = new FormData();

                        frm.append('paramsJSON', JSON.stringify(parametro));
                        _Post('Requerimiento/Color/DeleteComboColor_JSON', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {

                                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                                    fn_delete_row(nombreCombo);

                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    }

                } else {
                    
                    swal({ title: "Good job!", text: "The registry was deleted successfully", type: "success", timer: 5000 });
                    fn_delete_row(nombreCombo);
                 }                 

            });
        }

        function fn_delete_row(colorname) {
            $(`.colornameCOLOR table tbody tr[data-par='colorname:${colorname}']`).remove();
        }


        //ELIMINACION DE COMBO DETALLE: FIN

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
                const mail_header = _('mailbox_header_color');
                const html = data.map(x => {
                    return `<div class="feed-element feed-cursor" data-id="${x.IdBandeja}" onclick="app_NewColor.fn_load_mail(this)">
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
                const mail_body = _('mailbox_body_color');
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
            fn_addcomboitem: fn_addcomboitem,
            fn_add_items_colorname: fn_add_items_colorname,
            toogle_colorname_ocultar: toogle_colorname_ocultar,
            fn_addtests_list_item: fn_addtests_list_item,
            fn_add_suppliername_tosend: fn_add_suppliername_tosend,         
            fn_fullscreen: fn_fullscreen,
            fn_delete_row: fn_delete_row,
            deletefile: deletefile,
            deleteReporte: deleteReporte,
            fn_concession: fn_concession,
            deleteTest: deleteTest,
            deleteComboDetalle: deleteComboDetalle,
            deleteCombo: deleteCombo,
            GenerarConcesion: GenerarConcesion,
            downloadfile: downloadfile,
            fn_load_mail: fn_load_mail
        }
    }
)(document, 'panelEncabezado_NewColor');
(
    function ini() {
        app_NewColor.load();
        app_NewColor.req_ini();
    }
)();