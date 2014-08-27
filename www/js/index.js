/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var map;
var marker;
var watchID;

$(document).ready(function() {
    //document.addEventListener("deviceready", onDeviceReady, false);
    //uncomment for testing in Chrome browser
    //onDeviceReady();
    var db = new DBService(true);
    db.initialize();
    db.syncEphemerisDB();
    
    $('#currentDate').html(new Date());     
});


// Method to open the About dialog
function refresh() {
    
    var currentDate = new Date();
    var currentDateToSecond = currentDate.getHours()*3600+ currentDate.getMinutes()*60+currentDate.getSeconds();
    
    $('#currentDate').html(currentDate);
    
    var currentDay = currentDate.getDay();
    
    var db = new DBService();
    db.updateShephirahOfTheDay(currentDay+1);
    
    
    var sunrise = "06:24";    
    var hour1 = parseInt(sunrise.substring(0,2));
    var minute1 = parseInt(sunrise.substring(3,5));
    var sunriseToSecond = (hour1*60+minute1)*60;
    
    var sunset = "20:57";
    var hour2 = parseInt(sunset.substring(0,2));
    var minute2 = parseInt(sunset.substring(3,5));
    
    var dayStepInSecondes = ((hour2*60+minute2) - (hour1*60+minute1))*60/12;    
    var nightStepInSecondes = 7200 - dayStepInSecondes;
    
    var hoursRulers = new Array("Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon",
    "Jupiter","Mars","Sun","Venus","Mercury","Moon"); 
    
    var daysIndexes = new Array(3,6,2,5,1,4,0);
    var startIndex = daysIndexes[currentDay];
    
    var start = sunriseToSecond;
    var end = start;
    var currentLineStyle = "";
    $('#dayTableContent').html("");
    for(var i=0;i<12;i++){
        end +=dayStepInSecondes;
        
        if(currentDateToSecond>start && currentDateToSecond<end){
            currentLineStyle = "style=\"background-color:#FF0000; color:#FFFFFF;\"";
        }else {
            currentLineStyle ="";
        }
        
        var sH = Math.floor(start/3600);
        var sM = Math.floor((start/3600 - sH)*60);

        var eH = Math.floor(end/3600);
        var eM = Math.floor((end/3600 - eH)*60);

        var row = '<tr '+currentLineStyle+'>'+
                    '<td>'+sH+':'+sM+'</td>'+
                    '<td>'+eH+':'+eM+'</td>'+
                    '<td>'+hoursRulers[startIndex + i%6]+'</td>'+
                  '</tr>';
        $('#dayTableContent').append(row);
        start=end;  
    }
    //var nightStep =;
    

    //$('#currentDate').html(currentDate);
    
    
};



function onDeviceReady() {
    $(window).unbind();
    $(window).bind('pageshow resize orientationchange', function(e) {
        max_height();
    });
    max_height();
    google.load("maps", "3.8", {"callback": map, other_params: "sensor=true&language=en"});
}

function max_height() {
    var h = $('div[data-role="header"]').outerHeight(true);
    var f = $('div[data-role="footer"]').outerHeight(true);
    var w = $(window).height();
    var c = $('div[data-role="content"]');
    var c_h = c.height();
    var c_oh = c.outerHeight(true);
    var c_new = w - h - f - c_oh + c_h;
    var total = h + f + c_oh;
    if (c_h < c.get(0).scrollHeight) {
        c.height(c.get(0).scrollHeight);
    } else {
        c.height(c_new);
    }
}

function map() {
    var latlng = new google.maps.LatLng(50.08, 14.42);
    var myOptions = {
        zoom: 15,
        center: latlng,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);

    google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        watchID = navigator.geolocation.watchPosition(gotPosition, null, {maximumAge: 5000, timeout: 60000, enableHighAccuracy: true});
    });
}

// Method to open the About dialog
function showAbout() {
    showAlert("Google Maps", "Created with NetBeans 7.4");
}
;

function showAlert(message, title) {
    if (window.navigator.notification) {
        window.navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}

function gotPosition(position) {
    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    if (!marker) {
        //create marker
        marker = new google.maps.Marker({
            position: point,
            map: map
        });
    } else {
        //move marker to new position
        marker.setPosition(point);
    }
}