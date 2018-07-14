---
id: 432
title: EC2 Instances Automated Deployment using Vagrant
date: 2016-02-12T07:32:07+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=432
permalink: /launching-ec2-instances-using-vagrant/
image: /wp-content/uploads/2016/02/Vagrant.png
categories:
  - Automation
  - AWS
  - Ops
tags:
  - automation
  - aws
  - devops
  - ec2
  - vagrant
---
<h2 style="text-align: left;">
  Why use Vagrant to launch EC2 instance?
</h2>

<p style="text-align: left;">
  EC2 instances can be deployed seamlessly using Vagrant. Once you setup Vagrant and configure it, launching an EC2 instance becomes as easy as running the command <em>vagrant up. </em>Such automation is especially useful when you have to launch a large fleet of EC2 instances quickly.
</p>

<h4 style="text-align: left;">
  Setting up Vagrant on your machine
</h4>

  1. Install vagrant:
  
    `sudo apt-get install vagrant`
  2. Initialize vagrant:
  
    `vagrant init hashicorp/precise32`
  
    `vagrant up`
  
    (This will download the example virtualbox image from vagrant servers. It might take a few minutes)
  3. Install vagrant aws plugin:
  
    `sudo vagrant plugin install vagrant-aws`
  4. Get the AWS Box image:
  
    `vagrant box add dummy https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box`

* * *

<h4 style="text-align: left;">
  Launching the instance
</h4>

  1. Create a directory in your home folder and from inside the directory, run
  
    `vagrant init hashicorp/precise32`
  
    (This will create a &#8220;Vagrantfile&#8221; in your directory)
  2. Open your Vagrantfile, clear all contents and add the following. Please modify the values wherever necessary.
  
    
  3. Save the file and run:
  
     `vagrant up --provider=aws`
  4. Your instance should be up and running in a few minutes.

* * *

The above configuration only contains the bare essential configurations. Here are some more configuration parameters.

<table style="height: 258px; width: 675px;">
  <tr>
    <td style="width: 253px;">
      availability_zone
    </td>
    
    <td style="width: 408px;">
      Specify the desired availability zone. (ap-southeast-1a)
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      instance_type
    </td>
    
    <td style="width: 408px;">
      The default value of this if not specified is &#8220;m3.medium&#8221;
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      private_ip_address
    </td>
    
    <td style="width: 408px;">
      The private IP address to assign to an instance within a VPC
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      instance_ready_timeout
    </td>
    
    <td style="width: 408px;">
      The number of seconds to wait for the instance to become &#8220;ready&#8221; in AWS. Defaults to 120 seconds
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      instance_package_timeout
    </td>
    
    <td style="width: 408px;">
      The number of seconds to wait for the instance to be burnt into an AMI during packaging. Defaults to 600 seconds
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      elastic_ip
    </td>
    
    <td style="width: 408px;">
      Can be set to &#8216;true&#8217;, or to an existing Elastic IP address
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      security_groups
    </td>
    
    <td style="width: 408px;">
      An array of security groups for the instance. If this instance will be launched in VPC, this must be a list of security group Name. For a non-default VPC, you must use security group IDs instead
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      subnet_id
    </td>
    
    <td style="width: 408px;">
      The subnet to launch the instance inside
    </td>
  </tr>
  
  <tr>
    <td style="width: 253px;">
      associate_public_ip
    </td>
    
    <td style="width: 408px;">
      true/false. If true, will associate a public IP address to an instance in a VPC
    </td>
  </tr>
</table>

The full list of options can be found here: <a href="https://github.com/mitchellh/vagrant-aws#configuration" target="_blank">https://github.com/mitchellh/vagrant-aws#configuration</a>

* * *

Note: This guide is written for a *nix environment. The steps are similar for Windows based environments.
