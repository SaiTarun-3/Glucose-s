import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes ecgDraw { 0%{stroke-dashoffset:400} 100%{stroke-dashoffset:-400} }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      @keyframes fadeUp { 0%{opacity:0;transform:translateY(6px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(43,108,176,0.4)} 50%{box-shadow:0 0 0 12px rgba(43,108,176,0)} }
    `;
    document.head.appendChild(style);
  }, []);

  const [page, setPage] = useState("home");
  const [form, setForm] = useState({
    name: "", age: "", gender: "female",
    pregnancies: "0", glucose: "", bloodpressure: "",
    skinthickness: "", insulin: "", bmi: "",
    dpf: "", veg: "veg", activity: "sedentary"
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "gender" && e.target.value === "male") {
      updated.pregnancies = "0";
    }
    setForm(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 3000));
    try {
      const response = await axios.post("https://glucosense-backend.onrender.com/predict", {
        pregnancies:   parseFloat(form.pregnancies),
        glucose:       parseFloat(form.glucose),
        bloodpressure: parseFloat(form.bloodpressure),
        skinthickness: parseFloat(form.skinthickness),
        insulin:       parseFloat(form.insulin),
        bmi:           parseFloat(form.bmi),
        dpf:           parseFloat(form.dpf),
        age:           parseFloat(form.age),
        veg:           form.veg,
        activity:      form.activity
      });
      setResult({ ...response.data, name: form.name });
      setPage("result");
    } catch (error) {
      alert("Error connecting to API. Make sure Flask is running!");
    }
    setLoading(false);
  };

  const getRiskLevel = (confidence, prediction) => {
    if (prediction === "Not Diabetic") return { label: "Low Risk", color: "#276749" };
    if (confidence >= 70) return { label: "High Risk", color: "#c53030" };
    return { label: "Moderate Risk", color: "#c05621" };
  };

  if (loading) return <LoadingScreen />;
  if (page === "home") return <HomePage onStart={() => setPage("form")} />;
  if (page === "form") return (
    <FormPage
      form={form}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBack={() => setPage("home")}
    />
  );
  if (page === "result") return (
    <ResultPage
      result={result}
      getRiskLevel={getRiskLevel}
      onBack={() => { setPage("form"); setResult(null); }}
      onNew={() => { setPage("home"); setResult(null); }}
    />
  );
}

// ── Loading Screen ────────────────────────────────
function LoadingScreen() {
  return (
    <div style={s.loadingPage}>
      <div style={s.loadingCard}>
        <div style={s.loadingLogo}>GlucoSense</div>
        <div style={s.loadingTagline}>Predict. Prevent. Protect.</div>
        <svg width="100%" height="44" viewBox="0 0 300 44" style={{ marginBottom: "24px" }}>
          <path
            d="M0,22 L60,22 L70,22 L75,4 L80,40 L85,4 L90,22 L110,22 L115,4 L120,40 L125,4 L130,22 L300,22"
            fill="none"
            stroke="#4299e1"
            strokeWidth="2"
            strokeDasharray="400"
            strokeDashoffset="400"
            style={{ animation: "ecgDraw 2s linear infinite", filter: "drop-shadow(0 0 4px rgba(66,153,225,0.8))" }}
          />
        </svg>
        <div style={s.loadingDivider} />
        <div style={s.loadingStatus}>Analyzing your health data</div>
        <div style={s.loadingSubstatus}>This will take just a moment</div>
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────
function HomePage({ onStart }) {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>GlucoSense</span>
      </nav>
      <div style={s.heroSection}>
        <div style={s.heroBadge}>Smart Healthcare Technology</div>
        <h1 style={s.heroTitle}>Diabetes Detection<br />& Diet Planning</h1>
        <p style={s.tagline}>Predict. Prevent. Protect.</p>
        <p style={s.heroSubtitle}>
          An intelligent system that predicts diabetes risk using machine learning
          and generates personalized diet plans based on your health profile.
        </p>
        <div style={s.ecgWrap}>
          <svg width="280" height="36" viewBox="0 0 280 36">
            <path
              d="M0,18 L60,18 L70,18 L75,4 L80,32 L85,4 L90,18 L105,18 L110,4 L115,32 L120,4 L125,18 L280,18"
              fill="none"
              stroke="#2b6cb0"
              strokeWidth="2"
              strokeDasharray="400"
              strokeDashoffset="400"
              style={{ animation: "ecgDraw 2s linear infinite" }}
            />
          </svg>
          <button style={s.heroBtn} onClick={onStart}>
            Start Health Assessment
          </button>
        </div>
        <div style={s.statsRow}>
          <div style={s.statBox}>
            <div style={s.statNum}>768</div>
            <div style={s.statLabel}>Patients Trained</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>75%</div>
            <div style={s.statLabel}>Model Accuracy</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>7-Day</div>
            <div style={s.statLabel}>Diet Plan</div>
          </div>
          <div style={s.statBox}>
            <div style={s.statNum}>Real-Time</div>
            <div style={s.statLabel}>Prediction</div>
          </div>
        </div>
      </div>
      <div style={s.featuresRow}>
        {[
          { title: "Machine Learning", desc: "Random Forest classifier trained on real medical data from 768 patients" },
          { title: "Personalized Diet", desc: "7-day meal plan based on BMI, age, activity level and food preference" },
          { title: "Instant Results", desc: "Get your diabetes risk assessment in under one second" },
        ].map((f) => (
          <div key={f.title} style={s.featureCard}>
            <div style={s.featureTitle}>{f.title}</div>
            <div style={s.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Form Page ─────────────────────────────────────
function FormPage({ form, loading, onChange, onSubmit, onBack }) {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>GlucoSense</span>
        <button style={s.navBack} onClick={onBack}>Back</button>
      </nav>
      <div style={s.formContainer}>
        <div style={s.formHeader}>
          <h2 style={s.formTitle}>Health Assessment Form</h2>
          <p style={s.formSubtitle}>Please fill in your health details accurately</p>
        </div>
        <div style={s.section}>
          <div style={s.sectionLabel}>Personal Information</div>
          <div style={s.grid2}>
            <Field label="Full Name" name="name" placeholder="Enter your name" value={form.name} onChange={onChange} type="text" />
            <Field label="Age" name="age" placeholder="e.g. 30" value={form.age} onChange={onChange} />
          </div>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Gender</label>
              <select name="gender" value={form.gender} onChange={onChange} style={s.input}>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
            {form.gender === "female" && (
              <Field label="Pregnancies" name="pregnancies" placeholder="e.g. 2" value={form.pregnancies} onChange={onChange} />
            )}
          </div>
        </div>
        <div style={s.section}>
          <div style={s.sectionLabel}>Clinical Measurements</div>
          <div style={s.grid2}>
            <Field label="Glucose (mg/dL)" name="glucose" placeholder="e.g. 120" value={form.glucose} onChange={onChange} />
            <Field label="Blood Pressure (mm Hg)" name="bloodpressure" placeholder="e.g. 70" value={form.bloodpressure} onChange={onChange} />
            <Field label="Skin Thickness (mm)" name="skinthickness" placeholder="e.g. 20" value={form.skinthickness} onChange={onChange} />
            <Field label="Insulin (mu U/ml)" name="insulin" placeholder="e.g. 80" value={form.insulin} onChange={onChange} />
            <BMICalculator onApply={(bmi) => onChange({ target: { name: "bmi", value: bmi } })} value={form.bmi} onChange={onChange} />
            <Field label="Diabetes Pedigree Function" name="dpf" placeholder="e.g. 0.5" value={form.dpf} onChange={onChange} />
          </div>
        </div>
        <div style={s.section}>
          <div style={s.sectionLabel}>Lifestyle Information</div>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Diet Preference</label>
              <select name="veg" value={form.veg} onChange={onChange} style={s.input}>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Activity Level</label>
              <select name="activity" value={form.activity} onChange={onChange} style={s.input}>
                <option value="sedentary">Sedentary</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
        </div>
        <button style={loading ? s.btnDisabled : s.btn} onClick={onSubmit} disabled={loading}>
          {loading ? "Analyzing..." : "Generate Prediction & Diet Plan"}
        </button>
        <p style={s.disclaimer}>
          This tool is for educational purposes only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}

// ── Result Page ───────────────────────────────────
function ResultPage({ result, getRiskLevel, onBack, onNew }) {
  const risk = getRiskLevel(result.confidence, result.prediction);
  const isDiabetic = result.prediction === "Diabetic";

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.navBrand}>GlucoSense</span>
        <button style={s.navBack} onClick={onNew}>New Assessment</button>
      </nav>
      <div style={s.formContainer}>
        <div style={s.reportHeader}>
          <div style={s.reportTitle}>Health Assessment Report</div>
          <div style={s.reportMeta}>Patient: {result.name || "Anonymous"}</div>
        </div>
        <div style={{ ...s.resultCard, borderLeft: `4px solid ${risk.color}` }}>
          <div style={s.resultTop}>
            <div>
              <div style={s.resultLabel}>Prediction Result</div>
              <div style={{ ...s.resultValue, color: risk.color }}>{result.prediction}</div>
            </div>
            <div style={{ ...s.riskBadge, background: risk.color }}>
              {risk.label}
            </div>
          </div>
          <div style={s.confidenceRow}>
            <span style={s.confLabel}>Confidence Score</span>
            <span style={{ ...s.confValue, color: risk.color }}>{result.confidence}%</span>
          </div>
          <div style={s.progressBg}>
            <div style={{ ...s.progressFill, width: `${result.confidence}%`, background: risk.color }} />
          </div>
        </div>
        {isDiabetic && (
          <div style={s.tipsCard}>
            <div style={s.tipsTitle}>Medical Recommendations</div>
            {[
              "Monitor blood glucose levels regularly",
              "Reduce intake of refined sugar and processed foods",
              "Exercise for at least 30 minutes daily",
              "Consult a certified diabetologist for proper treatment",
              "Stay hydrated and maintain a healthy sleep schedule",
            ].map((tip) => (
              <div key={tip} style={s.tipRow}>
                <div style={s.tipDot} />
                <span style={s.tipText}>{tip}</span>
              </div>
            ))}
          </div>
        )}
        <div style={s.dietHeader}>7-Day Personalized Diet Plan</div>
        {result.diet_plan.map((day) => (
          <div key={day.day} style={s.dayCard}>
            <div style={s.dayTitle}>{day.day}</div>
            <div style={s.mealsGrid}>
              <div style={s.mealBox}>
                <div style={s.mealType}>Breakfast</div>
                <div style={s.mealName}>{day.breakfast.name}</div>
                <div style={s.mealCal}>{day.breakfast.calories} cal</div>
              </div>
              <div style={s.mealBox}>
                <div style={s.mealType}>Lunch</div>
                <div style={s.mealName}>{day.lunch.name}</div>
                <div style={s.mealCal}>{day.lunch.calories} cal</div>
              </div>
              <div style={s.mealBox}>
                <div style={s.mealType}>Dinner</div>
                <div style={s.mealName}>{day.dinner.name}</div>
                <div style={s.mealCal}>{day.dinner.calories} cal</div>
              </div>
            </div>
            <div style={s.totalRow}>
              Total: {day.total_calories} / {day.calorie_limit} cal daily target
            </div>
          </div>
        ))}
        <button style={s.btn} onClick={onBack}>Run Another Assessment</button>
      </div>
    </div>
  );
}

// ── BMI Calculator ────────────────────────────────
function BMICalculator({ onApply, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");

  const bmi = height && weight
    ? (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(2)
    : null;

  const getCategory = (b) => {
    if (b < 18.5) return { label: "Underweight", color: "#2b6cb0", bg: "#ebf4ff" };
    if (b < 25)   return { label: "Normal",      color: "#276749", bg: "#E1F5EE" };
    if (b < 30)   return { label: "Overweight",  color: "#633806", bg: "#FAEEDA" };
    return              { label: "Obese",         color: "#712B13", bg: "#FAECE7" };
  };

  const cat = bmi ? getCategory(parseFloat(bmi)) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
      <label style={s.label}>BMI (kg/m²)</label>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          style={{ ...s.input, flex: 1 }}
          type="number"
          name="bmi"
          placeholder="e.g. 25.5"
          value={value}
          onChange={onChange}
        />
        <button
          style={bmiStyles.calcBtn}
          onClick={() => setOpen(!open)}
          type="button"
        >
          Calculate BMI
        </button>
      </div>

      {open && (
        <div style={bmiStyles.popup}>
          <div style={bmiStyles.arrow} />
          <div style={bmiStyles.popupTitle}>BMI Calculator</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={bmiStyles.popupLabel}>Height (cm)</label>
              <input
                style={bmiStyles.popupInput}
                type="number"
                placeholder="e.g. 170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={bmiStyles.popupLabel}>Weight (kg)</label>
              <input
                style={bmiStyles.popupInput}
                type="number"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          {bmi && (
            <>
              <div style={{ ...bmiStyles.resultBox, background: cat.bg }}>
                <div>
                  <div style={bmiStyles.resultLabel}>Your BMI</div>
                  <div style={bmiStyles.resultValue}>{bmi}</div>
                </div>
                <div style={{ ...bmiStyles.catBadge, color: cat.color, background: "rgba(255,255,255,0.6)" }}>
                  {cat.label}
                </div>
              </div>

              <div style={bmiStyles.scaleWrap}>
                <div style={{ ...bmiStyles.scaleBar, background: "#1D9E75", flex: 1.5 }} />
                <div style={{ ...bmiStyles.scaleBar, background: "#EF9F27", flex: 1 }} />
                <div style={{ ...bmiStyles.scaleBar, background: "#E24B4A", flex: 1 }} />
              </div>
              <div style={bmiStyles.scaleLabels}>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </>
          )}

          <button
            style={bmiStyles.applyBtn}
            onClick={() => { onApply(bmi); setOpen(false); }}
            type="button"
            disabled={!bmi}
          >
            Apply BMI to Form
          </button>
        </div>
      )}
    </div>
  );
}

const bmiStyles = {
  calcBtn:     { padding: "10px 12px", background: "#ebf4ff", border: "1px solid #bee3f8", borderRadius: "6px", fontSize: "11px", fontWeight: "700", color: "#2b6cb0", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 },
  popup:       { position: "absolute", top: "100%", left: 0, width: "100%", boxSizing: "border-box", marginTop: "8px", background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", padding: "18px 20px", zIndex: 100 },
  arrow:       { position: "absolute", top: "-8px", left: "60px", width: "14px", height: "14px", background: "#fff", borderLeft: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0", transform: "rotate(45deg)" },
  popupTitle:  { fontSize: "12px", fontWeight: "700", color: "#1a365d", marginBottom: "14px" },
  popupLabel:  { fontSize: "11px", fontWeight: "600", color: "#4a5568", marginBottom: "4px" },
  popupInput:  { padding: "8px 10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none", background: "#f7fafc", width: "100%", boxSizing: "border-box" },
  resultBox:   { borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  resultLabel: { fontSize: "11px", color: "#2b6cb0", fontWeight: "600" },
  resultValue: { fontSize: "20px", fontWeight: "800", color: "#1a365d" },
  catBadge:    { fontSize: "11px", fontWeight: "600", padding: "2px 10px", borderRadius: "10px" },
  scaleWrap:   { display: "flex", height: "6px", borderRadius: "4px", overflow: "hidden", marginBottom: "4px" },
  scaleBar:    { height: "100%" },
  scaleLabels: { display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#718096", marginBottom: "12px" },
  applyBtn:    { width: "100%", padding: "9px", background: "#2b6cb0", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
};

// ── Reusable Field ────────────────────────────────
function Field({ label, name, placeholder, value, onChange, type = "number" }) {
  return (
    <div style={s.fieldGroup}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────
const s = {
  page:           { minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Segoe UI', Arial, sans-serif" },
  nav:            { background: "#1a365d", padding: "0 32px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  navBrand:       { color: "#fff", fontWeight: "700", fontSize: "20px", letterSpacing: "0.5px" },
  navTag:         { color: "#90cdf4", fontSize: "13px" },
  navBack:        { background: "transparent", border: "1px solid #90cdf4", color: "#90cdf4", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  heroSection:    { maxWidth: "760px", margin: "0 auto", padding: "64px 24px 32px", textAlign: "center" },
  heroBadge:      { display: "inline-block", background: "#ebf8ff", color: "#2b6cb0", fontSize: "12px", fontWeight: "600", padding: "4px 14px", borderRadius: "20px", marginBottom: "20px", letterSpacing: "0.5px" },
  heroTitle:      { fontSize: "42px", fontWeight: "700", color: "#1a365d", lineHeight: "1.2", marginBottom: "12px" },
  tagline:        { fontSize: "18px", fontWeight: "700", color: "#2b6cb0", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" },
  heroSubtitle:   { fontSize: "16px", color: "#4a5568", lineHeight: "1.7", marginBottom: "32px", maxWidth: "560px", margin: "0 auto 32px" },
  ecgWrap:        { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "48px" },
  heroBtn:        { background: "#2b6cb0", color: "#fff", border: "none", padding: "14px 0", borderRadius: "0 0 8px 8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", width: "280px", animation: "pulse 2s infinite" },
  statsRow:       { display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "16px" },
  statBox:        { background: "#fff", borderRadius: "10px", padding: "16px 24px", textAlign: "center", minWidth: "110px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  statNum:        { fontSize: "22px", fontWeight: "700", color: "#2b6cb0" },
  statLabel:      { fontSize: "11px", color: "#718096", marginTop: "4px" },
  featuresRow:    { display: "flex", justifyContent: "center", gap: "20px", padding: "32px 24px", flexWrap: "wrap", maxWidth: "900px", margin: "0 auto" },
  featureCard:    { background: "#fff", borderRadius: "10px", padding: "24px", flex: "1", minWidth: "220px", maxWidth: "260px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  featureTitle:   { fontWeight: "700", color: "#1a365d", marginBottom: "8px", fontSize: "15px" },
  featureDesc:    { fontSize: "13px", color: "#718096", lineHeight: "1.6" },
  loadingPage:    { minHeight: "100vh", background: "#0a1628", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', Arial, sans-serif" },
  loadingCard:    { textAlign: "center", padding: "48px 40px", width: "360px" },
  loadingLogo:    { fontSize: "28px", fontWeight: "800", color: "#fff", letterSpacing: "-0.5px", marginBottom: "4px", animation: "float 2.5s ease-in-out infinite" },
  loadingTagline: { fontSize: "10px", color: "#4a90d9", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "32px" },
  loadingDivider: { height: "1px", background: "linear-gradient(90deg,transparent,#1a3a6b,transparent)", margin: "0 0 24px" },
  loadingStatus:  { fontSize: "15px", fontWeight: "600", color: "#fff", marginBottom: "6px", animation: "fadeUp 0.5s ease forwards" },
  loadingSubstatus:{ fontSize: "11px", color: "#4a5568", letterSpacing: "0.5px", animation: "blink 2s ease-in-out infinite" },

  // ✅ FIXED: added boxSizing and width
  formContainer:  { maxWidth: "720px", margin: "0 auto", padding: "32px 24px", boxSizing: "border-box", width: "100%" },

  formHeader:     { marginBottom: "24px" },
  formTitle:      { fontSize: "24px", fontWeight: "700", color: "#1a365d" },
  formSubtitle:   { fontSize: "14px", color: "#718096", marginTop: "4px" },

  // ✅ FIXED: added boxSizing
  section:        { background: "#fff", borderRadius: "10px", padding: "20px 24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", boxSizing: "border-box" },

  sectionLabel:   { fontSize: "11px", fontWeight: "700", color: "#2b6cb0", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "16px" },
  grid2:          { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" },
  fieldGroup:     { display: "flex", flexDirection: "column" },
  label:          { fontSize: "12px", fontWeight: "600", color: "#4a5568", marginBottom: "6px" },

  // ✅ FIXED: added width and boxSizing
  input:          { padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", background: "#f7fafc", width: "100%", boxSizing: "border-box" },

  btn:            { width: "100%", padding: "14px", background: "#2b6cb0", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px", boxSizing: "border-box" },
  btnDisabled:    { width: "100%", padding: "14px", background: "#a0aec0", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", cursor: "not-allowed", marginTop: "8px", boxSizing: "border-box" },
  disclaimer:     { fontSize: "11px", color: "#a0aec0", textAlign: "center", marginTop: "12px" },
  reportHeader:   { background: "#1a365d", borderRadius: "10px", padding: "20px 24px", marginBottom: "16px", boxSizing: "border-box" },
  reportTitle:    { color: "#fff", fontWeight: "700", fontSize: "18px" },
  reportMeta:     { color: "#90cdf4", fontSize: "13px", marginTop: "4px" },
  resultCard:     { background: "#fff", borderRadius: "10px", padding: "24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", boxSizing: "border-box" },
  resultTop:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  resultLabel:    { fontSize: "12px", color: "#718096", marginBottom: "4px" },
  resultValue:    { fontSize: "28px", fontWeight: "700" },
  riskBadge:      { color: "#fff", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px" },
  confidenceRow:  { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  confLabel:      { fontSize: "13px", color: "#718096" },
  confValue:      { fontSize: "13px", fontWeight: "700" },
  progressBg:     { background: "#e2e8f0", borderRadius: "4px", height: "8px", overflow: "hidden" },
  progressFill:   { height: "100%", borderRadius: "4px", transition: "width 0.5s" },
  tipsCard:       { background: "#fff", borderRadius: "10px", padding: "20px 24px", marginBottom: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", boxSizing: "border-box" },
  tipsTitle:      { fontWeight: "700", color: "#1a365d", marginBottom: "14px", fontSize: "15px" },
  tipRow:         { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" },
  tipDot:         { width: "6px", height: "6px", borderRadius: "50%", background: "#2b6cb0", marginTop: "6px", flexShrink: 0 },
  tipText:        { fontSize: "13px", color: "#4a5568", lineHeight: "1.6" },
  dietHeader:     { fontWeight: "700", color: "#1a365d", fontSize: "16px", margin: "20px 0 12px" },
  dayCard:        { background: "#fff", borderRadius: "10px", padding: "16px 20px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", boxSizing: "border-box" },
  dayTitle:       { fontWeight: "700", color: "#1a365d", marginBottom: "12px", fontSize: "15px" },
  mealsGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "10px" },
  mealBox:        { background: "#f7fafc", borderRadius: "6px", padding: "10px 12px", boxSizing: "border-box" },
  mealType:       { fontSize: "10px", fontWeight: "700", color: "#2b6cb0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  mealName:       { fontSize: "12px", color: "#2d3748", fontWeight: "500", lineHeight: "1.4" },
  mealCal:        { fontSize: "11px", color: "#718096", marginTop: "4px" },
  totalRow:       { fontSize: "12px", color: "#718096", borderTop: "1px solid #e2e8f0", paddingTop: "10px" },
};

export default App;