# Etapa 03C: exige backend RODANDO em outro terminal.
# Testa o HTTP real de cadastro e login para USER e ORGANIZER.
# ATENCAO: as duas contas ficticias criadas aqui ficam salvas no PostgreSQL.
param([string]$BaseUrl = "http://localhost:8080")
$ErrorActionPreference = 'Stop'
$BaseUrl = $BaseUrl.TrimEnd('/')
$stamp = [guid]::NewGuid().ToString('N').Substring(0, 12)

foreach ($role in @('USER', 'ORGANIZER')) {
    $email = "video-$($role.ToLower())-$stamp@example.test"
    $password = 'SenhaDeTeste123!'
    $registration = @{
        fullName = "Pessoa Teste $role"
        email = $email
        password = $password
        role = $role
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$BaseUrl/api/auth/register" -Method POST `
        -ContentType 'application/json' -Body $registration
    if (-not $created.token -or $created.user.role -ne $role) {
        throw "Cadastro $role nao retornou token e usuario corretamente."
    }
    $loginData = @{ email=$email; password=$password } | ConvertTo-Json
    $logged = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method POST `
        -ContentType 'application/json' -Body $loginData
    if (-not $logged.token -or $logged.user.id -ne $created.user.id -or $logged.user.role -ne $role) {
        throw "Login $role nao retornou o usuario esperado."
    }
    Write-Host "OK: cadastro e login HTTP $role (dados no PostgreSQL)." -ForegroundColor Green
}
Write-Host "SUCESSO: os dois tipos de conta conseguem cadastrar e entrar na API." -ForegroundColor Green
Write-Host 'ATENCAO: contas ficticias foram mantidas no banco. Nenhum JWT ou senha foi impresso.' -ForegroundColor Yellow
