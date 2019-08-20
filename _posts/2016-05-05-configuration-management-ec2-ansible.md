---
id: 542
title: Configuration Management on EC2 Using Ansible
date: 2016-05-05T11:18:55+00:00
author: Akash
layout: post
permalink: /configuration-management-ec2-ansible/
image: /wp-content/uploads/2016/05/Ansible-Official-Logo-Black.png
categories:
  - Automation
  - AWS
  - Ops
tags:
  - ansible
  - automation
  - aws
  - devops
  - ec2
---
#### Introduction

Ansible is one of the easiest Configuration Management tools to get started with due to its client-less architecture. Ansible is written in Python and uses YAML for is configuration files which is a simple and human-readable syntax. One of the most important features of Ansible is its idempotency which means changes are only made when required and ignored otherwise. This prevents the possibility of inconsistency in your infrastructure.

* * *

#### Installation

  1. The easiest and recommended way of installing is from the package repositories. Simply run: 
        ``sudo apt-get install ansible``

  2. To test the installation, run the following. If you get a prompt asking for the SSH password, it indicates that the installation was successful. 
        ``ansible all -m ping --ask-pass``

  3. Open the file /etc/ansible/hosts and add the IPs of your servers in it. For example, you can add EC2 instance public IP or you can add the private IP if your control machine is the same VPC as the servers. The control machine as the name indicates is the machine which will be sending the commands to your servers.

  4. To test if the control machine is able to reach the servers, run the `ping` command. Key-based authentication is encouraged over passwords. use the `--private-key` flag to specify the path to your keyfile. If successful, it will return a JSON response containing the string ``success`` 
        ``ansible all -m ping --private-key ~/path/to/key -u ubuntu``

  5. To log in as root, add the become flag (-b)
        ``ansible all -m ping --private-key ~/path/to/key -u ubuntu -b``

  6. Test the configuration further by running a live command on the nodes
        ``ansible all -a "/bin/echo skywide" --private-key ~/path/to/key -u ubuntu``

  7. If you'd like to have a fully automated and unattended setup, it would be wise to disable the host key checking feature. This feature when enabled will prompt for confirmation of the key the first time Ansible tries to log into the server. Disabling host key checking however has some implications and you might want to fully understand them before disabling the host check. Inside `/etc/ansible/ansible.cfg`, edit the following ``host_key_checking = False``

  8. This way, you are able to successfully run commands on your nodes. However, Ansible goes far beyond running simple commands on your nodes. To make the most of it, we need to make use of playbooks.

* * *

#### Components

  1. ##### Inventory 
        The inventory file is nothing but a file containing the list of servers you want to configure. This file by default exists at /etc/ansible/hosts. It is also possible to use multiple inventory files.
      
  2. ##### Dynamic Inventory
        A Dynamic Inventory is when the inventory files are stored in a different system. For example, the files can be stored on a cloud storage provider, LDAP or other such storage solutions.
      
  3. ##### Patterns
        The hosts that are specified in an inventory file can be grouped into categories like *web servers* and *db servers* by using the appropriate syntax. A Pattern refers to a set of groups (which are a set of hosts). Take for example, ``ansible all -m ping`` Here *all* refers to all hosts. Whereas in ``ansible webservers -m ping`` the command will only work on the hosts in the group *webservers* as defined in the inventory file.

  4. ##### Variables 
        Variables, as the name suggests, are values that are used when you are working on systems that require varied configuration. Variables can be something like a port number or a private IP address. Variables can be defined either in Inventory files or Playbooks.
        Example:
        
        ```
        - hosts: all
          vars:
            http_port: 80
        ```

        Here *http_port* is a variable. 
          
  5. ##### Ad-Hoc Commands 
        Ad-Hoc Commands are used to perform quick tasks that you don't want to write an entire playbook for. Take the analogy of running a command through shell (ad-hoc command) and running it through a bash script (playbook). ``ansible all -m ping`` is an example of a ad-hoc command.
              
  6. ##### Playbooks 
        A playbook is a file containing instructions. The following playbook will install Apache web server on your nodes.
                
        To run the playbook, use the following command:
        ``ansible-playbook skywide.yaml --private-key ~/path/to/key.pem``
                    
        If you want to avoid specifying the path to the key file every time, modify the file ``/etc/ansible/ansible.cfg`` and set the path in the variable ``private_key_file``
