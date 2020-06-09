---
id: 467
title: 'IAM: Restrict Access to Folders Inside Bucket'
date: 2016-03-19T18:52:39+00:00
author: Akash
layout: post
permalink: /iam-restrict-bucket-access-by-username/
categories:
  - AWS
  - Custom IAM Policies
tags:
  - aws
  - iam
  - s3
---
The following policy restricts access of a user to the folder inside the bucket that is named after the user's username. It is suited to be applied to IAM groups.

This helps create a bucket, inside which you can create several user directories and each directory can be accessed only by it's owner.

Replace the following policy with your S3 bucket name. The policy assumes that the parent directory is a directory named "home". If you have a differently named directory, replace all occurrences of "home" with the name of your directory.

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:ListAllMyBuckets", "s3:GetBucketLocation"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::*"]
    },
    {
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::bucket-name"],
      "Condition":{"StringEquals":{
      "s3:prefix":["","home/"],"s3:delimiter":["/"]}}
    },
    {
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": ["arn:aws:s3:::bucket-name"],
      "Condition":{"StringLike":{"s3:prefix":["home/${aws:username}/*"]}}
    },
    {
      "Action":["s3:*"],
      "Effect":"Allow",
      "Resource": ["arn:aws:s3:::bucket-name;/home/${aws:username}"
      "arn:aws:s3:::bucket-name/home/${aws:username}/*"]
    }
  ]
}
```
