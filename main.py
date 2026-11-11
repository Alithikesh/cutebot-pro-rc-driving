"""

Leave your night_light() function unchanged.

"""
def autopilot_mode():
    global sonar
    sonar = CutebotPro.ultrasonic(SonarUnit.INCHES)
    if 2 < sonar and sonar < 20:
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
        CutebotPro.color_light(CutebotProRGBLight.RGBA, 0xff0000)
        # Turn left to avoid obstacle
        CutebotPro.trolley_steering(CutebotProTurn.LEFT, 180)
    else:
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
        CutebotPro.color_light(CutebotProRGBLight.RGBA, 0x00ff00)
        # Drive forward
        CutebotPro.pwm_cruise_control(30, 30)
# Receive commands from the Joystick:bit.

def on_received_string(receivedString):
    global autopilot_enabled
    if receivedString == "autopilot_on":
        billy.say("autopilot mode on")
        autopilot_enabled = True
        strip.show_color(neopixel.colors(NeoPixelColors.WHITE))
        CutebotPro.color_light(CutebotProRGBLight.RGBA, 0xff9da5)
    elif receivedString == "autopilot_off":
        billy.say("manual mode enabled")
        autopilot_enabled = False
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
        CutebotPro.color_light(CutebotProRGBLight.RGBA, 0x0000ff)
        CutebotPro.pwm_cruise_control(0, 0)
    elif not (autopilot_enabled):
        manual_mode(receivedString)
radio.on_received_string(on_received_string)

# Manual driving mode.
def manual_mode(command: str):
    if command == "forward":
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
        CutebotPro.full_speed_ahead()
    elif command == "backward":
        strip.show_color(neopixel.colors(NeoPixelColors.WHITE))
        CutebotPro.full_astern()
    elif command == "right":
        strip.show_color(neopixel.colors(NeoPixelColors.PURPLE))
        CutebotPro.pwm_cruise_control(30, -30)
    elif command == "left":
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
        CutebotPro.pwm_cruise_control(-30, 30)
    elif command == "stop":
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
        CutebotPro.pwm_cruise_control(0, 0)
    elif command == "deliver":
        CutebotPro.pwm_cruise_control(0, 0)
        CutebotPro.stop_immediately(CutebotProMotors.ALL)
        billy.say("Take this item")
        basic.show_string("Take this item.")
        CutebotPro.color_light(CutebotProRGBLight.RGBR, 0x00ffff)
        strip.show_color(neopixel.colors(NeoPixelColors.INDIGO))
        CutebotPro.color_light(CutebotProRGBLight.RGBL, 0x0000ff)
        strip.show_color(neopixel.colors(NeoPixelColors.VIOLET))
    elif command == "introduction":
        CutebotPro.pwm_cruise_control(0, 0)
        CutebotPro.stop_immediately(CutebotProMotors.ALL)
        billy.say("Hello")
        billy.say("My name is Ryder")
autopilot_enabled = False
sonar = 0
strip: neopixel.Strip = None
billy.voice_preset(BillyVoicePreset.DALEK)
billy.say("Hello")
billy.say("My name is Ryder")
radio.set_group(3)
strip = neopixel.create(DigitalPin.P15, 24, NeoPixelMode.RGB)
strip.set_matrix_width(10000)

def on_forever():
    if autopilot_enabled:
        autopilot_mode()
basic.forever(on_forever)
