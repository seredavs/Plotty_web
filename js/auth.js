document.addEventListener('DOMContentLoaded', () => {
    // 1. Имитация сохранения/валидации в полях ввода
    const authInputs = document.querySelectorAll('.form-input');
    authInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Если введено больше 2 символов, подсвечиваем зеленым (успех)
            if (input.value.trim().length > 2) {
                input.style.borderColor = '#3F745C';
                input.style.borderWidth = '2px';
            } else {
                input.style.borderColor = '';
                input.style.borderWidth = '';
            }
        });
    });

    // 2. Кликабельная кнопка входа/регистрации (переход в систему)
    const authButtons = document.querySelectorAll('.btn-primary');
    authButtons.forEach(btn => {
        // ДОБАВИЛИ ПРОВЕРКУ НА "Создать"
        if (btn.innerText.includes('Регистрация') || btn.innerText.includes('Войти') || btn.innerText.includes('Создать')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                btn.innerText = 'Загрузка...';
                btn.style.opacity = '0.8';
                // Имитируем задержку сети и перекидываем в рабочее пространство
                setTimeout(() => {
                    window.location.href = 'organizations.html';
                }, 800);
            });
        }
    });
});