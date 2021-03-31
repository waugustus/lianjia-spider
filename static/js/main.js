
(function ($) {
    "use strict";

    let host = "";

    window.api.receive("fromMain", (data) => {

        host = data['host'];

        data['contents'][0]['values'].forEach(d => {

            $("tbody").append(getItem(d));

        });

        var column9_click_num = 0
        $('th.column9').click(function () {
            // 递增
            if (column9_click_num == 0) {
                $("tbody").empty()
                data['contents'][0]['values'].sort(function (a, b) {
                    return a[8].substr(0, a[8].length - 1) - b[8].substr(0, b[8].length - 1)
                }).forEach(d => {
                    $("tbody").append(getItem(d));
                })
                column9_click_num = 1
            } else {
                //递减
                $("tbody").empty()
                data['contents'][0]['values'].sort(function (a, b) {
                    return b[8].substr(0, b[8].length - 1) - a[8].substr(0, a[8].length - 1)
                }).forEach(d => {
                    $("tbody").append(getItem(d));
                })
                column9_click_num = 0
            }
        })

        var column10_click_num = 0
        $('th.column10').click(function () {
            $("tbody").empty()
            data['contents'][0]['values'].sort(function (a, b) {
                return a[9] - b[9]
            }).forEach(d => {
                $("tbody").append(getItem(d));
            })

            // 递增
            if (column10_click_num == 0) {
                $("tbody").empty()
                data['contents'][0]['values'].sort(function (a, b) {
                    return a[9] - b[9]
                }).forEach(d => {
                    $("tbody").append(getItem(d));
                })
                column10_click_num = 1
            } else {
                //递减
                $("tbody").empty()
                data['contents'][0]['values'].sort(function (a, b) {
                    return b[9] - a[9]
                }).forEach(d => {
                    $("tbody").append(getItem(d));
                })
                column10_click_num = 0
            }
        })

        $('tbody').delegate('tr', 'click', function () {
            var id = $(this).children(':first-child').text()

            window.api.send("toMain", { 'type': 'href', 'target': 'date.html', 'id': id});

        })

        $('#button1').click(function(){
            window.api.send("toMain", { 'type': 'python'});
            alert("抓取数据中")
        })
        
        $('#button2').click(function(){
            window.api.send("toMain", { 'type': 'href', 'target': 'sellout.html'});
        })
    });

    window.api.send("toMain", { 'type': 'index' });


    function getItem(d) {
        var change_data = JSON.parse(d[10])
        var keys = Object.keys(change_data)
        var column11 = ""
        if (keys.length > 1) {
            var new_keys = keys.sort()
            var change_value = change_data[new_keys[new_keys.length - 1]][0].substr(0, change_data[new_keys[new_keys.length - 1]][0].length - 1) - change_data[new_keys[new_keys.length - 2]][0].substr(0, change_data[new_keys[new_keys.length - 2]][0].length - 1)
            if (change_value > 0) {
                column11 = "⬆"
            } else if (change_value < 0) {
                column11 = "⬇"
            }
        } else {
            column11 = "NEW"
        }

        return '<tr>' + 
            '<td>' + '<a href=' + host + '"/ershoufang/' + d[0] + '.html" target="_blank">' + d[0] + '</a>' + '</td>' +
            '<td>' + d[1] + '</td>' +
            '<td>' + d[2] + '</td>' +
            '<td>' + d[3] + '</td>' +
            '<td>' + d[4] + '</td>' +
            '<td>' + d[5] + '</td>' +
            '<td>' + d[6] + '</td>' +
            '<td>' + d[7] + '</td>' +
            '<td>' + d[8] + '</td>' +
            '<td>' + d[9] + '</td>' +
            '<td>' + column11 + '</td>' +
            '</tr>';
    }


})(jQuery);