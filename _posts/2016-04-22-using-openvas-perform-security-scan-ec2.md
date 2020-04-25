---
id: 529
title: Using OpenVas to Perform a Security Scan on EC2
date: 2016-04-22T06:18:24+00:00
author: Akash
layout: post
permalink: /using-openvas-perform-security-scan-ec2/
categories:
  - AWS
  - Ops
tags:
  - aws
  - ec2
  - openvas
  - security
---
### Scan EC2 using OpenVAS

Scanning your EC2 instances periodically to check for vulnerabilities and security loopholes is definitely something that no Systems/DevOps engineer should miss out on. There are several scanning tools available for these purposes but very few free ones. OpenVAS is an opensource and free tool which originated as a fork of the now commercial Nessus scanning tool. 

Follow these steps to quickly get started with OpenVAS

  1. Launch an Ubuntu EC2 instance. [how-to](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance_linux)
  2. Add the following PPA: `sudo add-apt-repository ppa:mrazavi/openvas` 
  3. Update apt-get: `sudo apt-get update`
  4. Install OpenVAS: `sudo apt-get install openvas`
  5. Run the following commands to update OpenVAS scripts and data:
  - `sudo apt-get install sqlite3`
  - `sudo openvas-nvt-sync`
  - `sudo openvas-scapdata-sync`
  - `sudo openvas-certdata-sync`
  - `sudo service openvas-scanner restart`
  - `sudo service openvas-manager restart`
  - `sudo openvasmd --rebuild --progress`
> The above commands will download large amounts of data from the internet. It might take several minutes to complete depending on the internet speed.
  6. After the downloads have finished, Goto `https:<instance-public-ip>:443` and login. The default username and password is `admin`