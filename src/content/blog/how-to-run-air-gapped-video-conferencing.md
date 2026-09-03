---
title: "How to Run Air-Gapped Video Conferencing for Maximum Internal Security"
description: "How defense contractors, intelligence agencies, and high-security enterprises run real-time video, audio, and screen-share entirely offline with zero vendor trust."
pubDate: 2026-08-31
category: "Security"
tags:
  - "security"
  - "self-hosted"
  - "infrastructure"
  - "government"
readTime: 24
author: "The Ollasync team"
authorRole: "Security & product"
cover: "/blog-cover-server-blind.png"
pillar: false
pillarSlug: "self-hosted-video-conferencing"
keywords:
  - "air-gapped video conferencing"
  - "offline video meetings"
  - "SCIF video conferencing"
  - "sovereign video communications"
  - "isolated network WebRTC"
takeaways:
  - "Total Network Isolation: Air-gapped video conferencing runs entirely inside a physically or logically disconnected network with no route to the public internet, eliminating remote exploitation as an attack vector."
  - "Beyond Zero-Trust: Removes the untrusted network path itself, defending against nation-state traffic analysis, timing correlation, and transport-level exploits."
  - "The Media Problem: Real-time audio and video demand sub-150ms latency, sustained throughput, and internal relay mechanisms without public STUN/TURN dependencies."
  - "Controlled Data Diodes: Unidirectional hardware diodes and audited transfer stations replace ad-hoc USB transfers, closing the single most common air-gap breach vector."
  - "Complementary Defense: Pairs network isolation with client-side MLS encryption, physical facility security, and TEMPEST emission controls."
---

Somewhere between *"we trust our cloud vendor"* and *"we trust absolutely no one"* sits a hard boundary that a small number of organizations must cross: defense contractors handling classified programs, intelligence directorates, nuclear operators, industrial control system teams, and financial institutions operating sovereign trading networks that cannot touch the public internet. For these teams, even a zero-trust, end-to-end encrypted SaaS platform is one bridge too far — because the moment a packet leaves the perimeter, however strongly encrypted, it has left the building.

Air-gapped video conferencing exists to solve this dilemma: delivering real-time collaboration for distributed secure teams without ever routing a single frame across an external network.

In practice, real-time media was never originally designed for air gaps. Standard WebRTC expects elastic bandwidth, dynamic cloud relays, and SaaS-delivered updates. An air-gapped facility permits none of that. Bridging the two requires re-evaluating core architectural assumptions. For cryptographic foundations, see our deep dive on [end-to-end encryption vs. in-transit encryption in video calls](/blog/end-to-end-encryption-vs-in-transit-encryption-in-video-calls) and our analysis of [why government agencies and defense contractors need secure video conferencing](/blog/why-government-agencies-and-defense-contractors-need-secure-video-conferencing).

This guide walks through what air-gapped video conferencing actually entails, why teams choose it, the 5 technical pillars required, a realistic threat model, hardware sizing, and a complete operational blueprint.

## What "Air-Gapped Video Conferencing" Actually Means

An air gap is an isolated network with no direct or indirect path to external, untrusted networks — including the public internet, partner extranets, and unmanaged Wi-Fi. No firewall rule, VPN tunnel, or cloud API call connects the enclave to the outside world. Any data transfer across the perimeter must occur through a deliberate, physically audited process.

Every functional component of the platform must live strictly within the boundary:

- **Signaling Servers:** Room membership, session negotiation, and call setup run on hardware located inside the enclave — never a cloud-hosted control plane.
- **Media Relays (SFUs):** Routing audio, [video meetings](/features/video-meetings), and screen-sharing packets operates exclusively on internal subnets without public STUN/TURN relays.
- **Identity & Directory Services:** Authentication verifies against internal directories (classified Active Directory forests or internal PKI) rather than public IdPs.
- **Update Pipelines:** Software packages are staged, scanned, and imported via controlled one-way hardware diodes rather than pulling from public container registries.
- **Archival & Recordings:** Media is stored on internal disks under local classification policies via secure [recording pipelines](/features/recordings) — never uploaded to vendor buckets.

Air-gapping does not ask the network to withstand hostile transit — it eliminates external network reachability entirely. Zero-trust SaaS assumes the internet is hostile and defends cryptographically packet by packet. Air-gapping ensures no remote adversary has a packet route into the environment in the first place.

<div class="callout">
<strong>Important Note:</strong> A platform that is merely "on-premise" but regularly phones home to cloud servers for licensing validation or telemetry is not air-gapped. True air-gapping means the platform stays fully operational indefinitely with all external cables physically disconnected.
</div>

## Why Enterprises Choose Air-Gapping Over Cloud or Even Zero-Trust SaaS

Even with zero-trust encryption preventing vendors from decrypting media payloads, organizations choose air-gapping due to four primary drivers:

### 1. Classification and Clearance Requirements
Facilities handling classified national security systems, controlled unclassified information (CUI), or special-access programs are legally mandated to operate on isolated enclaves. Cryptographic cloud assurances do not satisfy statutory mandates requiring physical network isolation.

### 2. Defense Against Nation-State Network-Level Attacks
While payload encryption protects meeting contents, sophisticated adversaries can still execute timing analysis, traffic correlation, denial-of-service, or metadata surveillance against transport paths. By tracking packet frequency and sizing patterns across transit routes, an adversary can infer who is meeting with whom, when sessions begin, and the volume of information exchanged. Severing external connectivity eliminates this entire transport-level attack surface.

### 3. Elimination of Supply-Chain and Update-Channel Risk
Modern cloud collaboration tools depend on continuous live connections for updates, telemetry, and license checks — introducing potential supply-chain injection paths. If a vendor's build pipeline or signing key is compromised, malicious code can be pushed directly into client devices. Air-gapped environments replace continuous update channels with cryptographically signed, manually vetted offline release packages inspected prior to ingestion.

### 4. Operational Continuity Independent of External Infrastructure
Facilities that cannot tolerate external downtime — whether from fiber cuts, undersea cable disruptions, satellite jamming, or vendor cloud outages — require collaboration tools that function reliably when completely cut off from the global internet. An air-gapped system operates with zero external dependencies, guaranteeing internal operational resilience under any geopolitical or technical contingency.

While zero-trust architectures serve [financial institutions](/use-cases/finance), [legal practices](/use-cases/legal), and [healthcare organizations](/use-cases/healthcare) exceptionally well, air-gapping serves teams whose threat models mandate complete isolation.

## Air-Gapped vs. Self-Hosted vs. Zero-Trust Cloud: Choosing the Right Isolation Level

IT teams often view self-hosting, zero-trust, and air-gapping as interchangeable. In practice, each draws distinct trust boundaries:

| Architectural Dimension | Zero-Trust Cloud SaaS | [Self-Hosted](/self-hosted) (Private Cloud / VPC) | Fully Air-Gapped |
| :--- | :--- | :--- | :--- |
| **Internet Connectivity** | Required; platform lives on public internet | Required for VPC egress, but traffic is restricted | None — no route to external networks exists |
| **Media Payload Protection** | Encrypted client-side; vendor cannot decrypt | Encrypted client-side; operator controls all keys | Encrypted client-side; keys never leave the enclave |
| **Update & Patch Delivery** | Automatic, live, vendor-pushed | Scheduled; pulled from private registries | Manual, offline, cryptographically verified import |
| **Identity Provider** | Cloud IdP (Okta, Azure AD) over internet | Cloud or on-prem IdP, operator's choice | On-prem IdP or dedicated internal PKI only |
| **Primary Threat Addressed** | Vendor insider access, cloud subpoena exposure | Multi-tenant co-location, infrastructure control | Remote network exploitation, external reachability |
| **Typical Adopters** | Regulated enterprises (finance, legal, health) | [Government agencies](/use-cases/government), sovereign clouds | Defense, intelligence, nuclear/SCADA, classified |
| **Operational Overhead** | Low — vendor manages infrastructure | Moderate — internal DevOps manages compute | High — dedicated transfer hardware and personnel |

If an organization's primary concern is vendor confidentiality and data sovereignty, standard [self-hosted deployment](/self-hosted) provides complete control with lower friction. When regulations require complete network severance, air-gapping is the only architecture that satisfies the requirement.

## The 5 Core Pillars of an Air-Gapped Video Architecture

Building a real-time communications stack without public internet access requires re-engineering standard WebRTC assumptions across five foundational pillars:

### 1. Fully Internal Signaling and Media Relay Infrastructure
Every signaling server, Selective Forwarding Unit (SFU), and TURN relay resides on hardware inside the isolated boundary. In public cloud deployments, clients rely on public STUN servers (like Google's or Cloudflare's) to discover public reflexive IP addresses. In an air-gapped facility, STUN reflection must be handled internally or bypassed entirely through flat, non-NAT routed network architectures. DNS resolution, internal certificate revocation endpoints, and NTP time synchronization must resolve locally without external fallbacks.

### 2. Client-Side End-to-End Media Encryption Within the Enclave
Even within an isolated perimeter, media must stay encrypted end-to-end between endpoints using WebRTC Insertable Streams and Messaging Layer Security (MLS). Air-gapping protects the perimeter; encryption defends against insider threats, compromised intermediate switches, and lateral movement. Cryptographic key distribution happens client-to-client through ratcheted MLS group state, ensuring media relays route only opaque ciphertext blocks.

### 3. Offline Software Supply Chain and Package Management
Container images, browser builds, and dependencies are downloaded once onto an isolated staging host, verified against cryptographic checksums, signed with internal enterprise keys, and moved across the perimeter via one-way hardware diodes. No server or endpoint inside the running enclave ever attempts an outbound HTTP request to an external CDN, repository, or telemetry collector.

### 4. Internal Identity, PKI, and Directory Services
Authentication resolves against internal identity infrastructure (such as Smart Card / PIV-based PKI, isolated Active Directory forests, or air-gapped OpenID Connect providers). Sessions issue short-lived, cryptographically signed JSON Web Tokens (JWTs) that validate against internal certificate authorities without contacting external revocation servers.

### 5. Controlled, Audited Cross-Boundary Data Transfer
Because meeting recordings, security logs, or patch packages must occasionally cross boundaries, deployments must enforce auditable, hardware-governed transfer pipelines rather than ad-hoc USB drives. Every transfer requires formal dual-authorization, full-disk cryptographic hashing, and automated logging to maintain chain-of-custody records.

<div class="callout">
<strong>Pro Tip on Enclave Services:</strong> Video deployments frequently fail inside enclaves due to silent timeouts when certificate validation libraries attempt to reach external OCSP responders. Ensure all certificate revocation lists (CRLs) and OCSP endpoints point exclusively to internal authorities, or configure clients to trust local CA distribution points.
</div>

## Threat Model: What Air-Gapping Defends Against (and What It Doesn't)

Air-gapping is a specialized control, not universal security immunity. Evaluating its specific defensive strengths and limitations is critical for realistic security engineering:

| Threat Vector | Effect of Air-Gapping | Residual Risk Level |
| :--- | :--- | :--- |
| **Remote network intrusion / internet exploitation** | Eliminated — no reachable path exists for remote attackers | **NONE** |
| **Cloud vendor subpoena or hypervisor compromise** | Eliminated — no cloud vendors or shared hardware involved | **NONE** |
| **Software supply-chain injection via live update channels** | Substantially reduced — updates require signed, manual import | **LOW** |
| **Malicious insider with physical facility access** | Not mitigated by network isolation alone | **MODERATE–HIGH** |
| **Removable media malware introduction across boundary** | Not eliminated — remains the most common air-gap breach vector | **MODERATE** |
| **Acoustic, electromagnetic, or optical covert channels** | Not addressed by network isolation; requires TEMPEST shielding | **LOW–MODERATE** |
| **Endpoint compromise via infected peripheral firmware** | Reduced by hardware controls, but not eliminated by network isolation | **MODERATE** |

Historical breaches of air-gapped networks (such as Stuxnet or Agent.BTZ) succeeded not by breaking through the network perimeter remotely, but by exploiting infected removable media during manual maintenance. Consequently, network isolation must be integrated into a defense-in-depth framework including physical facility security, strict hardware provenance, and rigorous media sanitization.

Furthermore, academic security research has documented covert exfiltration channels utilizing memory bus radio emissions, fan acoustic modulation, and status LED flashing. In high-assurance environments like Sensitive Compartmented Information Facilities (SCIFs), network isolation is therefore complemented by TEMPEST-certified shielding and optical isolation filters.

## Moving Data Across the Gap: Diodes, Sneakernets, and Controlled Interfaces

While real-time video calls remain strictly internal, administrative workflows occasionally require cross-boundary transfer: bringing software patches in, or exporting cleared [secure recordings](/features/recordings) and transcripts.

### Unidirectional Data Diodes
Data diodes are physical hardware components engineered so data can only travel in one direction across a fiber-optic link, with the receiving side physically incapable of transmitting anything back. A transmitting photodiode points at a receiving optical sensor over a single strand of fiber with no return path. Signed update packages pass one-way into the enclave through an ingress diode; nothing flows outward across that link. Where exports are required, a separate, independently governed egress diode or manual transfer station handles outbound data.

### Transfer Stations & Content Disarm
Transfer stations replace unmonitored USB copying. A dedicated, non-networked workstation scans removable media against multiple antimalware and Content Disarm and Reconstruction (CDR) engines, logging operator identity, serial numbers, and file hashes before granting entry. 

For recorded sessions, facilities often enforce re-encoding on export: video is captured and re-rendered through an isolated pipeline, stripping hidden steganographic data structures from raw container files.

## Compliance & Regulatory Alignment (FedRAMP High, ITAR, NIS2, HIPAA)

For many high-security institutions, air-gapping is a regulatory necessity:

- **FedRAMP High & DoD Impact Level 5/6:** Mandates strict network separation for systems processing classified or high-impact defense data, requiring complete absence of commercial internet routing.
- **ITAR & Export Controls:** Prohibits unauthorized foreign person access to defense technical data, eliminating third-party cloud intermediaries and shared multi-tenant hosting environments.
- **NIS2 Directive (EU):** Requires operators of essential infrastructure (energy, water, transport) to isolate critical operational collaboration tools from corporate business networks.
- **HIPAA for High-Containment Research:** Genomic and specialized clinical research units frequently isolate patient communications from commercial hospital networks to maintain total patient confidentiality.

## Hardware & Network Sizing for Isolated Facilities

Air-gapped media servers cannot rely on elastic cloud auto-scaling; hardware allocations must be provisioned for peak concurrency upfront:

| Facility Scale | Active Capacity Targets | Dedicated Hardware Allocation | Internal Network Throughput |
| :--- | :--- | :--- | :--- |
| **Single Secure Room / SCIF** | Up to 5 Active Rooms, 50 Concurrent Streams | 8 vCPU cores, 16 GB RAM, redundant local SSDs | 1 Gbps internal switch fabric |
| **Facility-Wide Deployment** | Up to 30 Active Rooms, 400 Concurrent Streams | 24 vCPU cores, 48 GB RAM across 2 redundant nodes | 10 Gbps internal backbone |
| **Multi-Site Classified Network** | 100+ Active Rooms, 1,500+ Concurrent Streams | 3x SFU Nodes (16 vCPU/32GB) + redundant relays | 25+ Gbps dedicated fiber |

<div class="callout">
<strong>Redundancy Requirement:</strong> Because isolated enclaves lack public cloud fallback, every production tier must maintain N+1 hardware redundancy with on-site cold spares and documented failover runbooks.
</div>

## Step-by-Step Implementation Blueprint

Standing up an air-gapped communications facility involves four sequenced phases:

### Phase 1: Boundary & Dependency Definition
- Audit and document the isolated perimeter with facility security officers to confirm no undocumented network paths, secondary Wi-Fi interfaces, or bridged management interfaces exist.
- Deploy an internal Certificate Authority (CA) and distribute root trust to internal client endpoints via mobile device management (MDM) profiles.
- Establish internal NTP time daemons and DNS resolvers to prevent dependency timeouts during WebRTC session negotiation.

### Phase 2: Offline Supply-Chain Setup
- Construct a dedicated staging environment with controlled internet access to download, hash, and sign container images and client binaries.
- Connect one-way data diodes to import verified packages into the internal registry.
- Establish an offline patching schedule balancing vulnerability remediation against review overhead.

### Phase 3: Platform Deployment & Endpoint Hardening
- Deploy signaling containers and zero-knowledge SFU nodes on internal hosts configured exclusively for internal service resolution.
- Harden desktop clients: disable telemetry reporting, cloud auto-update checks, and external CDN dependencies that would otherwise fail open or leak metadata.
- Enforce client-side end-to-end media encryption via WebRTC Insertable Streams and MLS.

### Phase 4: Governance, Auditing & Operational Drills
- Deploy automated SIEM log aggregation across signaling nodes and transfer stations with strict anomaly detection.
- Enforce dual-custody approval for any media exported across the facility boundary.
- Conduct regular red-team drills targeting physical transfer stations and removable media policies.

## Total Cost of Ownership: Air-Gapped vs. Multi-Tenant SaaS

Air-gapped architectures eliminate recurring per-seat software licensing fees, shifting costs toward hardware and boundary governance:

### Financial Analysis (500-Seat Isolated Facility Deployment)

| Expense Category | Multi-Tenant Commercial SaaS | Air-Gapped Isolated Infrastructure |
| :--- | :--- | :--- |
| **Annual User Seat Licenses** | $120,000 / year ($20/user/month) | **$0** (Self-managed stack) |
| **Compute & Host Infrastructure** | Included in subscription | **$14,000 / year** (Redundant on-site hardware) |
| **Internal PKI & Certificate Management** | Vendor-controlled (N/A) | **$6,000 / year** (Internal CA operation) |
| **Data Diode / Transfer Station Hardware** | Not applicable | **$22,000** one-time + **$4,000 / year** maintenance |
| **Staging Network & Update Governance** | Included in subscription | **$16,000 / year** (Staging & security review) |
| **Internal DevSecOps & IT Support** | Included in subscription | **$48,000 / year** (Dedicated operational allocation) |
| **Total Annual Overhead (after Year 1)** | **$120,000** | **$88,000** |
| **Year 1 Total (including one-time hardware)** | **$120,000** | **$110,000** |

By the end of Year 1, an isolated on-premises deployment is already cost-competitive with commercial SaaS, and annual overhead drops significantly from Year 2 onward while allowing unlimited user growth without licensing penalties (see our [transparent pricing overview](/pricing)).

## Frequently Asked Questions (FAQs)

<details class="faq-item">
<summary>Can an air-gapped video platform support screen-sharing, recording, and chat?</summary>

Yes. All collaboration features run within the isolated network using internal signaling servers, SFU nodes, and client-side encryption. Recordings write directly to local NVMe/S3 storage, and exported media passes through audited transfer stations.
</details>

<details class="faq-item">
<summary>How do users join an air-gapped call without internet access?</summary>

Clients connect over the internal local area network or private fiber backbone. Meeting URLs resolve against an internal DNS zone, and user credentials validate against the facility's on-premises Active Directory or PKI.
</details>

<details class="faq-item">
<summary>Does air-gapping prevent software updates?</summary>

No. Updates arrive through an audited offline workflow: container images are verified and cryptographically signed in a staging environment, then imported across the boundary using a unidirectional hardware data diode.
</details>

<details class="faq-item">
<summary>Is air-gapped video conferencing the same as end-to-end encrypted video conferencing?</summary>

No. End-to-end encryption protects message payload confidentiality across untrusted networks. Air-gapping removes the untrusted network path entirely. Production systems employ both: encryption prevents unauthorized internal eavesdropping, while isolation blocks remote network exploits.
</details>

<details class="faq-item">
<summary>What is the single greatest security risk in an air-gapped deployment?</summary>

The greatest vulnerability is the human transfer process. Unvetted USB drives and ungoverned update mechanisms represent the primary real-world breach vector for isolated environments. Strong transfer governance is as critical as network severance.
</details>

## The Bottom Line

Air-gapped video conferencing is not an extreme variant of zero-trust architecture — it is a distinct defensive posture designed for high-assurance threat models. Where zero-trust cryptographically neutralizes untrusted transit, air-gapping eliminates transit altogether, satisfying strict statutory mandates across defense, intelligence, and critical infrastructure.

Success requires more than disconnecting an ethernet cable: it demands an end-to-end internal media stack, resilient offline supply chains, and rigorous transfer governance. Organizations that secure their boundary crossings build communications environments capable of withstanding the most determined adversaries.

Ready to evaluate air-gapped or self-hosted communications for your organization? Explore our [security & compliance solutions](/security), review our [self-hosted deployment options](/self-hosted), or [contact our infrastructure security team](/pricing) for a technical briefing.

## Related Reading

- **Security** — [End-to-End Encryption vs. In-Transit Encryption in Video Calls](/blog/end-to-end-encryption-vs-in-transit-encryption-in-video-calls): How enterprise IT enforces cryptographic media boundaries.
- **Compliance** — [HIPAA Compliant Video Conferencing Checklist](/blog/hipaa-compliant-video-conferencing-checklist): Key controls for securing clinical communications.
- **Government & Defense** — [Why Government Agencies and Defense Contractors Need Secure Video Conferencing](/blog/why-government-agencies-and-defense-contractors-need-secure-video-conferencing): Navigating ITAR, FedRAMP High, and sovereign enclave requirements.
