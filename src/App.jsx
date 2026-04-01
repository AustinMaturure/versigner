import { useEffect, useState, useMemo } from "react";
import "./home.css";

const BIBLE_BOOKS = [
  { abbr: "GEN", name: "Genesis", chapters: 50 },
  { abbr: "EXO", name: "Exodus", chapters: 40 },
  { abbr: "LEV", name: "Leviticus", chapters: 27 },
  { abbr: "NUM", name: "Numbers", chapters: 36 },
  { abbr: "DEU", name: "Deuteronomy", chapters: 34 },
  { abbr: "JOS", name: "Joshua", chapters: 24 },
  { abbr: "JDG", name: "Judges", chapters: 21 },
  { abbr: "RUT", name: "Ruth", chapters: 4 },
  { abbr: "1SA", name: "1 Samuel", chapters: 31 },
  { abbr: "2SA", name: "2 Samuel", chapters: 24 },
  { abbr: "1KI", name: "1 Kings", chapters: 22 },
  { abbr: "2KI", name: "2 Kings", chapters: 25 },
  { abbr: "1CH", name: "1 Chronicles", chapters: 29 },
  { abbr: "2CH", name: "2 Chronicles", chapters: 36 },
  { abbr: "EZR", name: "Ezra", chapters: 10 },
  { abbr: "NEH", name: "Nehemiah", chapters: 13 },
  { abbr: "EST", name: "Esther", chapters: 10 },
  { abbr: "JOB", name: "Job", chapters: 42 },
  { abbr: "PSA", name: "Psalms", chapters: 150 },
  { abbr: "PRO", name: "Proverbs", chapters: 31 },
  { abbr: "ECC", name: "Ecclesiastes", chapters: 12 },
  { abbr: "SNG", name: "Song of Songs", chapters: 8 },
  { abbr: "ISA", name: "Isaiah", chapters: 66 },
  { abbr: "JER", name: "Jeremiah", chapters: 52 },
  { abbr: "LAM", name: "Lamentations", chapters: 5 },
  { abbr: "EZK", name: "Ezekiel", chapters: 48 },
  { abbr: "DAN", name: "Daniel", chapters: 12 },
  { abbr: "HOS", name: "Hosea", chapters: 14 },
  { abbr: "JOL", name: "Joel", chapters: 3 },
  { abbr: "AMO", name: "Amos", chapters: 9 },
  { abbr: "OBA", name: "Obadiah", chapters: 1 },
  { abbr: "JON", name: "Jonah", chapters: 4 },
  { abbr: "MIC", name: "Micah", chapters: 7 },
  { abbr: "NAM", name: "Nahum", chapters: 3 },
  { abbr: "HAB", name: "Habakkuk", chapters: 3 },
  { abbr: "ZEP", name: "Zephaniah", chapters: 3 },
  { abbr: "HAG", name: "Haggai", chapters: 2 },
  { abbr: "ZEC", name: "Zechariah", chapters: 14 },
  { abbr: "MAL", name: "Malachi", chapters: 4 },
  { abbr: "MAT", name: "Matthew", chapters: 28 },
  { abbr: "MRK", name: "Mark", chapters: 16 },
  { abbr: "LUK", name: "Luke", chapters: 24 },
  { abbr: "JHN", name: "John", chapters: 21 },
  { abbr: "ACT", name: "Acts", chapters: 28 },
  { abbr: "ROM", name: "Romans", chapters: 16 },
  { abbr: "1CO", name: "1 Corinthians", chapters: 16 },
  { abbr: "2CO", name: "2 Corinthians", chapters: 13 },
  { abbr: "GAL", name: "Galatians", chapters: 6 },
  { abbr: "EPH", name: "Ephesians", chapters: 6 },
  { abbr: "PHI", name: "Philippians", chapters: 4 },
  { abbr: "COL", name: "Colossians", chapters: 4 },
  { abbr: "1TH", name: "1 Thessalonians", chapters: 5 },
  { abbr: "2TH", name: "2 Thessalonians", chapters: 3 },
  { abbr: "1TI", name: "1 Timothy", chapters: 6 },
  { abbr: "2TI", name: "2 Timothy", chapters: 4 },
  { abbr: "TIT", name: "Titus", chapters: 3 },
  { abbr: "PHM", name: "Philemon", chapters: 1 },
  { abbr: "HEB", name: "Hebrews", chapters: 13 },
  { abbr: "JAS", name: "James", chapters: 5 },
  { abbr: "1PE", name: "1 Peter", chapters: 5 },
  { abbr: "2PE", name: "2 Peter", chapters: 3 },
  { abbr: "1JN", name: "1 John", chapters: 5 },
  { abbr: "2JN", name: "2 John", chapters: 1 },
  { abbr: "3JN", name: "3 John", chapters: 1 },
  { abbr: "JUD", name: "Jude", chapters: 1 },
  { abbr: "REV", name: "Revelation", chapters: 22 },
];


const BASE_MEMBERS = ["B", "Mama", "Parthe", "Muno"];
const MEMBER_ICONS = { B: "📖", Mama: "🌿", Parthe: "⭐", Muno: "⚡" };
const BIBLE_ID = "7142879509583d59-01";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getTuesdayForReading(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // Tuesday = 2. If today is Wednesday(3) or later, go to next Tuesday
  const daysToAdd = day <= 2 ? (2 - day) : (9 - day);
  d.setDate(d.getDate() + daysToAdd);
  return d;
}

function weeksBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (7 * 24 * 60 * 60 * 1000));
}


function getReading(startBookIdx, startChapter, weekOffset) {
  let bookIdx = Math.max(0, Math.min(startBookIdx, BIBLE_BOOKS.length - 1));
  let chapter = startChapter + weekOffset;

  while (bookIdx < BIBLE_BOOKS.length - 1 && chapter > BIBLE_BOOKS[bookIdx].chapters) {
    chapter -= BIBLE_BOOKS[bookIdx].chapters;
    bookIdx++;
  }
  while (bookIdx > 0 && chapter < 1) {
    bookIdx--;
    chapter += BIBLE_BOOKS[bookIdx].chapters;
  }

  return {
    bookIdx,
    chapter: Math.max(1, Math.min(chapter, BIBLE_BOOKS[bookIdx].chapters)),
  };
}


export default function App() {

  const anchorTuesday = useMemo(() => {
    const raw = import.meta.env.VITE_ANCHOR_DATE;
    return getTuesdayForReading(raw ? new Date(raw) : new Date("2024-11-26"));
  }, []);

  const startBookIdx = parseInt(import.meta.env.VITE_CHAPCOUNT) || 22;
  const startChapter = parseInt(import.meta.env.VITE_COUNT) || 1;
  const apiKey = import.meta.env.VITE_API_KEY;


  const todayTuesday = useMemo(() => getTuesdayForReading(), []);
  const [selectedTuesday, setSelectedTuesday] = useState(todayTuesday);


  const weekOffset = useMemo(
    () => weeksBetween(anchorTuesday, selectedTuesday),
    [anchorTuesday, selectedTuesday]
  );

  
  const { bookIdx, chapter } = useMemo(
    () => getReading(startBookIdx, startChapter, weekOffset),
    [startBookIdx, startChapter, weekOffset]
  );
  const book = BIBLE_BOOKS[bookIdx];

 
  const members = useMemo(() => {
    const len = BASE_MEMBERS.length;
    const n = ((weekOffset % len) + len) % len;
    return n === 0
      ? BASE_MEMBERS
      : [...BASE_MEMBERS.slice(len - n), ...BASE_MEMBERS.slice(0, len - n)];
  }, [weekOffset]);

 
  const [bible, setBible] = useState(null);
  const [verseRanges, setVerseRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${book.abbr}.${chapter}`;

  useEffect(() => {
    setBible(null);
    setVerseRanges([]);
    setLoading(true);
    setError(null);

    fetch(apiUrl, { headers: { "api-key": apiKey } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }) => {
        setBible(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err.message === "Failed to fetch"
            ? "Network error — check your connection and reload."
            : `Could not load ${book.name} ${chapter}. Check your network and reload.`
        );
      });
  }, [apiUrl]);

  // Split verses into four equal partitions
  useEffect(() => {
    if (!bible?.verseCount) return;
    const total = bible.verseCount;
    const perPart = Math.ceil(total / 4);
    setVerseRanges(
      Array.from({ length: 4 }, (_, i) => ({
        start: i * perPart + 1,
        end: Math.min((i + 1) * perPart, total),
      }))
    );
  }, [bible]);


  const sliderTuesdays = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const d = new Date(selectedTuesday);
        d.setDate(d.getDate() + (i - 4) * 7);
        return d;
      }),
    [selectedTuesday]
  );

  const navigate = (dir) =>
    setSelectedTuesday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });

  
  const isThisWeek = selectedTuesday.getTime() === todayTuesday.getTime();
  const relativeWeeks = weeksBetween(todayTuesday, selectedTuesday);
  const weekLabel =
    relativeWeeks === 0 ? "This Week" :
    relativeWeeks === 1 ? "Next Week" :
    relativeWeeks === -1 ? "Last Week" :
    relativeWeeks > 1 ? `In ${relativeWeeks} weeks` :
    `${Math.abs(relativeWeeks)} weeks ago`;

 
  const titleFontSize =
    book.name.length > 13 ? "1.6rem" :
    book.name.length > 9  ? "2.25rem" :
    "2.65rem";

  
  return (
    <div className="app-container">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="book-title" style={{ fontSize: titleFontSize }}>
            {book.name}
            <span className={isThisWeek ? "today-dot mr-2" : "other-dot mr-2"}>•</span>
            <span className="">{chapter}</span>
          </h1>
   
        </div>
        <div className="header-meta">
          <p className="week-label">{weekLabel}</p>
          <p className="year-label">
            {selectedTuesday.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* ── Tuesday Slider ── */}
      <div className="tuesday-slider">
        {sliderTuesdays.map((date, i) => {
          const isSelected = date.getTime() === selectedTuesday.getTime();
          const isToday = date.getTime() === todayTuesday.getTime();
          return (
            <button
              key={i}
              className={[
                "slider-item",
                isSelected ? "slider-item--active" : "",
                isToday && !isSelected ? "slider-item--today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedTuesday(new Date(date))}
            >
              <span className="s-month">{MONTHS[date.getMonth()]}</span>
              <span className="s-day">{date.getDate()}</span>
          
            </button>
          );
        })}
      </div>

      <div className="dotted-line" />

      {/* ── Error ── */}
      {error && <p className="error-msg">{error}</p>}

      {/* ── Reading List ── */}
      <div className="reading-list">
        {members.map((name, i) => (
          <div key={name}>
            <div className="reading-item">
              <span className="reading-icon">{MEMBER_ICONS[name]}</span>
              <span className="reading-name">{name}</span>
              <span className="reading-range">
                {loading ? (
                  <span className="skeleton-pill" />
                ) : verseRanges[i] ? (
                  `${verseRanges[i].start} – ${verseRanges[i].end}`
                ) : (
                  "—"
                )}
              </span>
            </div>
            {i < members.length - 1 && <div className="dotted-line" />}
          </div>
        ))}
      </div>

      <div className="dotted-line" style={{ marginTop: "4px" }} />

      {/* ── Navigation ── */}
      <div className="nav-row">
        <button className="btn-nav" onClick={() => navigate(-1)}>
          ← Prev Week
        </button>
        <button className="btn-nav" onClick={() => navigate(1)}>
          Next Week →
        </button>
      </div>
    </div>
  );
}
