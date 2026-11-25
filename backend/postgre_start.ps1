# Inicie este arquivo em um terminal PowerShell com Maven no PATH.
# O script pede a senha sem eco no terminal e NUNCA a escreve em arquivo.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host 'Maven nao encontrado. Configure o PATH e execute novamente.' -ForegroundColor Red
    exit 1
}

$senhaSegura = Read-Host 'Senha do usuario elderconnect_app' -AsSecureString
$ponteiro = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($senhaSegura)
try {
    $env:DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ponteiro)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ponteiro)
}

try {
    & mvn spring-boot:run
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Remove-Item Env:\DB_PASSWORD -ErrorAction SilentlyContinue
}
