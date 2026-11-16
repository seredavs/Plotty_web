document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Интерактив комментариев (scene.html) ---
    const commentInput = document.querySelector('.comment-input-area .form-input');
    const sendBtn = document.querySelector('.comment-input-area .btn-primary');
    if (commentInput && sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text) return;

            const now = new Date();
            const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const newComment = document.createElement('div');
            newComment.className = 'comment-item';
            newComment.innerHTML = `
                <div class="avatar bg-1">ВЫ</div>
                <div class="comment-content">
                    <div class="comment-author">Анна Соколова · ${timeStr}</div>
                    <div class="comment-text">${text}</div>
                </div>
            `;
            const inputArea = document.querySelector('.comment-input-area');
            inputArea.parentNode.insertBefore(newComment, inputArea);
            commentInput.value = '';

            const title = document.querySelector('.comments-header .meta-title');
            if (title) {
                const currentCount = parseInt(title.textContent.replace(/\D/g, '')) || 0;
                title.textContent = `Комментарии ${currentCount + 1}`;
            }
        });
        commentInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
        });
    }

    // --- 2. Имитация переключения ролей (participants.html, org-admin.html) ---
    const roleSelects = document.querySelectorAll('.form-select');
    roleSelects.forEach(select => {
        if (select.innerHTML.includes('Редактор')) {
            select.addEventListener('change', (e) => {
                select.style.backgroundColor = '#E4EFE3';
                select.style.color = '#3F745C';
                select.style.borderColor = '#E4EFE3';
                setTimeout(() => {
                    select.style.backgroundColor = '';
                    select.style.color = '';
                    select.style.borderColor = '';
                }, 1000);
            });
        }
    });

    // --- 3. Имитация всплывающих уведомлений (Тосты) для кнопок "Сохранить" ---
    const saveButtons = document.querySelectorAll('.btn-primary');
    saveButtons.forEach(btn => {
        if (btn.innerText.includes('Сохранить') || btn.innerText.includes('Отправить')) {
            btn.addEventListener('click', (e) => {
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

    // --- 4. Изменение цвета статуса (scene.html) ---
    const statusSelect = document.querySelector('.form-select');
    if (statusSelect && (statusSelect.value.includes('В работе') || statusSelect.value.includes('Готово'))) {
        const updateSelectColor = () => {
            if (statusSelect.value === 'Готово') {
                statusSelect.style.backgroundColor = '#E4EFE3'; statusSelect.style.color = '#3F745C'; statusSelect.style.borderColor = '#E4EFE3';
            } else if (statusSelect.value === 'Черновик') {
                statusSelect.style.backgroundColor = '#F0DFCE'; statusSelect.style.color = '#827568'; statusSelect.style.borderColor = '#F0DFCE';
            } else {
                statusSelect.style.backgroundColor = '#F0DFCE'; statusSelect.style.color = '#904D30'; statusSelect.style.borderColor = '#F0DFCE';
            }
        };
        updateSelectColor();
        statusSelect.addEventListener('change', updateSelectColor);
    }

    // --- 5. Переключение Истории Версий (history.html) ---
    const historyCards = document.querySelectorAll('.history-card');
    if(historyCards.length > 0) {
        historyCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                // Снимаем выделение со всех
                historyCards.forEach(c => {
                    c.style.border = '1px solid #E8DDC7';
                    c.style.background = '#FFFCF4';
                });
                // Выделяем текущую
                card.style.border = '1px solid #904D30';
                card.style.background = '#F0DFCE';

                // Имитируем загрузку новой ревизии
                const editor = document.querySelector('.editor-content');
                if(editor) {
                    editor.style.opacity = '0.3';
                    setTimeout(() => { editor.style.opacity = '1'; }, 300);
                }
            });
        });
    }

    // --- 6. Переключение Тёмной Темы (settings.html) ---
    const themeToggle = document.querySelector('.theme-toggle'); // Предполагается чекбокс/кнопка
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (window.location.pathname.includes('settings-dark.html')) {
                window.location.href = 'settings.html';
            } else {
                window.location.href = 'settings-dark.html';
            }
        });
    }

    // --- 7. Сворачивание левого сайдбара ---
    const toggleBtn = document.querySelector('.toggle-sidebar-btn');
    const sidebar = document.getElementById('app-sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // --- 8. Интерактив настроек (Тумблеры и шрифты) ---
    // Оживляем переключатели (тумблеры)
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
        toggle.style.cursor = 'pointer';
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('on');
        });
    });

    // Живое превью шрифта
    const fontSelector = document.querySelector('.font-selector');
    const sizeInput = document.querySelector('.font-size-input');
    const previewText = document.querySelector('.font-preview-text');

    if (fontSelector && sizeInput && previewText) {
        const updatePreview = () => {
            previewText.style.fontFamily = fontSelector.value;
            previewText.style.fontSize = sizeInput.value + 'px';
        };
        fontSelector.addEventListener('change', updatePreview);
        sizeInput.addEventListener('input', updatePreview);
    }

    // --- 9. Специальное модальное окно: Изменение пароля ---
    const changePwdBtns = document.querySelectorAll('.btn-secondary');
    changePwdBtns.forEach(btn => {
        if (btn.innerText.includes('Изменить пароль')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Создаем затемнение
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(48, 39, 28, 0.5)';
                overlay.style.zIndex = '1000'; overlay.style.display = 'flex';
                overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
                overlay.style.backdropFilter = 'blur(2px)';

                const modal = document.createElement('div');
                modal.className = 'card';
                modal.style.width = '400px'; modal.style.padding = '32px';
                modal.style.display = 'flex'; modal.style.flexDirection = 'column'; modal.style.gap = '20px';

                // Магия адаптации под тёмную/светлую тему
                const isDark = document.body.classList.contains('dark-theme');
                const textColor = isDark ? '#F4E9D8' : '#1A1A1A';
                const labelColor = isDark ? '#BCAF9E' : '#827568';
                const inputBg = isDark ? '#24211E' : '#FFFFFF';
                const inputBorder = isDark ? '#4A3728' : '#E8DDC7';

                // В окне пароля нужно три поля, а не одно
                modal.innerHTML = `
                    <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: ${textColor}; margin: 0;">Смена пароля</h3>

                    <div class="form-group">
                        <label class="form-label" style="color: ${labelColor};">Текущий пароль</label>
                        <input type="password" class="form-input" placeholder="Введите старый пароль" style="background: ${inputBg}; color: ${textColor}; border-color: ${inputBorder};" autofocus>
                    </div>

                    <div class="form-group">
                        <label class="form-label" style="color: ${labelColor};">Новый пароль</label>
                        <input type="password" class="form-input" placeholder="Не менее 8 символов" style="background: ${inputBg}; color: ${textColor}; border-color: ${inputBorder};">
                    </div>

                    <div class="form-group">
                        <label class="form-label" style="color: ${labelColor};">Повторите пароль</label>
                        <input type="password" class="form-input" placeholder="Ещё раз" style="background: ${inputBg}; color: ${textColor}; border-color: ${inputBorder};">
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                        <button class="btn btn-secondary btn-sm modal-close">Отмена</button>
                        <button class="btn btn-primary btn-sm modal-save">Сохранить</button>
                    </div>
                `;

                // Закрытие по кнопке "Отмена"
                modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());

                // Имитация успешного сохранения
                modal.querySelector('.modal-save').addEventListener('click', function () {
                    this.innerText = 'Изменён!';
                    this.style.backgroundColor = '#3F745C';
                    this.style.borderColor = '#3F745C';
                    setTimeout(() => overlay.remove(), 700);
                });

                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            });
        }
    });


    // --- 10. Переключение режима редактора сцены ---
    const btnEdit = document.getElementById('btn-edit-scene');
    const btnSave = document.getElementById('btn-save-scene');
    const readToolbar = document.getElementById('read-toolbar');
    const editToolbar = document.getElementById('edit-toolbar');
    const formattedContent = document.getElementById('formatted-content');
    const rawContent = document.getElementById('raw-content');

    if (btnEdit && btnSave) {
        btnEdit.addEventListener('click', () => {
            readToolbar.style.display = 'none';
            formattedContent.style.display = 'none';
            editToolbar.style.display = 'flex';
            rawContent.style.display = 'block';
            rawContent.focus(); // Сразу ставим курсор
        });

        btnSave.addEventListener('click', () => {
            // Имитация умного сохранения и форматирования
            btnSave.innerText = 'Автоформат...';
            btnSave.style.opacity = '0.7';

            setTimeout(() => {
                editToolbar.style.display = 'none';
                rawContent.style.display = 'none';
                readToolbar.style.display = 'flex';
                formattedContent.style.display = 'block';

                btnSave.innerText = 'Сохранить';
                btnSave.style.opacity = '1';
            }, 800); // 0.8 секунд "магии"
        });
    }

    // --- 11. Форматирование текста (Жирный / Курсив) ---
    const btnBold = document.getElementById('btn-bold');
    const btnItalic = document.getElementById('btn-italic');

    if (btnBold) {
        btnBold.addEventListener('click', (e) => {
            e.preventDefault(); // Чтобы кнопка не пыталась отправить форму
            document.execCommand('bold', false, null);
        });
    }

    if (btnItalic) {
        btnItalic.addEventListener('click', (e) => {
            e.preventDefault();
            document.execCommand('italic', false, null);
        });
    }

    // --- 12. Модалка "Добавить персонажа" в редакторе сцены ---
    const addCharBtns = document.querySelectorAll('.action-btn');
    addCharBtns.forEach(btn => {
        if (btn.innerText.includes('Добавить персонажа')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Создаем подложку
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
                overlay.style.width = '100%'; overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(48, 39, 28, 0.5)';
                overlay.style.zIndex = '1000'; overlay.style.display = 'flex';
                overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
                overlay.style.backdropFilter = 'blur(2px)';

                // Создаем окно
                const modal = document.createElement('div');
                modal.className = 'card';
                modal.style.width = '400px'; modal.style.padding = '32px';
                modal.style.display = 'flex'; modal.style.flexDirection = 'column'; modal.style.gap = '20px';

                const isDark = document.body.classList.contains('dark-theme');
                const textColor = isDark ? '#F4E9D8' : '#1A1A1A';
                const labelColor = isDark ? '#BCAF9E' : '#827568';
                const inputBg = isDark ? '#24211E' : '#FFFFFF';
                const inputBorder = isDark ? '#4A3728' : '#E8DDC7';

                // В value каждой option прячем Имя|Роль|Цвет полоски
                modal.innerHTML = `
                    <h3 style="font-family: 'Montserrat', sans-serif; font-size: 20px; color: ${textColor}; margin: 0;">Добавить персонажа</h3>
                    <div class="form-group">
                        <label class="form-label" style="color: ${labelColor};">Выберите из базы проекта</label>
                        <select class="form-select char-select" style="background: ${inputBg}; color: ${textColor}; border-color: ${inputBorder};">
                            <option value="Нина Морозова|Бабушка Анны|#904D30">Нина Морозова</option>
                            <option value="Виктор|Рыбак, владелец катера|#3F745C">Виктор (Рыбак)</option>
                            <option value="Джимми|Мальчик с собакой|#D18B69">Джимми (с собакой)</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                        <button class="btn btn-secondary btn-sm modal-close">Отмена</button>
                        <button class="btn btn-primary btn-sm modal-save">Добавить</button>
                    </div>
                `;

                // Закрытие без сохранения
                modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());

                // МАГИЯ: Добавление персонажа в список
                modal.querySelector('.modal-save').addEventListener('click', () => {
                    // Достаем спрятанные данные из селекта
                    const selectVal = modal.querySelector('.char-select').value.split('|');
                    const charName = selectVal[0];
                    const charRole = selectVal[1];
                    const charColor = selectVal[2];

                    // Ищем контейнер с персонажами (там, где находится сама нажатая кнопка)
                    const charList = btn.closest('.character-list');

                    if (charList) {
                        // Создаем новую карточку персонажа
                        const newChar = document.createElement('div');
                        newChar.className = 'char-item';
                        newChar.style.display = 'flex';
                        newChar.style.alignItems = 'stretch';
                        newChar.style.background = isDark ? '#24211E' : '#FFFCF4';
                        newChar.style.border = `1px solid ${isDark ? '#4A3728' : '#E8DDC7'}`;
                        newChar.style.borderRadius = '6px';
                        newChar.style.overflow = 'hidden';
                        newChar.style.marginBottom = '8px';

                        newChar.innerHTML = `
                            <div style="width: 8px; background-color: ${charColor}; flex-shrink: 0;"></div>
                            <div class="char-info" style="padding: 8px 12px; display: flex; flex-direction: column;">
                                <span class="char-name" style="font-size: 13px; font-weight: 600; color: ${textColor};">${charName}</span>
                                <span class="char-role" style="font-size: 11px; color: #827568;">${charRole}</span>
                            </div>
                        `;

                        // Вставляем новую карточку ПЕРЕД кнопкой "Добавить персонажа"
                        charList.insertBefore(newChar, btn);
                    }

                    // Закрываем модалку
                    overlay.remove();
                });

                overlay.appendChild(modal);
                document.body.appendChild(overlay);
            });
        }
    });

    // --- 13. Переключение фильтров на Доске ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Если это переключатель вида (Доска / Список) — переключаем как радиокнопки
            if (btn.dataset.group) {
                document.querySelectorAll(`.filter-btn[data-group="${btn.dataset.group}"]`)
                    .forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                // Иначе просто вкл/выкл
                btn.classList.toggle('active');
            }
        });
    });

    // --- 15. Переключение ревизий в истории (history.html) ---
    const revisionCards = document.querySelectorAll('.revision-card');
    const diffHeader = document.querySelector('.diff-panel-header .meta-title');

    if (revisionCards.length > 0) {
        revisionCards.forEach(card => {
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                // Убираем активный класс у всех
                revisionCards.forEach(c => c.classList.remove('active'));
                // Добавляем активный класс нажатой карточке
                card.classList.add('active');

                // Берем название ревизии из карточки
                const revTitle = card.querySelector('.rev-title').innerText;

                // Имитация: меняем заголовок в правой панели, чтобы показать, что это работает
                const rightPanels = document.querySelectorAll('.diff-panel');
                if (rightPanels.length > 1) {
                    rightPanels[1].querySelector('.meta-title').innerText = revTitle;
                    // В реальном проекте тут бы подгружался diff-код с сервера
                }
            });
        });
    }

});