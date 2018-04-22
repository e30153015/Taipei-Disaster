'use strict';

var dataUrl = 'https://tcgbusfs.blob.core.windows.net/blobfs/GetDisasterSummary.json';
var app;
var map;

var innerHeight = window.innerHeight;
var zoneData = [];
var zoneDataList = '';
var jsonData = [];
var filerData = [];

// 第一次載入地圖
var initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.050592, lng: 121.539384 },
        zoom: 12
    });
};
// 重新載入地圖
var reInitMap = function reInitMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseFloat(filerData[0].Wgs84Y), lng: parseFloat(filerData[0].Wgs84X) },
        zoom: 14
    });
};
// 重新載入地圖標記
var initMarker = function initMarker() {
    for (var i = 0; i < filerData.length; i++) {
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(filerData[i].Wgs84Y), lng: parseFloat(filerData[i].Wgs84X) },
            map: map,
            title: filerData[i].Name
        });
    }
};
// 載入網頁時預先加載一次地圖
initMap();

// 申請API資料
var xhr = new XMLHttpRequest();
xhr.open('GET', dataUrl, true);
xhr.send(null);

xhr.onload = function () {
    //載入資料至jsonData
    jsonData = JSON.parse(xhr.responseText).DataSet['diffgr:diffgram'].NewDataSet.CASE_SUMMARY;
    filerData = jsonData;

    

    // 載入不重複行政區名單
    for (var i = 0; i < jsonData.length; i++) {
        var j = zoneData.indexOf(jsonData[i].CaseLocationDistrict);
        if (j === -1) {
            zoneData.push(jsonData[i].CaseLocationDistrict);
        }
    };

    // Vue.js
    app = new Vue({
        el: '#app',
        data: {
            originData: jsonData,
            filer: filerData,
            selectorZone: zoneData,
            dataToggle: false
        },
        methods: {
            // 選擇區域後篩選資料
            zoneDataInput: function zoneDataInput(zoneValue) {
                this.filer = [];
                this.dataToggle = true;
                for (var i = 0; i < jsonData.length; i++) {
                    if (jsonData[i].CaseLocationDistrict == zoneValue) {
                        this.filer.push(jsonData[i]);
                    }
                }
                filerData = this.filer;
                console.log(filerData);
                reInitMap();
                initMarker();
            }
        }
    });
};

// jQuery
$(document).ready(function () {
    // header自適應使用者螢幕高度
    $('#header').css('height', innerHeight);
    $('#header h1').css('padding-top', innerHeight / 3 - 25);
});
//# sourceMappingURL=all.js.map
