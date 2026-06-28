/* eslint-disable */
// @charset "UTF-8"
import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const TRAITS = [
  { id: "discipline",   label: "Discipline",      icon: "⚔️",  color: "#FB923C" },
  { id: "creativity",   label: "Creativity",      icon: "🎨",  color: "#f97316" },
  { id: "music",        label: "Music Talent",    icon: "🎵",  color: "#a855f7" },
  { id: "focus",        label: "Deep Focus",      icon: "🧠",  color: "#22D3EE" },
  { id: "resilience",   label: "Resilience",      icon: "🔥",  color: "#F87171" },
  { id: "confidence",   label: "Confidence",      icon: "👑",  color: "#eab308" },
  { id: "leadership",   label: "Leadership",      icon: "🦁",  color: "#f59e0b" },
  { id: "wellness",     label: "Wellness",        icon: "🌿",  color: "#34D399" },
  { id: "wisdom",       label: "Wisdom",          icon: "📚",  color: "#8b5cf6" },
  { id: "speed",        label: "Speed",           icon: "\u26A1",  color: "#facc15" },
  { id: "charisma",     label: "Charisma",        icon: "✨",  color: "#ec4899" },
  { id: "streetsmarts", label: "Street Smarts",   icon: "🦊",  color: "#f59e0b" },
  { id: "patience",     label: "Patience",        icon: "🧘",  color: "#14b8a6" },
  { id: "courage",      label: "Courage",         icon: "🦅",  color: "#dc2626" },
  { id: "hustle",       label: "Hustle",          icon: "💼",  color: "#7c3aed" },
  { id: "artistry",     label: "Artistry",        icon: "🖌️",  color: "#db2777" },
  { id: "grit",         label: "Grit",            icon: "🪨",  color: "#78716c" },
  { id: "humor",        label: "Humor",           icon: "😂",  color: "#fbbf24" },
  { id: "empathy",      label: "Empathy",         icon: "💙",  color: "#3b82f6" },
  { id: "ambition",     label: "Ambition",        icon: "🚀",  color: "#8b5cf6" },
];

const BADGES = [
  { id: "first",      icon: "🥇", label: "First Win",        desc: "Completed your first task",               check: s => s.totalDone >= 1 },
  { id: "five",       icon: "🎳", label: "On a Roll",         desc: "Completed 5 tasks total",                 check: s => s.totalDone >= 5 },
  { id: "ten",        icon: "💪", label: "Double Digits",     desc: "Completed 10 tasks total",                check: s => s.totalDone >= 10 },
  { id: "twenty",     icon: "⚙️", label: "The Grinder",       desc: "Completed 20 tasks total",                check: s => s.totalDone >= 20 },
  { id: "fifty",      icon: "🏆", label: "Fifty Club",        desc: "Completed 50 tasks total",                check: s => s.totalDone >= 50 },
  { id: "reschedule", icon: "🔄", label: "Flexible Mind",     desc: "Rescheduled a task instead of quitting",  check: s => s.reschedules >= 1 },
  { id: "carry",      icon: "🎒", label: "Carried Over",      desc: "Moved 3 tasks to tomorrow",               check: s => s.carryOvers >= 3 },
  { id: "streak3",    icon: "🔥", label: "Hat Trick",         desc: "3-day streak",                            check: s => s.streak >= 3 },
  { id: "streak7",    icon: "🗡️", label: "Week Warrior",      desc: "7-day streak",                            check: s => s.streak >= 7 },
  { id: "streak14",   icon: "🌕", label: "Two Week Beast",    desc: "14-day streak",                           check: s => s.streak >= 14 },
  { id: "streak21",   icon: "🧱", label: "Habit Former",      desc: "21-day streak",                           check: s => s.streak >= 21 },
  { id: "streak30",   icon: "🏅", label: "Monthly Grinder",   desc: "30-day streak",                           check: s => s.streak >= 30 },
  { id: "streak50",   icon: "⚡", label: "Fifty Days",        desc: "50-day streak",                           check: s => s.streak >= 50 },
  { id: "streak100",  icon: "💎", label: "Century",           desc: "100-day streak",                          check: s => s.streak >= 100 },
  { id: "streak365",  icon: "🌟", label: "Legendary",         desc: "365-day streak",                          check: s => s.streak >= 365 },
  { id: "traits5",    icon: "🌈", label: "Trait Collector",   desc: "Earned 5 different traits",               check: s => Object.keys(s.traitXP).length >= 5 },
  { id: "traits10",   icon: "🧬", label: "Renaissance",       desc: "Earned 10 different traits",              check: s => Object.keys(s.traitXP).length >= 10 },
  { id: "xp100",      icon: "👑", label: "Self Made",         desc: "Earned 100 total XP",                     check: s => s.totalXP >= 100 },
  { id: "xp500",      icon: "💎", label: "Diamond Mind",      desc: "Earned 500 total XP",                     check: s => s.totalXP >= 500 },
  { id: "honest",     icon: "🪞", label: "Self Aware",        desc: "Marked 'Not today' 5 times",              check: s => s.notToday >= 5 },
  { id: "comeback",   icon: "🦋", label: "Comeback Kid",      desc: "Completed a task after carrying it over", check: s => s.comebacks >= 1 },
  { id: "focus30",    icon: "🧘", label: "In The Zone",        desc: "Focused for 30 minutes in one session",   check: s => (s.bestFocusSecs || 0) >= 1800 },
  { id: "focus60",    icon: "🔬", label: "Deep Work",          desc: "Focused for 1 hour in one session",       check: s => (s.bestFocusSecs || 0) >= 3600 },
];

// Mean roasts for pending tasks
const MEAN_LINES = [
  "Still sitting on this one? Bold strategy.",
  "This task is collecting dust. Like your gym membership.",
  "Your future self already wrote the apology note.",
  "Three words: you. did. nothing.",
  "Impressive commitment to doing nothing.",
  "This task has been waiting longer than your unread emails.",
  "Not you. Not today. (Again.)",
  "The audacity to still not do this.",
  "This task is starting to feel personally attacked.",
  "You're really letting this one age like fine procrastination.",
  "Even the task is tired of waiting for you.",
  "Your to-do list is basically a museum of good intentions.",
  "Plot twist: you still haven't done it.",
  "This task has seen more sunsets than progress.",
  "Somewhere, a productivity guru is crying.",
  "It's not the task that's hard. It's you.",
  "Future you would like a word with present you.",
  "Not urgent? Not important? Just uncomfortable? Yeah, thought so.",
];

// Backhanded compliments after completing — the good stuff
const WIN_LINES = [
  "Damn, you actually did it. I had my doubts.",
  "One step away from being a complete disaster and you pulled through. Nice.",
  "Look at you, doing the bare minimum and somehow it's impressive.",
  "Honestly? Didn't think you had it in you. Proved me wrong. Barely.",
  "You're not as lazy as you look. That's a compliment.",
  "Task done. Your braincell worked overtime today.",
  "Achievement unlocked: functioning adult. For now.",
  "That took way longer than it should have, but it's done. We'll take it.",
  "You just out-performed my expectations. Which were low. But still.",
  "Nice. You did a thing. Your ancestors would be... mildly impressed.",
  "Congrats on doing what most people do automatically. You're growing.",
  "Not bad for someone who almost didn't do it.",
  "You completed a task. Please don't let this be a fluke.",
  "Zero to done. It's not elegant but neither are you. And that's okay.",
  "One less thing on the list. One step closer to not being a mess.",
  "You did it. I'm shocked. Genuinely. Well done, you chaotic little achiever.",
  "Turns out you're capable when you try. Wild concept.",
  "Done. See? The world didn't end. Mostly because you finally did the thing.",
];

// Gentle when they can't complete
const CARRY_LINES = [
  "Life happens. Tomorrow is still a chance.",
  "You tried. That counts more than you think.",
  "Moving it forward, not giving up on it.",
  "Flexibility is a skill too. See you tomorrow.",
  "Not done, not abandoned — just rescheduled.",
  "Even unfinished progress is still progress.",
];

// Roasts for when they tab away during a focus session
const TAB_AWAY_ROASTS = [
  "Welcome back. How was the void?",
  "Oh, you're back. Miss us? We didn't miss you.",
  "Timer paused. Your focus did not survive the journey.",
  "Caught you. What was so important? Exactly.",
  "You left. The tasks noticed. They're not happy.",
  "Back already? Your attention span is… something.",
  "Focus session interrupted. By you. As always.",
  "The app waited. Like it always does. Unlike you.",
  "You returned. The procrastination demons are retreating. For now.",
  "Session paused while you did literally anything else.",
];

// Savage roasts shown while tasks are pending
const SAVAGE_ROASTS = [
  "Still here. Still undone. Still you.",
  "You made a list. Congrats on the easy part.",
  "Your tasks are aging like milk.",
  "That task has been staring at you longer than your unread messages.",
  "Procrastination level: advanced.",
  "Every hour you wait, your future self gets angrier.",
  "You didn't fail today. You just haven't started yet. That's almost worse.",
  "Clock's ticking. You're not.",
  "Three words: you. did. nothing.",
  "The audacity to still not do this.",
  "Your to-do list called. It's filing for abandonment.",
  "Even the task is embarrassed for you.",
  "You're really letting this one age like fine procrastination.",
  "Somewhere a productivity guru is weeping. That's on you.",
  "Not urgent? Not important? Just uncomfortable? Thought so.",
  "You opened the app. Great. Now do the actual thing.",
  "Your future self already wrote the apology note.",
  "Another day. Same undone tasks. Bold strategy.",
];

// Positive only when ALL tasks done
const ALL_DONE_LINES = [
  "Everything done. That's genuinely rare. Be proud.",
  "Full clear. You showed up and handled business today.",
  "Zero remaining. This is what discipline looks like.",
  "All tasks done. Your future self owes you one.",
  "Complete. You actually did it. Every single thing.",
];

// Streak milestone messages
const STREAK_MILESTONES = {
  3:   "3 days straight. You're building something real.",
  7:   "One week. Most people quit before this. You didn't.",
  14:  "Two weeks. This isn't luck anymore. This is a habit.",
  21:  "21 days. Scientists say that's when habits form. Congrats.",
  30:  "30 days. One month of showing up. Respect.",
  50:  "50 days. You're in rare territory now.",
  75:  "75 days. Three quarters to 100. You're not stopping.",
  100: "100 days. You are built different. No debate.",
  365: "365 days. A full year. Legendary. Actual legend.",
};

// ── SKILL CARD SYSTEM ─────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  { id: "fitness",     label: "Fitness",     icon: "🏋️", color: "#F87171", desc: "Run, lift, move your body",         keywords: ["run","gym","workout","exercise","jog","walk","swim","yoga","lift","sport","train","hike","cycle","stretch"] },
  { id: "cooking",     label: "Cooking",     icon: "🍳", color: "#f97316", desc: "Cook, meal prep, eat well",          keywords: ["cook","meal","food","lunch","dinner","breakfast","recipe","bake","prep","kitchen","eat"] },
  { id: "learning",    label: "Learning",    icon: "📖", color: "#8b5cf6", desc: "Study, read, take courses",          keywords: ["read","study","learn","research","book","course","class","notes","practice","review","lecture","quiz"] },
  { id: "coding",      label: "Coding",      icon: "💻", color: "#22D3EE", desc: "Build, code, create software",       keywords: ["code","build","deploy","debug","program","develop","script","api","app","software","git","commit"] },
  { id: "mindfulness", label: "Mindfulness", icon: "🧘", color: "#34D399", desc: "Meditate, breathe, reflect",         keywords: ["meditate","mindful","breathe","journal","reflect","rest","relax","gratitude","calm","peace"] },
  { id: "finance",     label: "Finance",     icon: "💰", color: "#eab308", desc: "Budget, invest, save money",         keywords: ["budget","invest","save","money","finance","expense","income","tax","bill","pay","bank","trade"] },
  { id: "creative",    label: "Creative",    icon: "🎨", color: "#ec4899", desc: "Draw, write, make things",           keywords: ["draw","write","design","create","paint","sketch","compose","edit","photo","video","art","music","sing","play"] },
  { id: "social",      label: "Social",      icon: "🤝", color: "#f59e0b", desc: "Connect, network, relationships",    keywords: ["meet","call","talk","message","network","friend","family","date","connect","visit","event","party"] },
];

const CARD_TIERS = [
  { id: "bronze",   label: "Bronze",   days: 3,  color: "#cd7f32", glow: "#cd7f3240", stars: 1 },
  { id: "silver",   label: "Silver",   days: 7,  color: "#c0c0c0", glow: "#c0c0c040", stars: 2 },
  { id: "gold",     label: "Gold",     days: 14, color: "#ffd700", glow: "#ffd70040", stars: 3 },
  { id: "platinum", label: "Platinum", days: 30, color: "#e5e4e2", glow: "#e5e4e260", stars: 4 },
  { id: "legend",   label: "Legend",   days: 60, color: "#a855f7", glow: "#a855f740", stars: 5 },
];

function getCardTier(streak) {
  let tier = null;
  for (const t of CARD_TIERS) { if (streak >= t.days) tier = t; }
  return tier;
}

function getNextTier(streak) {
  return CARD_TIERS.find(t => streak < t.days) || null;
}

function detectTaskCategory(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const cat of SKILL_CATEGORIES) {
    if (cat.keywords.some(k => lower.includes(k))) return cat.id;
  }
  return null;
}

// Task keyword → trait mapping
const KEYWORD_TRAITS = [
  { keywords: ["lunch","eat","food","dinner","breakfast","meal","cook","restaurant"], trait: "wellness",     bonus: "Energy +10" },
  { keywords: ["read","study","learn","research","book","course","class","notes"],   trait: "wisdom",       bonus: "Wisdom +10" },
  { keywords: ["run","gym","workout","exercise","jog","walk","swim","yoga","lift"],  trait: "grit",         bonus: "Grit +10" },
  { keywords: ["meet","call","talk","present","pitch","interview","network"],        trait: "charisma",     bonus: "Charisma +10" },
  { keywords: ["code","build","design","write","create","draw","plan","make"],       trait: "creativity",   bonus: "Creativity +10" },
  { keywords: ["meditate","rest","sleep","breathe","relax","recover"],              trait: "patience",     bonus: "Patience +10" },
  { keywords: ["lead","manage","organize","review","decide","hire","fire"],         trait: "leadership",   bonus: "Leadership +10" },
  { keywords: ["ship","launch","submit","publish","send","deploy","finish"],        trait: "hustle",       bonus: "Hustle +10" },
  { keywords: ["practice","rehearse","perform","play","music","instrument"],       trait: "music",        bonus: "Music +10" },
];

// ── PHOTO JOURNAL HELPERS ─────────────────────────────────────────────────────

function loadPhotos() { try { return JSON.parse(localStorage.getItem("dg_photos") || "{}"); } catch { return {}; } }
function savePhotos(p) { try { localStorage.setItem("dg_photos", JSON.stringify(p)); } catch {} }
function loadProjects() { try { return JSON.parse(localStorage.getItem("dg_projects") || "[]"); } catch { return []; } }
function saveProjects(p) { try { localStorage.setItem("dg_projects", JSON.stringify(p)); } catch {} }

function getWeekDates() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Mon=0
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - diff + i);
    return d.toISOString().slice(0, 10);
  });
}

function getMonthWeeks() {
  const today = new Date();
  const year = today.getFullYear(), month = today.getMonth();
  const first = new Date(year, month, 1);
  const weeks = [];
  let cur = new Date(first);
  while (cur.getMonth() === month) {
    weeks.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 7);
  }
  return weeks.slice(0, 5);
}

function getTaskTrait(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const { keywords, trait, bonus } of KEYWORD_TRAITS) {
    if (keywords.some(k => lower.includes(k))) {
      return { traitId: trait, bonus };
    }
  }
  return null;
}

function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function fmtDuration(secs) {
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  if (h > 0) return `${h}h ${pad2(m)}m`;
  if (m > 0) return `${m}m ${pad2(s)}s`;
  return `${s}s`;
}

function getLevelInfo(xp) {
  if (xp >= 500) return { level: 6, title: "Legendary",     min: 500, max: 650 };
  if (xp >= 350) return { level: 5, title: "Unstoppable",   min: 350, max: 500 };
  if (xp >= 200) return { level: 4, title: "Disciplined",   min: 200, max: 350 };
  if (xp >= 100) return { level: 3, title: "Consistent",    min: 100, max: 200 };
  if (xp >= 50)  return { level: 2, title: "Getting There", min: 50,  max: 100 };
  return           { level: 1, title: "Newcomer",           min: 0,   max: 50  };
}

function pad2(n) { return String(n).padStart(2, "0"); }
function toMin(t) { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function fmtTime(t) { if (!t) return ""; const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${pad2(m)} ${h >= 12 ? "PM" : "AM"}`; }
function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function sinceAdded(ts) {
  const m = Math.floor((Date.now() - ts) / 60000), h = Math.floor(m / 60);
  if (h >= 1) return `${h}h ${m % 60}m sitting here`;
  if (m >= 1) return `${m}m and counting`;
  return "just added";
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const DEFAULT_STATS = { totalXP: 0, totalDone: 0, streak: 0, traitXP: {}, earnedBadges: [], reschedules: 0, carryOvers: 0, notToday: 0, comebacks: 0, totalFocusSecs: 0, bestFocusSecs: 0, lastActiveDate: null, categoryStreaks: {}, categoryLastDone: {} };

// History helpers — stored separately in localStorage
function loadHistory() { try { return JSON.parse(localStorage.getItem("dg_history") || "[]"); } catch { return []; } }
function saveHistory(h) { try { localStorage.setItem("dg_history", JSON.stringify(h)); } catch {} }
function addHistoryDay(date, doneTasks, totalTasks, focusSecs, streak) {
  const history = loadHistory();
  const existing = history.findIndex(d => d.date === date);
  const entry = { date, done: doneTasks, total: totalTasks, focusSecs, streak };
  if (existing >= 0) history[existing] = entry; else history.unshift(entry);
  saveHistory(history.slice(0, 365)); // keep max 1 year
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dg_tasks") || "[]"); } catch { return []; }
  });
  const [stats, setStats] = useState(() => {
    try { const s = localStorage.getItem("dg_stats"); return s ? { ...DEFAULT_STATS, ...JSON.parse(s) } : DEFAULT_STATS; } catch { return DEFAULT_STATS; }
  });
  const [view, setView] = useState("tasks");
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [reward, setReward] = useState(null);
  const [badge, setBadge] = useState(null);
  const [toast, setToast] = useState(null);
  const [newDayScreen, setNewDayScreen] = useState(null);
  const [focusActive, setFocusActive] = useState(false);
  const [focusSecs, setFocusSecs] = useState(0);
  const [tabAwayRoast, setTabAwayRoast] = useState(null);
  const [pomodoroMode, setPomodoroMode] = useState(null);
  const [pomodoroPhase, setPomodoroPhase] = useState("work");
  const [pomodoroSecs, setPomodoroSecs] = useState(0);
  const [pomodoroRounds, setPomodoroRounds] = useState(0);
  // AI Planner
  const [plannerEnergy, setPlannerEnergy] = useState(null);
  const [plannerResult, setPlannerResult] = useState(null);
  const [plannerLoading, setPlannerLoading] = useState(false);
  // Morning check-in
  const [checkin, setCheckin] = useState(null); // { question, answer, aiReply, loading }
  const [showCheckin, setShowCheckin] = useState(false);
  // Share card
  const [showShare, setShowShare] = useState(false);
  // User name
  const [userName, setUserName] = useState(() => localStorage.getItem("dg_name") || "");
  // Photo journal
  const [photos, setPhotos] = useState(() => loadPhotos());
  const [photoPrompt, setPhotoPrompt] = useState(false);
  const [weeklyPickScreen, setWeeklyPickScreen] = useState(false);
  // Projects
  const [projects, setProjects] = useState(() => loadProjects());
  const [showAddProject, setShowAddProject] = useState(false);
  const [showLogEntry, setShowLogEntry] = useState(null); // project id
  const toastTimer = useRef(null);
  const focusInterval = useRef(null);

  // ── NEW DAY CHECK + MORNING CHECK-IN ────────────────────────────────────────
  useEffect(() => {
    const today = todayStr();
    const lastDate = stats.lastActiveDate;
    if (lastDate && lastDate !== today) {
      const doneTasks = tasks.filter(t => t.done);
      const pendingTasks = tasks.filter(t => !t.done);
      setNewDayScreen({ date: lastDate, doneTasks, pendingTasks, focusSecs: stats.lastDayFocusSecs || 0 });
    } else if (!lastDate) {
      setStats(s => ({ ...s, lastActiveDate: today }));
      // First ever open — show check-in after short delay
      setTimeout(() => triggerCheckin(stats, tasks, true), 800);
    } else {
      // Same day — show check-in if not seen today
      const lastCheckin = localStorage.getItem("dg_checkin_date");
      if (lastCheckin !== today) {
        setTimeout(() => triggerCheckin(stats, tasks, false), 800);
      }
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── FOCUS / POMODORO TICK ────────────────────────────────────────────────────
  useEffect(() => {
    if (focusActive) {
      focusInterval.current = setInterval(() => {
        if (pomodoroMode) {
          setPomodoroSecs(s => {
            const next = s - 1;
            if (next <= 0) {
              // Phase complete — switch
              setPomodoroPhase(ph => {
                const isWork = ph === "work";
                if (!isWork) setPomodoroRounds(r => r + 1);
                return isWork ? "break" : "work";
              });
              // next phase duration will be set by the phase-change effect below
              return -1; // sentinel so phase-change effect fires
            }
            return next;
          });
        } else {
          setFocusSecs(s => s + 1);
        }
      }, 1000);
    } else {
      clearInterval(focusInterval.current);
    }
    return () => clearInterval(focusInterval.current);
  }, [focusActive, pomodoroMode]);

  // When pomodoro phase changes, reset the countdown
  useEffect(() => {
    if (!pomodoroMode) return;
    const [workMins, breakMins] = pomodoroMode === "25/5" ? [25, 5] : [50, 10];
    const duration = pomodoroPhase === "work" ? workMins * 60 : breakMins * 60;
    setPomodoroSecs(duration);
    if (pomodoroPhase === "break") {
      showToast("🎉 Work phase done! Take your break. You earned it.", "success");
    } else if (pomodoroRounds > 0) {
      showToast(`🔥 Break over. Round ${pomodoroRounds + 1} — let's go.`, "info");
    }
  }, [pomodoroPhase, pomodoroMode, pomodoroRounds]); // eslint-disable-line react-hooks/exhaustive-deps


  // Tab visibility — pause + roast
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden && focusActive) {
        setFocusActive(false);
        // Store roast to show on return
        localStorage.setItem("dg_tab_roast", pick(TAB_AWAY_ROASTS));
      } else if (!document.hidden) {
        const roast = localStorage.getItem("dg_tab_roast");
        if (roast) {
          setTabAwayRoast(roast);
          localStorage.removeItem("dg_tab_roast");
          setTimeout(() => setTabAwayRoast(null), 4000);
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [focusActive]);

  function startFocus(mode = null) {
    setPomodoroMode(mode);
    setPomodoroPhase("work");
    setPomodoroRounds(0);
    if (mode) {
      const workMins = mode === "25/5" ? 25 : 50;
      setPomodoroSecs(workMins * 60);
    } else {
      setFocusSecs(0);
    }
    setFocusActive(true);
  }
  function stopFocus() {
    setFocusActive(false);
    const [workMins] = pomodoroMode === "25/5" ? [25, 5] : pomodoroMode === "50/10" ? [50, 10] : [0, 0];
    const earned = pomodoroMode
      ? (pomodoroRounds * workMins * 60) + (pomodoroPhase === "work" ? workMins * 60 - pomodoroSecs : workMins * 60)
      : focusSecs;
    if (earned > 0) {
      setStats(s => {
        const updated = {
          ...s,
          totalFocusSecs: (s.totalFocusSecs || 0) + earned,
          bestFocusSecs: Math.max(s.bestFocusSecs || 0, earned),
        };
        const { finalStats } = checkBadges(updated);
        return finalStats;
      });
      showToast(`Focus banked: ${fmtDuration(earned)}. Respect.`, "success");
    }
    setFocusSecs(0);
    setPomodoroMode(null);
    setPomodoroSecs(0);
    setPomodoroRounds(0);
    setPomodoroPhase("work");
  }

  function handleNewDay(action) {
    const today = todayStr();
    const yesterdayDone = (newDayScreen?.doneTasks || []).length;
    const lastDate = newDayScreen?.date;
    const daysMissed = lastDate
      ? Math.round((new Date(today) - new Date(lastDate)) / 86400000) - 1
      : 0;
    const totalYesterday = (newDayScreen?.doneTasks?.length || 0) + (newDayScreen?.pendingTasks?.length || 0);
    addHistoryDay(lastDate, yesterdayDone, totalYesterday, newDayScreen?.focusSecs || 0, stats.streak);
    setTasks(prev => {
      const pending = prev.filter(t => !t.done);
      if (action === "carry") {
        return pending.map(t => ({ ...t, carriedOver: true, skipped: false }));
      } else {
        return [];
      }
    });
    setStats(s => {
      const newStreak = yesterdayDone > 0 ? s.streak + 1 : daysMissed >= 2 ? 0 : s.streak;
      const milestoneMsg = STREAK_MILESTONES[newStreak];
      if (milestoneMsg) setTimeout(() => showToast("🔥 " + milestoneMsg, "success"), 1200);
      return { ...s, lastActiveDate: today, lastDayFocusSecs: 0, streak: newStreak };
    });
    setNewDayScreen(null);
  }

  useEffect(() => { try { localStorage.setItem("dg_tasks", JSON.stringify(tasks)); } catch {} }, [tasks]);
  useEffect(() => {
    try { localStorage.setItem("dg_stats", JSON.stringify({ ...stats, lastActiveDate: todayStr() })); } catch {}
  }, [stats]);
  useEffect(() => { savePhotos(photos); }, [photos]);
  useEffect(() => { saveProjects(projects); }, [projects]);

  // Evening photo prompt — show if no photo today and it's after 8pm
  useEffect(() => {
    const today = todayStr();
    const hour = new Date().getHours();
    const hasPhoto = photos[today];
    const dismissed = localStorage.getItem("dg_photo_dismissed") === today;
    if (!hasPhoto && !dismissed && hour >= 20) {
      setTimeout(() => setPhotoPrompt(true), 1500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  function showToast(msg, type = "info") {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  function checkBadges(newStats) {
    const have = newStats.earnedBadges || [];
    const unlocked = BADGES.filter(b => !have.includes(b.id) && b.check(newStats));
    if (unlocked.length > 0) {
      const finalStats = { ...newStats, earnedBadges: [...have, ...unlocked.map(b => b.id)] };
      return { finalStats, newBadge: unlocked[0] };
    }
    return { finalStats: newStats, newBadge: null };
  }

  function giveReward(baseStats, taskText, allDone) {
    const matched = getTaskTrait(taskText);
    const trait = matched
      ? TRAITS.find(t => t.id === matched.traitId) || pick(TRAITS)
      : pick(TRAITS);
    const xp = pick([5, 10, 15, 20, 25]);
    const newTraitXP = { ...baseStats.traitXP, [trait.id]: (baseStats.traitXP[trait.id] || 0) + xp };
    const updated = { ...baseStats, totalXP: baseStats.totalXP + xp, traitXP: newTraitXP };
    const { finalStats, newBadge } = checkBadges(updated);
    setStats(finalStats);
    const msg = allDone ? pick(ALL_DONE_LINES) : matched ? matched.bonus : pick(SAVAGE_ROASTS);
    setReward({ trait, xp, msg, allDone });
    if (newBadge) setTimeout(() => setBadge(newBadge), 2400);
  }

  function toggleDone(id) {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t;
        const nowDone = !t.done;
        if (nowDone) {
          const wasCarried = t.carriedOver;
          const newStats = { ...stats, totalDone: stats.totalDone + 1, comebacks: stats.comebacks + (wasCarried ? 1 : 0) };
          const allDone = prev.filter(x => x.id !== id && !x.done && !x.skipped && !x.carriedOver).length === 0;
          // Update category streak
          const cat = t.category || detectTaskCategory(t.text);
          if (cat) {
            const today = todayStr();
            const lastDone = newStats.categoryLastDone?.[cat];
            const daysSince = lastDone ? Math.round((new Date(today) - new Date(lastDone)) / 86400000) : 999;
            const prevStreak = newStats.categoryStreaks?.[cat] || 0;
            const newCatStreak = daysSince <= 1 ? prevStreak + 1 : 1;
            newStats.categoryStreaks = { ...newStats.categoryStreaks, [cat]: newCatStreak };
            newStats.categoryLastDone = { ...newStats.categoryLastDone, [cat]: today };
            // Check for tier unlock
            const prevTier = getCardTier(prevStreak);
            const newTier = getCardTier(newCatStreak);
            if (newTier && newTier?.id !== prevTier?.id) {
              const catData = SKILL_CATEGORIES.find(c => c.id === cat);
              setTimeout(() => showToast(`🎴 ${catData?.label} card upgraded to ${newTier.label}!`, "success"), 1500);
            }
          }
          setTimeout(() => giveReward(newStats, t.text, allDone), 300);
        } else {
          showToast("Un-checking it? All good, pick it back up.", "info");
        }
        return { ...t, done: nowDone, skipped: false, carriedOver: false };
      });
      return updated;
    });
  }

  function markNotToday(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, skipped: true, done: false } : t));
    const updated = { ...stats, notToday: stats.notToday + 1 };
    const { finalStats, newBadge } = checkBadges(updated);
    setStats(finalStats);
    if (newBadge) setTimeout(() => setBadge(newBadge), 500);
    showToast(pick(CARRY_LINES), "gentle");
  }

  function carryOver(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, carriedOver: true, skipped: false, startTime: "", endTime: "" } : t));
    const updated = { ...stats, carryOvers: stats.carryOvers + 1 };
    const { finalStats, newBadge } = checkBadges(updated);
    setStats(finalStats);
    if (newBadge) setTimeout(() => setBadge(newBadge), 500);
    showToast("Moved to tomorrow. Still counts.", "gentle");
  }

  function rescheduleTask(id, startTime, endTime) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, startTime, endTime, skipped: false, carriedOver: false } : t));
    const updated = { ...stats, reschedules: stats.reschedules + 1 };
    const { finalStats, newBadge } = checkBadges(updated);
    setStats(finalStats);
    if (newBadge) setTimeout(() => setBadge(newBadge), 500);
    showToast("Rescheduled. Flexibility is a skill too.", "gentle");
  }

  function addTask(task) {
    setTasks(prev => [...prev, { ...task, id: Date.now(), done: false, addedAt: Date.now(), meanIdx: Math.floor(Math.random() * MEAN_LINES.length) }]);
    setShowAdd(false);
    showToast("Added. You've got this.", "info");
  }

  function updateTask(id, task) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...task } : t));
    setEditTask(null);
    showToast("Updated.", "info");
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast("Gone. Fresh start.", "info");
  }

  async function triggerCheckin(currentStats, currentTasks, isFirstTime) {
    localStorage.setItem("dg_checkin_date", todayStr());
    const topCats = Object.entries(currentStats.categoryStreaks || {})
      .sort((a,b) => b[1]-a[1]).slice(0,2).map(([id]) => SKILL_CATEGORIES.find(c=>c.id===id)?.label).filter(Boolean);
    const pending = currentTasks.filter(t => !t.done && !t.skipped).length;
    const q = isFirstTime
      ? "What's the one thing you want to build in your life right now?"
      : currentStats.streak >= 7
      ? `You're on a ${currentStats.streak}-day streak. What would make today count?`
      : topCats.length > 0
      ? `You've been working on ${topCats[0]}. What does showing up look like today?`
      : pending > 0
      ? `You have ${pending} tasks waiting. What's the first one you'll touch today?`
      : "What would make today a win?";
    setCheckin({ question: q, answer: "", aiReply: null, loading: false });
    setShowCheckin(true);
  }

  async function submitCheckin(answer) {
    if (!answer.trim()) { setShowCheckin(false); return; }
    setCheckin(c => ({ ...c, loading: true }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 120,
          messages: [{
            role: "user",
            content: `You are a brutally honest but genuinely caring daily coach inside a productivity app called DailyGrind.
User stats: streak=${stats.streak} days, level=${getLevelInfo(stats.totalXP).level}, tasks done total=${stats.totalDone}.
This morning they answered "${checkin?.question}" with: "${answer}"
Give them ONE short, punchy response (2-3 sentences max). Be real, be direct, acknowledge what they said, then give them one sharp thing to focus on. No fluff. No emojis. No generic motivation.`
          }]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text||"").join("") || "Let's get it.";
      setCheckin(c => ({ ...c, aiReply: reply, loading: false, answer }));
    } catch {
      setCheckin(c => ({ ...c, aiReply: "Say less. Do more. Start now.", loading: false }));
    }
  }

  // ── PHOTO JOURNAL ─────────────────────────────────────────────────────────
  function handlePhotoUpload(e, dateKey) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotos(p => ({ ...p, [dateKey || todayStr()]: { src: ev.target.result, date: dateKey || todayStr(), caption: "" } }));
      setPhotoPrompt(false);
      showToast("Photo saved. That's your day captured.", "success");
    };
    reader.readAsDataURL(file);
  }

  function dismissPhotoPrompt() {
    localStorage.setItem("dg_photo_dismissed", todayStr());
    setPhotoPrompt(false);
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  function addProject(data) {
    const proj = { id: Date.now(), ...data, log: [], createdAt: todayStr() };
    setProjects(p => [proj, ...p]);
    setShowAddProject(false);
    showToast("Project added. Now actually work on it.", "success");
  }

  function logProjectEntry(id, units, note) {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newDone = Math.min(p.done + units, p.total);
      const entry = { date: todayStr(), note, units, cumulative: newDone };
      return { ...p, done: newDone, log: [entry, ...p.log] };
    }));
    setShowLogEntry(null);
    showToast("Progress logged. Every step counts.", "success");
  }

  function deleteProject(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast("Project removed.", "info");
  }

  async function runAIPlanner() {
    if (!plannerEnergy) { showToast("Pick your peak energy time first.", "info"); return; }
    const activeTasks = tasks.filter(t => !t.done && !t.skipped);
    if (activeTasks.length === 0) { showToast("No tasks to plan. Add some first.", "info"); return; }
    setPlannerLoading(true);
    setPlannerResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a brutal, no-nonsense 80/20 productivity coach. The user's peak energy is: ${plannerEnergy}.
Their tasks for today:
${activeTasks.map((t, i) => `${i + 1}. ${t.text}`).join("\n")}

Apply the 80/20 rule: identify the top 20% of tasks (max 2-3) that will create 80% of the results. 
Be direct and mean if needed. No fluff.

Respond ONLY as valid JSON, no markdown, no backticks:
{
  "top20": [list of task numbers that are the critical 20%],
  "schedule": [
    { "taskNum": 1, "timeBlock": "morning/afternoon/evening", "reason": "one brutal sentence why" }
  ],
  "coachNote": "one savage but motivating sentence about their task list overall"
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPlannerResult({ ...parsed, tasks: activeTasks });
    } catch {
      showToast("AI planner failed. Try again.", "info");
    }
    setPlannerLoading(false);
  }

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const active = tasks.filter(t => !t.done && !t.skipped && !t.carriedOver).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const pctColor = pct === 100 ? "#34D399" : pct >= 60 ? "#FB923C" : pct >= 30 ? "#f97316" : "#F87171";
  const lv = getLevelInfo(stats.totalXP);
  const lvPct = Math.min(100, ((stats.totalXP - lv.min) / (lv.max - lv.min)) * 100);
  const sorted = [...tasks].sort((a, b) => {
    if (a.done && !b.done) return 1;
    if (!a.done && b.done) return -1;
    return (toMin(a.startTime) || 9999) - (toMin(b.startTime) || 9999);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1C1917", color: "#FEF3C7", fontFamily: "'system-ui','-apple-system','sans-serif'", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>

      {/* HEADER — warm sunrise signature */}
      <div style={{ background: "linear-gradient(160deg,#2D1B10 0%,#1C1917 60%,#1A2018 100%)", padding: "40px 24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "radial-gradient(circle,#FB923C25,transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, background: "radial-gradient(circle,#34D39915,transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#FB923C", fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>Daily Grind</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#FEF3C7", letterSpacing: -0.5, lineHeight: 1.2 }}>
              {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <StatPill val={stats.streak + "🔥"} lbl="STREAK" color="#FBBF24" />
            <StatPill val={stats.totalXP + " XP"} lbl="EARNED" color="#FB923C" />
          </div>
        </div>

        {/* Level bar */}
        <div style={{ marginTop: 18, background: "#292524", border: "1px solid #3C3734", borderRadius: 18, padding: "14px 18px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#FBBF24" }}>Lv.{lv.level} — {lv.title}</span>
            <span style={{ fontSize: 12, color: "#78716C" }}>{stats.totalXP} / {lv.max} XP</span>
          </div>
          <div style={{ height: 8, background: "#1C1917", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: lvPct + "%", background: "linear-gradient(90deg,#FBBF24,#FB923C)", borderRadius: 99, transition: "width .6s", boxShadow: "0 0 12px #FB923C50" }} />
          </div>
        </div>

        {total > 0 && view === "tasks" && (
          <div style={{ marginTop: 14, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: "#A8A29E" }}>{done} done · {active} left</span>
              <span style={{ fontWeight: 800, color: pctColor }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: "#3C3734", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: pctColor, borderRadius: 99, transition: "width .5s" }} />
            </div>
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={{ display: "flex", margin: "12px 16px 0", background: "#2A2320", borderRadius: 14, padding: 4, border: "1px solid #3D3530", overflowX: "auto" }}>
        {[["tasks","📋"],["journal","📸"],["projects","📚"],["planner","🧠"],["cards","🎴"],["share","👤"]].map(([v, lbl]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, minWidth: 48, padding: "9px 4px", border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 13, fontWeight: 800, transition: "all .2s", whiteSpace: "nowrap",
            background: view === v ? "linear-gradient(135deg,#F4845F,#FBBF24)" : "transparent",
            color: view === v ? "#1C1410" : "#5C4838",
          }}>{lbl}</button>
        ))}
      </div>

      {/* TASKS */}
      {view === "tasks" && (
        <div style={{ padding: "14px 20px" }}>

          {/* FOCUS / POMODORO BLOCK */}
          {!focusActive ? (
            // ── Mode picker ──
            <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 12 }}>FOCUS MODE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Free", sub: "No timer", mode: null, icon: "⏱", color: "#FB923C" },
                  { label: "25 / 5", sub: "Pomodoro", mode: "25/5", icon: "🍅", color: "#F87171" },
                  { label: "50 / 10", sub: "Deep work", mode: "50/10", icon: "🔬", color: "#22D3EE" },
                ].map(({ label, sub, mode, icon, color }) => (
                  <button key={label} onClick={() => startFocus(mode)} style={{
                    padding: "12px 8px", background: color + "15", border: "1px solid " + color + "40",
                    borderRadius: 12, cursor: "pointer", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color }}>{label}</div>
                    <div style={{ fontSize: 10, color: "#78716C", marginTop: 2 }}>{sub}</div>
                  </button>
                ))}
              </div>
              {stats.totalFocusSecs > 0 && (
                <div style={{ marginTop: 10, fontSize: 11, color: "#78716C", textAlign: "center" }}>
                  Total banked: {fmtDuration(stats.totalFocusSecs || 0)}
                </div>
              )}
            </div>
          ) : (
            // ── Active session ──
            <div style={{
              background: pomodoroPhase === "break"
                ? "linear-gradient(135deg,#1E1A30,#1A1830)"
                : "linear-gradient(135deg,#064E3B,#065F46)",
              border: "1px solid " + (pomodoroPhase === "break" ? "#1e3a5f" : "#065F46"),
              borderRadius: 16, padding: "16px 20px", marginBottom: 14,
            }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: pomodoroPhase === "break" ? "#60a5fa" : "#34D399" }}>
                    {pomodoroMode
                      ? `${pomodoroMode} POMODORO · ${pomodoroPhase === "work" ? "WORK" : "BREAK"}`
                      : "● FREE FOCUS LIVE"}
                  </div>
                  {pomodoroMode && pomodoroRounds > 0 && (
                    <div style={{ fontSize: 11, color: "#78716C", marginTop: 2 }}>
                      {pomodoroRounds} round{pomodoroRounds > 1 ? "s" : ""} complete
                    </div>
                  )}
                </div>
                <button onClick={stopFocus} style={{
                  padding: "8px 14px", background: "#7F1D1D", border: "1px solid #ef4444",
                  borderRadius: 10, color: "#FECACA", fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}>⏹ Stop</button>
              </div>

              {/* Timer display */}
              {pomodoroMode ? (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* SVG ring */}
                  {(() => {
                    const [workMins, breakMins] = pomodoroMode === "25/5" ? [25, 5] : [50, 10];
                    const total = (pomodoroPhase === "work" ? workMins : breakMins) * 60;
                    const pct = total > 0 ? pomodoroSecs / total : 0;
                    const r = 30, circ = 2 * Math.PI * r;
                    const ringColor = pomodoroPhase === "break" ? "#60a5fa" : "#34D399";
                    const mins = Math.floor(pomodoroSecs / 60), secs = pomodoroSecs % 60;
                    return (
                      <>
                        <svg width="80" height="80" style={{ flexShrink: 0 }}>
                          <circle cx="40" cy="40" r={r} fill="none" stroke="#2E2B39" strokeWidth="6" />
                          <circle cx="40" cy="40" r={r} fill="none" stroke={ringColor} strokeWidth="6"
                            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                            strokeLinecap="round" transform="rotate(-90 40 40)"
                            style={{ transition: "stroke-dashoffset 1s linear" }} />
                          <text x="40" y="45" textAnchor="middle" fill={ringColor} fontSize="14" fontWeight="900" fontFamily="system-ui">
                            {pad2(mins)}:{pad2(secs)}
                          </text>
                        </svg>
                        <div>
                          <div style={{ fontSize: 28, fontWeight: 900, color: ringColor, fontVariantNumeric: "tabular-nums" }}>
                            {pad2(mins)}:{pad2(secs)}
                          </div>
                          <div style={{ fontSize: 12, color: "#78716C", marginTop: 2 }}>
                            {pomodoroPhase === "work" ? "Stay focused" : "Rest up ☕"}
                          </div>
                          {/* Round dots */}
                          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                            {Array.from({ length: Math.min(pomodoroRounds + 1, 8) }).map((_, i) => (
                              <div key={i} style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: i < pomodoroRounds ? ringColor : ringColor + "40",
                              }} />
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div style={{ fontSize: 32, fontWeight: 900, color: "#6EE7B7", fontVariantNumeric: "tabular-nums" }}>
                  {fmtDuration(focusSecs)}
                </div>
              )}
            </div>
          )}

          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#57534E" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 700, color: "#78716C", marginBottom: 4 }}>Nothing here yet.</div>
              <div style={{ fontSize: 13 }}>Add something. Big or small, it all counts.</div>
            </div>
          )}

          {/* Section: active */}
          {sorted.filter(t => !t.done && !t.skipped && !t.carriedOver).length > 0 && (
            <SectionLabel label="TO DO" />
          )}
          {sorted.filter(t => !t.done && !t.skipped && !t.carriedOver).map(t => (
            <TaskCard key={t.id} task={t}
              onToggle={toggleDone}
              onNotToday={markNotToday}
              onCarryOver={carryOver}
              onEdit={() => setEditTask(t)}
              onDelete={deleteTask}
            />
          ))}

          {/* Section: carried over */}
          {sorted.filter(t => t.carriedOver).length > 0 && (
            <>
              <SectionLabel label="MOVED TO TOMORROW" color="#FB923C" />
              {sorted.filter(t => t.carriedOver).map(t => (
                <TaskCard key={t.id} task={t} faded
                  onToggle={toggleDone}
                  onEdit={() => setEditTask(t)}
                  onDelete={deleteTask}
                  onReschedule={(s, e) => rescheduleTask(t.id, s, e)}
                />
              ))}
            </>
          )}

          {/* Section: not today */}
          {sorted.filter(t => t.skipped).length > 0 && (
            <>
              <SectionLabel label="NOT TODAY" color="#78716C" />
              {sorted.filter(t => t.skipped).map(t => (
                <TaskCard key={t.id} task={t} faded
                  onToggle={toggleDone}
                  onEdit={() => setEditTask(t)}
                  onDelete={deleteTask}
                />
              ))}
            </>
          )}

          {/* Section: done */}
          {sorted.filter(t => t.done).length > 0 && (
            <>
              <SectionLabel label="DONE ✓" color="#34D399" />
              {sorted.filter(t => t.done).map(t => (
                <TaskCard key={t.id} task={t} faded
                  onToggle={toggleDone}
                  onDelete={deleteTask}
                />
              ))}
            </>
          )}

          <button onClick={() => setShowAdd(true)} style={{
            width: "100%", marginTop: 16, padding: 18,
            background: "linear-gradient(135deg, #2A2320, #332820)",
            border: "2px dashed #5C4838", borderRadius: 20,
            color: "#8C7E74", fontSize: 15, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            transition: "all .2s",
          }}>
            <span style={{ width: 28, height: 28, background: "linear-gradient(135deg,#F4845F,#FBBF24)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#1C1410", fontWeight: 900 }}>+</span>
            Add a task
          </button>

          {total > 0 && (
            <div style={{ marginTop: 20, background: "#2A2320", border: "1px solid #3D3530", borderRadius: 18, padding: "14px 18px", fontSize: 13, color: "#A09080", lineHeight: 1.6, textAlign: "center" }}>
              {pct === 100
                ? "🎉 Everything done. That's genuinely rare. Be proud."
                : done === 0
                ? "Every task you avoid is a task saved for future you. Be kind to them."
                : `${done} done is still ${done} done. Keep going.`}
            </div>
          )}
        </div>
      )}

      {/* JOURNAL */}
      {view === "journal" && (
        <JournalView photos={photos} tasks={tasks} onUpload={handlePhotoUpload} onDismiss={dismissPhotoPrompt} stats={stats} />
      )}

      {/* PROJECTS */}
      {view === "projects" && (
        <ProjectsView projects={projects} onAdd={() => setShowAddProject(true)} onLog={id => setShowLogEntry(id)} onDelete={deleteProject} />
      )}

      {/* PLANNER */}
      {view === "planner" && (
        <PlannerView tasks={tasks} energy={plannerEnergy} setEnergy={setPlannerEnergy} result={plannerResult} loading={plannerLoading} onRun={runAIPlanner} />
      )}

      {/* CARDS */}
      {view === "cards" && <CardsView stats={stats} />}

      {/* HISTORY */}
      {view === "history" && <HistoryView />}

      {/* REWARDS */}
      {view === "rewards" && <RewardsView stats={stats} />}

      {/* SHARE */}
      {view === "share" && (
        <ShareView stats={stats} tasks={tasks} userName={userName} setUserName={n => { setUserName(n); localStorage.setItem("dg_name", n); }} />
      )}

      {/* MODALS */}
      {showAdd && <TaskModal onSave={addTask} onClose={() => setShowAdd(false)} />}
      {editTask && <TaskModal task={editTask} onSave={t => updateTask(editTask.id, t)} onClose={() => setEditTask(null)} />}
      {reward && <RewardPopup reward={reward} onClose={() => setReward(null)} />}
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      {toast && <Toast toast={toast} />}
      {newDayScreen && <NewDayScreen data={newDayScreen} onAction={handleNewDay} />}
      {tabAwayRoast && <TabAwayOverlay msg={tabAwayRoast} onDismiss={() => setTabAwayRoast(null)} />}
      {showCheckin && checkin && <MorningCheckin data={checkin} onSubmit={submitCheckin} onClose={() => setShowCheckin(false)} />}
      {photoPrompt && <PhotoPromptOverlay onUpload={e => handlePhotoUpload(e, todayStr())} onDismiss={dismissPhotoPrompt} />}
      {showAddProject && <AddProjectModal onSave={addProject} onClose={() => setShowAddProject(false)} />}
      {showLogEntry && <LogEntryModal project={projects.find(p => p.id === showLogEntry)} onSave={(u,n) => logProjectEntry(showLogEntry, u, n)} onClose={() => setShowLogEntry(null)} />}

      <style>{`
        *{box-sizing:border-box}
        input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:.4}
        input:focus{outline:none;border-color:#6366f1!important}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{0%{transform:scale(.75);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>
    </div>
  );
}

// ── NEW DAY SCREEN ────────────────────────────────────────────────────────────

function NewDayScreen({ data, onAction }) {
  const dayLabel = new Date(data.date + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" });
  const focusLabel = data.focusSecs > 0 ? fmtDuration(data.focusSecs) : null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "#1C1917", zIndex: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .4s" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🌅</div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#FB923C", fontWeight: 700, marginBottom: 6 }}>NEW DAY</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#FEF3C7", marginBottom: 4 }}>
            {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <div style={{ fontSize: 13, color: "#78716C" }}>Yesterday was {dayLabel}</div>
        </div>

        {/* Yesterday recap */}
        <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 12 }}>YESTERDAY'S RECAP</div>
          <div style={{ display: "flex", gap: 16, marginBottom: focusLabel ? 12 : 0 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#34D399" }}>{data.doneTasks.length}</div>
              <div style={{ fontSize: 10, color: "#78716C", fontWeight: 600 }}>COMPLETED</div>
            </div>
            <div style={{ width: 1, background: "#3C3734" }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: data.pendingTasks.length > 0 ? "#f97316" : "#57534E" }}>
                {data.pendingTasks.length}
              </div>
              <div style={{ fontSize: 10, color: "#78716C", fontWeight: 600 }}>UNFINISHED</div>
            </div>
            {focusLabel && <>
              <div style={{ width: 1, background: "#3C3734" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#22D3EE" }}>{focusLabel}</div>
                <div style={{ fontSize: 10, color: "#78716C", fontWeight: 600 }}>FOCUSED</div>
              </div>
            </>}
          </div>
          {data.doneTasks.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#34D399", fontWeight: 600, textAlign: "center" }}>
              {data.doneTasks.length === 1
                ? "You got one done. That's one more than nothing."
                : data.doneTasks.length >= 5
                ? "Look at you. Actually showed up yesterday. Respect."
                : "Solid work. Not perfect, but real."}
            </div>
          )}
        </div>

        {/* Pending tasks */}
        {data.pendingTasks.length > 0 && (
          <div style={{ background: "#231F1D", border: "1px solid #2a2a38", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#f97316", marginBottom: 10 }}>
              UNFINISHED BUSINESS ({data.pendingTasks.length})
            </div>
            {data.pendingTasks.slice(0, 4).map(t => (
              <div key={t.id} style={{ fontSize: 13, color: "#A8A29E", padding: "5px 0", borderBottom: "1px solid #1a1a24" }}>
                · {t.text}
              </div>
            ))}
            {data.pendingTasks.length > 4 && (
              <div style={{ fontSize: 12, color: "#57534E", marginTop: 6 }}>+{data.pendingTasks.length - 4} more</div>
            )}
          </div>
        )}

        {/* Actions */}
        {data.pendingTasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => onAction("carry")} style={{
              padding: 16, background: "#2A2550", border: "1px solid #6366f1", borderRadius: 14,
              color: "#FED7AA", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              📅 Carry over unfinished tasks
            </button>
            <button onClick={() => onAction("clear")} style={{
              padding: 16, background: "#292524", border: "1px solid #2a2a38", borderRadius: 14,
              color: "#78716C", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              🗑 Fresh start — clear everything
            </button>
          </div>
        ) : (
          <button onClick={() => onAction("clear")} style={{
            width: "100%", padding: 16, background: "linear-gradient(135deg,#2A1A0E,#064E3B)",
            border: "1px solid #6366f1", borderRadius: 14,
            color: "#FEF3C7", fontSize: 15, fontWeight: 800, cursor: "pointer",
          }}>
            🌅 Start today
          </button>
        )}
      </div>
    </div>
  );
}

// ── TAB AWAY OVERLAY ──────────────────────────────────────────────────────────

function TabAwayOverlay({ msg, onDismiss }) {
  return (
    <div onClick={onDismiss} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 700,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "fadeIn .3s",
    }}>
      <div style={{
        background: "#231F1D", border: "2px solid #ef4444", borderRadius: 20,
        padding: "32px 28px", maxWidth: 320, width: "100%", textAlign: "center",
        animation: "popIn .4s ease", boxShadow: "0 0 60px #ef444430",
      }}>
        <div style={{ fontSize: 52, marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>👀</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#F87171", marginBottom: 8 }}>FOCUS PAUSED</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#FEF3C7", marginBottom: 10, lineHeight: 1.5 }}>"{msg}"</div>
        <div style={{ fontSize: 12, color: "#78716C", marginBottom: 18 }}>Timer stopped while you were gone.</div>
        <button onClick={onDismiss} style={{
          width: "100%", padding: "12px", background: "#064E3B", border: "1px solid #22c55e",
          borderRadius: 10, color: "#6EE7B7", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>▶ Resume Focus</button>
      </div>
    </div>
  );
}

// ── MORNING CHECK-IN ─────────────────────────────────────────────────────────

function MorningCheckin({ data, onSubmit, onClose }) {
  const [ans, setAns] = useState(data.answer || "");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .3s" }}>
      <div style={{ maxWidth: 400, width: "100%", background: "#231F1D", border: "1px solid #2a2a38", borderRadius: 24, padding: "28px 24px" }}>
        {!data.aiReply ? (
          <>
            <div style={{ fontSize: 32, textAlign: "center", marginBottom: 16 }}>🌅</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#FB923C", textAlign: "center", marginBottom: 10 }}>MORNING CHECK-IN</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#FEF3C7", textAlign: "center", lineHeight: 1.5, marginBottom: 20 }}>
              {data.question}
            </div>
            <textarea
              value={ans}
              onChange={e => setAns(e.target.value)}
              placeholder="Be honest..."
              autoFocus
              style={{ width: "100%", background: "#1C1917", border: "1px solid #2a2a38", borderRadius: 12, padding: "12px 14px", color: "#FDE68A", fontSize: 14, resize: "none", height: 90, marginBottom: 14, boxSizing: "border-box" }}
            />
            <button onClick={() => onSubmit(ans)} disabled={data.loading} style={{
              width: "100%", padding: 14, background: ans.trim() ? "#FB923C" : "#2E2B29",
              border: "none", borderRadius: 12, color: ans.trim() ? "#fff" : "#57534E",
              fontSize: 14, fontWeight: 700, cursor: ans.trim() ? "pointer" : "default", marginBottom: 10,
            }}>
              {data.loading ? "Thinking..." : "Send"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: 10, background: "none", border: "none", color: "#57534E", fontSize: 13, cursor: "pointer" }}>
              Skip for today
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#FB923C", marginBottom: 12 }}>YOUR COACH</div>
            <div style={{ fontSize: 13, color: "#A8A29E", fontStyle: "italic", marginBottom: 14, lineHeight: 1.6 }}>
              You said: "{data.answer}"
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#FEF3C7", lineHeight: 1.7, marginBottom: 24 }}>
              {data.aiReply}
            </div>
            <button onClick={onClose} style={{
              width: "100%", padding: 14, background: "linear-gradient(135deg,#2A1A0E,#064E3B)",
              border: "1px solid #6366f1", borderRadius: 12, color: "#FEF3C7",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              Let's go 🔥
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── SHARE VIEW ────────────────────────────────────────────────────────────────

function ShareView({ stats, tasks, userName, setUserName }) {
  const [editingName, setEditingName] = useState(!userName);
  const [nameInput, setNameInput] = useState(userName);
  const lv = getLevelInfo(stats.totalXP);
  const topCards = Object.entries(stats.categoryStreaks || {})
    .sort((a,b) => b[1]-a[1]).slice(0,3)
    .map(([id, streak]) => ({ cat: SKILL_CATEGORIES.find(c=>c.id===id), streak, tier: getCardTier(streak) }))
    .filter(x => x.cat && x.tier);
  const doneTasks = tasks.filter(t => t.done).length;
  const today = new Date().toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ padding: "14px 20px" }}>
      {/* Name setup */}
      {editingName ? (
        <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#78716C", marginBottom: 8 }}>WHAT'S YOUR NAME?</div>
          <input value={nameInput} onChange={e => setNameInput(e.target.value)}
            placeholder="Your name or nickname"
            style={{ width: "100%", background: "#1C1917", border: "1px solid #2a2a38", borderRadius: 10, padding: "10px 14px", color: "#FDE68A", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
          <button onClick={() => { if (nameInput.trim()) { setUserName(nameInput.trim()); setEditingName(false); } }} style={{
            width: "100%", padding: 12, background: "#FB923C", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer"
          }}>Save</button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#FEF3C7" }}>👤 {userName}</div>
          <button onClick={() => setEditingName(true)} style={{ background: "none", border: "1px solid #2a2a38", borderRadius: 8, color: "#78716C", fontSize: 11, padding: "4px 10px", cursor: "pointer" }}>Edit</button>
        </div>
      )}

      {/* Share card */}
      <div id="share-card" style={{
        background: "linear-gradient(135deg, #0f0f1e, #1a0a2e)",
        border: "1px solid #6366f1",
        borderRadius: 20, padding: "24px 20px",
        boxShadow: "0 0 40px #6366f130",
        marginBottom: 16,
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#FB923C", fontWeight: 700, marginBottom: 4 }}>DAILY GRIND</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#FEF3C7" }}>{userName || "Grinder"}</div>
            <div style={{ fontSize: 11, color: "#78716C", marginTop: 2 }}>{today}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#eab308" }}>Lv.{lv.level}</div>
            <div style={{ fontSize: 11, color: "#eab308", fontWeight: 700 }}>{lv.title}</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { val: stats.streak + "🔥", lbl: "STREAK" },
            { val: stats.totalXP, lbl: "TOTAL XP" },
            { val: stats.totalDone, lbl: "TASKS DONE" },
          ].map(({ val, lbl }) => (
            <div key={lbl} style={{ flex: 1, background: "#ffffff08", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FEF3C7" }}>{val}</div>
              <div style={{ fontSize: 9, color: "#78716C", fontWeight: 700, letterSpacing: 1 }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Skill cards */}
        {topCards.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 10 }}>TOP SKILLS</div>
            <div style={{ display: "flex", gap: 8 }}>
              {topCards.map(({ cat, streak, tier }) => (
                <div key={cat.id} style={{
                  flex: 1, background: cat.color + "15", border: "1px solid " + tier.color,
                  borderRadius: 12, padding: "10px 8px", textAlign: "center",
                  boxShadow: "0 0 10px " + tier.glow,
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: cat.color }}>{cat.label}</div>
                  <div style={{ fontSize: 9, color: tier.color, marginTop: 2 }}>{tier.label}</div>
                  <div style={{ fontSize: 9, color: "#78716C" }}>{streak}d</div>
                </div>
              ))}
            </div>
          </>
        )}

        {topCards.length === 0 && (
          <div style={{ textAlign: "center", padding: "12px 0", color: "#57534E", fontSize: 12 }}>
            Complete tasks with skill categories to show your cards here.
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #2a2a38", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#57534E" }}>dailygrind-gamma.vercel.app</div>
        </div>
      </div>

      {/* Share instructions */}
      <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#FEF3C7", marginBottom: 8 }}>📸 Share your progress</div>
        <div style={{ fontSize: 12, color: "#A8A29E", lineHeight: 1.7 }}>
          Take a screenshot of your card above and send it to your friends. Show them who you're becoming.
        </div>
      </div>

      {/* Today's summary */}
      <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 10 }}>TODAY</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#34D399" }}>{doneTasks}</div>
            <div style={{ fontSize: 10, color: "#78716C" }}>DONE</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FB923C" }}>{tasks.filter(t=>!t.done&&!t.skipped).length}</div>
            <div style={{ fontSize: 10, color: "#78716C" }}>REMAINING</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#eab308" }}>{stats.totalXP}</div>
            <div style={{ fontSize: 10, color: "#78716C" }}>XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PHOTO PROMPT OVERLAY ──────────────────────────────────────────────────────

function PhotoPromptOverlay({ onUpload, onDismiss }) {
  const fileRef = useRef(null);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 700, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0", animation: "fadeIn .3s" }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#231E1A", borderRadius: "24px 24px 0 0", padding: "26px 22px 44px", border: "1px solid #3D3530", borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, background: "#3D3530", borderRadius: 99, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 10 }}>📸</div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#FBBF24", textAlign: "center", marginBottom: 8 }}>PHOTO OF THE DAY</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#FFF8F2", textAlign: "center", marginBottom: 6, lineHeight: 1.4 }}>What defined today for you?</div>
        <div style={{ fontSize: 13, color: "#A09080", textAlign: "center", marginBottom: 22, lineHeight: 1.6 }}>
          One photo. Your whole day in one frame. Could be your gym, your meal, your desk — anything that felt like the win.
        </div>
        <div onClick={() => fileRef.current?.click()} style={{ height: 120, background: "#201C19", border: "2px dashed #3D3530", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
          <div style={{ fontSize: 32 }}>📷</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#8C7E74" }}>Tap to choose photo</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onUpload} />
        <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 16, color: "#1C1410", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10, boxShadow: "0 8px 24px #F4845F40" }}>
          Choose from Gallery
        </button>
        <button onClick={onDismiss} style={{ width: "100%", padding: 12, background: "none", border: "none", color: "#5C4838", fontSize: 13, cursor: "pointer" }}>Not today</button>
      </div>
    </div>
  );
}

// ── JOURNAL VIEW ──────────────────────────────────────────────────────────────

function JournalView({ photos, tasks, onUpload, onDismiss, stats }) {
  const fileRef = useRef(null);
  const [pickingDate, setPickingDate] = useState(null);
  const [weeklyPick, setWeeklyPick] = useState(null);
  const [showWeeklyAI, setShowWeeklyAI] = useState(false);
  const weekDates = getWeekDates();
  const today = todayStr();
  const todayPhoto = photos[today];
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthWeeks = getMonthWeeks();

  // Week stats for AI picks
  const weekWithData = weekDates.map((d, i) => ({
    date: d, day: DAYS[i], photo: photos[d],
    done: tasks.filter(t => t.done).length,
  }));
  const photoDays = weekWithData.filter(d => d.photo);

  return (
    <div style={{ padding: "14px 20px" }}>

      {/* Today's photo */}
      <div style={{ background: "#2A2320", border: `1.5px solid ${todayPhoto ? "#FBBF24" : "#3D3530"}`, borderRadius: 22, padding: "18px 18px", marginBottom: 16, boxShadow: todayPhoto ? "0 0 24px #FBBF2420" : "none" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#FBBF24", marginBottom: 8 }}>📸 TODAY'S PHOTO</div>
        {todayPhoto ? (
          <div style={{ position: "relative" }}>
            <img src={todayPhoto.src} alt="today" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 14 }} />
            <button onClick={() => { setPickingDate(today); fileRef.current?.click(); }} style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.6)", border: "1px solid #3D3530", borderRadius: 10, color: "#FFF8F2", fontSize: 11, fontWeight: 700, padding: "6px 12px", cursor: "pointer" }}>
              Change
            </button>
          </div>
        ) : (
          <div onClick={() => { setPickingDate(today); fileRef.current?.click(); }} style={{ height: 140, background: "#201C19", border: "2px dashed #3D3530", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
            <div style={{ fontSize: 32 }}>📷</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#8C7E74" }}>Pick today's photo</div>
            <div style={{ fontSize: 11, color: "#5C4838" }}>Capture your defining moment</div>
          </div>
        )}
      </div>

      {/* This week grid */}
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#8C7E74", marginBottom: 12 }}>THIS WEEK</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 20 }}>
        {weekDates.map((d, i) => {
          const photo = photos[d];
          const isToday = d === today;
          return (
            <div key={d} onClick={() => { setPickingDate(d); fileRef.current?.click(); }} style={{ cursor: "pointer" }}>
              <div style={{
                aspectRatio: "1", borderRadius: 12, overflow: "hidden",
                border: `1.5px solid ${isToday ? "#FBBF24" : photo ? "#F4845F40" : "#3D3530"}`,
                background: "#201C19",
                boxShadow: isToday ? "0 0 8px #FBBF2440" : "none",
              }}>
                {photo
                  ? <img src={photo.src} alt={d} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#3D3530" }}>+</div>
                }
              </div>
              <div style={{ fontSize: 8, color: isToday ? "#FBBF24" : "#5C4838", fontWeight: 700, textAlign: "center", marginTop: 3 }}>{DAYS[i]}</div>
            </div>
          );
        })}
      </div>

      {/* Weekly AI pick */}
      {photoDays.length >= 3 && (
        <div style={{ background: "#2A2320", border: "1px solid #3D3530", borderRadius: 20, padding: "16px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showWeeklyAI ? 14 : 0 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#A78BFA", marginBottom: 2 }}>PICK OF THE WEEK</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF8F2" }}>AI suggests your best moment</div>
            </div>
            <button onClick={() => setShowWeeklyAI(s => !s)} style={{ padding: "8px 14px", background: "#A78BFA20", border: "1px solid #A78BFA50", borderRadius: 10, color: "#A78BFA", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
              {showWeeklyAI ? "Hide" : "See picks"}
            </button>
          </div>
          {showWeeklyAI && (
            <div>
              <div style={{ fontSize: 12, color: "#8C7E74", marginBottom: 12, fontStyle: "italic", lineHeight: 1.6 }}>
                "You captured {photoDays.length} days this week. Pick your favourite moment to represent the week:"
              </div>
              {photoDays.slice(0, 3).map((d, i) => (
                <div key={d.date} onClick={() => setWeeklyPick(i)} style={{ display: "flex", gap: 12, padding: "10px 12px", borderRadius: 14, background: weeklyPick === i ? "#A78BFA20" : "#201C19", border: `1.5px solid ${weeklyPick === i ? "#A78BFA" : "#3D3530"}`, marginBottom: 8, cursor: "pointer", transition: "all .2s" }}>
                  <img src={d.photo.src} alt={d.day} style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#FFF8F2", marginBottom: 2 }}>{d.day} {i === 0 ? "⭐" : ""}</div>
                    <div style={{ fontSize: 11, color: "#8C7E74" }}>{i === 0 ? "Your most recent capture" : i === 1 ? "Earlier in the week" : "Start of your week"}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${weeklyPick === i ? "#A78BFA" : "#3D3530"}`, background: weeklyPick === i ? "#A78BFA" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {weeklyPick === i && <span style={{ fontSize: 10, color: "#fff" }}>✓</span>}
                  </div>
                </div>
              ))}
              {weeklyPick !== null && (
                <button onClick={() => { showToast("Photo of the week saved!", "success"); setShowWeeklyAI(false); }} style={{ width: "100%", marginTop: 8, padding: 13, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 14, color: "#1C1410", fontWeight: 900, fontSize: 14, cursor: "pointer" }}>
                  Set as Photo of the Week ✓
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Monthly grid */}
      <div style={{ background: "#2A1E30", border: "1px solid #A78BFA30", borderRadius: 20, padding: "16px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#A78BFA", marginBottom: 12 }}>
          {new Date().toLocaleString("en", { month: "long" }).toUpperCase()} — YOUR MONTH
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
          {monthWeeks.map((w, i) => {
            const photo = photos[w];
            return (
              <div key={w} style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", border: `1px solid ${photo ? "#A78BFA50" : "#3D3530"}`, background: "#201C19" }}>
                {photo
                  ? <img src={photo.src} alt={`W${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                      <div style={{ fontSize: 11, color: "#3D3530" }}>W{i+1}</div>
                    </div>
                }
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: "#8C7E74", lineHeight: 1.7, fontStyle: "italic" }}>
          {Object.keys(photos).length === 0
            ? "Start capturing your days. Your month story builds itself."
            : `${Object.keys(photos).length} days captured so far. Keep going.`}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => onUpload(e, pickingDate)} />
    </div>
  );
}

// ── PROJECTS VIEW ─────────────────────────────────────────────────────────────

function ProjectsView({ projects, onAdd, onLog, onDelete }) {
  const [expanded, setExpanded] = useState(null);
  const CATEGORY_COLORS = { fitness: "#34D399", learning: "#A78BFA", coding: "#60A5FA", cooking: "#F97316", mindfulness: "#22C55E", finance: "#FBBF24", creative: "#EC4899", social: "#F59E0B" };
  const CATEGORY_ICONS  = { fitness: "🏃", learning: "📖", coding: "💻", cooking: "🍳", mindfulness: "🧘", finance: "💰", creative: "🎨", social: "🤝" };

  if (projects.length === 0) {
    return (
      <div style={{ padding: "20px 20px" }}>
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#5C4838" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#8C7E74", marginBottom: 6 }}>No long-term projects yet.</div>
          <div style={{ fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Big goals don't fit in a daily task. Track your books, runs, courses — anything that takes weeks.</div>
        </div>
        <button onClick={onAdd} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 16, color: "#1C1410", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 24px #F4845F40" }}>
          + Start a Project
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: "#8C7E74" }}>LONG-TERM PROJECTS</div>
        <button onClick={onAdd} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 10, color: "#1C1410", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>+ New</button>
      </div>

      {projects.map(p => {
        const color = CATEGORY_COLORS[p.category] || "#F4845F";
        const icon  = CATEGORY_ICONS[p.category]  || "📌";
        const pct   = Math.min(Math.round((p.done / p.total) * 100), 100);
        const isOpen = expanded === p.id;
        const remaining = p.total - p.done;

        // Auto milestones at 25/50/75/100%
        const milestones = p.milestones || [
          { label: `First 25%`,   target: Math.ceil(p.total * 0.25), done: p.done >= Math.ceil(p.total * 0.25) },
          { label: `Halfway`,     target: Math.ceil(p.total * 0.5),  done: p.done >= Math.ceil(p.total * 0.5)  },
          { label: `Almost there`,target: Math.ceil(p.total * 0.75), done: p.done >= Math.ceil(p.total * 0.75) },
          { label: `Complete!`,   target: p.total,                   done: p.done >= p.total                    },
        ];
        const currentMilestone = milestones.find(m => !m.done);

        return (
          <div key={p.id} style={{ background: "#2A2320", border: `1.5px solid ${isOpen ? color : "#3D3530"}`, borderRadius: 22, marginBottom: 14, overflow: "hidden", boxShadow: isOpen ? `0 0 28px ${color}25` : "none", transition: "all .3s" }}>

            {/* Header */}
            <div onClick={() => setExpanded(isOpen ? null : p.id)} style={{ padding: "16px 18px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: color + "20", border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#FFF8F2", marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: "#8C7E74" }}>{p.done} / {p.total} {p.unit} · {pct}%</div>
                </div>
                <div style={{ fontSize: 18, color: "#5C4838", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>⌄</div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 8, background: "#1C1410", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg,${color},${color}AA)`, borderRadius: 99, transition: "width .6s", boxShadow: `0 0 8px ${color}60` }} />
              </div>

              {/* Milestone segments */}
              <div style={{ display: "flex", gap: 4 }}>
                {milestones.map((m, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: m.done ? color : "#3D3530", transition: "background .3s" }} />
                ))}
              </div>
            </div>

            {/* Expanded */}
            {isOpen && (
              <div style={{ borderTop: "1px solid #3D3530", padding: "16px 18px" }}>

                {/* Current milestone */}
                {currentMilestone && (
                  <div style={{ background: color + "12", border: `1px solid ${color}30`, borderRadius: 14, padding: "10px 14px", marginBottom: 16 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color, marginBottom: 4 }}>NEXT MILESTONE</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF8F2" }}>{currentMilestone.label}</div>
                    <div style={{ fontSize: 11, color: "#8C7E74", marginTop: 2 }}>{currentMilestone.target - p.done} {p.unit} to go</div>
                  </div>
                )}

                {pct === 100 && (
                  <div style={{ background: "#14401A", border: "1px solid #34D399", borderRadius: 14, padding: "12px 14px", marginBottom: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#34D399" }}>Project Complete!</div>
                  </div>
                )}

                {/* Milestones */}
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "#8C7E74", marginBottom: 10 }}>MILESTONES</div>
                {milestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 99, background: m.done ? color : "transparent", border: `2px solid ${m.done ? color : "#3D3530"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {m.done && <span style={{ fontSize: 10, color: "#1C1410", fontWeight: 900 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, fontSize: 12, color: m.done ? "#5C4838" : "#FFF8F2", fontWeight: m.done ? 400 : 700, textDecoration: m.done ? "line-through" : "none" }}>{m.label}</div>
                    <div style={{ fontSize: 10, color: "#5C4838" }}>{m.target} {p.unit}</div>
                  </div>
                ))}

                {/* Log button */}
                {pct < 100 && (
                  <button onClick={() => onLog(p.id)} style={{ width: "100%", padding: 13, background: color + "20", border: `1.5px solid ${color}50`, borderRadius: 14, color, fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 4, marginBottom: 14 }}>
                    + Log today's progress
                  </button>
                )}

                {/* Log entries */}
                {p.log.length > 0 && (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "#8C7E74", marginBottom: 10 }}>PROGRESS LOG</div>
                    {p.log.slice(0, 5).map((entry, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #3D3530" }}>
                        <div style={{ flexShrink: 0, minWidth: 32, textAlign: "center" }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color }}>{entry.units > 0 ? `+${entry.units}` : "—"}</div>
                          <div style={{ fontSize: 9, color: "#5C4838" }}>{p.unit}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: "#FFF8F2", lineHeight: 1.5 }}>{entry.note}</div>
                          <div style={{ fontSize: 10, color: "#5C4838", marginTop: 2 }}>{entry.date}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <button onClick={() => onDelete(p.id)} style={{ width: "100%", padding: 10, background: "none", border: "1px solid #3D3530", borderRadius: 12, color: "#5C4838", fontSize: 12, cursor: "pointer", marginTop: 4 }}>
                  Remove project
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button onClick={onAdd} style={{ width: "100%", marginTop: 4, padding: 16, background: "#2A2320", border: "2px dashed #3D3530", borderRadius: 18, color: "#5C4838", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <span style={{ width: 26, height: 26, background: "linear-gradient(135deg,#F4845F,#FBBF24)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#1C1410", fontWeight: 900 }}>+</span>
        Add another project
      </button>
    </div>
  );
}

// ── ADD PROJECT MODAL ─────────────────────────────────────────────────────────

function AddProjectModal({ onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [total, setTotal] = useState("");
  const [category, setCategory] = useState("learning");
  const [err, setErr] = useState("");
  const CATS = [
    { id: "fitness", label: "Fitness", icon: "🏃" },
    { id: "learning", label: "Learning", icon: "📖" },
    { id: "coding", label: "Coding", icon: "💻" },
    { id: "cooking", label: "Cooking", icon: "🍳" },
    { id: "creative", label: "Creative", icon: "🎨" },
    { id: "finance", label: "Finance", icon: "💰" },
  ];

  function submit() {
    if (!title.trim()) { setErr("Give your project a name."); return; }
    if (!unit.trim()) { setErr("What's the unit? (chapters, km, sessions...)"); return; }
    if (!total || isNaN(total) || Number(total) <= 0) { setErr("How many total " + (unit || "units") + "?"); return; }
    onSave({ title: title.trim(), unit: unit.trim(), total: Number(total), done: 0, category });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 300, display: "flex", alignItems: "flex-end", animation: "fadeIn .2s" }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#231E1A", borderRadius: "24px 24px 0 0", padding: "26px 22px 44px", border: "1px solid #3D3530", borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, background: "#3D3530", borderRadius: 99, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 18, fontWeight: 900, color: "#FFF8F2", marginBottom: 22 }}>New Long-Term Project</div>

        <FieldLabel>Project name</FieldLabel>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Read Atomic Habits" style={inputStyle} />

        <FieldLabel>Category</FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer", background: category === c.id ? "#F4845F30" : "#201C19", border: `1px solid ${category === c.id ? "#F4845F" : "#3D3530"}`, color: category === c.id ? "#F4845F" : "#8C7E74" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Unit</FieldLabel>
            <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="chapters / km / sessions" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Total target</FieldLabel>
            <input value={total} onChange={e => setTotal(e.target.value)} type="number" placeholder="18" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
        </div>
        <div style={{ height: 18 }} />

        {err && <div style={{ fontSize: 12, color: "#F87171", marginBottom: 12 }}>{err}</div>}
        <button onClick={submit} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 16, color: "#1C1410", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 24px #F4845F40", marginBottom: 10 }}>
          Start Project
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: 12, background: "none", border: "none", color: "#5C4838", fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── LOG ENTRY MODAL ───────────────────────────────────────────────────────────

function LogEntryModal({ project, onSave, onClose }) {
  const [units, setUnits] = useState("1");
  const [note, setNote] = useState("");
  if (!project) return null;
  const remaining = project.total - project.done;

  function submit() {
    const u = Number(units);
    if (!u || u <= 0) return;
    onSave(u, note.trim() || `+${u} ${project.unit}`);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 300, display: "flex", alignItems: "flex-end", animation: "fadeIn .2s" }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#231E1A", borderRadius: "24px 24px 0 0", padding: "26px 22px 44px", border: "1px solid #3D3530", borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, background: "#3D3530", borderRadius: 99, margin: "0 auto 22px" }} />
        <div style={{ fontSize: 18, fontWeight: 900, color: "#FFF8F2", marginBottom: 4 }}>Log Progress</div>
        <div style={{ fontSize: 13, color: "#8C7E74", marginBottom: 22 }}>{project.title} · {project.done}/{project.total} {project.unit} so far</div>

        <FieldLabel>How many {project.unit} today?</FieldLabel>
        <input value={units} onChange={e => setUnits(e.target.value)} type="number" min="0" max={remaining} placeholder="1" style={inputStyle} />

        <FieldLabel>Note <span style={{ color: "#5C4838", fontWeight: 400 }}>optional</span></FieldLabel>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How did it go? What did you notice?" style={{ ...inputStyle, height: 80, resize: "none" }} />

        <button onClick={submit} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 16, color: "#1C1410", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 24px #F4845F40", marginBottom: 10 }}>
          Log it
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: 12, background: "none", border: "none", color: "#5C4838", fontSize: 13, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// ── CARDS VIEW ────────────────────────────────────────────────────────────────

function CardsView({ stats }) {
  const catStreaks = stats.categoryStreaks || {};

  return (
    <div style={{ padding: "14px 20px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 4 }}>SKILL CARDS</div>
      <div style={{ fontSize: 12, color: "#57534E", marginBottom: 16 }}>Complete tasks in a category daily to level up your card.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {SKILL_CATEGORIES.map(cat => {
          const streak = catStreaks[cat.id] || 0;
          const tier = getCardTier(streak);
          const nextTier = getNextTier(streak);
          const locked = !tier;
          const pct = nextTier ? Math.min((streak / nextTier.days) * 100, 100) : 100;

          return (
            <div key={cat.id} style={{
              background: locked ? "#1C1917" : "linear-gradient(135deg, #0f0f18, " + cat.color + "15)",
              border: "1px solid " + (tier ? tier.color : "#2E2B29"),
              borderRadius: 16, padding: "16px 14px",
              boxShadow: tier ? "0 0 20px " + tier.glow : "none",
              transition: "all .3s",
              opacity: locked ? 0.6 : 1,
            }}>
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontSize: 28 }}>{cat.icon}</div>
                {tier ? (
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, background: tier.color + "25", color: tier.color, borderRadius: 6, padding: "3px 8px" }}>
                    {tier.label.toUpperCase()}
                  </div>
                ) : (
                  <div style={{ fontSize: 9, color: "#3C3734", fontWeight: 700 }}>LOCKED</div>
                )}
              </div>

              {/* Card name */}
              <div style={{ fontSize: 14, fontWeight: 800, color: tier ? "#FEF3C7" : "#57534E", marginBottom: 2 }}>{cat.label}</div>
              <div style={{ fontSize: 10, color: "#57534E", marginBottom: 10 }}>{cat.desc}</div>

              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: tier && i <= tier.stars ? tier.color : "#2E2B29",
                    boxShadow: tier && i <= tier.stars ? "0 0 6px " + tier.color : "none",
                  }} />
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ height: 3, background: "#2A2523", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: tier ? tier.color : "#3C3734", borderRadius: 99, transition: "width .5s" }} />
                </div>
              </div>

              {/* Streak / next */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 10, color: tier ? cat.color : "#3C3734", fontWeight: 700 }}>
                  {streak > 0 ? `${streak} day streak` : "0 days"}
                </div>
                {nextTier && (
                  <div style={{ fontSize: 9, color: "#57534E" }}>
                    {nextTier.days - streak}d to {nextTier.label}
                  </div>
                )}
                {!nextTier && tier && (
                  <div style={{ fontSize: 9, color: tier.color, fontWeight: 700 }}>MAX</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: 20, background: "#292524", border: "1px solid #2a2a38", borderRadius: 12, padding: "12px 16px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 10 }}>TIER REQUIREMENTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CARD_TIERS.map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color, width: 60 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "#78716C" }}>{t.days} consecutive days</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI PLANNER VIEW ───────────────────────────────────────────────────────────

function PlannerView({ tasks, energy, setEnergy, result, loading, onRun }) {
  const activeTasks = tasks.filter(t => !t.done && !t.skipped);
  const energyOptions = [
    { id: "morning",   icon: "🌅", label: "Morning",   sub: "Peak before noon" },
    { id: "afternoon", icon: "☀️",  label: "Afternoon", sub: "Peak 12–5pm" },
    { id: "evening",   icon: "🌙", label: "Evening",   sub: "Peak after 5pm" },
  ];
  return (
    <div style={{ padding: "14px 20px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 12 }}>80/20 AI PLANNER</div>
      <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 14, padding: 16, marginBottom: 14, fontSize: 13, color: "#A8A29E", lineHeight: 1.6 }}>
        Tell the AI your peak energy time. It'll identify the <span style={{ color: "#FB923C", fontWeight: 700 }}>top 20% of tasks</span> that will create 80% of your results — and schedule them ruthlessly.
      </div>

      {/* Energy picker */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 10 }}>WHEN ARE YOU SHARPEST TODAY?</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {energyOptions.map(({ id, icon, label, sub }) => (
          <button key={id} onClick={() => setEnergy(id)} style={{
            padding: "14px 8px", background: energy === id ? "#2A2550" : "#292524",
            border: "1px solid " + (energy === id ? "#FB923C" : "#3C3734"),
            borderRadius: 12, cursor: "pointer", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: energy === id ? "#FED7AA" : "#A8A29E" }}>{label}</div>
            <div style={{ fontSize: 9, color: "#57534E", marginTop: 2 }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Task count */}
      {activeTasks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#57534E", fontSize: 13 }}>No active tasks to plan. Add tasks first.</div>
      ) : (
        <>
          <div style={{ fontSize: 11, color: "#78716C", marginBottom: 14 }}>
            {activeTasks.length} active task{activeTasks.length > 1 ? "s" : ""} ready to be ranked.
          </div>
          <button onClick={onRun} disabled={!energy || loading} style={{
            width: "100%", padding: 16,
            background: energy ? "linear-gradient(135deg,#2A1A0E,#431407)" : "#292524",
            border: "1px solid " + (energy ? "#FB923C" : "#3C3734"),
            borderRadius: 14, color: energy ? "#FED7AA" : "#57534E",
            fontSize: 14, fontWeight: 800, cursor: energy ? "pointer" : "not-allowed", marginBottom: 16,
          }}>
            {loading ? "🧠 Thinking..." : "🧠 Generate 80/20 Plan"}
          </button>
        </>
      )}

      {/* Result */}
      {result && (
        <div style={{ animation: "fadeIn .4s" }}>
          {/* Coach note */}
          <div style={{ background: "#1E1B2E", border: "1px solid #3730a3", borderRadius: 12, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#FED7AA", fontStyle: "italic" }}>
            💬 "{result.coachNote}"
          </div>

          {/* Top 20% */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#F87171", marginBottom: 10 }}>🎯 CRITICAL 20% — DO THESE FIRST</div>
          {result.schedule
            .filter(s => result.top20.includes(s.taskNum))
            .map((s, i) => {
              const task = result.tasks[s.taskNum - 1];
              if (!task) return null;
              return (
                <div key={i} style={{ background: "#2E1A14", border: "1px solid #7f1d1d", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FEF3C7", flex: 1 }}>{task.text}</div>
                    <span style={{ fontSize: 10, background: "#7F1D1D", color: "#FECACA", borderRadius: 6, padding: "2px 8px", marginLeft: 8, flexShrink: 0 }}>{s.timeBlock}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#8080a0", fontStyle: "italic" }}>{s.reason}</div>
                </div>
              );
            })}

          {/* Rest */}
          {result.schedule.filter(s => !result.top20.includes(s.taskNum)).length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 10, marginTop: 14 }}>THE OTHER 80% — GET TO THESE AFTER</div>
              {result.schedule
                .filter(s => !result.top20.includes(s.taskNum))
                .map((s, i) => {
                  const task = result.tasks[s.taskNum - 1];
                  if (!task) return null;
                  return (
                    <div key={i} style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 12, padding: "12px 14px", marginBottom: 8, opacity: 0.7 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div style={{ fontSize: 13, color: "#A8A29E", flex: 1 }}>{task.text}</div>
                        <span style={{ fontSize: 10, color: "#78716C", marginLeft: 8 }}>{s.timeBlock}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#78716C", fontStyle: "italic" }}>{s.reason}</div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── HISTORY VIEW ──────────────────────────────────────────────────────────────

function HistoryView() {
  const history = loadHistory();
  if (history.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "#57534E" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
        <div style={{ fontWeight: 700, color: "#78716C", marginBottom: 6 }}>No history yet.</div>
        <div style={{ fontSize: 13 }}>Come back tomorrow. Your record starts then.</div>
      </div>
    );
  }
  return (
    <div style={{ padding: "14px 20px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#78716C", marginBottom: 12 }}>YOUR RECORD — ALL TIME</div>
      {history.map((day, i) => {
        const pct = day.total > 0 ? Math.round((day.done / day.total) * 100) : 0;
        const pctColor = pct === 100 ? "#34D399" : pct >= 60 ? "#FB923C" : pct >= 30 ? "#f97316" : "#F87171";
        const label = new Date(day.date + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
        return (
          <div key={i} style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#FDE68A" }}>{label}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {day.streak > 0 && <span style={{ fontSize: 11, color: "#f97316" }}>{day.streak}🔥</span>}
                <span style={{ fontSize: 12, fontWeight: 800, color: pctColor }}>{pct}%</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#34D399" }}>✓ {day.done} done</span>
              <span style={{ fontSize: 11, color: "#78716C" }}>/ {day.total} total</span>
              {day.focusSecs > 0 && <span style={{ fontSize: 11, color: "#22D3EE" }}>⏱ {fmtDuration(day.focusSecs)}</span>}
            </div>
            <div style={{ height: 4, background: "#1C1917", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: pctColor, borderRadius: 99 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TASK CARD ─────────────────────────────────────────────────────────────────

function TaskCard({ task, onToggle, onNotToday, onCarryOver, onEdit, onDelete, onReschedule, faded }) {
  const [expanded, setExpanded] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newStart, setNewStart] = useState(task.startTime || "");
  const [newEnd, setNewEnd] = useState(task.endTime || "");

  const now = nowMin();
  const start = toMin(task.startTime);
  const end = toMin(task.endTime);
  let timeStatus = "none";
  if (start && end && !task.done && !task.carriedOver) {
    if (now < start) timeStatus = "upcoming";
    else if (now >= start && now <= end) timeStatus = "active";
    else timeStatus = "overdue";
  }

  const timeCfg = {
    upcoming: { c: "#FB923C", lbl: "Upcoming" },
    active:   { c: "#34D399", lbl: "● Now" },
    overdue:  { c: "#F87171", lbl: "Overdue" },
    none:     { c: "#57534E", lbl: "" },
  }[timeStatus];

  const borderColor = task.done ? "#332A24" : timeStatus === "active" ? "#1E5A38" : timeStatus === "overdue" ? "#6B2020" : "#3D3530";
  const bgColor = task.done ? "#201C19" : task.carriedOver ? "#1E1A14" : task.skipped ? "#1E1A14" : timeStatus === "active" ? "#1A2A1A" : "#2A2320";
  const bgGlow = timeStatus === "active" ? "0 0 0 1px #34D39920" : timeStatus === "overdue" ? "0 0 0 1px #F8717120" : "none";

  return (
    <div style={{ background: bgColor, border: "1.5px solid " + borderColor, borderRadius: 20, padding: "14px 16px", marginBottom: 12, opacity: faded ? 0.5 : 1, transition: "all .3s", boxShadow: bgGlow }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {/* Checkbox — bigger, rounder, premium */}
        <button onClick={() => onToggle && onToggle(task.id)} style={{
          width: 26, height: 26, borderRadius: 99, flexShrink: 0, marginTop: 2,
          background: task.done ? "linear-gradient(135deg,#F4845F,#FBBF24)" : "transparent",
          border: "2px solid " + (task.done ? "#F4845F" : "#5C4838"),
          cursor: "pointer", color: "#1C1410", fontSize: 13, fontWeight: 900,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: task.done ? "0 0 12px #F4845F50" : "none",
          transition: "all .2s",
        }}>{task.done ? "✓" : ""}</button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, wordBreak: "break-word", color: task.done ? "#5C4838" : "#FFF8F2", textDecoration: task.done ? "line-through" : "none", lineHeight: 1.4 }}>
            {task.text}
          </div>
          {task.startTime && task.endTime && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: timeCfg.c, background: timeCfg.c + "18", border: "1px solid " + timeCfg.c + "30", borderRadius: 8, padding: "3px 8px" }}>
                {fmtTime(task.startTime)} – {fmtTime(task.endTime)}
              </span>
              {timeCfg.lbl ? <span style={{ fontSize: 10, color: timeCfg.c, fontWeight: 800 }}>{timeCfg.lbl}</span> : null}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {!task.done && !task.skipped && !task.carriedOver && (
              <span style={{ fontSize: 10, color: "#5C4838" }}>⏱ {sinceAdded(task.addedAt)}</span>
            )}
            {task.carriedOver && <span style={{ fontSize: 10, color: "#FBBF24", fontWeight: 600 }}>📅 Carried over</span>}
            {task.skipped && <span style={{ fontSize: 10, color: "#8C7E74" }}>💤 Not today</span>}
            {task.category && (() => {
              const cat = SKILL_CATEGORIES.find(c => c.id === task.category);
              return cat ? <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, background: cat.color + "18", border: "1px solid " + cat.color + "30", borderRadius: 99, padding: "2px 8px" }}>{cat.icon} {cat.label}</span> : null;
            })()}
          </div>
        </div>

        {/* Expand / delete */}
        {!task.done && !faded && (
          <button onClick={() => setExpanded(e => !e)} style={{ background: "#3D3530", border: "none", borderRadius: 10, color: "#8C7E74", cursor: "pointer", fontSize: 14, padding: "6px 8px", flexShrink: 0, transition: "all .2s" }}>
            {expanded ? "▲" : "▼"}
          </button>
        )}
        {(task.done || faded) && onDelete && (
          <button onClick={() => onDelete(task.id)} style={{ background: "#2E1A14", border: "1px solid #5C3030", borderRadius: 10, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: "#F87171", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
        )}
      </div>

      {/* Expanded actions */}
      {expanded && !task.done && (
        <div style={{ marginTop: 14 }}>
          <div style={{ background: "#201C19", borderLeft: "3px solid #F4845F", borderRadius: "0 12px 12px 0", padding: "10px 14px", fontSize: 12, color: "#D4A574", fontStyle: "italic", marginBottom: 12, lineHeight: 1.6 }}>
            "{MEAN_LINES[task.meanIdx || 0]}"
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {onEdit && (
              <ActionBtn onClick={() => { onEdit(); setExpanded(false); }} color="#FB923C">✏️ Edit</ActionBtn>
            )}
            {onNotToday && (
              <ActionBtn onClick={() => { onNotToday(task.id); setExpanded(false); }} color="#78716C">💤 Not today</ActionBtn>
            )}
            {onCarryOver && (
              <ActionBtn onClick={() => { onCarryOver(task.id); setExpanded(false); }} color="#a855f7">📅 Move to tomorrow</ActionBtn>
            )}
            {onReschedule && (
              <ActionBtn onClick={() => setShowReschedule(r => !r)} color="#f97316">🕐 Reschedule</ActionBtn>
            )}
            {onDelete && (
              <ActionBtn onClick={() => onDelete(task.id)} color="#F87171">🗑 Delete</ActionBtn>
            )}
          </div>

          {/* Reschedule inline */}
          {showReschedule && onReschedule && (
            <div style={{ marginTop: 10, background: "#1C1917", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {[["START", newStart, setNewStart],["END", newEnd, setNewEnd]].map(([lbl, val, setter]) => (
                  <div key={lbl} style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: "#78716C", fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
                    <input type="time" value={val} onChange={e => setter(e.target.value)}
                      style={{ width: "100%", background: "#292524", border: "1px solid #2a2a38", borderRadius: 8, padding: "8px 10px", color: "#FDE68A", fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <button onClick={() => { onReschedule(newStart, newEnd); setShowReschedule(false); setExpanded(false); }}
                style={{ width: "100%", padding: "8px", background: "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Save new time
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, color, children }) {
  return (
    <button onClick={onClick} style={{ padding: "8px 14px", background: color + "15", border: "1px solid " + color + "40", borderRadius: 12, color, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .2s" }}>
      {children}
    </button>
  );
}

function SectionLabel({ label, color = "#57534E" }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color, marginBottom: 8, marginTop: 4 }}>{label}</div>
  );
}

// ── TASK MODAL (add + edit) ───────────────────────────────────────────────────

function TaskModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task?.text || "");
  const [start, setStart] = useState(task?.startTime || "");
  const [end, setEnd] = useState(task?.endTime || "");
  const [category, setCategory] = useState(task?.category || null);
  const [err, setErr] = useState("");

  // Auto-detect category from text
  function handleTextChange(val) {
    setText(val);
    setErr("");
    if (!category) {
      const detected = detectTaskCategory(val);
      if (detected) setCategory(detected);
    }
  }

  function submit() {
    if (!text.trim()) { setErr("Give it a name first."); return; }
    if (start && end && toMin(start) >= toMin(end)) { setErr("End time must be after start."); return; }
    onSave({ text: text.trim(), startTime: start, endTime: end, category });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200, display: "flex", alignItems: "flex-end", animation: "fadeIn .2s" }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#231E1A", borderRadius: "24px 24px 0 0", padding: "26px 22px 44px", animation: "slideUp .3s ease", border: "1px solid #3D3530", borderBottom: "none" }}>
        <div style={{ width: 36, height: 4, background: "#3D3530", borderRadius: 99, margin: "0 auto 22px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#FFF8F2" }}>{task ? "Edit Task" : "New Task"}</div>
          <button onClick={onClose} style={{ background: "#3D3530", border: "none", borderRadius: 99, color: "#8C7E74", fontSize: 18, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <FieldLabel>Task</FieldLabel>
        <input value={text} onChange={e => handleTextChange(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="What do you want to do?"
          style={inputStyle} />

        {/* Category picker */}
        <FieldLabel>Skill Category <span style={{ color: "#57534E", fontWeight: 400, fontSize: 10 }}>optional</span></FieldLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {SKILL_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(category === cat.id ? null : cat.id)} style={{
              padding: "6px 12px", borderRadius: 99, cursor: "pointer", fontSize: 12, fontWeight: 700,
              background: category === cat.id ? cat.color + "30" : "#1C1917",
              border: "1px solid " + (category === cat.id ? cat.color : "#3C3734"),
              color: category === cat.id ? cat.color : "#78716C",
            }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <FieldLabel>Time block <span style={{ color: "#57534E", fontWeight: 400, fontSize: 10 }}>optional</span></FieldLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["START", start, setStart],["END", end, setEnd]].map(([lbl, val, setter]) => (
            <div key={lbl} style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "#78716C", fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
              <input type="time" value={val} onChange={e => setter(e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>

        {err && <div style={{ fontSize: 12, color: "#F87171", marginBottom: 12 }}>{err}</div>}

        <button onClick={submit} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#F4845F,#FBBF24)", border: "none", borderRadius: 16, color: "#1C1410", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 8px 24px #F4845F40" }}>
          {task ? "Save changes" : "Add Task"}
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: "#8C7E74", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}

const inputStyle = { width: "100%", background: "#201C19", border: "1.5px solid #3D3530", borderRadius: 14, padding: "14px 16px", color: "#FFF8F2", fontSize: 15, marginBottom: 18, boxSizing: "border-box", outline: "none" };

// ── REWARDS VIEW ──────────────────────────────────────────────────────────────

function RewardsView({ stats }) {
  const lv = getLevelInfo(stats.totalXP);
  return (
    <div style={{ padding: "16px 20px" }}>
      {/* Identity card */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#0f3460)", border: "1px solid #3730a3", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#FB923C", fontWeight: 700, marginBottom: 4 }}>YOU ARE BECOMING</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#FEF3C7", marginBottom: 2 }}>Level {lv.level} — {lv.title}</div>
        <div style={{ fontSize: 13, color: "#A8A29E", marginBottom: 14 }}>{stats.totalXP} XP earned. Every task, every choice.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Done",stats.totalDone,"#34D399"],["Streak",stats.streak+"🔥","#f97316"],["Flexible",stats.reschedules,"#a855f7"],["Badges",(stats.earnedBadges||[]).length,"#eab308"]].map(([lbl,val,color])=>(
            <div key={lbl}>
              <div style={{ fontSize: 19, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 9, color: "#78716C", fontWeight: 600, letterSpacing: 0.5 }}>{lbl.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <SectionLabel label="YOUR TRAITS" color="#78716C" />
      {Object.keys(stats.traitXP).length === 0 ? (
        <div style={{ background: "#292524", border: "1px solid #2a2a38", borderRadius: 12, padding: 20, textAlign: "center", color: "#57534E", fontSize: 13, marginBottom: 16 }}>
          Complete tasks to earn surprise traits ✨
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {TRAITS.filter(t => stats.traitXP[t.id]).map(trait => {
            const xp = stats.traitXP[trait.id] || 0;
            const tlv = Math.floor(xp / 20) + 1;
            return (
              <div key={trait.id} style={{ background: "#292524", border: "1px solid " + trait.color + "30", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{trait.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: trait.color }}>{trait.label}</div>
                    <div style={{ fontSize: 10, color: "#78716C" }}>Lv.{tlv} · {xp} XP</div>
                  </div>
                </div>
                <div style={{ height: 3, background: "#1C1917", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: Math.min(100,(xp % 20)/20*100) + "%", background: trait.color, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Badges */}
      <SectionLabel label="BADGES" color="#78716C" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BADGES.map(b => {
          const earned = (stats.earnedBadges || []).includes(b.id);
          return (
            <div key={b.id} style={{ background: earned ? "#292524" : "#0f0f14", border: "1px solid " + (earned ? "#3C3734" : "#1a1a20"), borderRadius: 12, padding: "12px 14px", opacity: earned ? 1 : .38 }}>
              <div style={{ fontSize: 24, marginBottom: 4, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: earned ? "#FDE68A" : "#57534E" }}>{b.label}</div>
              <div style={{ fontSize: 10, color: "#78716C", marginTop: 2, lineHeight: 1.4 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── REWARD POPUP ──────────────────────────────────────────────────────────────

function RewardPopup({ reward, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s" }}>
      <div style={{ background: "#231F1D", border: "2px solid " + reward.trait.color, borderRadius: 20, padding: "28px 24px", maxWidth: 300, width: "100%", textAlign: "center", animation: "popIn .4s ease", boxShadow: "0 0 60px " + reward.trait.color + "40" }}>
        <div style={{ fontSize: 54, animation: "float 2s ease-in-out infinite", marginBottom: 8 }}>{reward.trait.icon}</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: reward.trait.color, marginBottom: 4 }}>TRAIT BOOST</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#FEF3C7", marginBottom: 6 }}>{reward.trait.label}</div>
        <div style={{ display: "inline-block", background: reward.trait.color + "20", border: "1px solid " + reward.trait.color, borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 700, color: reward.trait.color, marginBottom: 16 }}>
          +{reward.xp} XP
        </div>
        <div style={{ fontSize: 13, color: reward.allDone ? "#34D399" : "#A8A29E", fontStyle: "italic", lineHeight: 1.6 }}>"{reward.msg}"</div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#57534E" }}>tap to dismiss</div>
      </div>
    </div>
  );
}

// ── BADGE POPUP ───────────────────────────────────────────────────────────────

function BadgePopup({ badge, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s" }}>
      <div style={{ background: "#231F1D", border: "2px solid #eab308", borderRadius: 20, padding: "28px 24px", maxWidth: 280, width: "100%", textAlign: "center", animation: "popIn .4s ease", boxShadow: "0 0 80px #eab30840" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#eab308", marginBottom: 8 }}>🏆 BADGE UNLOCKED</div>
        <div style={{ fontSize: 56, marginBottom: 10, animation: "float 2s ease-in-out infinite" }}>{badge.icon}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#FEF3C7", marginBottom: 6 }}>{badge.label}</div>
        <div style={{ fontSize: 13, color: "#A8A29E" }}>{badge.desc}</div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#57534E" }}>tap to dismiss</div>
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  const s = {
    success: { bg: "#064E3B", border: "#34D399", color: "#6EE7B7" },
    shame:   { bg: "#431407", border: "#FB923C", color: "#FED7AA" },
    gentle:  { bg: "#292524", border: "#FBBF24", color: "#FDE68A" },
    info:    { bg: "#292524", border: "#3C3734", color: "#A8A29E" },
  }[toast.type] || { bg: "#292524", border: "#3C3734", color: "#A8A29E" };
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: s.bg, border: "1px solid " + s.border, color: s.color, borderRadius: 18, padding: "14px 24px", fontSize: 14, fontWeight: 700, maxWidth: 360, textAlign: "center", zIndex: 999, animation: "slideUp .3s ease", boxShadow: "0 12px 40px rgba(0,0,0,.6)", backdropFilter: "blur(10px)" }}>
      {toast.msg}
    </div>
  );
}

function StatPill({ val, lbl, color }) {
  return (
    <div style={{ background: "#2A2320", border: "1px solid #3D3530", borderRadius: 16, padding: "10px 16px", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 16, fontWeight: 900, color }}>{val}</div>
      <div style={{ fontSize: 9, color: "#8C7E74", fontWeight: 700, letterSpacing: 1.5, marginTop: 1 }}>{lbl}</div>
    </div>
  );
}
