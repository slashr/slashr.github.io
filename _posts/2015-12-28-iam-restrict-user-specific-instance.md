---
id: 406
title: 'IAM: Restrict User to Specific Instance'
date: 2015-12-28T12:14:46+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=406
permalink: /iam-restrict-user-specific-instance/
image: /wp-content/uploads/2015/12/IAM_Overview.png
categories:
  - AWS
  - Custom IAM Policies
---
This policy restricts an IAM user to perform start and stop actions only on instances having their IDs specified in the Resource attribute of the policy.



In order to further restrict the actions that can be performed, additional actions like &#8220;**ec2:TerminateInstances**&#8221; can be added.
