/**
 * POST /api/publish-guidelines
 * Saves updated brand-guidelines-v6.html content.
 * Works in local development with `vercel dev`.
 * On production Vercel, this triggers a deploy hook if configured.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, secret } = req.body;
  
  if (!html) {
    return res.status(400).json({ error: 'Missing html content' });
  }
  
  // Optional secret check (set PUBLISH_SECRET env var for basic protection)
  const publishSecret = process.env.PUBLISH_SECRET;
  if (publishSecret && secret !== publishSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // In production Vercel, we can't write files — use deploy hook instead
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  
  if (isVercelProd) {
    // Trigger Vercel Deploy Hook if configured
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    if (deployHook) {
      try {
        const hookResp = await fetch(deployHook, { method: 'POST' });
        return res.status(200).json({ 
          success: true, 
          method: 'deploy-hook',
          message: 'Deploy triggered. Live in ~30 seconds.' 
        });
      } catch (e) {
        return res.status(500).json({ error: 'Deploy hook failed', details: e.message });
      }
    }
    // No hook configured — return instructions
    return res.status(200).json({
      success: false,
      method: 'download-required',
      message: 'Download the file and redeploy. Set VERCEL_DEPLOY_HOOK env var for one-click publish.',
    });
  }

  // Local dev: write file directly
  try {
    const filePath = path.join(process.cwd(), 'brand-guidelines-v6.html');
    
    // Backup first
    if (fs.existsSync(filePath)) {
      const backup = filePath.replace('.html', `.backup-${Date.now()}.html`);
      fs.copyFileSync(filePath, backup);
    }
    
    fs.writeFileSync(filePath, html, 'utf8');
    
    return res.status(200).json({ 
      success: true, 
      method: 'file-write',
      message: 'File saved! Run vercel deploy --prod to push live.' 
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to write file', details: err.message });
  }
}
