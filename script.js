(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
   * 1. LIGHT / DARK THEME TOGGLE (Synced with Pre-Paint Script & Canvas Colors)
   * ----------------------------------------------------------------------- */
  const themeBtn = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');

  function getEffectiveMode() {
    const attr = document.documentElement.dataset.mode;
    if (attr === 'dark' || attr === 'light') return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeUI() {
    const mode = getEffectiveMode();
    if (themeBtn && themeLabel) {
      themeLabel.textContent = mode === 'dark' ? 'Light' : 'Dark';
      themeBtn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    }
    drawSparkline();
  }

  function toggleTheme() {
    const next = getEffectiveMode() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem('arnab-mode', next);
    } catch (e) {}
    syncThemeUI();
  }

  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* --------------------------------------------------------------------------
   * 2. SILENT-SUCCESS INLINE EMAIL COPY (Zero Toasts)
   * ----------------------------------------------------------------------- */
  document.querySelectorAll('.copy-inline').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email || 'arnavm014@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const orig = btn.dataset.origLabel || btn.textContent;
      btn.dataset.origLabel = orig;
      btn.dataset.state = 'copied';
      btn.textContent = 'Copied';
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(() => {
        btn.textContent = orig;
        delete btn.dataset.state;
      }, 2400);
    });
  });

  /* --------------------------------------------------------------------------
   * 3. TRANSFORM-ONLY SLIDING INK TAB SWITCHERS (Architecture & Resume Studio)
   * ----------------------------------------------------------------------- */
  const ARCH_DIAGRAMS = {
    gcp: {
      title: 'FHIR Vector Store and Vertex AI Plane',
      desc: 'Regulated FHIR vector database and real-time email ingestion into BigQuery feeding Vertex AI via a Terraform Airflow DAG Factory.',
      outcomes: [
        'Cross-cloud AWS Iceberg and Parquet ingestion via STS into BigQuery.',
        'Custom Cloud Composer holiday-aware business-day scheduler plugin.'
      ],
      stack: 'BigQuery, Vertex AI, Vector DB, Composer, Dataform, Terraform, Iceberg',
      label: 'Google Cloud FHIR vector database and Vertex AI ingestion topology',
      markup: `
        <rect class="svg-node" x="24" y="34" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="64">FHIR and Email Feeds</text>
        <text class="svg-sub" x="40" y="84">AWS S3 / Iceberg / STS</text>

        <rect class="svg-node" x="24" y="142" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="172">Composer DAG Factory</text>
        <text class="svg-sub" x="40" y="192">Holiday Calendar Plugin</text>

        <rect class="svg-node-accent" x="228" y="88" width="164" height="74" rx="6"></rect>
        <text class="svg-label" x="244" y="120">BigQuery + Dataform</text>
        <text class="svg-sub" x="244" y="142">Terraform Dev / Prod</text>

        <rect class="svg-node" x="432" y="34" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="64">FHIR Vector DB</text>
        <text class="svg-sub" x="448" y="84">Clinical AI Retrieval</text>

        <rect class="svg-node" x="432" y="142" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="172">Vertex AI Models</text>
        <text class="svg-sub" x="448" y="192">Real-Time ML Plane</text>

        <rect class="svg-node" x="24" y="250" width="552" height="58" rx="6"></rect>
        <text class="svg-label" x="40" y="284">Governance: Terraform IaC, automated SQL optimization, zero-drift checks</text>

        <path class="svg-edge" d="M 184 68 L 228 114"></path>
        <path class="svg-edge" d="M 184 176 L 228 136"></path>
        <path class="svg-edge" d="M 392 114 L 432 68"></path>
        <path class="svg-edge" d="M 392 136 L 432 176"></path>
      `
    },
    tickforge: {
      title: 'Bi-Temporal Order Book and Reconciler',
      desc: 'Buffers WebSocket depth diffs prior to REST snapshot alignment so every sequence gap or crossed book is detected before writing Zstd Parquet partitions.',
      outcomes: [
        'Point-in-time backtest replay verifies zero future look-ahead leaks.',
        'Live BTC, ETH, and SOL reconciliation passed 3/3 with zero drift.'
      ],
      stack: 'Python, PyArrow Parquet (Zstd), Async WebSocket, Microprice, OBI, VWAP',
      label: 'TickForge Binance L2 order book and bi-temporal Parquet lakehouse topology',
      markup: `
        <rect class="svg-node" x="24" y="34" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="64">Binance Depth WS</text>
        <text class="svg-sub" x="40" y="84">Buffer-First Diffs</text>

        <rect class="svg-node" x="24" y="142" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="172">REST Depth Snapshot</text>
        <text class="svg-sub" x="40" y="192">lastUpdateId Sync</text>

        <rect class="svg-node-accent" x="228" y="88" width="164" height="74" rx="6"></rect>
        <text class="svg-label" x="244" y="120">L2 OrderBook Engine</text>
        <text class="svg-sub" x="244" y="142">1.54M/s | 0.6 us p99</text>

        <rect class="svg-node" x="432" y="34" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="64">Bi-Temporal Parquet</text>
        <text class="svg-sub" x="448" y="84">Zstd | 0 PIT Leaks</text>

        <rect class="svg-node" x="432" y="142" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="172">Feed Reconciler</text>
        <text class="svg-sub" x="448" y="192">3/3 OK BTC/ETH/SOL</text>

        <rect class="svg-node" x="24" y="250" width="552" height="58" rx="6"></rect>
        <text class="svg-label" x="40" y="284">Invariants: Zero sequence gaps, zero crossed books, VWAP slippage audited</text>

        <path class="svg-edge" d="M 184 68 L 228 114"></path>
        <path class="svg-edge" d="M 184 176 L 228 136"></path>
        <path class="svg-edge" d="M 392 114 L 432 68"></path>
        <path class="svg-edge" d="M 392 136 L 432 176"></path>
      `
    },
    aws: {
      title: 'High-Availability Healthcare Lakehouse',
      desc: 'Processed 8.5M daily patient records across seven facilities and twelve years of history with zero data loss and full security compliance.',
      outcomes: [
        'Migrated 15TB to AWS, lowering infrastructure costs by 32%.',
        'Tuned Databricks clusters to save $200K annually at 65% higher capacity.'
      ],
      stack: 'AWS, PySpark, Databricks, Starburst, ETL Governance, Cost Engineering',
      label: 'UsefulBI AWS and Databricks 8.5M daily healthcare ETL topology',
      markup: `
        <rect class="svg-node" x="24" y="34" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="64">7 Clinical Facilities</text>
        <text class="svg-sub" x="40" y="84">12 Yrs Patient Data</text>

        <rect class="svg-node" x="24" y="142" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="172">15TB Cloud Cutover</text>
        <text class="svg-sub" x="40" y="192">-32% Infra Spend</text>

        <rect class="svg-node-accent" x="228" y="88" width="164" height="74" rx="6"></rect>
        <text class="svg-label" x="244" y="120">AWS + Databricks</text>
        <text class="svg-sub" x="244" y="142">8.5M/day | 99.99% SLA</text>

        <rect class="svg-node" x="432" y="34" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="64">Starburst Serving</text>
        <text class="svg-sub" x="448" y="84">+65% Peak Capacity</text>

        <rect class="svg-node" x="432" y="142" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="172">Security Audit</text>
        <text class="svg-sub" x="448" y="192">100% Compliance</text>

        <rect class="svg-node" x="24" y="250" width="552" height="58" rx="6"></rect>
        <text class="svg-label" x="40" y="284">Outcome: $200K/yr Databricks compute saved with zero patient record loss</text>

        <path class="svg-edge" d="M 184 68 L 228 114"></path>
        <path class="svg-edge" d="M 184 176 L 228 136"></path>
        <path class="svg-edge" d="M 392 114 L 432 68"></path>
        <path class="svg-edge" d="M 392 136 L 432 176"></path>
      `
    },
    snow: {
      title: '400+ TB Warehouse Migration and dbt Git API',
      desc: 'Led end-to-end legacy Teradata migration to Snowflake with automated row-hash reconciliation and Git-backed dbt Cloud job version control.',
      outcomes: [
        'Published <a href="https://www.phdata.io/blog/how-to-migrate-from-teradata-to-snowflake/" target="_blank" rel="noopener">Teradata to Snowflake migration guide</a>.',
        'Published <a href="https://www.phdata.io/blog/how-to-git-version-control-dbt-cloud-jobs/" target="_blank" rel="noopener">Git version control for dbt Cloud jobs</a>.'
      ],
      stack: 'Snowflake, dbt Cloud API, Azure Repos, Python, Automated Reconciliation',
      label: 'phData 400+ TB Teradata to Snowflake migration and dbt Git CRUD API topology',
      markup: `
        <rect class="svg-node" x="24" y="34" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="64">Legacy Teradata</text>
        <text class="svg-sub" x="40" y="84">400+ TB + SQL Server</text>

        <rect class="svg-node" x="24" y="142" width="160" height="68" rx="6"></rect>
        <text class="svg-label" x="40" y="172">Azure Repos Git CI</text>
        <text class="svg-sub" x="40" y="192">dbt Cloud CRUD API</text>

        <rect class="svg-node-accent" x="228" y="88" width="164" height="74" rx="6"></rect>
        <text class="svg-label" x="244" y="120">Snowflake Cloud DW</text>
        <text class="svg-sub" x="244" y="142">Zero-Loss Cutover</text>

        <rect class="svg-node" x="432" y="34" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="64">Row/Hash Validator</text>
        <text class="svg-sub" x="448" y="84">Drift Detection Tool</text>

        <rect class="svg-node" x="432" y="142" width="144" height="68" rx="6"></rect>
        <text class="svg-label" x="448" y="172">Published Guides</text>
        <text class="svg-sub" x="448" y="192">2 phData Tech Blogs</text>

        <rect class="svg-node" x="24" y="250" width="552" height="58" rx="6"></rect>
        <text class="svg-label" x="40" y="284">Verification: Automated row and hash parity across 400+ TB partitions</text>

        <path class="svg-edge" d="M 184 68 L 228 114"></path>
        <path class="svg-edge" d="M 184 176 L 228 136"></path>
        <path class="svg-edge" d="M 392 114 L 432 68"></path>
        <path class="svg-edge" d="M 392 136 L 432 176"></path>
      `
    }
  };

  const RESUME_EDITIONS = {
    general: {
      title: 'Senior Data and Cloud Platform Edition',
      desc: 'Google Cloud FHIR vector architecture, Vertex AI pipelines, 400+ TB Snowflake migrations, and TickForge benchmarks.',
      modernHref: 'resumes/Arnab_Mondal_Resume_2026_Modern.pdf',
      modernLabel: 'Download 1-Page Modern PDF',
      fullHref: 'resumes/Arnab_Mondal_Resume_2026.pdf'
    },
    ai: {
      title: 'Applied AI and ML Platform Edition',
      desc: 'Tailored for applied AI and ML infrastructure teams: FHIR semantic retrieval, Vertex AI real-time data planes, MediPulse Edge AI, and MCP agent workflows.',
      modernHref: 'resumes/Arnab_Mondal_Applied_AI_2026_Modern.pdf',
      modernLabel: 'Download 1-Page Applied AI PDF',
      fullHref: 'resumes/Arnab_Mondal_Applied_AI_2026.pdf'
    },
    quant: {
      title: 'Quantitative Data and Systems Edition',
      desc: 'Tailored for trading and quant infrastructure teams: C++/Python/Java concurrency, TickForge L2 order book, bi-temporal Parquet, and holiday schedulers.',
      modernHref: 'resumes/Arnab_Mondal_Quant_Systems_2026_Modern.pdf',
      modernLabel: 'Download 1-Page Quant PDF',
      fullHref: 'resumes/Arnab_Mondal_Quant_Data_Systems_2026.pdf'
    }
  };

  const ROLE_BULLETS = {
    gcp: [
      'Architected a compliant FHIR healthcare vector database on GCP for low-latency clinical AI retrieval.',
      'Built real-time organizational email ingestion into BigQuery powering downstream Vertex AI pipelines.',
      'Delivered a reusable Apache Airflow DAG Factory and end-to-end Terraform IaC across Dev, Staging, and Production.',
      'Engineered cross-cloud AWS-to-GCP Apache Iceberg and Parquet ETL via STS plus a custom holiday-aware Composer calendar plugin.',
      'Completed Phase 1 enterprise bare-metal-to-GCP migration and Python-driven Dataform SQL optimization.'
    ],
    usefulbi: [
      'Built AWS and Databricks healthcare pipeline processing 8.5M patient records daily at 99.99% uptime across seven facilities.',
      'Migrated 15TB to AWS (32% cost reduction) with zero data loss across twelve years of patient history.',
      'Optimized Databricks clusters to save $200K annually while increasing processing capacity by 65%.'
    ],
    phdata: [
      'Engineered 400+ TB migration from <a href="https://www.phdata.io/blog/how-to-migrate-from-teradata-to-snowflake/" target="_blank" rel="noopener">Teradata to Snowflake</a> with automated row-hash reconciliation.',
      'Designed <a href="https://www.phdata.io/blog/how-to-git-version-control-dbt-cloud-jobs/" target="_blank" rel="noopener">Git version control for dbt Cloud jobs</a> via Azure Repo APIs and built a SQL Server-to-Snowflake utility.'
    ],
    afour: [
      'Maintained production OpenStack platform services in Python and built token-based authentication.',
      'Implemented three-stage PySpark AWS Glue medallion ingestion jobs across raw and curated zones.'
    ],
    tcs: [
      'Engineered Python and PySpark ETL pipelines scheduled via Apache Airflow ingesting up to 1TB daily across Cloudera Spark, Kafka, Impala, Hive, and HDFS.'
    ],
    stack: [
      'Cloud and Lakehouse: GCP (BigQuery, Vertex AI, Composer, Dataform, Pub/Sub, Bigtable, STS), AWS (Glue, S3, Athena, Lambda), Snowflake, Databricks, Apache Iceberg, Starburst.',
      'Applied AI and Quant Data: Vector Databases (FHIR), Semantic Search/RAG, Real-Time Feature Ingestion, Bi-Temporal Parquet, Feed Reconciliation, MCP Agentic Workflows.',
      'Systems and Orchestration: Python, C++, Java, SQL, PySpark, Apache Kafka, gRPC, Concurrency, Apache Airflow, dbt, Terraform, Kubernetes, Docker, CI/CD.'
    ]
  };

  function setupRoleDrawers() {
    document.querySelectorAll('.role-drawer[data-role]').forEach((drawer) => {
      const key = drawer.dataset.role;
      const box = drawer.querySelector('.role-details');
      if (box && ROLE_BULLETS[key]) {
        box.innerHTML = '<ul>' + ROLE_BULLETS[key].map((item) => `<li>${item}</li>`).join('') + '</ul>';
      }
    });
  }

  function positionIndicator(group) {
    const indicator = group.querySelector('.seg-indicator');
    const active = group.querySelector('.seg-tab[aria-selected="true"]');
    if (!indicator || !active) return;
    const x = active.offsetLeft;
    const w = active.offsetWidth;
    indicator.style.width = '1px';
    indicator.style.transform = `translateX(${x}px) scaleX(${w})`;
  }

  function setupSegmentedControls() {
    const groups = document.querySelectorAll('.seg-control');
    groups.forEach((group) => {
      const tabs = Array.from(group.querySelectorAll('.seg-tab'));
      function activate(tab) {
        tabs.forEach((t) => {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        positionIndicator(group);

        const archKey = tab.dataset.archKey;
        if (archKey && ARCH_DIAGRAMS[archKey]) {
          const d = ARCH_DIAGRAMS[archKey];
          const titleEl = document.getElementById('arch-title');
          const descEl = document.getElementById('arch-desc');
          const outEl = document.getElementById('arch-outcomes');
          const stackEl = document.getElementById('arch-stack');
          const svg = document.getElementById('arch-svg');
          const content = document.getElementById('arch-svg-content');
          if (titleEl) titleEl.textContent = d.title;
          if (descEl) descEl.textContent = d.desc;
          if (outEl) outEl.innerHTML = d.outcomes.map((o) => `<li>${o}</li>`).join('');
          if (stackEl) stackEl.textContent = d.stack;
          if (svg && content) {
            svg.setAttribute('aria-label', d.label);
            content.innerHTML = d.markup;
          }
        }

        const resKey = tab.dataset.resumeKey;
        if (resKey && RESUME_EDITIONS[resKey]) {
          const r = RESUME_EDITIONS[resKey];
          const titleEl = document.getElementById('res-title');
          const descEl = document.getElementById('res-desc');
          const modLink = document.getElementById('res-modern-link');
          const fullLink = document.getElementById('res-full-link');
          if (titleEl) titleEl.textContent = r.title;
          if (descEl) descEl.textContent = r.desc;
          if (modLink) {
            modLink.href = r.modernHref;
            modLink.textContent = r.modernLabel;
          }
          if (fullLink) fullLink.href = r.fullHref;
        }
      }

      tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const delta = e.key === 'ArrowRight' ? 1 : -1;
            const next = tabs[(idx + delta + tabs.length) % tabs.length];
            next.focus();
            activate(next);
          }
        });
      });

      positionIndicator(group);
    });

    window.addEventListener('resize', () => {
      groups.forEach(positionIndicator);
    });
  }

  /* --------------------------------------------------------------------------
   * 4. NO-JS-SAFE SCROLL REVEAL + TABULAR METRIC SETTLE
   * ----------------------------------------------------------------------- */
  function animateCount(el) {
    if (reducedMotion || el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.countTarget);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const prefix = el.dataset.countPrefix || '';
    const suffix = el.dataset.countSuffix || '';
    const dur = 500;
    const start = performance.now();
    const fmt = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = target * eased;
      el.textContent = `${prefix}${fmt.format(val)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = `${prefix}${fmt.format(target)}${suffix}`;
    }
    requestAnimationFrame(step);
  }

  function setupReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => {
        el.dataset.reveal = 'in';
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.reveal = 'in';
          entry.target.querySelectorAll('[data-count-target]').forEach(animateCount);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------------------------
   * 5. LIVE BINANCE BTC/USDT L2 TELEMETRY + CANVAS SPARKLINE
   * ----------------------------------------------------------------------- */
  const sparkCanvas = document.getElementById('l2-spark');
  const sparkSeries = [];
  const MAX_SPARK_POINTS = 48;

  function drawSparkline() {
    if (!sparkCanvas) return;
    const ctx = sparkCanvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = sparkCanvas.getBoundingClientRect();
    const w = Math.max(200, Math.round(rect.width));
    const h = Math.max(48, Math.round(rect.height));
    if (sparkCanvas.width !== w * dpr || sparkCanvas.height !== h * dpr) {
      sparkCanvas.width = w * dpr;
      sparkCanvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--color-accent').trim() || '#006d45';
    const rule = styles.getPropertyValue('--color-rule').trim() || '#c5ccc9';

    // Baseline hairline
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    if (sparkSeries.length < 2) return;
    let min = Infinity;
    let max = -Infinity;
    for (const v of sparkSeries) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const span = Math.max(max - min, 0.5);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.75;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    sparkSeries.forEach((val, idx) => {
      const x = (idx / (MAX_SPARK_POINTS - 1)) * w;
      const y = h - 6 - ((val - min) / span) * (h - 12);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderOrderBook(bids, asks, seqText) {
    if (!bids || !asks || !bids.length || !asks.length) return;
    const bestBid = parseFloat(bids[0][0]);
    const bestAsk = parseFloat(asks[0][0]);
    if (!bestBid || !bestAsk || bestBid >= bestAsk) return;

    const mid = (bestBid + bestAsk) / 2;
    const spreadBps = ((bestAsk - bestBid) / mid) * 10000;
    const bidVol = bids.slice(0, 5).reduce((s, r) => s + parseFloat(r[1]), 0);
    const askVol = asks.slice(0, 5).reduce((s, r) => s + parseFloat(r[1]), 0);
    const obi = bidVol + askVol > 0 ? (bidVol - askVol) / (bidVol + askVol) : 0;

    const midEl = document.getElementById('l2-mid');
    const spreadEl = document.getElementById('l2-spread');
    const obiEl = document.getElementById('l2-obi');
    const seqEl = document.getElementById('l2-seq');
    const bidsEl = document.getElementById('l2-bids');
    const asksEl = document.getElementById('l2-asks');

    if (midEl) midEl.textContent = '$' + mid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (spreadEl) spreadEl.textContent = `${spreadBps.toFixed(2)} bps`;
    if (obiEl) obiEl.textContent = `${obi >= 0 ? '+' : ''}${obi.toFixed(2)}`;
    if (seqEl && seqText) seqEl.textContent = seqText;

    if (bidsEl) {
      bidsEl.innerHTML = bids
        .slice(0, 3)
        .map(
          ([p, q]) =>
            `<div class="l2-row l2-row-bid"><span class="l2-price-bid">${parseFloat(p).toFixed(2)}</span><span>${parseFloat(q).toFixed(3)}</span></div>`
        )
        .join('');
    }
    if (asksEl) {
      asksEl.innerHTML = asks
        .slice(0, 3)
        .map(
          ([p, q]) =>
            `<div class="l2-row l2-row-ask"><span class="l2-price-ask">${parseFloat(p).toFixed(2)}</span><span>${parseFloat(q).toFixed(3)}</span></div>`
        )
        .join('');
    }

    sparkSeries.push(mid);
    if (sparkSeries.length > MAX_SPARK_POINTS) sparkSeries.shift();
    drawSparkline();
  }

  function startLiveBinance() {
    const statusEl = document.getElementById('l2-status');
    let tickCount = 0;

    // Immediate REST snapshot so first paint has real Binance prices even before WS opens
    fetch('https://data-api.binance.vision/api/v3/depth?symbol=BTCUSDT&limit=5')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.bids && data.asks) {
          renderOrderBook(data.bids, data.asks, `REST #${data.lastUpdateId}`);
          if (statusEl && statusEl.textContent.startsWith('Connecting')) {
            statusEl.textContent = 'Live REST';
          }
        }
      })
      .catch(() => {});

    function connectWS(url, fallbackUrl) {
      let ws;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        if (fallbackUrl) connectWS(fallbackUrl, null);
        return;
      }

      ws.onopen = () => {
        if (statusEl) statusEl.textContent = 'Live WS';
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.bids && msg.asks) {
            tickCount += 1;
            renderOrderBook(msg.bids, msg.asks, `WS #${msg.lastUpdateId} (${tickCount} ticks)`);
          }
        } catch (e) {}
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        if (fallbackUrl) {
          connectWS(fallbackUrl, null);
        } else if (statusEl && tickCount === 0) {
          statusEl.textContent = 'Snapshot mode';
        }
      };
    }

    connectWS(
      'wss://data-stream.binance.vision/ws/btcusdt@depth5@100ms',
      'wss://stream.binance.com:9443/ws/btcusdt@depth5@100ms'
    );
  }

  /* --------------------------------------------------------------------------
   * 6. LIVE GITHUB PROOF + BENGALURU IST CLOCK
   * ----------------------------------------------------------------------- */
  function loadGitHubStats() {
    const el = document.getElementById('gh-live-stats');
    if (!el) return;
    fetch('https://api.github.com/users/arnabm14')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u && typeof u.public_repos === 'number') {
          el.textContent = `GitHub live: arnabm14 (${u.public_repos} public repositories, Python, C++, Java, SQL, Terraform)`;
        }
      })
      .catch(() => {});
  }

  function updateIstClock() {
    const el = document.getElementById('ist-clock');
    if (!el) return;
    try {
      const now = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      el.textContent = `Bengaluru, India (${now} IST)`;
    } catch (e) {
      el.textContent = 'Bengaluru, India (IST)';
    }
  }

  /* --------------------------------------------------------------------------
   * 7. KEYBOARD-FIRST COMMAND PALETTE (Ctrl+K / Cmd+K / /)
   * ----------------------------------------------------------------------- */
  const cmdDialog = document.getElementById('cmd-dialog');
  const cmdInput = document.getElementById('cmd-input');
  const cmdList = document.getElementById('cmd-list');
  const cmdOpenBtn = document.getElementById('cmd-open-btn');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');

  const COMMANDS = [
    { label: 'Launch TickForge Live Terminal', hint: 'External', run: () => window.open('https://tickforge-2dn.pages.dev', '_blank', 'noopener') },
    { label: 'Download 1-Page Modern Resume (General)', hint: 'PDF', run: () => window.open('resumes/Arnab_Mondal_Resume_2026_Modern.pdf', '_blank', 'noopener') },
    { label: 'Download 1-Page Applied AI Resume', hint: 'PDF', run: () => window.open('resumes/Arnab_Mondal_Applied_AI_2026_Modern.pdf', '_blank', 'noopener') },
    { label: 'Download 1-Page Quant Systems Resume', hint: 'PDF', run: () => window.open('resumes/Arnab_Mondal_Quant_Systems_2026_Modern.pdf', '_blank', 'noopener') },
    { label: 'Jump to Built in Production', hint: 'Section', run: () => document.getElementById('systems')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) },
    { label: 'Jump to System Architecture', hint: 'Section', run: () => document.getElementById('architecture')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) },
    { label: 'Jump to Career and Credentials', hint: 'Section', run: () => document.getElementById('experience')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) },
    { label: 'Jump to Resume Studio', hint: 'Section', run: () => document.getElementById('resumes')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) },
    { label: 'Toggle Light / Dark Theme', hint: 'Theme', run: () => toggleTheme() },
    { label: 'Copy Email (arnavm014@gmail.com)', hint: 'Clipboard', run: () => document.getElementById('hero-copy-email')?.click() },
    { label: 'Open GitHub Profile', hint: 'External', run: () => window.open('https://github.com/arnabm14', '_blank', 'noopener') },
    { label: 'Open LinkedIn Profile', hint: 'External', run: () => window.open('https://www.linkedin.com/in/arnab1408/', '_blank', 'noopener') }
  ];

  let filteredCmds = COMMANDS.slice();
  let selectedIdx = 0;

  function renderCmdList() {
    if (!cmdList) return;
    cmdList.innerHTML = '';
    filteredCmds.forEach((cmd, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmd-item';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', idx === selectedIdx ? 'true' : 'false');
      btn.innerHTML = `<span>${cmd.label}</span><span class="cmd-hint">${cmd.hint}</span>`;
      btn.addEventListener('click', () => {
        cmdDialog.close();
        cmd.run();
      });
      li.appendChild(btn);
      cmdList.appendChild(li);
    });
  }

  function openCmdPalette() {
    if (!cmdDialog) return;
    filteredCmds = COMMANDS.slice();
    selectedIdx = 0;
    if (cmdInput) cmdInput.value = '';
    renderCmdList();
    if (!cmdDialog.open) cmdDialog.showModal();
    if (cmdInput) cmdInput.focus();
  }

  if (cmdOpenBtn) cmdOpenBtn.addEventListener('click', openCmdPalette);
  if (cmdCloseBtn && cmdDialog) cmdCloseBtn.addEventListener('click', () => cmdDialog.close());

  if (cmdDialog) {
    cmdDialog.addEventListener('click', (e) => {
      if (e.target === cmdDialog) cmdDialog.close();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', () => {
      const q = cmdInput.value.trim().toLowerCase();
      filteredCmds = COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
      selectedIdx = 0;
      renderCmdList();
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCmds.length) {
          selectedIdx = (selectedIdx + 1) % filteredCmds.length;
          renderCmdList();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCmds.length) {
          selectedIdx = (selectedIdx - 1 + filteredCmds.length) % filteredCmds.length;
          renderCmdList();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCmds[selectedIdx]) {
          cmdDialog.close();
          filteredCmds[selectedIdx].run();
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdDialog && cmdDialog.open) cmdDialog.close();
      else openCmdPalette();
    } else if (!typing && e.key === '/' && cmdDialog && !cmdDialog.open) {
      e.preventDefault();
      openCmdPalette();
    }
  });

  /* --------------------------------------------------------------------------
   * BOOTSTRAP
   * ----------------------------------------------------------------------- */
  syncThemeUI();
  setupRoleDrawers();
  setupSegmentedControls();
  setupReveals();
  startLiveBinance();
  loadGitHubStats();
  updateIstClock();
  setInterval(updateIstClock, 30000);
})();
