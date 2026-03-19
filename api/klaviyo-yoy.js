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
    }
  });
  return r.json();
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

function agg(results) {
  const t = { recipients:0, opens_unique:0, clicks_unique:0, unsubscribes:0, conversion_value:0 };
  for (const r of (results||[])) {
    t.recipients       += r.statistics.recipients||0;
    t.opens_unique     += r.statistics.opens_unique||0;
    t.clicks_unique    += r.statistics.clicks_unique||0;
    t.unsubscribes     += r.statistics.unsubscribes||0;
    t.conversion_value += r.statistics.conversion_value||0;
  }
  const rec = t.recipients;
  return {
    recipients:        rec,
    totalRevenue:      +t.conversion_value.toFixed(2),
    openRate:          rec>0 ? +((t.opens_unique/rec)*100).toFixed(1) : null,
    clickRate:         rec>0 ? +((t.clicks_unique/rec)*100).toFixed(2) : null,
    ctor:              t.opens_unique>0 ? +((t.clicks_unique/t.opens_unique)*100).toFixed(1) : null,
    unsubRate:         rec>0 ? +((t.unsubscribes/rec)*100).toFixed(2) : null,
    revenuePerRecipient: rec>0 ? +(t.conversion_value/rec).toFixed(3) : null,
    clicks:            t.clicks_unique,
    opens:             t.opens_unique,
  };
}

function formatResults(results) {
  // Return individual campaign/flow details
  return (results || []).map(r => ({
    name: r.name || r.id,
    recipients: r.statistics?.recipients || 0,
    opens: r.statistics?.opens_unique || 0,
    clicks: r.statistics?.clicks_unique || 0,
    unsubscribes: r.statistics?.unsubscribes || 0,
    revenue: r.statistics?.conversion_value || 0,
    openRate: (r.statistics?.recipients > 0) ? ((r.statistics.opens_unique / r.statistics.recipients) * 100).toFixed(1) : 0,
    clickRate: (r.statistics?.recipients > 0) ? ((r.statistics.clicks_unique / r.statistics.recipients) * 100).toFixed(2) : 0,
    conversionRate: (r.statistics?.recipients > 0) ? ((r.statistics.clicks_unique / r.statistics.recipients) * 100).toFixed(2) : 0
  })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export default async function handler() {
  if (!KEY) return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });

  try {
    // Serialize ALL report calls to avoid Klaviyo 429 throttling
    const r2025C = await campaignReport({ start: '2025-01-01', end: '2025-12-31' });
    await sleep(3000);
    const r2024C = await campaignReport({ start: '2024-01-01', end: '2024-12-31' });
    await sleep(3000);
    const r2025F = await flowReport({ start: '2025-01-01', end: '2025-12-31' });
    await sleep(3000);
    const r2024F = await flowReport({ start: '2024-01-01', end: '2024-12-31' });

    const campaigns2025 = agg(r2025C.data?.attributes?.results);
    const campaigns2024 = agg(r2024C.data?.attributes?.results);
    const flows2025     = agg(r2025F.data?.attributes?.results);
    const flows2024     = agg(r2024F.data?.attributes?.results);

    // Format individual campaigns/flows for dashboard table
    const campaignDetails2025 = formatResults(r2025C.data?.attributes?.results);
    const campaignDetails2024 = formatResults(r2024C.data?.attributes?.results);
    const flowDetails2025 = formatResults(r2025F.data?.attributes?.results);
    const flowDetails2024 = formatResults(r2024F.data?.attributes?.results);

    return new Response(JSON.stringify({
      campaigns: { '2024': campaigns2024, '2025': campaigns2025 },
      flows:     { '2024': flows2024,     '2025': flows2025 },
      campaignDetails: { '2024': campaignDetails2024, '2025': campaignDetails2025 },
      flowDetails: { '2024': flowDetails2024, '2025': flowDetails2025 },
      meta: {
        note2024campaigns: 'In-house. Campaigns started agency handoff Feb 4, 2025.',
        note2024flows: 'Mixed — agency PB flows launched May 29, 2024; in-house LPB flows ran in parallel.',
        note2025: 'Agency (PB). Campaigns Feb 4 2025 onwards. Flows primarily PB by 2025.',
        kickstarterWarning: 'July 2024 campaign revenue (~$77K) and Nov 2025 campaign revenue (~$121K) are inflated by Kickstarter backer uploads to Shopify. Treat those periods with caution.',
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
