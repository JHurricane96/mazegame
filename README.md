# PhyxInput
---
Use paper as a game controller

Installation:
=============
1. Clone the repo on your computer.
2. cd to the `server` folder and run `npm install`
3. Install Arduino SDK for your system.
4. Make the connections as per the diagram (to be added soon).

*NOTE: The code as-is runs only on Windows. For making it run on other systems, one will have to change the address of the serial port to which the board is connected (/server/server.js)*

Demo:
====
[![Demo Video](http://img.youtube.com/vi/vgxbeYdVppw/03.jpg)](http://www.youtube.com/watch?v=vgxbeYdVppw)

Working:
======

The basic principle behind the project is that the human body is a conductor of electricity - not a very good conductor, but conductor nevertheless.

The project uses humans as a switch. Look at the diagram below. The Arduino board is connected to the computer via a serial port (not shown in the diagram). Also, the user holds the positive terminal of the battery in his hand (via a wire, or directly by touching the thumb - however convenient). The negative is connected to the ground of the Arduino board - so that they share a common ground. The negative terminal of the battery is also connected to the papers (The digram shows only two papers, but the code is for four. That part is trivial anyway<sup>Caveat#1</sup>). Each paper is connected to an appropriate analog pin (we used A0, A4, A8, A12. See below for caveats).

![Circuit Diagram](/Paper-Control.png?raw=true "Circuit Diagram")

Whenever you touch a paper, the circuit is closed. How? Because, the current flows through the positive end of the battery, through your hand, through your body, through the finger that touches the paper, and then through the graphite, and finally through the wire to the negative end of the battery. When current flows through the graphite, the board measures the voltage across it (as the potential difference between the ground wire and the input pin wire). The arduino code (found in /arduino folder) does `digitalRead`<sup>Caveat#2</sup> on the four pins and sends the values it read (0 or 1) over the serial port.

There is another code running on the computer (found in /server folder) that listens on the serial port where the Arduino is connected. It fires the appropriate key. So, if you touch the paper corresponding to the left arrow, the nodejs program will fire a left key press event. We use the [SerialPort libarary](https://www.npmjs.com/package/serialport) for handling the serial port communication and the [robot.js library](https://www.npmjs.com/packages/robotjs) for firing keystrokes.


Caveats:
=======

1. The Arduino board has 16 pins for Analog IO, but we've noticed that while reading data of neighbouring pins quickly, the value of both pins gets affected by each other. So you need to choose the pins such that this interference doesn't affect you. This also limits the number of pins you can use.
2. `analogRead` wasn't working properly at all. The interference was still being an issue, even after choosing far off pins, and other than that, we couldn't fix a proper threshold value to detect if the person has touched the paper or not. With analog read, we were getting a reading of about 300 without closing the circuit itself (due to the random electric noise in the surroundings). Here's where things start getting funny - the amount of shading on paper matters. Sometimes, there might be too much graphite! So, if there's too much graphite, it doesn't offer much resistance, and hence doesn't offer much voltage. But voltage is what the board measures. So, sometimes, if the graphite is too much, and you close the circuit, the reading decreases instead of increasing. If you have less amount of graphite, the reading increases instead of decreasing. Thus, it isn't very reliable. Instead, what we found was that using `digitalRead` solved most of our problems magically. All we had to do was to shade the graphite such that `digitalRead` recognizes the touch. Still painful, but less painful than using `analogRead`. If you've a better, more reliable way of handling it, do send a PR!

Notes:
=====

This was inspired by [Jay Silver's "Hack a banana, make a keyboard" Ted Talk](https://www.ted.com/talks/jay_silver_hack_a_banana_make_a_keyboard?language=en). Currently the demo works only for paper, but with proper calibration we should be able to make it work for anything (not sure if it is that simple :P)

Contributors:
=====

1. [Parth Thakkar](https://github.com/thakkarparth007)
2. [Arun Ramachandram](https://github.com/jhurricane96)
3. [Lakshmanaram](https://github.com/lakshmanaram)
4. Akash Suresh (NIT Trichy)

