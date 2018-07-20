---
id: 660
title: 'Suppressing Fires using Gas: An IoT Experiment'
date: 2018-03-17T21:03:52+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=660
permalink: /fire-suppression-using-smart-sensors-iot/
categories:
  - Automation
tags:
  - arduino
  - IoT
  - microcontroller
  - sensors
---

An IoT experiment to create a gas based suppression system that can be used to extinguish fires inside water sensitive enclosures such as data centers. We make use of Arduino microcontrollers and several sensors to create this system.

***

## The Design

A fully autonomous monitoring and suppression system that detects fire and extinguishes it using inert gases while also ensuring safety and avoiding danger at the same time. This system consists of the following functionalities:
<!--more-->
<ul style="list-style-type: square;">
  <li>
    The detection of fire using real-time data from fire and temperature sensors
  </li>
  <li>
    The detection of personnel inside the data center using feedback from presence<br /> sensors
  </li>
  <li>
    The release of gas to suppress the fire and continuous monitoring based on real-time<br /> feedback from fire and temperature sensors
  </li>
  <li>
    The detection of any leftover gas or fire using feedback from the fire, temperature<br /> and gas sensors
  </li>
  <li>
    The interfacing of the system using an HMI to allow monitoring and manual intervention in case of a unexpected event of malfunction.
  </li>
</ul>

***

## The Architecture

The system consist of the following sensors and devices

<table style="height: 171px; width: 488px;">
  <tr>
    <td style="width: 164px;">
      Device
    </td>
    
    <td style="width: 310px;">
      Purpose
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      MQ2 Gas sensor
    </td>
    
    <td style="width: 310px;">
      Detection of inert gas
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      MQ2 temperature sensor
    </td>
    
    <td style="width: 310px;">
      Detection of fire (measures temperature)
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      Magideal IR Infrared Fire sensor
    </td>
    
    <td style="width: 310px;">
      Detection of fire (identifies fire)
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      L9110 fans
    </td>
    
    <td style="width: 310px;">
      Exhaust and release of gas
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      Movement sensor
    </td>
    
    <td style="width: 310px;">
      Detection of personnel
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      Arudino Nano
    </td>
    
    <td style="width: 310px;">
      Controlling sensors (System Nano)
    </td>
  </tr>
  
  <tr>
    <td style="width: 164px;">
      Arduino Nano
    </td>
    
    <td style="width: 310px;">
      Reading system status (HMI Nano)
    </td>
  </tr>
</table>

***

## The Tools

The algorithm was designed using the Arduino IDE in Embedded C.

This was initial tested using Proteus which simulated the circuitboard.

We used these [external libraries](https://github.com/andresarmento/modbus-arduino) for the configuration of Modbus protocol which was used to help SCADA communicate with micro-controller.

We implemented the core system logic on the System Nano. Whereas, the SCADA
  
system using the Modbus system was implemented on the HMI Nano.

Using the HMI Nano, we continuously polled the pins of the System Nano to get the status of the devices and sensors.

Dishonourable mention: Arduino Olimexino is a failed product. It took a lot of troubleshooting attempts before we found out that the microcontroller was sending incorrect signals to the devices (fans changed direction of rotation randomly!)

***

## The Code

<ul style="list-style-type: square;">
  <li>
    <a href="https://github.com/slashr/FireSuppressionIoT/blob/master/FORNANO/FORNANO.ino">System Nano</a>
  </li>
  <li>
    <a href="https://github.com/slashr/FireSuppressionIoT/blob/master/SCADA_NANO/SCADA_P_V3.ino/SCADA_P_V3.ino.ino">HMI Nano</a>
  </li>
</ul>

***

## The Product<figure id="attachment_661" style="width: 1024px" class="wp-caption aligncenter">

![Arduino Nano Jr. Arduino Nano Sr., Humble Breadboard, Village Idiot Arduino Olimexino (rightfully abandoned), Whole lotta sensors](/assets/images/2018/03/setup.jpg) Starting from the left: Arduino Nano Jr, Arduino Nano Sr, Humble Breadboard, Village Idiot Arduino Olimexino (rightfully abandoned), Whole lotta sensors
