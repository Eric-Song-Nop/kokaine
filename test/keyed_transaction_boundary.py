"""Static guard for the keyed transaction's irreversible publication boundary."""

from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1] / "src/kokaine/dom.kk"
text = SOURCE.read_text()
start = text.index("fun reconcile-keyed")
end = text.index("fun mount-keyed-fields", start)
reconcile = text[start:end]

commit = reconcile.index("internal/commit-structural-transaction(transaction)")
stage_retirements = reconcile.index("val retirements = stage-keyed-retirements(stale)")
publish_sources = reconcile.index(
    "final-updates.foreach(fn(update) commit-keyed-update(update))"
)
publish_table = reconcile.index(
    "table,Keyed-table(final-index,final-order,retirements))"
)
mark_committed = reconcile.index("transaction-store(committed,True)")
drain_retirements = reconcile.index(
    "drain-keyed-retirements(table)", mark_committed
)

assert stage_retirements < commit < publish_sources < publish_table < mark_committed, (
    "stale ranges must be staged and scheduler commit must succeed before "
    "keyed sources/table become irreversible"
)
assert mark_committed < drain_retirements, (
    "physical retirement must run from the committed pending-retirement ledger"
)
assert "internal/stage-structural-publication(" in reconcile
assert "joined keyed reconciliation must be initial construction" in reconcile
