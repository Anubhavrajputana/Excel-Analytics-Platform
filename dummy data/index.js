app.post("/api/summary", async (req, res) => {
  try {
    const excelData = req.body.data;

    if (!excelData || excelData.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    // DUMMY FALLBACK
    const dummySummary = `
• Total Rows Analyzed: ${excelData.length}
• The highest value in column "${Object.keys(excelData[0])[1]}" is ${Math.max(...excelData.map(row => Number(row[Object.keys(row)[1]]) || 0))}.
• The lowest value is ${Math.min(...excelData.map(row => Number(row[Object.keys(row)[1]]) || 0))}.
• Insights indicate variations across "${Object.keys(excelData[0])[0]}" category.
    `;

    // Comment out real OpenAI API if quota is exceeded
    /*
    const prompt = `
Analyze the following Excel table data and provide key insights in bullet points:\n
${JSON.stringify(excelData.slice(0, MAX_ROWS), null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful data analysis assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const summary = response?.choices?.[0]?.message?.content;

    if (!summary) {
      return res.status(500).json({ error: "OpenAI returned an empty summary" });
    }
    */

    // Always return dummy summary for now
    res.json({ summary: dummySummary });

  } catch (err) {
    console.error("❌ /api/summary error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});
