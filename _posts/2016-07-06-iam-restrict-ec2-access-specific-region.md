---
id: 589
title: 'IAM: Restrict EC2 Access to Specific Region'
date: 2016-07-06T11:55:30+00:00
author: Akash
layout: post
guid: http://skywide.in/blog/?p=589
permalink: /iam-restrict-ec2-access-specific-region/
image: /wp-content/uploads/2016/07/iam-logo.png
categories:
  - AWS
  - Custom IAM Policies
tags:
  - aws
  - ec2
  - iam
---
Restrict user activity to a specific region in order to minimize resource wastage. This policy will ensure that all of the resources are being created only in the region of your choice so that when it comes down to resource cleanup and housekeeping, you&#8217;ll be able to save quite a lot of time.

Apart from restricting access region-wise, it allows users read-only access to resources launched in other regions.
