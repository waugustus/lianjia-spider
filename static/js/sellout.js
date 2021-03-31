
(function ($) {
    "use strict";

    let host = "";

    window.api.receive("fromMain", (data) => {

        host = data['host'];

        data['contents'][0]['values'].sort(function(a,b){
            return a[10] - b[10]
        }).forEach(d => {
            $("tbody").append(getItem(d));
        });

        $('tbody').delegate('tr', 'click', function () {
            var id = $(this).children(':first-child').text()

            window.api.send("toMain", { 'type': 'href', 'target': 'date.html', 'id': id});

        })

        $('#button').click(function(){
            window.api.send("toMain", { 'type': 'href', 'target': 'index.html'});
        })
    });

    window.api.send("toMain", { 'type': 'sellout' });


    function getItem(d) {
        var change_data = JSON.parse(d[10])
        var keys = Object.keys(change_data)
        if (keys.length > 1) {
            var new_keys = keys.sort()
            if (change_data[new_keys[new_keys.length - 1]][0] - change_data[new_keys[new_keys.length - 2]][0] > 0) {
                column11 = "<span><i class=\"fas fa-angle-double-up\"></i></span>"
            } else if (change_data[new_keys[new_keys.length - 1]][0] - change_data[new_keys[new_keys.length - 2]][0] < 0) {
                column11 = "<span><i class=\"fas fa-angle-double-down\"></i></span>"
            }
        }

        return '<tr>' + 
        '<td>' + '<a href="' + host + '/ershoufang/' + d[0] + '.html" target="_blank">' + d[0] + '</td>' +
            '<td>' + d[1] + '</td>' +
            '<td>' + d[2] + '</td>' +
            '<td>' + d[3] + '</td>' +
            '<td>' + d[4] + '</td>' +
            '<td>' + d[5] + '</td>' +
            '<td>' + d[6] + '</td>' +
            '<td>' + d[7] + '</td>' +
            '<td>' + d[8] + '</td>' +
            '<td>' + d[9] + '</td>' +
            '<td>' + d[11] + '</td>' +
            '</tr>';
    }


})(jQuery);