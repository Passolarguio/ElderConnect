# Etapa 03C: testa login e JWT no PostgreSQL real; rollback remove as contas de teste.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host 'Maven nao encontrado. Configure o PATH e tente novamente.' -ForegroundColor Red
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
    Write-Host 'Testando login USER e ORGANIZER com PostgreSQL real...' -ForegroundColor Cyan
    & mvn '-Dtest=LoginIntegrationTest' test
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Remove-Item Env:\DB_PASSWORD -ErrorAction SilentlyContinue
}
