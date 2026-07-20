const STORAGE_KEY = 'tf_daily_calorie_goal';
const DEFAULT_DAILY_CALORIE_GOAL = 1900;

function readStoredGoal() {
  try {
    const directGoal = Number(localStorage.getItem(STORAGE_KEY));
    const preferences = JSON.parse(localStorage.getItem('tf_preferences') || '{}');
    const prefsGoal = Number(
      preferences.daily_calories ??
      preferences.dailyCalories ??
      preferences.calorie_goal ??
      preferences.calorieGoal ??
      preferences.calories_target
    );

    const parsedGoal = Number.isFinite(directGoal) ? directGoal : Number.isFinite(prefsGoal) ? prefsGoal : DEFAULT_DAILY_CALORIE_GOAL;
    return parsedGoal > 0 ? Math.round(parsedGoal) : DEFAULT_DAILY_CALORIE_GOAL;
  } catch {
    return DEFAULT_DAILY_CALORIE_GOAL;
  }
}

export function getDailyCalorieGoal() {
  return readStoredGoal();
}

export function setDailyCalorieGoal(goal) {
  const parsedGoal = Number(goal);
  const safeGoal = Number.isFinite(parsedGoal) && parsedGoal > 0 ? Math.round(parsedGoal) : DEFAULT_DAILY_CALORIE_GOAL;
  localStorage.setItem(STORAGE_KEY, String(safeGoal));
  return safeGoal;
}

export function formatDailyCalorieGoal(goal = getDailyCalorieGoal()) {
  return `${Math.round(goal)} kcal`;
}
