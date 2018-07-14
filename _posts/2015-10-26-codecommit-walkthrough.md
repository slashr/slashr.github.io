---
id: 367
title: Getting Started with CodeCommit
date: 2015-10-26T09:56:27+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=367
permalink: /codecommit-walkthrough/
image: /wp-content/uploads/2015/10/almsuite_awscodecommit.png
categories:
  - Automation
  - AWS
  - Ops
tags:
  - automation
  - aws
  - codecommit
  - devops
---
#### Setting up CodeCommit

This tutorial is written for the linux environment and uses SSH as the communication protocol.

  1. First, we need an IAM user that has full access to the AWS CodeCommit service. You can either create a new user and attach the appropriate policy to it or use an existing user.
  2. Next, we install Git on the instance.
  3. In order to associate the IAM user with full CodeCommit access with the EC2 instance, we will create an ssh-key pair on the instance and link it with the IAM user through the AWS console. While logged in to the instance, perform the following steps <ul style="list-style-type: disc;">
      <li>
        <code class="nohighlight">ssh-keygen</code> <ol>
          <li>
            Enter a file name. Example code_commit
          </li>
          <li>
            Enter the passphrase if required and press enter
          </li>
        </ol>
      </li>
      
      <li>
        This will generate two files:  The private key file <em>code_commit</em> and the public key file <em>code_commit.pub</em>. Copy the contents of the public key and save it (we&#8217;ll require it in the following steps)
      </li>
    </ul>

  4. Go to the IAM console, choose Policies and then select IAMUserSSHKeys. Click on Attach and then select the IAM user we created/chose in the first step. Click on Attach Policy
  5. Go back to the IAM console and click on Users. Select our IAM user, scroll down and click on Upload SSH public key. Paste the text you copied previously and click Upload SSH public key
  6. Copy the SSH Key ID that will be generated and save it
  7. Inside the instance, create a file &#8220;config&#8221; inside ~/.ssh with the following contents
  
    
  8. Save the file and modify permissions: <ul style="list-style-type: disc;">
      <li>
        <code>chmod 600 config</code>
      </li>
    </ul>

  9. Test the SSH connection to CodeCommit <ul style="list-style-type: disc;">
      <li>
        <code class="${guide.default.syntax.language} hljs css">&lt;span class="hljs-tag">ssh&lt;/span> &lt;span class="hljs-tag">git-codecommit&lt;/span>&lt;span class="hljs-class">.us-east-1&lt;/span>&lt;span class="hljs-class">.amazonaws&lt;/span>&lt;span class="hljs-class">.com&lt;/span></code>
      </li>
    </ul>

 10. If you get a public key denied error, try moving your config and key files to the .ssh directory of the root user.

* * *

#### **Creating a Repository**

  1. Go to the CodeCommit Console. Create a new repository and give it a name and description (optional).
  2. Create a new directory on your instance. <ul style="list-style-type: disc;">
      <li>
        <code>mkdir skywide</code>
      </li>
    </ul>

  3. Add the directory to git by running <ul style="list-style-type: disc;">
      <li>
        <code>git init skywide</code> (This will create a .git directory inside skywide)
      </li>
    </ul>

  4. Make a simple file inside the directory in order to test if the implementation is working, say index.html <ul style="list-style-type: disc;">
      <li>
        <code>sudo nano index.html</code>
      </li>
    </ul>

  5. Add the index.html file to git <ul style="list-style-type: disc;">
      <li>
        <code>git add index.html</code>
      </li>
    </ul>

  6. Run git status <ul style="list-style-type: disc;">
      <li>
        <code>git status</code>
      </li>
    </ul>

  7. To connect the instance to the repo you created on CodeCommit <ul style="list-style-type: disc;">
      <li>
        <code>git remote add origin ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/SkyWide</code>
      </li>
    </ul>

  8. In order to commit the file to the repo, run <ul style="list-style-type: disc;">
      <li>
        <code>git commit -m "First Commit"Where -m is a message flag that adds a comment to the commit.</code>
      </li>
    </ul>

  9. In order to push the commit to CodeCommit, run <ul style="list-style-type: disc;">
      <li>
        <code>git push origin master</code><br /> This pushes the master (your local repo) to origin (the CodeCommit repo set in step 7).
      </li>
    </ul>
