export const config = { runtime: 'edge' };

const KEY = process.env.KLAVIYO_API_KEY;
const REV = '2024-02-15';
const METRIC = 'RLkNvW';

async function kv(path, opts = {}) {
  const r = await fetch(`https://a.klaviyo.com/api${path}`, {
    ...opts,
    headers: {
      'Authorization': `Klaviyo-API-Key ${KEY}`,
      'revision': REV,
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });
  return r.json();
}

async function kvAll(path) {
  let out = [], url = `https://a.klaviyo.com/api${path}`;
  while (url) {
    const r = await fetch(url, {
      headers: { 'Authorization': `Klaviyo-API-Key ${KEY}`, 'revision': REV }
    });
    const d = await r.json();
    out = out.concat(d.data || []);
    url = d.links?.next || null;
  }
  return out;
}

function campaignReport(timeframe) {
  return kv('/campaign-values-reports/', {
    method: 'POST',
    body: JSON.stringify({ data: { type: 'campaign-values-report', attributes: {
      timeframe,
      conversion_metric_id: METRIC,
      statistics: ['opens_unique','clicks_unique','recipients','unsubscribes','conversion_value'],
      filter: 'equals(send_channel,"email")'
    }}})
  });
}

function flowReport(timeframe) {
  return kv('/flow-values-reports/', {
    method: 'POST',
    body: JSON.stringify({ data: { type: 'flow-values-report', attributes: {
      timeframe,
      conversion_metric_id: METRIC,
      statistics: ['opens_unique','clicks_unique','recipients','unsubscribes','conversion_value'],
      filter: 'equals(send_channel,"email")'
    }}})
  });
}

function calc(s) {
  const r = s.recipients || 0;
  return {
    recipients: r, opens: s.opens_unique||0, clicks: s.clicks_unique||0,
    unsubscribes: s.unsubscribes||0, revenue: s.conversion_value||0,
    openRate: r>0 ? +((s.opens_unique/r)*100).toFixed(1) : null,
    clickRate: r>0 ? +((s.clicks_unique/r)*100).toFixed(2) : null,
    ctor: s.opens_unique>0 ? +((s.clicks_unique/s.opens_unique)*100).toFixed(1) : null,
    unsubRate: r>0 ? +((s.unsubscribes/r)*100).toFixed(2) : null,
    revenuePerRecipient: r>0 ? +(s.conversion_value/r).toFixed(3) : null,
  };
}

function agg(results) {
  const t = { recipients:0, opens_unique:0, clicks_unique:0, unsubscribes:0, conversion_value:0 };
  for (const r of (results||[])) {
    t.recipients += r.statistics.recipients||0;
    t.opens_unique += r.statistics.opens_unique||0;
    t.clicks_unique += r.statistics.clicks_unique||0;
    t.unsubscribes += r.statistics.unsubscribes||0;
    t.conversion_value += r.statistics.conversion_value||0;
  }
  return { ...calc(t), totalRevenue: +t.conversion_value.toFixed(2) };
}

export default async function handler() {
  if (!KEY) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });

  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  try {
    // Campaign reports must be serialized — Klaviyo throttles concurrent POSTs to same endpoint
    const rLast12C = await campaignReport({ key: 'last_12_months' });
    const rThisYearC = await campaignReport({ key: 'this_year' });
    const rLastYearC = await campaignReport({ key: 'last_year' });

    // Remaining calls can run in parallel (different endpoints)
    const [allCampaigns, allFlows, rLast12F] = await Promise.all([
      kvAll("/campaigns/?filter=equals(messages.channel,'email')&sort=-updated_at"),
      kvAll('/flows/'),
      flowReport({ key: 'last_12_months' }),
    ]);

    const last12Results = rLast12C.data?.attributes?.results || [];
    const last12FlowResults = rLast12F.data?.attributes?.results || [];
    const thisYearResults = rThisYearC.data?.attributes?.results || [];
    const lastYearResults = rLastYearC.data?.attributes?.results || [];

    // Index campaign metrics (last 12 months)
    const cMetrics = {};
    for (const r of last12Results) {
      const id = r.groupings.campaign_id;
      if (!cMetrics[id]) cMetrics[id] = { recipients:0, opens_unique:0, clicks_unique:0, unsubscribes:0, conversion_value:0 };
      const m = cMetrics[id];
      m.recipients += r.statistics.recipients||0;
      m.opens_unique += r.statistics.opens_unique||0;
      m.clicks_unique += r.statistics.clicks_unique||0;
      m.unsubscribes += r.statistics.unsubscribes||0;
      m.conversion_value += r.statistics.conversion_value||0;
    }

    const campaigns = allCampaigns.map(c => ({
      id: c.id, name: c.attributes.name, status: c.attributes.status,
      sendTime: c.attributes.send_time, ...calc(cMetrics[c.id] || {})
    }));

    // Index flow metrics (last 12 months)
    const fMetrics = {};
    for (const r of last12FlowResults) {
      const id = r.groupings.flow_id;
      if (!fMetrics[id]) fMetrics[id] = { recipients:0, opens_unique:0, clicks_unique:0, unsubscribes:0, conversion_value:0 };
      const m = fMetrics[id];
      m.recipients += r.statistics.recipients||0;
      m.opens_unique += r.statistics.opens_unique||0;
      m.clicks_unique += r.statistics.clicks_unique||0;
      m.unsubscribes += r.statistics.unsubscribes||0;
      m.conversion_value += r.statistics.conversion_value||0;
    }

    const statusOrder = { live:0, manual:1, draft:2 };
    const flows = allFlows
      .map(f => ({
        id:f.id, name:f.attributes.name, status:f.attributes.status,
        triggerType:f.attributes.trigger_type, updated:f.attributes.updated,
        ...calc(fMetrics[f.id] || {})
      }))
      .sort((a,b) => {
        const so = (statusOrder[a.status]??3) - (statusOrder[b.status]??3);
        return so !== 0 ? so : (b.revenue||0) - (a.revenue||0);
      });

    // Summary (last 12 months, sent campaigns only)
    const sent = campaigns.filter(c => c.status==='Sent' && c.recipients>0);
    const totR=sent.reduce((s,c)=>s+c.recipients,0), totO=sent.reduce((s,c)=>s+c.opens,0);
    const totCl=sent.reduce((s,c)=>s+c.clicks,0), totU=sent.reduce((s,c)=>s+c.unsubscribes,0);
    const totRev=sent.reduce((s,c)=>s+c.revenue,0);
    const lf=flows.filter(f=>f.status==='live'&&f.recipients>0);
    const fR=lf.reduce((s,f)=>s+f.recipients,0), fO=lf.reduce((s,f)=>s+f.opens,0);
    const fCl=lf.reduce((s,f)=>s+f.clicks,0), fRev=lf.reduce((s,f)=>s+f.revenue,0);

    const summary = {
      campaigns: {
        openRate: totR>0?+((totO/totR)*100).toFixed(1):null,
        clickRate: totR>0?+((totCl/totR)*100).toFixed(2):null,
        ctor: totO>0?+((totCl/totO)*100).toFixed(1):null,
        unsubRate: totR>0?+((totU/totR)*100).toFixed(2):null,
        revenuePerRecipient: totR>0?+(totRev/totR).toFixed(3):null,
        totalRevenue: +totRev.toFixed(2), count: sent.length
      },
      flows: {
        openRate: fR>0?+((fO/fR)*100).toFixed(1):null,
        clickRate: fR>0?+((fCl/fR)*100).toFixed(2):null,
        ctor: fO>0?+((fCl/fO)*100).toFixed(1):null,
        revenuePerRecipient: fR>0?+(fRev/fR).toFixed(3):null,
        totalRevenue: +fRev.toFixed(2),
        liveCount: lf.length, draftCount: flows.filter(f=>f.status==='draft').length
      }
    };

    // YoY — this year vs last year (full year)
    const yoy = {
      thisYear: agg(thisYearResults),
      lastYearFull: agg(lastYearResults),
      lastYearYTD: agg(lastYearResults), // same — we only have full year key
      thisYearLabel: String(thisYear),
      lastYearLabel: String(lastYear),
    };

    // Monthly trend from campaign send times (last 12 months)
    const mmap = {};
    for (const c of sent) {
      if (!c.sendTime) continue;
      const k = c.sendTime.slice(0,7);
      if (!mmap[k]) mmap[k] = { recipients:0, opens:0, clicks:0, revenue:0, unsubscribes:0 };
      mmap[k].recipients+=c.recipients; mmap[k].opens+=c.opens;
      mmap[k].clicks+=c.clicks; mmap[k].revenue+=c.revenue; mmap[k].unsubscribes+=c.unsubscribes;
    }
    const monthly = Object.entries(mmap).sort(([a],[b])=>a.localeCompare(b)).map(([month,m])=>({
      month,
      openRate: m.recipients>0?+((m.opens/m.recipients)*100).toFixed(1):null,
      ctor: m.opens>0?+((m.clicks/m.opens)*100).toFixed(1):null,
      revenuePerEmail: m.recipients>0?+(m.revenue/m.recipients).toFixed(3):null,
      totalRevenue: +m.revenue.toFixed(2),
      unsubRate: m.recipients>0?+((m.unsubscribes/m.recipients)*100).toFixed(2):null,
    }));

    return new Response(JSON.stringify({ campaigns, flows, summary, yoy, monthly }), {
      headers: { 'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*' }
    });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), { status:500 });
  }
}
