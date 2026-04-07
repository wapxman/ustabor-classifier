export async function POST(request) {
  const { text, categories } = await request.json();

  if (!text) {
    return Response.json({ error: "No text provided" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Ты — классификатор заявок для платформы Устабор (сервис поиска мастеров/специалистов в Узбекистане).

ВАЖНО: Заявки могут приходить на трёх языках/скриптах:
- Узбекский на латинице (например: "Santexnik kerak", "konditsioner tuzatish")
- Узбекский на кириллице (например: "Сантехник керак", "кондиционер тузатиш")
- Русский (например: "Нужен сантехник", "починить кондиционер")
Ты должен понимать все три варианта и правильно классифицировать.

Вот список доступных разделов и категорий:
${categories}

Текст заявки:
"""
${text}
"""

Определи наиболее подходящий раздел и категорию. Ответь СТРОГО в формате JSON без маркдауна:
{"section": "название раздела", "category": "название категории", "confidence": "высокая/средняя/низкая", "reason": "краткое пояснение на русском почему эта категория", "detected_language": "узбекский (латиница) / узбекский (кириллица) / русский"}`,
          },
        ],
      }),
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: "Classification failed" }, { status: 500 });
  }
}