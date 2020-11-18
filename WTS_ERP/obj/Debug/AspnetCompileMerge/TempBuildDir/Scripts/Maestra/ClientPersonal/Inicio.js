var app_ClientePersonal_Inicio = (
    function (d, idpadre) {

        ovariables = {
            lst_grupopersonal: []
            , lst_personal: []
            , lst_cliente: []
            , lst_clientepersonal: []
            , idtipobusqueda: 0
            , idgrupopersonal: 0
            , idpersonal: 0
            , idcliente: 0
        }

        function load() {

            _('cbo_grupopersonal').addEventListener('change', req_change_grupopersonal);
            _('cbo_personal').addEventListener('change', req_change_personal);
            _('cbo_cliente').addEventListener('change', req_change_cliente);
            handler_check();

            _('btn_guardar').addEventListener('click', req_save);
        }

        function req_save() {
            swal({
                title: "Esta seguro de guardar estos cambios?",
                text: "",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1c84c6",
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: false
            }, function () {
                fn_save();
            });
        }

        function fn_save() {
            let url = 'Maestra/ClientPersonal/ClientePersonal_Guardar';
            //ovariables.idpersonal = _('cbo_personal').value;
            //ovariables.idcliente = _('cbo_cliente').value;
            let odata = _getParameter({ id: 'pnl_clientepersonal_inicio_body', clase: '_enty' })
                , arr_cliente = JSON.stringify(fn_get_clientepersonal())
            , arr_personal = JSON.stringify(fn_get_personalcliente());
            form = new FormData();

            form.append('parhead', JSON.stringify(odata));
            form.append('pardetail', arr_cliente);
            form.append('parsubdetail', arr_personal);
            Post(url, form, res_insert);
        }

        function res_insert(response) {
            let orpta = response !== '' ? JSON.parse(response) : null;
            if (orpta != null) {
                if (orpta.estado === 'success') {
                    swal({ title: "Good Job!", text: "You have sent new registers", type: "success" });
                    //_('div_personal').classList.add('hide');
                    //_('div_cliente').classList.add('hide');
                    req_ini();
                    //_('cbo_personal').value = ovariables.idpersonal;
                    //_('cbo_cliente').value = ovariables.idcliente;
                };
                if (orpta.estado === 'error') {
                    swal({ title: "There are a problem!", text: "You have comunicate with TIC Administrator", type: "error" });
                }
            }
        }

        function fn_get_clientepersonal() {
            let divpadre = _('tbl_detalle_clientepersonal');
            let arrcliente_selected = [...divpadre.getElementsByClassName("_clschk_cliente")]
                , arrresultado = [], obj = {
                };

            if (arrcliente_selected.length > 0) {
                arrcliente_selected.forEach(x=> {
                    if (x.checked) {
                        obj = {
                        };
                        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        let par = fila.getAttribute('data-par');
                        let des = fila.children[2].children[0].children[0].children[0].children[0].children[0].checked;

                        obj.idcliente = _par(par, 'idcliente');
                        obj.desarrollo = des == true ? 1 : 0;
                        arrresultado.push(obj);
                    }
                });
            }
            return arrresultado;
        }

        function fn_get_personalcliente() {
            let divpadre = _('tbl_detalle_personalcliente');
            let arrcliente_selected = [...divpadre.getElementsByClassName("_clschk_personal")]
                           , arrresultado = [], obj = {
                           };

            if (arrcliente_selected.length > 0) {
                arrcliente_selected.forEach(x=> {
                    if (x.checked) {
                        obj = {
                        };
                        let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        let par = fila.getAttribute('data-par');
                        let des = fila.children[2].children[0].children[0].children[0].children[0].children[0].checked;

                        obj.idpersonal = _par(par, 'idpersonal');
                        obj.desarrollo = des == true ? 1 : 0;
                        arrresultado.push(obj);
                    }
                });
            }
            return arrresultado;
        }

        function handler_check() {
            $('.i-checks._radbtn').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let x = e.currentTarget;
                let id = (x.parentNode.parentNode.parentNode.parentNode).id;
                ovariables.idpersonal = 0;
                ovariables.idcliente = 0;
                fn_load_cliente();
                fn_load_personal();
                fn_load_clientepersonal();
                fn_load_personalcliente();

                if (id == 'id_rad_cliente') {
                    _('cbo_personal').disabled = true;
                    _('cbo_cliente').disabled = false;
                    ovariables.idtipobusqueda = 2;
                }
                else {
                    _('cbo_personal').disabled = false;
                    _('cbo_cliente').disabled = true;
                    ovariables.idtipobusqueda = 1;
                }

                _('div_personal').classList.add('hide');
                _('div_cliente').classList.add('hide');

            });
        }

        function req_change_grupopersonal() {
            ovariables.idgrupopersonal = _('cbo_grupopersonal').value;
            ovariables.idpersonal = 0;
            ovariables.idcliente = 0;
            fn_load_personal();
            fn_load_cliente();

            _('div_personal').classList.add('hide');
            _('div_cliente').classList.add('hide');
        }

        function req_change_personal() {
            let idpersonal = _('cbo_personal').value;
            ovariables.idpersonal = _('cbo_personal').value;
            ovariables.idcliente = 0;
            fn_load_clientepersonal();

            if (idpersonal != '') { _('div_personal').classList.remove('hide'); }
            else {
                _('div_personal').classList.add('hide');
            }
        }

        function req_change_cliente() {
            let idcliente = _('cbo_cliente').value;
            ovariables.idpersonal = 0;
            ovariables.idcliente = _('cbo_cliente').value;
            fn_load_personalcliente();

            if (idcliente != '') { _('div_cliente').classList.remove('hide'); }
            else {
                _('div_cliente').classList.add('hide');
            }
        }

        function req_ini() {
            const err = function (__err) { console.log('err', __err) },
               parametro = {
                   accion: 'iniciar'
               };
            _Get('Maestra/ClientPersonal/ClientePersonal_Listar?par=' + JSON.stringify(parametro))
               .then((resultado) => {
                   const rpta = resultado !== '' ? JSON.parse(resultado) : [];
                   if (rpta !== null) {
                       ovariables.lst_grupopersonal = rpta[0].grupopersonal !== '' ? JSON.parse(rpta[0].grupopersonal) : [];
                       ovariables.lst_personal = rpta[0].personal !== '' ? JSON.parse(rpta[0].personal) : [];
                       ovariables.lst_cliente = rpta[0].cliente !== '' ? JSON.parse(rpta[0].cliente) : [];
                       ovariables.lst_clientepersonal = rpta[0].clientepersonal !== '' ? JSON.parse(rpta[0].clientepersonal) : [];
                   }
                   fn_load_grupopersonal();
                   fn_load_personal();
                   fn_load_cliente();
               }, (p) => { err(p); })
            .then(() => {
                if (ovariables.idtipobusqueda == 0) {
                    _('id_rad_personal').children[0].children[0].children[0].classList.add('checked');
                    ovariables.idtipobusqueda = 1;
                }
            });
        }

        function fn_load_grupopersonal() {
            let lst_grupopersonal = ovariables.lst_grupopersonal
              , cbo_grupopersonal = `<option value='0'>Seleccione</option>`;

            if (lst_grupopersonal.length <= 1) {
                cbo_grupopersonal = ''; _('cbo_grupopersonal').disabled = true;
            }

            if (lst_grupopersonal.length > 0) {
                lst_grupopersonal.forEach(x=> { cbo_grupopersonal += `<option value='${x.idgrupopersonal}'>${x.grupopersonal}</option>`; });
            }

            _('cbo_grupopersonal').innerHTML = cbo_grupopersonal;

            //ovariables.idgrupopersonal = _('cbo_grupopersonal').value;

            if (ovariables.idgrupopersonal > 0) {
                _('cbo_grupopersonal').value = ovariables.idgrupopersonal;
            }

        }

        function fn_load_personal() {
            let lst_personal = ovariables.lst_personal
              , cbo_personal = `<option value='0'>Seleccione</option>`
              , idgrupopersonal = _('cbo_grupopersonal').value
            , resultado_personal = [];

            resultado_personal = lst_personal.filter(x=>x.idgrupopersonal.toString() === idgrupopersonal);

            if (resultado_personal.length > 0) {
                resultado_personal.forEach(x=> { cbo_personal += `<option value='${x.idpersonal}'>${x.nombrepersonal}</option>`; });
            }

            _('cbo_personal').innerHTML = cbo_personal;

            if (ovariables.idpersonal > 0) {
                _('cbo_personal').value = ovariables.idpersonal;
            }
        }

        function fn_load_cliente() {
            let lst_cliente = ovariables.lst_cliente
              , cbo_cliente = `<option value='0'>Seleccione</option>`
              , idgrupopersonal = _('cbo_grupopersonal').value
            , resultado_cliente = [];

            resultado_cliente = lst_cliente.filter(x=>x.idgrupopersonal.toString() === idgrupopersonal);

            if (resultado_cliente.length > 0) {
                resultado_cliente.forEach(x=> { cbo_cliente += `<option value='${x.idcliente}'>${x.nombrecliente}</option>`; });
            }

            _('cbo_cliente').innerHTML = cbo_cliente;

            if (ovariables.idcliente > 0) {
                _('cbo_cliente').value = ovariables.idcliente;
            }
        }

        function fn_load_clientepersonal() {
            let lst_cliente = ovariables.lst_cliente
             , idgrupopersonal = _('cbo_grupopersonal').value
             , idpersonal = _('cbo_personal').value
           , resultado_clientepersonal = [], htmlbody = '';

            if (idpersonal != '0') {
                resultado_clientepersonal = lst_cliente.filter(x=>x.idgrupopersonal.toString() === idgrupopersonal);

                resultado_clientepersonal.forEach(x=> {
                    htmlbody += `
                    <tr data-par='idcliente:${x.idcliente}'>
                        <td class ='text-center'>
                            <div  class ='i-checks _item'>
                                <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                    <label>
                                        <input id='chk_idcliente' data-idcliente = '${x.idcliente}' type='checkbox' class ='i-checks _clschk_cliente' style='position: absolute; opacity: 0;'>
                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                    </label>
                                </div>
                            </div>
                        </td>
                        <td>${x.nombrecliente}</td>
                        <td class ='text-center'>
                            <div  class ='i-checks _item'>
                                <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                    <label>
                                        <input id='chk_desarrollo' data-idcliente = '${x.idcliente}' value='${x.desarrollo}' type='checkbox' class ='i-checks _clschk_desarrollo' style='position: absolute; opacity: 0;'>
                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
                });
            }

            _('tbl_detalle_clientepersonal').tBodies[0].innerHTML = htmlbody;
            $('.footable').trigger('footable_resize');

            let divpadrecliente = _('tbl_detalle_clientepersonal');
            let arrcliente_selected = [...divpadrecliente.getElementsByClassName("_clschk_cliente")];
            let arrdesarrollo_selected = [...divpadrecliente.getElementsByClassName("_clschk_desarrollo")];

            if (ovariables.lst_clientepersonal) {

                arrdesarrollo_selected.forEach(x=> {
                    let idcliente = x.getAttribute('data-idcliente');
                    let chequeado = ovariables.lst_clientepersonal.some(y=> {
                        return (y.desarrollo === 1 && y.idcliente.toString() === idcliente && y.idpersonal.toString() === idpersonal)
                    });
                    x.checked = chequeado;
                });

                arrcliente_selected.forEach(x=> {
                    let idcliente = x.getAttribute('data-idcliente');
                    let chequeado = ovariables.lst_clientepersonal.some(y=> {
                        return (y.idcliente.toString() === idcliente && y.idpersonal.toString() === idpersonal)
                    });
                    x.checked = chequeado;

                    let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (!x.checked) {
                        fila.children[2].children[0].children[0].children[0].children[0].disabled = true;
                    }
                });
            }

            handler_table();
        }

        function handler_table() {
            $('.i-checks._item').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function (e) {
                let x = e.currentTarget;
                let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                let id = x.id;
                let habilitado = fila.children[0].children[0].children[0].children[0].children[0].children[0].checked;
                if (id != 'chk_desarrollo') {
                    if (habilitado) {
                        fila.children[2].children[0].children[0].children[0].children[0].children[0].checked = true;
                        fila.children[2].children[0].children[0].children[0].children[0].children[0].disabled = false;
                    }
                    else {
                        fila.children[2].children[0].children[0].children[0].children[0].children[0].checked = false;
                        fila.children[2].children[0].children[0].children[0].children[0].children[0].disabled = true;
                    }

                    handler_table();
                }
            });
        }

        function fn_load_personalcliente() {
            let lst_personal = ovariables.lst_personal
             , idgrupopersonal = _('cbo_grupopersonal').value
             , idcliente = _('cbo_cliente').value
           , resultado_personalcliente = [], htmlbody = '';

            if (idcliente != '0') {
                resultado_personalcliente = lst_personal.filter(x=>x.idgrupopersonal.toString() === idgrupopersonal);


                resultado_personalcliente.forEach(x=> {
                    htmlbody += `
                    <tr data-par='idpersonal:${x.idpersonal}'>
                        <td class ='text-center'>
                            <div  class ='i-checks _item'>
                                <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                    <label>
                                        <input id='chk_idpersonal' data-idpersonal = '${x.idpersonal}' type='checkbox' class ='i-checks _clschk_personal' style='position: absolute; opacity: 0;'>
                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                    </label>
                                </div>
                            </div>
                        </td>
                        <td>${x.nombrepersonal}</td>
                        <td class ='text-center'>
                            <div  class ='i-checks _item'>
                                <div class ='icheckbox_square-green _chkitem' style='position: relative;' >
                                    <label>
                                        <input id='chk_desarrollo' data-idpersonal = '${x.idpersonal}' value='${x.desarrollo}' type='checkbox' class ='i-checks _clschk_desarrollo' style='position: absolute; opacity: 0;'>
                                        <ins class ='iCheck-helper' style='position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(28, 132, 198); border: 0px; opacity: 0;'></ins>
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
                });
            }

            _('tbl_detalle_personalcliente').tBodies[0].innerHTML = htmlbody;
            $('.footable').trigger('footable_resize');

            let divpadrepersonal = _('tbl_detalle_personalcliente');
            let arrpersonal_selected = [...divpadrepersonal.getElementsByClassName("_clschk_personal")];
            let arrdesarrollo_selected = [...divpadrepersonal.getElementsByClassName("_clschk_desarrollo")];

            if (ovariables.lst_clientepersonal) {

                arrdesarrollo_selected.forEach(x=> {
                    let idpersonal = x.getAttribute('data-idpersonal');
                    let chequeado = ovariables.lst_clientepersonal.some(y=> {
                        return (y.desarrollo === 1 && y.idcliente.toString() === idcliente && y.idpersonal.toString() === idpersonal)
                    });
                    x.checked = chequeado;
                });

                arrpersonal_selected.forEach(x=> {
                    let idpersonal = x.getAttribute('data-idpersonal');
                    let chequeado = ovariables.lst_clientepersonal.some(y=> {
                        return (y.idcliente.toString() === idcliente && y.idpersonal.toString() === idpersonal)
                    });
                    x.checked = chequeado;

                    let fila = x.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (!x.checked) {
                        fila.children[2].children[0].children[0].children[0].children[0].disabled = true;
                    }
                });
            }

            handler_table();
        }

        return {
            load: load,
            req_ini: req_ini
        }
    }
)(document, 'pnl_clientepersonal_inicio');
(
    function ini() {
        app_ClientePersonal_Inicio.load();
        app_ClientePersonal_Inicio.req_ini();
    }
)();