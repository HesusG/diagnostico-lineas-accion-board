// ==========================================
// CONSTANTS & INITIAL DATA
// ==========================================

const INITIAL_STUDENTS = [
    { name: "Patricio Almaguer González", id: "A01286908" },
    { name: "Grecia Dayan Basurto González", id: "A01198292" },
    { name: "José Alejandro Cárdenas López", id: "A01178064" },
    { name: "Valeria Carrillo Pastrana", id: "A01424037" },
    { name: "Mauricio Cortes Ortiz", id: "A01286052" },
    { name: "Raymundo Díaz Tijera", id: "A01664497" },
    { name: "Jimena Domínguez Carmona", id: "A01748895" },
    { name: "José Pablo Garza Albuerne", id: "A00837885" },
    { name: "Homero Hurtado Morales", id: "A01423928" },
    { name: "Hernan Alejandro Izurieta Acosta", id: "A00840990" },
    { name: "Ibrahim Mateos Campos", id: "A01174965" },
    { name: "Ana Sofía Miranda Salazar", id: "A01658417" },
    { name: "Ramiro Ochoa Loaiza", id: "A01640248" },
    { name: "Fernanda Patrón Tamez", id: "A01643495" },
    { name: "Federica Rigoletti Hossfeld", id: "A01783996" },
    { name: "Diego Pablo Ruiz Ramírez", id: "A01710766" }
];

const PARTICIPATION_TYPES = {
    RANDOM: { key: 'random', points: 1, label: 'Participación al Azar' },
    VOLUNTARY: { key: 'voluntary', points: 3, label: 'Participación Voluntaria' },
    INSIGHTFUL: { key: 'insightful', points: 1, label: 'Opinión Insightful' },
    TEAM_MVP: { key: 'team_mvp', points: 2, label: 'MVP Trabajo en Equipo' },
    // Legacy support for old data
    SUPPORT: { key: 'support', points: 2, label: 'MVP Trabajo en Equipo' }
};

const BADGE_TYPES = {
    TOP_PARTICIPANT: { icon: 'fa-trophy', color: 'text-yellow-500', title: 'Top Participante', description: 'Estudiante con más puntos' },
    CRITICAL_THINKER: { icon: 'fa-brain', color: 'text-purple-500', title: 'Pensador Crítico', description: 'Más opiniones insightful' },
    BRAVE: { icon: 'fa-bolt', color: 'text-red-500', title: 'Valiente', description: 'Primera mano voluntaria' },
    TEAM_MVP: { icon: 'fa-award', color: 'text-blue-600', title: 'MVP de Equipo', description: 'Más MVPs en trabajos grupales' },
    STREAK: { icon: 'fa-fire', color: 'text-orange-500', title: 'Racha Activa', description: '3+ días consecutivos' },
    WINNING_HOUSE: { icon: 'fa-crown', color: 'text-yellow-600', title: 'Casa Ganadora', description: 'Tu casa tiene más puntos' },
    EXCELLENCE: { icon: 'fa-star', color: 'text-yellow-400', title: 'Premio Excelencia', description: 'Top 25% de la clase' },
    CONSISTENT: { icon: 'fa-bullseye', color: 'text-blue-400', title: 'Premio Consistencia', description: 'Cerca de la media' },
    PROGRESS: { icon: 'fa-rocket', color: 'text-green-400', title: 'Premio En Progreso', description: 'Sigue participando' },
    // Special/Fun Badges
    SILENT: { icon: 'fa-user-slash', color: 'text-gray-500', title: 'Silencioso', description: '5 días sin participar' },
    QUALITY_OVER_QUANTITY: { icon: 'fa-comments', color: 'text-green-500', title: 'Habla Poco pero Voluntario', description: 'Pocas pero todas voluntarias' },
    COMEBACK_KID: { icon: 'fa-undo', color: 'text-orange-600', title: 'Come Back Kid', description: 'Regresó después de ausencia' },
    PERFECTIONIST: { icon: 'fa-gem', color: 'text-yellow-600', title: 'Perfeccionista', description: 'Solo participaciones voluntarias' },
    NIGHT_OWL: { icon: 'fa-moon', color: 'text-indigo-500', title: 'Noctámbulo', description: 'Última participación del día' }
};

const HOUSES = {
    FIRE: {
        key: 'fire',
        name: 'Fuego',
        icon: '🔥',
        color: '#EF4444',
        bgColor: 'bg-red-500',
        textColor: 'text-red-500',
        borderColor: 'border-red-500'
    },
    WATER: {
        key: 'water',
        name: 'Agua',
        icon: '💧',
        color: '#3B82F6',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-500',
        borderColor: 'border-blue-500'
    },
    EARTH: {
        key: 'earth',
        name: 'Tierra',
        icon: '🌿',
        color: '#10B981',
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
        borderColor: 'border-green-500'
    },
    AIR: {
        key: 'air',
        name: 'Aire',
        icon: '💨',
        color: '#6B7280',
        bgColor: 'bg-gray-500',
        textColor: 'text-gray-500',
        borderColor: 'border-gray-500'
    }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

let students = [];
let currentSort = 'points'; // 'points' or 'name'
let isAnimating = false;
let currentTab = 'individual'; // 'individual', 'teams', 'awards'

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFromLocalStorage();
    populateStudentSelect();
    renderCurrentTab();
    updateStats();
    attachEventListeners();
}

// ==========================================
// LOCAL STORAGE
// ==========================================

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('participationBoard');

    if (savedData) {
        try {
            students = JSON.parse(savedData);
        } catch (error) {
            console.error('Error loading data:', error);
            initializeStudents();
        }
    } else {
        initializeStudents();
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('participationBoard', JSON.stringify(students));
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error guardando los datos. Por favor verifica el espacio disponible.');
    }
}

function initializeStudents() {
    // Assign houses randomly but balanced
    const houseKeys = Object.values(HOUSES).map(h => h.key);
    const shuffledStudents = [...INITIAL_STUDENTS].sort(() => Math.random() - 0.5);

    students = shuffledStudents.map((student, index) => ({
        ...student,
        points: 0,
        participations: [],
        badges: [],
        house: houseKeys[index % houseKeys.length]
    }));

    saveToLocalStorage();
}

// ==========================================
// STUDENT SELECT POPULATION
// ==========================================

function populateStudentSelect() {
    const select = document.getElementById('studentSelect');
    select.innerHTML = '<option value="">-- Selecciona un estudiante --</option>';

    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${student.name} (${student.id})`;
        select.appendChild(option);
    });
}

// ==========================================
// RANDOM SELECTOR
// ==========================================

function selectRandomStudent() {
    if (isAnimating || students.length === 0) return;

    isAnimating = true;
    const randomBtn = document.getElementById('randomBtn');
    const randomName = document.getElementById('randomName');
    const randomId = document.getElementById('randomId');
    const randomDisplay = document.getElementById('randomDisplay');

    randomBtn.disabled = true;
    randomBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // Slot machine animation
    let iterations = 0;
    const maxIterations = 20;
    const intervalTime = 100;

    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * students.length);
        const student = students[randomIndex];

        randomName.textContent = student.name;
        randomId.textContent = student.id;

        // Add pulse animation
        randomDisplay.classList.add('scale-105');
        setTimeout(() => randomDisplay.classList.remove('scale-105'), 50);

        iterations++;

        if (iterations >= maxIterations) {
            clearInterval(interval);

            // Final selection
            const finalIndex = Math.floor(Math.random() * students.length);
            const finalStudent = students[finalIndex];

            randomName.textContent = finalStudent.name;
            randomId.textContent = finalStudent.id;

            // Celebration effect
            randomDisplay.classList.add('animate-bounce');
            setTimeout(() => randomDisplay.classList.remove('animate-bounce'), 1000);

            // Auto-assign 1 point for random participation
            addPoints(finalIndex, PARTICIPATION_TYPES.RANDOM.key, PARTICIPATION_TYPES.RANDOM.points);

            // Show success notification
            showNotification(`¡${finalStudent.name} ha sido seleccionado! (+1 pt)`, 'success');

            // Re-enable button
            setTimeout(() => {
                randomBtn.disabled = false;
                randomBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                isAnimating = false;
            }, 1500);
        }
    }, intervalTime);
}

// ==========================================
// POINTS MANAGEMENT
// ==========================================

function addPoints(studentIndex, type, points) {
    if (studentIndex === '' || studentIndex === null || studentIndex === undefined) {
        showNotification('Por favor selecciona un estudiante', 'error');
        return;
    }

    const student = students[studentIndex];
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Add participation
    student.participations.push({
        type: type,
        points: points,
        timestamp: now.getTime(),
        date: dateString
    });

    // Update points
    student.points += points;

    // Recalculate badges
    calculateAllBadges();

    // Save and update UI
    saveToLocalStorage();
    renderCurrentTab();
    updateStats();

    // Visual feedback
    highlightStudent(studentIndex);
}

function addPointsManually(type, points) {
    const selectElement = document.getElementById('studentSelect');
    const studentIndex = selectElement.value;

    if (studentIndex === '') {
        showNotification('Por favor selecciona un estudiante primero', 'error');
        return;
    }

    const student = students[studentIndex];
    addPoints(studentIndex, type, points);

    const typeLabel = Object.values(PARTICIPATION_TYPES).find(t => t.key === type)?.label || type;
    showNotification(`¡${student.name} ganó ${points} punto(s) por ${typeLabel}!`, 'success');
}

// ==========================================
// BADGE CALCULATION
// ==========================================

function calculateAllBadges() {
    // Reset all badges
    students.forEach(student => student.badges = []);

    // 1. Top Participant (highest points)
    const maxPoints = Math.max(...students.map(s => s.points));
    if (maxPoints > 0) {
        const topStudents = students.filter(s => s.points === maxPoints);
        topStudents.forEach(s => addBadge(s, 'TOP_PARTICIPANT'));
    }

    // 2. Critical Thinker (most insightful participations)
    const insightfulCounts = students.map(s => ({
        student: s,
        count: s.participations.filter(p => p.type === 'insightful').length
    }));
    const maxInsightful = Math.max(...insightfulCounts.map(c => c.count));
    if (maxInsightful > 0) {
        insightfulCounts
            .filter(c => c.count === maxInsightful)
            .forEach(c => addBadge(c.student, 'CRITICAL_THINKER'));
    }

    // 3. Brave (first voluntary participation of each unique day)
    const voluntaryByDate = {};
    students.forEach(student => {
        student.participations
            .filter(p => p.type === 'voluntary')
            .forEach(p => {
                if (!voluntaryByDate[p.date]) {
                    voluntaryByDate[p.date] = { student, timestamp: p.timestamp };
                } else if (p.timestamp < voluntaryByDate[p.date].timestamp) {
                    voluntaryByDate[p.date] = { student, timestamp: p.timestamp };
                }
            });
    });

    const braveStudents = new Set();
    Object.values(voluntaryByDate).forEach(entry => {
        braveStudents.add(entry.student);
    });
    braveStudents.forEach(student => {
        addBadge(student, 'BRAVE');
    });

    // 4. Team MVP (most MVP participations)
    const mvpCounts = students.map(s => ({
        student: s,
        count: s.participations.filter(p => p.type === 'team_mvp' || p.type === 'support').length
    }));
    const maxMvp = Math.max(...mvpCounts.map(c => c.count));
    if (maxMvp > 0) {
        mvpCounts
            .filter(c => c.count === maxMvp)
            .forEach(c => addBadge(c.student, 'TEAM_MVP'));
    }

    // 5. Streak (participated 3+ consecutive days)
    students.forEach(student => {
        if (hasActiveStreak(student)) {
            addBadge(student, 'STREAK');
        }
    });

    // 6. Winning House badge
    const teamStats = calculateTeamStats();
    if (teamStats.length > 0) {
        const maxTeamPoints = Math.max(...teamStats.map(t => t.points));
        if (maxTeamPoints > 0) {
            const winningHouses = teamStats.filter(t => t.points === maxTeamPoints).map(t => t.house);
            students.forEach(student => {
                if (winningHouses.includes(student.house)) {
                    addBadge(student, 'WINNING_HOUSE');
                }
            });
        }
    }

    // 7. Awards badges (Excellence, Consistent, Progress)
    calculateAwardsBadges();

    // 8. Special/Fun badges
    calculateSpecialBadges();
}

function hasActiveStreak(student) {
    if (student.participations.length < 3) return false;

    // Get unique dates sorted
    const uniqueDates = [...new Set(student.participations.map(p => p.date))].sort();

    if (uniqueDates.length < 3) return false;

    // Check for 3 consecutive days
    for (let i = 0; i <= uniqueDates.length - 3; i++) {
        const date1 = new Date(uniqueDates[i]);
        const date2 = new Date(uniqueDates[i + 1]);
        const date3 = new Date(uniqueDates[i + 2]);

        const diff1 = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        const diff2 = Math.floor((date3 - date2) / (1000 * 60 * 60 * 24));

        if (diff1 === 1 && diff2 === 1) {
            return true;
        }
    }

    return false;
}

// Helper function to add badge with date
function addBadge(student, badgeType) {
    // Check if badge already exists
    const existingBadge = student.badges.find(b =>
        (typeof b === 'string' ? b : b.type) === badgeType
    );

    if (!existingBadge) {
        student.badges.push({
            type: badgeType,
            earnedDate: Date.now(),
            displayDate: new Date().toLocaleDateString('es-MX')
        });
    }
}

// Helper to check if student has badge
function hasBadge(student, badgeType) {
    return student.badges.some(b =>
        (typeof b === 'string' ? b : b.type) === badgeType
    );
}

// ==========================================
// SPECIAL BADGES CALCULATION
// ==========================================

function calculateSpecialBadges() {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    students.forEach(student => {
        if (student.participations.length === 0) return;

        const sortedParticipations = [...student.participations].sort((a, b) => a.timestamp - b.timestamp);
        const randomCount = student.participations.filter(p => p.type === 'random').length;
        const voluntaryCount = student.participations.filter(p => p.type === 'voluntary').length;
        const totalCount = student.participations.length;

        // 1. SILENT: 5 días consecutivos sin participar (si ha participado antes)
        const lastParticipation = Math.max(...student.participations.map(p => p.timestamp));
        const daysSinceLastParticipation = Math.floor((now - lastParticipation) / ONE_DAY);

        if (daysSinceLastParticipation >= 5 && totalCount > 0) {
            addBadge(student, 'SILENT');
        }

        // 2. QUALITY_OVER_QUANTITY: ≤3 participaciones, todas voluntarias
        if (totalCount <= 3 && totalCount > 0 && voluntaryCount === totalCount) {
            addBadge(student, 'QUALITY_OVER_QUANTITY');
        }

        // 3. COMEBACK_KID: Ausencia de 7+ días, luego regresó
        if (sortedParticipations.length >= 2) {
            for (let i = 1; i < sortedParticipations.length; i++) {
                const gap = sortedParticipations[i].timestamp - sortedParticipations[i-1].timestamp;
                const gapDays = Math.floor(gap / ONE_DAY);
                if (gapDays >= 7) {
                    addBadge(student, 'COMEBACK_KID');
                    break;
                }
            }
        }

        // 4. PERFECTIONIST: 5+ participaciones, TODAS voluntarias (0 al azar)
        if (totalCount >= 5 && randomCount === 0) {
            addBadge(student, 'PERFECTIONIST');
        }

        // 5. NIGHT_OWL: Última participación del día (3+ veces)
        const participationsByDate = {};
        student.participations.forEach(p => {
            if (!participationsByDate[p.date]) {
                participationsByDate[p.date] = [];
            }
            participationsByDate[p.date].push(p);
        });

        let lastOfDayCount = 0;
        Object.keys(participationsByDate).forEach(date => {
            const dayParticipations = participationsByDate[date];
            // Get all participations for this date from all students
            const allDayParticipations = students.flatMap(s =>
                s.participations.filter(p => p.date === date)
            );
            const latestTimestamp = Math.max(...allDayParticipations.map(p => p.timestamp));

            // Check if this student has the latest participation of the day
            if (dayParticipations.some(p => p.timestamp === latestTimestamp)) {
                lastOfDayCount++;
            }
        });

        if (lastOfDayCount >= 3) {
            addBadge(student, 'NIGHT_OWL');
        }
    });
}

// ==========================================
// TEAM STATISTICS
// ==========================================

function calculateTeamStats() {
    const houseKeys = Object.values(HOUSES).map(h => h.key);
    return houseKeys.map(houseKey => {
        const houseStudents = students.filter(s => s.house === houseKey);
        const points = houseStudents.reduce((sum, s) => sum + s.points, 0);
        const participations = houseStudents.reduce((sum, s) => sum + s.participations.length, 0);
        const house = Object.values(HOUSES).find(h => h.key === houseKey);

        return {
            house: houseKey,
            houseName: house.name,
            houseIcon: house.icon,
            houseData: house,
            points,
            participations,
            studentCount: houseStudents.length,
            students: houseStudents
        };
    }).sort((a, b) => b.points - a.points);
}

// ==========================================
// STATISTICAL CALCULATIONS
// ==========================================

function calculateStatistics() {
    if (students.length === 0) {
        return {
            mean: 0,
            stdDev: 0,
            min: 0,
            max: 0,
            q1: 0,
            median: 0,
            q3: 0
        };
    }

    const points = students.map(s => s.points).sort((a, b) => a - b);
    const n = points.length;

    // Mean
    const mean = points.reduce((sum, p) => sum + p, 0) / n;

    // Standard Deviation
    const squaredDiffs = points.map(p => Math.pow(p - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / n;
    const stdDev = Math.sqrt(variance);

    // Min and Max
    const min = points[0];
    const max = points[n - 1];

    // Quartiles
    const q1 = calculatePercentile(points, 25);
    const median = calculatePercentile(points, 50);
    const q3 = calculatePercentile(points, 75);

    return {
        mean: mean.toFixed(2),
        stdDev: stdDev.toFixed(2),
        min,
        max,
        q1,
        median,
        q3
    };
}

function calculatePercentile(sortedArray, percentile) {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (lower === upper) {
        return sortedArray[lower];
    }

    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
}

// ==========================================
// AWARDS CALCULATION
// ==========================================

function calculateAwardsBadges() {
    const stats = calculateStatistics();
    const mean = parseFloat(stats.mean);
    const stdDev = parseFloat(stats.stdDev);

    // 1. Excellence Award (Top 25% - Q3 and above)
    if (stats.q3 > 0) {
        students.forEach(student => {
            if (student.points >= stats.q3) {
                addBadge(student, 'EXCELLENCE');
            }
        });
    }

    // 2. Consistent Award (±0.5 standard deviations from mean)
    const lowerBound = mean - (0.5 * stdDev);
    const upperBound = mean + (0.5 * stdDev);

    students.forEach(student => {
        if (student.points >= lowerBound && student.points <= upperBound && student.participations.length > 0) {
            // Don't give if they already have Excellence badge
            if (!hasBadge(student, 'EXCELLENCE')) {
                addBadge(student, 'CONSISTENT');
            }
        }
    });

    // 3. Progress Award (Bottom 25% but with at least 1 participation)
    if (stats.q1 >= 0) {
        students.forEach(student => {
            if (student.points <= stats.q1 && student.points < mean && student.participations.length > 0) {
                // Don't give if they already have other awards
                if (!hasBadge(student, 'EXCELLENCE') && !hasBadge(student, 'CONSISTENT')) {
                    addBadge(student, 'PROGRESS');
                }
            }
        });
    }
}

function getAwardWinners() {
    const stats = calculateStatistics();
    const mean = parseFloat(stats.mean);
    const stdDev = parseFloat(stats.stdDev);

    const excellence = students.filter(s => s.points >= stats.q3).map(s => ({
        ...s,
        reason: `${s.points} pts (≥ Q3: ${stats.q3})`
    }));

    const lowerBound = mean - (0.5 * stdDev);
    const upperBound = mean + (0.5 * stdDev);
    const consistent = students.filter(s =>
        s.points >= lowerBound &&
        s.points <= upperBound &&
        s.participations.length > 0 &&
        !excellence.some(e => e.id === s.id)
    ).map(s => ({
        ...s,
        reason: `${s.points} pts (${lowerBound.toFixed(1)} - ${upperBound.toFixed(1)})`
    }));

    const progress = students.filter(s =>
        s.points <= stats.q1 &&
        s.points < mean &&
        s.participations.length > 0 &&
        !excellence.some(e => e.id === s.id) &&
        !consistent.some(c => c.id === s.id)
    ).map(s => ({
        ...s,
        reason: `${s.points} pts, sigue adelante!`
    }));

    return {
        excellence,
        consistent,
        progress,
        stats
    };
}

// ==========================================
// TABLE RENDERING
// ==========================================

function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    // Sort students
    const sortedStudents = [...students].sort((a, b) => {
        if (currentSort === 'points') {
            return b.points - a.points;
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    sortedStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        row.id = `student-row-${students.indexOf(student)}`;

        // Rank
        const rankCell = document.createElement('td');
        rankCell.className = 'px-6 py-4 whitespace-nowrap';
        if (currentSort === 'points' && index < 3 && student.points > 0) {
            const medals = ['🥇', '🥈', '🥉'];
            rankCell.innerHTML = `<span class="text-2xl">${medals[index]}</span>`;
        } else {
            rankCell.innerHTML = `<span class="text-gray-500 font-medium">${index + 1}</span>`;
        }

        // Name with house indicator
        const nameCell = document.createElement('td');
        nameCell.className = 'px-6 py-4 whitespace-nowrap';
        const houseData = Object.values(HOUSES).find(h => h.key === student.house);
        const houseIcon = houseData ? houseData.icon : '';
        nameCell.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="text-xl" title="Casa ${houseData?.name}">${houseIcon}</span>
                <div class="text-sm font-medium text-gray-900">${student.name}</div>
            </div>
        `;

        // ID
        const idCell = document.createElement('td');
        idCell.className = 'px-6 py-4 whitespace-nowrap';
        idCell.innerHTML = `<div class="text-sm text-gray-600">${student.id}</div>`;

        // Points
        const pointsCell = document.createElement('td');
        pointsCell.className = 'px-6 py-4 whitespace-nowrap text-center';
        pointsCell.innerHTML = `
            <span class="inline-flex items-center justify-center px-4 py-2 rounded-full text-lg font-bold bg-blue-100 text-blue-800">
                ${student.points}
            </span>
        `;

        // Participations count
        const participationsCell = document.createElement('td');
        participationsCell.className = 'px-6 py-4 whitespace-nowrap text-center';
        participationsCell.innerHTML = `
            <span class="text-sm text-gray-600 font-medium">
                ${student.participations.length}
            </span>
        `;

        // Badges
        const badgesCell = document.createElement('td');
        badgesCell.className = 'px-6 py-4 whitespace-nowrap text-center';
        badgesCell.innerHTML = renderBadges(student.badges);

        // Quick Actions buttons
        const actionsCell = document.createElement('td');
        actionsCell.className = 'px-6 py-4 whitespace-nowrap text-center';
        const actualIndex = students.indexOf(student);
        actionsCell.innerHTML = `
            <div class="flex items-center justify-center space-x-1">
                <button onclick="addPoints(${actualIndex}, 'random', 1)"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-all"
                        title="Participación al Azar +1pt">
                    <i class="fas fa-dice text-xs"></i>
                </button>
                <button onclick="addPoints(${actualIndex}, 'voluntary', 3)"
                        class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-all"
                        title="Participación Voluntaria +3pts">
                    <i class="fas fa-hand-paper text-xs"></i>
                </button>
                <button onclick="addPoints(${actualIndex}, 'insightful', 1)"
                        class="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs transition-all"
                        title="Opinión Insightful +1pt">
                    <i class="fas fa-lightbulb text-xs"></i>
                </button>
                <button onclick="addPoints(${actualIndex}, 'team_mvp', 2)"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-all"
                        title="MVP Trabajo en Equipo +2pts">
                    <i class="fas fa-award text-xs"></i>
                </button>
                <button onclick="openStudentModal(${actualIndex})"
                        class="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs transition-all"
                        title="Ver Perfil">
                    <i class="fas fa-eye text-xs"></i>
                </button>
            </div>
        `;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(idCell);
        row.appendChild(pointsCell);
        row.appendChild(participationsCell);
        row.appendChild(badgesCell);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function renderBadges(badges) {
    if (!badges || badges.length === 0) {
        return '<span class="text-gray-400 text-sm">-</span>';
    }

    return badges.map(badgeData => {
        // Handle both old format (string) and new format (object)
        const badgeType = typeof badgeData === 'string' ? badgeData : badgeData.type;
        const badge = BADGE_TYPES[badgeType];
        if (!badge) return '';

        return `
            <span class="inline-block mx-1" title="${badge.title}">
                <i class="fas ${badge.icon} ${badge.color} text-xl"></i>
            </span>
        `;
    }).join('');
}

// ==========================================
// TAB NAVIGATION
// ==========================================

function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    const tabs = ['individual', 'teams', 'awards', 'config'];
    tabs.forEach(tab => {
        const btn = document.getElementById(`tab-${tab}`);
        if (btn) {
            if (tab === tabName) {
                btn.className = 'tab-btn active px-6 py-3 font-semibold rounded-lg transition-all';
            } else {
                btn.className = 'tab-btn px-6 py-3 font-semibold rounded-lg transition-all';
            }
        }
    });

    // Render current tab
    renderCurrentTab();
}

function renderCurrentTab() {
    // Hide all tab contents
    const individualTab = document.getElementById('individual-tab');
    const teamsTab = document.getElementById('teams-tab');
    const awardsTab = document.getElementById('awards-tab');
    const configTab = document.getElementById('config-tab');

    if (individualTab) individualTab.style.display = 'none';
    if (teamsTab) teamsTab.style.display = 'none';
    if (awardsTab) awardsTab.style.display = 'none';
    if (configTab) configTab.style.display = 'none';

    // Show current tab
    if (currentTab === 'individual') {
        if (individualTab) individualTab.style.display = 'block';
        renderTable();
    } else if (currentTab === 'teams') {
        if (teamsTab) teamsTab.style.display = 'block';
        renderTeamsTab();
    } else if (currentTab === 'awards') {
        if (awardsTab) awardsTab.style.display = 'block';
        renderAwardsTab();
    } else if (currentTab === 'config') {
        if (configTab) configTab.style.display = 'block';
        renderHouseConfig();
    }
}

function renderTeamsTab() {
    const teamStats = calculateTeamStats();
    const teamsContainer = document.getElementById('teamsContainer');

    if (!teamsContainer) return;

    let html = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    `;

    teamStats.forEach((team, index) => {
        const rankMedals = ['🥇', '🥈', '🥉', '4️⃣'];
        const medal = index < 4 ? rankMedals[index] : '';

        html += `
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 ${team.houseData.borderColor}">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <span class="text-4xl">${team.houseIcon}</span>
                        <div>
                            <h3 class="text-2xl font-bold ${team.houseData.textColor}">Casa ${team.houseName}</h3>
                            <p class="text-gray-600 text-sm">${team.studentCount} estudiantes</p>
                        </div>
                    </div>
                    <span class="text-4xl">${medal}</span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                        <p class="text-3xl font-bold ${team.houseData.textColor}">${team.points}</p>
                        <p class="text-sm text-gray-600">Puntos Totales</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4 text-center">
                        <p class="text-3xl font-bold ${team.houseData.textColor}">${team.participations}</p>
                        <p class="text-sm text-gray-600">Participaciones</p>
                    </div>
                </div>

                <div class="border-t pt-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Miembros:</p>
                    <div class="space-y-1">
                        ${team.students.map(s => `
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-700">${s.name}</span>
                                <span class="font-semibold ${team.houseData.textColor}">${s.points} pts</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    teamsContainer.innerHTML = html;
}

function renderAwardsTab() {
    const awards = getAwardWinners();
    const awardsContainer = document.getElementById('awardsContainer');

    if (!awardsContainer) return;

    const stats = awards.stats;

    let html = `
        <!-- Statistical Summary -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">
                <i class="fas fa-chart-bar mr-2 text-blue-600"></i>
                Análisis Estadístico
            </h3>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-blue-600">${stats.mean}</p>
                    <p class="text-sm text-gray-600">Media (μ)</p>
                </div>
                <div class="bg-purple-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-purple-600">${stats.stdDev}</p>
                    <p class="text-sm text-gray-600">Desv. Estándar (σ)</p>
                </div>
                <div class="bg-green-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-green-600">${stats.median}</p>
                    <p class="text-sm text-gray-600">Mediana</p>
                </div>
                <div class="bg-orange-50 rounded-lg p-4 text-center">
                    <p class="text-2xl font-bold text-orange-600">${stats.min} - ${stats.max}</p>
                    <p class="text-sm text-gray-600">Rango</p>
                </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-700"><strong>Q1 (25%):</strong> ${stats.q1} pts | <strong>Q2 (50%):</strong> ${stats.median} pts | <strong>Q3 (75%):</strong> ${stats.q3} pts</p>
            </div>
        </div>

        <!-- Awards Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    `;

    // Excellence Award
    html += `
        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-yellow-400">
            <div class="text-center mb-4">
                <i class="fas fa-star text-5xl text-yellow-400 mb-2"></i>
                <h3 class="text-xl font-bold text-gray-800">Premio Excelencia</h3>
                <p class="text-sm text-gray-600">Top 25% (≥ Q3: ${stats.q3} pts)</p>
            </div>

            <div class="space-y-3">
                ${awards.excellence.length > 0 ? awards.excellence.map(s => `
                    <div class="bg-yellow-50 rounded-lg p-3">
                        <p class="font-semibold text-gray-800">${s.name}</p>
                        <p class="text-sm text-gray-600">${s.reason}</p>
                    </div>
                `).join('') : '<p class="text-center text-gray-500 text-sm">Aún no hay ganadores</p>'}
            </div>
        </div>
    `;

    // Consistent Award
    const mean = parseFloat(stats.mean);
    const stdDev = parseFloat(stats.stdDev);
    const lowerBound = (mean - 0.5 * stdDev).toFixed(1);
    const upperBound = (mean + 0.5 * stdDev).toFixed(1);

    html += `
        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-400">
            <div class="text-center mb-4">
                <i class="fas fa-bullseye text-5xl text-blue-400 mb-2"></i>
                <h3 class="text-xl font-bold text-gray-800">Premio Consistencia</h3>
                <p class="text-sm text-gray-600">±0.5σ de media (${lowerBound} - ${upperBound} pts)</p>
            </div>

            <div class="space-y-3">
                ${awards.consistent.length > 0 ? awards.consistent.map(s => `
                    <div class="bg-blue-50 rounded-lg p-3">
                        <p class="font-semibold text-gray-800">${s.name}</p>
                        <p class="text-sm text-gray-600">${s.reason}</p>
                    </div>
                `).join('') : '<p class="text-center text-gray-500 text-sm">Aún no hay ganadores</p>'}
            </div>
        </div>
    `;

    // Progress Award
    html += `
        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-400">
            <div class="text-center mb-4">
                <i class="fas fa-rocket text-5xl text-green-400 mb-2"></i>
                <h3 class="text-xl font-bold text-gray-800">Premio En Progreso</h3>
                <p class="text-sm text-gray-600">¡Sigue participando!</p>
            </div>

            <div class="space-y-3">
                ${awards.progress.length > 0 ? awards.progress.map(s => `
                    <div class="bg-green-50 rounded-lg p-3">
                        <p class="font-semibold text-gray-800">${s.name}</p>
                        <p class="text-sm text-gray-600">${s.reason}</p>
                    </div>
                `).join('') : '<p class="text-center text-gray-500 text-sm">Aún no hay ganadores</p>'}
            </div>
        </div>
    `;

    html += `</div>`;

    awardsContainer.innerHTML = html;
}

// ==========================================
// STATISTICS
// ==========================================

function updateStats() {
    const totalParticipations = students.reduce((sum, s) => sum + s.participations.length, 0);
    const totalPoints = students.reduce((sum, s) => sum + s.points, 0);
    const activeStudents = students.filter(s => s.participations.length > 0).length;
    const totalBadges = students.reduce((sum, s) => sum + s.badges.length, 0);

    document.getElementById('totalParticipations').textContent = totalParticipations;
    document.getElementById('totalPoints').textContent = totalPoints;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('totalBadges').textContent = totalBadges;
}

// ==========================================
// SORTING
// ==========================================

function sortByPoints() {
    currentSort = 'points';
    updateSortButtons();
    renderTable();
}

function sortByName() {
    currentSort = 'name';
    updateSortButtons();
    renderTable();
}

function updateSortButtons() {
    const pointsBtn = document.getElementById('sortByPoints');
    const nameBtn = document.getElementById('sortByName');

    if (currentSort === 'points') {
        pointsBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg font-medium transition-all';
        nameBtn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all';
    } else {
        pointsBtn.className = 'px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all';
        nameBtn.className = 'px-4 py-2 bg-blue-500 text-white rounded-lg font-medium transition-all';
    }
}

// ==========================================
// VISUAL EFFECTS
// ==========================================

function highlightStudent(studentIndex) {
    const row = document.getElementById(`student-row-${studentIndex}`);
    if (row) {
        row.classList.add('bg-green-100', 'scale-105', 'shadow-lg');
        setTimeout(() => {
            row.classList.remove('bg-green-100', 'scale-105', 'shadow-lg');
        }, 1000);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl transform transition-all duration-500 translate-x-0`;

    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('animate-pulse');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
        `;

        confettiContainer.appendChild(confetti);

        // Animate
        const duration = 2000 + Math.random() * 2000;
        const fallDistance = window.innerHeight + 100;

        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${fallDistance}px) rotate(${360 * (1 + Math.random())}deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => {
            confettiContainer.removeChild(confetti);
        }, duration);
    }
}

// ==========================================
// STUDENT MODAL
// ==========================================

function openStudentModal(studentIndex) {
    const student = students[studentIndex];
    const modal = document.getElementById('studentModal');
    const modalContent = document.getElementById('modalContent');

    if (!modal || !modalContent) return;

    modalContent.innerHTML = renderStudentModal(student, studentIndex);
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Animate in
    setTimeout(() => {
        modal.querySelector('.modal-card').classList.add('scale-in');
    }, 10);
}

function closeStudentModal() {
    const modal = document.getElementById('studentModal');
    if (!modal) return;

    const modalCard = modal.querySelector('.modal-card');
    if (modalCard) {
        modalCard.classList.remove('scale-in');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

function getStudentStats(student, studentIndex) {
    const stats = calculateStatistics();
    const mean = parseFloat(stats.mean);

    // Calculate ranking
    const sortedByPoints = [...students].sort((a, b) => b.points - a.points);
    const rank = sortedByPoints.findIndex(s => s.id === student.id) + 1;

    // House ranking
    const houseStudents = students.filter(s => s.house === student.house);
    const sortedHouse = [...houseStudents].sort((a, b) => b.points - a.points);
    const houseRank = sortedHouse.findIndex(s => s.id === student.id) + 1;

    // Comparison with mean
    const diffFromMean = student.points - mean;
    const percentDiff = mean > 0 ? ((diffFromMean / mean) * 100).toFixed(1) : 0;

    // Participation rate
    const totalParticipations = students.reduce((sum, s) => sum + s.participations.length, 0);
    const avgParticipations = totalParticipations / students.length;
    const participationRate = avgParticipations > 0
        ? ((student.participations.length / avgParticipations) * 100).toFixed(0)
        : 0;

    // Quartile
    let quartile = '';
    if (student.points >= stats.q3) quartile = 'Cuartil Superior (Top 25%)';
    else if (student.points >= stats.median) quartile = 'Cuartil Medio-Alto';
    else if (student.points >= stats.q1) quartile = 'Cuartil Medio-Bajo';
    else quartile = 'Cuartil Inferior';

    return {
        rank,
        houseRank,
        mean,
        diffFromMean,
        percentDiff,
        participationRate,
        quartile,
        stats
    };
}

function renderStudentModal(student, studentIndex) {
    const stats = getStudentStats(student, studentIndex);
    const houseData = Object.values(HOUSES).find(h => h.key === student.house);

    // Sort participations by timestamp (most recent first)
    const sortedParticipations = [...student.participations].sort((a, b) => b.timestamp - a.timestamp);

    // Group badges by date
    const badgesWithDates = student.badges.map(b => {
        const badgeType = typeof b === 'string' ? b : b.type;
        const earnedDate = typeof b === 'object' ? b.displayDate : 'N/A';
        return { type: badgeType, date: earnedDate };
    });

    const html = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
                <button onclick="closeStudentModal()" class="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl">
                    <i class="fas fa-times"></i>
                </button>
                <div class="flex items-center space-x-4">
                    <span class="text-6xl">${houseData.icon}</span>
                    <div>
                        <h2 class="text-3xl font-bold">${student.name}</h2>
                        <p class="text-blue-100">${student.id} | Casa ${houseData.name}</p>
                    </div>
                </div>
            </div>

            <!-- Content (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-6">

                <!-- Stats Overview -->
                <section class="mb-6">
                    <h3 class="text-xl font-bold mb-4 text-gray-800"><i class="fas fa-chart-bar mr-2"></i>Estadísticas Generales</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-blue-50 rounded-lg p-4 text-center">
                            <p class="text-3xl font-bold text-blue-600">${student.points}</p>
                            <p class="text-sm text-gray-600">Puntos Totales</p>
                        </div>
                        <div class="bg-green-50 rounded-lg p-4 text-center">
                            <p class="text-3xl font-bold text-green-600">#${stats.rank}</p>
                            <p class="text-sm text-gray-600">Ranking General</p>
                        </div>
                        <div class="bg-purple-50 rounded-lg p-4 text-center">
                            <p class="text-3xl font-bold text-purple-600">#${stats.houseRank}</p>
                            <p class="text-sm text-gray-600">En su Casa</p>
                        </div>
                        <div class="bg-yellow-50 rounded-lg p-4 text-center">
                            <p class="text-3xl font-bold text-yellow-600">${student.participations.length}</p>
                            <p class="text-sm text-gray-600">Participaciones</p>
                        </div>
                    </div>
                </section>

                <!-- Comparison with Class -->
                <section class="mb-6">
                    <h3 class="text-xl font-bold mb-4 text-gray-800"><i class="fas fa-balance-scale mr-2"></i>Comparación con la Clase</h3>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p class="text-sm text-gray-600">Tu puntuación</p>
                                <p class="text-2xl font-bold text-gray-800">${student.points} pts</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Media de la clase</p>
                                <p class="text-2xl font-bold text-gray-800">${stats.mean} pts</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Diferencia</p>
                                <p class="text-2xl font-bold ${stats.diffFromMean >= 0 ? 'text-green-600' : 'text-red-600'}">
                                    ${stats.diffFromMean >= 0 ? '+' : ''}${stats.diffFromMean.toFixed(1)} pts (${stats.percentDiff >= 0 ? '+' : ''}${stats.percentDiff}%)
                                </p>
                            </div>
                        </div>
                        <div class="mb-2">
                            <p class="text-sm text-gray-600 mb-1">${stats.quartile}</p>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                                     style="width: ${(student.points / stats.stats.max * 100)}%"></div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 mt-2">Tasa de participación: ${stats.participationRate}% del promedio</p>
                    </div>
                </section>

                <!-- Badges -->
                <section class="mb-6">
                    <h3 class="text-xl font-bold mb-4 text-gray-800"><i class="fas fa-medal mr-2"></i>Badges Desbloqueados (${badgesWithDates.length})</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        ${badgesWithDates.length > 0 ? badgesWithDates.map(b => {
                            const badge = BADGE_TYPES[b.type];
                            if (!badge) return '';
                            return `
                                <div class="bg-white border-2 border-gray-200 rounded-lg p-3 text-center hover:shadow-md transition-all">
                                    <i class="fas ${badge.icon} ${badge.color} text-3xl mb-2"></i>
                                    <p class="text-xs font-semibold text-gray-800">${badge.title}</p>
                                    <p class="text-xs text-gray-500 mt-1">${b.date}</p>
                                </div>
                            `;
                        }).join('') : '<p class="text-gray-500 text-sm col-span-full text-center">Aún no hay badges desbloqueados</p>'}
                    </div>
                </section>

                <!-- Timeline -->
                <section>
                    <h3 class="text-xl font-bold mb-4 text-gray-800"><i class="fas fa-history mr-2"></i>Línea de Tiempo</h3>
                    <div class="space-y-4">
                        ${sortedParticipations.length > 0 ? sortedParticipations.map((p, index) => {
                            const typeInfo = Object.values(PARTICIPATION_TYPES).find(t => t.key === p.type);
                            const date = new Date(p.timestamp);
                            const timeStr = date.toLocaleString('es-MX', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            });

                            const icons = {
                                random: 'fa-dice',
                                voluntary: 'fa-hand-paper',
                                insightful: 'fa-lightbulb',
                                team_mvp: 'fa-award',
                                support: 'fa-award' // Legacy support
                            };
                            const colors = {
                                random: 'bg-gray-100 text-gray-700',
                                voluntary: 'bg-green-100 text-green-700',
                                insightful: 'bg-purple-100 text-purple-700',
                                team_mvp: 'bg-blue-100 text-blue-700',
                                support: 'bg-blue-100 text-blue-700' // Legacy support
                            };

                            return `
                                <div class="flex items-start space-x-3">
                                    <div class="flex flex-col items-center">
                                        <div class="${colors[p.type]} rounded-full w-10 h-10 flex items-center justify-center">
                                            <i class="fas ${icons[p.type]}"></i>
                                        </div>
                                        ${index < sortedParticipations.length - 1 ? '<div class="w-0.5 h-12 bg-gray-300"></div>' : ''}
                                    </div>
                                    <div class="flex-1 pb-4">
                                        <p class="text-sm text-gray-500">${timeStr}</p>
                                        <p class="font-semibold text-gray-800">${typeInfo ? typeInfo.label : p.type}</p>
                                        <p class="text-sm text-gray-600">+${p.points} punto${p.points > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            `;
                        }).join('') : '<p class="text-gray-500 text-sm text-center">No hay participaciones registradas</p>'}
                    </div>
                </section>

            </div>
        </div>
    `;

    return html;
}

// ==========================================
// RESET FUNCTIONALITY
// ==========================================

function resetData() {
    if (confirm('⚠️ ¿Estás seguro de que quieres reiniciar todos los datos? Esta acción no se puede deshacer.')) {
        if (confirm('Esta es tu última oportunidad. ¿Realmente quieres borrar todo?')) {
            initializeStudents();
            renderCurrentTab();
            updateStats();
            showNotification('Datos reiniciados correctamente', 'success');

            // Clear random display
            const randomName = document.getElementById('randomName');
            const randomId = document.getElementById('randomId');
            if (randomName) randomName.textContent = '¡Haz clic para seleccionar!';
            if (randomId) randomId.textContent = '';
        }
    }
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function attachEventListeners() {
    // Tab navigation
    const tabIndividual = document.getElementById('tab-individual');
    const tabTeams = document.getElementById('tab-teams');
    const tabAwards = document.getElementById('tab-awards');
    const tabConfig = document.getElementById('tab-config');

    if (tabIndividual) tabIndividual.addEventListener('click', () => switchTab('individual'));
    if (tabTeams) tabTeams.addEventListener('click', () => switchTab('teams'));
    if (tabAwards) tabAwards.addEventListener('click', () => switchTab('awards'));
    if (tabConfig) tabConfig.addEventListener('click', () => switchTab('config'));

    // Random selector
    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) randomBtn.addEventListener('click', selectRandomStudent);

    // Manual point assignment
    const voluntaryBtn = document.getElementById('voluntaryBtn');
    if (voluntaryBtn) {
        voluntaryBtn.addEventListener('click', () => {
            addPointsManually(PARTICIPATION_TYPES.VOLUNTARY.key, PARTICIPATION_TYPES.VOLUNTARY.points);
        });
    }

    const insightfulBtn = document.getElementById('insightfulBtn');
    if (insightfulBtn) {
        insightfulBtn.addEventListener('click', () => {
            addPointsManually(PARTICIPATION_TYPES.INSIGHTFUL.key, PARTICIPATION_TYPES.INSIGHTFUL.points);
        });
    }

    const teamMvpBtn = document.getElementById('teamMvpBtn');
    if (teamMvpBtn) {
        teamMvpBtn.addEventListener('click', () => {
            addPointsManually(PARTICIPATION_TYPES.TEAM_MVP.key, PARTICIPATION_TYPES.TEAM_MVP.points);
        });
    }

    // Reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetData);

    // Sorting
    const sortByPointsBtn = document.getElementById('sortByPoints');
    const sortByNameBtn = document.getElementById('sortByName');

    if (sortByPointsBtn) sortByPointsBtn.addEventListener('click', sortByPoints);
    if (sortByNameBtn) sortByNameBtn.addEventListener('click', sortByName);
}

// ==========================================
// EXPORT / IMPORT DATA
// ==========================================

function exportData() {
    // Prepare data object with all information
    const exportObject = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        students: students,
        metadata: {
            totalStudents: students.length,
            totalParticipations: students.reduce((sum, s) => sum + s.participations.length, 0)
        }
    };

    // Convert to JSON string with formatting
    const jsonString = JSON.stringify(exportObject, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate filename with date
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `participacion-datos-${dateStr}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Datos exportados exitosamente');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Validate data structure
            if (!importedData.students || !Array.isArray(importedData.students)) {
                throw new Error('Formato de datos inválido');
            }

            // Confirm before overwriting
            const confirmed = confirm(
                `¿Estás seguro de que quieres importar estos datos?\n\n` +
                `Estudiantes: ${importedData.students.length}\n` +
                `Participaciones: ${importedData.metadata?.totalParticipations || 'N/A'}\n\n` +
                `Esto reemplazará TODOS los datos actuales.`
            );

            if (!confirmed) {
                event.target.value = ''; // Reset file input
                return;
            }

            // Import data
            students = importedData.students;
            saveData();

            // Refresh all displays
            renderCurrentTab();
            updateStats();
            populateStudentSelect();

            alert('Datos importados exitosamente');

        } catch (error) {
            alert(`Error al importar datos: ${error.message}\n\nAsegúrate de que el archivo sea un JSON válido exportado de esta aplicación.`);
        }

        // Reset file input
        event.target.value = '';
    };

    reader.readAsText(file);
}

// ==========================================
// HOUSE CONFIGURATION
// ==========================================

function renderHouseConfig() {
    const container = document.getElementById('houseConfigContainer');
    if (!container) return;

    // Group students by house
    const studentsByHouse = {
        fire: students.filter(s => s.house === 'fire'),
        water: students.filter(s => s.house === 'water'),
        earth: students.filter(s => s.house === 'earth'),
        air: students.filter(s => s.house === 'air')
    };

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';

    Object.entries(HOUSES).forEach(([key, house]) => {
        const houseStudents = studentsByHouse[key] || [];

        html += `
            <div class="p-6 rounded-xl border-2 ${house.borderColor} ${house.bgColor}">
                <div class="flex items-center mb-4">
                    <span class="text-4xl mr-3">${house.icon}</span>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">${house.name}</h3>
                        <p class="text-sm text-gray-600">${houseStudents.length} estudiantes</p>
                    </div>
                </div>
                <div class="space-y-2">
        `;

        houseStudents.forEach(student => {
            const studentIndex = students.indexOf(student);
            html += `
                <div class="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                        <span class="font-semibold text-gray-800">${student.name}</span>
                        <span class="text-sm text-gray-500 ml-2">(${student.totalPoints} pts)</span>
                    </div>
                    <select onchange="changeStudentHouse(${studentIndex}, this.value)"
                            class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Mover a...</option>
                        ${Object.entries(HOUSES).map(([houseKey, houseData]) =>
                            houseKey !== key ? `<option value="${houseKey}">${houseData.icon} ${houseData.name}</option>` : ''
                        ).join('')}
                    </select>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function changeStudentHouse(studentIndex, newHouse) {
    if (!newHouse || studentIndex < 0 || studentIndex >= students.length) return;

    const student = students[studentIndex];
    const oldHouse = HOUSES[student.house]?.name || 'desconocida';
    const newHouseData = HOUSES[newHouse];

    if (!newHouseData) return;

    // Confirm change
    const confirmed = confirm(
        `¿Cambiar a ${student.name} de ${oldHouse} a ${newHouseData.name}?`
    );

    if (confirmed) {
        student.house = newHouse;
        saveData();
        renderHouseConfig();

        // Show confirmation
        alert(`${student.name} ahora está en ${newHouseData.icon} ${newHouseData.name}`);
    } else {
        // Reset dropdown
        renderHouseConfig();
    }
}
