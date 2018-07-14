---
id: 542
title: Configuration Management on EC2 Using Ansible
date: 2016-05-05T11:18:55+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=542
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

  1. The easiest and recommended way of installing is from the package repositories. Simply run: <ul style="list-style-type: disc;">
      <li>
        <code>sudo apt-get install ansible</code>
      </li>
    </ul>

  2. To test the installation, run the following. If you get a prompt asking for the SSH password, it indicates that the installation was successful. <ul style="list-style-type: disc;">
      <li>
        <code>ansible all -m ping --ask-pass</code>
      </li>
    </ul>

  3. Open the file /etc/ansible/hosts and add the IPs of your servers in it. For example, you can add EC2 instance public IP or you can add the private IP if your control machine is the same VPC as the servers. The control machine as the name indicates is the machine which will be sending the commands to your servers.
  4. To test if the control machine is able to reach the servers, run the `ping` command. Key-based authentication is encouraged over passwords. use the `--private-key` flag to specify the path to your keyfile. If successful, it will return a JSON response containing the string &#8220;success&#8221;. <ul style="list-style-type: disc;">
      <li>
        <code>ansible all -m ping --private-key ~/path/to/key -u ubuntu</code>
      </li>
    </ul>

  5. To log in as root, add the become flag (-b) <ul style="list-style-type: disc;">
      <li>
        <code>ansible all -m ping --private-key ~/path/to/key -u ubuntu -b</code>
      </li>
    </ul>

  6. Test the configuration further by running a live command on the nodes <ul style="list-style-type: disc;">
      <li>
        <code>ansible all -a "/bin/echo skywide" --private-key ~/path/to/key -u ubuntu</code>
      </li>
    </ul>

  7. If you&#8217;d like to have a fully automated and unattended setup, it would be wise to disable the host key checking feature. This feature when enabled will prompt for confirmation of the key the first time Ansible tries to log into the server. Disabling host key checking however has some implications and you might want to fully understand them before disabling the host check. Inside `/etc/ansible/ansible.cfg`, edit the following <ul style="list-style-type: disc;">
      <li>
        <code>host_key_checking = False</code>
      </li>
    </ul>

  8. This way, you are able to successfully run commands on your nodes. However, Ansible goes far beyond running simple commands on your nodes. To make the most of it, we need to make use of playbooks.

* * *

#### Components

  1. Inventory <ul style="list-style-type: square;">
      <li>
        The inventory file is nothing but a file containing the list of servers you want to configure. This file by default exists at /etc/ansible/hosts. It is also possible to use multiple inventory files.
      </li>
    </ul>

  2. Dynamic Inventory <ul style="list-style-type: square;">
      <li>
        A Dynamic Inventory is when the inventory files are stored in a different system. For example, the files can be stored on a cloud storage provider, LDAP or other such storage solutions.
      </li>
    </ul>

  3. Patterns <ul style="list-style-type: square;">
      <li>
        The hosts that are specified in an inventory file can be grouped into categories like &#8220;web servers&#8221; and &#8220;db servers&#8221; by using the appropriate syntax. A Pattern refers to a set of groups (which are a set of hosts). Take for example, <code>ansible all -m ping. </code>Here &#8220;all&#8221; refers to all hosts. Whereas in <code>ansible webservers -m ping, </code>the command will only work on the hosts in the group &#8220;webservers&#8221; as defined in the inventory file.
      </li>
    </ul>

  4. Variables <ul style="list-style-type: square;">
      <li>
        Variables, as the name suggests, are values that are used when you are working on systems that require varied configuration. Variables can be something like a port number or a private IP address. Variables can be defined either in Inventory files or Playbooks.
      </li>
      <li>
        Example <pre><span class="p p-Indicator">-</span> <span class="l l-Scalar l-Scalar-Plain">hosts</span><span class="p p-Indicator">:</span> <span class="l l-Scalar l-Scalar-Plain">webservers</span>
  <span class="l l-Scalar l-Scalar-Plain">vars</span><span class="p p-Indicator">:</span>
    <span class="l l-Scalar l-Scalar-Plain">http_port</span><span class="p p-Indicator">:</span> <span class="l l-Scalar l-Scalar-Plain">80</span></pre>
        
        <p>
          Here http_port is a variable.</li> </ul> </li> 
          
          <li>
            Ad-Hoc Commands <ul style="list-style-type: square;">
              <li>
                Ad-Hoc Commands are used to perform quick tasks that you don&#8217;t want to write an entire playbook for. Take the analogy of running a command through shell (ad-hoc command) and running it through a bash script (playbook). <code>ansible all -m ping</code> is an example of a ad-hoc command.
              </li>
            </ul>
          </li>
          
          <li>
            Playbooks <ul style="list-style-type: square;">
              <ul style="list-style-type: square;">
                <li>
                  A playbook is a file containing instructions. The following playbook will install Apache web server on your nodes.
                </li>
              </ul>
            </ul>
            
            <p>
              </li> 
              
              <li>
                To run the playbook, use the following command <ul style="list-style-type: square;">
                  <li>
                    <code>ansible-playbook skywide.yaml --private-key ~/path/to/key.pem</code>
                  </li>
                  <li>
                    If you want to avoid specifying the path to the key file every time, modify the file /etc/ansible/ansible.cfg and set the path in the variable <code>private_key_file</code>
                  </li>
                </ul>
              </li></ol> 
              
              <hr />
              
              <p>
                &nbsp;
              </p>
