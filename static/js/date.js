
(function ($) {
    "use strict";

    window.api.receive("fromMain", (data) => {
        var d = data['contents'][0]['values'][0]
        var id = d[0]
        var change_data = JSON.parse(d[10])

        var temp = -1
        Object.keys(change_data).sort().forEach(key => {

            var column11 = ""
            if (temp != -1){
                var change_value = change_data[key][1] - temp
                if (change_value > 0){
                    column11 = "⬆"
                } else if(change_value < 0){
                    column11 = "⬇"
                }
            }
            $("tbody").append('<tr>' +
                '<td class="column1">' + key + '</td>' +
                '<td>' + change_data[key][0] + '</td>' +
                '<td>' + change_data[key][1] + '</td>' +
                '<td>' + column11 + '</td>' +
                '</tr>');
            
            temp = change_data[key][1]
        })

        $('#button').click(function(){
            window.api.send("toMain", { 'type': 'href', 'target': 'index.html'});
        })
    });

var id = getQueryString('id')
window.api.send("toMain", { 'type': 'date', 'id': id });


function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
}

}) (jQuery);