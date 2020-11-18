/// <reference path="../../Home/Util.js" />

var oVariables = {
    accion: '',
    strUserValid: ''
}

function load()
{
/*
    _('btnNew').addEventListener('click', showForm);
    _('btnReturn').addEventListener('click', returnForm);
    _('btnProcess').addEventListener('click', procesarInc);
    _('btnTerminar').addEventListener('click', terminarInc);

    $(".select2_Personal").select2({ placeholder: "Select Personal", allowClear: false });
    $(".select2_Categoria").select2({ placeholder: "Select Cargo", allowClear: false });


    $('#div_FechaInicio .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });
    $('#div_FechaTermino .input-group.date').datepicker({ autoclose: true, dateFormat: 'mm/dd/yyyy' });


    hideForm();
    validarUser()
    $('.footable').footable();
    $('.footable').trigger('footable_resize');*/
}

function validarUser()
{
    if (oVariables.strUserValid == "OK")
    {
        $('#usuario').show();
    }
    else
    {
        $('#usuario').hide();
    }
    
}

function validUser() {

    let url = "TecnologiaInformacion/TIC/valid_SaveUser",
    frm = new FormData();

    _Post(url,frm).then(function (value) {
        return value;
    }, function (reason) {
        console.log("error 1 ", reason);
    }).then(function (sdata) {
        strUserValid = sdata;        
    });
}


function terminarInc()
{
    $('#Cont_FechaTermino').show();
    _("div_FechaTermino").value = "";
}

function procesarInc()
{
    $('#Cont_FechaTermino').hide();
}

function hideForm()
{
    $('#formMante').hide();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnReturn').hide();
    $('#btnExport').show();
    $('#btnPrint').show();

}

function showForm()
{

    $('#formMante').show();
    $('#formList').hide();
    $('#btnNew').hide();
    $('#btnSave').show();
    $('#btnReturn').show();
    $('#btnExport').hide();
    $('#btnPrint').hide();

    $('#Cont_FechaTermino').hide();
}

function returnForm()
{

    $('#formMante').hide();
    $('#formList').show();
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnReturn').hide();
    $('#btnExport').show();
    $('#btnPrint').show();
}



function res_ini(respuesta) {
    /*
    if (respuesta != null && respuesta != '') {
        _('cbo_cliente').innerHTML = _comboItem({ value: '0', text: '--All--' }) + _comboFromCSV(respuesta);
    }*/
}

function req_ini() {
    /*let urlaccion = 'Facturas/FacturaCliente/getData_Index';
    Get(urlaccion, res_ini);*/
}



(function ini() {
    load();
    req_ini();
}
)();
