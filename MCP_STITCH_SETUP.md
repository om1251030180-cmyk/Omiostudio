# Stitch MCP Setup (VS Code)

## Requirements

- VS Code with MCP support enabled.
- Network access to `https://stitch.googleapis.com/mcp`.
- A valid Stitch API key (recommended via environment variable).

## Files Added

- `.vscode/mcp.json`
- `.env.example` (new `STITCH_API_KEY` and `STITCH_MCP_URL` entries)

## MCP Configuration

`/.vscode/mcp.json`

```json
{
  "servers": {
    "stitch": {
      "type": "http",
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "${env:STITCH_API_KEY}"
      }
    }
  }
}
```

## Set API Key (Windows PowerShell)

Use one of these options.

### Option A: current shell only

```powershell
$env:STITCH_API_KEY="YOUR_STITCH_API_KEY"
```

### Option B: persist for your user account

```powershell
setx STITCH_API_KEY "YOUR_STITCH_API_KEY"
```

Then restart VS Code.

## Verify

1. Reload VS Code window.
2. Open MCP tooling in VS Code and check server list.
3. Confirm `stitch` server is connected.

## Troubleshooting

- If server is not detected, reload VS Code after setting env var.
- If auth fails, verify key value and no extra spaces/newlines.
- If network fails, verify firewall/proxy allows the Stitch MCP URL.
