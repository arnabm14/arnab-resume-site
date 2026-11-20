/* Arnab Mondal Engineering Portfolio — Interactive Filter, Code Explorer, and Modals */

const CODE_SNIPPETS = {
  tickforge: `# TickForge: Official Binance Buffer-First L2 Synchronization Protocol
async def sync_order_book(ws, symbol: str) -> L2OrderBook:
    buffer = []
    # 1. Open WebSocket stream first and buffer incremental depth deltas
    t_end = time.monotonic() + 1.0
    while time.monotonic() < t_end:
        ev = json.loads(await ws.recv())
        if ev.get("s") == symbol:
            buffer.append(ev)

    # 2. Fetch authoritative REST snapshot while WebSocket stays open
    snap = fetch_rest_depth(symbol, limit=100)
    book = L2OrderBook(symbol)
    book.load_snapshot(snap["lastUpdateId"], snap["bids"], snap["asks"])

    # 3. Replay strictly with Binance invariant: U <= lastUpdateId + 1 <= u
    for ev in buffer:
        if int(ev["u"]) <= book.last_update_id:
            continue
        ok = book.apply_depth_diff(ev["U"], ev["u"], ev["b"], ev["a"], strict_sequence=True)
        if not ok:
            raise SequenceGapError(f"Gap detected on {symbol}: expected <= {book.last_update_id + 1}")
    return book`,

  bitemporal: `# Bi-Temporal Point-in-Time Parquet Store (Zero Look-Ahead Bias Guarantee)
def query_as_of(path: Path, as_of_knowledge_ms: int, symbol: str) -> pa.Table:
    table = pq.read_table(path)
    # Exclude late-arriving historical backfills whose knowledge_time_ms > cutoff
    mask = pc.and_(
        pc.less_equal(table["knowledge_time_ms"], pa.scalar(as_of_knowledge_ms, pa.int64())),
        pc.equal(table["symbol"], pa.scalar(symbol, pa.string())),
    )
    pit_slice = table.filter(mask)
    max_k = pc.max(pit_slice["knowledge_time_ms"]).as_py()
    assert max_k is None or max_k <= as_of_knowledge_ms, "Temporal leakage detected!"
    return pit_slice`,

  dagfactory: `# Reusable Cloud Composer (Airflow) DAG Factory + Custom Business-Day Calendar
def build_pipeline_dag(spec: dict) -> DAG:
    with DAG(
        dag_id=f"ingestor_{spec['domain']}_{spec['env']}",
        schedule=WeekdayHolidayTimetable(calendar_id=spec["holiday_calendar"]),
        catchup=False,
        default_args={"retries": 3, "retry_delay": timedelta(minutes=2)},
    ) as dag:
        extract = BigQueryInsertJobOperator(
            task_id="ingest_to_raw",
            configuration={"query": {"query": spec["extract_sql"], "useLegacySql": False}},
        )
        transform = DataformCreateWorkflowInvocationOperator(
            task_id="run_dataform_models",
            repository_id=spec["dataform_repo"],
            workflow_invocation={"compilation_result": spec["compilation_id"]},
        )
        extract >> transform
    return dag`,

  reconcile: `-- 400+ TB Warehouse Migration Automated Row and Hash Reconciliation
WITH source_agg AS (
  SELECT partition_dt, COUNT(*) AS row_cnt, BITXOR_AGG(HASH(pk_id, amount_num, updated_ts)) AS row_hash
  FROM legacy_stage.patient_ledger
  GROUP BY partition_dt
),
target_agg AS (
  SELECT partition_dt, COUNT(*) AS row_cnt, BITXOR_AGG(HASH(pk_id, amount_num, updated_ts)) AS row_hash
  FROM prod_snowflake.patient_ledger
  GROUP BY partition_dt
)
SELECT
  COALESCE(s.partition_dt, t.partition_dt) AS partition_dt,
  s.row_cnt AS src_rows,
  t.row_cnt AS tgt_rows,
  CASE WHEN s.row_cnt = t.row_cnt AND s.row_hash = t.row_hash THEN 'MATCH' ELSE 'DRIFT' END AS audit_status
FROM source_agg s
FULL OUTER JOIN target_agg t ON s.partition_dt = t.partition_dt
WHERE s.row_cnt IS DISTINCT FROM t.row_cnt OR s.row_hash IS DISTINCT FROM t.row_hash;`
};

const CASE_STUDIES = {
  gcp: {
    title: 'Google Cloud: FHIR Vector DB, Real-Time Vertex AI, and Terraform DAG Factory',
    html: `
      <p><strong>Challenge:</strong> Unify enterprise bare-metal historical data, cross-cloud AWS Apache Iceberg tables, real-time organizational email streams, and strictly compliant FHIR healthcare records into a single governed GCP platform powering Vertex AI and low-latency AI retrieval.</p>
      <p><strong>Architecture:</strong> Built a Terraform-managed Airflow DAG Factory on Cloud Composer with a custom business-day/holiday scheduling plugin, automated STS ingestion from AWS to BigQuery for Iceberg and Hive-partitioned Parquet, Python-automated Dataform transformation suites, and a compliant vector database indexing FHIR clinical records for AI retrieval.</p>
      <p><strong>Outcome:</strong> Standardized repeatable Dev/Staging/Prod MLOps and DataOps lifecycles, improved pipeline throughput over legacy bare-metal infrastructure, and enabled rapid compliant AI retrieval.</p>
    `
  },
  usefulbi: {
    title: 'UsefulBI: 8.5M Records/Day Healthcare Platform ($200K/yr Compute Savings)',
    html: `
      <p><strong>Challenge:</strong> Migrate 15TB covering 12 years of regulated patient history across 7 healthcare facilities onto AWS and Databricks with zero data loss and strict compliance.</p>
      <p><strong>Architecture:</strong> Engineered fault-tolerant PySpark ingestion pipelines with automated schema/record validation, row-level security governance, Starburst federation, and adaptive Databricks cluster sizing.</p>
      <p><strong>Outcome:</strong> 99.99% production uptime on 8.5M daily patient records, 100% security compliance, 32% infrastructure cost reduction, and $200K/yr Databricks savings while lifting processing capacity by 65%.</p>
    `
  },
  phdata: {
    title: 'phData: 400+ TB Legacy Data Warehouse to Snowflake Migration',
    html: `
      <p><strong>Challenge:</strong> Migrate over 400 Terabytes from legacy enterprise warehouses (Teradata and SQL Server) into Snowflake with zero silent drift or data loss.</p>
      <p><strong>Architecture:</strong> Built end-to-end PySpark/Snowflake ingestion utilities, automated partition-level row-count and hash reconciliation tooling, and a Git-backed Azure repository API framework for version-controlling dbt Cloud jobs.</p>
      <p><strong>Outcome:</strong> Verified zero-loss cutover across 400+ TB and published reusable migration and dbt CI/CD patterns on the official phData engineering blog.</p>
    `
  }
};

function init() {
  // Experience ecosystem filters
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.role-card').forEach((card) => {
        if (filter === 'all') {
          card.hidden = false;
        } else {
          const tags = (card.dataset.ecosystems || '').split(/\s+/);
          card.hidden = !tags.includes(filter);
        }
      });
    });
  });

  // Code snippet tabs
  const viewer = document.getElementById('code-viewer');
  const setSnippet = (key) => {
    viewer.textContent = CODE_SNIPPETS[key] || '';
    document.querySelectorAll('.code-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.snippet === key);
    });
  };
  document.querySelectorAll('.code-tab').forEach((tab) => {
    tab.addEventListener('click', () => setSnippet(tab.dataset.snippet));
  });
  setSnippet('tickforge');

  // Copy snippet button
  const copyBtn = document.getElementById('copy-code-btn');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(viewer.textContent);
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = 'Copy snippet'; }, 1600);
    } catch (_) {
      copyBtn.textContent = 'Copy failed';
    }
  });

  // Resume modal
  const resumeModal = document.getElementById('resume-modal');
  const openResume = () => { resumeModal.hidden = false; };
  const closeResume = () => { resumeModal.hidden = true; };
  document.getElementById('open-resume-modal').addEventListener('click', openResume);
  document.getElementById('hero-resume-btn').addEventListener('click', openResume);
  document.getElementById('close-resume-modal').addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => { if (e.target === resumeModal) closeResume(); });

  // Case study modal
  const caseModal = document.getElementById('case-modal');
  const caseTitle = document.getElementById('case-modal-title');
  const caseBody = document.getElementById('case-modal-body');
  const closeCase = () => { caseModal.hidden = true; };
  document.querySelectorAll('[data-case]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const c = CASE_STUDIES[btn.dataset.case];
      if (!c) return;
      caseTitle.textContent = c.title;
      caseBody.innerHTML = c.html;
      caseModal.hidden = false;
    });
  });
  document.getElementById('close-case-modal').addEventListener('click', closeCase);
  caseModal.addEventListener('click', (e) => { if (e.target === caseModal) closeCase(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResume();
      closeCase();
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
