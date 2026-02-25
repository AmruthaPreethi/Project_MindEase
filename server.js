const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve files inside /public

// Route for main page (mind3.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mind3.html'));
});

// Receive questionnaire answers
app.post('/submit-answers', (req, res) => {
  const answers = req.body;
  console.log('✅ Received answers:', answers);

  // Optional: save to data.json
  fs.appendFileSync('data.json', JSON.stringify(answers) + '\n');
  res.json({ message: 'Answers received successfully!' });
});

// Save mood to moods.json
app.post('/save-mood', (req, res) => {
  const { mood, notes } = req.body;
  const timestamp = new Date().toISOString();
  const moodEntry = { timestamp, mood, notes };

  const filePath = 'moods.json';
  let existingMoods = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content) existingMoods = JSON.parse(content);
  }
  existingMoods.push(moodEntry);
  fs.writeFileSync(filePath, JSON.stringify(existingMoods, null, 2));

  console.log('💾 Saved mood:', moodEntry);
  res.json({ message: 'Mood saved successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT}/mind3.html`);
});
