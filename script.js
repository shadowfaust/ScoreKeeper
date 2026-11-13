const TARGET_SCORE = 50;
const POINTS = [4, 7, 8, 9, 10, 13];
const PENALTIES = [4, 7, 8, 9, 10, 11];

const teams = {
    A: {
        score: 0,
        nameInput: document.getElementById('teamAName')
    },
    B: {
        score: 0,
        nameInput: document.getElementById('teamBName')
    }
};

document.getElementById('targetScore').textContent = TARGET_SCORE;

function teamName(team) {
    return teams[team].nameInput.value.trim() || `Team ${team}`;
}

function buildButtons(team, values, type) {
    const container = document.getElementById(
        `team${team}${type === 'plus' ? 'Plus' : 'Minus'}`
    );

    values.forEach(value => {
        const button = document.createElement('button');
        const amount = type === 'plus' ? value : -value;

        button.type = 'button';
        button.className = `score-btn ${type}`;
        button.textContent = `${amount > 0 ? '+' : '−'}${Math.abs(amount)}`;

        button.addEventListener('click', () => {
            changeScore(team, amount);
        });

        container.appendChild(button);
    });
}

function changeScore(team, amount) {
    teams[team].score += amount;
    updateDisplay();
}

function updateDisplay() {
    ['A', 'B'].forEach(team => {
        const score = teams[team].score;

        const progress = Math.max(
            0,
            Math.min(100, (score / TARGET_SCORE) * 100)
        );

        document.getElementById(`team${team}Score`).textContent = score;

        document.getElementById(`team${team}Progress`)
            .style.width = `${progress}%`;

        document.getElementById(`team${team}Percent`)
            .textContent = `${Math.round(progress)}%`;

        document.getElementById(`team${team}Panel`)
            .classList.toggle('winner', score >= TARGET_SCORE);
    });

    updateStatus();
}

function updateStatus() {
    const status = document.getElementById('gameStatus');
    const text = document.getElementById('statusText');

    const a = teams.A.score;
    const b = teams.B.score;

    status.classList.remove('is-won');

    if (a >= TARGET_SCORE && b >= TARGET_SCORE) {
        text.textContent = 'Both teams have reached the target!';
        status.classList.add('is-won');

    } else if (a >= TARGET_SCORE || b >= TARGET_SCORE) {
        const winner = a >= TARGET_SCORE
            ? teamName('A')
            : teamName('B');

        text.textContent = `🎉 ${winner} reached ${TARGET_SCORE} points — winner!`;
        status.classList.add('is-won');

    } else {
        text.textContent = 'Game in progress — make your move!';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

document.getElementById('resetBtn').addEventListener('click', () => {
    teams.A.score = 0;
    teams.B.score = 0;

    updateDisplay();

    showToast('Both team scores have been reset.');
});

['A', 'B'].forEach(team => {
    buildButtons(team, POINTS, 'plus');
    buildButtons(team, PENALTIES, 'minus');

    teams[team].nameInput.addEventListener('input', updateStatus);

    teams[team].nameInput.addEventListener('blur', () => {
        if (!teams[team].nameInput.value.trim()) {
            teams[team].nameInput.value = `Team ${team}`;
        }

        updateStatus();
    });
});

updateDisplay();