var app_NewProgram = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lstclientes: [],
            lstmarcas: [],
            lstmarcasAux: [],
            lsttemporadas: [],
            lsttemps: [],
            lstdivision: [],
            lstdivisionCatalogo: [],
            lstestados: []
        }

        function load() {
            // Disable autocomplete by default
            _disableAutoComplete();

            // Se añade focus para evitar abrir nuevo modal con enter
            $("#txtModalName").focus();

            _('txtModalDate').value = _getDate101();
            _('cboModalClient').addEventListener('change', function (e) { fn_changeclient(e.currentTarget) });
            _('cboModalBrand').addEventListener('change', function (e) { fn_changebrand(e.currentTarget) });
            _('cboModalDivision').addEventListener('change', function (e) { fn_changedivision(e.currentTarget) });
            [...document.getElementsByClassName('btnNewOther')].forEach(x => {
                x.addEventListener('click', fn_openother);
            });
            [...document.getElementsByClassName('btnCloseOther')].forEach(x => {
                x.addEventListener('click', fn_closeother);
            });

            // Se obtiene parametro si tuviera
            const par = _('modal_txtpar').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
                if (ovariables.id !== 0) {
                    // Muestra todos los campos
                    $("#panelEncabezado_NewProgram .col-sm-12").removeClass("no-display");
                    // Cambiar boton
                    _('btnModalCreate').innerHTML = `<span class="fa fa-save"></span> Update`;
                    _('btnModalCreate').addEventListener('click', fn_validarEdicion);
                } else {
                    _('btnModalCreate').addEventListener('click', fn_saveprogram);
                }
            }
        }

        // :ini
        function req_ini() {
            if (ovariables.accion !== "edit") {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { x: 0 };
                _Get('Requerimiento/Programa/GetProgramaNew_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            if (rpta.Cliente !== undefined) {
                                ovariables.lstclientes = rpta.Cliente.ClientesCSV !== '' ? CSVtoJSON(rpta.Cliente.ClientesCSV) : [];
                                _('cboModalClient').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstclientes, "IdCliente", "NombreCliente");

                                // Llama al change                                                        
                                //_('cboModalClient').click();
                                fn_changeclient(_('cboModalClient'));
                                fn_changebrand(_('cboModalBrand'));
                            } else {
                                swal({ title: "Error", text: "You have no clients assigned", type: "error" });
                                $("#modal_NewProgram").modal("hide");
                            }
                        }
                    }, (p) => { err(p); });
            } else {
                let err = function (__err) { console.log('err', __err) },
                    parametro = { idprograma: ovariables.id };
                _Get('Requerimiento/Programa/GetProgramaEditar_JSON?par=' + JSON.stringify(parametro))
                    .then((resultado) => {
                        let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (rpta !== null) {
                            ovariables.lstclientes = rpta.Cliente.ClientesCSV !== '' ? CSVtoJSON(rpta.Cliente.ClientesCSV) : [];
                            ovariables.lstmarcas = rpta.ClienteMarca.ClienteMarcasCSV !== '' ? CSVtoJSON(rpta.ClienteMarca.ClienteMarcasCSV) : [];
                            ovariables.lsttemporadas = rpta.ClienteTemporada.ClienteTemporadasCSV !== '' ? CSVtoJSON(rpta.ClienteTemporada.ClienteTemporadasCSV) : [];
                            ovariables.lstdivision = rpta.ClienteDivision.ClienteDivisionesCSV !== '' ? CSVtoJSON(rpta.ClienteDivision.ClienteDivisionesCSV) : [];
                            ovariables.lstestados = rpta.EstadosProgramas.EstadosProgramasCSV !== '' ? CSVtoJSON(rpta.EstadosProgramas.EstadosProgramasCSV) : [];
                            ovariables.lsttemps = rpta.ClienteTemporada.TemporadasCSV !== '' ? CSVtoJSON(rpta.ClienteTemporada.TemporadasCSV) : [];

                            _('cboModalClient').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(ovariables.lstclientes, "IdCliente", "NombreCliente");

                            // Crea combos
                            fn_createbrand(ovariables.lstmarcas);
                            fn_createseason(ovariables.lsttemporadas);
                            fn_createdivision(ovariables.lstdivision);
                            fn_createstatus(ovariables.lstestados);

                            // New
                            fn_createseasonnew(ovariables.lsttemps);
                            fn_createanios();

                            // Llenar campos
                            _('txtModalUser').value = rpta.NombreUsuario;
                            _('txtModalName').value = rpta.Nombre;
                            _('cboModalClient').value = rpta.Cliente.IdCliente;
                            _('cboModalBrand').value = rpta.ClienteMarca.IdClienteMarca;
                            _('cboModalSeason').value = rpta.ClienteTemporada.IdClienteTemporada;
                            _('cboModalStatus').value = rpta.EstadosProgramas.IdCatalogo_IdEstado;
                            _('cboModalSeasonCode').value = rpta.ClienteTemporada.CodigoClienteTemporada;
                            // Division
                            fn_changebrand(_('cboModalBrand'));
                            _('cboModalDivision').value = rpta.ClienteDivision.IdClienteDivision;

                            // Deshabilitar campos
                            _('cboModalClient').setAttribute("disabled", "disabled");
                        }
                    }, (p) => { err(p); });
            }
        }

        function fn_changebrand(e) {
           
            const div = (_('btncloseDivision')).parentNode.parentNode.parentNode;
            div.previousElementSibling.classList.remove("hide");
            div.classList.add("hide");

            const id = e.value;
            const arr = ovariables.lstdivision.filter(x => x.IdMarca === id);
            fn_createdivision(arr);

            if (id !== '') {
                _('cboModalDivision').removeAttribute("disabled");
                $(".btnNewOther").eq(2).prop("disabled", false);
            } else {
                _('cboModalDivision').setAttribute("disabled", "disabled");
                $(".btnNewOther").eq(2).prop("disabled", false);
            }

            _('txtModalBrand').value = id;
        }

        function fn_changedivision(e) {

            const id = e.value;          
            _('txtModalDivision').value = id;
        }

        function fn_changeclient(event) {
            let err = function (__err) { console.log('err', __err) };            
            //console.log(event);
            let valueCodigoCliente = event.value.trim();
            //console.log(valueCodigoCliente);
            _Get('Requerimiento/Programa/GetListaCombosRequerimiento_JSON?par=' + valueCodigoCliente)
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {
                        const existeCliente = (valueCodigoCliente.trim() !== '');
                        ovariables.lstmarcas = rpta.ClienteMarcas !== '' && existeCliente ? CSVtoJSON(rpta.ClienteMarcas) : [] ;
                        ovariables.lsttemporadas = rpta.ClienteTemporada !== '' && existeCliente ? CSVtoJSON(rpta.ClienteTemporada) : [];
                        ovariables.lstdivision = rpta.ClienteDivision !== '' && existeCliente ? CSVtoJSON(rpta.ClienteDivision) : [];
                        ovariables.lstdivisionCatalogo = rpta.ClienteDivisionCatalogo !== '' && existeCliente ? CSVtoJSON(rpta.ClienteDivisionCatalogo) : [];
                        
                        ovariables.lsttemps = rpta.Temporadas !== '' && existeCliente ? CSVtoJSON(rpta.Temporadas) : [];

                        // Crea combos
                        fn_createbrand(ovariables.lstmarcas);
                        fn_createseason(ovariables.lsttemporadas);
                        //fn_createdivision(ovariables.lstdivision);

                        // New
                        fn_createseasonnew(ovariables.lsttemps);
                        fn_createanios();

                        if (!existeCliente) {
                            _('cboModalBrand').setAttribute("disabled", "disabled");
                            _('cboModalSeason').setAttribute("disabled", "disabled");
                            _('cboModalSeasonCode').setAttribute("disabled", "disabled");
                            //_('cboModalDivision').setAttribute("disabled", "disabled");
                            $(".btnNewOther").prop("disabled", true);

                            // For hidden divs
                            $(".div_principal").removeClass("hide");
                            $(".div_secundario").addClass("hide");
                        } else {
                            _('cboModalBrand').removeAttribute("disabled");
                            _('cboModalSeason').removeAttribute("disabled");
                            _('cboModalSeasonCode').removeAttribute("disabled");
                            //_('cboModalDivision').removeAttribute("disabled");
                            $(".btnNewOther").prop("disabled", false);
                        }
                    }
                }, (p) => { err(p); });
        }

        function fn_createbrand(data) {
            _('cboModalBrand').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(data, "IdClienteMarca", "NombreMarca");
        }

        function fn_createseason(data) {            
            _('cboModalSeason').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(data, "IdClienteTemporada", "NombreTemporada");
        }

        function fn_createseasonnew(data) {
            _('cboModalSeasonNew').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(data, "IdTemporada", "NombreTemporada");
        }

        function fn_createdivision(data) {            
            _('cboModalDivision').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(data, "IdClienteDivision", "NombreDivision");
        }

        function fn_createstatus(data) {            
            const dataCapitalizeCatalogo = data.map(x => ({ ...x, NombreCatalogo: _capitalizeWord(x.NombreCatalogo) }))
            _('cboModalStatus').innerHTML = _comboItem({ value: '', text: '--select--' }) + _comboFromJSON(data, "IdCatalogo", "NombreCatalogo");
        }

        function fn_createanios() {
            const currentYear = (new Date()).getFullYear();
            const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
            const cboRange = range(currentYear, currentYear + 1, 1).map(x => {
                return `<option value="${x}">${x}</option>`
            }).join('');
            _('cboModalYearNew').innerHTML = `<option value=''>--select--</option>${cboRange}`;
        }

        function fn_openother(e) {

            let id = e.currentTarget.getAttribute("id");
            // Limpia inputs
            
            _('txtModalDivision').value = '';
            // New

            if (id == 'btnMarca') {
                _('txtModalBrand').value = '';
                _('cboModalSeasonNew').value = '';
                _('cboModalYearNew').value = '';
                _('cboModalSeasonCodeNew').value = '';

                _('cboModalBrand').value = '';
                fn_changebrand(_('cboModalBrand'))

            }

            const div = e.currentTarget.parentNode.parentNode.parentNode;

            if (_isEmpty(_('cboModalClient').value)) {
                swal({ title: "Warning", text: "The Client field is required", type: "warning", timer: 5000 });
            } else {
                div.nextElementSibling.classList.remove("hide");
                div.classList.add("hide");
            }
        }

        function fn_closeother(e) {
            const div = e.currentTarget.parentNode.parentNode.parentNode;
            div.previousElementSibling.classList.remove("hide");
            div.classList.add("hide");
        }

        function fn_seasonsave(button) {
            swal({
                html: true,
                title: "Are you sure you want to add this season code to the list?",
                text: "The season code will be added to the list.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                closeOnConfirm: false
            }, function () {
                let err = function (__err) { console.log('err', __err) },
                    parametro = {
                        IdCliente: _('cboModalClient').value,
                        IdTemporada: _('cboModalSeasonNew').value,
                        NombreTemporada: _('cboModalSeasonCodeNew').value,
                        Anio: _('cboModalYearNew').value
                    },
                    frm = new FormData();
                frm.append('par', JSON.stringify(parametro));
                _Post('Maestra/Temporada/SaveNew_ClienteTemporada', frm)
                    .then((resultado) => {
                        let orpta = resultado !== '' ? JSON.parse(resultado) : null;
                        if (orpta.estado === 'success') {
                            swal({ title: "Good job!", text: "The season code was added successfully", type: "success", timer: 5000 });
                            // Cierra new
                            button.previousElementSibling.click();
                            fn_createseason(CSVtoJSON(orpta.data));
                            _('cboModalSeason').value = orpta.id;

                            // Jala codigo a insertar
                            _('cboModalSeasonCode').value = _('cboModalSeasonCodeNew').value;
                        } else {
                            swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                        }
                    }, (p) => { err(p); });
            });
        }

        function fn_brandsave(button) {
            const txtfield = _('txtModalBrand').value;
            if (_isnotEmpty(txtfield)) {
                swal({
                    html: true,
                    title: "Are you sure you want to add this brand to the list junior?",
                    text: "The brand will be added to the list.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {

                        let nombreMarca = (_('txtModalBrand').value).trim();
                        AgregarNuevaMarca(nombreMarca, button) 
                    //let err = function (__err) { console.log('err', __err) },
                    //    parametro = {
                    //        IdClienteMarca: 0,
                    //        IdCliente: nombreMarca,
                    //        NombreMarca: txtfield
                    //    },
                    //    frm = new FormData();
                    //frm.append('par', JSON.stringify(parametro));
                    //_Post('Maestra/Marca/SaveNew_ClienteMarca', frm)
                    //    .then((resultado) => {
                    //        let orpta = resultado !== '' ? JSON.parse(resultado) : null;
                    //        if (orpta.estado === 'success') {
                    //            swal({ title: "Good job!", text: "The brand was added successfully", type: "success", timer: 5000 });
                    //            // Cierra new
                    //            button.previousElementSibling.click();
                    //            fn_createbrand(CSVtoJSON(orpta.data));
                    //            _('cboModalBrand').value = orpta.id;
                    //        } else {
                    //            swal({ title: "The data you are trying to add already exists in the list", text: "Please check the list", type: "error", timer: 5000 });
                    //        }
                    //    }, (p) => { err(p); });

                });
            } else {
                swal({ title: "Warning", text: "The brand field is required", type: "warning" });
            }
        }

        function AgregarNuevaMarca(nombreMarca, button) {

            const filter = ovariables.lstmarcas.filter(x => (x.NombreMarca).toUpperCase() === (nombreMarca).toUpperCase());

            if (filter.length > 0) {
                swal({ title: "Error", text: "The brand exist.", type: "error" });
                button.previousElementSibling.click();
                fn_createbrand(ovariables.lstmarcas);
                _('cboModalBrand').value = '';
                fn_changebrand(_('cboModalBrand'))

            } else {

                const filtercero = ovariables.lstmarcas.filter(x => (x.IdClienteMarca).toUpperCase() === ('0').toUpperCase());
                let idCliente = _('cboModalClient').value;

                if (filtercero.length === 0) {
                    let obj = {};
                    obj.IdClienteMarca = 0;
                    obj.NombreMarca = nombreMarca;
                    obj.IdCliente = idCliente;
                    (ovariables.lstmarcas).push(obj)

                } else {
                    ovariables.lstmarcas.map(function (dato) {
                        if (dato.IdCliente == '0') {
                            dato.NombreMarca = nombreMarca;
                        }
                    })
                }
               
                button.previousElementSibling.click();
                fn_createbrand(ovariables.lstmarcas);
                _('cboModalBrand').value = '0';
                fn_changebrand(_('cboModalBrand'))
                swal({ title: "Good job!", text: "The brand was added successfully", type: "success", timer: 5000 });
            }            

        }

        function AgregarNuevaDivision(button) {

            let nombreDivision = _('txtModalDivision').value;
            let IdMarca = _('cboModalBrand').value;
            let IdCliente = _('cboModalClient').value;

            const filter = ovariables.lstmarcas.filter(x => (x.NombreMarca).toUpperCase() === (nombreMarca).toUpperCase());

            if (filter.length > 0) {
                swal({ title: "Error", text: "The brand exist.", type: "error" });
                button.previousElementSibling.click();
                fn_createbrand(ovariables.lstmarcas);
                _('cboModalBrand').value = '';
                fn_changebrand(_('cboModalBrand'))

            } else {

                const filtercero = ovariables.lstmarcas.filter(x => (x.IdClienteMarca).toUpperCase() === ('0').toUpperCase());
                let idCliente = _('cboModalClient').value;

                if (filtercero.length === 0) {
                    let obj = {};
                    obj.IdClienteMarca = 0;
                    obj.NombreMarca = nombreMarca;
                    obj.IdCliente = idCliente;
                    (ovariables.lstmarcas).push(obj)

                } else {
                    ovariables.lstmarcas.map(function (dato) {
                        if (dato.IdCliente == '0') {
                            dato.NombreMarca = nombreMarca;
                        }
                    })
                }

                button.previousElementSibling.click();
                fn_createbrand(ovariables.lstmarcas);
                _('cboModalBrand').value = '0';
                fn_changebrand(_('cboModalBrand'))
                swal({ title: "Good job!", text: "The brand was added successfully", type: "success", timer: 5000 });
            }

        }

        function fn_divisionsave(button) {
            const txtfield = _('txtModalDivision').value;
            if (_isnotEmpty(txtfield)) {
                swal({
                    html: true,
                    title: "Are you sure you want to add this division to the list?",
                    text: "The division will be added to the list.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = {
                            IdClienteDivision: 0,
                            IdMarca: _('cboModalBrand').value,
                            IdCliente: _('cboModalClient').value,
                            NombreDivision: txtfield
                        },
                        frm = new FormData();
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Maestra/Division/SaveNew_ClienteDivision', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                swal({ title: "Good job!", text: "The division was added successfully", type: "success", timer: 5000 });
                                // Cierra new
                                button.previousElementSibling.click();
                                ovariables.lstdivision = CSVtoJSON(orpta.data);
                                fn_changebrand(_('cboModalBrand'));
                                _('cboModalDivision').value = orpta.id;
                            } else {
                                swal({ title: "The data you are trying to add already exists in the list", text: "Please check the list", type: "error", timer: 5000 });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Warning", text: "The division field is required", type: "warning" });
            }
        }

        function fn_saveprogram() {
            const req_enty = _required({ clase: '_enty_modal', id: 'panelEncabezado_NewProgram' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Are you sure you want to create this program?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = _getParameter({ clase: '_enty_modal', id: 'panelEncabezado_NewProgram' }),
                        frm = new FormData();
                        parametro["IdCatalogo_IdEstado"] = "48";
                        if (parametro.IdClienteDivision == '') { parametro.IdClienteDivision='0' };
                        if (parametro.IdClienteMarca == '') { parametro.IdClienteMarca = '0'  };

                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Programa/Save_New_Programa', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                swal({ title: "Good job!", text: "The program was created successfully", type: "success", timer: 5000 });
                                // Hide modal
                                $("#modal_NewProgram").modal("hide");
                                // Refresh
                                _('btnUpdate').click();
                            } else {
                                if (orpta.id === -1) {
                                    swal({ title: "Error!", text: "You can't create a program with the same brand, season or division", type: "error" });
                                } else {
                                    swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                                }
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        function fn_validarEdicion() {

            let parametro = {
                Accion: 'Save',
                IdPrograma: ovariables.id
            };


            let title = '';
            let text = '';
            let type = '';
            let frm = new FormData();
            frm.append('par', JSON.stringify(parametro));
            _Post('Requerimiento/Programa/GetValidarModificarPrograma_JSON', frm)
                .then((resultado) => {
                    let rpta = resultado !== '' ? JSON.parse(resultado) : null;
                    if (rpta !== null) {

                        ovariables.permitir = rpta.Permiso == 1 ? true : false;
                        text = rpta.Descripcion;
                        type = rpta.Tipo;
                        title = rpta.Titulo;

                        if (!(ovariables.permitir)) {

                            swal({
                                title: title,
                                text: text,
                                type: type,
                                timer: 5000,
                                showCancelButton: false,
                                confirmButtonColor: "#1c84c6",
                                confirmButtonText: "OK",
                                closeOnConfirm: false
                            });
                        } else {

                            fn_editprogram();

                        }

                    }
                }, (p) => { err(p); });         

        }

        function fn_editprogram() {
            const req_enty = _required({ clase: '_enty_modal', id: 'panelEncabezado_NewProgram' });
            if (req_enty) {
                swal({
                    html: true,
                    title: "Are you sure you want to update this program?",
                    text: "",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) },
                        parametro = _getParameter({ clase: '_enty_modal', id: 'panelEncabezado_NewProgram' }),
                        frm = new FormData();
                    parametro["IdPrograma"] = ovariables.id;
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Requerimiento/Programa/Save_Edit_Programa', frm)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                swal({ title: "Good job!", text: "The program was updated successfully", type: "success", timer: 5000 });
                                // Hide modal
                                $("#modal_NewProgram").modal("hide");
                                // Refresh
                                _('btnUpdate').click();
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            }
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_brandsave: fn_brandsave,
            fn_seasonsave: fn_seasonsave,
            fn_divisionsave: fn_divisionsave
        }
    }
)(document, 'panelEncabezado_NewProgram');
(
    function ini() {
        app_NewProgram.load();
        app_NewProgram.req_ini();
    }
)();