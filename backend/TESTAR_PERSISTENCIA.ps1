# Etapa 03A: executa teste de persistencia real no PostgreSQL local.
# Uso: abra PowerShell na pasta backend e rode .\TESTAR_PERSISTENCIA.ps1
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host 'Maven nao encontrado neste terminal. Configure o PATH antes de continuar.' -ForegroundColor Red
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
    Write-Host 'Executando teste com PostgreSQL real (nenhum dado sera mantido)...' -ForegroundColor Cyan
    & mvn '-Dtest=UserRepositoryIntegrationTest' test
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Remove-Item Env:\DB_PASSWORD -ErrorAction SilentlyContinue
}
