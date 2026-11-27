# Etapa 03B - teste de cadastro real no PostgreSQL sem guardar senha em arquivo.
# Execute na pasta backend: .\TESTAR_CADASTRO.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host 'Maven nao encontrado. Configure o PATH neste terminal.' -ForegroundColor Red
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
    & mvn '-Dtest=RegistrationIntegrationTest' test
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Remove-Item Env:\DB_PASSWORD -ErrorAction SilentlyContinue
}
