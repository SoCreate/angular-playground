if (Test-Path "./dist") {
    Remove-Item "./dist/" -Recurse -Force
}

Get-ChildItem "./src/" -Include "*.ngfactory.ts", "*.ngsummary.json" -Recurse | Remove-Item