var app_Inbox = (
    function (d, idpadre) {
        var ovariables = {
            id: 0,
            accion: '',
            lsthistory: [],
            lstemails: [],
            nextlink: '',
            loading: false,
            accessToken: ''
        }

        function load() {
            // Collapse Menu
            _collapseMenu();

            // Events
            _('div_scroll_maillist').addEventListener('scroll', fn_infinite_scroll);
            _('btnInboxSearch').addEventListener('click', fn_search);
            _('txtInboxSearch').addEventListener('keypress', fn_enter);
            _('btnInboxRefresh').addEventListener('click', fn_refresh);

            // Se obtiene parametro si tuviera
            const par = _('txtpar_inbox').value;
            if (!_isEmpty(par)) {
                ovariables.id = _par(par, 'id') !== '' ? _parseInt(_par(par, 'id')) : 0;
                ovariables.accion = _par(par, 'accion');
            }

            // Check if is login
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken !== null) {
                ovariables.accessToken = accessToken;
            }

            // Add slimscroll to element
            $('.full-height-scroll').slimscroll({
                height: '700px'
            });
        }

        function fn_refresh() {
            load();
            req_ini();
        }

        function fn_clear() {
            ovariables.lsthistory = [];
            ovariables.lstemails = [];
            ovariables.nextlink = '';

            _('div_head_inbox').innerHTML = '';
            _('div_body_inbox').innerHTML = '';
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
            const div = _('div_head_inbox');
            if (data.length > 0) {
                const html = data.map(x => {
                    return `<li class="list-group-item" data-id="${x.id}" onclick="app_Inbox.fn_view(this)">
                                <a data-toggle="tab" href="#">
                                    <small class="pull-right text-muted"> ${_getDate101(x.sentDateTime)}</small>
                                    <strong>${x.sender !== undefined ? x.sender.emailAddress.name : ''}</strong>
                                    <div class="small m-t-xs">
                                        <p class="text-primary">${x.subject}</p>
                                    </div>
                                    <div class="small m-t-xs">
                                        <p class="text-muted">${_truncateWithEllipses(x.bodyPreview, 50)}</p>
                                    </div>
                                </a>
                            </li>`;
                }).join('');
                div.insertAdjacentHTML('beforeend', html);
            }
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
            const div = _('div_body_inbox');
            div.innerHTML = '';
            if (!_oisEmpty(data)) {
                let attachments = '';
                div.setAttribute("data-id", data.id);
                // If has files -- PARA MOSTRAR ARCHIVOS ADJUNTOS A CORREO SE HACE OTRO REQUEST - NO BORRAR
                //if (data[0].hasAttachments) {
                //    // Init loader
                //    _showSpinner();
                //    // Fetch to retrive files
                //    _fetch(`https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages/${data[0].id}/attachments`, 'GET', false, ovariables.accessToken)
                //        .then(res => {
                //            const files = res.value;

                //            const total_files = files.length;
                //            const array_files = files.map(x => {
                //                return `<div class="file-box">
                //                            <div class="file">
                //                                <a href="#">
                //                                    <span class="corner"></span>
                //                                    <div class="icon">
                //                                        <i class="fa fa-file"></i>
                //                                    </div>
                //                                    <div class="file-name">
                //                                        ${x.name}
                //                                        <br>
                //                                        <small>Added: ${moment(new Date(x.lastModifiedDateTime)).format('MMMM d, YYYY')}</small>
                //                                    </div>
                //                                </a>
                //                            </div>
                //                        </div>`
                //            }).join('');

                //            attachments = `<div class="m-t-lg">
                //                                <p>
                //                                    <span><i class="fa fa-paperclip"></i> ${total_files} attachments - </span>
                //                                    <a href="#">Download all</a>
                //                                </p>
                //                                <div class="attachment">
                //                                    ${array_files}
                //                                    <div class="clearfix"></div>
                //                                </div>
                //                            </div>`

                //            // Fill div
                //            div.innerHTML = `<div class="pull-right">
                //                                <div class="tooltip-demo">
                //                                    <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_link(this)">
                //                                        <i class="fa fa-link"></i> Link it
                //                                    </button>
                //                                    <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_unlink(this)">
                //                                        <i class="fa fa-unlink"></i> Unlink it
                //                                    </button>
                //                                    <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_reply(this)">
                //                                        <i class="fa fa-mail-reply"></i>
                //                                    </button>
                //                                    <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_reply_all(this)">
                //                                        <i class="fa fa-mail-reply-all"></i>
                //                                    </button>
                //                                </div>
                //                            </div>
                //                            <div class="small text-muted">
                //                                <i class="fa fa-clock-o"></i> ${moment(new Date(data.sentDateTime)).format('dddd, d MMMM YYYY, HH:mma')}
                //                            </div>
                //                            <h1>${data.subject}</h1>
                //                            <div class="iframe_body_container">${data.body.content}</div>
                //                            ${attachments}`;

                //            // Delete css for not affect main css
                //            //const style = $('.iframe_body_container style').html();
                //            $('.iframe_body_container style').html(`.iframe_body_container th, td {padding:5px}`);

                //            // End Spinner
                //            _hideSpinner();
                //        });
                //} else {
                //    // Fill div
                //    div.innerHTML = `<div class="pull-right">
                //                        <div class="tooltip-demo">
                //                            <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_link(this)">
                //                                <i class="fa fa-link"></i> Link it
                //                            </button>
                //                            <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_unlink(this)">
                //                                <i class="fa fa-unlink"></i> Unlink it
                //                            </button>
                //                            <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_reply(this)">
                //                                <i class="fa fa-mail-reply"></i>
                //                            </button>
                //                            <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_reply_all(this)">
                //                                <i class="fa fa-mail-reply-all"></i>
                //                            </button>
                //                        </div>
                //                    </div>
                //                    <div class="small text-muted">
                //                        <i class="fa fa-clock-o"></i> ${moment(new Date(data.FechaEnvio)).format('dddd, d MMMM YYYY, HH:mma')}
                //                    </div>
                //                    <h1>${data.Titulo}</h1>
                //                    <div class="iframe_body_container">${data.Contenido}</div>
                //                    ${attachments}`;
                //}

                //div.innerHTML = `<div class="pull-right">
                //                    <div class="tooltip-demo">
                //                        <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_link(this)">
                //                            <i class="fa fa-link"></i> Link it
                //                        </button>
                //                        <button class="btn btn-white btn-xs" onclick="app_Inbox.fn_unlink(this)">
                //                            <i class="fa fa-unlink"></i> Unlink it
                //                        </button>
                //                    </div>
                //                </div>
                //                <div class="small text-muted">
                //                    <i class="fa fa-clock-o"></i> ${moment(new Date(data.FechaEnvio)).format('dddd, d MMMM YYYY, HH:mma')}
                //                </div>
                //                <h1>${data.Titulo}</h1>
                //                <div class="iframe_body_container">${data.Contenido}</div>
                //                ${attachments}`;

                div.innerHTML = `<div class="small text-muted">
                                    <i class="fa fa-clock-o"></i> ${moment(new Date(data.FechaEnvio)).format('dddd, d MMMM YYYY, HH:mma')}
                                </div>
                                <h1>${data.Titulo}</h1>
                                <div class="iframe_body_container">${data.Contenido}</div>
                                ${attachments}`;

                // Delete css for not affect main css
                //const style = $('.iframe_body_container style').html();
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
            const text = _('txtInboxSearch').value;
            if (text !== '') {
                fn_graph_uri(`https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$top=15&$search="subject:${text}"`, true);
            } else {
                req_ini();
            }
        }

        function fn_link(button) {
            console.log(button);
        }

        function fn_unlink(button) {
            console.log(button);
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
                const html = `<li class="list-group-item" id="mailbox_loader">
                                   <div class="sk-spinner sk-spinner-three-bounce">
                                        <div class="sk-bounce1"></div>
                                        <div class="sk-bounce2"></div>
                                        <div class="sk-bounce3"></div>
                                    </div>
                               </li>`;
                _('div_head_inbox').insertAdjacentHTML('beforeend', html);
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
            fn_link: fn_link,
            fn_unlink: fn_unlink,
            _fetch: _fetch
        }
    }
)(document, 'panelEncabezado_Inbox');
(
    function ini() {
        app_Inbox.load();
        app_Inbox.req_ini();
    }
)();