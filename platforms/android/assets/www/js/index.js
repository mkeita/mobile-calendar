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

//var lat = 50.833;
//var lng = 4.333;
var lat = 4.333;
var lng = 44.333;

var datepicker;
var timepicker;
var currentDate = new Date();


document.addEventListener("deviceready", onDeviceReady, false);

jQuery(document).ready(function() {
    //document.addEventListener("deviceready", onDeviceReady, false);
    //uncomment for testing in Chrome browser
    onDeviceReady();
        
});

function goToInfluence(event){
    // Prevent the usual navigation behavior
        //event.preventDefault();
        // Get the filename of the next page. We stored that in the data-next
        // attribute in the original markup.
        jQuery.mobile.navigate("#influences");
}

function goToMainPage(event){
       // Prevent the usual navigation behavior
       //event.preventDefault();
       jQuery.mobile.navigate("#main_page");
}

function onDeviceReady() {
    
    jQuery('#main_page').on('swipeleft',goToInfluence);     
    jQuery('#influences').on('swiperight',goToMainPage);

    
    var db = new DBService(true);
   
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        refresh();
    }, function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    });
    
    jQuery('#datepicker').attr("data-value","-");
    jQuery('#timepicker').attr("data-value","-");
    
    var $dateInput = jQuery('#datepicker').pickadate({
        onSet: function(context) {
            var time = timepicker.get('select');
            var date = datepicker.get('select');
            
            currentDate = new Date(date.pick);
            currentDate.setHours(time.hour);
            currentDate.setMinutes(time.mins);
            refresh();
        }
    });
            
    datepicker = $dateInput.pickadate('picker');
        
    var $timeInput = jQuery('#timepicker').pickatime({
        format:'H:i',
        formatSubmit: 'H:i',
        onSet: function(context) {
            var time = timepicker.get('select');
            var date = datepicker.get('select');
            
            currentDate = new Date(date.pick);
            currentDate.setHours(time.hour);
            currentDate.setMinutes(time.mins);
            refresh();
        }
    });
    
    timepicker = $timeInput.pickatime('picker');

    //timepicker.set('select',[currentDate.getHours(),currentDate.getMinutes()]);

}


// Method to open the About dialog
function refresh() {
    //var currentDate = new Date(2014,8,6,3,15,0);
    var calculationUTCDate = new Date(  currentDate.getFullYear(), 
                                    currentDate.getMonth(), 
                                    currentDate.getDate(),
                                    0,-currentDate.getTimezoneOffset(),0);
    
    var currentDateInMilliSecondes = currentDate.getTime();
    jQuery('#currentDate').html(currentDate);
    var currentDay = currentDate.getDay();
    
    //Get the day ephemeris
    console.log(lat+ "  " + lng);
    var times = SunCalc.getTimes(calculationUTCDate, lat, lng);    
    var sunrise = times.sunrise;        
    var sunset = times.sunset;
    
    var calculationDay = currentDay;
    
    if(sunrise.getTime()>currentDate.getTime()){
        var previousCalculationUTCDate = new Date(calculationUTCDate.getTime());
        previousCalculationUTCDate.setDate(calculationUTCDate.getDate() -1);
        times = SunCalc.getTimes(previousCalculationUTCDate, lat, lng);
        
        sunrise = times.sunrise;        
        sunset = times.sunset;
        
        calculationDay=previousCalculationUTCDate.getDay();
    }    

    console.log(sunrise);
    console.log(sunset);

    var db = new DBService(false);
    db.updateShephirahOfTheDay(calculationDay);
 
    var dayStepInMilliSecondes = (sunset.getTime()  - sunrise.getTime())/12;    
    var nightStepInMilliSecondes = 7200000 - dayStepInMilliSecondes;
    
    var hoursRulers = new Array("Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon",
                                "Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon",
                                "Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon",
                                "Saturn","Jupiter","Mars","Sun","Venus","Mercury","Moon"); 
    
    var daysIndexes = new Array(3,6,2,5,1,4,0);
    var startIndex = daysIndexes[calculationDay];
    
    var start = sunrise.getTime();
    var end = start;
    var currentLineStyle = "";
    jQuery('#dayTableContent').html("");
    
    var hourSephirahRuler ="";
    for(var i=0;i<12;i++){
        end +=dayStepInMilliSecondes;
        
        if(currentDateInMilliSecondes>start && currentDateInMilliSecondes<end){
            currentLineStyle = "style=\"background-color:#FF0000; color:#FFFFFF;\"";
            hourSephirahRuler = hoursRulers[startIndex + i%7];
        }else {
            currentLineStyle ="";
        }
        
        var sDate = new Date(start); 
        var sEnd = new Date(end); 

        var row = '<tr '+currentLineStyle+'>'+
                    '<td>'+sDate.getHours()+':'+sDate.getMinutes()+'</td>'+
                    '<td>'+sEnd.getHours()+':'+sEnd.getMinutes()+'</td>'+
                    '<td>'+hoursRulers[startIndex + i%7]+'</td>'+
                  '</tr>';
        jQuery('#dayTableContent').append(row);
        start=end;  
    }
    
    jQuery('#dayTableContent').append('<tr><td/><td/><td/><tr/>');
    
    var start = sunset.getTime();
    var end = start;
    startIndex += 5;
    for(var i=0;i<12;i++){
        end +=nightStepInMilliSecondes;
        
        if(currentDateInMilliSecondes>start && currentDateInMilliSecondes<end){
            currentLineStyle = "style=\"background-color:#FF0000; color:#FFFFFF;\"";
            hourSephirahRuler = hoursRulers[startIndex + i%7];
        }else {
            currentLineStyle ="";
        }
        
        var sDate = new Date(start); 
        var sEnd = new Date(end); 

        var row = '<tr '+currentLineStyle+'>'+
                    '<td>'+sDate.getHours()+':'+sDate.getMinutes()+'</td>'+
                    '<td>'+sEnd.getHours()+':'+sEnd.getMinutes()+'</td>'+
                    '<td>'+hoursRulers[startIndex + i%7]+'</td>'+
                  '</tr>';
        jQuery('#dayTableContent').append(row);
        start=end;  
    }
    
    //Load the exemples...
    var daySephiroth = new Array(6,9,5,8,4,7,3);
    var hourSepheroth = new Array ();
    hourSepheroth["Sun"]=6;
    hourSepheroth["Moon"]=9;
    hourSepheroth["Mars"]=5;
    hourSepheroth["Mercury"]=8;
    hourSepheroth["Jupiter"]=4;
    hourSepheroth["Venus"]=7;
    hourSepheroth["Saturn"]=3;
    
    jQuery('#exemples_content').html("");
    jQuery('#tarot_content').html("");
    jQuery('#path_content').html("");
    jQuery('#hour_sephirah_content').html("");
    jQuery('#day_sephirah_content').html("");
    
    var daySephirah = daySephiroth[calculationDay];
    var hourSephirah = hourSepheroth[hourSephirahRuler];

    db.getInfluence(daySephirah,hourSephirah,function(influence){
      
      jQuery('#exemples_content').html('<b>'+influence.polarity+'</b><br/>'+influence.description);
      
      db.getTarot(influence.path,function(tarot){
        jQuery('#tarot_content').append('<tr><td>Name : </td><td>'+tarot.name+'</td></tr>');
        jQuery('#tarot_content').append('<tr><td>Sensible meaning upward : </td><td>'+tarot.sensible_meaning_upward+'</td></tr>');
        jQuery('#tarot_content').append('<tr><td>Sensible meaning reversed : </td><td>'+tarot.sensible_meaning_reversed+'</td></tr>');
        jQuery('#tarot_content').append('<tr><td>Commentary : </td><td>'+tarot.commentary+'</td></tr>');
      });
      
      db.getPath(influence.path,function(path){
        jQuery('#path_content').append('<tr><td>Number : </td><td>'+path.number+'</td></tr>');
        jQuery('#path_content').append('<tr><td>Name : </td><td>'+path.name+'</td></tr>');
        jQuery('#path_content').append('<tr><td>Symbolic meaning : </td><td>'+path.symbolic_meaning+'</td></tr>');
        jQuery('#path_content').append('<tr><td>Occult Concept : </td><td>'+path.occult_concept+'</td></tr>');
        jQuery('#path_content').append('<tr><td>Attribute : </td><td>'+path.attribute+'</td></tr>');
        jQuery('#path_content').append('<tr><td>Tarot : </td><td>'+path.tarot_attribution+'</td></tr>');
      });
      
      db.getSephirah(hourSephirah,function(sephirah){
        jQuery('#hour_sephirah_content').append('<tr><td>Number : </td><td>'+sephirah.number+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Name : </td><td>'+sephirah.name+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Primary Title : </td><td>'+sephirah.primary_title+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Other Titles: </td><td>'+sephirah.other_titles+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Intelligible Qualities : </td><td>'+sephirah.intelligible_qualities+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Human Experience : </td><td>'+sephirah.human_experience+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Sensible Qualities : </td><td>'+sephirah.sensible_qualities+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Color Tree : </td><td>'+sephirah.color_tree+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Color Scale : </td><td>'+sephirah.color_scale+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Elemental Attribution : </td><td>'+sephirah.elemental_attribution+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Polarity : </td><td>'+sephirah.polarity+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Tarot Card : </td><td>'+sephirah.tarot_card+'</td></tr>');
        jQuery('#hour_sephirah_content').append('<tr><td>Commentary : </td><td>'+sephirah.commentary+'</td></tr>');
      });
      
      db.getSephirah(daySephirah,function(sephirah){
        jQuery('#day_sephirah_content').append('<tr><td>Number : </td><td>'+sephirah.number+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Name : </td><td>'+sephirah.name+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Primary Title : </td><td>'+sephirah.primary_title+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Other Titles: </td><td>'+sephirah.other_titles+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Intelligible Qualities : </td><td>'+sephirah.intelligible_qualities+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Human Experience : </td><td>'+sephirah.human_experience+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Sensible Qualities : </td><td>'+sephirah.sensible_qualities+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Color Tree : </td><td>'+sephirah.color_tree+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Color Scale : </td><td>'+sephirah.color_scale+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Elemental Attribution : </td><td>'+sephirah.elemental_attribution+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Polarity : </td><td>'+sephirah.polarity+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Tarot Card : </td><td>'+sephirah.tarot_card+'</td></tr>');
        jQuery('#day_sephirah_content').append('<tr><td>Commentary : </td><td>'+sephirah.commentary+'</td></tr>');
      });
    });
    
    
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

// Navigate to the next page on swipeleft
//jQuery(document).on( "swipeleft", ".ui-page", function( event ) {
//
//    // Prevent the usual navigation behavior
//    event.preventDefault();
//
//    // Get the filename of the next page. We stored that in the data-next
//    // attribute in the original markup.
//    var next = jQuery( this ).jqmData( "next" );
//
//    jQuery.mobile.navigate("#"+next);
//
//});

// The same for the navigating to the previous page
//jQuery(document).on( "swiperight", ".ui-page", function( event ) {
//
//     // Prevent the usual navigation behavior
//    event.preventDefault();
//    var prev = jQuery( this ).jqmData( "prev" );
//
//    jQuery.mobile.navigate("#"+prev);
//
//});
    
