document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const clearUsersButton = document.getElementById('clearUsers');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form gönderiliyor...');
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        console.log('Gönderilecek veri:', formData);

        fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('Sunucu yanıtı:', response);
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Kayıt başarısız');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('İşlenmiş veri:', data);
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            if (data.token) {
                // Token'ı localStorage'a kaydet
                localStorage.setItem('token', data.token);
                resultDiv.innerHTML = `
                    <h3>Kayıt Başarılı!</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                    <p>Token kaydedildi. Diğer işlemler için bu token kullanılacak.</p>
                    <p><a href="login.html">Giriş sayfasına git</a></p>
                `;
            } else {
                resultDiv.innerHTML = `
                    <h3>Sonuç:</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>Hata:</h3>
                <pre>${error.message}</pre>
            `;
        });
    });

    // Kullanıcıları temizleme
    clearUsersButton.addEventListener('click', function() {
        if (confirm('Tüm kullanıcıları silmek istediğinizden emin misiniz?')) {
            fetch('http://localhost:3000/api/auth/clear-users', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h3>Sonuç:</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                `;
            })
            .catch(error => {
                console.error('Hata:', error);
                const resultDiv = document.getElementById('result');
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = `
                    <h3>Hata:</h3>
                    <pre>${error.message}</pre>
                `;
            });
        }
    });
}); 