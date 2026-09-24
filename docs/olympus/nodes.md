---
id: nodes
title: Hardware and Network
---
# Hardware and Network Architecture

The Olympus cluster contains one head node, three CPU compute nodes, and two GPU compute nodes in a 48U rack. Ethernet supports management and routine connectivity while a separate InfiniBand fabric supports communication between nodes running parallel workloads.

## Hardware Overview

The three CPU nodes are completely identical except for hostname, as are the two GPU nodes.

| Role | Hostnames | Server | Processors per node | CPU cores/ threads per node | RAM per node |
| --- | --- | --- | --- | --- | --- |
| Head | `athena` | Dell PowerEdge R7515 | 1 × AMD EPYC 7313P | 16 / 32 | 125 GiB |
| CPU compute | `artemis`, `gaia`, `theia` | Dell PowerEdge R7625 | 2 × AMD EPYC 9654 | 192 / 192 | 754 GiB |
| GPU compute | `hades`, `hercules` | Dell PowerEdge XE8545 | 2 × AMD EPYC 7763 | 128 / 128 | Approximately 1.0 TiB |

Each GPU node contains **four NVIDIA A100-SXM4-40GB GPUs**, each reporting 40,960 MiB (40 GiB) of memory. Across the five compute nodes, the cluster provides a total of **832 physical CPU cores and eight GPUs**. The GPUs provide 320 GiB of VRAM in total, distributed across all GPUs.

All compute nodes expose one hardware thread per core, please keep this in mind when designing and running MPI workflows, thread count and core count are the same. 

## Local Storage

| Node class | Observed storage layout |
| --- | --- |
| Head | Approximately 2.9 TiB data disk, partitioned into 2.3 TiB at `/share` and 596 GiB at `/home`; separate 223.5 GiB system disk. |
| CPU compute | 894.3 GiB disk, including an 834 GiB partition at `/local_scratch`. |
| GPU compute | Two 1.5 TiB NVMe drives with mirrored RAID1 partitions for the system and approximately 1.4 TiB at `/local_scratch`. |

Capacities are rounded binary values from `lsblk`. Mirroring provides one usable copy of the data, so the two GPU-node drives do not provide twice the listed scratch capacity. Shared filesystem exports and client mounts can be found in the storage documentation.

## Beowulf Architecture

A Beowulf cluster combines independent Linux servers into a coordinated computing resource. Each node has its own processors, memory, and operating system. Multi-node applications distribute work and exchange data over the network; memory is not automatically pooled across machines.

- **Head node:** `athena` provides the central administration and management entry point.
- **CPU nodes:** `artemis`, `gaia`, and `theia` run CPU-intensive and large-memory workloads.
- **GPU nodes:** `hades` and `hercules` run GPU-accelerated workloads.

Slurm allocates resources and launches jobs on compute nodes. MPI enables cooperating processes to communicate across nodes. Provisioning, shared storage, and software management support this workflow. MPI workflows should NOT be launched without a slurm allocation, please read the slurm documentation page for more information.

## Ethernet and VLANs

The **Juniper EX4000-12P** provides Ethernet switching for cluster connectivity. Ethernet carries routine traffic such as SSH, provisioning, software distribution, and shared storage access.

VLANs separate internal cluster traffic from external connectivity on the same switching infrastructure:

| Network | Purpose |
| --- | --- |
| Internal VLAN | Communication among cluster systems, including management, provisioning, and internal services. |
| External VLAN | Connections to the upstream network for systems that require external access (eg. downloading new packages, datasets, or pinging public APIs). |

VLANs create separate Layer 2 broadcast domains. Communication between them requires routing, with access governed by routing and firewall policies. Actual VLAN IDs, port assignments, uplink speeds, and the routing gateway have not yet been recorded. In short, all compute nodes have "Internet Access". Outgoing traffic is routed through and regulated by 'athena'. Should you encounter any issues connecting to the internet, please notify the system administrator.

## InfiniBand Fabric

The high-performance network uses a **Mellanox/NVIDIA Quantum QM8790 HDR InfiniBand switch** and **ConnectX-6 adapters**, as listed in the hardware inventory. This fabric supports low-latency, high-bandwidth communication for multi-node workloads.

For example: on `hades`, the supplied diagnostics show:

| Interface | Adapter | Link state | Reported rate |
| --- | --- | --- | --- |
| `ib0` | `mlx5_0`, port 1 | Active / LinkUp | 200 Gb/s |
| `ib1` | `mlx5_1`, port 1 | Active / LinkUp | 200 Gb/s |

All compute nodes share the same hardware configuration, but these observed link states apply specifically to `hades`. Two 200 Gb/s links do not establish a bonded 400 Gb/s connection or guarantee that an application uses both.

Applications use the fabric through compatible communication libraries and the host RDMA drivers. **Spack can build MPI and supporting libraries with InfiniBand support**; application performance also depends on runtime configuration. See software documentation for software build instructions.

## Power and Cooling

The rack relies on the servers' internal fans and chassis airflow. Compute and network infrastructure uses C13/C19 power cables for PDU connections.

Competition notes estimated roughly 6 kW for the cluster and specified a 4.5 kW competition budget with 2 kW per-node cap targets. These are historical planning figures, not verified current power draw or active limits. Use measured power when assessing operation; component TDP values are not whole-system consumption.
