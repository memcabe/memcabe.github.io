---
id: intro
title: FTHPC Lab Compute Resources
slug: /
---

# FTHPC Lab
Welcome to the FTHPC Resource Documentation.

This site provides an overview of the system architecture, compute nodes, networking, storage, and operational procedures for both of our clusters; Mount Olympus and The Foothills.

---

## Cluster Overview

Olympus is a multi-node, homogeneous cluster designed for high-performance workloads and distributed computing.

- Multiple compute nodes (with and without GPUs)
- Shared storage system
- Xcat provisioning
- Slurm job manager
- Centralized user management
- Custom automation scripts

Foothills is a multinode, heterogenous cluster designed for a wide variety of workflows and distributed computing.

- Low-power Intel Nuc head node
- Three sub-clusters including 20 RaspberryPis, 2 Jetson Nanos, and 2 Desktop workstations
- Open network for jobs with customized hardware arrangements
- Shared storage
- Ansible config management
- Centralized user management
- Custom automations scripts

---

## Documentation Sections

- **Olymous** – Our larger of the two clusters, built for big jobs that require a lot of compute.  
- **Foothills** – Our smaller cluser, built for a wide variety of interactive and scripted jobs on low-power hardware.
