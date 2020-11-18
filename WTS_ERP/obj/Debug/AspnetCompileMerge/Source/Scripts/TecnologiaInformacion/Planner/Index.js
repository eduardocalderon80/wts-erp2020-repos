var appPlannerIndex = (
    function (d, idpadre) {
        
        function load() {
            // Events
        }

        _('fuArchivo').addEventListener('change', (e) => {
            let archivo = e.target.value;
            let ultimopunto = archivo.lastIndexOf(".");
            let ext = archivo.substring(ultimopunto + 1);
            let nombre = e.target.files[0].name;
            ext = ext.toLowerCase();
            switch (ext) {
                case 'xlsx':
                    btnUpload.click();
                    break;
                default:
                    this.value = '';
                    _mensaje({ titulo: 'Mensaje', estado: 'error', mensaje: 'Solo puede subir archivo Excel (xlsx).' });
            }
        });

        _('btnUpload').addEventListener('click', (e) => {
            const urlUpload = "TecnologiaInformacion/Planner/Upload_Programacion";
            const fupArchivo = _("fuArchivo");
            const file = fupArchivo.files[0];
            const data = file.name.split(".");
            const n = data.length;
            const frm = new FormData();

            if (n > 1) {
                _('txtruta').value = file.name;
                frm.append("archivo", file);

                _Post(urlUpload, frm,true)
                    .then(resultado => {
                        const oRespuesta = JSON.parse(resultado);
                        const dataCSV = TransformarData(oRespuesta.data);
                        const dataCSVDetalle = TransformarDataDetalle(oRespuesta.data);
                        return { dataCSV: dataCSV, dataCSVDetalle: dataCSVDetalle};
                    })
                    .then(oData => {
                        const frmCSV = new FormData();
                        frmCSV.append("dataCSV", oData.dataCSV);
                        frmCSV.append("dataCSVDetalle", oData.dataCSVDetalle);

                        const url = "TecnologiaInformacion/Planner/TransformarData_ProgramacionExcel";
                            _Post(url, frmCSV)
                            .then(resultado => {
                                    const oResultado = JSON.parse(resultado);
                                    const nameFile = oResultado.nameFile;
                                    const path = oResultado.path;
                                    getExcel(path, nameFile);
                                })
                    })
                    .catch(error => file_clear())
            }
        });

        function isJSON(str) {
            try {
                return (JSON.parse(str) && !!str);
            } catch (e) {
                return false;
            }
        } 


        function TransformarData(data) {
            const adata = CSVtoJSON(data);

            const adataJsonfilter = adata.filter(x => typeof x["Descripción"] !== "undefined");
            const oFields = { elementosTareasCompletadas: 'Elementos de la lista de comprobación completados', Descripcion: 'Descripción', NombreTarea: 'Nombre de la tarea', Fase:'Nombre del depósito' }
            const oDefault = { Grupo: 0, Area: 'None', Tipo: 'None', Requerimiento: 'None' };

            const adataJson = adataJsonfilter.map(x => {
                oDefault.Requerimiento = x[oFields.NombreTarea];

                const obj = isJSON(x[oFields.Descripcion]) ? JSON.parse(x[oFields.Descripcion]) : oDefault;
                const [_realizadas, _totalTarea] = x[oFields.elementosTareasCompletadas].trim().split('/');                
                const realizadas = !_isEmpty(_realizadas) ? _parseInt(_realizadas) : 0;
                const totalTarea = !_isEmpty(_totalTarea) ? _parseInt(_totalTarea) : 0;
                const existeTarea = (!_isEmpty(_realizadas) && !_isEmpty(_totalTarea));
                const porcentaje = existeTarea ? ` ${((realizadas / totalTarea) * 100).toFixed(0)}%` : '0.0%';
                const fase = x[oFields.Fase].trim();
                
                return ({
                    Grupo: obj.Grupo,
                    Area: obj["Area"].trim(),
                    Tipo: obj["Tipo"].trim(),
                    Requerimiento: obj["Requerimiento"].trim(),
                    Fase:fase,
                    FechaCreacion: x["Fecha de creación"].trim(),
                    FechaInicio: x["Fecha de inicio"].trim(),
                    FechaVencimiento: x["Fecha de vencimiento"].trim(),
                    Realizadas: realizadas,
                    TotalTarea: totalTarea,
                    Porcentaje: porcentaje
                })
            })

            const dataJsonSort = adataJson.sort(SortPlanner("Grupo"));
            const dataCSV = JSONtoCSV(dataJsonSort);
            return dataCSV;
        }

        function TransformarDataDetalle(data) {
            const adata = CSVtoJSON(data);

            const adataJsonfilter = adata.filter(x => typeof x["Descripción"] !== "undefined");
            const oFields = { elementosTareasComprobacion: 'Elementos de la lista de comprobación', Descripcion: 'Descripción', Asignado: 'Asignado a', NombreTarea: 'Nombre de la tarea', Fase: 'Nombre del depósito' };
            const oDefault = { Grupo: 0, Area: 'None', Tipo: 'None', Requerimiento: 'None' };
            let adataJson = [];

            adataJsonfilter.forEach(x => {
                oDefault.Requerimiento = x[oFields.NombreTarea];

                const obj = isJSON(x[oFields.Descripcion]) ? JSON.parse(x[oFields.Descripcion]) : oDefault;
                const atareas = !_isEmpty(x[oFields.elementosTareasComprobacion]) ? x[oFields.elementosTareasComprobacion].split(';') : [];
                const asignado = !_isEmpty(x[oFields.Asignado]) ? x[oFields.Asignado] : '';

                atareas.forEach(tarea => {
                    const existeTarea = !_isEmpty(tarea);
                    const inicioHora = existeTarea && tarea.indexOf("{") >= 0 ? tarea.indexOf("{") : -1;
                    const FinHora = existeTarea && tarea.indexOf("]") >= 0 ? tarea.indexOf("]") : -1;
                    const existeHora = (inicioHora >= 0 && FinHora >= 0);
                    const HoraCadena = existeTarea && existeHora ? tarea.substring(inicioHora, FinHora) : '';
                    const oTarea = !_isEmpty(HoraCadena) && isJSON(HoraCadena) ? JSON.parse(HoraCadena.toLowerCase()) : {hora:0};                    
                    const itemTarea = existeTarea ? (existeHora ? tarea.substring(0, inicioHora - 1) : tarea) : '';
                    const fase = x[oFields.Fase].trim();

                    adataJson.push({
                        Grupo: obj.Grupo,
                        Area: obj["Area"].trim(),
                        Tipo: obj["Tipo"].trim(),
                        Requerimiento: obj["Requerimiento"].trim(),
                        Fase: fase,
                        Asignado: asignado,
                        Tarea: itemTarea,
                        Hora: oTarea.hora
                    })

                })
            })

            const dataJsonSort = adataJson.sort(SortPlanner("Grupo"));
            console.table(dataJsonSort);
            const dataCSV = JSONtoCSV(dataJsonSort);
            return dataCSV;
        }


        function SortPlanner(property) {
            return function (x, y) {
                return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
            };
        }

        function JSONtoCSV(json) {
            const estadoJSON = (json !== null && typeof json !== "undefined");
            if (estadoJSON) {
                const keys = Object.keys(json[0]).join('¬') + '^';
                const csv = json.map(x => {
                    return Object.values(x).join('¬');
                }).join('^');
                return keys + csv;
            }
            return "";
        }


        function getExcel(path, nameFile) {
            if (path !== "" && typeof path !== undefined) {
                let urlaccion = '../TecnologiaInformacion/Planner/DonwloadPlannerExcel?path=' + path + '&nameFile=' + nameFile;
                window.location.href = urlaccion;
            }
            file_clear();
        }

        function file_clear() {
            let _file = _('fuArchivo');
            _file.value = null;
        }


        return {
            load: load
        }
    }
)(document, 'panelEncabezado_PlannerIndex');
(
    function ini() {
        appPlannerIndex.load();        
    }
)();