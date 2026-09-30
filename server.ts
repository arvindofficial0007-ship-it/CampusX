import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-Side Gemini Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Intelligent Campus Navigation Agent endpoint
app.post('/api/campus-agent', async (req, res) => {
  try {
    const { message, currentLocation, campusPreset, chatHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message query is required' });
    }

    const ai = getGeminiAI();

    // Fallback if no API key is set yet or error occurs
    if (!ai) {
      return res.json({
        text: `Welcome to the **${campusPreset?.name || 'Campus'} Intelligent Navigation Agent**! I can guide you to any classroom, lab, faculty office, cafeteria, or library across campus.\n\n*Tip: Configure your GEMINI_API_KEY in the Settings panel to enable real-time generative intelligence.*`,
        suggestedFollowUps: [
          'How do I get to CS Lab 108 from North Gate?',
          'Where is a quiet study spot with power outlets?',
          'Find accessible wheelchair routes'
        ]
      });
    }

    const systemInstruction = `
You are the "Apex NaviGenius", the official hyper-intelligent AI Campus Navigation & Concierge Agent for ${campusPreset?.name || 'Apex Institute of Technology & Sciences'}.
You assist university students, freshmen, professors, mobility-impaired visitors, and guests with instant campus navigation, room finding, faculty directories, study spot recommendations, dietary options, schedule planning, and emergency safety.

Current Campus Context:
- Campus Name: ${campusPreset?.name} (${campusPreset?.shortName})
- Location: ${campusPreset?.location}
- User's Current Location: ${currentLocation ? JSON.stringify(currentLocation) : 'Main North Gate (Default)'}

List of Campus Buildings & Codes:
${(campusPreset?.buildings || []).map((b: any) => `
- [ID: "${b.id}"] ${b.name} (Code: ${b.code}, Category: ${b.category})
  * Entrance Node: "${b.entranceNodeId}"
  * Floors: ${b.floors?.join(', ')}
  * Key Departments: ${b.departments?.join(', ')}
  * Key Rooms: ${b.rooms?.map((r: any) => `Room ${r.roomNumber} (${r.name}, Floor ${r.floor}, ${r.occupancyStatus || 'Open'}${r.headOrProfessor ? `, Lead: ${r.headOrProfessor}` : ''})`).join('; ')}
  * Amenities: ${b.amenities?.map((a: any) => `${a.name} (${a.type}, Flr ${a.floor})`).join(', ')}
  * Hours: ${b.openingHours}
  * Accessibility: ${b.accessibilityFeatures?.join(', ')}
  * Emergency: ${b.emergencyContact || 'Campus Security x9111'}
`).join('\n')}

Campus Shuttles & Transit:
${(campusPreset?.shuttleSchedule || []).map((s: any) => `- ${s.routeName}: Next bus in ~${s.nextArrivalMins} mins. Stops: ${s.stops?.join(' -> ')}`).join('\n')}

Guidelines for your response:
1. Tone: Friendly, concise, supportive, authoritative campus guide.
2. Directness: Immediately give specific directions, building codes, floor numbers, room numbers, landmarks, and walking advice.
3. Multi-modal / Action Card: When the user is asking about a location, direction, or recommendation, choose the best 'actionCard':
   - 'navigate' (set buildingId, fromId, toId, roomId if known)
   - 'building_info' (set buildingId)
   - 'room_info' (set buildingId, roomId)
   - 'study_recommendation' (set buildingId for the best study spot)
   - 'dining_recommendation' (set buildingId for dining spot)
   - 'emergency' (for medical, security, lost & found, night escort)
4. Accessibility: If user mentions wheelchair, crutches, stairs aversion, or mobility, always highlight elevators, ramps, and ADA doors.
5. Provide 3 short, relevant follow-up chips under 'suggestedFollowUps'.

Always return your final output as valid JSON matching this schema:
{
  "text": "Markdown formatted explanation, directions, or answers",
  "actionCard": {
    "type": "navigate" | "building_info" | "room_info" | "study_recommendation" | "dining_recommendation" | "emergency" | null,
    "buildingId": "string (matching building ID above, e.g. bldg_cs_ai, bldg_library, etc.)",
    "roomId": "string (optional matching room ID)",
    "toId": "string (optional)",
    "fromId": "string (optional)",
    "title": "Short title for the visual card (e.g. Navigate to Turing CS Lab 108)",
    "subtitle": "Short subtitle (e.g. 1st Floor • AI & Machine Learning Lab)"
  },
  "suggestedFollowUps": ["Question 1", "Question 2", "Question 3"]
}
`;

    const conversationContext = chatHistory && Array.isArray(chatHistory)
      ? chatHistory.slice(-4).map((h: any) => `${h.sender === 'user' ? 'User' : 'Agent'}: ${h.text}`).join('\n')
      : '';

    const prompt = `
${conversationContext ? `Recent conversation:\n${conversationContext}\n` : ''}
User Query: "${message}"
Current Location: ${currentLocation?.name || 'North University Main Gate'}

Respond in JSON format as specified in system instructions.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        text: responseText,
        suggestedFollowUps: ['How do I get to Central Library?', 'Where is the Student Dining Hall?', 'Show campus shuttle times']
      };
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error in campus-agent endpoint:', err);
    return res.status(500).json({
      text: "I'm having a momentary connection glitch with the campus mainframe. However, you can still search any building or click directly on the 2D map to get real-time turn-by-turn routes!",
      suggestedFollowUps: [
        'Directions to Alan Turing CS Building',
        'Find 24/7 Library Study Rooms',
        'Where is the Student Health Center?'
      ]
    });
  }
});

// Schedule Optimizer AI endpoint
app.post('/api/optimize-schedule', async (req, res) => {
  try {
    const { schedule, campusPreset } = req.body;
    const ai = getGeminiAI();

    if (!ai) {
      return res.json({
        overview: "Here is your suggested schedule route across campus based on class timings.",
        recommendations: [
          "Arrive at Turing CS Complex 10 minutes early to secure a workstation with power.",
          "Take the covered Skybridge between CS Complex and Student Union to grab lunch without braving the outdoor rain.",
          "Head to Curie Science Complex using the East Plaza ramp for easiest access."
        ]
      });
    }

    const prompt = `
Given this student's class schedule at ${campusPreset?.name || 'Apex Tech'}:
${JSON.stringify(schedule, null, 2)}

Provide an optimized transit and study plan for their day. Highlight:
1. Optimal walking order and transit times between buildings.
2. Suggested study or recharge breaks during gaps between classes (e.g. quiet library pods or cafe).
3. Accessibility tips and fastest paths.

Return JSON in this format:
{
  "overview": "Brief summary of the day's transit flow",
  "recommendations": [
    "Tip 1 with specific building/room references",
    "Tip 2",
    "Tip 3"
  ],
  "estimatedTotalWalkingMins": 18
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in schedule optimizer:', error);
    return res.status(500).json({ error: 'Failed to optimize schedule' });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Campus Navigation Server running on http://localhost:${PORT}`);
  });
}

startServer();
