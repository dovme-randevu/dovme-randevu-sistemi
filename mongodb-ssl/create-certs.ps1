# MongoDB SSL Sertifikaları Oluşturma Scripti

# CA sertifikası için dizin oluştur
New-Item -ItemType Directory -Force -Path "ca"
Set-Location ca

# CA özel anahtarı oluştur
openssl genrsa -out ca.key 2048

# CA sertifikası oluştur
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt -subj "/CN=MongoDB CA"

# MongoDB sunucu sertifikası için dizin oluştur
Set-Location ..
New-Item -ItemType Directory -Force -Path "server"
Set-Location server

# Sunucu özel anahtarı oluştur
openssl genrsa -out server.key 2048

# Sunucu CSR oluştur
openssl req -new -key server.key -out server.csr -subj "/CN=localhost"

# Sunucu sertifikası oluştur
openssl x509 -req -in server.csr -CA ../ca/ca.crt -CAkey ../ca/ca.key -CAcreateserial -out server.crt -days 365 -sha256

# PEM dosyası oluştur (MongoDB için gerekli)
Get-Content server.key, server.crt | Set-Content server.pem

# CA sertifikasını PEM formatına dönüştür
Get-Content ../ca/ca.crt | Set-Content ca.pem

Write-Host "SSL sertifikaları başarıyla oluşturuldu!"
Write-Host "Sertifika dosyaları:"
Write-Host "- CA Sertifikası: ca/ca.crt"
Write-Host "- Sunucu Sertifikası: server/server.crt"
Write-Host "- Sunucu PEM: server/server.pem"
Write-Host "- CA PEM: ca/ca.pem" 