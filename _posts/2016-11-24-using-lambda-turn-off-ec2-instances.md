---
id: 643
title: Using Lambda to Turn Off EC2 Instances During Off Hours
date: 2016-11-24T10:53:30+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=643
permalink: /using-lambda-turn-off-ec2-instances/
image: /wp-content/uploads/2016/11/aws-blackbelt-2015-aws-lambda-8-638.jpg
categories:
  - Automation
  - AWS
  - Ops
tags:
  - automation
  - cloudwatch
  - devops
  - ec2
---
### Introduction to AWS Lambda

A major part of your AWS bills comes from EC2 uptime and EBS storage use. In order to save on these costs, it is recommended to stop your instances whenever it is not required. Often times, your Development, Test or UAT workloads aren&#8217;t used by developers during off-hours. Thus this would be a great time frame to temporarily stop the instances and save up on the costs.

In order to do this, we can make use of AWS Lambda, which lets you run your code or without setting up any servers. Since it charges based on the compute time taken up by the code, it is very cost efficient. A task running twice within a 24-hour cycle for typically less than 60 seconds with memory consumption up to 128MB (like the script in this post) typically costs around $0.008 per month.

We will use the official AWS SDK for Python, boto3 to write our script and then run it using Lambda functions.
<!--more-->
* * *

### Pre-requisites

First things first, make sure your IAM user has:

a) Access to AWS Lambda and create functions

b) Full permissions to create Roles on IAM

c) Access to CloudWatch

d) Access to EC2 to tag instances and test the script

* * *

### Create the Function

Once the permissions are in place, get started with the following steps

  1. ##### Create an IAM Role
    
      1. Create an IAM Role for Lamba to use. You can either create a custom role and give granular permissions. The permissions required are listing, stopping, starting EC2 instances, and listing, creating, modifying CloudWatch logs. Additional dependent permissions may be required so use AWS Policy Simulator to check if you have all the permissions required.
      2. Or you can opt for an **AWS Managed Policy**. Add **AmazonEC2FullAccess**and **CloudWatchLogsFullAccess** permissions to the role.
  2. ##### Create two Lambda functions, for starting and stopping the instances using the two scripts below.
    
      1. Refer to [this guide](https://docs.aws.amazon.com/lambda/latest/dg/get-started-create-function.html)to get a hang of how to create a simple Lambda function.
      2. Click on **Create a function** and then choose **Author from scratch**.
      3. Enter a suitable name for the function, change the **Runtime** to Python.
      4. Under **Role,** select **Create a custom role.**You will be taken to a new page to create the role. Create a policy and then come back to the Lambda page and click **Create Function.**
      5. Under **Add Triggers**, choose **CloudWatch Events.**Click on the newly created box to configure it. Under **Schedule expression,**you can add the cron expression you want. For instance `cron<strong>(0 3 ? * MON-FRI *)</strong>` 
          * Note: As a weird caveat, AWS requires the cron expression to contain a &#8216;?&#8217; in any one of the first four fields. So `cron(0 3 * * MON-FRI *)` will not work but`cron(0 3 ? * MON-FRI *)` will.
      6. Then click on the function box and copy paste the above code into the editor window.
      7. Choose the**No VPC** option under **Network**. Keep your Lambda function inside a VPC when the function needs to login into an EC2 instance which is kept in a private subnet and is not publicly accessible. For actions that can be performed over the internet, it is recommended to not put the function inside a VPC. For example, boto&#8217;s start and stop API calls are publicly exposed and accessible over the internet which means that Lambda invoke them over the internet but not from within a VPC
      8. Click on **Save** and then click on **Test** for a dry run.

You might want to run a few tests to ensure everything is working as expected. You don&#8217;t want your instance to be automatically shut down at 15:00 UTC. (or maybe you do)
