if (Test-Path "./dist") {
    Remove-Item "./dist/" -Recurse
}

Get-ChildItem "./src/" -Include "*.ngfactory.ts", "*.ngsummary.json" -Recurse | Remove-Item