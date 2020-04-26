---
id: 470
title: Deploying a Django Application to Elastic Beanstalk
date: 2016-03-23T00:06:13+00:00
author: Akash
layout: post
permalink: /deploying-django-to-beanstalk/
categories:
  - AWS
  - Ops
tags:
  - aws
  - devops
  - elastic beanstalk
---
### Setting up a staging/development instance

It is recommended to have a instance on which activities like pulling the code from git and pushing it to Elastic Beanstalk (EB) can be done. This instance can also be used for development or testing purposes of your Django app.

Install the following packages on your instance:

Pip: `apt-get install python-pip`

Virtualenv: `apt-get install python-virtualenv`

Awsebcli: `pip install awsebcli`

---

### Setting up the tools and environment for running Django by using a virtual environment

  1. Create a virtual env: `virtualenv eb-virt`
  2. Activate the env: `source ~/eb-virt/bin/activate`
  3. Install Django using pip: `pip install django==1.9.2`
  4. Verify Django is installed by running: `pip freeze`
  5. Deactivate the environment: `deactivate`

---

### Creating a sample Django project

  1. Activate the env: `source ~/eb-virt/bin/activate`
  2. Create a sample project: `django-admin startproject skywide`
  3. Enter the project directory: `cd skywide`
  4. Run the Django server: `python manage.py runserver 0.0.0.0:8000`
  5. Deactivate the environment before moving to the next step: deactivate

You can now see the following page by hitting the public IP of your instance in your browser. Example: 54.255.233.22:8000

![django](/assets/images/Django.png)

Now that Django is up and running on your EC2 instance, we can proceed to prepare it to be deployed on Elastic Beanstalk.

---

### Configuring your application to work with Elastic Beanstalk

  1. Activate the virtual environment: `source ~/eb-virt/bin/activate`
  2. Create a `requirements.txt` file. This file is used by EB to install the dependencies on the instances it will launch: `pip freeze > requirements.txt` (Do verify that requirements.txt contains "django==1.9.2")
  3. Create a new directory called `.ebextensions` inside ~/skywide. We will create a configuration file inside this directory later: `mkdir .ebextensions`
  4. Create a file `django.config` inside `.ebextensions` containing the following code: This setting, `WSGIPath` specifies the location of the WSGI script that Elastic Beanstalk uses to start your application. 
  5. Finally, deactivate the virtual environment: `deactivate` 

Next step is to deploy your Django app to EB.

---

### Deploying your applicaiton to Elastic Beanstalk

Make sure you have a directory structure is correct.
  1. Go inside your project directory (~/skywide) and create a new EB application (initiate the repository) with the following command: `eb init -p python3.4 skywide`
  2. Run `eb init` again configure a default keypair that will be used to login to the instances launched by EB.
  3. Next, create an environment inside the application we just created: `eb create skywide-env`

To see the app live, go to the Elastic Beanstalk console, click on the Application we created and then on the Environment created (skywide-env). Click on the URL listed at the top of the page and you willll see your app in action in your browser!
