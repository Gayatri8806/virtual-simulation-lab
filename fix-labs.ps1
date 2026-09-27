$labsContent = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((Get-Content -Raw "$PSScriptRoot\labs.b64")))
[System.IO.File]::WriteAllText("$PSScriptRoot\src\pages\Labs.jsx", $labsContent)

$appContent = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((Get-Content -Raw "$PSScriptRoot\app.b64")))
[System.IO.File]::WriteAllText("$PSScriptRoot\src\App.jsx", $appContent)

Write-Host "Done. Labs.jsx and App.jsx have been overwritten." -ForegroundColor Green
Write-Host "----- Labs.jsx contents now: -----"
Get-Content "$PSScriptRoot\src\pages\Labs.jsx"
