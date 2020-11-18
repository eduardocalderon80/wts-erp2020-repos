var app_NewStyle = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            idrequerimiento: 0,
            accion: '',
            idcliente: '',
            actualizarimagen: 0,
            lsttiposolicitud: [],
            lsttiproveedor: [],
            lstproveedor: [],
            lstestados: [],
            // Para muestra
            lstmuestra: [],
            lstmuestraxcliente: [],
            lstarchivos: [],
            lsttipoarchivo: [],
            analista: '',
            jefe: '',
            idrequerimientoestilo: 0,
            rutaFileServer: '',
            lstcorreos: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Events
            _('custom-tfoot-btn').addEventListener('click', fn_addsample);
            _('btnSendStyle').addEventListener('click', fn_sendsample);
            _('cboStyleFabricType').addEventListener('change', fn_changefabrictype);
            _('btnStyleFabricCode').addEventListener('click', fn_searchfabric);
            // Change Status
            _('btnHoldStyle').addEventListener('click', fn_changestatushold);
            _('btnDropStyle').addEventListener('click', fn_changestatusdrop);

            // Call Functions
            fn_createscroll();
            fn_loadimage();

            // Se obtiene parametro si tuviera
            const par = _('style_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.idrequerimiento = _par(par, 'idrequerimiento') !== '' ? _parseInt(_par(par, 'idrequerimiento')) : 0;
                ovariables.accion = _par(par, 'accion');
                ovariables.idcliente = _par(par, 'idcliente');
                if (ovariables.accion === 'edit') {
                    _('modal_title_NewStyle').innerHTML = 'Edit Style';
                    $("#modal_NewStyle .nav-tabs").children().eq(1).css("display", "");
                    $("#modal_NewStyle .nav-tabs").children().eq(2).css("display", "");
                    $("#txtWTSCode").closest(".form-group").css("display", "");
                    $("#cboStatus").closest(".form-group").css("display", "");

                    _('btnSaveStyle').innerHTML = `<span class="fa fa-save"></span> Update`;
                    _('btnSaveStyle').addEventListener('click', fn_editstyle);

                    // Mostrar boton enviar
                    _('btnSendStyle').style.display = '';
                    _('btnHoldStyle').style.display = '';
                    _('btnDropStyle').style.display = '';
                } else {
                    _('modal_title_NewStyle').innerHTML = 'New Style';
                    $("#modal_NewStyle .nav-tabs").children().eq(1).css("display", "none");
                    $("#modal_NewStyle .nav-tabs").children().eq(2).css("display", "none");
                    $("#txtWTSCode").closest(".form-group").css("display", "none");
                    $("#cboStatus").closest(".form-group").css("display", "none");

                    _('btnSaveStyle').addEventListener('click', fn_savestyle);
                }
            }

            _('txtSupplierType').addEventListener('change', function (e) { let o = e.currentTarget; fn_change_tipoproveedor(o); }, false);
        }

        function fn_change_tipoproveedor(o) {
            let tipoproveedor = o.value;
            let lstproveedor_filter = ovariables.lstproveedor.filter(x => x.TipoProveedorESTADOS === tipoproveedor);
            let lstproveedornone = ovariables.lstproveedor.filter(x => x.NombreProveedor === 'None');
            _('txtSupplierName').innerHTML = _comboFromJSON(lstproveedornone, 'IdProveedor', 'NombreProveedor') + _comboFromJSON(lstproveedor_filter, 'IdProveedor', 'NombreProveedor');
        }

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
            $('#div_tbl_files_estilo').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function req_ini() {
            ovariables.rutaFileServer = _('rutaFileServerEstilo').value;

            if (ovariables.accion !== "edit") {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { IdCliente: ovariables.idcliente };
                _Get('Requerimiento/Estilo/GetEstiloLoadNew_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lsttiposolicitud = rpta.ListaTipoSolicitudEstiloCsv !== '' ? CSVtoJSON(rpta.ListaTipoSolicitudEstiloCsv) : [];
                            ovariables.lsttiproveedor = rpta.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.ListaTipoProveedorCsv) : [];
                            ovariables.lstproveedor = rpta.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.ListaProveedorCsv) : [];
                            ovariables.lstestados = rpta.EstadosEstiloCSV !== '' ? CSVtoJSON(rpta.EstadosEstiloCSV) : [];
                            ovariables.analista = rpta.analista !== '' ? _capitalizePhrase(rpta.analista) : '';
                            ovariables.jefe = rpta.jefe !== '' ? _capitalizePhrase(rpta.jefe) : '';

                            let lista_tipotela = rpta.ListaTipoTelaEstiloCSV !== '' ? CSVtoJSON(rpta.ListaTipoTelaEstiloCSV) : [];
                            _('cboStyleFabricType').innerHTML = _comboItem({ value: '', text: 'Select' }) + _comboFromJSON(lista_tipotela, 'CodCatalogo', 'NombreCatalogo');

                            // Analista
                            _('txtPdResponsable').value = ovariables.analista;
                            _('txtPdGroup').value = ovariables.jefe;

                            // Create combos
                            fn_suppliertype(ovariables.lsttiproveedor);
                            fn_supplier(ovariables.lstproveedor);
                            fn_createreqtypefabric(ovariables.lsttiposolicitud);

                            let lstproveedor_filter = ovariables.lstproveedor.filter(x => x.TipoProveedorESTADOS === _('txtSupplierType').value);
                            let lstproveedornone = ovariables.lstproveedor.filter(x => x.NombreProveedor === 'None');
                            _('txtSupplierName').innerHTML = _comboFromJSON(lstproveedornone, 'IdProveedor', 'NombreProveedor') + _comboFromJSON(lstproveedor_filter, 'IdProveedor', 'NombreProveedor');

                        }
                    }, (p) => { err(p); });
            } else {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { IdEstilo: ovariables.id, IdCliente: ovariables.idcliente };
                _Get('Requerimiento/Estilo/GetEstiloLoadEditar_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lsttiposolicitud = rpta.Tipo_Solicitud_Estilo.ListaTipoSolicitudEstiloCsv !== '' ? CSVtoJSON(rpta.Tipo_Solicitud_Estilo.ListaTipoSolicitudEstiloCsv) : [];
                            ovariables.lsttiproveedor = rpta.TipoProveedor.ListaTipoProveedorCsv !== '' ? CSVtoJSON(rpta.TipoProveedor.ListaTipoProveedorCsv) : [];
                            ovariables.lstproveedor = rpta.Proveedor.ListaProveedorCsv !== '' ? CSVtoJSON(rpta.Proveedor.ListaProveedorCsv) : [];
                            ovariables.lstestados = rpta.EstadoEstilo.EstadosEstiloCSV !== '' ? CSVtoJSON(rpta.EstadoEstilo.EstadosEstiloCSV) : [];
                            ovariables.analista = rpta.analista !== '' ? _capitalizePhrase(rpta.analista) : '';
                            ovariables.jefe = rpta.jefe !== '' ? _capitalizePhrase(rpta.jefe) : '';
                            ovariables.idrequerimientoestilo = rpta.IdRequerimientoEstilo !== '' ? rpta.IdRequerimientoEstilo : 0;

                            // Analista
                            let lista_tipotela = rpta.TipotelaEstilo.ListaTipoTelaEstiloCSV !== '' ? CSVtoJSON(rpta.TipotelaEstilo.ListaTipoTelaEstiloCSV) : [];
                            _('cboStyleFabricType').innerHTML = _comboItem({ value: '', text: 'Select'}) + _comboFromJSON(lista_tipotela, 'CodCatalogo', 'NombreCatalogo');
                            _('txtPdResponsable').value = ovariables.analista;
                            _('txtPdGroup').value = ovariables.jefe;

                            // Create combos
                            fn_suppliertype(ovariables.lsttiproveedor);
                            fn_supplier(ovariables.lstproveedor);
                            fn_createreqtypefabric(ovariables.lsttiposolicitud);

                            // LLenar campos
                            _('txtWTSCode').value = rpta.CodigoWTS;
                            _('cboStatus').value = _capitalizePhrase(rpta.CatalogoEstadoEstilo);
                            _('cboRequestType').value = _capitalizePhrase(rpta.CatalogoEstadoRequerimiento);
                            _('txtClientNumber').value = rpta.CodigoEstilo;
                            _('txtClientDes').value = rpta.Descripcion;
                            _('txtNotes').value = rpta.Notas;
                            _('txtSupplierType').value = rpta.TipoProveedor.IdTipoProveedor;


                            // Campos tela
                            _('cboStyleFabricType').value = rpta.TipotelaEstilo.TipoTela;
                            fn_force_change("cboStyleFabricType");

                            _('txtStyleFabricCode').value = rpta.CodigoTelaWTS;
                            _('txtStyleFabricDes').value = rpta.DescripcionTela;

                            _('btnStyleFabricCode').innerHTML = `<span class="fa fa-eraser"></span>`;
                            _('btnStyleFabricCode').classList.remove('btn-primary');
                            _('btnStyleFabricCode').classList.add('btn-danger');
                            _('txtStyleFabricCode').setAttribute('disabled', 'disabled');
                            _('txtStyleFabricDes').setAttribute('disabled', 'disabled');
                          
                            

                            let lstproveedor_filter = ovariables.lstproveedor.filter(x => x.TipoProveedorESTADOS === _('txtSupplierType').value);
                            let lstproveedornone = ovariables.lstproveedor.filter(x => x.NombreProveedor === 'None');
                            _('txtSupplierName').innerHTML = _comboFromJSON(lstproveedornone, 'IdProveedor', 'NombreProveedor') + _comboFromJSON(lstproveedor_filter, 'IdProveedor', 'NombreProveedor');
                            _('txtSupplierName').value = rpta.Proveedor.IdProveedor;

                            // Llena foto
                            if (rpta.ImagenNombre !== '') {
                                _('imgSketchEstilo').src = 'http:' + ovariables.rutaFileServer + rpta.ImagenNombre;
                            } else {
                                _('imgSketchEstilo').src = 'http:' + `${ovariables.rutaFileServer}sinimagen.jpg`;
                            }

                            // Para muestra
                            ovariables.lstmuestra = rpta.Requerimiento.ListaRequerimientoCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaRequerimientoCSV) : [];
                            ovariables.lstmuestraxcliente = rpta.Requerimiento.ListaTipoMuestraxClienteCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaTipoMuestraxClienteCSV) : [];

                            // Para archivos
                            ovariables.lstarchivos = rpta.Requerimiento.ListaArchivosByIdEstiloCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaArchivosByIdEstiloCSV) : [];
                            ovariables.lsttipoarchivo = rpta.Requerimiento.ListaTipoArchivosCSV !== '' ? CSVtoJSON(rpta.Requerimiento.ListaTipoArchivosCSV) : [];

                            // Llena tabla muestra
                            fn_loadsample(ovariables.lstmuestra, ovariables.lstmuestraxcliente);
                            // Llena tabla archivos
                            fn_loadfiles(ovariables.lstarchivos);

                            // Correos
                            fn_req_correos();
                        }
                    }, (p) => { err(p); });
            }
        }

        function fn_searchfabric(e) {
            e = e.currentTarget;
            const Tipo = _('cboStyleFabricType').value;
            const CodigoTela = _('txtStyleFabricCode').value;
            if (Tipo === 'D') {
                if (CodigoTela !== '') {
                    const classname = e.getAttribute("class");
                    if (classname === 'btn btn-primary') {
                        _Get('Requerimiento/Estilo/GetBuscarTela_JSON?par=' + CodigoTela)
                            .then((resultado) => {
                                let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (rpta !== null) {
                                    _('txtStyleFabricDes').value = rpta.Descripcion;
                                    e.innerHTML = `<span class="fa fa-eraser"></span>`;
                                    e.classList.remove('btn-primary');
                                    e.classList.add('btn-danger');
                                    _('txtStyleFabricCode').setAttribute('disabled', 'disabled');
                                    _('txtStyleFabricDes').setAttribute('disabled', 'disabled');
                                } else {
                                    swal({ title: "Warning", text: "The fabric code does not exist", type: "warning", timer: 5000 });
                                    _('txtStyleFabricCode').value = '';
                                    _('txtStyleFabricDes').value = '';
                                }
                            }, (p) => { err(p); });
                    } else {
                        e.innerHTML = `<span class="fa fa-search"></span>`;
                        e.classList.remove('btn-danger');
                        e.classList.add('btn-primary');
                        _('txtStyleFabricCode').removeAttribute('disabled');
                        _('txtStyleFabricDes').removeAttribute('disabled');
                        _('txtStyleFabricCode').value = '';
                        _('txtStyleFabricDes').value = '';
                    }
                } else {
                    swal({ title: "Warning", text: "The fabric code cannot be empty", type: "warning", timer: 5000 });
                }
            }
        }

        function fn_get_tipoarchivo(id) {
            return ovariables.lsttipoarchivo.filter(y => _parseInt(y.IdCatalogo) === id).length > 0 ? ovariables.lsttipoarchivo.filter(y => _parseInt(y.IdCatalogo) === id)[0].NombreCatalogo : '';
        }

        function fn_removefile(button) {
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
                        IdArchivo: id,
                        IdRequerimiento: idreq,
                        IdEstilo: ovariables.id
                    }, frm = new FormData();
                frm.append('ArchivoJSON', JSON.stringify(parametro));
                _Post('Requerimiento/RequerimientoMuestra/DeleteArchivoRequerimientoById_JSON', frm)
                    .then((resultado) => {
                        const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            button.parentElement.parentElement.remove();
                            swal({ title: "Good job!", text: "The file was deleted successfully", type: "success", timer: 5000 });
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_downloadfile(nombrearchivo, nombrearchivooriginal) {
            var link = document.createElement("a");
            link.href = `../Requerimiento/RequerimientoMuestra/DownLoadFileTechkPack?NombreArchivo=${nombrearchivo}&NombreArchivoOriginal=${nombrearchivooriginal}`;
            link.click();
        }

        function fn_changefabrictype(e) {
            const select = e.currentTarget;
            if (select.value === "D") {
                _('txtStyleFabricCode').disabled = false;
                _('btnStyleFabricCode').disabled = false;
                _('txtStyleFabricDes').disabled = false;
            } else {
                _('txtStyleFabricCode').disabled = true;
                _('btnStyleFabricCode').disabled = true;
                _('txtStyleFabricDes').disabled = true;

                // Clean fields & reset
                _('btnStyleFabricCode').innerHTML = `<span class="fa fa-search"></span>`;
                _('btnStyleFabricCode').classList.remove('btn-danger');
                _('btnStyleFabricCode').classList.add('btn-primary');
                _('txtStyleFabricCode').value = '';
                _('txtStyleFabricDes').value = '';
            }
        }

        function fn_force_change(id) {
            const element = _(id);
            const event = new Event('change');
            element.dispatchEvent(event);
        }

        function fn_val_tblempty() {
            let bool = true;
            [...document.querySelectorAll("#tbl_samples .input_readonly")].forEach(x => {
                if (x.value === '') {
                    bool = false;
                    x.style = 'border: 1px solid red !important;';
                } else {
                    x.style = '';
                }
            });
            return bool;
        }

        function fn_getsampleids() {
            //let array = [];
            //[..._('tbl_samples').children[1].children].forEach(x => {
            //    if (x.children[6].textContent === '' && x.children[4].children[0].value !== '' && x.children[5].children[0].value) {
            //        array.push(x.getAttribute("data-id"));
            //    }
            //});
            //return array.join(', ');

            let cadena = Array.from(_('tbl_samples').tBodies[0].rows)
                .filter(x => { return x.getElementsByClassName('cls_fecha_exfactoryinicial')[0].value !== '' && x.getElementsByClassName('cls_fecha_indc')[0].value !== '' })
                .map(x => x.getAttribute("data-id")).join(',');
            return cadena;
        }

        function fn_sendsample() {
            let tbody = [..._('tbl_samples').children[1].children];
            if (tbody.length > 0) {
                const text_samples = fn_getsampleids();
                if (text_samples !== '') {
                    swal({
                        html: true,
                        title: "Are you sure?",
                        text: "You will send the samples",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) },
                            parametro = {
                                IdRequerimiento: ovariables.idrequerimientoestilo,
                                Samples: text_samples
                            }, frm = new FormData();
                        frm.append('par', JSON.stringify(parametro));
                        _Post('Requerimiento/Estilo/SendSamplesEstilo', frm)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({ title: "Good job!", text: "The samples were sended successfully", type: "success", timer: 5000 });
                                    _('btnUpdate').click();
                                    req_ini();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Warning", text: "You have to save at least 1 sample", type: "warning", timer: 5000 });
                }
            } else {
                swal({ title: "Warning", text: "You have to add at least 1 sample", type: "warning", timer: 5000 });
            }
        }

        function fn_loadfiles(data) {
            //fn_get_tipoarchivo(_parseInt(x.IdTipoArchivo))
            const html = data.map(x => {
                return `<tr data-id="${x.IdArchivo}" data-req="${x.IdRequerimiento}">
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewStyle.fn_removefile(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewStyle.fn_downloadfile('${x.NombreArchivo}', '${x.NombreArchivoOriginal}')">
                                    <i class="fa fa-download"></i>
                                </button>
                            </td>
                            <td>${x.NombreArchivoOriginal}</td>
                            <td>${_capitalizePhrase(x.UsuarioActualizacion)}</td>
                            <td>${_capitalizePhrase(x.NombreTipoMuestra)}</td>
                            <td>${_capitalizePhrase(x.NombreTipoArchivo)}</td>
                            <td>${x.FechaActualizacion}</td>
                        </tr>`;
            }).join('');
            _('tbl_files').children[1].innerHTML = html;
        }

        function fn_loadsample(muestra, muestraxcliente) {
            const html = muestra.map((x, indice) => {
                let ischecked_fc = x.EsFacturableCliente === '1' ? 'checked' : '';
                let ischecked_ff = x.EsFacturableFabrica === '1' ? 'checked' : '';
                let disabled_check_facturacliente = x.TieneFacturaCliente === '1' ? 'disabled' : '';
                let disabled_check_facturafabrica = x.TieneOrdenPedido === '1' ? 'disabled' : '';

                return `<tr data-id="${x.IdRequerimiento}" data-par='Estado:${x.Estado}'>
                            <td>
                                <button type="button" class="btn btn-xs btn-danger" onclick="app_NewStyle.fn_removesample(this)">
                                    <i class="fa fa-trash"></i>
                                </button>
                                <button type="button" class="btn btn-xs btn-info" onclick="app_NewStyle.fn_viewsampledetails(this)">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <label class="btn btn-xs btn-primary">
                                    <input type="file" accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.txt" style="display:none" onchange="app_NewStyle.fn_addsamplefile(this)">
                                    <span class="fa fa-paperclip"></span>
                                </label>
                            </td>
                            <td>${x.FechaCreacion}</td>
                            <td>
                                <select class="form-control input-sm">
                                    ${fn_createsamplexclient(muestraxcliente, x.IdTipoMuestraxCliente)}
                                </select>
                            </td>
                            <td>${x.Version}</td>
                            <td><input type="text" class="form-control input-sm date input_readonly cls_fecha_exfactoryinicial" value="${x.ExFactoryInicial}" readonly style="background-color: rgb(255, 255, 255);"></td>
                            <td><input type="text" class="form-control input-sm date input_readonly cls_fecha_indc" value="${x.FechaInDC}" readonly style="background-color: rgb(255, 255, 255);"></td>
                            <td>${_capitalizePhrase(x.NombreEstado)}</td>
                            <td>
                                <select class="form-control input-sm">
                                    <option value="None">None</option>
                                    <option value="Workshop 1">Workshop 1</option>
                                    <option value="Workshop 2">Workshop 2</option>
                                    <option value="Workshop 3">Workshop 3</option>
                                </select>
                            </td>
                            <td>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_fc_${indice}' class='cls_chk_fc' ${ischecked_fc} ${disabled_check_facturacliente} />
                                    <label for='chk_fc_${indice}'></label>
                                </div>
                            </td>
                            <td>
                                <div class='checkbox checkbox-green'>
                                    <input type='checkbox' id='chk_ff_${indice}' class='cls_chk_ff' value='${x.EsFacturableFabrica}' ${ischecked_ff} ${disabled_check_facturafabrica} />
                                    <label for='chk_ff_${indice}'></label>
                                </div>
                            </td>
                        </tr>`
            }).join('');

            // Add to table
            _('tbl_samples').children[1].innerHTML = html;

            $('.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                clearBtn: true
            });
        }

        function fn_addsample() {
            if (ovariables.id !== 0) {
                let indice = (_('tbl_samples').tBodies[0].rows.length - 1) + 1;
                const html = `<tr data-guid="${crearCodigoGuid()}" data-par='Estado:1'>
                                <td>
                                    <button type="button" class="btn btn-xs btn-danger" onclick="app_NewStyle.fn_removesample(this)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                    <button type="button" class="btn btn-xs btn-info" onclick="app_NewStyle.fn_viewsampledetails(this)">
                                        <i class="fa fa-eye"></i>
                                    </button>
                                    <label class="btn btn-xs btn-primary" disabled>
                                        <span class="fa fa-paperclip"></span>
                                    </label>
                                </td>
                                <td></td>
                                <td>
                                    <select class="form-control input-sm">
                                        ${fn_createsamplexclient(ovariables.lstmuestraxcliente, 0)}
                                    </select>
                                </td>
                                <td></td>
                                <td><input type="text" class="form-control input-sm date input_readonly cls_fecha_exfactoryinicial" readonly></td>
                                <td><input type="text" class="form-control input-sm date input_readonly cls_fecha_indc" readonly></td>
                                <td></td>
                                <td>
                                    <select class="form-control input-sm">
                                        <option value="None">None</option>
                                        <option value="Workshop 1">Workshop 1</option>
                                        <option value="Workshop 2">Workshop 2</option>
                                        <option value="Workshop 3">Workshop 3</option>
                                    </select>
                                </td>
                                <td>
                                    <div class='checkbox checkbox-green'>
                                        <input type='checkbox' id='chk_fc_${indice}' class='cls_chk_fc' />
                                        <label for='chk_fc_${indice}'></label>
                                    </div>
                                </td>
                                <td>
                                    <div class='checkbox checkbox-green'>
                                        <input type='checkbox' id='chk_ff_${indice}' class='cls_chk_ff'  />
                                        <label for='chk_ff_${indice}'></label>
                                    </div>
                                </td>
                            </tr>`;
                _('tbl_samples').tBodies[0].insertAdjacentHTML('beforeend', html);

                $('.date').datepicker({
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    autoclose: true,
                    clearBtn: true
                });
            } else {
                swal({ title: "Warning", text: "You have to create the style to add a sample", type: "warning", timer: 5000 });
            }
        }

        function fn_removesample(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id");
            if (id !== null) {
                // Si no es nulo se va a la db
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will not be able to recover this sample",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            IdRequerimiento: id,
                            IdEstilo: ovariables.id
                        }, frm = new FormData();
                    frm.append('RequerimientoJSON', JSON.stringify(parametro));
                    _Post('Requerimiento/RequerimientoMuestra/DeleteRequerimientoMuetraById_JSON', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                button.parentElement.parentElement.remove();
                                swal({ title: "Good job!", text: "The sample was deleted successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                button.parentElement.parentElement.remove();
            }
        }

        function fn_viewsampledetails(button) {
            const id = button.parentElement.parentElement.getAttribute("data-id") !== null ? button.parentElement.parentElement.getAttribute("data-id") : '';
            const guid = button.parentElement.parentElement.getAttribute("data-guid") !== null ? button.parentElement.parentElement.getAttribute("data-guid") : '';
            const e = button.parentElement.nextElementSibling.nextElementSibling.children[0];
            const val = e.options[e.selectedIndex].text;
            const exfactory = button.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.children[0].value;
            const indc = button.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.children[0].value;
            _modalBody_Backdrop({
                url: 'Requerimiento/RequerimientoMuestra/_SampleDetails',
                idmodal: 'SampleDetails',
                paremeter: `id:${id},guid:${guid},accion:${id !== '' ? 'edit' : 'new'},idestilo:${ovariables.id},idcliente:${ovariables.idcliente},sample:${val},exfactory:${exfactory},indc:${indc}`,
                title: 'Sample Details',
                width: '',
                height: '570',
                backgroundtitle: 'bg-green',
                animation: 'none',
                responsive: 'width-modal-req',
                bloquearteclado: false,
            });
        }

        function fn_loadimage() {
            _('inputImage').onchange = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                const archivo = this.value;
                const ultimopunto = archivo.lastIndexOf(".");
                let ext = archivo.substring(ultimopunto + 1);
                ext = ext.toLowerCase();
                fn_showimage(this);
                //switch (ext) {
                //    case 'jpg':
                //    case 'jpeg':
                //    case 'png':
                //        fn_showimage(this);
                //        break;
                //    default:
                //        swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
                //        this.value = '';
                //        _('imgSketchEstilo').src = '';
                //}
            }
            //_('inputImage').onclick = function () {
            //    document.body.onfocus = function () {
            //        if (_('inputImage').value === '') {
            //            _('imgSketchEstilo').src = '';
            //            swal({ title: "Warning", text: "Images Allowed (png, jpg, jpeg)", type: "warning", timer: 5000 });
            //            document.body.onfocus = null;
            //        }
            //    }
            //}

            _('btnDeleteUpload').onclick = function () {
                // Set actualizar
                ovariables.actualizarimagen = 1;
                _('imgSketchEstilo').src = '';
                _('inputImage').value = '';
            }
        }

        function fn_showimage(input) {
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    _('imgSketchEstilo').src = e.target.result
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function fn_createsamplexclient(data, id) {
            const cboData = data.map(x => {
                return `<option value="${x.IdTipoMuestraxCliente}" ${id === x.IdTipoMuestraxCliente ? 'selected' : ''}>${_capitalizePhrase(x.NombreTipoMuestra)}</option>`
            }).join('');
            return cboData;
        }

        function fn_createreqtypefabric(data) {
            if (data.length > 0) {
                const cboData = data.map(x => {
                    return `<option value="${x.IdCatalogo}">${_capitalizePhrase(x.NombreCatalogo)}</option>`
                }).join('');
                _('cboRequestTypeFabric').innerHTML = `${cboData}`;
            }
        }

        function fn_supplier(data) {
            if (data.length > 0) {
                const cboData = data.map(x => {
                    return `<option value="${x.IdProveedor}">${x.NombreProveedor}</option>`
                }).join('');
                _('txtSupplierName').innerHTML = `${cboData}`;
            }
        }

        function fn_suppliertype(data) {
            if (data.length > 0) {
                const cboData = data.map(x => {
                    return `<option value="${x.IdTipoProveedor}">${_capitalizePhrase(x.NombreTipoProveedorIngles)}</option>`
                }).join('');
                _('txtSupplierType').innerHTML = `${cboData}`;
            }
        }

        function fn_savestyle() {
            const req_enty = _required({ clase: '_enty_style', id: 'panelEncabezado_NewStyle' });
            if (req_enty) {
                if (fn_val_tblempty()) {
                    swal({
                        html: true,
                        title: "Are you sure you want to create this style?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                        let EstiloJSON = {
                            CodigoEstilo: _('txtClientNumber').value,
                            TipoSolicitudEstilo: 46,
                            Descripcion: _('txtClientDes').value,
                            Notas: _('txtNotes').value,
                            IdPrograma: appStages.ovariables.id,
                            Status: 0,
                            IdTipoProveedor: _('txtSupplierType').value,
                            IdProveedor: _('txtSupplierName').value,
                            ActualizarImagenEstilo: ovariables.actualizarimagen,
                            TipoTela: _('cboStyleFabricType').value,
                            CodigoTela: _('txtStyleFabricCode').value,
                            DescripcionTela: _('txtStyleFabricDes').value
                        };
                        let RequerimientoJSON = [];
                            [...document.querySelectorAll('#tbl_samples tbody tr')].forEach(x => {
                            let json = {};
                            json["IdRequerimiento"] = x.getAttribute("data-id") !== null ? x.getAttribute("data-id") : 0;
                            json["IdTipoMuestraxCliente"] = x.children[2].children[0].value;
                            json["Version"] = x.children[3].textContent === '' ? 1 : x.children[3].textContent;
                            json["ExFactoryInicial"] = x.children[4].children[0].value;
                            json["FechaInDC"] = x.children[5].children[0].value;
                            json["IdCliente"] = ovariables.idcliente;
                            json["IdEstilo"] = ovariables.id;
                            json["IdGrupoPersonal"] = utilindex.idgrupocomercial;
                            json["Estado"] = 1;
                            json["IdReqTemporalGuid"] = x.getAttribute("data-id") !== null ? '' : crearCodigoGuid();
                            RequerimientoJSON.push(json);
                        });
                        frm.append('EstiloJSON', JSON.stringify(EstiloJSON));
                        frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
                        frm.append('ImagenEstilo', $("#inputImage")[0].files[0]);
                        // Para archivos
                        frm.append('RequerimientoArchivoJSON', JSON.stringify([{ ActualizarArchivo: 0 }]));
                        frm.append('ArchivoTechPack', '');
                        frm.append('IdRequerimiento', 0);
                        _Post('Requerimiento/Estilo/SaveNew_Estilo_JSON', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
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
                                    // Hide modal
                                    //$("#modal_NewStyle").modal("hide");
                                    // Refresh
                                    _('btnUpdate').click();

                                    // Para editar sin cerrar modal
                                    ovariables.accion = "edit";
                                    ovariables.id = orpta.id;

                                    _('modal_title_NewStyle').innerHTML = 'Edit Style';
                                    $("#modal_NewStyle .nav-tabs").children().eq(1).css("display", "");
                                    $("#modal_NewStyle .nav-tabs").children().eq(2).css("display", "");
                                    $("#txtWTSCode").closest(".form-group").css("display", "");
                                    $("#cboStatus").closest(".form-group").css("display", "");

                                    _('btnSaveStyle').innerHTML = `<span class="fa fa-save"></span> Update`;
                                    _('btnSaveStyle').removeEventListener('click', fn_savestyle);
                                    _('btnSaveStyle').addEventListener('click', fn_editstyle);
                                    // Mostrar boton enviar
                                    _('btnSendStyle').style.display = '';
                                    _('btnHoldStyle').style.display = '';
                                    _('btnDropStyle').style.display = '';

                                    req_ini();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
                }
            } else {
                swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
            }
        }

        function fn_editstyle() {
            const req_enty = _required({ clase: '_enty_style', id: 'panelEncabezado_NewStyle' });
            if (req_enty) {
                if (fn_val_tblempty()) {
                    swal({
                        html: true,
                        title: "Are you sure you want to update this style?",
                        text: "",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#1c84c6",
                        confirmButtonText: "OK",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    }, function () {
                        let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                        let EstiloJSON = {
                            IdEstilo: ovariables.id,
                            CodigoEstilo: _('txtClientNumber').value,
                            TipoSolicitudEstilo: 46,
                            Descripcion: _('txtClientDes').value,
                            Notas: _('txtNotes').value,
                            IdPrograma: appStages.ovariables.id,
                            Status: 0,
                            IdTipoProveedor: _('txtSupplierType').value,
                            IdProveedor: _('txtSupplierName').value,
                            ActualizarImagenEstilo: ovariables.actualizarimagen,
                            TipoTela: _('cboStyleFabricType').value,
                            CodigoTela: _('txtStyleFabricCode').value,
                            DescripcionTela: _('txtStyleFabricDes').value
                        };
                        let RequerimientoJSON = [];
                        [...document.querySelectorAll('#tbl_samples tbody tr')].forEach(x => {
                            let datapar = x.getAttribute('data-par');
                            let estado_muestra = _par(datapar, 'Estado');
                            let chk_fc = x.getElementsByClassName('cls_chk_fc')[0];
                            let chk_ff = x.getElementsByClassName('cls_chk_ff')[0];
                            let esfacturablecliente = chk_fc.checked ? 1 : 0;
                            let esfacturablefabrica = chk_ff.checked ? 1 : 0;
                            let json = {};
                            json["IdRequerimiento"] = x.getAttribute("data-id") !== null ? x.getAttribute("data-id") : 0;
                            json["IdTipoMuestraxCliente"] = x.children[2].children[0].value;
                            json["Version"] = x.children[3].textContent === '' ? 1 : x.children[3].textContent;
                            json["ExFactoryInicial"] = x.children[4].children[0].value;
                            json["FechaInDC"] = x.children[5].children[0].value;
                            json["IdCliente"] = ovariables.idcliente;
                            json["IdEstilo"] = ovariables.id;
                            json["IdGrupoPersonal"] = utilindex.idgrupocomercial;
                            json["Estado"] = estado_muestra;
                            json["IdReqTemporalGuid"] = x.getAttribute("data-id") !== null ? '' : crearCodigoGuid();
                            json["EsFacturableCliente"] = esfacturablecliente;
                            json["EsFacturableFabrica"] = esfacturablefabrica;
                            RequerimientoJSON.push(json);
                        });
                        frm.append('EstiloJSON', JSON.stringify(EstiloJSON));
                        frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
                        frm.append('ImagenEstilo', $("#inputImage")[0].files[0]);
                        // Para archivos
                        frm.append('RequerimientoArchivoJSON', JSON.stringify([{ ActualizarArchivo: 0 }]));
                        frm.append('ArchivoTechPack', '');
                        frm.append('IdRequerimiento', 0);
                        _Post('Requerimiento/Estilo/SaveEditar_Estilo_JSON', frm, true)
                            .then((resultado) => {
                                const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                                if (orpta.estado === 'success') {
                                    swal({
                                        title: "Good job!",
                                        text: "The style was updated successfully",
                                        type: "success",
                                        timer: 5000,
                                        showCancelButton: false,
                                        confirmButtonColor: "#1c84c6",
                                        confirmButtonText: "OK",
                                        closeOnConfirm: false
                                    });
                                    // Hide modal
                                    //$("#modal_NewStyle").modal("hide");
                                    // Refresh
                                    _('btnUpdate').click();

                                    req_ini();
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }, (p) => { err(p); });
                    });
                } else {
                    swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
                }
            } else {
                swal({ title: "Complete the required fields", text: "The fields in red", type: "error", timer: 5000 });
            }
        }

        function fn_addsamplefile(input) {
            ovariables.actualizararchivo = 1;
            const archivo = input.value;
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
                    fn_savesamplefile(input);
                    break;
                default:
                    swal({ title: "Warning", text: "Files Allowed (csv, xls, xlsx, pdf, doc, docx, txt)", type: "warning", timer: 5000 });
                    input.value = '';
            }
        }

        function fn_savesamplefile(input) {
            let err = function (__err) { console.log('err', __err) }, frm = new FormData();
            let EstiloJSON = {
                IdEstilo: ovariables.id,
                CodigoEstilo: _('txtClientNumber').value,
                TipoSolicitudEstilo: 46,
                Descripcion: _('txtClientDes').value,
                Notas: _('txtNotes').value,
                IdPrograma: appStages.ovariables.id,
                Status: 0,
                IdTipoProveedor: _('txtSupplierType').value,
                IdProveedor: _('txtSupplierName').value,
                ActualizarImagenEstilo: ovariables.actualizarimagen
            };
            let RequerimientoJSON = [];
            [...document.querySelectorAll('#tbl_samples tbody tr')].forEach(x => {
                let datapar = x.getAttribute('data-par');
                let estado_muestra = _par(datapar, 'Estado');
                let json = {};
                json["IdRequerimiento"] = x.getAttribute("data-id") !== null ? x.getAttribute("data-id") : 0;
                json["IdTipoMuestraxCliente"] = x.children[2].children[0].value;
                json["Version"] = x.children[3].textContent === '' ? 1 : x.children[3].textContent;
                json["ExFactoryInicial"] = x.children[4].children[0].value;
                json["FechaInDC"] = x.children[5].children[0].value;
                json["IdCliente"] = ovariables.idcliente;
                json["IdEstilo"] = ovariables.id;
                json["IdGrupoPersonal"] = utilindex.idgrupocomercial;
                json["Estado"] = estado_muestra;
                json["IdReqTemporalGuid"] = x.getAttribute("data-id") !== null ? '' : crearCodigoGuid();
                RequerimientoJSON.push(json);
            });
            let RequerimientoArchivoJSON = [{
                IdArchivo: 0,
                IdRequerimiento: input.parentElement.parentElement.parentElement.getAttribute("data-id"),
                IdTipoArchivo: 1,
                IdEstilo: ovariables.id,
                ActualizarArchivo: 1
            }];
            frm.append('EstiloJSON', JSON.stringify(EstiloJSON));
            frm.append('RequerimientoJSON', JSON.stringify(RequerimientoJSON));
            frm.append('ImagenEstilo', $("#inputImage")[0].files[0]);
            // Para archivos
            frm.append('RequerimientoArchivoJSON', JSON.stringify(RequerimientoArchivoJSON));
            frm.append('ArchivoTechPack', $(input)[0].files[0]);
            frm.append('IdRequerimiento', input.parentElement.parentElement.parentElement.getAttribute("data-id"));
            _Post('Requerimiento/Estilo/SaveEditar_Estilo_JSON', frm)
                .then((resultado) => {
                    const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (orpta.estado === 'success') {
                        swal({
                            title: "Good job!",
                            text: "The file was added successfully",
                            type: "success",
                            timer: 5000,
                            showCancelButton: false,
                            confirmButtonColor: "#1c84c6",
                            confirmButtonText: "OK",
                            closeOnConfirm: false
                        });
                        // Hide modal
                        //$("#modal_NewStyle").modal("hide");
                        // Refresh
                        _('btnUpdate').click();

                        req_ini();
                    } else {
                        swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                    }
                }, (p) => { err(p); });
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
                    IdRequerimiento: ovariables.idrequerimientoestilo,
                    IdEstado: 163
                };
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Estilo/UpdateEstadoEstilo', frm, true)
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
                    IdRequerimiento: ovariables.idrequerimientoestilo,
                    IdEstado: 164
                };
                frm.append('par', JSON.stringify(parametro));
                _Post('Requerimiento/Estilo/UpdateEstadoEstilo', frm, true)
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
            const parametro = { IdRequerimiento: ovariables.idrequerimiento };
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
                const mail_header = _('mailbox_header_style');
                const html = data.map(x => {
                    return `<div class="feed-element feed-cursor" data-id="${x.IdBandeja}" onclick="app_NewStyle.fn_load_mail(this)">
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
                const mail_body = _('mailbox_body_style');
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
            fn_removesample: fn_removesample,
            fn_viewsampledetails: fn_viewsampledetails,
            fn_addsamplefile: fn_addsamplefile,
            fn_get_tipoarchivo: fn_get_tipoarchivo,
            fn_removefile: fn_removefile,
            fn_downloadfile: fn_downloadfile,
            fn_sendsample: fn_sendsample,
            fn_getsampleids: fn_getsampleids,
            fn_val_tblempty: fn_val_tblempty,
            fn_load_mail: fn_load_mail
        }
    }
)(document, 'panelEncabezado_NewStyle');
(
    function ini() {
        app_NewStyle.load();
        app_NewStyle.req_ini();
    }
)();