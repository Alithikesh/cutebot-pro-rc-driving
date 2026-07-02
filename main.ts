function autopilot_mode () {
    sonar = CutebotPro.ultrasonic(SonarUnit.Inches)
    if (sonar > 2 && sonar < 20) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        CutebotPro.colorLight(CutebotProRGBLight.RGBA, 0xff0000)
        // Turn left to avoid obstacle
        CutebotPro.trolleySteering(CutebotProTurn.Left, 180)
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        CutebotPro.colorLight(CutebotProRGBLight.RGBA, 0x00ff00)
        // Drive forward
        CutebotPro.pwmCruiseControl(30, 30)
    }
}
// This is the recieve string part where it gets the instruction from the Joystick:bit.
radio.onReceivedString(function (receivedString) {
    if (receivedString == "autopilot_on") {
        billy.say("autopilot mode on")
        autopilot_enabled = true
        strip.showColor(neopixel.colors(NeoPixelColors.White))
        CutebotPro.colorLight(CutebotProRGBLight.RGBA, 0xff9da5)
    } else if (receivedString == "autopilot_off") {
        billy.say("manual mode enabled")
        autopilot_enabled = false
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
        CutebotPro.colorLight(CutebotProRGBLight.RGBA, 0x0000ff)
        CutebotPro.pwmCruiseControl(0, 0)
    } else if (!(autopilot_enabled)) {
        manual_mode(receivedString)
    }
})
// Write this code for manual mode version which means you can control it.
function manual_mode (command: string) {
    if (command == "forward") {
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
        CutebotPro.fullSpeedAhead()
    } else if (command == "backward") {
        strip.showColor(neopixel.colors(NeoPixelColors.White))
        CutebotPro.fullAstern()
    } else if (command == "right") {
        strip.showColor(neopixel.colors(NeoPixelColors.Purple))
        CutebotPro.pwmCruiseControl(30, -30)
    } else if (command == "left") {
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
        CutebotPro.pwmCruiseControl(-30, 30)
    } else if (command == "stop") {
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
        CutebotPro.pwmCruiseControl(0, 0)
    } else if (command == "deliver") {
        CutebotPro.pwmCruiseControl(0, 0)
        CutebotPro.stopImmediately(CutebotProMotors.ALL)
        billy.say("Take this item")
        basic.showString("Take this item.")
        CutebotPro.colorLight(CutebotProRGBLight.RGBR, 0x00ffff)
        strip.showColor(neopixel.colors(NeoPixelColors.Indigo))
        CutebotPro.colorLight(CutebotProRGBLight.RGBL, 0x0000ff)
        strip.showColor(neopixel.colors(NeoPixelColors.Violet))
    } else if (command == "introduction") {
        CutebotPro.pwmCruiseControl(0, 0)
        CutebotPro.stopImmediately(CutebotProMotors.ALL)
        billy.say("Hello")
        billy.say("My name is Ryder")
        CutebotPro.extendServoControl(ServoType.Servo180, CutebotProServoIndex.S1, 0)
        CutebotPro.extendServoControl(ServoType.Servo180, CutebotProServoIndex.S1, 0)
        servos.P0.setAngle(90)
        servos.P0.setAngle(0)
    }
}
let autopilot_enabled = false
let sonar = 0
let strip: neopixel.Strip = null
billy.voicePreset(BillyVoicePreset.Dalek)
billy.say("Hello")
billy.say("My name is Ryder")
radio.setGroup(3)
strip = neopixel.create(DigitalPin.P15, 24, NeoPixelMode.RGB)
strip.setMatrixWidth(10000)
// Check if on autopilot, and activate autopilot mode.0
basic.forever(function () {
    if (autopilot_enabled) {
        autopilot_mode()
    }
})
