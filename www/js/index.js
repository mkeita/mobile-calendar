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

document.addEventListener("deviceready", onDeviceReady, false);

jQuery(document).ready(function() {
    //document.addEventListener("deviceready", onDeviceReady, false);
    //uncomment for testing in Chrome browser
    //onDeviceReady();
        
});

function onDeviceReady() {
    
    superFunctionTest();
    
    var times = SunCalc.getTimes(new Date(),50.3,4);
    console.log(times);
    
    var db = new DBService(true);
    //db.initialize();
    
    jQuery('#currentDate').html(new Date());   

//    $(window).unbind();
//    $(window).bind('pageshow resize orientationchange', function(e) {
//        max_height();
//    });
//    max_height();
//    google.load("maps", "3.8", {"callback": map, other_params: "sensor=true&language=en"});
}


// Method to open the About dialog
function refresh() {
        
    var currentDate = new Date();
    var currentDateInMilliSecondes = currentDate.getTime();
    
    jQuery('#currentDate').html(currentDate);
    
    var currentDay = currentDate.getDay();
    
    var db = new DBService(false);
    db.updateShephirahOfTheDay(currentDay+1);
    
    //Get the day ephemeris
    var lat = 50.833;
    var lng = 4.333;

    var times = SunCalc.getTimes(currentDate, lat, lng);
    console.log(times);
    
    var sunrise = times.sunrise;        
    var sunset = times.sunset;
    
    var dayStepInMilliSecondes = (sunset.getTime()  - sunrise.getTime())/12;    
    var nightStepInMilliSecondes = 7200000 - dayStepInMilliSecondes;
    
    var hoursRulers = new Array("Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon",
    "Jupiter","Mars","Sun","Venus","Mercury","Moon"); 
    
    var daysIndexes = new Array(3,6,2,5,1,4,0);
    var startIndex = daysIndexes[currentDay];
    
    var start = sunrise.getTime();
    var end = start;
    var currentLineStyle = "";
    jQuery('#dayTableContent').html("");
    for(var i=0;i<12;i++){
        end +=dayStepInMilliSecondes;
        
        if(currentDateInMilliSecondes>start && currentDateInMilliSecondes<end){
            currentLineStyle = "style=\"background-color:#FF0000; color:#FFFFFF;\"";
        }else {
            currentLineStyle ="";
        }
        
        var sDate = new Date(start); 
        var sEnd = new Date(end); 

        var row = '<tr '+currentLineStyle+'>'+
                    '<td>'+sDate.getHours()+':'+sDate.getMinutes()+'</td>'+
                    '<td>'+sEnd.getHours()+':'+sEnd.getMinutes()+'</td>'+
                    '<td>'+hoursRulers[startIndex + i%6]+'</td>'+
                  '</tr>';
        jQuery('#dayTableContent').append(row);
        start=end;  
    }
    
    jQuery('#dayTableContent').append('<tr><td/><td/><td/><tr/>');
    
    var start = sunset.getTime();
    var end = start;
    for(var i=0;i<12;i++){
        end +=nightStepInMilliSecondes;
        
        if(currentDateInMilliSecondes>start && currentDateInMilliSecondes<end){
            currentLineStyle = "style=\"background-color:#FF0000; color:#FFFFFF;\"";
        }else {
            currentLineStyle ="";
        }
        
        var sDate = new Date(start); 
        var sEnd = new Date(end); 

        var row = '<tr '+currentLineStyle+'>'+
                    '<td>'+sDate.getHours()+':'+sDate.getMinutes()+'</td>'+
                    '<td>'+sEnd.getHours()+':'+sEnd.getMinutes()+'</td>'+
                    '<td>'+hoursRulers[startIndex + i%6]+'</td>'+
                  '</tr>';
        jQuery('#dayTableContent').append(row);
        start=end;  
    }
    
};

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