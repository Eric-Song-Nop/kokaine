"""Static guard for the keyed transaction's irreversible publication boundary."""

from pathlib import Path


SOURCE = Path(__file__).resolve().parents[1] / "src/kokaine/dom.kk"
text = SOURCE.read_text()
start = text.index("fun reconcile-keyed")
end = text.index("fun mount-keyed-fields", start)
reconcile = text[start:end]

commit = reconcile.index("internal/commit-structural-transaction(transaction)")
publish_sources = reconcile.index(
    "final-updates.foreach(fn(update) commit-keyed-update(update))"
)
publish_table = reconcile.index(
    "transaction-store(table,Keyed-table(final-index,final-order))"
)
mark_committed = reconcile.index("transaction-store(committed,True)")

assert commit < publish_sources < publish_table < mark_committed, (
    "scheduler commit must succeed before keyed sources/table become irreversible"
)
