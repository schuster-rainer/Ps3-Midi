var midi = require('midi');
var rek = require('rekuire');
var fs = rek('fs');
var DSConsts = rek('DualShockConst');
var JoystickController = rek('JoystickController');
var TriggerController = rek('TriggerController');
var ToggleController = rek('ToggleController');
var PressureController = rek('PressureController');
var ValueTriggerController = rek('ValueTriggerController');
var Stream = rek('Stream');
var StreamResolutionModifier = rek('StreamResolutionModifier');
var DualShock = rek('DualShock');


var midiout = createMidiOutInterface("Ps3 Midi Controller");
var dualshock = new DualShock();
var isLocked = false;


dualshock.start();

console.log(fs.readFileSync(__dirname+'/splash.txt','utf-8'));

function createMidiOutInterface(name) {
    var output = new midi.output();
    output.openVirtualPort(name);
    return output;
}




// RIGHT JOYSTICK
JoystickController(dualshock,
    DSConsts.triggers.RIGHT_STICK_X,
    DSConsts.triggers.RIGHT_STICK_Y,
    DSConsts.resolution,
    function (mode, value) {
        if (isLocked) return;
        if (mode === 3 || mode === 4) {
            midiout.sendMessage([128 + 48 + mode, DSConsts.triggers.CROSS, 127 - value]);
        } else if (mode === 1 || mode === 2) {
            midiout.sendMessage([128 + 48 + mode, DSConsts.triggers.CROSS, value]);
        }
    }).initValues({3: 127, 4: 127});

// LEFT JOYSTICK
JoystickController(dualshock,
    DSConsts.triggers.LEFT_STICK_X,
    DSConsts.triggers.LEFT_STICK_Y,
    DSConsts.resolution,
    function (mode, value) {
        if (isLocked) return;
        if (mode === 3 || mode === 4) {
            midiout.sendMessage([128 + 52 + mode, DSConsts.triggers.CROSS, 127 - value]);
        } else if (mode === 1 || mode === 2) {
            midiout.sendMessage([128 + 52 + mode, DSConsts.triggers.CROSS, value]);
        }
    }).initValues({3: 127, 4: 127});

// WING CONTROLLERS
PressureController(StreamResolutionModifier(dualshock, DSConsts.triggers.R1,256), function(value){
    midiout.sendMessage([128+48, DSConsts.triggers.R1+10, value]);
})

PressureController(StreamResolutionModifier(dualshock, DSConsts.triggers.R2,256), function(value){
    midiout.sendMessage([128+48, DSConsts.triggers.R2+10, value]);
})

PressureController(StreamResolutionModifier(dualshock, DSConsts.triggers.L1,256), function(value){
    midiout.sendMessage([128+48, DSConsts.triggers.L1+10, value]);
})

PressureController(StreamResolutionModifier(dualshock, DSConsts.triggers.L2,256), function(value){
    midiout.sendMessage([128+48, DSConsts.triggers.L2+10, value]);
})


// SHAPES
TriggerController(Stream(dualshock, DSConsts.triggers.CROSS), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.CROSS, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.SQUARE), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.SQUARE, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.TRIANGLE), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.TRIANGLE, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.CIRCLE), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.CIRCLE, isOn? 127 : 0]);
})

// ARROWS
TriggerController(Stream(dualshock, DSConsts.triggers.UP), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.UP, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.DOWN), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.DOWN, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.LEFT), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.LEFT, isOn? 127 : 0]);
})
TriggerController(Stream(dualshock, DSConsts.triggers.RIGHT), function(isOn){
    if (isLocked) return;
    midiout.sendMessage([144, DSConsts.triggers.RIGHT, isOn? 127 : 0]);
})

// SELECT START
ValueTriggerController(Stream(dualshock, DSConsts.triggers.LEFT_LK), DSConsts.leftKeys.SELECT, function(){
    console.log("LOCK");
    isLocked = true;
})
ValueTriggerController(Stream(dualshock, DSConsts.triggers.LEFT_LK), DSConsts.leftKeys.START, function(){
    console.log("UNLOCK");
    isLocked = false;
})
