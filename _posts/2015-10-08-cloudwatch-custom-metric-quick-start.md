---
id: 346
title: CloudWatch Custom Metric Quick Start
date: 2015-10-08T11:13:43+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=346
permalink: /cloudwatch-custom-metric-quick-start/
image: /wp-content/uploads/2015/10/CloudWatch-e1456448252846.png
categories:
  - AWS
tags:
  - aws
  - cloudwatch
  - custom metrics
---
## What is CloudWatch Custom Metrics

Setting up CloudWatch Custom Metrics on your instance allows you to monitor resources in addition to the default metrics of CPU Utilization, Disk I/O and Network I/O provided by default. Custom Metrics includes the following additional metrics:

memory-used
  
memory-utilization
  
memory-available
  
swap-utilization
  
swap-used
  
disk-space-utilization
  
disk-space-used
  
disk-space-availability

* * *

These steps are written specifically for Ubuntu. The steps vary for different distributions.

  1. SSH into your EC2 instance
  2. Install the required dependencies: <ul style="list-style-type: square;">
      <li>
        <code>sudo apt-get install unzip && apt-get install libwww-perl && apt-get install libcrypt-ssleay-perl apt-get install libswitch-perl</code>
      </li>
    </ul>

  3. Download the monitoring scripts: <ul style="list-style-type: square;">
      <li>
        <code>wget http://aws-cloudwatch.s3.amazonaws.com/downloads/CloudWatchMonitoringScripts-1.2.1.zip</code>
      </li>
    </ul>

  4. Extract the contents and remove the zip file: <ul style="list-style-type: square;">
      <li>
        <code>unzip CloudWatchMonitoringScripts-v1.1.0.zip</code><br /> <code>rm CloudWatchMonitoringScripts-v1.1.0.zip</code>
      </li>
    </ul>

  5. Add access key and secret key to the configuration file. Edit the awscreds.template located inside aws-scripts-mon directory file to add your Access Key and Secret Key. <ul style="list-style-type: square;">
      <li>
        <code>cd aws-scripts-mon</code><code>echo "AWSAccessKeyId=****" &gt; awscreds.template</code><br /> <code>echo "AWSSecretKey=****" &gt;&gt; awscreds.template</code>
      </li>
    </ul>

  6. Set environment variable & export the path of the credential file <ul style="list-style-type: square;">
      <li>
        <code>path=$(pwd) ; export AWS_CREDENTIAL_FILE=${path}/awscreds.template</code>
      </li>
    </ul>

  7. Create a cronjob. Add the monitoring script to the crontab. Run it every 5 minutes or choose a time cycle according to your requirements. <ul style="list-style-type: square;">
      <li>
        <code>echo "*/5 * * * * ~/aws-scripts-mon/mon-put-instance-data.pl --mem-util --mem-used --mem-avail --swap-util --swap-used --disk-path=/ --disk-space-util --disk-space-used --disk-space-avail" &gt;&gt; /etc/crontab</code>
      </li>
    </ul>

  8. Check the metrics on the AWS console

* * *

Head over to the CloudWatch console to check the metrics. Goto: https://console.aws.amazon.com/cloudwatch/
  
Click on Linux System under Metrics. Then click on the instance ID that you want to check the metrics of.

I have largely automated the setup process in the following script. The distributions currently supported are Amazon Linux, Ubuntu and SUSE Linux.

Download the script here: <a href="https://github.com/slashr/CloudWatch-Deployment/" target="_blank">https://github.com/slashr/CloudWatch-Deployment</a>
