"""Static guard for the keyed transaction's irreversible publication boundary."""

from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1] / "src/kokaine/dom.kk"
text = SOURCE.read_text()
start = text.index("fun reconcile-keyed")
end = text.index("fun mount-keyed-fields", start)
reconcile = text[start:end]

commit = reconcile.index("internal/commit-structural-transaction(transaction)")
prepare_joined = reconcile.index(
    "prepare-keyed-transaction(publication-transaction)"
)
publish_joined = reconcile.index(
    "publish-keyed-transaction(publication-transaction)"
)
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

assert (
    stage_retirements
    < prepare_joined
    < commit
    < publish_joined
    < publish_sources
    < publish_table
    < mark_committed
), (
    "the renderer journal must prepare before reactive commit and publish "
    "before the outer keyed sources/table become irreversible"
)
assert mark_committed < drain_retirements, (
    "physical retirement must run from the committed pending-retirement ledger"
)
assert "stage-keyed-publication(" in reconcile
assert "internal/stage-structural-publication(" not in reconcile
assert "joined keyed reconciliation must be initial construction" in reconcile
