# OSINT Vision

**AI-Powered Image Intelligence Platform**

OSINT Vision is a professional open-source intelligence tool designed for security researchers, penetration testers, and investigators. It leverages Anthropic's Claude 3.5 Sonnet Vision capabilities to provide deep contextual analysis of images.

## Features

- **🤖 AI-Powered Analysis**: Uses Claude 3.5 Sonnet Vision for detailed image analysis.
- **🔍 4 Specialized Modes**:
  - **People**: Analysis of physical characteristics, clothing, and context.
  - **Location**: Geolocation using landmarks, flora, and architectural clues.
  - **Military**: Identification of equipment, vehicles, and threat assessment.
  - **OCR**: Extraction of text and structured data from documents.
- **📊 Metadata Extraction**: Automatic EXIF and GPS data extraction.
- **📄 Professional Reporting**: Export findings to PDF, JSON, or TXT.
- **⚖️ Ethical Framework**: Integrated ethical guidelines and usage terms.

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API Key (`claude-sonnet-4-5-20250929` access required)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/osint-vision.git
   cd osint-vision
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Create a `.env.local` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
osint-vision/
├── src/app/
│   ├── analyze/        # Main analysis interface
│   └── api/            # Next.js API Routes (Vision & EXIF)
├── src/components/     # React UI Components
├── src/lib/            # Core logic, types, and prompts
└── public/             # Static assets
```

## Security & Ethics

This tool is created for **defensive security and authorized research only**.
- Do not use for surveillance, harassment, or illegal activities.
- Respect privacy laws (GDPR/LOPD).
- The authors assume no liability for misuse.

## License

MIT
