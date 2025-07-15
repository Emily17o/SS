require('dotenv').config();
const express = require('express');
const { getGlucose } = require('./libreLinkUpClient');

const app = express();
const port = process.env.PORT || 5000;

// Helper to translate trend arrow codes to readable text
function trendText(trend) {
  switch (trend) {
    case 1: return "rising quickly";
    case 2: return "rising";
    case 3: return "rising slightly";
    case 4: return "steady";
    case 5: return "falling slightly";
    case 6: return "falling";
    case 7: return "falling quickly";
    default: return "no trend";
  }
}

app.get('/glucose', async (req, res) => {
  try {
    const data = await getGlucose();
    const latest = data.graphData[0];
    const msg = `Your current glucose is ${latest.Value} mg/dL and is ${trendText(latest.TrendArrow)}.`;
    res.json({
      value: latest.Value,
      trend: trendText(latest.TrendArrow),
      time: latest.WT,
      message: msg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Libre CGM API listening at http://localhost:${port}`);
});