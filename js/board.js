document.addEventListener('DOMContentLoaded', () => {

    // --- ЛОГИКА АККОРДЕОНА В ЛЕВОМ МЕНЮ ---
    const actToggles = document.querySelectorAll('.act-toggle');
    actToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('expanded');
            const content = toggle.nextElementSibling;
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
            }
        });
    });

    // --- ЛОГИКА ПОИСКА ПО СЦЕНАМ ---
    const boardSearch = document.getElementById('board-search');
    if (boardSearch) {
        boardSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.scene-card');
            cards.forEach(card => {
                const text = card.innerText.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    const boardCanvas = document.querySelector('.board-canvas');
    if (!boardCanvas) return;

    // --- ФУНКЦИЯ ПРАВИЛЬНЫХ СКЛОНЕНИЙ ---
    function getDeclension(number, txt, cases = [2, 0, 1, 1, 1, 2]) {
        return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    // --- ФУНКЦИЯ ПЕРЕСЧЕТА СЦЕН И АКТОВ ---
    function updateSceneCounts() {
        const columns = document.querySelectorAll('.board-column');
        let totalScenes = 0;
        let totalActs = columns.length;

        columns.forEach(col => {
            const sceneCount = col.querySelectorAll('.scene-card').length;
            totalScenes += sceneCount;

            const subtitle = col.querySelector('span[style*="font-size: 11px"]');
            if (subtitle) {
                const roleText = subtitle.innerText.split('·')[0].trim();
                const sceneWord = getDeclension(sceneCount, ['сцена', 'сцены', 'сцен']);
                subtitle.innerText = `${roleText} · ${sceneCount} ${sceneWord}`;
            }
        });

        const globalCounter = document.getElementById('scene-counter-display');
        if (globalCounter) {
            const sceneWord = getDeclension(totalScenes, ['сцена', 'сцены', 'сцен']);
            const actWord = getDeclension(totalActs, ['акт', 'акта', 'актов']);
            globalCounter.innerText = `${totalScenes} ${sceneWord}, ${totalActs} ${actWord}`;
        }
    }

    // ==========================================
    // 1. ПЕРЕТАСКИВАНИЕ СЦЕН (DRAG AND DROP)
    // ==========================================
    let draggedCard = null;

    function initDragAndDrop() {
        const cards = document.querySelectorAll('.scene-card');
        const columns = document.querySelectorAll('.board-column');

        cards.forEach(card => {
            card.removeEventListener('dragstart', handleDragStart);
            card.removeEventListener('dragend', handleDragEnd);
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });

        columns.forEach(column => {
            column.removeEventListener('dragover', handleDragOver);
            column.removeEventListener('drop', handleDrop);
            column.addEventListener('dragover', handleDragOver);
            column.addEventListener('drop', handleDrop);
        });

        updateSceneCounts();
    }

    function handleDragStart(e) {
        draggedCard = this;
        setTimeout(() => this.style.opacity = '0.4', 0);
    }

    function handleDragEnd(e) {
        draggedCard = null;
        this.style.opacity = '1';
        updateSceneCounts();
    }

    function handleDragOver(e) {
        e.preventDefault();
        const column = this;
        const addBtn = column.querySelector('.action-btn');
        if (draggedCard && addBtn) {
            column.insertBefore(draggedCard, addBtn);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        updateSceneCounts();
    }

    initDragAndDrop();

    // ==========================================
    // 2. ДЕЛЕГИРОВАНИЕ КЛИКОВ (РЕДАКТИРОВАНИЕ, УДАЛЕНИЕ, ПЕРЕХОД)
    // ==========================================
    document.addEventListener('click', (e) => {
        // УДАЛЕНИЕ
        const deleteBtn = e.target.closest('.delete-scene-btn');
        if (deleteBtn) {
            const card = deleteBtn.closest('.scene-card');
            openConfirmModal('Вы уверены, что хотите удалить эту сцену? Это действие нельзя отменить.', () => {
                card.remove();
                updateSceneCounts();
            });
            return; // Завершаем выполнение, чтобы не сработал клик по карточке
        }

        // РЕДАКТИРОВАНИЕ
        const editBtn = e.target.closest('.edit-scene-btn');
        if (editBtn) {
            const card = editBtn.closest('.scene-card');
            const titleEl = card.querySelector('.scene-title-text');
            const metaEl = card.querySelector('.scene-meta-text');
            const descEl = card.querySelector('.scene-desc-text');

            const currentTitle = titleEl ? titleEl.innerText : '';
            const metaText = metaEl ? metaEl.innerText : 'НАТ. ЛОКАЦИЯ';

            let currentIntExt = metaText.includes('ИНТ.') ? 'ИНТ.' : 'НАТ.';
            let currentLoc = metaText.replace('ИНТ.', '').replace('НАТ.', '').trim();
            const currentDesc = descEl ? descEl.innerText : '';

            openSceneModal({
                isEdit: true,
                card: card,
                title: currentTitle,
                intExt: currentIntExt,
                loc: currentLoc,
                desc: currentDesc
            });
            return; // Завершаем выполнение, чтобы не сработал клик по карточке
        }

        // ПЕРЕХОД В РЕДАКТОР СЦЕНЫ
        const sceneCard = e.target.closest('.scene-card');
        if (sceneCard && !e.target.closest('.action-btn')) {
            const href = sceneCard.getAttribute('data-href') || 'scene.html';
            window.location.href = href;
            return;
        }

        // ДОБАВЛЕНИЕ НОВЫХ (Актов и Сцен)
        const actionBtn = e.target.closest('.action-btn');
        if (actionBtn) {
            const isAct = actionBtn.innerText.includes('Добавить акт');
            const isScene = actionBtn.innerText.includes('Добавить сцену');

            if (isAct) {
                e.preventDefault();
                openActModal();
            } else if (isScene) {
                e.preventDefault();
                openSceneModal({ isEdit: false, targetBtn: actionBtn });
            }
        }
    });

    // ==========================================
    // 3. ФУНКЦИИ МОДАЛЬНЫХ ОКОН
    // ==========================================
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0';
        overlay.style.width = '100%'; overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(48, 39, 28, 0.5)';
        overlay.style.zIndex = '1000'; overlay.style.display = 'flex';
        overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
        overlay.style.backdropFilter = 'blur(2px)';
        return overlay;
    }

    function getThemeColors() {
        const isDark = document.body.classList.contains('dark-theme');
        return {
            bg: isDark ? '#24211E' : '#FFFFFF',
            text: isDark ? '#F4E9D8' : '#1A1A1A',
            inputBg: isDark ? '#1A1816' : '#FFFFFF',
            border: isDark ? '#302B26' : '#E8DDC7'
        };
    }

    function openConfirmModal(message, onConfirm) {
        const overlay = createOverlay();
        const { bg, text, border } = getThemeColors();

        const modal = document.createElement('div');
        modal.className = 'card';
        modal.style.cssText = `width: 340px; padding: 24px; display: flex; flex-direction: column; gap: 20px; background: ${bg}; border: 1px solid ${border}; text-align: center;`;

        modal.innerHTML = `
            <h3 style="margin: 0; color: ${text}; font-size: 16px; line-height: 1.5; font-weight: 500;">${message}</h3>
            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 8px;">
                <button class="btn btn-secondary btn-sm modal-close" style="background:transparent; color:${text}; border-color:${border};">Отмена</button>
                <button class="btn btn-primary btn-sm modal-confirm" style="background:#904D30; border-color:#904D30;">Удалить</button>
            </div>
        `;

        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            onConfirm();
            overlay.remove();
        });

        modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function openActModal() {
        const overlay = createOverlay();
        const { bg, text, inputBg, border } = getThemeColors();

        const modal = document.createElement('div');
        modal.className = 'card';
        modal.style.cssText = `width: 420px; padding: 32px; display: flex; flex-direction: column; gap: 20px; background: ${bg}; border: 1px solid ${border};`;

        modal.innerHTML = `
            <h3 style="margin: 0; color: ${text}; font-size: 20px;">Новый акт</h3>
            <input type="text" id="act-title" class="form-input" placeholder="Название акта" style="background:${inputBg}; color:${text}; border-color:${border};" autofocus>
            <input type="text" id="act-desc" class="form-input" placeholder="Роль в сюжете (например, Кульминация)" style="background:${inputBg}; color:${text}; border-color:${border};">
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                <button class="btn btn-secondary btn-sm modal-close" style="background:transparent; color:${text}; border-color:${border};">Отмена</button>
                <button class="btn btn-primary btn-sm modal-save">Создать акт</button>
            </div>
        `;

        modal.querySelector('.modal-save').addEventListener('click', () => {
            const title = modal.querySelector('#act-title').value || 'Новый акт';
            const desc = modal.querySelector('#act-desc').value || 'Новый этап истории';

            const newCol = document.createElement('div');
            newCol.className = 'board-column';
            newCol.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <h3 class="meta-title" style="font-size: 15px; margin: 0; color: #1A1A1A;">${title}</h3>
                    <span style="font-size: 11px; color: #827568;">${desc} · 0 сцен</span>
                </div>
                <button class="btn btn-secondary btn-sm action-btn" style="border-style: dashed; width: 100%;">Добавить сцену</button>
            `;
            boardCanvas.appendChild(newCol);

            initDragAndDrop();
            overlay.remove();
        });

        modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function openSceneModal({ isEdit, card, targetBtn, title = '', intExt = 'НАТ.', loc = '', desc = '' }) {
        const overlay = createOverlay();
        const { bg, text, inputBg, border } = getThemeColors();

        const modal = document.createElement('div');
        modal.className = 'card';
        modal.style.cssText = `width: 420px; padding: 32px; display: flex; flex-direction: column; gap: 20px; background: ${bg}; border: 1px solid ${border};`;

        const headerText = isEdit ? 'Редактировать сцену' : 'Новая сцена';
        const btnText = isEdit ? 'Сохранить' : 'Добавить';

        modal.innerHTML = `
            <h3 style="margin: 0; color: ${text}; font-size: 20px;">${headerText}</h3>
            <input type="text" id="scene-title" class="form-input" placeholder="Название сцены" value="${title}" style="background:${inputBg}; color:${text}; border-color:${border};" autofocus>
            <div style="display: flex; gap: 16px;">
                <select id="scene-int-ext" class="form-select" style="flex:1; background:${inputBg}; color:${text}; border-color:${border};">
                    <option ${intExt === 'НАТ.' ? 'selected' : ''}>НАТ.</option>
                    <option ${intExt === 'ИНТ.' ? 'selected' : ''}>ИНТ.</option>
                </select>
                <input type="text" id="scene-loc" class="form-input" placeholder="Локация" value="${loc}" style="flex:2; background:${inputBg}; color:${text}; border-color:${border};">
            </div>
            <textarea id="scene-desc" class="form-input" placeholder="О чем эта сцена?" style="height: 80px; resize: none; background:${inputBg}; color:${text}; border-color:${border};">${desc}</textarea>
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
                <button class="btn btn-secondary btn-sm modal-close" style="background:transparent; color:${text}; border-color:${border};">Отмена</button>
                <button class="btn btn-primary btn-sm modal-save">${btnText}</button>
            </div>
        `;

        modal.querySelector('.modal-save').addEventListener('click', () => {
            const newTitle = modal.querySelector('#scene-title').value || 'Новая сцена';
            const newIntExt = modal.querySelector('#scene-int-ext').value;
            const newLoc = modal.querySelector('#scene-loc').value || 'Без локации';
            const newDesc = modal.querySelector('#scene-desc').value || '...';

            if (isEdit) {
                card.querySelector('.scene-title-text').innerText = newTitle;
                card.querySelector('.scene-meta-text').innerText = `${newIntExt} ${newLoc.toUpperCase()}`;
                card.querySelector('.scene-desc-text').innerText = newDesc;
            } else {
                const newCard = document.createElement('div');
                newCard.className = 'card scene-card';
                newCard.setAttribute('draggable', 'true');
                newCard.setAttribute('data-href', 'scene.html');

                newCard.innerHTML = `
                    <div class="scene-header">
                        <span class="scene-number">СЦЕНА НОВАЯ</span>
                        <div class="card-actions">
                            <span class="action-icon edit-scene-btn" title="Редактировать">✎</span>
                            <span class="action-icon delete-scene-btn" title="Удалить">🗑</span>
                            <span class="badge badge-accent" style="background:#E4EFE3; color:#3F745C;">Черновик</span>
                        </div>
                    </div>
                    <div>
                        <h4 class="scene-title-text" style="margin: 0; font-size: 15px; color: #1A1A1A; margin-bottom: 4px;">${newTitle}</h4>
                        <div class="scene-meta-text" style="font-size: 11px; color: #827568;">${newIntExt} ${newLoc.toUpperCase()}</div>
                    </div>
                    <p class="scene-desc-text" style="margin: 0; font-size: 12px; color: #4A3728; line-height: 1.4;">${newDesc}</p>
                `;

                const col = targetBtn.closest('.board-column');
                col.insertBefore(newCard, targetBtn);

                initDragAndDrop();
                updateSceneCounts();
            }

            overlay.remove();
        });

        modal.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
});