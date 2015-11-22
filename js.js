/*jslint browser: true*/
/*global $, jQuery, Audio*/

jQuery(document).ready(function () {
    "use strict";

	var add_element = $('#add_element'),
        remove_element = $('#remove_element'),
        radio_station_elements = $('.radio_station_element'),
        scan_channels = $('#scan_channels'),
        get_channels = $('#get_channels'),
        play = $('#play'),
        pause = $('#pause'),
        mute = $('#mute'),
        muted = $('#muted'),
        song = new Audio('1.mp3'),
        duration = song.duration,
        led = document.getElementById('signal_led');
    
    var i = 0;
    var Channels = new Array;

    /***** Fill LED *****/
    var LEDHeight = led.height;
    var LEDWidth = led.width;
    var led_context = led.getContext("2d");
    //led_context.lineWidth = 1;
    led_context.beginPath();
    led_context.arc(LEDHeight/2,LEDWidth/2,LEDWidth/2,0,2*Math.PI);
    led_context.stroke();
    led_context.fillStyle = "green";
    led_context.fill();
    
    /***** RPC Setup *****/
    var rpc = new jsonrpc.JsonRpc('http://127.0.0.1:9001/');

    // Handy interceptors for showing loading feedback in the UI
    rpc.loading.bind(function(){ console.log('loading...'); });
    rpc.loaded.bind(function(){ console.log('done!'); });

    // Handy interceptors for all RPC calls that fails and for which there's no failure callback defined
    rpc.unhandledFailure.bind(function(){ console.log('an rpc call failed, and has not  failure callback defined'); });
    
    /**** Button *****/
    
    scan_channels.on('click', function (e) {
        // Simple call style
        rpc.call('SetChannel', '11D', function (result) {
            console.log('Method aMethod called with param1. Return value is: ' + result);});
    });
    
    get_channels.on('click', function (e) {
        // Simple call style
        rpc.call('GetChannelInformation', '', function (result) {
            Channels = result;
            for(var Channel of Channels) {
                $("#radio_station_list").append("<button class=\"radio_station_element\" id=element_" + Channel[1] + ">"+ Channel[0]  + "</button>");
            }
            console.log('Method aMethod called with param1. Return value is: ' + Channels);});
    });
    
    add_element.on('click', function (e) {
        //$("#radio_station_list").append("<li id=element_" + i + "> i = " + i + "</li>");
        //$("#radio_station_list").append("<a href=\"#\" class=\"radio_station_element\" id=element_" + i + ">Add Element "+ i + "</a>");
         $("#radio_station_list").append("<button class=\"radio_station_element\" id=element_" + i + ">Add Element "+ i + "</button>");
        i++;
		e.preventDefault();
	});
    
    remove_element.on('click', function (e) {
        i--;
        $("#radio_station_list").empty();
        //$("#element_"+i).remove();
		e.preventDefault();
	});
    
    $(document.body).on('click', '.radio_station_element', function (e) {
		e.preventDefault();
        
        // Get channel name
        var ChannelName = this.innerHTML;
        var SID = new String;
        
        // Find SID to the correspondending channel
        for(var Channel of Channels) {
            if(Channel[0] == ChannelName) {
                SID = Channel[1];
                break;
            }
        }
        
        // Stop current playing
        song.pause();
		song.currentTime = 0;
        
        // Set new URL
        song.src = "http://localhost:2346/9A/" + SID;
        
        // Start playing
        song.play();
	});
    
	play.on('click', function (e) {
		e.preventDefault();
		song.play();
	});

	pause.on('click', function (e) {
		e.preventDefault();
		song.pause();
		//$(this).replaceWith('<a class="button gradient" id="play" href="" title=""></a>');

	});

	mute.on('click', function (e) {
		e.preventDefault();
		song.volume = 0;
		//$(this).replaceWith('<a class="button gradient" id="muted" href="" title=""></a>');
        //muted = $('#muted');

	});

    muted.on('click', function (e) {
        e.preventDefault();
        song.volume = 1;
        //$(this).replaceWith('<a class="button gradient" id="mute" href="" title=""></a>');
 
    });

	$('#close').click(function (e) {
		e.preventDefault();
		song.pause();
		song.currentTime = 0;
		//$('#close').fadeOut(300);
	});



	$("#seek").bind("change", function () {
		song.currentTime = $(this).val();
		$("#seek").attr("max", song.duration);
	});
    
    /*var arr = [ "one", "two", "three", "four", "five" ]; 
    $.each( arr ,
    function(indexInArray,value) {
        $("#radio_station_list").append("<li>" + value + "</li>") ;
    });*/
});
