document.addEventListener('DOMContentLoaded', function() {
    // 1. Susirandame formą
    var contactForm = document.querySelector('.php-email-form') || document.querySelector('form');

    if (contactForm) {
        // 2. Generuojame formos HTML
        var formHTML = `
            <div class="row gy-4">
                <div class="col-md-6">
                    <label class="form-label">Vardas</label>
                    <input type="text" name="vardas" class="form-control" placeholder="Jūsų vardas">
                    <div class="validation-error" id="error-vardas"></div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Pavardė</label>
                    <input type="text" name="pavarde" class="form-control" placeholder="Jūsų pavardė">
                    <div class="validation-error" id="error-pavarde"></div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">El. paštas</label>
                    <input type="email" name="email" class="form-control" placeholder="pastas@pavyzdys.lt">
                    <div class="validation-error" id="error-email"></div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Telefono numeris</label>
                    <input type="tel" name="telefonas" class="form-control" placeholder="+370 6xx xxxxx">
                    <div class="validation-error" id="error-telefonas"></div>
                </div>
                <div class="col-12">
                    <label class="form-label">Adresas</label>
                    <input type="text" name="adresas" class="form-control" placeholder="Gatvė, Miestas">
                    <div class="validation-error" id="error-adresas"></div>
                </div>
                
                <div class="col-12">
                    <div class="rating-section">
                        <h5>Jūsų vertinimas</h5>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">1. Dizainas (1-10)</label>
                                <input type="number" name="vertinimas_dizainas" class="form-control" min="1" max="10" value="10">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">2. Aiškumas (1-10)</label>
                                <input type="number" name="vertinimas_aiskumas" class="form-control" min="1" max="10" value="10">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">3. Ar rekomenduotumėte? (Slankiklis)</label>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="fw-bold">1</span>
                                    <input type="range" name="vertinimas_rekomendacija" class="form-range" min="1" max="10" value="10">
                                    <span class="fw-bold">10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 text-center mt-3">
                    <!-- Mygtukas neaktyvus (disabled) iš pradžių -->
                    <button type="submit" class="btn btn-primary" id="submit-btn" disabled>Siųsti žinutę</button>
                </div>
            </div>
        `;

        contactForm.innerHTML = formHTML;

        // Kintamieji elementams
        const submitBtn = document.getElementById('submit-btn');
        const nameInput = contactForm.querySelector('input[name="vardas"]');
        const surnameInput = contactForm.querySelector('input[name="pavarde"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const phoneInput = contactForm.querySelector('input[name="telefonas"]');
        const addressInput = contactForm.querySelector('input[name="adresas"]');

        // Regex
        const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        // --- PAGALBINĖS FUNKCIJOS ---

        function showError(input, message) {
            var errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('validation-error')) {
                errorDiv.innerText = message;
                errorDiv.classList.add('active');
            }
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            
            checkFormValidity();
        }

        function clearError(input) {
            var errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('validation-error')) {
                errorDiv.classList.remove('active');
            }
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            
            checkFormValidity();
        }

        // --- MYGTUKO BŪSENOS TIKRINIMAS ---
        function checkFormValidity() {
            let isValid = true;

            const invalidInputs = contactForm.querySelectorAll('.is-invalid');
            if (invalidInputs.length > 0) {
                isValid = false;
            }

            if (nameInput.value.trim() === '') isValid = false;
            if (surnameInput.value.trim() === '') isValid = false;
            if (emailInput.value.trim() === '') isValid = false;
            if (addressInput.value.trim() === '') isValid = false;

            const rawPhone = phoneInput.value.replace(/\D/g, '');
            if (rawPhone.length !== 11) isValid = false;

            submitBtn.disabled = !isValid;
        }


        // --- ĮVYKIŲ KLAUSYTOJAI (LISTENERS) ---

        nameInput.addEventListener('input', function() {
            if (this.value.trim() === "") showError(this, "Vardas privalomas.");
            else if (!nameRegex.test(this.value)) showError(this, "Tik raidės.");
            else clearError(this);
        });

        surnameInput.addEventListener('input', function() {
            if (this.value.trim() === "") showError(this, "Pavardė privaloma.");
            else if (!nameRegex.test(this.value)) showError(this, "Tik raidės.");
            else clearError(this);
        });

        emailInput.addEventListener('input', function() {
            if (this.value.trim() === "") showError(this, "El. paštas privalomas.");
            else if (!emailRegex.test(this.value)) showError(this, "Neteisingas formatas.");
            else clearError(this);
        });

        addressInput.addEventListener('input', function() {
            if (this.value.trim() === "") showError(this, "Adresas privalomas.");
            else clearError(this);
        });

        phoneInput.addEventListener('input', function(e) {
            var rawValue = this.value.replace(/\D/g, '');
            
            if (rawValue.length === 0) {
                this.value = "";
                checkFormValidity();
                return;
            }

            if (!rawValue.startsWith('370')) {
                 if (rawValue.startsWith('86')) rawValue = '370' + rawValue.substring(1);
                 else if (rawValue.startsWith('6')) rawValue = '370' + rawValue;
                 else rawValue = '370' + rawValue;
            }

            if (rawValue.length > 11) rawValue = rawValue.substring(0, 11);

            var formattedValue = "";
            if (rawValue.length > 0) formattedValue = "+" + rawValue.substring(0, 3);
            if (rawValue.length >= 4) formattedValue += " " + rawValue.substring(3, 6);
            if (rawValue.length >= 7) formattedValue += " " + rawValue.substring(6, 11);

            this.value = formattedValue;

            if (rawValue.length === 11) {
                clearError(this);
            } else {
                this.classList.remove('is-valid');
                checkFormValidity();
            }
        });

        phoneInput.addEventListener('focus', function() {
            if (this.value === "") this.value = "+370 ";
        });
        
        phoneInput.addEventListener('blur', function() {
            var rawValue = this.value.replace(/\D/g, '');
            if (rawValue.length > 0 && rawValue.length < 11) {
                showError(this, "Numeris nebaigtas.");
            }
        });


        // --- SUBMIT LOGIKA ---
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var formData = {
                vardas: nameInput.value,
                pavarde: surnameInput.value,
                email: emailInput.value,
                telefonas: phoneInput.value,
                adresas: addressInput.value,
                dizainas: contactForm.querySelector('input[name="vertinimas_dizainas"]').value,
                aiskumas: contactForm.querySelector('input[name="vertinimas_aiskumas"]').value,
                rekomendacija: contactForm.querySelector('input[name="vertinimas_rekomendacija"]').value
            };

            // --- ČIA YRA PAKEITIMAS: Išvedame duomenis į konsolę ---
            console.log("------------------------------------------------");
            console.log("Sėkmingai pateikta forma. Gauti duomenys:");
            console.log(formData);
            console.log("------------------------------------------------");
            // -------------------------------------------------------

            var vidurkis = (parseInt(formData.dizainas) + parseInt(formData.aiskumas) + parseInt(formData.rekomendacija)) / 3;
            var suformatuotasVidurkis = vidurkis.toFixed(1);

            var resultsDiv = document.getElementById('submitted-results');
            if (!resultsDiv) {
                resultsDiv = document.createElement('div');
                resultsDiv.id = 'submitted-results';
                resultsDiv.style.marginTop = '30px';
                resultsDiv.style.padding = '25px';
                resultsDiv.style.border = '2px solid var(--accent-color)';
                resultsDiv.style.borderRadius = '10px';
                resultsDiv.style.backgroundColor = 'var(--surface-color)';
                contactForm.appendChild(resultsDiv);
            }

            resultsDiv.innerHTML = `
                <h3 style="color: var(--heading-color); margin-bottom: 20px;">✅ Duomenys sėkmingai gauti:</h3>
                <p><strong>Vardas:</strong> ${formData.vardas}</p>
                <p><strong>Pavardė:</strong> ${formData.pavarde}</p>
                <p><strong>El. paštas:</strong> ${formData.email}</p>
                <p><strong>Tel. Numeris:</strong> ${formData.telefonas}</p>
                <p><strong>Adresas:</strong> ${formData.adresas}</p>
                <hr style="opacity: 0.2; margin: 20px 0;">
                <div style="background-color: color-mix(in srgb, var(--accent-color), transparent 90%); padding: 15px; border-radius: 8px; border-left: 5px solid var(--accent-color);">
                    <h4 style="margin: 0; font-weight: bold; color: var(--default-color);">
                        ${formData.vardas} ${formData.pavarde}: ${suformatuotasVidurkis}
                    </h4>
                    <small style="color: gray;">(Vertinimų vidurkis)</small>
                </div>
            `;

            showSuccessPopup(); 
        });
    }

    // Pop-up funkcija
    function showSuccessPopup() {
        var popup = document.getElementById('custom-success-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'custom-success-popup';
            popup.className = 'popup-overlay';
            popup.innerHTML = `
                <div class="popup-content">
                    <div class="popup-icon">🎉</div>
                    <h2 style="color: var(--heading-color); margin-bottom: 10px;">Puiku!</h2>
                    <p style="font-size: 1.2rem; color: var(--default-color);">Duomenys pateikti sėkmingai!</p>
                    <button class="popup-close-btn">Uždaryti</button>
                </div>
            `;
            document.body.appendChild(popup);
            popup.querySelector('.popup-close-btn').addEventListener('click', function() {
                popup.classList.remove('active');
            });
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    popup.classList.remove('active');
                }
            });
        }
        setTimeout(function() {
            popup.classList.add('active');
        }, 10);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const moveDisplay = document.getElementById('moves');
    const matchDisplay = document.getElementById('matches');
    const winMessage = document.getElementById('win-message');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;

    // a. Išplėstas duomenų rinkinys (reikia bent 12 unikalių elementų sunkiam lygiui)
    const cardData = [
        { name: 'js', content: '📜' },
        { name: 'html', content: '🌐' },
        { name: 'css', content: '🎨' },
        { name: 'react', content: '⚛️' },
        { name: 'python', content: '🐍' },
        { name: 'database', content: '🗄️' },
        { name: 'git', content: '🐈' },
        { name: 'bug', content: '🐞' },
        { name: 'mobile', content: '📱' },
        { name: 'security', content: '🔒' },
        { name: 'cloud', content: '☁️' },  // Naujas
        { name: 'ai', content: '🤖' }      // Naujas
    ];

    // Funkcija žaidimo inicializavimui
    function initGame() {
        // b. ii. ir iii. Atstatoma būsena ir statistika
        gameBoard.innerHTML = ''; // Išvalome senas korteles (Constraint: nenaudojame atskirų lentų)
        winMessage.classList.add('hidden');
        moves = 0;
        matches = 0;
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
        updateStats();
        
        // Gauname pasirinktą porų skaičių (6 arba 12)
        totalPairs = parseInt(difficultySelect.value);
        
        // Dinamiškai nustatome tinklelio stulpelius pagal užduotį
        if (totalPairs === 6) {
            // Lengvas: 4x3 (12 kortelių) -> 4 stulpeliai
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            // Sunkus: 6x4 (24 kortelės) -> 6 stulpeliai
            gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
        }

        // b. i. Kortelių paruošimas ir permaišymas
        const selectedData = cardData.slice(0, totalPairs);
        const gameDeck = [...selectedData, ...selectedData];
        
        // Atsitiktinis maišymas
        gameDeck.sort(() => 0.5 - Math.random());

        // Kortelių generavimas
        gameDeck.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.framework = item.name;

            card.innerHTML = `
                <div class="front-face">${item.content}</div>
                <div class="back-face">?</div>
            `;
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // Kortelės atvertimas
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        incrementMoves();
        checkForMatch();
    }

    // Sutapimo tikrinimas
    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matches++;
        updateStats();
        resetBoard();
        checkWin();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function incrementMoves() {
        moves++;
        updateStats();
    }

    function updateStats() {
        moveDisplay.textContent = moves;
        matchDisplay.textContent = matches;
    }

    function checkWin() {
        if (matches === totalPairs) {
            winMessage.classList.remove('hidden');
            winMessage.querySelector('h3').textContent = `Sveikiname! Laimėjote per ${moves} ėjimus! 🎉`;
        }
    }

    // Įvykių klausikliai (Event Listeners)
    startBtn.addEventListener('click', initGame);
    resetBtn.addEventListener('click', initGame);
    
    // b. Pasikeitus sunkumo lygiui, lenta užkraunama iš naujo automatiškai
    difficultySelect.addEventListener('change', initGame);
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementai ---
    const gameBoard = document.getElementById('game-board');
    
    // Statistikos elementai (iš naujo HTML)
    const moveDisplay = document.getElementById('moves');
    const matchDisplay = document.getElementById('matches');
    const totalPairsDisplay = document.getElementById('total-pairs-display');
    const timeDisplay = document.getElementById('time');
    const bestScoreDisplay = document.getElementById('best-score');
    const bestTimeDisplay = document.getElementById('best-time');
    
    const winMessage = document.getElementById('win-message');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');

    // --- Kintamieji ---
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let totalPairs = 0;
    
    // Laikmatis
    let seconds = 0;
    let timerInterval = null;

    // Duomenys
    const cardData = [
        { name: 'js', content: '📜' },
        { name: 'html', content: '🌐' },
        { name: 'css', content: '🎨' },
        { name: 'react', content: '⚛️' },
        { name: 'python', content: '🐍' },
        { name: 'database', content: '🗄️' },
        { name: 'git', content: '🐈' },
        { name: 'bug', content: '🐞' },
        { name: 'mobile', content: '📱' },
        { name: 'security', content: '🔒' },
        { name: 'cloud', content: '☁️' },
        { name: 'ai', content: '🤖' }
    ];

    // --- Funkcijos ---

    // 1. Laikmačio valdymas
    function startTimer() {
        stopTimer(); 
        seconds = 0;
        timeDisplay.textContent = '0';
        timerInterval = setInterval(() => {
            seconds++;
            timeDisplay.textContent = seconds;
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // 2. Statistikos ir Rekordų atvaizdavimas
    function updateDashboard() {
        // Einamoji statistika
        moveDisplay.textContent = moves;
        matchDisplay.textContent = matches;
        totalPairsDisplay.textContent = difficultySelect.value; // Atnaujina "/ X" dalį
        
        // Rekordai iš localStorage
        const currentLevel = difficultySelect.value;
        const savedMoves = localStorage.getItem(`best-moves-${currentLevel}`);
        const savedTime = localStorage.getItem(`best-time-${currentLevel}`);

        bestScoreDisplay.textContent = savedMoves ? `${savedMoves} band.` : '-';
        bestTimeDisplay.textContent = savedTime ? `${savedTime}s` : '-';
    }

    // 3. Pradinis ekranas (be kortelių)
    function showWelcomeScreen() {
        stopTimer();
        gameBoard.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #555;">
                <h3>Pasiruošę mankštinti atmintį? 🧠</h3>
                <p>Pasirinkite sudėtingumo lygį ir spauskite <strong>Start</strong>!</p>
            </div>
        `;
        
        // Nunuliname statistiką
        moves = 0;
        matches = 0;
        seconds = 0;
        timeDisplay.textContent = '0';
        winMessage.classList.add('hidden');
        
        // Sutvarkome vaizdą
        gameBoard.style.gridTemplateColumns = '1fr'; 
        updateDashboard();
    }

    // 4. Žaidimo inicializavimas
    function initGame() {
        gameBoard.innerHTML = '';
        winMessage.classList.add('hidden');
        moves = 0;
        matches = 0;
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
        
        // Atnaujiname statistiką ir paleidžiame laiką
        updateDashboard();
        startTimer();
        
        totalPairs = parseInt(difficultySelect.value);
        
        // Tinklelis
        if (totalPairs === 6) {
            gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
        }

        // Kortelės
        const selectedData = cardData.slice(0, totalPairs);
        const gameDeck = [...selectedData, ...selectedData];
        gameDeck.sort(() => 0.5 - Math.random());

        gameDeck.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.framework = item.name;
            card.innerHTML = `
                <div class="front-face">${item.content}</div>
                <div class="back-face">?</div>
            `;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    // 5. Kortelių vartymas
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        moves++; // Bandymas skaičiuojamas tik po antros kortelės
        updateDashboard();
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matches++;
        updateDashboard();
        resetBoard();
        checkWin();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // 6. Laimėjimas ir Rekordai
    function checkWin() {
        if (matches === totalPairs) {
            stopTimer();
            winMessage.classList.remove('hidden');
            
            const currentLevel = difficultySelect.value;
            const movesKey = `best-moves-${currentLevel}`;
            const timeKey = `best-time-${currentLevel}`;
            
            const savedMoves = localStorage.getItem(movesKey);
            const savedTime = localStorage.getItem(timeKey);
            
            let message = `Sveikiname! Rezultatas: ${moves} band. per ${seconds} s. 🎉`;
            let isNewRecord = false;

            // Tikriname ėjimų rekordą
            if (!savedMoves || moves < parseInt(savedMoves)) {
                localStorage.setItem(movesKey, moves);
                message += `<br><strong>🏆 Naujas ėjimų rekordas!</strong>`;
                isNewRecord = true;
            }

            // Tikriname laiko rekordą
            if (!savedTime || seconds < parseInt(savedTime)) {
                localStorage.setItem(timeKey, seconds);
                message += `<br><strong>⚡ Naujas laiko rekordas!</strong>`;
                isNewRecord = true;
            }

            if (isNewRecord) updateDashboard();

            winMessage.innerHTML = `<h3>${message}</h3>`;
        }
    }

    // --- Įvykiai ---
    startBtn.addEventListener('click', initGame);
    resetBtn.addEventListener('click', initGame);
    
    difficultySelect.addEventListener('change', () => {
        showWelcomeScreen(); // Pakeitus lygį - grįžti į pradžią
    });

    // Pirmas užkrovimas
    showWelcomeScreen();
});