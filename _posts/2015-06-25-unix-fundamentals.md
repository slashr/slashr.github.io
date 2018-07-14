---
id: 245
title: Fundamentals and Architecture of Unix
date: 2015-06-25T07:31:59+00:00
author: Akash
layout: post
guid: http://skywide.in/?p=245
permalink: /unix-fundamentals/
image: /wp-content/uploads/2015/06/unix.png
categories:
  - Nix
tags:
  - bios
  - file system
  - runlevel
  - shell
  - unix
---
* * *

[File System](#filesystem)
  
[Shells](#shells)
  
[Package Management](#packagemanagement)
  
[Boot Process](#bootprocess)
  
[Shell Tools](#shelltools)

* * *

&nbsp;

## File System

**How to view devices/partitions**
  
`ls -la /dev/sd*` 
  
(l = long description, a = all files including the ones starting with “.”)

**How to create partition on a device**

`parted /dev/sdb` (select device)

`print` (view existing partitions on device)

`rm` (deletes selected partition)

`mklabel msdos` (assigns “msdos” label to un-labelled partitions)

`mkpart primary 1G 2G` 
  
(creates a primary partition of size 1GB from block 1GB to 2GB)

**View newly created partitions**

`fdisk -l /dev/sdb`

**Format partition with preferred filesystem**

`mkfs.ext2 /dev/sdb1<br />
mkfs.ext4 /dev/sdb2`

**Mounting filesystems**

`mount -o noatime /dev/sdb1 /mnt`
  
(where, -o is options, &#8216;noatime&#8217; is “no access times” which prevents access times from being written to the inode which results in better performance. /dev/sdb1 is the partition and /mnt is the mount point)

In addition to &#8216;noatime&#8217; other options include

  * async      : File operations take place asynchronoulsy
  * ro            : Partition mounted in read-only mode
  * noexec    : Ignores any “execute bits” on the filesystem. Used for security purposes.
  * nosuid    : Ignores any setuserid bits on the filesystem. Used for security purposes.
  * remount : Remounts in preferred mode. Example mount -o remount, rw /boot

* * *

&nbsp;

## Shells

**Editor Shortcuts**

  * Ctrl-b: Move backward by one character
  * Ctrl-f: Move forward by one character
  * Ctrl-a: Move to the beginning of the line
  * Ctrl-e: Move to the end of the line
  * Ctrl-k: Delete from the cursor forward
  * Ctrl-u: Delete from the cursor backward
  * Ctrl-r: Search the command history

**Environment Variables**

Environment variables are used to define often-used attributes by the shell. Most common environment variables are

$PATH: Specifies the set of directories the shell will search for commands

To list all environment variables
  
`env`

**Shell Profiles**

Shell profiles define a user&#8217;s environment. Environment variables can be set in a profile. There are two types of profiles.

/etc/profile: Global profile. This is the default profile.
  
~/.profile   : This is a user specific profile. Any environment variable set in this profile applies to only that specific user.

Note: ~/.profile is executed after /etc/profile. It is possible to override this.

**Special Environment Variables**

<table style="height: 302px;" width="389">
  <tr>
    <td>
      <strong>Command</strong>
    </td>
    
    <td>
      <strong>Description</strong>
    </td>
  </tr>
  
  <tr>
    <td>
      $$
    </td>
    
    <td>
      Process ID of current shell
    </td>
  </tr>
  
  <tr>
    <td>
      $!
    </td>
    
    <td>
      Background process ID
    </td>
  </tr>
  
  <tr>
    <td>
      $?
    </td>
    
    <td>
      Exit status. &#8216;0&#8217; means success. Any non-zero number indicates an error.
    </td>
  </tr>
  
  <tr>
    <td>
      history
    </td>
    
    <td>
      Provides history of commands executed on shell
    </td>
  </tr>
  
  <tr>
    <td>
      !!
    </td>
    
    <td>
      Re-executes previous command
    </td>
  </tr>
  
  <tr>
    <td>
      ctrl+R
    </td>
    
    <td>
      Searches the command history
    </td>
  </tr>
  
  <tr>
    <td>
      jobs
    </td>
    
    <td>
      List background jobs
    </td>
  </tr>
  
  <tr>
    <td>
      &
    </td>
    
    <td>
      Executes job in background. Ex: sleep 50 &
    </td>
  </tr>
  
  <tr>
    <td>
      fg
    </td>
    
    <td>
      Brings background job to foreground.
    </td>
  </tr>
  
  <tr>
    <td>
      bg
    </td>
    
    <td>
      Sends the job to the background
    </td>
  </tr>
  
  <tr>
    <td>
      fg %d
    </td>
    
    <td>
      Brings the job specified by the job ID (&#8216;d&#8217;) to the foreground
    </td>
  </tr>
  
  <tr>
    <td>
      kill %d
    </td>
    
    <td>
      Kills the specified job ID
    </td>
  </tr>
</table>

* * *

&nbsp;

## Package Management

**Package Managers**

APT (Used by Debian, Ubuntu) and RPM (Used by RedHat, CentOS, SUSE, Fedora) are the two most popular package managers.
  
Yum provides a wrapper around RPM which allows to install from multiple package repositories. It also resolves dependencies.

**Installing Packages**

`yum install dstat<br />
rpm -i dstat-0.3.9.rpm`(where -i is install)

**Upgrading Packages**

`yum install dstat`

To upgrade all packages run:

`yum upgrade<br />
rpm -Uvh dstat-0.3.9.rpm`
  
(where -U is Upgrade, v is verbose and h is hash (displays hash signs))

**Uninstalling Packages**

`yum remove dstat<br />
rpm -e dstat`

**Cleaning RPM Database**

`yum clean all` (removes all refresh package metadata next time)

* * *

&nbsp;

## Boot Process

**Power Supply Unit**

  1. When the power switch is turned on, the internal electrical circuit is complete and the PSU starts getting power. It performs a self-test after which it notifies the CPU through the 4-pin connector that the CPU should power on.
  2. After the CPU has powered up, the first call is made to the BIOS. The first step taken by the BIOS is to ensure the minimum hardware exists.
  3. The BIOS can be programmed with firmware. Firmware is the software that is programmed into Electrically Erasable Programmable Read-Only Memory (EEPROM). In this case, the firmware facilitates booting an operating system and configuring basic hardware settings.
  4. After confirming the existence of the CPU, Memory and Video Card, the BIOS configures them using CMOS. The CMOS serves as the memory of the BIOS where information like memory frequency and CPU frequency is stored. BIOS first sets the memory frequency on the memory controller an then multiplies the memory frequency by CPU frequency multiplier. This product is the speed at which the CPU runs.
  5. After setting the frequencies the BIOS performs POST (Power-on Self Test) where it checks if <ol style="list-style-type: lower-alpha;">
      <li>
        The memory is working
      </li>
      <li>
        Hard drives and other devices are responding
      </li>
      <li>
        Keyboard and mouse are connected
      </li>
      <li>
        Initialize any additional BIOSes (eg. RAID cards)
      </li>
    </ol>

  6. The system may beep in case the POST fails. One beep indicates success, three successive beeps indicate memory error and one long beep followed by two short beeps indicate a video card or display problem.
  7. Next, based on the boot order set through the BIOS, the device for booting is selected. Supported devices are CD-ROMs, USB flash drives, Hard Drives, a network.
  8. After selecting the particular drive to boot from, it looks at the first sector of that drive to find the boot sector. There are two main types of boot sectors/partition tables.

**Master Boot Record (MBR)**

  * Has two parts. **Boot loader information block** (448 bytes) and the **partition table** (64 bytes)
  * Boot loader is where the first program the computer can run is stored.
  * Partition table stores the logical layout of the drive

Since the space provided by the boot loader was becoming insufficient, a process called “chain boot loading” is used where the first program residing in the bootloader loads other programs from elsewhere into the memory is used. This new program then continues the boot process.

**GPT &#8211; GUID Partition Way**

  * Partitions are identified by Globally-unique ID (GUID) rather than partition numbers (MBR).
  * It supports unlimited partitions.
  * The address space allows storage devices greater than 2TB (limitation of MBR)
  * A backup copy of the partition table is stored at the end of the disk.

**Bootloader**

The purpose of the bootloader is to load the initial kernel and supporting modules into the memory. GRand Unified Bootloader (GRUB) is a widely used bootloader by many Linux distributions. GRUB is a “chain bootloader” and initialises itself in these stages

Stage 1: A very tiny application that can exist in the first part of the drive, it exists to load the next, larger part of the GRUB
  
Stage 1.5: Contains the drivers necessary to load the filesystem in Stage 2.
  
Stage 2: This stage loads the menu and config options for GRUB

**Kernel and Init**

The kernel is the main component of an OS which manages the memory and processor related tasks and also handles the various device drivers of different devices. Since it&#8217;s not possible to store every device driver in the kernel (it affects the boot speed), a component called RAM disk (part of RAM as a disk drive) is used on which enough drivers are used so that the kernel can load filesystem where the other drivers are located.

The init system is defined as the organizational scheme for loading the system services. The most common init system in Linux is called “System V init”.

After the ramdisk helps the kernel access the hard drive, the first process is run. i.e. /bin/init.

**Runlevels**

The init process reads from /etc/inittab to figure out which script to run. These scripts are run or not run based on the desired “runlevel” of the system.

The six runlevels are:

0: Halt the system
  
1: Singler-user mode (for special administration/troubleshooting)
  
2: Local Multiuser with Networking but without network service (like NFS)
  
3: Full Mutliuser with Networking
  
4: Not Used
  
5: Full Multiuser with Networking and X Windows(GUI)
  
6: Reboot

* * *

&nbsp;

## Shell Tools

  * <a>ps</a>

The `ps` command lists out all the running processes and accepts several arguments. Some useful ps recipes.
  
`ps aux`     : shows all running processes from a user standpoint.
  
`ps -lfU` : shows all processes owned by <username> in long format.

* * *

  * <a>top</a>

`top` shows the most CPU intensive processes in tabular format and refreshes it every second. Pressing `m` when `top` is running will sort the processes by memory usage rather than the default of processor usage.

* * *

  * <a>df</a>

`df    `   : Shows status of mounted filesystems:
  
`df -h`      : Shows status in human readable form
  
`df -h .` : Shows only the filesystem on which the current working directory is located.

* * *

  * <a>du</a>

Estimates the size on disk of a file/files.

`du -h` : Returns the information in human readable form

If a directory is provided as an argument to the command, it will return a value for each file in the directory. `du -sh` which will give a sum of all the files under the specified directory.

* * *

  * <a>find</a>

Finds files on the system. `find .` recursively walks the entire filesystem tree below the current working directory and prints out each file.

`find . -name 'user'` will again walk the entire filesystem recursively but only print out the files named &#8220;user&#8221;.
  
`find . -name "*.html"` will list out all html files.
  
`find . -name 'java' -type d` will only list directories while f will list out files.

* * *

  * <a>kill</a>

Kill is used to send a signal to a process. It is most commonly used to stop or kill a process.

`kill 123` : Sends TERM signal to process with PID 123
  
`kill -KILL 123` : Sends KILL signal (force-kills process) to process with PID 123

* * *

  * <a>ls</a>

Lists contents of a directory.

`ls -a` : Lists all files and directories include hidden ones
  
`ls -l` : Lists info in long format.

* * *

  * <a>lsof</a>

Lists open files. Useful in determining what files are being used by a user or process.

* * *

  * <a>man</a>

Opens the manual pages for the specified command.

`man -k` : Searches through the man pages using the search term provided.

* * *

  * <a>mount</a>

Mounts filesystems.

`mount -t ext4 /dev/sda /mnt` : Mounts /dev/sda on mount point /mnt. The &#8216;-t&#8217; switch indicates the the filesystem type.
  
`mount` : Lists the filesystems currently mounted on the system.
  
`mount /home` : The mount command will look into /etc/fstab and mount whatever partition is associated with the &#8216;/home&#8217; entry.
  
`mount -o loop -t iso9660 /home/isos/ubuntu.iso /mnt/cdrom` : Mounts the iso file to /mnt/cdrom
  
`mount  -o remount, ro /` : Remounts the / filesystem as read-only.

* * *

  * <a>cat</a>

Outputs contents of a file.

`cat /home/foo.txt:` Outputs contents of file &#8220;foo.txt&#8221; on the shell
  
`cat /tmp/foo.txt /home/jdoe/bar.txt > /home/jdoe/foobar.txt:`Outputs contents of files &#8220;foo.txt&#8221; and &#8220;bar.txt&#8221; to &#8220;foobar.txt&#8221; (will overwrite contents of &#8220;foobar.txt&#8221; if any)

* * *

  * <a>cut</a>

`cut` cuts out specified portions of text

`cat students.txt`
  
John Doe|25|john@example.com
  
Jack Smith|26|jack@example.com
  
Jane Doe|24|jane@example.com

`cut -f1 -d| students.txt`
  
John Doe
  
Jack Smith
  
Jane Doe

where -f specifies the field number, -d specifies the delimiter

* * *

  * <a>awk</a>

`awk` is used to extract and manipulate data from files.

`cat students.txt`
  
John Doe|25|john@example.com
  
Jack Smith|26|jack@example.com
  
Jane Doe|24|jane@example.com

`awk '{print $4, $1}' students.txt`
  
john@example.com John
  
jack@example.com Jack
  
jane@example.com Jane

The -F flag can be used for custom delimiters
  
`cat students.txt`
  
John Doe &#8211; 25 &#8211; john@example.com
  
Jack Smith &#8211; 26 &#8211; jack@example.com
  
Jane Doe &#8211; 24 &#8211; jane@example.com

`awk -F '-' '{print $1, $3}' students.txt`
  
John Doe john@example.com
  
Jack Smith jack@example.com
  
Jane Doe jane@example.com

Specific rows can be extracted using the NR flag
  
`awk 'NR==2' students.txt`
  
Jack Smith &#8211; 26 &#8211; jack@example.com

* * *

  * <a>sort</a>

sort is used to sort lines of text using parameters

The default action sorts the lines alphabetically
  
`cat coffee.txt`
  
Mocha
  
Cappuccino
  
Espresso
  
Americano

`sort coffee.txt`
  
Americano
  
Cappuccino
  
Espresso
  
Mocha

The -r flag sorts it in reverse order
  
`sort -r coffee.txt`
  
Mocha
  
Espresso
  
Cappuccino
  
Americano

For number sorting, use the -n flag
  
`sort orders.txt`
  
1003 Americano
  
100 Mocha
  
25 Cappuccino
  
63 Espresso

`sort -n orders.txt`
  
25 Cappuccino
  
63 Espresso
  
100 Mocha
  
1003 Americano

* * *

  * history

It gives you a list of commands that were run by the current user. These commands are stored in a hidden file called &#8220;bash_history&#8221; located in the user&#8217;s home directory. The command history are accompanied by a index number. In order to clear a specific command use

`history -d <line-number>`

To clear multiple lines, say lines 1800 to 1815 write the following in  To clear lines from let&#8217;s say line 1800 to 1815 , use the following command:

    for line in $(seq 1800 1815) ; do history -d 1800; done

<div>
  <div>
    If you want to delete the history for the deletion command, write 1816 (1815 +1) and the history for that sequence will be deleted along with the deletion command too.
  </div>
</div>
