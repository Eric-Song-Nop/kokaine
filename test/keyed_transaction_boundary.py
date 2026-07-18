"""Static guard for the keyed transaction's irreversible publication boundary."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/kokaine/dom.kk"
text = SOURCE.read_text()
keyed_context = (ROOT / "src/kokaine/dom/internal/keyed-transaction.kk").read_text()
start = text.index("fun reconcile-keyed")
end = text.index("fun mount-keyed-fields", start)
reconcile = text[start:end]

promote = reconcile.index("promote-keyed-participation(participation)")
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
    < promote
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
assert "current-provision(root)" in text
assert "open-provision(root)" in text
assert "entry-provision.same(expected)" in keyed_context
assert "active provision does not belong to this renderer transaction" in keyed_context

reactive_sources = "\n".join(
    path.read_text()
    for path in (ROOT / "src/kokaine/reactive").rglob("*.kk")
)
for forbidden in (
    "work-publication",
    "root-work-publications",
    "stage-structural-publication",
    "stage-work-publication",
    "structural-transaction",
):
    assert forbidden not in reactive_sources, (
        f"obsolete host coordination leaked into reactive core: {forbidden}"
    )

kokaine_sources = "\n".join(
    path.read_text() for path in (ROOT / "src/kokaine").rglob("*.kk")
)
assert "structural-owner" not in kokaine_sources, (
    "the removed core structural-owner capability must not survive as an alias"
)
assert "open-lifetime-scope(root)" in text
assert "with-lifetime-scope(root,scope" in text
