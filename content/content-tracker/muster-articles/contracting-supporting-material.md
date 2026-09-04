# Contracting — supporting material (Muster side)

**Reference, not prose.** Source material for the *Contracting* post — the fourth stage of the seven-stage pipeline. It is organised to be looked things up in while writing, not read start to finish. Its companion is [`reference-safe-path-leak-inventory.md`](reference-safe-path-leak-inventory.md) §4/§4a, which states the *Safe-side wall* this document answers; keep the two consistent.

**Confidence marking is load-bearing.** Every factual row carries one:

- **[measured]** — observed on this machine, with the date and conditions
- **[from source]** — read off the code or contract of what we consume, not separately exercised
- **[inferred]** — reasoned from design; check before printing as fact

Rule inherited from `docs/00-vision.md`: never publish an `inferred` row as fact, and every gap names the fix *and that fix's real status* from a closed set — `shipped` / `specified` / `partial` / `none`. "Coming soon" is not a status.

**Measurement conditions for this document.** Probes were run 2026-09-03 on the `main` checkout at `corpetty/muster` with `nim 2.2.10`, invoked `nim r -d:release module/tests/probes/probe_*.nim` from `module/`. `nimble` was **not** available, so the pure-Nim invariant probes (no external deps) are **[measured]**; the Safe / anvil / secp256k1 tests need the nimble lock set (`nim-secp256k1`, `nim-eth`, `pkg/results`) and were **not** run here — they are cited **[from source]**. Re-run them on a machine with the lock set before printing any Safe number as measured.

---

## 1. The stage — what Contracting is, and where the wall is

From the published seven-stage taxonomy ([PriFi deck competitor matrix cross-check](https://logos-co.github.io/assembly/resources/prifi-deck-competitor-matrix-crosscheck)):

> **Contracting** — frontend and signing context: verifiable/local-first frontends, signing leaks. Whether signing and execution context stays local and verifiable, or a web frontend introduces ambient leakage.

**The wall, stated by the Safe-side companion (§4a), holds on every rail:** a `safeTxHash` commits to the **action** — `chainId`, the Safe, and `to/value/data/operation/…/nonce` — and to *nothing about the signing context*: not *why* you are signing, not the counterparty's off-chain promise, not "what the UI said," not the agreed intent. **The Safe verifies the action, not the agreement.** The gap between *the action agreed (in chat)* and *the action verified (in the hash)* **is** the contracting-stage leak — and it is exactly where wallet-drainers and phishing operate (~$0.5B/yr, Part-1 table). The hash cannot close it, because the context was never in the hash.

**Muster's contracting story is two moves against that wall:**

1. **Make the *action* bytes verifiable locally** — the client re-derives what it is about to sign and *refuses on mismatch*, so a proposer (or a compromised frontend) cannot slip different bytes under a reviewed effect. This is the part every stack could do and almost none do by default. *Built, and this is the news since Post 1.*
2. **Begin to account for the *context*** — the agreement lives in the E2EE conversation log, and a provenance record folds each input's origin into the signed bytes, refusing to sign what it cannot account for. This is the part the Safe hash structurally cannot reach. *Built as a module capability; not yet wired into the shipping signature path — see §6.*

### What changed since Post 1 — the headline

Post 1's self-assessment (`docs/posts/01-discovery-supporting-material.md:93`) scored Contracting **◑**, with this justification:

> "Local-first by construction: a native client, no web frontend, no ambient leakage. But **the signing context is not verifiable** — the client does not re-derive what it signs (F-4/FS-6 are specified and unbuilt), so a user reviews an amount rather than a payload."

**That justification is now out of date, and the cell moves ◑ → ● (2026-09-04).** The clause "the client does not re-derive what it signs (F-4/FS-6 are specified and unbuilt)" is false on the current tree: F-4 re-derivation is built, non-bypassable in the module core, and probe-proven (§2) — *and* the shipping Room card now renders those re-derived bytes on-display, asserted in the committed qt-mcp harness on a real basecamp host (suite 8/9; `VERIFY BOX OK`). So the move is the full distance: from "specified and unbuilt" through "built and proven headless" to **"rendered and asserted on the demo as it runs"** — the standard the matrix actually scores. See §7 for the strict chain (and the one caveat: provenance is *shown*, not yet *enforced*, in the live UI).

---

## 2. Re-derive-or-refuse — invariant 1 (F-4/FS-6)

**The core check, and that it cannot be turned off.**

`reviewAndCheck` re-derives the materialization from the *reviewed effect* and byte-compares it to the claimed copy — the one gate every signature passes through:

```nim
# module/src/intents/materialization.nim:38-41
proc reviewAndCheck*(driver: Driver, e: Effect, claimed: Materialization): bool =
  canonicalize(driver, e).bytes == claimed.bytes
```

`signProposal` runs it unconditionally before signing. The `Config` surface it takes (`skipReviewRequested`, `plugins`, `userPreference`) is a deliberate no-op that no branch consults; the refuse path returns `soRefused` on mismatch. The file's own header states it: *"This check is unconditional: no flag, plugin, or preference can turn it off (FS-6)."* — `materialization.nim:9-10, 61-81` (refuse at `:78-79`). **[from source]**

**The Safe `safeTxHash` is genuinely re-derived on the client**, not trusted from a proposer. `SafeDriver.canonicalize` computes the EIP-712 hash locally and records it as `pendingHash`; contributions are checked against *that* via `recoversToOwner(pendingHash, sig, owners)`. EIP-712 assembly is `keccak256(0x19 ‖ 0x01 ‖ domainSeparator(chainId, safe) ‖ structHash)`. — `module/src/drivers/safe.nim:59-70, 85-91, 121-128`. **[from source]**

**Why it's non-bypassable in the multi-party path:** what travels on the wire is the *effect* (`{to, value, nonce}`), never a hash. The fold recomputes the materialization inside `newIntent(driver, effect, ctx)` and verifies every contribution against the recomputed value — no transmitted `safeTxHash` is ever trusted. — `module/src/coordination/intents.nim:214-247`; `module/src/intents/lifecycle.nim:46-49`. The hosted single-client path mirrors it, and `coordinate_submit` re-derives again before settling on-chain ("never trusted from the log, always recomputed from the effect") — `module/nim-lib/muster_module.nim:215-270, 512-518`. **[from source]**

### Proof

| What it proves | Probe | Result |
|---|---|---|
| Every single-byte tamper (flip / truncate / append / swapped effect) is **refused** | `probe_materialization_mismatch_refused.nim` | 200/200 refused **[measured]** |
| The client's `canonicalize` *reproduces* an independent reference — it computes, does not echo | `probe_materialization_derivation_agrees.nim` | 200/200 agree **[measured]** |
| Mismatch is refused at **every** config value (`skip`, `pref`, `plugins`) — the off-switch is unreachable | `probe_config_reachability_stepper.nim` | refused across all **[measured]** |
| The client's *local* safeTxHash equals the contract's on-chain `getTxHash` (a passing `checkSignatures` is the cross-validation) | `module/tests/safe_anvil_e2e.nim:44, 66-67` | **[from source]** — needs live anvil |
| Safe 1.4.1 EIP-712 type-hash constants + deterministic re-derive | `module/tests/safe_test.nim:16-51` | **[from source]** — needs nim-secp256k1 |

**The load-bearing line for the post:** *the wall other stacks hit at contracting — you review a story, you sign whatever bytes arrived — Muster's client is built so that the bytes it signs are the bytes it independently re-derived, or it signs nothing. The check lives in the module core and there is no flag that disables it.*

---

## 3. Replay binding — invariant 2 (F-5/FS-3)

A signature must be worthless anywhere else. Two mechanisms exist; be precise about which the *Safe* path uses.

**(a) The abstract `SigningPayload`** binds four fields explicitly. `SigningContext` commits `environment`, `account`, `slot`, `expiry`; `SigningPayload` adds `materializationRoot`; encoding is domain-separated as `"muster.signing-payload.v1"`; `verify` refuses outside the exact context *and* independently past expiry. — `module/src/intents/signing_payload.nim:19-57`. **[from source]** Header caveat (`:10-13`): the signer here is a documented P0/P1 stand-in — a keyed MAC — so the four-field binding is a property of the *payload*, not of the signature primitive.

**(b) The actual Safe path** binds via EIP-712, not the `SigningContext` record: the `safeTxHash` commits to `chainId` + the Safe address (domain separator) and to `nonce/to/value/data/…` (struct hash). **There is no `slot` and no `expiry` in a `safeTxHash`** — Safe uses `nonce` and has no expiry field. So on the Safe path, invariant 2's *environment + account* binding is real (chainId + Safe address + nonce); *slot + expiry* are enforced only in the abstract layer. The lifecycle engine does gate contributions on `expiry` as a logical-time check (`lifecycle.nim:62`), but the live coordination fold sets `expiry = high(uint64)` — never expires — `coordination/intents.nim:220`, `muster_module.nim:227-228`. **[from source / inferred]** State this nuance; don't imply a Safe signature carries an expiry.

### Proof

| What it proves | Probe | Result |
|---|---|---|
| A signature verifies **only** at its exact `(env, account, slot, expiry)` | `probe_replay_binding_context_stepper.nim` | correct across all **[measured]** |
| A past-expiry payload is **rejected** | `probe_replay_binding_expiry_rejected.nim` | rejected **[measured]** |
| Each bound field is load-bearing (drop one → verify fails) | `probe_replay_binding_field_binds.nim` | each binds **[measured]** |
| safeTxHash differs under wrong chainId / Safe / nonce, reproduces under the same | `module/tests/safe_test.nim:25-36` | **[from source]** — needs deps |

---

## 4. Deterministic bytes — invariant 5

Re-derivation only means something if the *same value always encodes to the same bytes*. That is the deterministic CDE encoder in `module/src/dcbor/dcbor.nim`. Properties (header `:6-14`, with the implementing code) — all **[from source]**:

- **One value → one byte sequence**, independent of construction order.
- **Map keys ordered bytewise-lexicographic over their encoded bytes, never length-first** (`cmpBytes` `:74-82`, applied `:104-116`); duplicate encoded keys are **rejected** (`:111-113`).
- **Shortest-form integer heads** (`encodeHead` `:56-72`).
- **No floats, no indefinite lengths** — both `raise CborError`; those kinds "exist only to be rejected" (`:23-24`, `:122-125`).

### Proof

| What it proves | Probe | Result |
|---|---|---|
| Every insertion permutation yields the one canonical encoding | `probe_cde_map_order_stepper.nim` | **[measured]** green |
| `encoded_len == canonical_min_len` (shortest ints) | `probe_cde_shortest_int.nim` | **[measured]** green |
| Floats (val/neg/inf/nan/in-array/in-value/in-key) and indefinite lengths all rejected | `probe_cde_rejects_noncanonical.nim` | **[measured]** green |
| Decode/re-encode is byte-stable | `probe_cde_reencode_stable.nim` | **[measured]** green |

Spec: `contracts/specs/derived-exo-d7c.spec.json` (referenced `dcbor.nim:7`). **Do not claim a dCBOR golden-vector hex fixture exists** — the determinism is proven by property/stepper probes; the only checked-in golden constants are the Safe EIP-712 type-hashes in `safe_test.nim:19-22`. **[inferred — no separate golden file observed]**

---

## 5. Provenance — invariant 10 (spec `derived-exo-3a1`)

This is the piece that starts on the *context* wall, not just the action. Re-deriving a materialization proves it is consistent with its effect; it says nothing about **where the effect's inputs came from**. Invariant 10 closes that: nothing is signed whose inputs can't be accounted for.

- **The record.** `ProvenanceEntry = class + logPos + account`, where `InputClass ∈ {plugin-block, driver-contribution, external-read, peer-message}` — `module/src/intents/provenance.nim:21-38`. **[from source]**
- **Committed *inside* the signed bytes**, not attached alongside: `signedBytes` folds `materialization` + `encodeProvenance(rec)` into one domain-separated hash-input `"muster.signed-with-provenance.v1"` — `provenance.nim:57-62`. **[from source]**
- **Refuse-on-unaccountable.** `trySign` returns `sdRefused` if any input is not accountable — `provenance.nim:66-73`. **[from source]**
- **Anonymity preserved (inv 9).** The account is recorded only under a *named* membership model; `""` otherwise — `provenance.nim:43-49`. **[from source]**
- **Epoch-scoped (inv 7).** Reconstructing epoch-E provenance requires epoch-E's key (`canReconstruct` → `canDerive(actor, epoch)`, `:91-94`), so a later joiner cannot read earlier lineage. **[from source]**

### Proof — the six acceptance oracles (`derived-exo-3a1.spec.json:66-232`)

| Clause | What it proves | Probe | Result |
|---|---|---|---|
| s1 | Provenance is bound into the signed bytes | `probe_provenance_binds.nim` | **[measured]** true |
| s2 | Two-way coverage (every input accounted, every account an input) | `probe_provenance_coverage_stepper.nim` | **[measured]** true |
| s3 | Refusal decision is correct on unaccountable input | `probe_provenance_refusal_stepper.nim` | **[measured]** true |
| s4 | Identity disclosed only under a named model | `probe_provenance_identity_disclosure_stepper.nim` | **[measured]** true |
| s5 | Rebuildable from log + keys, no side-car (cold start matches) | `probe_provenance_cold_start_matches.nim` | **[measured]** true |
| s6 | No cross-epoch reconstruction | `probe_provenance_epoch_scope_stepper.nim` | **[measured]** true |

**Live display path.** `intentProvenance` (`coordination/intents.nim:321-347`) folds a per-intent lineage — the propose as a peer-message, each distinct owner signature as a contribution, account named only under a named model — surfaced via `coordinate_intents`. **Honest gap (say it):** this live fold builds a *display* record with `accountable = true` by construction; the actual `trySign` refusal is a proven module capability, **not** wired into the live approve/contribute path — because the client holds no Safe key and signatures are produced off-device and pasted (§6). **[from source / inferred]**

---

## 6. Local-first, and the honest boundary

- **Native client, no web frontend.** QML view + Nim module (`muster-ui.lgx` / `muster-module.lgx`), hosted by logos-basecamp / logoscore. The only HTML in the tree is `ui/prototype/coordination-prototype-v2.html`, an explicitly non-app reference simulation. — `CLAUDE.md:3, 5, 52-71`. **[from source]** This is the "no ambient web-frontend leakage" half of Contracting, and it is true by construction.
- **Where the signature is produced — an unusual, honest boundary.** The `Keystore` seam exposes `sign` / `sealOpen` operations and **never a key getter** (so a Keycard backend slots behind it); `FileKeystore.sign` is `signRecoverable(msgHash, secret)` over secp256k1 — `module/src/crypto/keystore.nim:29-54, 158-159`. But for **Room approvals** in the coordination path the module holds no Safe owner key: the UI tells the user to *"Sign the re-derived safeTxHash on your own device and paste the 65-byte signature"* (`ui/src/qml/Room.qml:332-333`), and `coordinate_contribute` only *verifies* recovery to an owner. **[from source]**
- **What does / doesn't leave the host at contracting.** The signing *material* (the private key) never enters the coordination layer or the log (`keystore.nim:9-18`). Propose/approve/fold are local `reduce(log)`; there is no coordination service and no Safe Transaction Service — signature collection is *inside the E2EE room*, not against an operator. The only host egress at contracting is the **sealed coordination frame** on the conversation's content topic over `DeliveryTransport` (`session.nim:85-88`), carrying the sealed effect + signatures to *room peers* by design — not to any coordinator. On-chain `execTransaction` is a *settlement*-stage RPC call, not contracting. **[from source / inferred]**

### The gaps, strictly (fix + status from the closed set)

| Gap | Where | Status |
|---|---|---|
| ~~The re-derivation **verify box** in the shipping *Room* card is render-unverified~~ — **CLOSED 2026-09-04.** The committed qt-mcp harness now asserts the Room card's verify box (`shown → re-derived → domain`, "✓ your client re-derived this") rendering on a real basecamp host, offscreen. | `ui/src/qml/MusterCard.qml:413-500`; `ui/tests/muster-ui-test.mjs` | **shipped** — render asserted (`VERIFY BOX OK`, suite 8/9). **[measured 2026-09-04]** |
| The re-materialization strip that **is** harness-verified sits on the Account/propose surface, not the Room card. | `ui/tests/muster-ui-test.mjs:94-108`; `ui/tests/README.md:7-10` | **shipped** (propose strip). |
| The UI acceptance harness is **not committed CI** (lifecycle 6/6 green 2026-08-21, offscreen, not in CI). | `ui/tests/README.md:44-47`; `docs/02-implementation-plan.md:201` | **partial**. |
| `provenance.trySign` refuse-on-unaccountable is **not wired into the live signing path** (pasted signatures; live record `accountable:true` by construction). | `coordination/intents.nim:321-347` vs `provenance.nim:66-73` | **partial** — proven by 6 probes as a capability. |
| `slot`/`expiry` binding is not in the Safe `safeTxHash` (only env + account + nonce bind; expiry is a lifecycle gate set to `high(uint64)` live). | `safe.nim:59-70`; `signing_payload.nim:19-42`; `coordination/intents.nim:220` | **partial / by-design** (Safe has no expiry). |
| Cross-host Safe-txn (propose → sign → settle over the wire) needs owner-seeded peer identities; only the *membership* handshake is live cross-host. | `CLAUDE.md:127, 141`; `docs/02-implementation-plan.md:197` | **partial** — logic proven (`two_instance_test`); live wire infra-bound. |
| Generic `SigningPayload` uses a keyed-MAC stand-in, not secp; real secp signing is Safe-only. | `signing_payload.nim:10-13, 44-49` | **partial** — replay property holds under either primitive. |

---

## 7. The self-assessment cell — how to re-score without overclaiming

Post 1 scored Contracting **◑**. As of **2026-09-04 this moves to ●**, and here is the strict chain that earns it:

- **Retire the old justification.** "The client does not re-derive what it signs (F-4/FS-6 specified and unbuilt)" is now false — re-derivation is built, non-bypassable, and probe-proven (§2), and cross-validated on-chain (`safe_anvil_e2e`, [from source]).
- **The last thing holding it at ◑ was on-display render, and that gap is now closed.** The earlier draft argued ● on the mechanism but held the published mark at ◑ because a reviewer could not yet *see* the re-derived bytes rendered in the shipping Room card (the matrix scores "the demo as it runs"). The committed qt-mcp harness now asserts exactly that, on a real logos-basecamp host, offscreen: the Room proposal card's verify box renders the client-re-derived `safeTxHash` bound to its domain. **[measured — 2026-09-04, `ui/tests/muster-ui-test.mjs` on the coherent basecamp bake]**:

  ```
  [muster] VERIFY BOX OK — re-derived 0x7da6241b…df90b044
           bound to anvil-31337 · chain 31337 · Safe 0x5fbdb2…180aa3
  ```

  Suite result **8/9 green** (render, health, room render, verify box, propose strip, lifecycle, reject+reset, walkthrough); the only failure is `submit`, and only for want of a live anvil — the on-chain settle is independently proven by `safe_anvil_e2e` / `coordinate_submit_anvil`. So it is *settlement infra*, not the contracting claim, that is ungated.

**The honest one-liner:** *● — F-4 re-derivation and F-5 replay-binding are built, non-bypassable, and test-proven in the core, AND the shipping Room card renders the re-derived bytes on-display, asserted in the committed harness on a real host.* The one caveat worth keeping in prose: the deeper F-20 provenance *refusal* (invariant 10) is proven as a module capability but not yet wired into the pasted-signature path (§6) — provenance is *shown*, not yet *enforced*, in the live UI.

This ● is *stronger* than a bare mark: it is the exact "default vs opt-in, shipped vs roadmap, strictly" discipline the matrix demands, applied to our own build — and it was held at ◑ until the render was literally asserted.

> **Note on getting here (2026-09-04):** proving this on-display took clearing a real SDK-rev skew — muster's module builder had drifted to a newer module-load contract than the shipping basecamp host, so the module crashed on load and blanked the view. Fixed by rebuilding muster_module on basecamp's own SDK generation + the codegen patch. Detail: `corpetty/muster` `docs/labbook/basecamp-sdk-skew-unload-callback.md`. Mentioned because it *is* the contracting-stage thesis in miniature — a verifiable local client is only as good as the coherence of what actually loads on the user's machine.

---

## 8. Figures available (`docs/diagrams/`)

Each is SVG in the prototype palette with a 2× PNG sibling. Captions **[from source]** (`docs/diagrams/manifest.json`).

| File | Shows | Best used for |
|---|---|---|
| `series-locator-contracting.svg` | The stage locator for Contracting in the seven-stage series | The post's orienting figure (confirm the caption text before publishing — the file exists; verify against the manifest) |
| `mech-effect-materialization.svg` | What a participant reviews vs. what actually gets signed, the client's independent re-derivation between them, and that the check cannot be turned off | **The invariant-1 figure — the centre of this post** |
| `mech-signing-payload.svg` | The fields a signing payload commits to and the specific reuse each defeats; the two versioned fields marked apart from the invariant; the provenance record F-20 adds | The replay-binding argument (§3) |
| `mech-provenance-trail.svg` | Why re-deriving doesn't answer where inputs came from; what the provenance record commits to per input class; the refusal that gives it teeth; the two boundaries | The context-wall argument (§5) |
| `mech-driver-contract.svg` | The Driver contract (describe/canonicalize/verifyContribution) + the conformance suite that grades any driver | Optional: that re-derivation is driver-generic, not Safe-only |
| `mech-verified-reads.svg` | The verified-read path (`eth_getProof` + `verifyMptProof`) | Optional: external-read provenance / F-10 |

---

## 9. Screenshot shot list

Take these *after* running the whole journey once (empty states photograph badly), with two `--user-dir` peers so addresses genuinely differ.

| # | Shot | Why it earns its place |
|---|---|---|
| 1 | The propose surface with the **re-materialization strip** visible — "re-derived" next to "proposed" | The harness-verified proof of invariant 1 (`muster-ui-test.mjs:94-108`). This is the one that is *asserted*, so it is safe to lead with |
| 2 | The Room card **verify box** — `shown → re-derived → domain`, with the "✓ your client re-derived this — the exact bytes you'd sign" line | The emotional core of the post. **Now harness-asserted on a real host** (2026-09-04) — a captured render exists (`muster-ui-verify.png` from the offscreen run); this is the ● evidence, not just the design |
| 3 | The approve affordance where a user pastes a signature, with the honest "sign on your own device" copy | The unusual, honest boundary (§6): the client verifies, it does not custody the Safe key |
| 4 | The provenance / lineage view on an intent card | The context move (§5) made concrete — "how the data reached you," per input |
| 5 | Two windows side by side, one room, a proposal collecting approvals | Establishing: contracting happens *inside the conversation*, no coordinator in frame |

---

## 10. Where argument is wanted

1. **Is re-derive-or-refuse the right primitive**, or theatre if the user still can't read the re-derived bytes meaningfully? What makes a re-derived payload *legible* rather than just *present*?
2. **The pasted-signature boundary** (client verifies, user custodies the key off-device) — is that more honest than an in-app signer, or a worse UX that pushes people back to the drainer-prone flow?
3. **Provenance vs. the context wall** — does folding input lineage into the signed bytes *actually* narrow the "agreed action vs. verified action" gap, or only document it? What would close it rather than account for it?
4. **Scoring ◑ vs ●** — is "built and proven headless but not on-display-verified" honestly ◑, or is that over-punishing a UI-harness gap?
5. **Where is this worse than what you use now?** — better heard before publishing.

---

## 11. Phrasings worth keeping

- "The Safe delivers confidence about the **action**, not about the **agreement**." (from the Safe-side inventory — the hinge of the whole stage)
- "You review a story; you sign whatever bytes arrived. Muster's client signs the bytes it re-derived, or it signs nothing."
- "The off-switch is unreachable: there is a `Config` with a `skip` flag, and no code path reads it."
- "A shielded wallet is a key and a search, not an address and a lookup" — the discovery-post line; the contracting analogue: *a Muster signature is a re-derivation and a refusal, not a trust and a click.*
- "Re-deriving a materialization proves it matches its effect. It says nothing about where the effect came from. That second question is invariant 10, and most stacks never ask it."
- On honesty: the verify box "is the design; the strip we can *assert* is the one to lead with" — mark the difference rather than blur it.

---

## 12. Sources

| For | Where |
|---|---|
| The Safe-side wall this doc answers | [`reference-safe-path-leak-inventory.md`](reference-safe-path-leak-inventory.md) §4, §4a, §8.7 |
| The stage taxonomy + ●/◑/○ scale | [PriFi deck competitor matrix cross-check](https://logos-co.github.io/assembly/resources/prifi-deck-competitor-matrix-crosscheck) |
| Post-1 companion (format + the ◑ cell being updated) | `corpetty/muster` `docs/posts/01-discovery-supporting-material.md` |
| Invariant 1 — re-derive-or-refuse | `module/src/intents/materialization.nim`; `module/src/drivers/safe.nim`; `module/src/coordination/intents.nim` |
| Invariant 2 — replay binding | `module/src/intents/signing_payload.nim`; `module/src/drivers/safe.nim:59-70` |
| Invariant 5 — deterministic bytes | `module/src/dcbor/dcbor.nim`; `contracts/specs/derived-exo-d7c.spec.json` |
| Invariant 10 — provenance | `module/src/intents/provenance.nim`; `contracts/specs/derived-exo-3a1.spec.json` |
| The probes (all under) | `module/tests/probes/` |
| Safe on-chain cross-validation | `module/tests/safe_anvil_e2e.nim`; `module/tests/safe_test.nim` |
| UI verify box + harness | `ui/src/qml/MusterCard.qml`; `ui/src/qml/Room.qml`; `ui/tests/muster-ui-test.mjs`; `ui/tests/README.md` |
| Honesty rules + confidence marking | `corpetty/muster` `docs/00-vision.md` |
