"use client";
import { useState } from "react";

const CATEGORIES = {
  "Строительство и ремонт": ["Кухни","Ванные комнаты","Алюкобонд","Гипсокартон","Электрики","Двери","Камины","Ландшафтный дизайн","Лестницы","Маляры - штукатуры","Окна","Полы","Потолки","Сантехники","Сауны и Бани","Отопление","Плотники","Бетонщики","Крыши","Бассейны","Сварщики","Кладка кирпича","Ковка","Ремонт под ключ","Архитекторы","Дизайн интерьера","Фасадные работы","Разнорабочие","Спецтехника","Вентиляция","Ремонт замков","Настенная роспись","Мебель на заказ","Теплоизоляция","Плиточники","Асфальтирование","Жалюзи","Гидроизоляция"],
  "Автоуслуги и сервис": ["Тюнинг","Замена масла и ТО1","Автоэлектрики","Пошив чехлов","Ремонт двигателя","Ремонт АКПП МКПП","Кузовные работы","Кондиционеры, радиаторы","Ремонт ходовой части","Диагностика авто","Установка стекол","Шиномонтаж","Шумоизоляция","Эвакуаторы","Мойка, Химчистка","Вызов мастера на место","Ремонт по перечислению"],
  "Ремонт техники": ["Игровые консоли","Кухонные комбайны","Кондиционеры","Кофемашины","Микроволновые печи","Обогреватели","Пылесосы","Стиральные машины","Телевизоры","Мелкая бытовая утварь","Утюги","Фото и видео техника","Холодильники","Газовые и электроплиты","Установка техники","Скупка техники","Телефоны и компьютеры","Посудомоечные машины"],
  "Бытовые услуги": ["Мастер на час","Мойка окон","Ремонт часов","Ремонт ювелирных изделий","Ремонт сумок","Ремонт велосипедов","Уход за садом","Услуги швеи","Услуги повара","Уборка после ремонта","Уборка офиса","Уборка квартиры","Дезинфекция","Химчистка"],
  "Репетиторы и курсы": ["Английский язык","Математика","Программирование","Восточные языки","Русский язык","Музыка","Профессиональные сертификации","История и обществознание","Рисование и искусство","Биология","Цифровой маркетинг","Французский язык","Немецкий язык","Физика","Химия"],
  "Реклама и маркетинг": ["UX/UI-дизайнер","Наружная реклама","Полиграфический дизайнер","Контекстолог","SMM-менеджер","Email-рассылки","Веб-аналитика","Арт-директор","Контент-маркетолог","Брендинг","Промоутер"],
  "Юристы и финансы": ["Юридические консультации","Аудитор","Бухгалтер","Специалист по страхованию","Финансовый аналитик","Экономист","Гражданское право"],
  "Красота и здоровье": ["Парикмахер","Мастер ногтевого сервиса","Косметолог","Бровист","Наращивание ресниц","Массажист","SPA-программы","Фитнес-тренер / инструктор тренажёрного зала","Психолог","Диетолог"],
};

const CATEGORIES_TEXT = Object.entries(CATEGORIES)
  .map(([section, cats]) => `\n[${section}]\n${cats.map((c, i) => `  ${i + 1}. ${c}`).join("\n")}`)
  .join("\n");

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  async function classify() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), categories: CATEGORIES_TEXT }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setHistory((h) => [{ text: text.trim(), ...data, ts: Date.now() }, ...h].slice(0, 50));
    } catch (e) {
      setError("Ошибка при определении категории. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) classify();
  }

  const confColor = { высокая: "#16a34a", средняя: "#ca8a04", низкая: "#dc2626" };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e4e4e7", fontFamily: "'Outfit', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glow { box-shadow: 0 0 40px rgba(99,102,241,0.15), 0 0 80px rgba(99,102,241,0.05); }
        textarea:focus { outline: none; border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
        .fade-up { animation: fadeUp 0.35s ease-out; }
        .spin { display: inline-flex; gap: 4px; }
        .spin span { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; animation: pulse 1s ease-in-out infinite; }
        .spin span:nth-child(2) { animation-delay: 0.2s; }
        .spin span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #818cf8, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Устабор</div>
          <div style={{ fontSize: 14, color: "#71717a", marginTop: 6 }}>Определение категории заявки</div>
        </div>
        <div className="glow" style={{ background: "#18181b", borderRadius: 16, padding: 24, border: "1px solid #27272a" }}>
          <textarea rows={5} placeholder="Заявка матнини шу ерга ёзинг... / Arizani shu yerga yozing... / Вставьте текст заявки..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKey} style={{ width: "100%", background: "#0f0f13", border: "1px solid #27272a", borderRadius: 10, padding: 14, color: "#e4e4e7", fontSize: 15, lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "#52525b" }}>Ctrl+Enter для отправки</span>
            <button onClick={classify} disabled={loading || !text.trim()} style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {loading ? <span className="spin"><span /><span /><span /></span> : "Определить"}
            </button>
          </div>
        </div>
        {error && <div className="fade-up" style={{ marginTop: 20, padding: 16, background: "#1c1012", border: "1px solid #7f1d1d", borderRadius: 12, color: "#fca5a5", fontSize: 14 }}>{error}</div>}
        {result && (
          <div className="fade-up" style={{ marginTop: 20, background: "#18181b", borderRadius: 16, padding: 24, border: "1px solid #27272a" }}>
            <div style={{ fontSize: 12, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Результат</div>
            <div style={{ fontSize: 12, color: "#71717a", marginBottom: 4 }}>{result.section}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#a78bfa", marginBottom: 14 }}>{result.category}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: `${confColor[result.confidence] || "#6366f1"}22`, color: confColor[result.confidence] || "#818cf8", fontWeight: 600 }}>{result.confidence} уверенность</span>
              {result.detected_language && <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#27272a", color: "#a1a1aa" }}>{result.detected_language}</span>}
            </div>
            <div style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.6 }}>{result.reason}</div>
          </div>
        )}
        {history.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <div style={{ fontSize: 12, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>История ({history.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((h) => (
                <div key={h.ts} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#111114", borderRadius: 10, border: "1px solid #1e1e22", cursor: "pointer" }} onClick={() => { setText(h.text); setResult({ section: h.section, category: h.category, confidence: h.confidence, reason: h.reason, detected_language: h.detected_language }); }}>
                  <span style={{ fontSize: 13, color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{h.text}</span>
                  <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600, flexShrink: 0 }}>{h.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}