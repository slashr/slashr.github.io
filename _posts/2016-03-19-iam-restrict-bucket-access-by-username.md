---
id: 467
title: 'IAM: Restrict Access to Folders Inside Bucket'
date: 2016-03-19T18:52:39+00:00
author: Akash
layout: post
guid: http://blog.skywide.in/?p=467
permalink: /iam-restrict-bucket-access-by-username/
categories:
  - AWS
  - Custom IAM Policies
tags:
  - aws
  - iam
  - s3
---
The following policy restricts access of a user to the folder inside the bucket that is named after the username. It is suited to be applied to IAM groups.

This helps create a bucket inside which you can create several user directories and each directory can be accessed only by it&#8217;s owner.

Replace the following policy with your S3 bucket name. The policy assumes that the parent directory is a directory named &#8220;home&#8221;. If you have a differently named directory, change all occurrences of &#8220;home&#8221; with the name of your directory.
