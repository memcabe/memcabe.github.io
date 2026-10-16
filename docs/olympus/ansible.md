---
id: ansible
title: Ansible Documentation
---

# Ansible Documentation

This document outlines the steps taken to install, configure, and use ansible. The first use case for ansible on Olympus is user management. This means, initially, all setup steps were taken with the sole purpose of managing and maintaining user accounts on the cluster. It is safe to assume that any other use cases were ignored during setup and future admins should start from “scratch” when implementing new functionality.

## Configuration

I used a Python 3.11.13 virtual environment located in `/opt/ansible/venv`

Before working with the ansible config, you should do:

```bash
source /opt/ansible/venv/bin/activate
```

And

```bash
cd /root/ansible
```

Your CLI prompt should change to:

```text
(venv) [root@athena /]#
```

Verify the python and pip versions before continuing:

```text
(venv) [root@athena /]# python --version
Python 3.11.13
(venv) [root@athena /]# pip --version
pip 22.3.1 from /opt/ansible/venv/lib64/python3.11/site-packages/pip (python 3.11)
```

The current version of ansible and dependencies at the time of writing is:

```text
(venv) [root@athena /]# ansible --version
ansible [core 2.19.13]
  config file = /root/ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /opt/ansible/venv/lib64/python3.11/site-packages/ansible
  ansible collection location = /root/.ansible/collections\:/usr/share/ansible/collections
  executable location = /opt/ansible/venv/bin/ansible
  python version = 3.11.13 (main, Aug 28 2025, 15:10:45) [GCC 8.5.0 20210514 (Red Hat 8.5.0-28)] (/opt/ansible/venv/bin/python3.11)
  jinja version = 3.1.6
  pyyaml version = 6.0.3 (with libyaml v0.2.5)
```

Ansible project directories are located in `/root/ansible`

## Ansible Inventory

Ansible inventory holds information about our cluster topology. We define the ansible inventory using the file `/root/ansible/inventory/hosts.yml`. After sourcing the ansible venv, you can check the cluster topology using the `ansible-inventory` command. At time of writing, a visualization of our topology looks like this:

```text
(venv) [root@athena ansible]# ansible-inventory --graph
@all:
  |--@ungrouped:
  |--@head:
  |  |--athena
  |--@compute:
  |  |--@cpu:
  |  |  |--@cpu_genoa:
  |  |  |  |--artemis
  |  |  |  |--gaia
  |  |  |  |--theia
  |  |--@gpu:
  |  |  |--@gpu_a100:
  |  |  |  |--hades
  |  |  |  |--hercules
```

This inventory was designed specifically to manage hardware and software compatibility and allow for scaling. For example, if we were to get B200 nodes (a boy can dream), we would simply add a child group `gpu_b200` to the gpu group and add the host name(s) to the new gpu_b200 group. Should the cluster receive hardware that will not be used for SCC, we could group the hardware separately in order to address nodes by use-case.

We can also run `ansible-inventory --list` to verify that our syntax correctly translates to json representation.

In the same `hosts.yml` you may notice the line:

```yaml
ansible_python_interpreter: /share/software/spack/opt/spack/linux-zen/python-3.11.15-7roou7ljrbcntprthxndpeael2v33f7s/bin/python3
```

The python package we are using with ansible was installed with spack. Since Spack installations are stored in an NFS mounted directory, we can tell ansible to use this interpreter when configuring compute nodes. When we tell ansible to run a playbook on any compute node, it parses this variable which directs ansible to this specific python installation which can be accessed by any node. This is a simple method for ensuring that ansible operates predictably across the cluster.

You can test the ansible inventory by pinging groups with the following command:

```bash
ansible compute -m ping
```

## Playbooks

Playbooks define the tasks Ansible runs on a given set of nodes. They are written in YAML and can be used to run audits or apply configuration changes.

Our first playbook is a simple user audit. The user audit play book lets us check what user accounts exist on a given set of nodes. It uses the `getent` command to read the node’s passwd database, collects information about an account’s username, UID, GID, and home directory before printing the information as output. It is important to note that this audit does not change anything, and a `changed=0` in the output is both expected and necessary.

As we continue to develop the user management suite, user-audit should eventually show the differences in user accounts between nodes. This will help us identify behavior once we start automating user control, and will become a useful debugging tool.

Run the user audit playbook by doing:

```bash
ansible-playbook playbooks/audit-users.yml
```

## Roles

Roles are self-contained, reusable collections of tasks, variables, files, and templates. The first role we will develop is a `users` role. It will be responsible for local account states and semantics. Eventually, our users role will handle: user creation, user removal, UID/ GID assignment, group management, password management, and home directories.

Generally, all of this information should be treated as sensitive/ confidential. Sudo permissions are already required to enter our ansible directory and ssh encrypts every message with a key pair but passwords should never be stored in plain-text anywhere. Ansible provides an encryption mechanism `ansible-vault encrypt <config_name>.yml`, and we WILL eventually use this to store passwords.

User management should be a careful endeavor. System services often create users to handle application specific tasks (think journalctl, the service owns the log files and you must ask it to retrieve them for you). For that reason, our goal with user management is to compare existing users on the head node and a given compute node. Should there be any differences, we should NOT interpret that as “remove users that don’t match the config”, only “add users from the config that I don’t see on this node”.

## Add a Cluster User

I created an Ansible role to add users.

The role creates a same-name primary group on every node, creates the user with an explicitly assigned UID and GID, and sets `/bin/bash` as the login shell. It creates the home directory only on Athena because Athena exports `/home` to the compute nodes through NFS.

I configured the role to generate an Ed25519 SSH key on Athena and add its public key to the user’s `authorized_keys` file. Because `/home` is shared, the key is available on every node and enables passwordless SSH between cluster nodes.

Run the playbook with:

```bash
ansible-playbook -i inventory/hosts.yml playbooks/add-user.yml -e "user_name=USERNAME user_uid=UID user_gid=GID"
```

Preview the changes before applying them with:

```bash
ansible-playbook -i inventory/hosts.yml playbooks/add-user.yml --check --diff -e "user_name=USERNAME user_uid=UID user_gid=GID"
```

The role is idempotent. Running it again with the same values should report `changed=0`. A warning about an existing SSH private key is expected because Ansible preserves the existing key instead of replacing it.

I tested the role using `testuser1` with UID and GID 2017. The account and group were created successfully on Athena and all five compute nodes. I also verified passwordless SSH access to a compute node.

This minimal version does not manage passwords, remove accounts, assign supplementary groups, or automatically detect UID and GID conflicts.

## Delete a Cluster User

Removes a user and their same-name group from all nodes. Deletes their shared home directory and all its files from Athena. Other groups remain unchanged. Requires typing the username to confirm.

```bash
ansible-playbook -i inventory/hosts.yml playbooks/delete-user.yml
```

It will ask for the username. Add `--check --diff` to preview without making changes, or `-K` if a sudo password is required.

## Dell DSU Repository Setup

Downloads and runs Dell’s bootstrap script on all compute nodes, automatically importing GPG keys and configuring the Dell repository. Prints each node’s output, including whether keys already exist.

```bash
ansible-playbook -i inventory/hosts.yml playbooks/bootstrap-dsu.yml -K
```
