import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const TRAITS = [
  { id: "discipline",   label: "Discipline",      icon: "⚔️",  color: "#6366f1" },
  { id: "creativity",   label: "Creativity",      icon: "🎨",  color: "#f97316" },
  { id: "music",        label: "Music Talent",    icon: "🎵",  color: "#a855f7" },
  { id: "focus",        label: "Deep Focus",      icon: "🧠",  color: "#06b6d4" },
  { id: "resilience",   label: "Resilience",      icon: "🔥",  color: "#ef4444" },
  { id: "confidence",   label: "Confidence",      icon: "👑",  color: "#eab308" },
  { id: "leadership",   label: "Leadership",      icon: "🦁",  color: "#f59e0b" },
  { id: "wellness",     label: "Wellness",        icon: "🌿",  color: "#22c55e" },
  { id: "wisdom",       label: "Wisdom",          icon: "📚",  color: "#8b5cf6" },
  { id: "speed",        label: "Speed",           icon: "⚡",  color: "#facc15" },
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

const DEFAULT_STATS = { totalXP: 0, totalDone: 0, streak: 0, traitXP: {}, earnedBadges: [], reschedules: 0, carryOvers: 0, notToday: 0, comebacks: 0, totalFocusSecs: 0, lastActiveDate: null };

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
  const [newDayScreen, setNewDayScreen] = useState(null); // { yesterday summary }
  const [focusActive, setFocusActive] = useState(false);
  const [focusSecs, setFocusSecs] = useState(0);
  const [tabAwayRoast, setTabAwayRoast] = useState(null);
  // Pomodoro
  const [pomodoroMode, setPomodoroMode] = useState(null); // null=freeform, "25/5", "50/10"
  const [pomodoroPhase, setPomodoroPhase] = useState("work"); // "work"|"break"
  const [pomodoroSecs, setPomodoroSecs] = useState(0);
  const [pomodoroRounds, setPomodoroRounds] = useState(0);
  const toastTimer = useRef(null);
  const focusInterval = useRef(null);

  // ── NEW DAY CHECK ────────────────────────────────────────────────────────────
  useEffect(() => {
    const today = todayStr();
    const lastDate = stats.lastActiveDate;
    if (lastDate && lastDate !== today) {
      // It's a new day — build yesterday summary
      const doneTasks = tasks.filter(t => t.done);
      const pendingTasks = tasks.filter(t => !t.done);
      setNewDayScreen({
        date: lastDate,
        doneTasks,
        pendingTasks,
        focusSecs: stats.lastDayFocusSecs || 0,
      });
    } else if (!lastDate) {
      // First ever open — just stamp today
      setStats(s => ({ ...s, lastActiveDate: today }));
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
    // Calculate how many days were missed
    const lastDate = newDayScreen?.date;
    const daysMissed = lastDate
      ? Math.round((new Date(today) - new Date(lastDate)) / 86400000) - 1
      : 0;
    setTasks(prev => {
      const pending = prev.filter(t => !t.done);
      if (action === "carry") {
        return pending.map(t => ({ ...t, carriedOver: true, skipped: false }));
      } else {
        return [];
      }
    });
    setStats(s => ({
      ...s,
      lastActiveDate: today,
      lastDayFocusSecs: 0,
      streak: yesterdayDone > 0
        ? s.streak + 1          // finished tasks → +1
        : daysMissed >= 2
        ? 0                     // missed 2+ days → reset
        : s.streak,             // missed 1 day → freeze
    }));
    setNewDayScreen(null);
  }

  useEffect(() => { try { localStorage.setItem("dg_tasks", JSON.stringify(tasks)); } catch {} }, [tasks]);
  useEffect(() => {
    try { localStorage.setItem("dg_stats", JSON.stringify({ ...stats, lastActiveDate: todayStr() })); } catch {}
  }, [stats]);


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

  function giveReward(baseStats) {
    const trait = pick(TRAITS);
    const xp = pick([5, 10, 15, 20, 25]);
    const newTraitXP = { ...baseStats.traitXP, [trait.id]: (baseStats.traitXP[trait.id] || 0) + xp };
    const updated = { ...baseStats, totalXP: baseStats.totalXP + xp, traitXP: newTraitXP };
    const { finalStats, newBadge } = checkBadges(updated);
    setStats(finalStats);
    setReward({ trait, xp, msg: pick(WIN_LINES) });
    if (newBadge) setTimeout(() => setBadge(newBadge), 2400);
  }

  function toggleDone(id) {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nowDone = !t.done;
      if (nowDone) {
        const wasCarried = t.carriedOver;
        const updated = {
          ...stats,
          totalDone: stats.totalDone + 1,
          comebacks: stats.comebacks + (wasCarried ? 1 : 0),
        };
        setTimeout(() => giveReward(updated), 300);
      } else {
        showToast("Un-checking it? All good, pick it back up.", "info");
      }
      return { ...t, done: nowDone, skipped: false, carriedOver: false };
    }));
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

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const active = tasks.filter(t => !t.done && !t.skipped && !t.carriedOver).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const pctColor = pct === 100 ? "#22c55e" : pct >= 60 ? "#6366f1" : pct >= 30 ? "#f97316" : "#ef4444";
  const lv = getLevelInfo(stats.totalXP);
  const lvPct = Math.min(100, ((stats.totalXP - lv.min) / (lv.max - lv.min)) * 100);
  const sorted = [...tasks].sort((a, b) => {
    if (a.done && !b.done) return 1;
    if (!a.done && b.done) return -1;
    return (toMin(a.startTime) || 9999) - (toMin(b.startTime) || 9999);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c10", color: "#e2e2e8", fontFamily: "system-ui,sans-serif", maxWidth: 480, margin: "0 auto", paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#6366f1", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Daily Grind</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#f1f1f5" }}>
              {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <StatPill val={stats.streak + "🔥"} lbl="STREAK" color="#f97316" />
            <StatPill val={stats.totalXP + " XP"} lbl="EARNED" color="#eab308" />
          </div>
        </div>

        {/* Level bar */}
        <div style={{ marginTop: 14, background: "#16161f", border: "1px solid #2a2a38", borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#eab308" }}>Lv.{lv.level} — {lv.title}</span>
            <span style={{ fontSize: 11, color: "#555570" }}>{stats.totalXP} / {lv.max} XP</span>
          </div>
          <div style={{ height: 5, background: "#0f0f18", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: lvPct + "%", background: "linear-gradient(90deg,#eab308,#f97316)", borderRadius: 99, transition: "width .6s" }} />
          </div>
        </div>

        {/* Task summary */}
        {total > 0 && view === "tasks" && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
              <span style={{ color: "#7070a0" }}>{done} done · {active} remaining · {tasks.filter(t => t.carriedOver).length} moved forward</span>
              <span style={{ fontWeight: 700, color: pctColor }}>{pct}%</span>
            </div>
            <div style={{ height: 4, background: "#1a1a24", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", background: pctColor, borderRadius: 99, transition: "width .5s" }} />
            </div>
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={{ display: "flex", margin: "16px 20px 0", background: "#16161f", borderRadius: 10, padding: 3, border: "1px solid #2a2a38" }}>
        {[["tasks","📋 Tasks"],["rewards","✨ Rewards"]].map(([v, lbl]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: "9px 0", border: "none", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
            background: view === v ? "#6366f1" : "transparent",
            color: view === v ? "#fff" : "#555570",
          }}>{lbl}</button>
        ))}
      </div>

      {/* TASKS */}
      {view === "tasks" && (
        <div style={{ padding: "14px 20px" }}>

          {/* FOCUS / POMODORO BLOCK */}
          {!focusActive ? (
            // ── Mode picker ──
            <div style={{ background: "#16161f", border: "1px solid #2a2a38", borderRadius: 16, padding: "16px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#555570", marginBottom: 12 }}>FOCUS MODE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Free", sub: "No timer", mode: null, icon: "⏱", color: "#6366f1" },
                  { label: "25 / 5", sub: "Pomodoro", mode: "25/5", icon: "🍅", color: "#ef4444" },
                  { label: "50 / 10", sub: "Deep work", mode: "50/10", icon: "🔬", color: "#06b6d4" },
                ].map(({ label, sub, mode, icon, color }) => (
                  <button key={label} onClick={() => startFocus(mode)} style={{
                    padding: "12px 8px", background: color + "15", border: "1px solid " + color + "40",
                    borderRadius: 12, cursor: "pointer", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color }}>{label}</div>
                    <div style={{ fontSize: 10, color: "#555570", marginTop: 2 }}>{sub}</div>
                  </button>
                ))}
              </div>
              {stats.totalFocusSecs > 0 && (
                <div style={{ marginTop: 10, fontSize: 11, color: "#555570", textAlign: "center" }}>
                  Total banked: {fmtDuration(stats.totalFocusSecs || 0)}
                </div>
              )}
            </div>
          ) : (
            // ── Active session ──
            <div style={{
              background: pomodoroPhase === "break"
                ? "linear-gradient(135deg,#0a1020,#0f1a30)"
                : "linear-gradient(135deg,#0a1a0a,#0f2010)",
              border: "1px solid " + (pomodoroPhase === "break" ? "#1e3a5f" : "#166534"),
              borderRadius: 16, padding: "16px 20px", marginBottom: 14,
            }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: pomodoroPhase === "break" ? "#60a5fa" : "#22c55e" }}>
                    {pomodoroMode
                      ? `${pomodoroMode} POMODORO · ${pomodoroPhase === "work" ? "WORK" : "BREAK"}`
                      : "● FREE FOCUS LIVE"}
                  </div>
                  {pomodoroMode && pomodoroRounds > 0 && (
                    <div style={{ fontSize: 11, color: "#555570", marginTop: 2 }}>
                      {pomodoroRounds} round{pomodoroRounds > 1 ? "s" : ""} complete
                    </div>
                  )}
                </div>
                <button onClick={stopFocus} style={{
                  padding: "8px 14px", background: "#7f1d1d", border: "1px solid #ef4444",
                  borderRadius: 10, color: "#fca5a5", fontSize: 12, fontWeight: 700, cursor: "pointer"
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
                    const ringColor = pomodoroPhase === "break" ? "#60a5fa" : "#22c55e";
                    const mins = Math.floor(pomodoroSecs / 60), secs = pomodoroSecs % 60;
                    return (
                      <>
                        <svg width="80" height="80" style={{ flexShrink: 0 }}>
                          <circle cx="40" cy="40" r={r} fill="none" stroke="#1a1a2e" strokeWidth="6" />
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
                          <div style={{ fontSize: 12, color: "#555570", marginTop: 2 }}>
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
                <div style={{ fontSize: 32, fontWeight: 900, color: "#86efac", fontVariantNumeric: "tabular-nums" }}>
                  {fmtDuration(focusSecs)}
                </div>
              )}
            </div>
          )}

          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#3a3a50" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontWeight: 700, color: "#555570", marginBottom: 4 }}>Nothing here yet.</div>
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
              <SectionLabel label="MOVED TO TOMORROW" color="#6366f1" />
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
              <SectionLabel label="NOT TODAY" color="#555570" />
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
              <SectionLabel label="DONE ✓" color="#22c55e" />
              {sorted.filter(t => t.done).map(t => (
                <TaskCard key={t.id} task={t} faded
                  onToggle={toggleDone}
                  onDelete={deleteTask}
                />
              ))}
            </>
          )}

          <button onClick={() => setShowAdd(true)} style={{
            width: "100%", marginTop: 14, padding: 14,
            background: "#16161f", border: "2px dashed #2a2a38", borderRadius: 14,
            color: "#555570", fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 20, color: "#6366f1" }}>+</span> Add Task
          </button>

          {/* Encouragement footer */}
          {total > 0 && (
            <div style={{ marginTop: 20, background: "#16161f", border: "1px solid #2a2a38", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#7070a0", lineHeight: 1.6, textAlign: "center" }}>
              {pct === 100
                ? "🎉 You finished everything. That's rare. Be proud."
                : done === 0
                ? "Every task you avoid is just a task you're saving for future you. Be kind to them."
                : `${done} done is still ${done} done. Keep the momentum.`}
            </div>
          )}
        </div>
      )}

      {/* REWARDS */}
      {view === "rewards" && <RewardsView stats={stats} />}

      {/* MODALS */}
      {showAdd && <TaskModal onSave={addTask} onClose={() => setShowAdd(false)} />}
      {editTask && <TaskModal task={editTask} onSave={t => updateTask(editTask.id, t)} onClose={() => setEditTask(null)} />}
      {reward && <RewardPopup reward={reward} onClose={() => setReward(null)} />}
      {badge && <BadgePopup badge={badge} onClose={() => setBadge(null)} />}
      {toast && <Toast toast={toast} />}
      {newDayScreen && <NewDayScreen data={newDayScreen} onAction={handleNewDay} />}
      {tabAwayRoast && <TabAwayOverlay msg={tabAwayRoast} onDismiss={() => setTabAwayRoast(null)} />}

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
    <div style={{ position: "fixed", inset: 0, background: "#0c0c10", zIndex: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .4s" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🌅</div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#6366f1", fontWeight: 700, marginBottom: 6 }}>NEW DAY</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#f1f1f5", marginBottom: 4 }}>
            {new Date().toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}
          </div>
          <div style={{ fontSize: 13, color: "#555570" }}>Yesterday was {dayLabel}</div>
        </div>

        {/* Yesterday recap */}
        <div style={{ background: "#16161f", border: "1px solid #2a2a38", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#555570", marginBottom: 12 }}>YESTERDAY'S RECAP</div>
          <div style={{ display: "flex", gap: 16, marginBottom: focusLabel ? 12 : 0 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e" }}>{data.doneTasks.length}</div>
              <div style={{ fontSize: 10, color: "#555570", fontWeight: 600 }}>COMPLETED</div>
            </div>
            <div style={{ width: 1, background: "#2a2a38" }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: data.pendingTasks.length > 0 ? "#f97316" : "#3a3a50" }}>
                {data.pendingTasks.length}
              </div>
              <div style={{ fontSize: 10, color: "#555570", fontWeight: 600 }}>UNFINISHED</div>
            </div>
            {focusLabel && <>
              <div style={{ width: 1, background: "#2a2a38" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#06b6d4" }}>{focusLabel}</div>
                <div style={{ fontSize: 10, color: "#555570", fontWeight: 600 }}>FOCUSED</div>
              </div>
            </>}
          </div>
          {data.doneTasks.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", fontWeight: 600, textAlign: "center" }}>
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
          <div style={{ background: "#13131c", border: "1px solid #2a2a38", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#f97316", marginBottom: 10 }}>
              UNFINISHED BUSINESS ({data.pendingTasks.length})
            </div>
            {data.pendingTasks.slice(0, 4).map(t => (
              <div key={t.id} style={{ fontSize: 13, color: "#8080b0", padding: "5px 0", borderBottom: "1px solid #1a1a24" }}>
                · {t.text}
              </div>
            ))}
            {data.pendingTasks.length > 4 && (
              <div style={{ fontSize: 12, color: "#3a3a50", marginTop: 6 }}>+{data.pendingTasks.length - 4} more</div>
            )}
          </div>
        )}

        {/* Actions */}
        {data.pendingTasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => onAction("carry")} style={{
              padding: 16, background: "#1e1b4b", border: "1px solid #6366f1", borderRadius: 14,
              color: "#a5b4fc", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              📅 Carry over unfinished tasks
            </button>
            <button onClick={() => onAction("clear")} style={{
              padding: 16, background: "#16161f", border: "1px solid #2a2a38", borderRadius: 14,
              color: "#555570", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              🗑 Fresh start — clear everything
            </button>
          </div>
        ) : (
          <button onClick={() => onAction("clear")} style={{
            width: "100%", padding: 16, background: "linear-gradient(135deg,#1e1b4b,#14532d)",
            border: "1px solid #6366f1", borderRadius: 14,
            color: "#f1f1f5", fontSize: 15, fontWeight: 800, cursor: "pointer",
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
        background: "#13131c", border: "2px solid #ef4444", borderRadius: 20,
        padding: "32px 28px", maxWidth: 320, width: "100%", textAlign: "center",
        animation: "popIn .4s ease", boxShadow: "0 0 60px #ef444430",
      }}>
        <div style={{ fontSize: 52, marginBottom: 12, animation: "float 2s ease-in-out infinite" }}>👀</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#ef4444", marginBottom: 8 }}>FOCUS PAUSED</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f1f5", marginBottom: 10, lineHeight: 1.5 }}>"{msg}"</div>
        <div style={{ fontSize: 12, color: "#555570", marginBottom: 18 }}>Timer stopped while you were gone.</div>
        <button onClick={onDismiss} style={{
          width: "100%", padding: "12px", background: "#14532d", border: "1px solid #22c55e",
          borderRadius: 10, color: "#86efac", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>▶ Resume Focus</button>
      </div>
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
    upcoming: { c: "#6366f1", lbl: "Upcoming" },
    active:   { c: "#22c55e", lbl: "● Now" },
    overdue:  { c: "#ef4444", lbl: "Overdue" },
    none:     { c: "#3a3a50", lbl: "" },
  }[timeStatus];

  const borderColor = task.done ? "#1e1e28" : timeStatus === "active" ? "#166534" : timeStatus === "overdue" ? "#7f1d1d" : "#2a2a38";
  const bgColor = task.done ? "#111118" : task.carriedOver ? "#0f0f1e" : task.skipped ? "#111114" : timeStatus === "active" ? "#0a1f0a" : "#16161f";

  return (
    <div style={{ background: bgColor, border: "1px solid " + borderColor, borderRadius: 14, padding: "12px 14px", marginBottom: 10, opacity: faded ? 0.55 : 1, transition: "all .3s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        {/* Checkbox */}
        <button onClick={() => onToggle && onToggle(task.id)} style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
          background: task.done ? "#6366f1" : "transparent",
          border: "2px solid " + (task.done ? "#6366f1" : "#3a3a50"),
          cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{task.done ? "✓" : ""}</button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, wordBreak: "break-word", color: task.done ? "#3a3a50" : "#e2e2e8", textDecoration: task.done ? "line-through" : "none" }}>
            {task.text}
          </div>
          {task.startTime && task.endTime && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: timeCfg.c, background: timeCfg.c + "18", border: "1px solid " + timeCfg.c + "30", borderRadius: 6, padding: "2px 7px" }}>
                {fmtTime(task.startTime)} – {fmtTime(task.endTime)}
              </span>
              {timeCfg.lbl ? <span style={{ fontSize: 10, color: timeCfg.c, fontWeight: 700 }}>{timeCfg.lbl}</span> : null}
            </div>
          )}
          {!task.done && !task.skipped && !task.carriedOver && (
            <div style={{ fontSize: 10, color: "#3a3a55", marginTop: 4 }}>⏱ {sinceAdded(task.addedAt)}</div>
          )}
          {task.carriedOver && <div style={{ fontSize: 10, color: "#6366f1", marginTop: 4 }}>📅 Moved to tomorrow</div>}
          {task.skipped && <div style={{ fontSize: 10, color: "#555570", marginTop: 4 }}>💤 Not today</div>}
        </div>

        {/* Expand toggle */}
        {!task.done && !faded && (
          <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", color: "#555570", cursor: "pointer", fontSize: 18, padding: "0 2px", flexShrink: 0 }}>
            {expanded ? "▲" : "▼"}
          </button>
        )}
        {(task.done || faded) && onDelete && (
          <button onClick={() => onDelete(task.id)} style={{ background: "#1a0a0a", border: "1px solid #3a1010", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 15, color: "#7f1d1d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
        )}
      </div>

      {/* Expanded actions */}
      {expanded && !task.done && (
        <div style={{ marginTop: 12 }}>
          {/* Mean roast */}
          <div style={{ background: "#0d0b24", borderLeft: "3px solid #6366f1", borderRadius: "0 8px 8px 0", padding: "8px 12px", fontSize: 12, color: "#a5b4fc", fontStyle: "italic", marginBottom: 10 }}>
            "{MEAN_LINES[task.meanIdx || 0]}"
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {onEdit && (
              <ActionBtn onClick={() => { onEdit(); setExpanded(false); }} color="#6366f1">✏️ Edit</ActionBtn>
            )}
            {onNotToday && (
              <ActionBtn onClick={() => { onNotToday(task.id); setExpanded(false); }} color="#555570">💤 Not today</ActionBtn>
            )}
            {onCarryOver && (
              <ActionBtn onClick={() => { onCarryOver(task.id); setExpanded(false); }} color="#a855f7">📅 Move to tomorrow</ActionBtn>
            )}
            {onReschedule && (
              <ActionBtn onClick={() => setShowReschedule(r => !r)} color="#f97316">🕐 Reschedule</ActionBtn>
            )}
            {onDelete && (
              <ActionBtn onClick={() => onDelete(task.id)} color="#ef4444">🗑 Delete</ActionBtn>
            )}
          </div>

          {/* Reschedule inline */}
          {showReschedule && onReschedule && (
            <div style={{ marginTop: 10, background: "#0f0f18", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {[["START", newStart, setNewStart],["END", newEnd, setNewEnd]].map(([lbl, val, setter]) => (
                  <div key={lbl} style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: "#555570", fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
                    <input type="time" value={val} onChange={e => setter(e.target.value)}
                      style={{ width: "100%", background: "#16161f", border: "1px solid #2a2a38", borderRadius: 8, padding: "8px 10px", color: "#e2e2e8", fontSize: 13 }} />
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
    <button onClick={onClick} style={{ padding: "6px 12px", background: color + "18", border: "1px solid " + color + "40", borderRadius: 8, color, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function SectionLabel({ label, color = "#3a3a50" }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color, marginBottom: 8, marginTop: 4 }}>{label}</div>
  );
}

// ── TASK MODAL (add + edit) ───────────────────────────────────────────────────

function TaskModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task?.text || "");
  const [start, setStart] = useState(task?.startTime || "");
  const [end, setEnd] = useState(task?.endTime || "");
  const [err, setErr] = useState("");

  function submit() {
    if (!text.trim()) { setErr("Give it a name first."); return; }
    if (start && end && toMin(start) >= toMin(end)) { setErr("End time must be after start."); return; }
    onSave({ text: text.trim(), startTime: start, endTime: end });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 200, display: "flex", alignItems: "flex-end", animation: "fadeIn .2s" }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#13131c", borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", animation: "slideUp .3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f1f5" }}>{task ? "Edit Task" : "New Task"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#555570", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        <FieldLabel>Task</FieldLabel>
        <input value={text} onChange={e => { setText(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submit()} placeholder="What do you want to do?"
          style={inputStyle} />

        <FieldLabel>Time block <span style={{ color: "#3a3a50", fontWeight: 400, fontSize: 10 }}>optional — leave blank for flexible</span></FieldLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[["START", start, setStart],["END", end, setEnd]].map(([lbl, val, setter]) => (
            <div key={lbl} style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: "#555570", fontWeight: 700, marginBottom: 4 }}>{lbl}</div>
              <input type="time" value={val} onChange={e => setter(e.target.value)} style={inputStyle} />
            </div>
          ))}
        </div>

        {err && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{err}</div>}

        <button onClick={submit} style={{ width: "100%", padding: 14, background: "#6366f1", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          {task ? "Save changes" : "Add Task"}
        </button>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "#555570", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{children}</div>;
}

const inputStyle = { width: "100%", background: "#0f0f18", border: "1px solid #2a2a38", borderRadius: 10, padding: "11px 14px", color: "#e2e2e8", fontSize: 14, marginBottom: 16 };

// ── REWARDS VIEW ──────────────────────────────────────────────────────────────

function RewardsView({ stats }) {
  const lv = getLevelInfo(stats.totalXP);
  return (
    <div style={{ padding: "16px 20px" }}>
      {/* Identity card */}
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#0f3460)", border: "1px solid #3730a3", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#6366f1", fontWeight: 700, marginBottom: 4 }}>YOU ARE BECOMING</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f1f5", marginBottom: 2 }}>Level {lv.level} — {lv.title}</div>
        <div style={{ fontSize: 13, color: "#8080b0", marginBottom: 14 }}>{stats.totalXP} XP earned. Every task, every choice.</div>
        <div style={{ display: "flex", gap: 20 }}>
          {[["Done",stats.totalDone,"#22c55e"],["Streak",stats.streak+"🔥","#f97316"],["Flexible",stats.reschedules,"#a855f7"],["Badges",(stats.earnedBadges||[]).length,"#eab308"]].map(([lbl,val,color])=>(
            <div key={lbl}>
              <div style={{ fontSize: 19, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 9, color: "#555570", fontWeight: 600, letterSpacing: 0.5 }}>{lbl.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <SectionLabel label="YOUR TRAITS" color="#555570" />
      {Object.keys(stats.traitXP).length === 0 ? (
        <div style={{ background: "#16161f", border: "1px solid #2a2a38", borderRadius: 12, padding: 20, textAlign: "center", color: "#3a3a50", fontSize: 13, marginBottom: 16 }}>
          Complete tasks to earn surprise traits ✨
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {TRAITS.filter(t => stats.traitXP[t.id]).map(trait => {
            const xp = stats.traitXP[trait.id] || 0;
            const tlv = Math.floor(xp / 20) + 1;
            return (
              <div key={trait.id} style={{ background: "#16161f", border: "1px solid " + trait.color + "30", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{trait.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: trait.color }}>{trait.label}</div>
                    <div style={{ fontSize: 10, color: "#555570" }}>Lv.{tlv} · {xp} XP</div>
                  </div>
                </div>
                <div style={{ height: 3, background: "#0f0f18", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: Math.min(100,(xp % 20)/20*100) + "%", background: trait.color, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Badges */}
      <SectionLabel label="BADGES" color="#555570" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BADGES.map(b => {
          const earned = (stats.earnedBadges || []).includes(b.id);
          return (
            <div key={b.id} style={{ background: earned ? "#16161f" : "#0f0f14", border: "1px solid " + (earned ? "#2a2a38" : "#1a1a20"), borderRadius: 12, padding: "12px 14px", opacity: earned ? 1 : .38 }}>
              <div style={{ fontSize: 24, marginBottom: 4, filter: earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: earned ? "#e2e2e8" : "#3a3a50" }}>{b.label}</div>
              <div style={{ fontSize: 10, color: "#555570", marginTop: 2, lineHeight: 1.4 }}>{b.desc}</div>
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
      <div style={{ background: "#13131c", border: "2px solid " + reward.trait.color, borderRadius: 20, padding: "28px 24px", maxWidth: 300, width: "100%", textAlign: "center", animation: "popIn .4s ease", boxShadow: "0 0 60px " + reward.trait.color + "40" }}>
        <div style={{ fontSize: 54, animation: "float 2s ease-in-out infinite", marginBottom: 8 }}>{reward.trait.icon}</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: reward.trait.color, marginBottom: 4 }}>TRAIT UNLOCKED</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f1f5", marginBottom: 6 }}>{reward.trait.label}</div>
        <div style={{ display: "inline-block", background: reward.trait.color + "20", border: "1px solid " + reward.trait.color, borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 700, color: reward.trait.color, marginBottom: 16 }}>
          +{reward.xp} XP
        </div>
        <div style={{ fontSize: 13, color: "#a0a0c0", fontStyle: "italic", lineHeight: 1.6 }}>"{reward.msg}"</div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#3a3a50" }}>tap to dismiss</div>
      </div>
    </div>
  );
}

// ── BADGE POPUP ───────────────────────────────────────────────────────────────

function BadgePopup({ badge, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn .2s" }}>
      <div style={{ background: "#13131c", border: "2px solid #eab308", borderRadius: 20, padding: "28px 24px", maxWidth: 280, width: "100%", textAlign: "center", animation: "popIn .4s ease", boxShadow: "0 0 80px #eab30840" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#eab308", marginBottom: 8 }}>🏆 BADGE UNLOCKED</div>
        <div style={{ fontSize: 56, marginBottom: 10, animation: "float 2s ease-in-out infinite" }}>{badge.icon}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#f1f1f5", marginBottom: 6 }}>{badge.label}</div>
        <div style={{ fontSize: 13, color: "#8080b0" }}>{badge.desc}</div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#3a3a50" }}>tap to dismiss</div>
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  const s = {
    success: { bg: "#14532d", border: "#166534", color: "#86efac" },
    shame:   { bg: "#1e1b4b", border: "#3730a3", color: "#a5b4fc" },
    gentle:  { bg: "#1a1a0a", border: "#a16207", color: "#fde68a" },
    info:    { bg: "#16161f", border: "#2e2e40", color: "#c4c4d4" },
  }[toast.type] || { bg: "#16161f", border: "#2e2e40", color: "#c4c4d4" };
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: s.bg, border: "1px solid " + s.border, color: s.color, borderRadius: 12, padding: "12px 20px", fontSize: 13, fontWeight: 600, maxWidth: 340, textAlign: "center", zIndex: 999, animation: "slideUp .3s ease", boxShadow: "0 8px 32px rgba(0,0,0,.5)" }}>
      {toast.msg}
    </div>
  );
}

function StatPill({ val, lbl, color }) {
  return (
    <div style={{ background: "#16161f", border: "1px solid #2a2a38", borderRadius: 10, padding: "6px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 800, color }}>{val}</div>
      <div style={{ fontSize: 9, color: "#555570", fontWeight: 700, letterSpacing: 1 }}>{lbl}</div>
    </div>
  );
}
