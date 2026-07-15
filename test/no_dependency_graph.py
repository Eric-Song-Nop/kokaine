from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1] / "src/kokaine/reactive.kk"
text = SOURCE.read_text(encoding="utf-8")

forbidden = {
    "source-info": "central source records",
    "root-sources": "root-wide source registry",
    "root-observers": "root-wide observer registry",
    "observer-sources": "observer reverse dependency lists",
    "root-id": "integer root identities",
    "source-id": "integer source identities",
    "observer-id": "integer observer identities",
    "observer-rank": "topological ranks",
    "info-rank": "source ranks",
    "insert-ranked": "ranked insertion",
    "type observer-status": "graph status machine",
    "find-source": "source registry lookup",
    "find-observer": "observer registry lookup",
    "producer-wake": "producer closures that retain the typed root",
    "observer-invalidate": "speculative downstream invalidation",
    "notify-source-derivations": "speculative derivation propagation",
    "drain-until-clean": "arbitrary sibling draining during producer pull",
}

required = {
    "source-subscribers": "source-local subscriptions",
    "wake-token": "one-shot captured generations",
    "owner-generation": "captured ownership-generation capabilities",
    "validate-owner-generation": "stale owned-work checkpoint gate",
    "token-cancellations": "capture-owned cancellation",
    "observer-suspend": "control-effect observer process",
    "rcontext.resume": "raw continuation resume",
    "rcontext.finalize": "raw continuation finalization",
    "dependency-stamp": "continuation-owned read checkpoints",
    "source-version": "checkpoint validation",
    "validate-dependencies": "lazy generation validation",
    "take-queued-observer": "exact producer pull",
    "settle-producer": "recursive producer validation",
}

violations = [f"{token}: {reason}" for token, reason in forbidden.items() if token in text]
missing = [f"{token}: {reason}" for token, reason in required.items() if token not in text]

if violations or missing:
    details = "\n".join(
        [*(f"forbidden: {item}" for item in violations),
         *(f"missing: {item}" for item in missing)]
    )
    raise SystemExit(f"continuation runtime shape check failed:\n{details}")

print("runtime shape: no centralized graph, ranks, or observer reverse lists")
