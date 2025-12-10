# Find all files importing from the old tooltip
Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from\s+['\']([^'\']*/tooltip)['\']") {
        $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
        Write-Host "Found import in: $relativePath" -ForegroundColor Yellow
        
        # Update the import
        $newContent = $content -replace "from\s+['\']([^'\']*/tooltip)['\']", "from '@/components/ui/tooltip-fixed'"
        Set-Content -Path $_.FullName -Value $newContent
        Write-Host "  → Updated to import from tooltip-fixed" -ForegroundColor Green
    }
}