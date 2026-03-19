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
    // Get last 30 days and last year same period for YoY comparison
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const yearAgoStart = new Date(thirtyDaysAgo);
    yearAgoStart.setFullYear(yearAgoStart.getFullYear() - 1);
    const yearAgoEnd = new Date(now);
    yearAgoEnd.setFullYear(yearAgoEnd.getFullYear() - 1);
    
    const currentStart = thirtyDaysAgo.toISOString().split('T')[0];
    const currentEnd = now.toISOString().split('T')[0];
    const yearAgoStartStr = yearAgoStart.toISOString().split('T')[0];
    const yearAgoEndStr = yearAgoEnd.toISOString().split('T')[0];

    console.log(`📅 Current: ${currentStart} to ${currentEnd}`);
    console.log(`📅 YoY: ${yearAgoStartStr} to ${yearAgoEndStr}`);

    // Serialize ALL report calls to avoid Klaviyo 429 throttling
    const rCurrentC = await campaignReport({ start: currentStart, end: currentEnd });
    await sleep(3000);
    const rYoYC = await campaignReport({ start: yearAgoStartStr, end: yearAgoEndStr });
    await sleep(3000);
    const rCurrentF = await flowReport({ start: currentStart, end: currentEnd });
    await sleep(3000);
    const rYoYF = await flowReport({ start: yearAgoStartStr, end: yearAgoEndStr });

    const campaignsCurrent = agg(rCurrentC.data?.attributes?.results);
    const campaignsYoY = agg(rYoYC.data?.attributes?.results);
    const flowsCurrent     = agg(rCurrentF.data?.attributes?.results);
    const flowsYoY     = agg(rYoYF.data?.attributes?.results);

    // Format individual campaigns/flows for dashboard table
    const campaignDetailsCurrent = formatResults(rCurrentC.data?.attributes?.results);
    const campaignDetailsYoY = formatResults(rYoYC.data?.attributes?.results);
    const flowDetailsCurrent = formatResults(rCurrentF.data?.attributes?.results);
    const flowDetailsYoY = formatResults(rYoYF.data?.attributes?.results);

    return new Response(JSON.stringify({
      campaigns: { 'current': campaignsCurrent, 'yoy': campaignsYoY },
      flows:     { 'current': flowsCurrent,     'yoy': flowsYoY },
      campaignDetails: { 'current': campaignDetailsCurrent, 'yoy': campaignDetailsYoY },
      flowDetails: { 'current': flowDetailsCurrent, 'yoy': flowDetailsYoY },
      period: {
        current: `${currentStart} to ${currentEnd}`,
        yoy: `${yearAgoStartStr} to ${yearAgoEndStr}`
      },
      meta: {
        note: 'Comparing last 30 days current period vs same 30-day period last year',
        kickstarterWarning: 'Campaigns during Kickstarter periods may have inflated revenue due to backer uploads.',
      }
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch(err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
