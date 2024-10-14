function Get-Param($Name, [switch]$Required, $Default) {
    $result = $null

    if ($null -eq $result) {
        $variable = Get-Variable $Name -EA SilentlyContinue    
        if ($null -ne $variable) {
            $result = $variable.Value
        }
    }

    if ($null -eq $result) {
        if ($Required) {
            throw "Missing parameter value $Name"
        } else {
            $result = $Default
        }
    }

    return $result
}

$ErrorActionPreference = "Stop"

function UpdateJsonFile ([string]$fullpath) {
    Write-Host 'Started Transforming Staged Action Secrets for ' $fullpath

	$pathExists = Test-Path $fullpath
	if(!$pathExists) {
		Write-Host 'ERROR: Path ' $fullpath ' does not exist'
		Exit 1
	}

	$json = Get-Content $fullpath -Raw | ConvertFrom-Json
    Write-Host 'Json content read from file'

    $staged_action_secrets_hash = @($json.staged_action_secrets | ForEach-Object { $_.psobject.properties })
    
    $secrets = @()

    foreach($staged_action_secret in $staged_action_secrets_hash) {
                
        Write-Host 'transforming secret' $staged_action_secret.Name

        $newObject = New-Object psobject -Property @{
            value = $staged_action_secret.Value
            name = $staged_action_secret.Name
        }
        
        $secrets += $newObject
    }

    $json.secrets = $secrets
    $json.PSObject.Properties.Remove('staged_action_secrets')

	$json | ConvertTo-Json -depth 99 | Set-Content $fullpath

    Write-Host $fullpath 'action secrets transformed successfully.'
}

UpdateJsonFile (Get-Param "JsonFilePath" -Required)