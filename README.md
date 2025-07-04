# Machine Madlibs

> 'Machine Madlibs' workshop activities designed for SOAI 2025

An interactive web application that combines AI-powered text generation with visual poetry creation. Built for creative writing and artistic expression using local AI models.

## Features

### ✍️ Activity 1: Micro-fictions
- **Interactive storytelling** with AI-generated responses
- **Contextual generation** - AI remembers the full story as you build it
- **200-word limit** with automatic completion
- **Export stories** as timestamped text files

### 🎨 Activity 2: Visual Poetry
- **AI word generation** from custom themes or random words
- **Interactive canvas** - drag and drop words to create visual poems
- **Smart color system** - use hex codes or describe colors in natural language
- **Typography controls** - adjust size, colors, and toggle between serif/sans-serif fonts
- **Export artwork** as high-quality PNG images

## Prerequisites

- **Web browser** (Chrome, Firefox, Safari, or Edge)
- **Ollama** (for running AI models locally)
- **Basic terminal/command line** knowledge

## Setup Instructions

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai](https://ollama.ai/download) and run the installer.

### 2. Start Ollama Service

```bash
ollama serve
```

Keep this terminal window open - Ollama needs to run in the background.

### 3. Download the Project

```bash
git clone https://github.com/kapilan-naidu/machine_madlibs-soai.git
cd machine_madlibs-soai
```

### 4. Create AI Models

You'll need to create three custom models using the provided modelfiles. In a new terminal window:

**Model 1: Story Writer (mm_writer)**
```bash
ollama create mm_writer -f models/mm_writer_modelfile
```

**Model 2: Word Generator (mm_poet)**
```bash
ollama create mm_poet -f models/mm_poet_modelfile
```

**Model 3: Color Generator (mm_color)**
```bash
ollama create mm_color -f models/mm_color_modelfile
```

### 5. Verify Models Are Installed

```bash
ollama list
```

You should see all three models listed: `mm_writer`, `mm_poet`, and `mm_color`.

### 6. Launch the Application

Since this is a web application, you need to serve it through a web server (not just open the HTML file directly). Navigate to the `public` folder first:

```bash
cd public
```

Then start a web server:

**Option A: Using Python (recommended)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js**
```bash
npx http-server -p 8000
```

**Option C: Using PHP**
```bash
php -S localhost:8000
```

### 7. Open in Browser

Navigate to `http://localhost:8000` in your web browser.

## Usage

### Activity 1: Micro-fictions
1. **Start writing** - The AI will generate an opening line
2. **Add your input** - Type your contribution to the story
3. **Watch it grow** - The AI continues based on the full story context
4. **Export** - Download your complete story when finished (200 words max)

### Activity 2: Visual Poetry
1. **Generate words** - Enter a theme or leave blank for random words
2. **Build your poem** - Click words to add them to the canvas
3. **Customize** - Select words and adjust colors, sizes, and fonts
4. **Create** - Drag words around to create your visual composition
5. **Export** - Download your artwork as a PNG image

## Configuration

The API endpoint is configured in `public/js/config.js`:
```javascript
const API = "http://localhost:11434/api/generate";
```

If you're running Ollama on a different port or server, update this file accordingly.

## File Structure

```
machine_madlibs-soai/
├── public/                 # Web application files
│   ├── activity_01.html    # Micro-fictions interface
│   ├── activity_02.html    # Visual poetry interface
│   ├── css/
│   │   ├── normalize.css   # CSS reset
│   │   ├── layout.css      # Shared layout styles
│   │   ├── activity-01.css # Activity 1 styles
│   │   └── activity-02.css # Activity 2 styles
│   ├── js/
│   │   ├── config.js       # API configuration
│   │   ├── activity-01.js  # Activity 1 logic
│   │   ├── activity-02.js  # Activity 2 UI logic
│   │   └── sketch.js       # p5.js canvas logic
│   └── images/             # UI icons and assets
├── models/                 # Ollama model configurations
│   ├── mm_writer_modelfile
│   ├── mm_poet_modelfile
│   └── mm_color_modelfile
├── LICENSE                 # GNU General Public License v3.0
└── README.md
```

## Troubleshooting

**Problem: "Connection failed" or API errors**
- Ensure Ollama is running (`ollama serve`)
- Check that models are installed (`ollama list`)
- Verify the API URL in `js/config.js`

**Problem: Models not found**
- Re-run the model creation commands
- Check that modelfiles exist in the `models/` directory
- Ensure you're in the correct directory when running `ollama create`

**Problem: Blank page or JavaScript errors**
- Make sure you're serving the site through a web server from the `public/` directory
- Check browser console for specific error messages
- Ensure all files are properly downloaded

**Problem: Canvas not working**
- Visual poetry requires p5.js to load properly
- Check your internet connection (p5.js loads from CDN)
- Try refreshing the page

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

## Credits

- Built with [p5.js](https://p5js.org/) for canvas interactions
- Powered by [Ollama](https://ollama.ai/) for local AI models
- Designed for **SOAI 2025** workshop activities
- Created by [Kapilan Naidu](https://github.com/kapilan-naidu)

---

**Happy creating! 🎨📝**
