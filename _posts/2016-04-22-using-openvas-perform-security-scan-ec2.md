---
id: 529
title: Using OpenVas to Perform a Security Scan on EC2
date: 2016-04-22T06:18:24+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=529
permalink: /using-openvas-perform-security-scan-ec2/
image: /wp-content/uploads/2016/04/2e76eb7.png
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

It&#8217;s a recommended approach to scan your EC2 instances periodically to check for vulnerabilities and security loopholes. There are several scanning tools available for these purposes but very few free ones. OpenVAS is a opensource and free tool which originated as a fork of the now commercial Nessus scanning tool. Follow these steps to quickly get started with OpenVAS

  1. Launch an Ubuntu EC2 instance. [[how-to](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance_linux)]
  2. Add the following PPA: `sudo add-apt-repository ppa:mrazavi/openvas<br />
` 
  3. Update apt-get: `sudo apt-get update`
  4. Install OpenVAS : `sudo apt-get install openvas`
  5. Run the following commands to update OpenVAS scripts and data <ul style="list-style-type: disc;">
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code>sudo apt-get install sqlite3 </code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code>sudo openvas-nvt-sync </code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code>sudo openvas-&lt;wbr />scapdata-&lt;wbr />sync</code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code></code><code>sudo openvas-&lt;wbr />certdata-&lt;wbr />sync</code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code></code><code>sudo service openvas-scanner restart</code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code></code><code>sudo service openvas-manager restart</code>
        </p>
      </li>
      
      <li>
        <p id="yui_3_10_3_1_1461302992231_272">
          <code></code><code>sudo openvasmd --rebuild --progress</code>
        </p>
        
        <p>
          The above commands will be downloading large amounts of data from the internet. It might take several minutes to complete depending on the internet speed.</li> </ul> </li> 
          
          <li>
            <p id="yui_3_10_3_1_1461319488626_72">
              <code>Goto https:/&lt;wbr />/&lt;instance-public-ip&gt;:&lt;wbr />443</code> and login. The default username and password is &#8220;admin&#8221;.
            </p>
          </li></ol>
