# Save this as find-imports.ps1 in media-site-frontend folder

Write-Host "=== Searching for ALL imports of lib/utils ===" -ForegroundColor Green
Write-Host ""

# First, find ALL imports of utils (any path)
Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from\s+['\']([^'\']*lib/utils)['\']") {
        $matchess = [regex]::Matches($content, "from\s+['\']([^'\']*lib/utils)['\']")
        foreach ($match in $matchess) {
            $importPath = $match.Groups[1].Value
            $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
            Write-Host "$relativePath" -ForegroundColor Yellow -NoNewline
            Write-Host " imports: " -NoNewline
            Write-Host "'$importPath'" -ForegroundColor Cyan
        }
    }
}

Write-Host ""
Write-Host "=== Checking what the CORRECT path should be ===" -ForegroundColor Green
Write-Host "From src/components/ui/tooltip.tsx to src/lib/utils.ts:" -ForegroundColor Gray
Write-Host "  Should be: '../../../lib/utils'" -ForegroundColor Green
Write-Host "  Or if using alias: '@/lib/utils'" -ForegroundColor Green