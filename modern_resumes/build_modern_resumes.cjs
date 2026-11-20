/**
 * Resume-as-Code Generator — 2026 Swiss-Editorial / RenderCV Engineering Spec
 * Unified with arnab-mondal.pages.dev (Swiss Archival Paper + Quant Viridian #006d45)
 * Compiles 3 tailored, 100% ATS-linear, single-column 1-page US Letter vector PDFs:
 *   1. Arnab_Mondal_Resume_2026_Modern.pdf         (General Senior Data & Applied AI)
 *   2. Arnab_Mondal_Applied_AI_2026_Modern.pdf     (Applied AI & ML Data Platforms)
 *   3. Arnab_Mondal_Quant_Systems_2026_Modern.pdf  (Quantitative Data & Distributed Systems)
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const OUT_DIR = path.join(__dirname);
const RESUMES_WEB_DIR = path.join(__dirname, '..', 'resumes');
fs.mkdirSync(RESUMES_WEB_DIR, { recursive: true });

const SHARED_CSS = `
@page { size: letter portrait; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 8.5in;
  background: #ffffff;
  color: #111715;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 8.1pt;
  line-height: 1.27;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0, "clig" 0;
  hyphens: none;
  -webkit-font-smoothing: antialiased;
}
.page {
  width: 8.5in;
  padding: 0.36in 0.48in 0.36in 0.48in;
  background: #ffffff;
}
a {
  color: #006d45;
  text-decoration: none;
  border-bottom: 0.5pt solid rgba(0, 109, 69, 0.28);
}
.mono {
  font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 14pt;
  padding-bottom: 5.5pt;
  margin-bottom: 5.5pt;
}
.header-left h1 {
  font-size: 19.5pt;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.04;
  color: #111715;
}
.header-subtitle {
  font-size: 8.75pt;
  font-weight: 500;
  color: #006d45;
  margin-top: 1.5pt;
}
.header-right {
  text-align: right;
  font-size: 7.75pt;
  color: #38413d;
  line-height: 1.38;
}
.header-right .sep { color: #9aa49f; margin: 0 4pt; }

/* Impact Anchor Bar — 1-line 4-column Swiss hairline ledger */
.impact-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1pt solid #111715;
  border-bottom: 0.75pt solid #cdd4d0;
  padding: 4pt 0;
  margin-bottom: 5.5pt;
  gap: 8pt;
}
.impact-cell {
  display: flex;
  align-items: baseline;
  gap: 4pt;
}
.impact-val {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 8.4pt;
  color: #006d45;
  white-space: nowrap;
}
.impact-lbl {
  font-size: 7.35pt;
  color: #525c57;
  line-height: 1.15;
}

.summary {
  font-size: 8.05pt;
  color: #262e2a;
  margin-bottom: 5.5pt;
  line-height: 1.31;
}

/* Sections — NO position: relative so Chromium Skia PDF emits 100% linear ATS text stream */
.section { margin-bottom: 5.5pt; }
.section:last-child { margin-bottom: 0; }
.section-title {
  font-size: 8.0pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #111715;
  border-bottom: 0.75pt solid #cdd4d0;
  background: linear-gradient(#006d45, #006d45) left bottom / 24pt 1.5pt no-repeat;
  padding-bottom: 2.5pt;
  margin-bottom: 3.8pt;
}

/* Skills */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 1.6pt;
  font-size: 7.85pt;
  line-height: 1.28;
}
.skill-line strong { color: #111715; font-weight: 600; }
.skill-line span { color: #38413d; }

/* Experience */
.role { margin-bottom: 4.5pt; }
.role:last-child { margin-bottom: 0; }
.role-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8pt;
}
.role-company { font-weight: 700; font-size: 8.7pt; color: #111715; }
.role-divider { color: #9aa49f; margin: 0 3.5pt; }
.role-title { font-weight: 500; color: #38413d; font-size: 8.2pt; }
.role-meta { font-size: 7.5pt; color: #525c57; white-space: nowrap; }

ul.bullets {
  margin-top: 1.6pt;
  padding-left: 11.5pt;
  list-style-type: square;
  display: flex;
  flex-direction: column;
  gap: 1.4pt;
}
ul.bullets li {
  color: #262e2a;
}
ul.bullets li::marker {
  color: #006d45;
  font-size: 0.72em;
}
ul.bullets li strong { color: #111715; font-weight: 600; }

/* Projects */
.proj { margin-bottom: 3pt; }
.proj:last-child { margin-bottom: 0; }
.proj-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8pt;
}
.proj-name { font-weight: 700; font-size: 8.25pt; color: #111715; }
.proj-links { font-size: 7.45pt; white-space: nowrap; color: #525c57; }
.proj-desc { color: #262e2a; font-size: 7.85pt; margin-top: 0.8pt; line-height: 1.28; }

/* Certifications & Education */
.certs-line {
  font-size: 7.85pt;
  color: #262e2a;
  display: flex;
  flex-wrap: wrap;
  gap: 10pt;
  margin-bottom: 2.8pt;
}
.certs-line a { font-weight: 600; }
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10pt;
  font-size: 7.85pt;
  color: #262e2a;
}
.bottom-row strong { color: #111715; font-weight: 600; }
`;

const EDITIONS = [
  {
    slug: 'Arnab_Mondal_Resume_2026_Modern',
    webName: 'Arnab_Mondal_Resume_2026_Modern.pdf',
    subtitle: 'Senior Data & Applied AI Platform Engineer · Google Cloud',
    impacts: [
      ['7+ yrs', 'Cloud Data & AI Systems'],
      ['400+ TB', 'Snowflake Migration'],
      ['8.5M/day', '99.99% Healthcare ETL'],
      ['1.54M/s', 'TickForge L2 (0.6 us p99)']
    ],
    summary:
      'Data & Applied AI Engineer at Google Cloud (7+ years) architecting petabyte-scale multi-cloud data platforms, compliant FHIR healthcare vector databases, real-time Vertex AI ingestion pipelines, and cross-cloud Apache Iceberg lakehouses. Proven track record shipping 99.99%-uptime healthcare pipelines (8.5M records/day, $200K/yr compute saved) and 400+ TB Snowflake migrations with zero data loss.',
    skills: [
      ['Cloud & Lakehouse', 'GCP (BigQuery, Vertex AI, Cloud Composer, Dataform, Pub/Sub, Bigtable, STS), AWS (Glue, S3, Athena, Lambda, Step Functions), Azure, Snowflake, Databricks, Apache Iceberg, Starburst'],
      ['Applied AI & Data Quality', 'Vector Databases (FHIR AI Retrieval), Semantic Search / RAG, Real-Time Feature Ingestion, Bi-Temporal Parquet, Cross-Feed Reconciliation, Agentic Workflows & MCP'],
      ['Languages & Distributed Systems', 'Python, C++, Java, SQL, PySpark, Apache Spark, Apache Kafka, Distributed Systems, Concurrency, gRPC, REST APIs, Hadoop, Hive, HDFS, Impala, Cassandra, DynamoDB'],
      ['Orchestration & IaC', 'Apache Airflow (Custom Plugins & DAG Factories), dbt, Terraform, Kubernetes, Docker, CI/CD, Jenkins, Git, Fivetran, HVR, OpenStack, Kerberos']
    ],
    googleRole: 'Data Engineer (Cloud Data & Applied AI Platforms)',
    googleBullets: [
      '<strong>Compliant FHIR Vector Database:</strong> Architected a vector database for regulated FHIR healthcare data on GCP, enabling low-latency AI-driven clinical retrieval and accelerated insight delivery.',
      '<strong>Real-Time Vertex AI Pipeline:</strong> Engineered a real-time organizational email ingestion pipeline into BigQuery serving as the foundational data plane for downstream ML workflows on Google Cloud Vertex AI.',
      '<strong>Airflow DAG Factory & Terraform IaC:</strong> Built a reusable Apache Airflow DAG Factory and orchestrated end-to-end Terraform IaC across Dev, Staging, and Production, standardizing repeatable MLOps and DataOps lifecycles.',
      '<strong>Cross-Cloud Apache Iceberg Migration:</strong> Engineered AWS-to-GCP ETL pipelines via STS ingesting Hive-partitioned Parquet and Apache Iceberg datasets into BigQuery; owned a custom Cloud Composer business-day/holiday calendar plugin.',
      '<strong>Bare-Metal Modernization & Dataform Automation:</strong> Delivered Phase 1 enterprise bare-metal-to-GCP migration via a unified ingestion pipeline and automated Dataform/BigQuery SQL optimization in Python while leading architecture reviews.'
    ],
    usefulbiBullets: [
      '<strong>8.5M/Day High-Availability Platform:</strong> Built AWS/Databricks pipeline processing <strong>8.5M patient records daily at 99.99% uptime</strong> across 7 healthcare facilities (12 years of records, zero data loss, 100% security compliance).',
      '<strong>$200K/Yr Cost & Performance Optimization:</strong> Migrated 15TB healthcare data to AWS (<strong>-32% infra cost</strong>) and tuned Databricks clusters, saving <strong>$200K annually</strong> while expanding processing capacity by 65%.'
    ],
    phdataBullets: [
      '<strong>400+ TB Warehouse Migration & Validation:</strong> Built end-to-end pipeline migrating <strong>400+ TB</strong> from <a href="https://www.phdata.io/blog/how-to-migrate-from-teradata-to-snowflake/">Legacy DW (Teradata) to Snowflake</a> plus an automated row/hash reconciliation tool preventing silent data drift.',
      '<strong>dbt CI/CD & SQL Server Utility:</strong> Engineered a first-of-its-kind workflow to <a href="https://www.phdata.io/blog/how-to-git-version-control-dbt-cloud-jobs/">Git version-control dbt Cloud jobs</a> via Azure Repo APIs and built a custom SQL Server-to-Snowflake migration utility.'
    ],
    afourBullets: [
      'Maintained production OpenStack platform services in Python, implemented token-based authentication, and built PySpark AWS Glue ETL jobs across a 3-stage raw/curated medallion architecture.'
    ],
    tcsBullets: [
      'Engineered Python/PySpark ETL pipelines orchestrated via Apache Airflow ingesting up to <strong>1TB/day</strong> across Cloudera (Spark, Kafka, Impala, Hive, HDFS).'
    ],
    projects: [
      {
        name: 'TickForge: Live Binance L2 Order Book, Bi-Temporal Parquet Lakehouse & Feed Reconciler',
        links: '<a href="https://tickforge-2dn.pages.dev">Live Terminal</a> | <a href="https://github.com/arnabm14/tickforge">GitHub</a>',
        desc: 'Built buffer-first Binance WebSocket/REST L2 engine (microprice, OBI, VWAP slippage), Zstd bi-temporal Parquet store (0 future look-ahead leaks), and WS-vs-REST reconciler (<strong>1.54M events/s, 0.6 us p99</strong> on 50K replay; 3/3 OK live BTC/ETH/SOL sync; 5/5 tests).'
      },
      {
        name: 'Cab Service (Uber Clone) GCP Pipeline & MediPulse QR Edge AI',
        links: '<a href="https://github.com/arnabm14/Cab_Service_DE_Project">GCP Pipeline</a> | <a href="https://medipulse-qr.pages.dev">MediPulse Live</a>',
        desc: 'End-to-end GCP Dataform + Cloud Composer + BigQuery + Looker analytics pipeline; plus MediPulse QR built on Cloudflare Workers AI + multilingual OCR for structured emergency clinical records.'
      }
    ]
  },
  {
    slug: 'Arnab_Mondal_Applied_AI_2026_Modern',
    webName: 'Arnab_Mondal_Applied_AI_2026_Modern.pdf',
    subtitle: 'Applied AI & ML Data Platform Engineer · Google Cloud',
    impacts: [
      ['7+ yrs', 'Applied AI & Cloud Data'],
      ['FHIR AI', 'Compliant Vector DB'],
      ['8.5M/day', '99.99% Regulated ETL'],
      ['$200K/yr', 'Compute Saved (+65%)']
    ],
    summary:
      'Applied AI & Cloud Data Platform Engineer at Google Cloud (7+ years) building privacy-preserving FHIR healthcare vector databases, real-time Vertex AI ingestion pipelines, multi-cloud Apache Iceberg lakehouses, and production MCP agentic workflows. Proven delivery on 99.99%-uptime regulated platforms (8.5M records/day, 100% compliance, $200K/yr compute savings) and 400+ TB cloud migrations.',
    skills: [
      ['Applied AI & ML Platforms', 'Google Vertex AI, Vector Databases, Semantic Search / RAG, FHIR AI Compliance, Agentic Workflows, MCP, Real-Time Feature & Ingestion Pipelines, Cloudflare Workers AI, Multilingual OCR'],
      ['Cloud & Lakehouse', 'GCP (BigQuery, Cloud Composer, Dataform, Cloud Pub/Sub, Bigtable, STS), AWS (Glue, S3, Athena, Lambda, Step Functions), Azure, Snowflake, Databricks, Apache Iceberg, Starburst'],
      ['Languages & Systems', 'Python, Java, C++, SQL, PySpark, Apache Spark, Apache Kafka, Distributed Systems, Concurrency, gRPC, REST APIs, OOP'],
      ['MLOps, IaC & Governance', 'Terraform, Apache Airflow (DAG Factories & Custom Plugins), dbt, Kubernetes, Docker, CI/CD, Data Validation & Privacy Compliance, Bi-Temporal Parquet']
    ],
    googleRole: 'Data & Applied AI Platform Engineer',
    googleBullets: [
      '<strong>Privacy-Preserving FHIR Vector Database:</strong> Architected a vector database for regulated FHIR healthcare data on GCP, enabling low-latency semantic AI retrieval, RAG grounding, and accelerated clinical insight delivery.',
      '<strong>Real-Time BigQuery to Vertex AI Pipeline:</strong> Engineered a real-time organizational email ingestion pipeline into BigQuery serving as a foundational training and inference data plane for Google Cloud Vertex AI.',
      '<strong>MLOps / DataOps DAG Factory & Terraform IaC:</strong> Built a reusable Apache Airflow DAG Factory and orchestrated full Terraform IaC deployments across Dev, Staging, and Production for repeatable AI/data lifecycle management.',
      '<strong>Cross-Cloud Apache Iceberg Lakehouse:</strong> Engineered AWS-to-GCP ETL pipelines via STS migrating Hive-partitioned Parquet and Apache Iceberg datasets into BigQuery for unified enterprise analytics and AI workloads.',
      '<strong>Automation & Scheduling Infrastructure:</strong> Automated Dataform/BigQuery SQL optimization in Python, owned a custom Cloud Composer holiday&#8209;aware calendar plugin, delivered Phase 1 bare&#8209;metal migration, and led architecture reviews.'
    ],
    usefulbiBullets: [
      '<strong>Regulated AI-Ready Healthcare Platform:</strong> Built AWS/Databricks ETL processing <strong>8.5M patient records/day at 99.99% uptime</strong> across 7 facilities (12 yrs history, zero data loss, 100% compliance/security governance).',
      '<strong>Compute Efficiency at Scale:</strong> Migrated 15TB to AWS (<strong>-32% cost</strong>) and optimized Databricks clusters, saving <strong>$200K annually</strong> while increasing throughput capacity by 65%.'
    ],
    phdataBullets: [
      '<strong>400+ TB Enterprise Modernization:</strong> Led end-to-end <a href="https://www.phdata.io/blog/how-to-migrate-from-teradata-to-snowflake/">Teradata-to-Snowflake 400+ TB migration</a> with custom row/hash validation tooling and SQL Server migration utilities.',
      '<strong>Automated API Job Versioning:</strong> Designed a novel <a href="https://www.phdata.io/blog/how-to-git-version-control-dbt-cloud-jobs/">Git-backed dbt Cloud CRUD workflow</a> via Azure repositories for deterministic CI/CD.'
    ],
    afourBullets: [
      'Built production OpenStack Python services, token-based authentication, and 3-stage PySpark AWS Glue medallion ingestion pipelines.'
    ],
    tcsBullets: [
      'Engineered Python/PySpark ETL pipelines scheduled via Apache Airflow ingesting up to <strong>1TB/day</strong> across Cloudera (Spark, Kafka, Impala, Hive, HDFS).'
    ],
    projects: [
      {
        name: 'MediPulse QR (Edge AI Health Records) & Paradox (Production Multi-Agent MCP Platform)',
        links: '<a href="https://medipulse-qr.pages.dev">MediPulse Live</a> | <a href="https://github.com/arnabm14/medipulse-qr">GitHub</a>',
        desc: 'Built multilingual prescription OCR + Cloudflare Workers AI clinical extraction pipeline with privacy-first QR summaries; orchestrated Paradox multi-agent MCP workflows with persistent local memory and strict human-in-the-loop guardrails.'
      },
      {
        name: 'TickForge (Real-Time Binance L2 Engine & Bi-Temporal Lakehouse) & Uber Clone GCP Pipeline',
        links: '<a href="https://tickforge-2dn.pages.dev">TickForge Live</a> | <a href="https://github.com/arnabm14/tickforge">GitHub</a> | <a href="https://github.com/arnabm14/Cab_Service_DE_Project">GCP Pipeline</a>',
        desc: 'Real-time Binance WebSocket/REST L2 engine + Zstd bi-temporal Parquet store proving 0 future look-ahead leaks (<strong>1.54M events/s, 0.6 us p99</strong>); plus end-to-end GCP Dataform/Composer/BigQuery/Looker analytics pipeline.'
      }
    ]
  },
  {
    slug: 'Arnab_Mondal_Quant_Systems_2026_Modern',
    webName: 'Arnab_Mondal_Quant_Systems_2026_Modern.pdf',
    subtitle: 'Quant Data & Distributed Systems Engineer · Google Cloud',
    impacts: [
      ['1.54M/s', 'L2 Replay (0.6 us p99)'],
      ['0 Leaks', 'Bi-Temporal PIT Audit'],
      ['400+ TB', 'Row/Hash Reconciled'],
      ['99.99%', '8.5M/day SLA Platform']
    ],
    summary:
      'High-Throughput Data & Distributed Systems Engineer at Google Cloud (7+ years; B.Tech CSE 8.45/10) specializing in Python, C++, Java, Concurrency, gRPC, real-time market/event ingestion, columnar Apache Iceberg/Parquet lakehouses, custom business-day schedulers, and deterministic reconciliation frameworks (400+ TB Snowflake; 8.5M records/day at 99.99% uptime saving $200K/yr).',
    skills: [
      ['Languages & Core Systems', 'Python, C++, Java, SQL, Distributed Systems, Concurrency, gRPC, REST APIs, OOP, Computer Architecture, Operating Systems, Network Systems'],
      ['Market Data & Columnar Storage', 'Bi-Temporal Parquet (Zstd), Apache Iceberg, Apache Spark / PySpark, Apache Kafka, BigQuery, Databricks, Snowflake, Bigtable, Cassandra, DynamoDB, HBase, Exadata, Starburst'],
      ['Orchestration & Reconciliation', 'Apache Airflow (Custom Business-Day/Holiday Plugins & DAG Factories), Cloud Composer, Dataform, dbt, Automated Row/Hash Reconciliation, Cross-Feed Drift Auditing'],
      ['Infrastructure & AI Indexing', 'Terraform (IaC), Kubernetes, Docker, CI/CD, Git, AWS (Glue, S3, Athena, Lambda), GCP (Vertex AI, Pub/Sub, STS), Vector Databases, Cloudera, OpenStack, Kerberos']
    ],
    googleRole: 'Data & Distributed Systems Engineer',
    googleBullets: [
      '<strong>Low-Latency Real-Time Ingestion:</strong> Engineered a real-time event ingestion and processing pipeline into BigQuery designed for continuous high&#8209;volume capture and downstream quantitative/ML analytics in Vertex AI.',
      '<strong>Cross-Cloud Columnar Iceberg/Parquet Engine:</strong> Built AWS-to-GCP ETL systems migrating Apache Iceberg and Hive-partitioned Parquet columnar datasets via STS into BigQuery with custom high-throughput ingestion software.',
      '<strong>Business-Day Calendar Scheduler Plugin:</strong> Owned and engineered a custom Cloud Composer (Airflow) calendar plugin enforcing strict weekday/holiday execution rules (direct trading-calendar analog) with edge-case handling.',
      '<strong>Deterministic IaC DAG Factory & Vector Indexing:</strong> Architected a scalable Airflow DAG Factory deployed via Terraform IaC across Dev/Stage/Prod for reproducible pipelines; architected a high-speed vector database for compliant FHIR retrieval.',
      '<strong>Query Optimization & Bare-Metal Migration:</strong> Built Python tooling optimizing Dataform/BigQuery analytical SQL throughput, delivered Phase 1 bare-metal-to-GCP migration, and led distributed architecture reviews.'
    ],
    usefulbiBullets: [
      '<strong>99.99% SLA High-Throughput Pipeline:</strong> Engineered AWS/Databricks pipeline processing <strong>8.5M daily records with zero data loss</strong> across 12 years of historical records (7 facilities, 100% compliance).',
      '<strong>Compute & Latency Efficiency:</strong> Migrated 15TB to AWS (<strong>-32% cost</strong>) and tuned Databricks clusters, saving <strong>$200K annually</strong> while lifting processing capacity by 65%.'
    ],
    phdataBullets: [
      '<strong>400+ TB Backfill & Automated Reconciliation:</strong> Migrated <strong>400+ TB</strong> from <a href="https://www.phdata.io/blog/how-to-migrate-from-teradata-to-snowflake/">Legacy DW to Snowflake</a> and built an automated row/hash reconciliation framework verifying zero data loss or silent drift across historical partitions.',
      '<strong>Deterministic Git-API Job Control:</strong> Engineered <a href="https://www.phdata.io/blog/how-to-git-version-control-dbt-cloud-jobs/">Git-backed dbt Cloud CRUD APIs</a> and built a SQL Server-to-Snowflake ingestion utility from scratch.'
    ],
    afourBullets: [
      'Engineered production OpenStack distributed services in Python, token-based auth, and 3-stage PySpark AWS Glue medallion ETL jobs.'
    ],
    tcsBullets: [
      'Built a Python/Spark ETL framework orchestrated via Apache Airflow ingesting up to <strong>1TB/day</strong> across Cloudera (Impala, Spark, Kafka, Hive, HDFS).'
    ],
    projects: [
      {
        name: 'TickForge: Live Binance L2 Limit Order Book, Bi-Temporal Parquet Lakehouse & Feed Reconciler',
        links: '<a href="https://tickforge-2dn.pages.dev">Live Terminal</a> | <a href="https://github.com/arnabm14/tickforge">GitHub</a>',
        desc: 'Spec-compliant buffer-first Binance WebSocket/REST L2 engine (sequence-gap & crossed-book invariants, microprice, OBI L1/L5/L10, $100K/$500K VWAP slippage), Zstd bi-temporal Parquet store proving 0.0% look-ahead bias on PIT replay, and WS-vs-REST drift auditor (<strong>1,545,576 events/sec, p50 0.5 us / p99 0.6 us</strong> on 50K replay; 3/3 OK live BTC/ETH/SOL reconcile; 5/5 tests).'
      },
      {
        name: 'Cab Service (Uber Clone) GCP Data Processing Pipeline',
        links: '<a href="https://github.com/arnabm14/Cab_Service_DE_Project">GitHub</a>',
        desc: 'End-to-end columnar cloud pipeline transforming raw trip CSV datasets through GCP Dataform, Cloud Composer (Airflow), BigQuery exploration, and Looker dashboards.'
      }
    ]
  }
];

function renderHtml(ed) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Arnab Mondal - ${ed.subtitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>${SHARED_CSS}</style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="header-left">
        <h1>Arnab Mondal</h1>
        <div class="header-subtitle">${ed.subtitle}</div>
      </div>
      <div class="header-right">
        <div>Bengaluru, India<span class="sep">|</span><span class="mono">+91-6290729774</span><span class="sep">|</span><a href="mailto:arnavm014@gmail.com">arnavm014@gmail.com</a></div>
        <div><a href="https://arnab-mondal.pages.dev">arnab-mondal.pages.dev</a><span class="sep">|</span><a href="https://github.com/arnabm14">github.com/arnabm14</a><span class="sep">|</span><a href="https://www.linkedin.com/in/arnab1408/">linkedin.com/in/arnab1408</a></div>
      </div>
    </header>

    <div class="impact-bar">
      ${ed.impacts.map(([v, l]) => `<div class="impact-cell"><span class="impact-val">${v}</span><span class="impact-lbl">${l}</span></div>`).join('\n      ')}
    </div>

    <p class="summary">${ed.summary}</p>

    <section class="section">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-grid">
        ${ed.skills.map(([k, v]) => `<div class="skill-line"><strong>${k}:</strong> <span>${v}</span></div>`).join('\n        ')}
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">Work Experience (7+ Years)</h2>

      <article class="role">
        <div class="role-top">
          <div><span class="role-company">Google Cloud</span><span class="role-divider">/</span><span class="role-title">${ed.googleRole}</span></div>
          <div class="role-meta mono">Bengaluru, India | Jun 2025 - Present</div>
        </div>
        <ul class="bullets">${ed.googleBullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </article>

      <article class="role">
        <div class="role-top">
          <div><span class="role-company">UsefulBI</span><span class="role-divider">/</span><span class="role-title">Senior Data Engineer II</span></div>
          <div class="role-meta mono">Bengaluru (Remote) | Sep 2024 - Jun 2025</div>
        </div>
        <ul class="bullets">${ed.usefulbiBullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </article>

      <article class="role">
        <div class="role-top">
          <div><span class="role-company">phData</span><span class="role-divider">/</span><span class="role-title">Senior Data Engineer</span></div>
          <div class="role-meta mono">Bengaluru (Remote) | Jun 2022 - Sep 2024</div>
        </div>
        <ul class="bullets">${ed.phdataBullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </article>

      <article class="role">
        <div class="role-top">
          <div><span class="role-company">AFour Technologies</span><span class="role-divider">/</span><span class="role-title">Senior SDE</span></div>
          <div class="role-meta mono">Pune (Remote) | Dec 2021 - Jun 2022</div>
        </div>
        <ul class="bullets">${ed.afourBullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </article>

      <article class="role">
        <div class="role-top">
          <div><span class="role-company">Tata Consultancy Services (TCS)</span><span class="role-divider">/</span><span class="role-title">Software Development Engineer</span></div>
          <div class="role-meta mono">Kolkata, India | Jul 2019 - Dec 2021</div>
        </div>
        <ul class="bullets">${ed.tcsBullets.map((b) => `<li>${b}</li>`).join('')}</ul>
      </article>
    </section>

    <section class="section">
      <h2 class="section-title">Selected Engineering Systems &amp; Open-Source Projects</h2>
      ${ed.projects.map((p) => `
      <article class="proj">
        <div class="proj-head">
          <span class="proj-name">${p.name}</span>
          <span class="proj-links mono">${p.links}</span>
        </div>
        <div class="proj-desc">${p.desc}</div>
      </article>`).join('')}
    </section>

    <section class="section">
      <h2 class="section-title">Verified Cloud Certifications &amp; Education</h2>
      <div class="certs-line">
        <span>1. <a href="https://www.credly.com/badges/3b90a1b7-8199-44a7-b39a-d42bc6346cb1/public_url">Google Cloud Professional Data Engineer</a></span>
        <span>2. <a href="https://cp.certmetrics.com/amazon/en/public/verify/credential/08ab449d9f6b4ba3a1025d6c26a09ab9">AWS Certified Data Engineer (Associate)</a></span>
        <span>3. <a href="https://www.credly.com/badges/2995bd7a-1fe7-4482-b4de-0c7422c01c65/public_url">AWS Certified Solutions Architect (Associate)</a></span>
      </div>
      <div class="bottom-row">
        <div><strong>Institute of Engineering and Management, Kolkata</strong>, B.Tech Computer Science &amp; Engineering (CGPA: <strong>8.45/10</strong>), <em>Computer Architecture, Operating Systems, Network Systems</em></div>
        <div class="role-meta mono">2015 - 2019</div>
      </div>
    </section>
  </div>
</body>
</html>`;
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 2 });

  for (const ed of EDITIONS) {
    const htmlPath = path.join(OUT_DIR, `${ed.slug}.html`);
    const pdfPath = path.join(OUT_DIR, `${ed.slug}.pdf`);
    const previewPath = path.join(OUT_DIR, `${ed.slug}_preview.png`);
    const webPdfPath = path.join(RESUMES_WEB_DIR, ed.webName);
    fs.writeFileSync(htmlPath, renderHtml(ed), 'utf8');

    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => {
      const el = document.querySelector('.page');
      return {
        scrollHeight: el.scrollHeight,
        letterHeightPx: 1056, // 11in at 96dpi
        utilizationPct: +((el.scrollHeight / 1056) * 100).toFixed(1)
      };
    });
    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
    });
    await page.screenshot({ path: previewPath, fullPage: true });
    fs.copyFileSync(pdfPath, webPdfPath);
    const sizeKb = (fs.statSync(pdfPath).size / 1024).toFixed(1);
    console.log(
      `Built ${ed.slug}.pdf | height=${metrics.scrollHeight}px / ${metrics.letterHeightPx}px (${metrics.utilizationPct}%) | ${sizeKb} KB`
    );
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
