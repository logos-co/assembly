"""Generate data figures for the transaction supply chain threat model post.

Every datapoint is hand-curated from a published source (see SOURCES.md).
Output: SVG, transparent background, theme-neutral grays, into content/attachments/.
Regenerate: python3 make_figures.py
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

GRAY = "#888888"
ACCENT = "#0e9888"
WARN = "#d97706"
RED = "#dc2626"
OUT = "../../content/attachments/"

def style(ax):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color(GRAY)
    ax.tick_params(colors=GRAY, labelsize=9)
    ax.xaxis.label.set_color(GRAY)
    ax.yaxis.label.set_color(GRAY)
    ax.title.set_color(GRAY)

def save(fig, name):
    fig.savefig(OUT + name, transparent=True, bbox_inches="tight")
    fig.savefig(OUT + name.replace(".svg", ".png"), transparent=True, bbox_inches="tight", dpi=200)
    plt.close(fig)
    print("wrote", name)

# Fig: private RPC adoption (trust-swap migration)
fig, ax = plt.subplots(figsize=(6.5, 3.4))
x = [2023.85, 2025.1]
y = [45, 80]
ax.plot(x, y, marker="o", color=ACCENT, linewidth=2)
ax.annotate("45% of DeFi order-flow volume\n(Flashbots, Nov 2023)", (x[0], y[0]),
            textcoords="offset points", xytext=(8, -28), fontsize=8.5, color=GRAY)
ax.annotate("~80% of DeFi interactions\n(CoW DAO Research, 2025)", (x[1], y[1]),
            textcoords="offset points", xytext=(-118, 8), fontsize=8.5, color=GRAY)
ax.set_xlim(2023.5, 2025.6)
ax.set_ylim(0, 100)
ax.set_ylabel("share via private RPCs (%)")
ax.set_xticks([2024, 2025])
ax.set_xticklabels(["2024", "2025"])
ax.set_title("Ethereum DeFi flow migrating out of the public mempool", fontsize=10)
style(ax)
save(fig, "tsc-private-rpc.svg")

# Fig: OFAC-compliant relay share
fig, ax = plt.subplots(figsize=(6.5, 3.4))
x = [2022.9, 2023.2, 2026.5]
y = [79, 45, 30]
ax.plot(x, y, marker="o", color=WARN, linewidth=2)
for xi, yi, lbl, dx, dy in [
    (x[0], y[0], "79% peak\n(Nov 2022)", 6, 4),
    (x[1], y[1], "~45% after relay-mix shift\n(early 2023)", 6, 6),
    (x[2], y[2], "~30%\n(mevwatch.info, 2026)", -70, 10),
]:
    ax.annotate(lbl, (xi, yi), textcoords="offset points", xytext=(dx, dy), fontsize=8.5, color=GRAY)
ax.set_xlim(2022.6, 2026.9)
ax.set_ylim(0, 100)
ax.set_ylabel("blocks via OFAC-compliant relays (%)")
ax.set_xticks([2023, 2024, 2025, 2026])
ax.set_xticklabels(["2023", "2024", "2025", "2026"])
ax.set_title("Censorship pressure through identifiable relays (Ethereum)", fontsize=10)
style(ax)
save(fig, "tsc-ofac-relays.svg")

# Fig: builder concentration snapshot
fig, ax = plt.subplots(figsize=(6.5, 2.8))
builders = ["Titan", "BuilderNet", "all others"]
share = [52, 30, 18]
colors = [WARN, WARN, GRAY]
bars = ax.barh(builders, share, color=colors, alpha=0.85, height=0.55)
for b, v in zip(bars, share):
    ax.text(v + 1, b.get_y() + b.get_height() / 2, f"{v}%", va="center", fontsize=9, color=GRAY)
ax.invert_yaxis()
ax.set_xlim(0, 100)
ax.set_xlabel("share of Ethereum blocks built (%)")
ax.set_title("Two builders assemble most Ethereum blocks (rated.network, 2026)", fontsize=10)
style(ax)
save(fig, "tsc-builder-share.svg")

# Fig: the extraction ledger
fig, ax = plt.subplots(figsize=(6.5, 3.6))
items = [
    ("Bybit signing compromise (2025)", 1500, RED),
    ("Wallet drainers (2024)", 494, WARN),
    ("Sandwich MEV, cumulative 2020-mid-24", 410, WARN),
    ("Wallet drainers (2023)", 295, WARN),
    ("Address poisoning (mid-22 to mid-24)", 83.8, WARN),
]
labels = [i[0] for i in items][::-1]
vals = [i[1] for i in items][::-1]
cols = [i[2] for i in items][::-1]
bars = ax.barh(labels, vals, color=cols, alpha=0.85, height=0.55)
for b, v in zip(bars, vals):
    ax.text(v + 18, b.get_y() + b.get_height() / 2, f"${v:g}M", va="center", fontsize=9, color=GRAY)
ax.set_xlim(0, 1750)
ax.set_xlabel("measured losses (USD millions)")
ax.set_title("The measured cost of the unsecured chain (red = integrity failure)", fontsize=10)
style(ax)
save(fig, "tsc-extraction-ledger.svg")

# Fig: cost to deanonymize over time
fig, ax = plt.subplots(figsize=(6.5, 3.6))
pts = [
    (2014, 3, "Active infrastructure, ~EUR 1,500:\nup to 60% of Bitcoin clients\n(Biryukov et al., CCS '14)"),
    (2020, 2, "Address-reuse clustering\nat chain scale (FC '20)"),
    (2021, 1, "Passive BGP observation, ~zero\nmarginal cost: >35% of clients\n(PERIMETER, Princeton)"),
    (2025, 0.5, ">90% cross-chain bridge\ntracing accuracy (arXiv 2025)"),
]
xs = [p[0] for p in pts]
ys = [p[1] for p in pts]
ax.plot(xs, ys, marker="o", color=RED, linewidth=2, alpha=0.85)
offs = [(10, -6), (8, 10), (8, 14), (-105, 16)]
for (xi, yi, lbl), (dx, dy) in zip(pts, offs):
    ax.annotate(lbl, (xi, yi), textcoords="offset points", xytext=(dx, dy), fontsize=8, color=GRAY)
ax.set_xlim(2013, 2027)
ax.set_ylim(0, 3.8)
ax.set_yticks([])
ax.set_ylabel("cost / capability required (qualitative)")
ax.set_title("Deanonymization gets cheaper while the record it attacks cannot decay", fontsize=10)
style(ax)
save(fig, "tsc-deanon-cost.svg")
