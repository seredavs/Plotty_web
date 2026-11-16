document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Интерактив комментариев (для scene.html) ---
    const commentInput = document.querySelector('.comment-input-area .form-input');
    const sendBtn = document.querySelector('.comment-input-area .btn-primary');

    if (commentInput && sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text) return; // Не отправляем пустоту

            // Получаем текущее время
            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
                            now.getMinutes().toString().padStart(2, '0');

            // Создаем HTML нового комментария
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.innerHTML = `
                <div class="avatar bg-1">ВЫ</div>
                <div class="comment-content">
                    <div class="comment-author">Анна Соколова · ${timeStr}</div>
                    <div class="comment-text">${text}</div>
                </div>
            `;

            // Вставляем его прямо перед полем ввода
            const inputArea = document.querySelector('.comment-input-area');
            inputArea.parentNode.insertBefore(newComment, inputArea);

            // Очищаем поле ввода
            commentInput.value = '';

            // Обновляем счетчик комментариев в заголовке
            const title = document.querySelector('.comments-header .meta-title');
            if (title) {
                // Ищем цифру и увеличиваем на 1
                const currentCount = parseInt(title.textContent.replace(/\D/g, '')) || 0;
                title.textContent = `Комментарии ${currentCount + 1}`;
            }
        });

        // Отправка по нажатию Enter
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendBtn.click();
            }
        });
    }

    // --- 2. Имитация переключения ролей (для participants.html) ---
    const roleSelects = document.querySelectorAll('.form-select');

    roleSelects.forEach(select => {
        // Если это селект выбора роли (в нем есть опция "Редактор")
        if (select.innerHTML.includes('Редактор')) {
            select.addEventListener('change', (e) => {
                const newRole = e.target.value;

                // Ищем кнопку отправки рядом
                const inviteBlock = select.closest('.meta-card');
                if (inviteBlock) {
                    const btn = inviteBlock.querySelector('.btn-primary');
                    const originalText = btn.innerText;

                    // Анимация успешного действия
                    btn.innerText = `Роль "${newRole}" выбрана!`;
                    btn.style.backgroundColor = '#3F745C'; // Зеленый цвет успеха
                    btn.style.borderColor = '#3F745C';

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.borderColor = '';
                    }, 2000);
                }
            });
        }
    });

    // --- 3. Имитация всплывающих уведомлений (Тосты) для кнопок "Сохранить" ---
    const saveButtons = document.querySelectorAll('.btn-primary');
    saveButtons.forEach(btn => {
        if (btn.innerText.includes('Сохранить') || btn.innerText.includes('Добавить') || btn.innerText.includes('Отправить')) {
            btn.addEventListener('click', (e) => {
                // Игнорируем форму комментов, там своя логика
                if (btn.closest('.comment-input-area')) return;

                e.preventDefault();
                const originalText = btn.innerText;

                btn.innerText = 'Успешно!';
                btn.style.backgroundColor = '#3F745C';
                btn.style.borderColor = '#3F745C';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 1500);
            });
        }
    });

    // --- 5. Изменение цвета статуса в select (в редакторе сцены) ---
    const statusSelect = document.querySelector('.form-select');
    if (statusSelect && (statusSelect.value.includes('В работе') || statusSelect.value.includes('Готово'))) {

        const updateSelectColor = () => {
            if (statusSelect.value === 'Готово') {
                statusSelect.style.backgroundColor = '#E4EFE3';
                statusSelect.style.color = '#3F745C';
                statusSelect.style.borderColor = '#E4EFE3';
                statusSelect.style.fontWeight = '600';
            } else if (statusSelect.value === 'Черновик') {
                statusSelect.style.backgroundColor = '#F0DFCE';
                statusSelect.style.color = '#827568';
                statusSelect.style.borderColor = '#F0DFCE';
                statusSelect.style.fontWeight = '600';
            } else {
                // В работе (дефолт)
                statusSelect.style.backgroundColor = '#F0DFCE';
                statusSelect.style.color = '#904D30';
                statusSelect.style.borderColor = '#F0DFCE';
                statusSelect.style.fontWeight = '600';
            }
        };

        // Задаем цвет при загрузке и при изменении
        updateSelectColor();
        statusSelect.addEventListener('change', updateSelectColor);
    }

    // --- Вспомогательная функция: делаем карточку перетаскиваемой ---
        function makeCardDraggable(card) {
            card.setAttribute('draggable', 'true');
            card.addEventListener('dragstart', function(e) {
                draggedCard = this;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', 'card');
                setTimeout(() => { this.style.opacity = '0.4'; }, 0);
            });
            card.addEventListener('dragend', function() {
                draggedCard = null;
                this.style.opacity = '1';
                document.querySelectorAll('.act-column').forEach(col => col.classList.remove('target-column'));
            });
        }

        // --- 4. Генерация модалок и РЕАЛЬНОЕ создание сцен ---
        const actionButtons = document.querySelectorAll('.action-btn, .add-scene-btn');

        actionButtons.forEach(btn => {
            if (btn.innerText.includes('Добавить') || btn.innerText.includes('Создать') || btn.innerText.includes('Пригласить')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Создаем затемнение
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
                    overlay.style.width = '100%'; overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(48, 39, 28, 0.5)';
                    overlay.style.zIndex = '999'; overlay.style.display = 'flex';
                    overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
                    overlay.style.backdropFilter = 'blur(2px)';

                    const actionName = btn.innerText.replace('＋ ', '');
                    const modal = document.createElement('div');
                    modal.className = 'card';
                    modal.style.width = '400px'; modal.style.padding = '32px';
                    modal.style.display = 'flex'; modal.style.flexDirection = 'column'; modal.style.gap = '20px';

                    modal.innerHTML = `
                        <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: #4A3728; margin: 0;">${actionName}</h3>
                        <div class="form-group">
                            <label class="form-label">Название</label>
                            <input type="text" class="form-input modal-input-name" placeholder="Введите название..." autofocus>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                            <button class="btn btn-secondary btn-sm modal-close">Отмена</button>
                            <button class="btn btn-primary btn-sm modal-save">Сохранить</button>
                        </div>
                    `;

                    modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());

                    // Логика сохранения
                    modal.querySelector('.modal-save').addEventListener('click', function () {
                        const inputVal = modal.querySelector('.modal-input-name').value.trim() || 'Новая сцена';

                        // Если мы нажали кнопку в колонке акта — СОЗДАЕМ СЦЕНУ!
                        const parentAct = btn.closest('.act-column');
                        if (parentAct) {
                            const newCard = document.createElement('a');
                            newCard.href = "scene.html";
                            newCard.className = "card scene-card";
                            newCard.innerHTML = `
                                <div class="scene-header"><span class="scene-number">СЦЕНА НОВАЯ</span></div>
                                <h4 class="scene-title">${inputVal}</h4>
                                <p class="scene-desc">Описание отсутствует...</p>
                                <div class="scene-location">Не указано</div>
                                <div class="scene-footer">
                                    <span class="badge badge-accent" style="background:#F0DFCE; color:#827568;">Черновик</span>
                                </div>
                            `;

                            // Делаем новую карточку перетаскиваемой!
                            makeCardDraggable(newCard);

                            // Вставляем перед кнопкой "Добавить сцену"
                            parentAct.insertBefore(newCard, btn);
                        }

                        // Анимация успеха
                        this.innerText = 'Готово!';
                        this.style.backgroundColor = '#3F745C';
                        this.style.borderColor = '#3F745C';
                        setTimeout(() => overlay.remove(), 500);
                    });

                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                });
            }
        });

        // --- 6. Интерактивный Drag-and-Drop для доски (board.html) ---
        let draggedCard = null;

        // Инициализируем существующие карточки
        document.querySelectorAll('.scene-card').forEach(card => makeCardDraggable(card));

        // Настраиваем колонки на прием карточек
        document.querySelectorAll('.act-column').forEach(column => {
            column.addEventListener('dragover', e => e.preventDefault());
            column.addEventListener('dragenter', function(e) { e.preventDefault(); this.classList.add('target-column'); });
            column.addEventListener('dragleave', function(e) {
                if (!this.contains(e.relatedTarget)) this.classList.remove('target-column');
            });
            column.addEventListener('drop', function(e) {
                this.classList.remove('target-column');
                if (draggedCard) {
                    const addBtn = this.querySelector('.add-scene-btn');
                    if (addBtn) this.insertBefore(draggedCard, addBtn);
                    else this.appendChild(draggedCard);
                }
            });
        });

});