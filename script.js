// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Handle expand/collapse functionality
document.querySelectorAll('.expand-btn').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('.criteria-section');
        section.classList.toggle('expanded');
    });
});

document.getElementById('sprintForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect all scores and weights
    const scores = [];
    const weights = [];
    
    document.querySelectorAll('.criteria-section').forEach((section, index) => {
        // Get weight
        const weightInput = section.querySelector('.weight-group input');
        const weight = parseInt(weightInput.value) || 0;
        weights.push(weight);
        
        // Get score
        const selectedRadio = section.querySelector(`input[name="score${index + 1}"]:checked`);
        if (!selectedRadio) return;
        scores.push(parseInt(selectedRadio.value));
    });

    // Calculate total possible score based on weights
    const totalPossibleScore = weights.reduce((sum, weight) => sum + (weight * 5), 0);
    
    // Calculate weighted sum
    let weightedSum = 0;
    scores.forEach((score, index) => {
        weightedSum += score * weights[index];
    });

    // Calculate dynamic intervals based on total possible score
    const interval4 = Math.floor(totalPossibleScore * 0.2); // 0-20%
    const interval3 = Math.floor(totalPossibleScore * 0.37); // 21-37%
    const interval2 = Math.floor(totalPossibleScore * 0.83); // 38-83%
    // interval1 is anything above interval2 up to totalPossibleScore

    // Determine sprint length based on dynamic intervals
    let sprintLength;
    let explanation;

    if (weightedSum >= interval2 && weightedSum <= totalPossibleScore) {
        sprintLength = 1;
        explanation = "A 1-week sprint is recommended due to high team capability, low complexity, and good project infrastructure.";
    } else if (weightedSum >= interval3 && weightedSum < interval2) {
        sprintLength = 2;
        explanation = "A 2-week sprint is suitable given the team's capabilities and project characteristics.";
    } else if (weightedSum >= interval4 && weightedSum < interval3) {
        sprintLength = 3;
        explanation = "A 3-week sprint balances the need for regular delivery with the team's constraints and project complexity.";
    } else {
        sprintLength = 4;
        explanation = "A 4-week sprint is recommended due to high complexity, low team familiarity, or significant external dependencies.";
    }

    // Display results
    const resultSection = document.getElementById('result');
    const sprintLengthElement = document.getElementById('sprintLength');
    const explanationElement = document.getElementById('explanation');

    sprintLengthElement.textContent = `Recommended Sprint Length: ${sprintLength} ${sprintLength === 1 ? 'week' : 'weeks'} (${sprintLength * 5} working days)`;
    explanationElement.innerHTML = `<strong>Explanation:</strong><br>${explanation}<br><br>
        <strong>Total Weighted Score:</strong> ${weightedSum} out of ${totalPossibleScore}<br>
        <strong>Score Percentage:</strong> ${Math.round((weightedSum / totalPossibleScore) * 100)}%`;

    resultSection.classList.add('visible');
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth' });
}); 