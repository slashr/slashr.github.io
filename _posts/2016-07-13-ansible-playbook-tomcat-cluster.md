---
id: 594
title: Ansible Playbook to Create a Load-Balanced Tomcat Cluster
date: 2016-07-13T07:35:26+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=594
permalink: /ansible-playbook-tomcat-cluster/
image: /wp-content/uploads/2016/05/Ansible-Official-Logo-Black.png
categories:
  - Automation
  - AWS
tags:
  - ansible
  - automation
  - aws
  - devops
  - ec2
---
#### Overview

The following Ansible playbook should give an idea about the configuration management prowess of Ansible. This playbook setups up a group of Tomcat nodes which are load-balanced by Apache using the Mod-jk module. In addition to this, it also sets up all other dependencies and also configures the installed services to run on startup.

Overview of actions performed:

  * Update apt-get cache
  * Install Apache
  * Install Mod-jk module
  * Install MySQL
  * Install Java
  * Download Tomcat and setup nodes
  * Edits and configures Tomcat configuration files
  * Edits and configures Apache and Mod-jk configuration files
  * Restarts Apache
  * Starts Tomcat nodes

Find the playbook in the repo here: https://github.com/slashr/Tomcat-Cluster-Load-Balancing
