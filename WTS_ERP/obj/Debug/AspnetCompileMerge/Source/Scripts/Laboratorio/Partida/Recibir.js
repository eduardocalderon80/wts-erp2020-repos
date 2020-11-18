
$("#txtBarcode").focus();

$("#divContentBarCode").scannerDetection({
    timeBeforeScanTest: 200, // wait for the next character for upto 200ms
    avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
    preventDefault: true,
    onComplete: function (barcode, qty) {
        validScan = true;


        var barcodereplaced = barcode.replace("'", "-");
        $('#txtBarcode').val(barcodereplaced);

        //if (barcode.length == 10) {
        var codigo = barcodereplaced;
        var url = urlBase() + 'Laboratorio/Partida/RecibirPartida?par=' + codigo;

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json; charset = utf-8',
            dataType: 'json',
            async: true
        }).done(function (rpta) {

            if (rpta !== "") {

                var estado = rpta[0].Estado;
                
                if (estado === "0") {
                    alert("Partida ya ha sido recibida");
                } else if (estado === "-1") {
                    alert("Partida no existe");
                } else if (estado === "1") {

                    var Partidas = rpta;
                    var nPartidas = Partidas.length;

                    var html = "";

                    for (var i = 0; i < nPartidas; i++) {
                        html += "<tr>";
                        html += "<td>" + Partidas[i].Codigo + "</td>";
                        html += "<td>" + Partidas[i].ReporteTecnico + "</td>";
                        html += "<td>" + Partidas[i].Fabrica + "</td>";
                        html += "<td>" + Partidas[i].Cliente + "</td>";
                        html += "<td>" + Partidas[i].Status + "</td>";
                        html += "<td>" + Partidas[i].FechaRecibido + "</td>";
                        html += "</tr>";
                    }

                    $("#tbodyPartida").append(html);
                }
            }

            

        }).fail(function (data) {

        });



    },
    onError: function (string, qty) {

        $('#txtBarcode').val($('#txtBarcode').val() + string);
        //return true;
        //alert(string);
        //console.log('Error');
    }
});

function RetonarConsulta() {
    let url = 'Laboratorio/Partida/Consulta';
    _Go_Url(url, url, "");
}

function RecibirPartida() {

    var codigo = $("#txtBarcode").val();
    var url = urlBase() + 'Laboratorio/Partida/RecibirPartida?par=' + codigo;

    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'application/json; charset = utf-8',
        dataType: 'json',
        async: true
    }).done(function (rpta) {

        if (rpta !== "") {

            var estado = rpta[0].Estado;

            if (estado === "0") {
                alert("Partida ya ha sido recibida");
            } else if (estado === "-1") {
                alert("Partida no existe");
            } else if (estado === "1") {

                var Partidas = rpta;
                var nPartidas = Partidas.length;

                var html = "";

                for (var i = 0; i < nPartidas; i++) {
                    html += "<tr>";
                    html += "<td>" + Partidas[i].Codigo + "</td>";
                    html += "<td>" + Partidas[i].ReporteTecnico + "</td>";
                    html += "<td>" + Partidas[i].Fabrica + "</td>";
                    html += "<td>" + Partidas[i].Cliente + "</td>";
                    html += "<td>" + Partidas[i].Status + "</td>";
                    html += "<td>" + Partidas[i].FechaRecibido + "</td>";
                    html += "</tr>";
                }

                $("#tbodyPartida").append(html);
            }
        }

    }).fail(function (data) {

    });

}