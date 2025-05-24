document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const getProfileButton = document.getElementById('getProfile');
    const logoutButton = document.getElementById('logout');
    
    // Giriş formu
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Giriş isteği gönderiliyor...');
        
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        console.log('Gönderilecek veri:', formData);

        fetch('http://localhost:3000/api/auth/login', {
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
                    throw new Error(err.message || 'Giriş başarısız');
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
                    <h3>Giriş Başarılı!</h3>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                    <p>Token kaydedildi. Diğer işlemler için bu token kullanılacak.</p>
                `;
            } else {
                resultDiv.innerHTML = `
                    <h3>Hata:</h3>
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

    // Profil bilgilerini getir
    getProfileButton.addEventListener('click', function() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Lütfen önce giriş yapın!');
            return;
        }

        fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Profil bilgileri alınamadı');
                });
            }
            return response.json();
        })
        .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <h3>Profil Bilgileri:</h3>
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
    });

    // Çıkış yap
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h3>Çıkış Yapıldı</h3>
            <p>Token silindi. Tekrar giriş yapmak için sayfayı yenileyin.</p>
        `;
    });
}); 