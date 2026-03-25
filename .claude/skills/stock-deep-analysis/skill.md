---
name: stock-deep-analysis
description: Use when conducting comprehensive stock or company deep-dive analysis covering business model, governance, financials, valuation, and risk factors — dispatches parallel agents for each research dimension
---

# Stock Deep Analysis

## Overview

Institutional-grade equity research skill that dispatches parallel agents to analyze a company across 12 dimensions, uses a Devil's Advocate agent to stress-test all conclusions, then synthesizes into a structured Markdown report.

**Core principle:** Each research dimension is independent — run them in parallel, challenge them ruthlessly, output only battle-tested conclusions.

## When to Use

- User asks for deep analysis / deep dive on a stock or company
- User provides a ticker symbol and wants a comprehensive report
- User wants to generate a research report for `docs/reports/finance/`

**Don't use when:**
- Quick price check or single metric lookup
- Technical chart analysis only
- Comparing multiple stocks (use a different workflow)

## User-Supplied Materials (可选)

If the user provides their own materials (internal reports, expert opinions, industry insights, PDF/PPTX files), these become **anchor inputs for the Deep Dive agent in Phase 3 Track B**:

1. Coordinator reads the user-supplied materials before dispatching any agents
2. Key insights from the materials are included in the Deep Dive agent prompt as "Expert/insider perspectives to investigate and build upon"
3. The Deep Dive agent treats these as **hypotheses to validate or challenge with independent evidence** — not as ground truth to blindly echo
4. If user materials present a different analytical framework (e.g., "think of this company as trust infrastructure, not a payment pipeline"), the Deep Dive agent MUST treat it as an independent analysis hypothesis:
   - Find independent data that supports or contradicts the framework
   - Identify the preconditions required for the framework to hold
   - Quantify the valuation impact if the framework is correct vs incorrect
   - State under what conditions you would adopt vs reject this framework
   - **"Mention and move on" is not acceptable** — the framework must be fully engaged with, whether you ultimately agree or disagree

This is optional. Without user materials, the skill runs normally with web search as the sole data source.

## Agent Teams Architecture

```
Main Agent (Coordinator)
│
├── Phase 1: Parallel Research (全部同时启动, 8 个 agent)
│   ├── Agent 1: Business Analysis           ← 商业分析
│   ├── Agent 2: Corporate Governance        ← 公司治理
│   ├── Agent 3: Capital + Financial + Value  ← 资本配置 + 财务 + 估值 (共享数据源)
│   ├── Agent 4: Segment Breakdown           ← 业务板块拆解
│   ├── Agent 5: Risk & Drivers              ← 风险与驱动因子
│   ├── Agent 6: Scenario Analysis           ← 情景分析 (Bull/Base/Bear)
│   ├── Agent 7: Peer Comparison + SOTP      ← 可比公司 + 分部估值
│   └── Agent 8: TAM + Earnings Quality      ← 市场规模 + 盈利质量
│
├── Phase 2: Devil's Advocate (收到 Phase 1 全部结果后)
│   └── Agent 9: Devil's Advocate            ← 质疑挑战，输出修正清单
│
├── Phase 3: Revision + Deep Dive (并行双轨)
│   ├── Track A: Revision Agents             ← 针对被挑战的结论进行修正或举证反驳
│   └── Track B: Deep Dive Agent             ← 对 2-3 个共识盲区做第一性原理深挖 (最重要的 agent)
│
└── Phase 4: Final Synthesis (Coordinator 汇总定稿)
    └── 输出有立场、可证伪的最终报告 → docs/reports/finance/{company}/{YYYY-MM-DD}.md
```

**Phase 设计理念：**
- Phase 1 各 agent 完全独立，最大化并行
- Phase 2 Devil's Advocate 拿到所有初稿后统一质疑，找矛盾、挑假设、查遗漏，**并识别 2-3 个市场共识盲区**
- Phase 3 双轨并行：Track A 修正被挑战的结论；**Track B 对共识盲区做第一性原理深挖，产出非共识洞察**
- Phase 4 读者看到的是：经过质疑后的扎实基本面分析 + 独立深挖的非共识判断 + **有立场、可证伪的最终结论**

## The 12 Research Dimensions

### Dimension 1: Business Analysis (商业分析)

**Agent prompt template:**

```
Research {COMPANY} ({TICKER}) business fundamentals. Cover:

1. **Company Overview**: What the company does, core products/services, target markets
2. **History**: Key milestones, founding story, pivotal moments
3. **Business Model Deep Dive**: Revenue streams, unit economics, flywheel effects, platform dynamics
4. **Competitive Advantages & Moats**: Brand, network effects, switching costs, cost advantages, intangible assets
5. **Strategy**: Current strategic direction, announced initiatives, M&A activity
6. **Technology Disruption**: How AI/tech shifts create opportunities and threats for this business
7. **Company Response**: Management's stated strategy and roadmap for navigating change
8. **Value Chain Position**: Key suppliers (bargaining power, concentration), key customers (concentration, switching costs), substitutes and complements that affect competitive dynamics
9. **Business Model Reframing**: Do NOT just describe the current business model — ask: "If the industry's underlying logic shifts (e.g., from transaction fees to trust commissions, from human-facing to agent-facing, from product to platform), what role could this company play?" Think beyond the consensus narrative. Consider whether the company's assets (users, data, trust, licenses, infrastructure) could be recombined into a fundamentally different value proposition.

Use web search to find recent earnings calls, investor presentations, and analyst coverage.
Format as structured Markdown with headers. Cite sources with [n] notation.
```

### Dimension 2: Corporate Governance (公司治理)

```
Research {COMPANY} ({TICKER}) corporate governance. Cover:

1. **Shareholder Structure**: Major shareholders, insider ownership %, institutional ownership
2. **Voting Rights**: Dual-class shares? Poison pills? Shareholder-friendly provisions?
3. **Board of Directors**: Key members, independence ratio, relevant expertise
4. **CEO Profile**: Background, tenure, compensation structure, track record
5. **Management Team**: Key executives, tenure, insider buying/selling patterns
6. **Execution Track Record**: Have they delivered on past guidance? Capital allocation history?
7. **Management Credibility Check**: Compare specific promises/guidance from past 2-3 years of earnings calls with actual delivered results. Flag patterns of over-promising or under-delivering.

Market-specific governance focus:
- **US**: Use SEC filings (DEF 14A, proxy statements), insider transaction filings, governance ratings
- **China A-shares**: Focus on 实控人/一致行动人 structure, 国资 vs 民营 background, related-party transactions (关联交易), pledge ratio of controlling shareholder's shares (股权质押比例). Use 巨潮资讯网, 东方财富 for filings.
- **Hong Kong**: Note dual-listed structure if applicable, connected transactions, controlling family dynamics. Use HKEXnews for filings.

Format as structured Markdown. Cite sources with [n] notation.
```

### Dimension 3: Capital Allocation (资本配置)

```
Research {COMPANY} ({TICKER}) capital allocation strategy. Cover:

1. **Capital Allocation Framework**: How does management prioritize? (reinvest vs return to shareholders)
2. **ROIC Trend**: Return on invested capital over 5 years, vs WACC, vs peers
3. **Buyback History**: Share repurchase amounts, timing quality (buy low or high?), dilution offset
4. **Dividend Policy**: Payout ratio, growth rate, sustainability
5. **Shareholder Yield**: Combined yield from buybacks + dividends - dilution
6. **M&A Track Record**: Past acquisitions — value creating or destroying?
7. **CapEx Efficiency**: Maintenance vs growth capex, ROI on investments

Use web search for annual reports, capital allocation commentary from earnings calls.
Format as structured Markdown. Cite sources with [n] notation.
```

### Dimension 4: Financial Analysis (财务分析)

```
Research {COMPANY} ({TICKER}) recent financial performance. Cover:

1. **Revenue**: Trend (3-5 years), growth rate, organic vs inorganic, guidance
2. **Operating Profit**: Margins, trend, operating leverage dynamics
3. **Cash Flow**: Operating CF, Free CF, CF conversion ratio, quality of earnings
4. **Capital Expenditure**: Trend, % of revenue, maintenance vs growth split
5. **Stock-Based Compensation**: SBC as % of revenue, dilution impact, trend
6. **Balance Sheet**: Net debt/cash, leverage ratios, liquidity position
7. **Forward Outlook**: Management guidance, consensus estimates, key assumptions

Find the most recent financial data via web search:
- **US**: 10-Q (quarterly), 10-K (annual) from SEC EDGAR
- **China A-shares**: 季报/年报 from 巨潮资讯网 or 东方财富
- **Hong Kong**: 中期报告/年报 from HKEXnews

Present key metrics in tables where possible. Cite sources with [n] notation.
```

### Dimension 5: Valuation (估值分析)

```
Research {COMPANY} ({TICKER}) current valuation. Cover:

1. **Forward P/E**: Current vs 5-year average vs sector median
2. **EV/EBITDA**: Current vs historical vs peers
3. **EV/FCF**: Enterprise value to free cash flow ratio and trend
4. **Shareholder Yield**: Buyback yield + dividend yield - net dilution
5. **PEG Ratio**: P/E relative to expected growth rate
6. **Implied Expectations**: What growth rate does current price imply?
7. **Historical Valuation Range**: Where does current valuation sit in 5-year range?

Use web search for current market data, analyst consensus estimates.
Present comparisons in tables. Cite sources with [n] notation.
```

### Dimension 6: Segment Breakdown (业务板块拆解)

```
Research {COMPANY} ({TICKER}) business segment breakdown. Cover:

1. **Revenue by Segment**: Each business line's contribution to total revenue
2. **Profit by Segment**: Operating margin by segment, which segments drive profitability
3. **Growth by Segment**: Which segments are growing/declining, at what rates
4. **Geographic Mix**: Revenue by region, geographic concentration risk
5. **Segment Trends**: Shifts in segment mix over time, strategic implications
6. **Key Metrics per Segment**: Relevant KPIs (subscribers, GMV, take rate, etc.)

Use web search for segment reporting from annual filings (10-K / 年报 / 年報), earnings presentations, and analyst breakdowns.
Present in tables wherever possible. Cite sources with [n] notation.
```

### Dimension 7: Risk Factors & Drivers (风险与驱动因子)

```
Research {COMPANY} ({TICKER}) key risk factors and performance drivers. Cover:

1. **Revenue Drivers**: What factors most influence revenue? (macro, pricing, volume, mix)
2. **Margin Drivers**: What drives margin expansion/compression?
3. **Macro Sensitivity**: Interest rate, FX, commodity, regulatory exposure
4. **Competitive Threats**: Emerging competitors, market share trends, disruption risk
5. **Regulatory Risk**: Pending regulation, antitrust, compliance requirements
6. **Operational Risk**: Supply chain, key person dependency, concentration risk
7. **Catalyst Calendar**: Upcoming events that could move the stock (earnings, product launches, rulings)

For each factor, provide current assessment and forward outlook.
Format as structured Markdown. Cite sources with [n] notation.
```

### Dimension 8: Scenario Analysis (情景分析)

```
Build Bull / Base / Bear scenario analysis for {COMPANY} ({TICKER}). Cover:

1. **Base Case (most likely)**:
   - Revenue growth assumption (next 3 years)
   - Operating margin trajectory
   - Key assumptions behind this scenario
   - Implied target price range (using forward P/E or EV/EBITDA)

2. **Bull Case (upside scenario)**:
   - What goes right? (market expansion, margin surprise, new products)
   - Revenue/margin assumptions under bull case
   - Probability weight (your estimate)
   - Implied target price

3. **Bear Case (downside scenario)**:
   - What goes wrong? (competitive loss, margin compression, macro)
   - Revenue/margin assumptions under bear case
   - Probability weight
   - Implied target price

4. **Sensitivity Table**:
   - Matrix of target prices across different growth rates and exit multiples
   - Example: rows = revenue growth (5%, 10%, 15%, 20%), columns = forward P/E (15x, 20x, 25x, 30x)

5. **Probability-Weighted Target Price**:
   - Weighted average across all scenarios

Use web search for analyst consensus estimates and management guidance as starting points.
Present scenario assumptions and outputs in tables. Cite sources with [n] notation.
```

### Dimension 9: Peer Comparison (可比公司分析)

```
Build a comparable company analysis (comps) for {COMPANY} ({TICKER}). Cover:

1. **Peer Selection**: Identify 6-12 comparable companies based on:
   - Same industry/sub-sector
   - Similar business model
   - Similar size (market cap range)
   - Similar growth profile

2. **Comps Table** — for each peer, gather:
   | Metric | Peer 1 | Peer 2 | ... | {TICKER} | Median |
   |--------|--------|--------|-----|----------|--------|
   | Market Cap | | | | | |
   | Revenue (LTM) | | | | | |
   | Revenue Growth | | | | | |
   | Gross Margin | | | | | |
   | Operating Margin | | | | | |
   | Forward P/E | | | | | |
   | EV/EBITDA | | | | | |
   | EV/Revenue | | | | | |
   | EV/FCF | | | | | |
   | ROE | | | | | |
   | ROIC | | | | | |

3. **Relative Positioning**: Where does {TICKER} sit vs peers?
   - Premium or discount? Is it justified?
   - Which peers deserve higher/lower multiples and why?

4. **Implied Valuation**: Apply peer median multiples to {TICKER} financials
   - Implied price from P/E, EV/EBITDA, EV/FCF
   - Range and central estimate

Use web search for peer financial data. Present as tables. Cite sources with [n] notation.
```

### Dimension 10: Sum-of-the-Parts Valuation (分部估值 / SOTP)

```
Build a Sum-of-the-Parts (SOTP) valuation for {COMPANY} ({TICKER}). Cover:

1. **Segment Identification**: List each distinct business segment

2. **Per-Segment Valuation**:
   For each segment:
   - Revenue and operating profit (most recent)
   - Appropriate peer group / comparable pure-play companies
   - Appropriate valuation multiple (EV/EBITDA or EV/Revenue depending on profitability)
   - Implied segment enterprise value

3. **SOTP Table**:
   | Segment | Revenue | EBITDA | Multiple | Implied EV |
   |---------|---------|--------|----------|------------|
   | Segment A | $XXB | $XXB | XX.Xx | $XXB |
   | Segment B | $XXB | $XXB | XX.Xx | $XXB |
   | ... | | | | |
   | **Total EV** | | | | **$XXB** |
   | Less: Net Debt | | | | ($XXB) |
   | **Equity Value** | | | | **$XXB** |
   | Shares Outstanding | | | | XXM |
   | **Implied Price** | | | | **$XX** |

4. **Conglomerate Discount/Premium**: Current market cap vs SOTP value
   - Is there a discount? Why? (complexity, capital allocation, governance)
   - Catalyst to close the gap?

Use web search for segment data and pure-play peer multiples. Cite sources with [n] notation.
```

### Dimension 11: TAM & Market Sizing (市场规模测算)

```
Research the Total Addressable Market (TAM) for {COMPANY} ({TICKER}). Cover:

1. **TAM Estimation** — two approaches:
   - **Top-down**: Industry reports, global market size, growth rate (CAGR)
   - **Bottom-up**: Target customers × average spend × penetration rate
   - Cross-validate both approaches

2. **SAM (Serviceable Addressable Market)**: Realistic portion {COMPANY} can address
   - Geographic constraints
   - Product/service limitations
   - Regulatory barriers

3. **SOM (Serviceable Obtainable Market)**: Current market share
   - Market share trend (gaining or losing?)
   - vs top 3-5 competitors

4. **Market Growth Drivers**:
   - Secular trends (digitization, demographics, regulation)
   - Cyclical factors
   - Technology enablers or disruptors

5. **Penetration Curve**: Where is the market in its lifecycle?
   - Early stage (high growth, low penetration)
   - Growth stage (accelerating adoption)
   - Mature (slowing, consolidation)
   - Decline (secular headwinds)

6. **Revenue Ceiling Test**: At current market share, what's the max revenue if TAM fully matures?

Use web search for industry reports (Gartner, IDC, Statista, company IR). Cite sources with [n] notation.
```

### Dimension 12: Earnings Quality (盈利质量分析)

```
Analyze earnings quality for {COMPANY} ({TICKER}). Cover:

1. **Cash Conversion**:
   - FCF / Net Income ratio (>80% is healthy)
   - Operating CF / Net Income ratio
   - Trend over 5 years — deteriorating conversion is a red flag

2. **Accruals Analysis**:
   - Accruals ratio = (Net Income - Operating CF) / Total Assets
   - High accruals (>10%) suggest earnings may not be sustainable
   - Trend direction

3. **Stock-Based Compensation Impact**:
   - SBC as % of revenue and % of operating income
   - Diluted vs basic share count growth
   - "Real" earnings = GAAP earnings adjusted for SBC dilution cost
   - SBC trend — increasing or decreasing?

4. **One-Time Items & Adjustments**:
   - Identify recurring "non-recurring" charges (restructuring every year?)
   - Gap between GAAP and Non-GAAP earnings — is the gap widening?
   - Adjusted EBITDA vs real operating income

5. **Revenue Quality**:
   - Recurring vs one-time revenue mix
   - Deferred revenue trend (growing backlog = positive signal)
   - Customer concentration — top 10 clients as % of revenue
   - Days Sales Outstanding (DSO) trend

6. **Off-Balance-Sheet Items**:
   - Operating leases (now on BS post-ASC 842, but check)
   - Unconsolidated entities, VIEs
   - Contingent liabilities, litigation reserves

7. **Earnings Quality Score**: Summarize overall assessment
   - High quality: FCF conversion >90%, low accruals, stable SBC, clean GAAP
   - Medium: Some adjustments needed, watch items identified
   - Low quality: Significant GAAP/non-GAAP gap, rising accruals, heavy SBC dilution

Use web search for financial filings (US: 10-K/10-Q from SEC EDGAR; A-shares: 年报/季报 from 巨潮资讯网; HK: 年報/中期報告 from HKEXnews) and earnings quality analysis. Cite sources with [n] notation.
```

## Dispatch Strategy

### Phase 1: Parallel Research

Launch 8 agents simultaneously using the Agent tool:

```
Agent 1: Business Analysis                           ← Dimension 1
Agent 2: Corporate Governance                        ← Dimension 2
Agent 3: Capital Allocation + Financial + Valuation  ← Dimensions 3+4+5 (共享财报数据源)
Agent 4: Segment Breakdown                           ← Dimension 6
Agent 5: Risk & Drivers                              ← Dimension 7
Agent 6: Scenario Analysis                           ← Dimension 8
Agent 7: Peer Comparison + SOTP                      ← Dimensions 9+10 (共享可比公司数据)
Agent 8: TAM + Earnings Quality                      ← Dimensions 11+12
```

All agents use `subagent_type: general-purpose`.

**合并逻辑：**
- Dim 3+4+5 合并 → 资本配置、财务、估值共享同一批财报数据，避免重复搜索
- Dim 9+10 合并 → 可比公司分析和分部估值都需要同行业 peer 数据
- Dim 11+12 合并 → 市场规模和盈利质量都是对核心财务叙事的独立校验

**Context for Each Agent — every agent prompt MUST include:**
1. Company name and ticker
2. The specific dimension template(s) from above
3. Instruction to use `WebSearch` tool for data gathering
4. Output format requirement (structured Markdown with citations)
5. Language preference (Chinese or English, match user's request)
6. **Company website as primary source — Coordinator 负责 URL 发现，Agent 负责深读**:

   **Phase 0（Coordinator 在 dispatch 任何 agent 之前执行）**:
   Coordinator 使用 `WebFetch` 抓取公司官网首页 + `WebSearch` 搜索 `site:{company-domain}` 获取主要页面列表。目标是提取一份 **关键页面 URL 清单**，至少包含：
   - 首页
   - 产品/服务页面（每个主要产品线）
   - AI/技术/开发者页面
   - 投资者关系页面
   - 新闻中心/博客
   - 关于/领导团队页面
   - 任何公司重点推广的战略页面（如 agentic commerce、developer platform 等）

   如果 WebFetch 首页返回不完整（JS 渲染问题），使用 `WebSearch site:{domain}` 补全。

   **然后将具体 URL 列表写入每个 agent 的 prompt**——不依赖 agent 自己去发现页面。每个 agent 收到的 prompt 中应包含与其维度相关的精确 URL，例如：
   - Agent 1 (Business): `{company}.com/products`, `{company}.com/business/ai`, `{company}.com/about`, ...
   - Agent 2 (Governance): `{company}.com/investor-relations`, `{company}.com/leadership`, ...
   - Agent 3 (Financial): `{company}.com/investor-relations/earnings`, ...
   - 以此类推

   **Agent 收到 URL 后**：用 `WebFetch` 逐个读取。如果某个 URL 返回空内容，agent 自行用 `WebSearch "{page-topic} site:{domain}"` 做 fallback。

   **The goal is to understand the company the way the company presents itself — before seeing how outsiders describe it.** Missing a key page that the company itself prominently features is an unacceptable gap.

### Phase 2: Devil's Advocate

Wait for ALL Phase 1 agents to return. Then launch a single Devil's Advocate agent with ALL initial findings as input.

**Devil's Advocate Agent prompt template:**

```
You are a ruthless, skeptical analyst. Your ONLY job is to find weaknesses in the research below.
You are reviewing a deep analysis of {COMPANY} ({TICKER}).

Here are the initial findings from 8 research agents:

---
[PASTE ALL PHASE 1 OUTPUTS HERE]
---

Your task — be harsh, be specific, be constructive:

1. **Data Contradictions**: Do any numbers conflict across sections? (e.g., revenue in financials vs segment breakdown vs comps table)
2. **Optimistic Bias**: Where are conclusions too rosy? What's the bear case they're ignoring?
3. **Weak Moat Claims**: Are the stated competitive advantages real and durable, or just narratives?
4. **Valuation Assumptions**: Are growth/margin assumptions behind the valuation and scenario analysis reasonable? What if they're wrong?
5. **Missing Risks**: What risks did ALL agents fail to mention? (regulatory, geopolitical, technological)
6. **Stale or Low-Quality Sources**: Any conclusions relying on outdated data or unreliable sources?
7. **Logic Gaps**: Where does a conclusion not follow from the evidence presented?
8. **Scenario Sanity**: Is the bull case too optimistic or the bear case too mild? Are probability weights reasonable?
9. **TAM Inflation**: Is the market sizing realistic or inflated to justify growth narrative?
10. **Earnings Quality Red Flags**: Does the earnings quality analysis miss any manipulation signals? Does GAAP/Non-GAAP gap reconcile with stated figures?
11. **Comps Selection Bias**: Are comparable companies truly comparable, or cherry-picked to make {TICKER} look cheap?
12. **SOTP Consistency**: Do segment multiples make sense vs pure-play peers? Is there double-counting?
13. **Management Credibility**: Does the analysis take management claims at face value without verifying against actual historical delivery? Compare stated guidance vs results where possible.
14. **Survivorship Bias in Comps**: Are failed, acquired, or delisted competitors excluded from the peer set? This inflates peer median performance and makes the target look relatively worse or better than reality.
15. **Company Self-Presentation Gap**: Compare what the company prominently features on its own website (product pages, strategy pages, AI/technology pages, developer platforms) with what the research covers. If the company is prominently pushing a capability, product, or strategic narrative on its website that the research ignores or barely mentions, that is a gap — the company's own prioritization signals what it believes is most important, and the analysis must engage with it (whether to validate or challenge). List specific pages/products that were under-analyzed.

For EACH issue found, output:
- **Section**: Which section has the problem
- **Issue**: What's wrong (be specific, cite the exact claim)
- **Required Action**: What should be corrected, removed, or strengthened

Be merciless. If a conclusion cannot be defended with evidence, it should be weakened or removed.
Do NOT provide general praise. Your only value is in finding problems.

ADDITIONALLY — after listing all issues, you MUST output a final section:

## Consensus Blind Spots (共识盲区)

Identify 2-3 points where the research merely echoes market consensus without independent verification. For each:
- **The consensus narrative**: What "everyone believes" about this company
- **Why it might be wrong**: What data, structural force, or second-order effect is being ignored
- **What deep investigation would reveal**: Specific questions that need first-principles analysis, not just data lookup

These are the most valuable outputs of your entire review. The goal is to find the 2-3 insights that would make this report worth reading over any other analyst note.
```

### Phase 3: Revision + Deep Dive

Phase 3 has two parallel tracks:

**Track A: Revision（修正）**

For sections challenged by the Devil's Advocate:
- Minor issues (data discrepancies, missing caveats): Coordinator fixes directly
- Significant issues (flawed logic, missing analysis): Dispatch targeted revision agent(s)
- Defensible conclusions with strong evidence: Keep, but note counter-argument was considered

**Revision agent prompt pattern:**
```
The following section of a {COMPANY} ({TICKER}) analysis was challenged:

Original section:
[PASTE SECTION]

Challenge:
[PASTE DEVIL'S ADVOCATE FEEDBACK]

Your task: Revise this section to address the challenge. Either:
- Correct the conclusion with better evidence
- Weaken/qualify the claim if evidence is insufficient
- Provide stronger supporting evidence if the original conclusion is defensible

Do NOT mention the challenge process itself. Output a clean, revised section.
```

**Track B: Non-Consensus Deep Dive（非共识深挖）**

Take the 2-3 "Consensus Blind Spots" identified by the Devil's Advocate and dispatch a dedicated deep-dive agent. This is the most important agent in the entire workflow — it produces the insights that separate this report from commodity research.

**Deep Dive agent prompt template:**
```
You are a contrarian analyst tasked with producing non-consensus insights about {COMPANY} ({TICKER}).

The Devil's Advocate has identified these consensus blind spots:
---
[PASTE CONSENSUS BLIND SPOTS SECTION]
---

For each blind spot, conduct deep independent research:

1. **Quantify the gap between narrative and reality.** Don't just say "AI is a threat" — find the actual penetration rate, the actual adoption curve, the actual timeline. Use web search aggressively to find primary data (surveys, transaction data, regulatory filings) that most analysts ignore.

2. **Identify structural forces that consensus misses.** Look for flywheel effects, regulatory moats, switching cost asymmetries, or demographic shifts that create non-obvious barriers or catalysts. Think in systems, not headlines.

3. **Stress-test with first-principles reasoning.** If the consensus says "X will disrupt Y", ask: What are the 3 preconditions for X to succeed? Are they all met? What's the base rate of similar disruptions succeeding?

4. **Challenge the analytical framework itself.** The most common blind spot is not wrong data within the right framework, but the wrong framework entirely. Ask: "Is the market analyzing this company through the right lens?" For example:
   - Is a payment company being analyzed with "pipeline/toll-booth thinking" when it should be analyzed as a "trust infrastructure" play?
   - Is a SaaS company being valued on subscription metrics when its real value is the data asset?
   - Is a hardware company being compared to hardware peers when it's actually building a platform?
   Reframe the business model from scratch if the consensus framework is wrong. The most valuable insight is often not "the numbers are different" but "the entire mental model is wrong."

5. **Arrive at a falsifiable, non-consensus conclusion.** State it clearly: "The market believes X, but we believe Y, because Z. This will be proven right or wrong when [specific event/metric] occurs by [timeframe]."

Output format for each blind spot:
- **Consensus view**: What the market believes (1 sentence)
- **Our view**: What we believe instead (1 sentence)
- **Evidence**: The data and logic supporting our view (detailed, with citations)
- **Falsification trigger**: What would prove us wrong
- **Investment implication**: How this changes the buy/sell calculus

Use web search extensively. Cite all sources with [n] notation.
Write in the same language as the rest of the report.
```

Track A and Track B agents run in **parallel**.

### Phase 4: Final Synthesis

Coordinator assembles the final report:
1. Replace challenged sections with revised versions
2. **Integrate deep-dive insights as a dedicated chapter (十三、非共识洞察与独立判断)**
3. Deduplicate and merge citations
4. **Write an opinionated executive summary** — not "risks and opportunities coexist", but a clear stance:
   - State the investment thesis in one sentence
   - Give a probability-weighted expected outcome
   - Name the single most important variable that determines whether the thesis is right or wrong
   - Provide a specific "watch for" trigger and timeframe
5. Data consistency check across all chapters
6. **最终报告必须自包含**: 所有 Phase 1-3 agent 的研究内容必须整合进最终报告。最终报告不得链接或引用中间文件作为"附件"或"详细分部报告"。读者只需打开一个文件就能获得完整分析。Phase 1-3 的中间产出是工作草稿，不是交付物。
  7. Output to `docs/reports/finance/{company}/{YYYY-MM-DD}.md`
  8. **防覆盖检查**：写入前用 Glob 检查目标路径是否已有文件。如果 `{YYYY-MM-DD}.md` 已存在则写入 `{YYYY-MM-DD}-2.md`，以此类推，绝不覆盖已有报告。
  9. **清理中间文件（必须执行）**：最终报告写入成功后，立即用 Bash 删除本次分析产生的所有中间文件。中间文件特征：同目录下、同日期、文件名含 agent 维度关键词（如 business-fundamentals, governance, scenario, comps, revisions, contrarian, risk-factors, segment, tam, capital, valuation, devils-advocate 等）。不删除最终报告本身，不删除日期不同的旧报告。**这一步是硬性要求，跳过则本次分析视为未完成。**

## Output Format

Final synthesized report structure:

```markdown
---
title: {Company Name}深度分析：{one-line thesis}
date: {YYYY-MM-DD}
category: finance
ticker: {TICKER}
description: {one-line description of what this report covers}
---

# {Company Name} ({TICKER}) 深度研究报告

**分析日期**: {date}
**数据截止**: {latest data date}

---

## 执行摘要

[NOT a neutral summary. Must include:]
[1. One-sentence investment thesis with a clear stance (buy/hold/avoid)]
[2. The single most important variable that determines whether the thesis is right or wrong]
[3. Probability-weighted expected outcome (Bull X% / Base Y% / Bear Z%)]
[4. Specific "watch for" trigger and timeframe that would confirm or invalidate the thesis]

---

## 一、公司概况与商业分析

### 1.1 公司简介
### 1.2 发展历史
### 1.3 商业模式深度洞察
### 1.4 竞争优势与壁垒
### 1.5 发展战略
### 1.6 技术变革下的机遇与挑战
### 1.7 应对策略与路线
### 1.8 产业链定位
### 1.9 商业模式重构推演

## 二、公司治理

### 2.1 股东权力结构
### 2.2 管理层与CEO
### 2.3 执行力与历史记录

## 三、资本配置

### 3.1 资本配置策略与效率
### 3.2 ROIC 分析
### 3.3 股东友好度 (Shareholder Yield)

## 四、财务分析

### 4.1 营收分析
### 4.2 营业利润与利润率
### 4.3 现金流分析
### 4.4 资本开支
### 4.5 股权激励状况
### 4.6 未来展望

## 五、估值分析

### 5.1 Forward P/E
### 5.2 EV/EBITDA
### 5.3 EV/FCF
### 5.4 Shareholder Yield
### 5.5 估值总结

## 六、业务板块拆解

### 6.1 各板块营收
### 6.2 各板块利润
### 6.3 关键趋势

## 七、风险因子与驱动分析

### 7.1 业绩驱动因素
### 7.2 各因素分析展望
### 7.3 风险清单
### 7.4 催化剂日历

## 八、情景分析

### 8.1 Base Case
### 8.2 Bull Case
### 8.3 Bear Case
### 8.4 敏感性分析表
### 8.5 概率加权目标价

## 九、可比公司分析

### 9.1 可比公司选取
### 9.2 Comps 对比表
### 9.3 相对估值定位
### 9.4 隐含估值区间

## 十、分部估值 (SOTP)

### 10.1 各业务板块估值
### 10.2 SOTP 汇总表
### 10.3 集团折价/溢价分析

## 十一、市场规模 (TAM)

### 11.1 TAM / SAM / SOM
### 11.2 市场增长驱动力
### 11.3 渗透率与生命周期
### 11.4 收入天花板测试

## 十二、盈利质量

### 12.1 现金转化率
### 12.2 应计分析
### 12.3 SBC 稀释影响
### 12.4 一次性项目与 GAAP/Non-GAAP 差异
### 12.5 收入质量
### 12.6 盈利质量评分

## 十三、非共识洞察与独立判断

[This is the most valuable chapter. For each of 2-3 consensus blind spots:]

### 13.X {Blind Spot Title}
- **市场共识**：一句话概括市场相信什么
- **我们的判断**：一句话概括我们相信什么，以及为什么不同
- **证据与逻辑**：详细的数据、结构性分析、第一性原理推导
- **证伪条件**：什么事件/数据会证明我们错了
- **投资含义**：这个洞察如何改变买入/卖出的计算

## 十四、最终判断

### 14.1 投资论点（一句话）
### 14.2 关键变量（决定论点成败的单一最重要因素）
### 14.3 情景概率与预期回报
### 14.4 行动建议与触发条件
[明确的买入/持有/回避建议，附带具体触发条件和时间框架]
[例如："如果 X 在 Y 时间前发生，则 Z；否则 W"]

---

## 数据来源

[1] Source...
[2] Source...

## 免责声明

本报告仅供信息参考，不构成投资建议。
```

## Synthesis Process

```
Phase 1 完成 → 收集 8 份初稿
       ↓
Phase 2 完成 → 收到质疑清单 (5-15 条 issues) + 共识盲区清单 (2-3 条)
       ↓
Phase 3 并行:
  Track A: 修正被挑战的章节
  Track B: 非共识深挖 agent 对 2-3 个盲区做第一性原理分析  ← 最重要的 agent
       ↓
Phase 4 Coordinator 执行:
  1. 用修正版替换被挑战的章节
  2. 将深挖结果写入 "十三、非共识洞察与独立判断"
  3. 基于深挖结论撰写 "十四、最终判断"（有立场、可证伪）
  4. 撰写执行摘要：必须有明确立场，不允许 "风险与机遇并存" 式的中性结论
  5. 去重合并、统一引用编号
  6. 数据一致性终检：确保同一数字在不同章节一致
  7. 防覆盖检查：写入前用 Glob 检查目标路径是否已有文件
     - 如果 {YYYY-MM-DD}.md 已存在 → 写入 {YYYY-MM-DD}-2.md
     - 如果 {YYYY-MM-DD}-2.md 也存在 → 写入 {YYYY-MM-DD}-3.md
     - 以此类推，绝不覆盖已有报告
  5. 撰写执行摘要：基于全部经锤炼的结论
  6. 输出报告 → docs/reports/finance/{company}/{YYYY-MM-DD}.md
```

**质量标杆：** 最终报告中的每一个关键结论，都应该能经受住 "为什么你这么认为？证据呢？" 的追问。

## Key Metrics Quick Reference

| Category | Metrics | Good Benchmark |
|----------|---------|----------------|
| Profitability | Gross Margin, Op Margin, Net Margin, ROE, ROIC | ROIC > WACC |
| Growth | Revenue Growth, EPS Growth, FCF Growth | > 10% YoY |
| Valuation | Fwd P/E, EV/EBITDA, EV/FCF, PEG | PEG < 1 attractive |
| Health | Debt/Equity, Current Ratio, Interest Coverage | D/E < 1 |
| Shareholder | Buyback Yield, Div Yield, SBC %, Net Payout | Positive net yield |
| Efficiency | Asset Turnover, Inventory Days, FCF Conversion | FCF Conv > 80% |
| Earnings Quality | Accruals Ratio, FCF/NI, GAAP vs Non-GAAP gap | Accruals < 10%, FCF/NI > 80% |
| Market | TAM, SAM, SOM, Market Share Trend | Share gaining YoY |
| Scenario | Bull/Base/Bear implied price, Probability-weighted TP | Asymmetric upside |

## Common Mistakes

- **Data staleness**: Always note the date of financial data found; don't mix quarters
- **Missing SBC**: Many analyses ignore stock-based compensation — always include it
- **Ignoring segment mix**: Consolidated numbers hide segment-level deterioration
- **No forward look**: Historical analysis without forward estimates is incomplete
- **Source quality**: Prefer official filings (US: 10-K/10-Q/DEF 14A; A-shares: 巨潮资讯网年报/季报; HK: HKEXnews年報) over blog posts
- **TAM fantasy**: Inflating market size to justify growth story — always cross-validate top-down vs bottom-up
- **Cherry-picked comps**: Selecting only peers that make the target look cheap — include full peer set
- **Symmetric scenarios**: Bull case +30%, Bear case -10% is not real analysis — bear case should be genuinely painful
- **Ignoring accruals**: Rising accruals ratio with stable earnings is a classic red flag
- **SOTP without discount**: Multi-segment companies almost always trade at a conglomerate discount — don't ignore it

## Limitations

- Cannot access Bloomberg, Wind, or paid terminal data
- Real-time price data unavailable — use most recent from web search
- Financial data accuracy depends on web search results — flag for user verification
- Forward estimates are consensus-based, not proprietary models
