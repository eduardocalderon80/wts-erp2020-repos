var app_Mailbox = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lsthistory: [],
            lstemails: [],
            nextlink: '',
            loading: false,
            accessToken: '',
            selectmail: []
        }

        function load() {
            // Events
            _('mail_header').addEventListener('scroll', fn_infinite_scroll);
            _('btnMailboxSearch').addEventListener('click', fn_search);
            _('txtMailboxSearch').addEventListener('keypress', fn_enter);
            _('btnMailAdd').addEventListener('click', fn_add);

            // Se obtiene parametro si tuviera
            const par = _('txtpar_mail').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
            }

            // Check if is login
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken !== null) {
                ovariables.accessToken = accessToken;
            }

            $('.feed-activity-list').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
            $('.feed-activity-body').slimScroll({
                height: '400px',
                width: '100%',
                railOpacity: 0.9
            });
        }

        function fn_clear() {
            ovariables.lsthistory = [];
            ovariables.lstemails = [];
            ovariables.nextlink = '';

            _('mail_header').innerHTML = '';
            _('mail_body').innerHTML = '';
        }

        function req_ini() {
            fn_clear();
            _fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=15`, 'GET', false, ovariables.accessToken)
                .then(res => {
                    ovariables.lsthistory.push(...res["value"]);
                    ovariables.lstemails = res["value"] !== undefined ? res["value"] : [];
                    ovariables.nextlink = res["@odata.nextLink"] !== undefined ? res["@odata.nextLink"] : '';
                    // Create viewer
                    fn_create_viewer(ovariables.lstemails);
                });
        }

        function fn_graph_uri(url, clear = false) {
            clear === true ? fn_clear() : null;
            _fetch(`${url}`, 'GET', false, ovariables.accessToken)
                .then(res => {
                    if (ovariables.loading) {
                        ovariables.loading = false;
                        fn_add_loader();
                    }
                    ovariables.lsthistory.push(...res["value"]);
                    ovariables.lstemails = res["value"] !== undefined ? res["value"] : [];
                    ovariables.nextlink = res["@odata.nextLink"] !== undefined ? res["@odata.nextLink"] : '';
                    // Create viewer
                    fn_create_viewer(ovariables.lstemails);
                });
        }

        function fn_create_viewer(data) {
            const div = _('mail_header');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<div class="feed-element mail-list" data-id="${x.id}" onclick="app_Mailbox.fn_view(this)">
                                <div class="media-body">
                                    <small class="float-right">${_getDate101(x.sentDateTime)}</small>
                                    <span class="m-r-xs"><input class="i-check-mail" type="checkbox" data-id="${x.id}" name="input_mail_checkbox" /></span>
                                    <strong>${x.sender !== undefined ? x.sender.emailAddress.name : ''}</strong><br>
                                    <strong>${x.subject}<br>
                                    <small class="text-muted">${_truncateWithEllipses(x.bodyPreview, 50)}</small>
                                </div>
                            </div>`;
                }).join("");
                div.insertAdjacentHTML('beforeend', html);
            }
            fn_icheck_select();
        }

        function fn_icheck_select() {
            $('.i-check-mail').iCheck({
                checkboxClass: 'iradio_square-green', //icheckbox_square-green
                radioClass: 'iradio_square-green',
            }).on('ifChanged', function () {
                const bool = ovariables.selectmail.filter(x => x.IdGraph === $(this).data('id')).length;
                if (bool === 0) {
                    //const IdHidden = { IdGraph: $(this).data('id') };
                    const mail = ovariables.lsthistory.filter(x => x.id === $(this).data('id'))[0];
                    const json = fn_graphjson(mail);
                    ovariables.selectmail.push(json);
                } else {
                    const filter = ovariables.selectmail.filter(x => x.IdGraph !== $(this).data('id'));
                    ovariables.selectmail = filter;
                }
            });
        }

        function fn_view(elem) {
            const id = elem.getAttribute("data-id");
            if (_isnotEmpty(id)) {
                if (ovariables.lsthistory.length > 0) {
                    const f = ovariables.lsthistory.filter(x => x.id === id).length > 0 ? ovariables.lsthistory.filter(x => x.id === id)[0] : [];
                    const json = fn_graphjson(f);
                    fn_create_view(json);
                }
            }
        }

        function fn_create_view(data) {
            const div = _('mail_body');
            div.innerHTML = '';
            if (!_oisEmpty(data)) {
                const html = `<div class="mail-header-content" style="background: inherit !important;">
                                <div class="small text-muted">
                                    <i class="fa fa-clock-o"></i> ${moment(new Date(data.FechaEnvio)).format('dddd, d MMMM YYYY, HH:mma')}
                                </div>
                                <h1>${data.Titulo}</h1>
                            </div>
                            <div class="mail-body-content">
                                <div class="iframe_body_container">${data.Contenido}</div>
                            </div>`;
                div.innerHTML = html;
                // Replace css for not affect main css
                $('.iframe_body_container style').html(`.iframe_body_container th, td {padding:5px}`);
            }
        }

        function fn_enter(e) {
            if (e.keyCode == 13) {
                fn_search();
            }
        }

        function fn_search() {
            const text = _('txtMailboxSearch').value;
            if (text !== '') {
                fn_graph_uri(`https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=15&$search="subject:${text}"`, true);
            } else {
                req_ini();
            }
        }

        function fn_add() {
            if (ovariables.selectmail.length > 0) {
                swal({
                    html: true,
                    title: "Are you sure?",
                    text: "You will link the selected emails",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#1c84c6",
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancelar",
                    closeOnConfirm: false
                }, function () {
                    let err = function (__err) { console.log('err', __err) }, frm = new FormData();
                    let parametro = {
                        IdRequerimiento: ovariables.id,
                        JSONInfo: ovariables.selectmail
                    };
                    frm.append('par', JSON.stringify(parametro));
                    _Post('Mailbox/Inbox/Insert_Mail', frm, true)
                        .then((resultado) => {
                            const orpta = resultado !== '' ? JSON.parse(resultado) : null;
                            if (orpta.estado === 'success') {
                                $("#modal__SelectMail").modal("hide");
                                swal({ title: "Good job!", text: "The emails was linked successfully", type: "success", timer: 5000 });
                            } else {
                                swal({ title: "There was a problem", text: "Please, contact the TIC administrator", type: "error" });
                            }
                        }, (p) => { err(p); });
                });
            } else {
                swal({ title: "Warning", text: "You have to select at least 1 row", type: "warning", timer: 5000 });
            }
        }

        function fn_infinite_scroll(e) {
            const elem = e.target;
            if (ovariables.nextlink !== '') {
                if (elem.scrollTop + elem.clientHeight >= elem.scrollHeight) {
                    // Validate scroll false
                    if (!ovariables.loading) {
                        // Init loader
                        ovariables.loading = true;
                        fn_add_loader();

                        // Call endpoint
                        fn_graph_uri(ovariables.nextlink);
                    }
                }
            }
        }

        function fn_add_loader() {
            const loader = _('mailbox_loader');
            if (loader !== null) {
                loader.remove();
            } else {
                const html = `<div class="feed-element" id="mailbox_loader">
                                   <div class="sk-spinner sk-spinner-three-bounce">
                                        <div class="sk-bounce1"></div>
                                        <div class="sk-bounce2"></div>
                                        <div class="sk-bounce3"></div>
                                    </div>
                               </div>`;
                _('mail_header').insertAdjacentHTML('beforeend', html);
            }
        }

        function fn_graphjson(data) {
            let obj = {};
            if (!_oisEmpty(data)) {
                obj["IdGraph"] = data.id;
                obj["NombreUsuario"] = data.sender !== undefined ? data.sender.emailAddress.name : '';
                obj["CorreoUsuario"] = data.sender !== undefined ? data.sender.emailAddress.address : '';
                obj["Titulo"] = data.subject;
                obj["Resumen"] = data.bodyPreview;
                obj["Contenido"] = data.body.content;
                obj["Para"] = data.toRecipients.map(x => {
                                    return x.emailAddress.address
                                }).join(";");
                obj["Copia"] = data.ccRecipients.map(x => {
                                    return x.emailAddress.address
                                }).join(";");
                obj["CopiaOculta"] = data.bccRecipients.map(x => {
                                        return x.emailAddress.address
                                    }).join(";");
                obj["FechaEnvio"] = data.sentDateTime;
                obj["FechaRecibido"] = data.receivedDateTime;
                obj["Archivos"] = data.hasAttachments === true ? 1 : 0;
            }
            return obj;
        }

        function _fetch(url, method, loader = false, token = '') {
            loader === true ? _showSpinner() : null;

            const headers = new Headers({
                "Content-Type": "application/json, text/plain, */*",
                "Accept": "application/json, text/plain, */*"
                //"Authorization": `Bearer ${token}`
            });

            token !== '' ? headers.append("Authorization", `Bearer ${token}`) : null;

            const init = {
                method: method,
                headers: headers,
                mode: 'cors',
                cache: 'default'
            };
            return fetch(url, init)
                .then(response => {
                    if (response.ok) {
                        _hideSpinner();
                        return response.json();
                    } else {
                        _hideSpinner();
                        swal({ title: "Error!", text: "You have to Sign In", type: "error" });
                        throw Error(response.statusText);
                    }
                });
        }

        return {
            load: load,
            req_ini: req_ini,
            ovariables: ovariables,
            fn_view: fn_view,
            fn_graphjson: fn_graphjson
        }
    }
)(document, 'panelEncabezado_Mail');
(
    function ini() {
        app_Mailbox.load();
        app_Mailbox.req_ini();
    }
)();