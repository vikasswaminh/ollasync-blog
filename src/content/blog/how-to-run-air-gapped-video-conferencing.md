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
readTime: 32
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

Somewhere between "we trust our cloud vendor" and "we trust absolutely no one" sits a hard line that a small number of organizations have to cross: defense contractors handling classified program data, intelligence directorates, nuclear facility operators, industrial control system teams, and financial institutions running trading infrastructure that simply cannot touch the public internet. For these teams, even a zero-trust, end-to-end encrypted SaaS platform is one bridge too far — because the moment a packet leaves the building, however well it's encrypted, it has left the building.

Air-gapped video conferencing exists to solve exactly this problem: how do you give people the real-time collaboration that makes distributed classified work possible, without ever routing a single frame across a network that touches the outside world?

It sounds simple in theory. In practice, it's one of the harder infrastructure problems in enterprise IT, because real-time media was never designed with air-gaps in mind. Video conferencing wants elastic bandwidth, dynamic UDP ports, cloud-hosted TURN relays, and SaaS-delivered updates. An air-gapped facility wants none of that. Bridging the two requires rethinking almost every assumption a typical WebRTC deployment makes. For the cryptographic foundation this builds on, see our deep dive on [end-to-end encryption vs. in-transit encryption in video calls](/blog/end-to-end-encryption-vs-in-transit-encryption-in-video-calls) and our analysis of [why government agencies and defense contractors need secure video conferencing](/blog/why-government-agencies-and-defense-contractors-need-secure-video-conferencing).

This guide walks through what air-gapped video conferencing actually is, why organizations choose it even after adopting zero-trust cloud architecture, the core technical pillars that make it work, a realistic threat model (including what it does not protect against), and a full operational blueprint for standing up an isolated real-time communications facility.

## What "Air-Gapped Video Conferencing" Actually Means

An air gap, in the strict security engineering sense, is a network with no direct or indirect connectivity path to any external, untrusted network — including the public internet, partner extranets, and unmanaged Wi-Fi. No firewall rule, no VPN tunnel, no cloud API call bridges the two sides. If a device on the isolated network needs to exchange data with the outside world, that exchange happens through a deliberate, auditable, physical process — not a socket connection.

Every functional component of the platform must live inside the isolated boundary:

- **Signaling servers** coordinating room membership, session negotiation, and call setup run on hardware physically located inside the secure facility or classified network enclave — never a cloud-hosted SaaS control plane.
- **Media relays (SFUs)** routing audio, [video meetings](/features/video-meetings), and screen-share packets operate exclusively on the internal network, with no dependency on a public STUN/TURN service for NAT traversal.
- **Identity and directory services** authenticate users against an internal directory (often a classified-network Active Directory forest or dedicated PKI) rather than a cloud identity provider reachable only via the internet.
- **Software updates and dependency packages** are staged, scanned, and imported through a controlled one-way transfer process rather than pulled live from public registries or vendor update servers.
- **Recording, transcription, and archival storage** are written to internal disks under the facility's existing classification and retention policy via secure [recording pipelines](/features/recordings) — never uploaded to a vendor cloud bucket "for convenience."

The distinction that matters most to security architects is this: air-gapping doesn't ask the network to be trustworthy under adversarial conditions — it removes the network as an attack surface for remote actors entirely. A zero-trust cloud platform assumes the internet path is hostile and defends against it cryptographically, packet by packet. An air-gapped platform assumes there is no path for a remote adversary to reach in the first place, because none exists. That's a categorically stronger guarantee against remote compromise, though it introduces its own operational trade-offs teams frequently underestimate.

<div class="callout">
<strong>Important Note:</strong> It is worth being precise about terminology, because "air-gapped" gets used loosely in vendor marketing. A platform that is merely "on-premise" but still phones home to a vendor's cloud for licensing checks or telemetry is not air-gapped — it has a thin, overlooked connectivity path that defeats the entire purpose. True air-gapped deployment means the software stays fully operational, license validation included, with the network cable physically unplugged.
</div>

## Why Enterprises Choose Air-Gapping Over Cloud or Even Zero-Trust SaaS

Given that zero-trust, end-to-end encrypted video conferencing already removes the vendor's ability to decrypt media, it's fair to ask why any organization would take on the operational burden of full network isolation. The answer usually comes down to one of four drivers:

### 1. Classification and Clearance Requirements
Facilities handling classified national security information, controlled unclassified information (CUI), or special-access program data are frequently required — by regulation, not preference — to operate on networks with no internet connectivity at all. No cryptographic assurance about a cloud vendor substitutes for a requirement that the network itself must not touch the outside world.

### 2. Defense Against Nation-State Network-Level Attacks
Zero-trust encryption protects payload confidentiality even if the transport path is compromised, but a well-resourced nation-state adversary can still perform traffic analysis, timing correlation, denial-of-service, or exploit vulnerabilities in the TLS/DTLS stack before payload encryption even applies. Removing the reachable network path removes that entire attack surface, not just the confidentiality risk within it.

### 3. Elimination of Supply-Chain and Update-Channel Risk
Even a well-architected zero-trust SaaS platform depends on a live connection for updates, telemetry, and licensing — each a potential supply-chain vector, as demonstrated by real-world incidents where legitimate update mechanisms were hijacked to deliver malware. Air-gapped environments replace live update channels with manually vetted, signed offline packages, inspected before every import.

### 4. Operational Continuity Independent of External Infrastructure
Facilities that cannot tolerate any dependency on external connectivity — because of jamming risk, hostile-environment operations, or strict continuity mandates — need collaboration tools that keep functioning even if every external network path is severed. An air-gapped platform is, by definition, unaffected by an internet outage or a DDoS attack on a vendor's cloud, because it never depended on either.

None of this makes zero-trust cloud architecture obsolete — for most regulated enterprises in [financial institutions](/use-cases/finance), [legal practices](/use-cases/legal), and [healthcare organizations](/use-cases/healthcare), a well-implemented [security and compliance architecture](/security) delivers the right balance of security and convenience. Air-gapping answers the smaller set of organizations whose threat model or regulatory obligations specifically require removing the network path itself.

## Air-Gapped vs. Self-Hosted vs. Zero-Trust Cloud: Choosing the Right Isolation Level

Enterprise IT teams often conflate "self-hosted," "zero-trust," and "air-gapped" as if they sit on a single sliding scale. They don't — each answers a different question about where trust boundaries sit.

| Architectural Dimension | Zero-Trust Cloud SaaS | [Self-Hosted](/self-hosted) (Private Cloud / VPC) | Fully Air-Gapped |
| :--- | :--- | :--- | :--- |
| **Internet Connectivity** | Required; platform lives on public internet | Required for the VPC, but network can be restricted | None — no route to any external network exists |
| **Media Payload Protection** | Encrypted client-side; vendor cannot decrypt | Encrypted client-side; operator controls all keys | Encrypted client-side; keys never leave the isolated enclave |
| **Update & Patch Delivery** | Automatic, live, vendor-pushed | Automatic or scheduled, pulled from vendor registry | Manual, offline, cryptographically verified import only |
| **Identity Provider** | Cloud IdP (Okta, Azure AD) reachable over internet | Cloud or on-prem IdP, operator's choice | On-prem IdP or dedicated internal PKI only |
| **Primary Threat Addressed** | Vendor insider access, cloud subpoena exposure | Multi-tenant exposure, vendor infrastructure control | Remote network exploitation, external reachability entirely |
| **Typical Adopters** | Regulated enterprises (finance, legal, healthcare) | [Government agencies](/use-cases/government), large enterprises, sovereign clouds | Defense, intelligence, nuclear/ICS, classified programs |
| **Operational Overhead** | Low — vendor manages infrastructure | Moderate — internal ops team manages compute | High — dedicated transfer processes, hardware, and staff |

The practical decision point for most IT security leaders is whether the threat model includes a well-resourced adversary attacking the network path itself, or is primarily concerned with vendor trust and data sovereignty when evaluating options against platforms like [Zoom](/vs/zoom), [Microsoft Teams](/vs/microsoft-teams), [Google Meet](/vs/google-meet), or [Cisco Webex](/vs/webex). If the latter, [self-hosted deployment](/self-hosted) delivers enterprise control with far lower friction. If the former, or a regulatory mandate requires it, air-gapping is the only architecture that satisfies the requirement.

It's also common, and often correct, for large organizations to run a hybrid posture: zero-trust or self-hosted infrastructure for day-to-day business communications, with a separate, fully air-gapped deployment reserved for the subset of programs or clearance levels that require it. Treating air-gapping as a targeted control keeps the operational burden proportional to the actual risk.

## The 5 Core Pillars of an Air-Gapped Video Architecture

Building a video conferencing platform that functions entirely without internet connectivity requires re-engineering assumptions baked into almost every commercial WebRTC stack. Five pillars define a credible air-gapped deployment:

### 1. Fully Internal Signaling and Media Relay Infrastructure
Every signaling server, Selective Forwarding Unit (SFU), and TURN relay must be deployed on hardware physically located inside the isolated network boundary, with DNS, certificate authorities, and NTP time sources all served internally. There is no fallback to a public STUN server for NAT traversal — internal network topology has to be flat enough, or the relay smart enough, that clients can always reach the internal SFU directly.

### 2. Client-Side End-to-End Media Encryption Within the Enclave
Even inside an isolated network, media should stay encrypted end-to-end between participant endpoints using WebRTC Insertable Streams and Messaging Layer Security (MLS), exactly as in a zero-trust cloud deployment. Air-gapping defends the network perimeter; encryption defends against insiders and lateral movement inside it — complementary controls, not substitutes.

### 3. Offline Software Supply Chain and Package Management
Container images, browser builds, codecs, and dependency libraries are pulled once onto a controlled staging system with temporary, audited internet access, cryptographically signed and hashed, then moved across the boundary through a one-way process before deployment. No component of the running platform ever reaches out to a public registry, CDN, or update server.

### 4. Internal Identity, PKI, and Directory Services
Authentication runs against an internal identity provider — commonly a classified-network Active Directory forest, a smart-card/PIV-based PKI, or a purpose-built internal OIDC provider — issuing the same short-lived, scoped JSON Web Tokens used in modern zero-trust deployments, minus any external reachability requirement.

### 5. Controlled, Audited Cross-Boundary Data Transfer
Because some data legitimately needs to move across the gap — recordings for a review board, transcripts for redaction, or incoming firmware updates — every air-gapped deployment needs a defined, auditable transfer mechanism rather than ad-hoc USB copying.

<div class="callout">
<strong>Important Note:</strong> Reaching real-time performance targets inside an isolated enclave requires attention to dependencies that don't matter in cloud deployments. Internal DNS resolution, NTP synchronization, and certificate revocation checking all have to function without external reachability. A surprising number of internal deployments quietly break because a certificate validation library tries to reach an external OCSP responder and times out, adding latency or failing closed.
</div>

## Threat Model: What Air-Gapping Defends Against (and What It Doesn't)

A rigorous threat model matters here, because air-gapping is sometimes assumed by non-specialist stakeholders to be an absolute guarantee of security. It isn't. It is a strong control against remote network exploitation and largely irrelevant against several other threats.

| Threat Vector | Effect of Air-Gapping | Residual Risk Level |
| :--- | :--- | :--- |
| **Remote network intrusion / internet-based exploitation** | Eliminated — no reachable path exists for a remote attacker to exploit | **NONE** |
| **Cloud vendor subpoena, insider access, or hypervisor compromise** | Eliminated — no cloud vendor or shared infrastructure is involved at all | **NONE** |
| **Software supply-chain compromise via live update channels** | Substantially reduced — updates only arrive through controlled, signed, manually reviewed transfers | **LOW** |
| **Malicious insider with physical facility access** | Not mitigated by network isolation alone; requires personnel and physical security controls | **MODERATE–HIGH** |
| **Removable media introducing malware across the boundary** | Not eliminated — remains the single most common real-world air-gap breach vector (e.g., Stuxnet, Agent.BTZ) | **MODERATE** |
| **Acoustic, electromagnetic, or optical covert-channel exfiltration** | Not addressed by network isolation; requires TEMPEST shielding and emissions security controls | **LOW–MODERATE** (Specialized capability required) |
| **Endpoint compromise via infected peripheral firmware** | Reduced by hardware provenance controls but not eliminated by network isolation alone | **MODERATE** |

The historical record is instructive. Some of the most consequential attacks against air-gapped systems — Stuxnet's infiltration of industrial centrifuge control systems, or Agent.BTZ's spread across military networks — succeeded not by breaching the network boundary remotely, which was never possible, but by exploiting the removable media and human processes used to move data across it.

Academic researchers have also demonstrated exotic covert channels exfiltrating data from isolated systems using acoustic signals, electromagnetic emissions from memory buses, optical signals from status LEDs, and smartphone sensors picking up vibration. None of this requires network connectivity — it operates entirely outside the boundary air-gapping defends.

The practical conclusion is that air-gapped video conferencing infrastructure should never be treated as a standalone control. It needs to sit inside a broader program that includes strict physical access controls, personnel vetting, controlled and logged use of removable media, device provenance verification, and — for the highest-sensitivity facilities — TEMPEST-shielded equipment. Network isolation closes the largest, most exploitable door. It does not close every door.

## Moving Data Across the Gap: Diodes, Sneakernets, and Controlled Interfaces

Real-time video conferencing is a unique challenge for air-gap engineering because unlike batch file transfer, video calls are entirely internal by design — participants never need data to leave the enclave just to talk to each other. The cross-boundary problem shows up in the surrounding workflow: updates coming in, and [secure recordings](/features/recordings), transcripts, or [deal room](/features/deal-rooms) artifacts going out for review or archival.

### Unidirectional Data Diodes
Unidirectional data diodes are the gold-standard control here. A data diode is a physical hardware component, not a firewall rule, engineered so data can only flow in one direction across a fiber-optic link, with the receiving side physically incapable of transmitting anything back. Signed, hashed update packages pass one-way into the enclave through a diode; nothing flows back out through that path. Where data legitimately needs to leave (a cleared recording, a redacted transcript), a separate, independently governed diode or manual transfer station handles that direction exclusively.

### Transfer Stations & Content Disarm
Transfer stations replace ad-hoc USB copying where a diode isn't practical. A transfer station is a dedicated, non-networked workstation where removable media is scanned against multiple antivirus and content-disarm engines, logged with the operator's identity and content description, and only then permitted to move data across. Every transfer is auditable, and media that fails scanning is quarantined.

**Content Disarm and Reconstruction (CDR)** adds a further layer for file-based transfers, stripping active content, macros, and embedded objects from documents before they cross, rather than relying purely on signature-based antivirus detection.

For meeting recordings specifically, many facilities apply a policy of re-encoding rather than direct transfer: the video is played back and re-captured through a verified pipeline on export, destroying any hidden data structures embedded in the original file.

## Compliance & Regulatory Alignment (FedRAMP High, ITAR, NIS2, HIPAA)

Air-gapped deployment isn't just a security preference for many of the organizations that adopt it — it's frequently a direct or effective regulatory requirement.

### 1. FedRAMP High and DoD Impact Level 5/6
U.S. federal agencies and defense contractors handling CUI or classified national security systems operate under FedRAMP High baselines and DoD Impact Level requirements that, at the upper tiers, mandate physical network isolation from commercial internet infrastructure. Video conferencing supporting these programs must meet the same isolation standard as every other system on the network.

### 2. International Traffic in Arms Regulations (ITAR) and Export Controls
Organizations working with ITAR-controlled technical data must prevent access by foreign persons and ensure controlled data never transits infrastructure outside approved boundaries. A cloud-hosted platform introduces ambiguity around data location that ITAR compliance is built to eliminate. Air-gapped deployment removes that ambiguity by removing the external path entirely.

### 3. NIS2 and Operational Technology (OT) / Industrial Control Systems
Under the EU's NIS2 directive, operators of essential services in energy, water, and industrial infrastructure are increasingly extending network segmentation from OT environments to the collaboration and [messaging](/features/messaging) tools engineering and control-room staff use to coordinate around that infrastructure.

### 4. HIPAA for Highly Sensitive Research and Clinical Networks
While most healthcare providers are well served by a zero-trust cloud deployment (see our [HIPAA compliant video conferencing checklist](/blog/hipaa-compliant-video-conferencing-checklist)), a smaller set of research hospitals and government health programs run clinical networks air-gapped by policy due to genomic research sensitivity or program classification.

## Hardware & Network Sizing for Isolated Facilities

Air-gapped SFUs and signaling servers perform the same packet-routing role as their cloud counterparts, but sizing has to account for the absence of elastic cloud scaling and the reality that hardware refresh happens on facility procurement timelines.

| Facility Scale | Active Capacity Targets | Dedicated Hardware Allocation | Internal Network Throughput |
| :--- | :--- | :--- | :--- |
| **Single Secure Room / SCIF** | Up to 5 Active Rooms, 50 Concurrent Streams | 8 vCPU cores, 16 GB RAM, redundant local storage | 1 Gbps internal switch fabric |
| **Facility-Wide Deployment** | Up to 30 Active Rooms, 400 Concurrent Streams | 24 vCPU cores, 48 GB RAM across 2 redundant nodes | 10 Gbps internal backbone |
| **Multi-Site Classified Network** | 100+ Active Rooms, 1,500+ Concurrent Streams | Cluster: 3x SFU Nodes (16 vCPU/32GB) + redundant relays | 25+ Gbps dedicated internal fiber |

<div class="callout">
<strong>Important Note on Redundancy:</strong> Because there is no public TURN service or cloud failover to lean on if a node fails, every tier above should be built with N+1 hardware redundancy at minimum, hot-spare components kept on-site, and a documented, rehearsed failover procedure that facility staff can execute without external support.
</div>

## Step-by-Step Implementation Blueprint

Standing up an air-gapped video conferencing capability is a multi-phase program. This blueprint reflects how mature high-security facilities typically sequence the work:

### Phase 1: Facility and Network Boundary Definition
- Formally define the isolated network boundary with facility security officers and network architects, confirming there is no residual path — wired, wireless, or via shared peripherals — to any external network.
- Establish an internal PKI, or extend an existing classified-network PKI, to issue certificates for signaling servers, SFUs, and client authentication.
- Document every dependency the platform would normally resolve externally — DNS, NTP, certificate revocation checking, package registries — and confirm an internal equivalent exists.

### Phase 2: Offline Software Supply Chain Setup
- Build a controlled staging environment with temporary, monitored internet access used exclusively to pull, hash, and sign container images, browser builds, and dependency packages.
- Establish the one-way transfer mechanism (data diode or governed transfer station) that moves approved packages from staging into the isolated network, with every transfer logged and independently reviewed.
- Define a recurring patching cadence that balances timely updates against the overhead of manual review and transfer.

### Phase 3: Internal Platform Deployment and Client Hardening
- Deploy signaling servers and zero-knowledge SFU nodes onto internal hardware, configured to resolve all dependencies against internal services only.
- Harden client endpoints against accidental external connectivity — disabling default browser telemetry, update checks, and CDN dependencies that would otherwise silently attempt outbound connections.
- Enforce client-side end-to-end media encryption via WebRTC Insertable Streams and MLS, so isolation and encryption work together.

### Phase 4: Transfer Governance, Monitoring, and Drills
- Stand up transfer stations or data diode governance for legitimate cross-boundary data movement, with mandatory logging of operator identity, content description, and justification.
- Configure internal SIEM logging across signaling servers, SFUs, and transfer stations, with anomaly detection tuned for the environment.
- Conduct regular red-team exercises targeting the transfer process and physical/personnel controls, since these represent the most realistic attack path.

## Total Cost of Ownership: Air-Gapped vs. Multi-Tenant SaaS

Air-gapped infrastructure carries a materially different cost profile than cloud SaaS, driven less by compute and more by the personnel and process overhead of maintaining the boundary itself.

### Financial Analysis (500-Seat Isolated Facility Deployment)

| Expense Category | Multi-Tenant Commercial SaaS | Air-Gapped Isolated Infrastructure |
| :--- | :--- | :--- |
| **Annual User Seat Licenses** | $120,000 / year ($20/user/month) | **$0** (Self-managed stack) |
| **Compute & Host Infrastructure** | Included in SaaS subscription | **$14,000 / year** (Redundant on-site hardware) |
| **Internal PKI & Certificate Management** | Vendor-controlled (N/A) | **$6,000 / year** (Internal CA operation) |
| **Data Diode / Transfer Station Hardware** | Not applicable | **$22,000** one-time + **$4,000 / year** maintenance |
| **Staging Network & Update Governance** | Included in SaaS subscription | **$16,000 / year** (Dedicated staging & review time) |
| **Internal DevSecOps & Facility IT Support** | Included in SaaS subscription | **$48,000 / year** (Dedicated on-site operational allocation) |
| **Total Annual Overhead (after Year 1)** | **$120,000** | **$88,000** |
| **Year 1 Total (including one-time hardware)** | **$120,000** | **$110,000** |

By Year 1, an air-gapped deployment for a facility of this scale is already cost-comparable to commercial SaaS licensing — and annual overhead drops further from Year 2 once one-time diode and staging infrastructure is amortized, while eliminating per-seat licensing entirely as headcount grows (see our [transparent pricing overview](/pricing)).

## Frequently Asked Questions (FAQs)

<details class="faq-item">
<summary>Can an air-gapped video conferencing platform still support screen-sharing, recording, and chat?</summary>

Yes. All of these run entirely within the isolated network using the same internal signaling servers, SFUs, and client-side encryption used for video and audio. Recordings write to internal storage rather than a cloud bucket, and any recording that legitimately needs to leave the enclave passes through the same controlled transfer process used for other exports.
</details>

<details class="faq-item">
<summary>How do users join an air-gapped video call if there's no internet connection at all?</summary>

Clients connect entirely over the internal network, the same way they'd reach any internal application. Meeting links resolve against an internal DNS zone, and identity is validated against the facility's internal directory or PKI, exactly as with any other internal enterprise system.
</details>

<details class="faq-item">
<summary>Does air-gapping mean the video conferencing software can never be updated?</summary>

No, but updates arrive through a controlled offline process rather than an automatic live connection. Packages are pulled, hashed, and signed on a separate staging environment, then transferred across the boundary — usually via a unidirectional data diode — before being deployed internally.
</details>

<details class="faq-item">
<summary>Is air-gapped video conferencing the same thing as end-to-end encrypted video conferencing?</summary>

No, and the distinction matters. End-to-end encryption protects payload confidentiality even across untrusted networks. Air-gapping removes the untrusted network path entirely. A well-built platform typically uses both — encryption defends against insiders and lateral movement, isolation defends against remote exploitation — but neither substitutes for the other.
</details>

<details class="faq-item">
<summary>What's the single biggest security risk in an air-gapped video conferencing deployment?</summary>

Historically, it isn't the network boundary itself — it's the process used to move data across it. Uncontrolled removable media and poorly governed update channels have been the actual entry point for the most significant real-world air-gap breaches. A credible deployment invests as much in transfer governance as in the network isolation itself.
</details>

## The Bottom Line

Air-gapped video conferencing is not a more extreme version of zero-trust architecture — it's a different tool for a different threat model. Where zero-trust cloud platforms cryptographically neutralize an untrusted network path, air-gapping removes that path altogether, satisfying regulatory and operational requirements facing defense, intelligence, and critical-infrastructure organizations.

Getting it right takes more than unplugging a network cable. It requires rebuilding the entire real-time media stack — signaling, relay, identity, and update delivery — to function without any external dependency, alongside just as much investment in the physical, personnel, and transfer-governance controls that address what network isolation alone cannot. Organizations that treat the boundary crossing, not the boundary itself, as the primary risk tend to build the most resilient programs.

Ready to evaluate whether air-gapped or self-hosted deployment is right for your organization? Explore our [security & compliance solutions](/security), review our [self-hosted deployment options](/self-hosted), or [contact our infrastructure security team](/pricing) for a technical briefing.

## Related Reading

- **Security** — [End-to-End Encryption vs. In-Transit Encryption in Video Calls](/blog/end-to-end-encryption-vs-in-transit-encryption-in-video-calls): How modern enterprise IT teams eliminate vendor trust and enforce cryptographic media boundaries.
- **Compliance** — [HIPAA Compliant Video Conferencing Checklist](/blog/hipaa-compliant-video-conferencing-checklist): Key controls for securing clinical and regulated communications.
- **Government & Defense** — [Why Government Agencies and Defense Contractors Need Secure Video Conferencing](/blog/why-government-agencies-and-defense-contractors-need-secure-video-conferencing): Navigating ITAR, FedRAMP High, and sovereign enclave requirements.
