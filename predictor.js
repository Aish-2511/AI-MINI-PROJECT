// Predictor Logic & Recommendation Engine
const AI_Predictor = {
  evaluate: function(attendance, internalMarks, assignmentMarks, studyHours) {
    const attNorm = attendance / 100;
    const intNorm = internalMarks / 50;
    const assNorm = assignmentMarks / 20;
    const hrsNorm = Math.min(studyHours / 8, 1);

    const totalScore = (attNorm * 0.30) + (intNorm * 0.35) + (assNorm * 0.20) + (hrsNorm * 0.15);
    const confidence = (85 + (totalScore * 14)).toFixed(1);

    let tier = 'Pass';
    let risk = 'Moderate';
    let targetHours = '4-5 hrs';
    let attGoal = '> 80%';
    let subtext = "You're on the right track!";
    let iconClass = 'fa-solid fa-circle-check';
    let cssClass = 'tier-pass';
    let tips = [];

    if (totalScore >= 0.76) {
      tier = 'Excellent';
      risk = 'Low';
      targetHours = '5-6 hrs';
      attGoal = '> 90%';
      subtext = "You're doing amazing! Keep it up.";
      iconClass = 'fa-solid fa-trophy';
      cssClass = 'tier-excellent';
      tips = [
        "Maintain attendance above 90% in upcoming core lectures.",
        "Continue studying 5–6 hours daily with focused break intervals.",
        "Practice advanced DAA and Operating Systems question papers.",
        "Help classmates in study groups to reinforce core concepts."
      ];
    } else if (totalScore >= 0.55) {
      tier = 'Pass';
      risk = 'Moderate';
      targetHours = '4-5 hrs';
      attGoal = '> 80%';
      subtext = "You're on the right track. Minor boost needed.";
      iconClass = 'fa-solid fa-circle-check';
      cssClass = 'tier-pass';
      tips = [
        "Study 3–4 hours daily and revise weak topics twice a week.",
        "Increase lecture attendance above 80%.",
        "Submit pending lab records before deadlines.",
        "Practice daily mock quizzes to boost internal test marks."
      ];
    } else {
      tier = 'At Risk';
      risk = 'High';
      targetHours = '5-6 hrs';
      attGoal = '> 85%';
      subtext = "Immediate focus required to improve grades.";
      iconClass = 'fa-solid fa-triangle-exclamation';
      cssClass = 'tier-risk';
      tips = [
        "Attend every lecture without fail this week.",
        "Dedicate 4–5 hours daily to core subjects.",
        "Revise internal test topics immediately with course tutors.",
        "Complete pending lab assignments today."
      ];
    }

    return {
      score: totalScore,
      confidence: confidence + '%',
      tier: tier,
      risk: risk,
      targetHours: targetHours,
      attGoal: attGoal,
      subtext: subtext,
      iconClass: iconClass,
      cssClass: cssClass,
      tips: tips
    };
  }
};
