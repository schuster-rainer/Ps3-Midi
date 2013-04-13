"use strict";

var rek = require('rekuire');
var EventEmitter = rek('events').EventEmitter;
var JoystickController = rek('JoystickController');

var MODE_UP = 1;
var MODE_RIGHT = 2;
var MODE_DOWN = 3;
var MODE_LEFT = 4;
var NO_MODE = -1;

describe("JoystickController", function(){
    var device = new EventEmitter();
    var X_INPUT_INDEX = 0;
    var Y_INPUT_INDEX = 1;
    var RESOLUTION = 256;

    describe("mode shifting", function(){

        // for example, when the joystick is pressed up, it should engage mode 1
        it("should set mode according to the joystick position", function(){
            var callback = createSpy('callback');
            JoystickController(device, X_INPUT_INDEX, Y_INPUT_INDEX, RESOLUTION,callback);
            emitStream(device,[[127,127],[127,127],[127,255]]);
            expect(callback).toHaveBeenCalledWith(MODE_UP,0);
        });

        it("should not switch between mode if not returned to center", function(){
            var dataReceived = [];
            var callback = createSpy('callback').andCallFake(function(mode, value){
                dataReceived.push([mode, value]);
            });
            JoystickController(device, X_INPUT_INDEX, Y_INPUT_INDEX, RESOLUTION,callback);
            emitStream(device,[[127,127],[127,127],[127,255],[255,127]]);
            expect(dataReceived).toEqual([ [MODE_UP, 0], [MODE_UP, 64]]);
        });

        it("should send mode NO_MODE only once", function(){
            var dataReceived = [];
            var callback = createSpy('callback').andCallFake(function(mode, value){
                dataReceived.push([mode, value]);
            });
            JoystickController(device, X_INPUT_INDEX, Y_INPUT_INDEX, RESOLUTION,callback);
            emitStream(device,[[127,255], [127,127],[127,127],[127,127]]);
            expect(dataReceived).toEqual([ [MODE_UP, 0], [NO_MODE,null] ]);
        });
    });
});

function emitStream(device,stream){
    for( var i in stream){
        device.emit('data',stream[i]);
    }
}