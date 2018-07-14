---
id: 535
title: CloudFormation Template to Launch an EC2 instance
date: 2016-04-29T07:09:57+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=535
permalink: /cloudformation-launch-ec2-execute-script-startup/
categories:
  - Automation
  - AWS
  - Ops
tags:
  - automation
  - cloudformation
  - devops
  - ec2
  - shell
---
The following is a bare-minimum CloudFormation template to launch an EC2 instance. It&#8217;s bare-minimum in the sense that only the Parameters and Resources which are absolutely necessary are part of the template.

This template can also execute a bash script provided as [User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-shell-scripts) to the EC2 instance. The User Data can be a set of directives that will be executed only once during the first boot cycle of the instance. This feature can be used when you need to say launch several instances with the Apache web server installed on them. To do this you would simply supply the command `apt-get install apache2` as user-data. There is no need to add sudo keyword to the command as the script will be run with root privileges.



In the above template, the custom script updates the list of packages (apt-get update) and installs Apache (apt-get install apache2). You can add/remove commands as required. Be sure to put them inside double quotes and each command should be on a new line.
