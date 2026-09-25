import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateGuidePdf() {
  const pdfDoc = await PDFDocument.create();

  // Load standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Standard A4 dimensions (595.28 x 841.89 points)
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // -------------------------------------------------------------
  // PAGE 1: Dark Navy Cover
  // -------------------------------------------------------------
  const page1 = pdfDoc.addPage([pageWidth, pageHeight]);

  // Background
  page1.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.04, 0.06, 0.10), // #0a0f1a
  });

  // Subtle grid lines for high-tech editorial feel
  for (let y = 100; y < pageHeight; y += 120) {
    page1.drawLine({
      start: { x: 30, y },
      end: { x: pageWidth - 30, y },
      thickness: 0.5,
      color: rgb(0.08, 0.12, 0.18),
    });
  }

  // Giant watermark "00" in bottom right
  page1.drawText('00', {
    x: pageWidth - 230,
    y: 90,
    size: 160,
    font: fontBold,
    color: rgb(0.06, 0.09, 0.15),
  });

  // Top Tracker / Header
  page1.drawText('FREELANCE MASTERY SYSTEMS   /   CLIENT ACQUISITION SYSTEM V4.2', {
    x: 45,
    y: pageHeight - 65,
    size: 9,
    font: fontBold,
    color: rgb(0.24, 0.65, 0.85), // cyan
  });

  // Pill badge: WELCOME · READ THIS FIRST
  const pillY = pageHeight - 165;
  page1.drawRectangle({
    x: 45,
    y: pillY,
    width: 175,
    height: 24,
    borderWidth: 1,
    borderColor: rgb(0.25, 0.32, 0.42),
    color: rgb(0.06, 0.09, 0.15),
  });
  page1.drawText('WELCOME  *  READ THIS FIRST', {
    x: 58,
    y: pillY + 7,
    size: 8,
    font: fontBold,
    color: rgb(0.75, 0.82, 0.92),
  });

  // Main Title: Start Here: Your Quick-
  page1.drawText('Start Here: Your Quick-', {
    x: 45,
    y: pageHeight - 220,
    size: 34,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Second line of Title: Start Guide
  page1.drawText('Start Guide', {
    x: 45,
    y: pageHeight - 262,
    size: 34,
    font: fontBold,
    color: rgb(0.95, 0.98, 0.85), // glowing tint
  });

  // Subtitle
  const subText1 = "What's inside your Client Acquisition System, which file to open first,";
  const subText2 = "and the 7-day plan to send your first high-quality proposals.";
  page1.drawText(subText1, {
    x: 45,
    y: pageHeight - 310,
    size: 13,
    font: fontRegular,
    color: rgb(0.70, 0.76, 0.86),
  });
  page1.drawText(subText2, {
    x: 45,
    y: pageHeight - 328,
    size: 13,
    font: fontRegular,
    color: rgb(0.70, 0.76, 0.86),
  });

  // 3 Pill badges: What's Inside, 7-Day Quick Start, Support
  const chipsY = pageHeight - 380;
  const chips = ["What's Inside", "7-Day Quick Start", "Support"];
  let chipX = 45;
  for (const chip of chips) {
    const chipWidth = chip.length * 7.5 + 24;
    page1.drawRectangle({
      x: chipX,
      y: chipsY,
      width: chipWidth,
      height: 26,
      borderWidth: 1,
      borderColor: rgb(0.18, 0.25, 0.35),
      color: rgb(0.08, 0.12, 0.19),
    });
    page1.drawText(chip, {
      x: chipX + 12,
      y: chipsY + 8,
      size: 9.5,
      font: fontBold,
      color: rgb(0.65, 0.75, 0.88),
    });
    chipX += chipWidth + 12;
  }

  // Bottom Footer on Cover
  page1.drawText('Start Here', {
    x: 45,
    y: 75,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page1.drawText('All packages', {
    x: 45,
    y: 60,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.55, 0.62, 0.72),
  });

  page1.drawText('2026 Edition', {
    x: pageWidth - 195,
    y: 75,
    size: 10,
    font: fontBold,
    color: rgb(0.75, 0.82, 0.92),
  });
  page1.drawText('Updated for the Connects economy & AI-ranked proposals', {
    x: pageWidth - 325,
    y: 60,
    size: 9,
    font: fontRegular,
    color: rgb(0.55, 0.62, 0.72),
  });

  // -------------------------------------------------------------
  // PAGE 2: Welcome + What's Inside Table + 7-Day Plan (Part 1)
  // -------------------------------------------------------------
  const page2 = pdfDoc.addPage([pageWidth, pageHeight]);

  // Page background: clean crisp white
  page2.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.99, 0.99, 1),
  });

  // Top Title
  page2.drawText("Welcome -- let's get you your next client", {
    x: 45,
    y: pageHeight - 65,
    size: 18,
    font: fontBold,
    color: rgb(0.05, 0.08, 0.12),
  });

  // Intro text
  const introP1 = "Thank you for joining. You now have a complete system for winning better clients on Upwork. You";
  const introP2 = "don't need to read everything today. Follow the order below and you'll have a rebuilt profile and your";
  const introP3 = "first strong proposals out within a week.";
  page2.drawText(introP1, { x: 45, y: pageHeight - 92, size: 9.5, font: fontRegular, color: rgb(0.25, 0.30, 0.35) });
  page2.drawText(introP2, { x: 45, y: pageHeight - 106, size: 9.5, font: fontRegular, color: rgb(0.25, 0.30, 0.35) });
  page2.drawText(introP3, { x: 45, y: pageHeight - 120, size: 9.5, font: fontRegular, color: rgb(0.25, 0.30, 0.35) });

  // Section Header
  page2.drawText("What's inside (and which package includes it)", {
    x: 45,
    y: pageHeight - 150,
    size: 13,
    font: fontBold,
    color: rgb(0.05, 0.08, 0.12),
  });

  // Table Dimensions
  const tableX = 45;
  let tableY = pageHeight - 165;
  const tableWidth = pageWidth - 90;
  const colW = [25, 115, 235, 45, 45, 40]; // #, File, What it's for, Starter, Complete, VIP

  // Table Header row (Dark background)
  page2.drawRectangle({
    x: tableX,
    y: tableY - 18,
    width: tableWidth,
    height: 20,
    color: rgb(0.06, 0.09, 0.14),
  });

  const headers = ['#', 'File', "What it's for", 'Starter', 'Complete', 'VIP'];
  let curX = tableX + 4;
  for (let i = 0; i < headers.length; i++) {
    page2.drawText(headers[i], {
      x: curX,
      y: tableY - 14,
      size: 8,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    curX += colW[i];
  }
  tableY -= 20;

  // Table Data
  const rows = [
    { num: '01', file: 'The Master Playbook', desc: 'The 5-module system: profile, proposals, vetting, pricing, retainers + 30-day plan', s: true, c: true, v: true },
    { num: '02', file: '15 Proposal Templates', desc: 'Copy-paste swipe file for 7 niches with examples', s: true, c: true, v: true },
    { num: '03', file: '1-Hour Profile Optimizer', desc: '100-point scorecard, Keyword Matrix, Title Generator', s: true, c: true, v: true },
    { num: '04', file: 'Job Vetting Radar & Connects', desc: 'Score jobs in 60s; budget Connects; spot scams', sText: 'Connects', c: true, v: true },
    { num: '05', file: 'Discovery Call & Rates', desc: 'Call script, 3-option offers, objections, rate plan', s: false, c: true, v: true },
    { num: '06', file: 'AI Proposal Prompt Matrix', desc: '15 prompts to work faster without sounding like AI', s: false, c: true, v: true },
    { num: '07', file: 'Negotiation Teardowns', desc: '5 annotated real-world negotiation conversations', s: false, c: true, v: true },
    { num: '08', file: '15 Proposal Audits', desc: 'Before/after red-pen audits across 8 industries', s: false, c: true, v: true },
    { num: '-', file: '1:1 Profile & Proposal Audit', desc: 'Personal 15-min Loom review of your profile + proposal', s: false, c: false, v: true },
  ];

  const drawVectorCheck = (p: typeof page2, cx: number, cy: number) => {
    p.drawLine({
      start: { x: cx, y: cy + 1 },
      end: { x: cx + 3, y: cy - 3 },
      thickness: 1.4,
      color: rgb(0.1, 0.65, 0.35),
    });
    p.drawLine({
      start: { x: cx + 3, y: cy - 3 },
      end: { x: cx + 8, y: cy + 5 },
      thickness: 1.4,
      color: rgb(0.1, 0.65, 0.35),
    });
  };

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const isEven = r % 2 === 0;
    const rowH = 21;

    if (isEven) {
      page2.drawRectangle({
        x: tableX,
        y: tableY - rowH + 2,
        width: tableWidth,
        height: rowH,
        color: rgb(0.97, 0.98, 0.99),
      });
    }

    // Border line bottom
    page2.drawLine({
      start: { x: tableX, y: tableY - rowH + 2 },
      end: { x: tableX + tableWidth, y: tableY - rowH + 2 },
      thickness: 0.5,
      color: rgb(0.90, 0.92, 0.94),
    });

    let cellX = tableX + 4;
    // num
    page2.drawText(row.num, { x: cellX, y: tableY - 12, size: 7.5, font: fontRegular, color: rgb(0.4, 0.45, 0.5) });
    cellX += colW[0];
    // file
    page2.drawText(row.file, { x: cellX, y: tableY - 12, size: 8, font: fontBold, color: rgb(0.1, 0.15, 0.2) });
    cellX += colW[1];
    // desc
    page2.drawText(row.desc.slice(0, 52), { x: cellX, y: tableY - 12, size: 7.5, font: fontRegular, color: rgb(0.3, 0.35, 0.4) });
    cellX += colW[2];

    // Starter column
    if (row.s) {
      drawVectorCheck(page2, cellX + 16, tableY - 11);
    } else if (row.sText) {
      page2.drawText(row.sText, { x: cellX + 4, y: tableY - 12, size: 7, font: fontBold, color: rgb(0.85, 0.45, 0.15) });
    } else {
      page2.drawText('-', { x: cellX + 18, y: tableY - 12, size: 8, font: fontRegular, color: rgb(0.65, 0.70, 0.75) });
    }
    cellX += colW[3];

    // Complete column
    if (row.c) {
      drawVectorCheck(page2, cellX + 16, tableY - 11);
    } else {
      page2.drawText('-', { x: cellX + 18, y: tableY - 12, size: 8, font: fontRegular, color: rgb(0.65, 0.70, 0.75) });
    }
    cellX += colW[4];

    // VIP column
    if (row.v) {
      drawVectorCheck(page2, cellX + 14, tableY - 11);
    } else {
      page2.drawText('-', { x: cellX + 16, y: tableY - 12, size: 8, font: fontRegular, color: rgb(0.65, 0.70, 0.75) });
    }

    tableY -= rowH;
  }

  // Your 7-day quick start section
  let planY = tableY - 30;
  page2.drawText('Your 7-day quick start', {
    x: 45,
    y: planY,
    size: 14,
    font: fontBold,
    color: rgb(0.05, 0.08, 0.12),
  });
  planY -= 20;

  const planPart1 = [
    {
      day: 1,
      title: 'Day 1 -- Read Modules 1 & 2 of the Playbook (about 1.5 hours)',
      desc: "Don't take action yet. Just understand how clients find and judge you.",
    },
    {
      day: 2,
      title: 'Day 2 -- Rebuild your profile with the Profile Optimizer',
      desc: 'Score before, fix, score after. Aim for 80+.',
    },
    {
      day: 3,
      title: 'Day 3 -- Learn the Vetting Radar',
      desc: 'Score 20 jobs without bidding. Set up 3-5 saved searches.',
    },
    {
      day: 4,
      title: 'Day 4 -- Build your master proposal',
      desc: 'Pick your niche template from the Swipe File. Fill in the worksheet at the end.',
    },
  ];

  for (const step of planPart1) {
    // Circle Badge
    page2.drawCircle({
      x: 58,
      y: planY - 6,
      size: 11,
      color: rgb(0.06, 0.09, 0.14),
    });
    page2.drawText(String(step.day), {
      x: 55,
      y: planY - 10,
      size: 9.5,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Title
    page2.drawText(step.title, {
      x: 80,
      y: planY - 4,
      size: 10,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.18),
    });

    // Desc
    page2.drawText(step.desc, {
      x: 80,
      y: planY - 18,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.40, 0.45),
    });

    planY -= 44;
  }

  // Page 2 Footer
  page2.drawText('Start Here | Freelance Mastery Systems', {
    x: 45,
    y: 35,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.55, 0.60, 0.65),
  });
  page2.drawText('Page 2 / 3', {
    x: pageWidth - 90,
    y: 35,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.55, 0.60, 0.65),
  });

  // -------------------------------------------------------------
  // PAGE 3: Days 5-7 + Key Callout Cards + Disclaimer
  // -------------------------------------------------------------
  const page3 = pdfDoc.addPage([pageWidth, pageHeight]);

  page3.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: rgb(0.99, 0.99, 1),
  });

  let p3Y = pageHeight - 55;

  const planPart2 = [
    {
      day: 5,
      title: 'Day 5 -- Send 3 proposals (Radar 7+ only)',
      desc: 'Use the 3-Sentence Hook. Record one Loom for your best job.',
    },
    {
      day: 6,
      title: 'Day 6 -- Prepare for calls',
      desc: 'Read Module 4 and the call script. Build your 3 options.',
    },
    {
      day: 7,
      title: 'Day 7 -- Review and repeat',
      desc: 'Update your tracker. From now on: 3-5 quality proposals a day in your bidding windows.',
    },
  ];

  for (const step of planPart2) {
    page3.drawCircle({
      x: 58,
      y: p3Y - 6,
      size: 11,
      color: rgb(0.06, 0.09, 0.14),
    });
    page3.drawText(String(step.day), {
      x: 55,
      y: p3Y - 10,
      size: 9.5,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page3.drawText(step.title, {
      x: 80,
      y: p3Y - 4,
      size: 10,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.18),
    });

    page3.drawText(step.desc, {
      x: 80,
      y: p3Y - 18,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.35, 0.40, 0.45),
    });

    p3Y -= 42;
  }

  p3Y -= 15;

  // CARD 1: THE 3 THINGS THAT MATTER MOST (Teal/Emerald Border)
  const card1H = 80;
  page3.drawRectangle({
    x: 45,
    y: p3Y - card1H,
    width: pageWidth - 90,
    height: card1H,
    borderWidth: 1,
    borderColor: rgb(0.35, 0.82, 0.65),
    color: rgb(0.96, 0.99, 0.98),
  });

  page3.drawText('THE 3 THINGS THAT MATTER MOST', {
    x: 60,
    y: p3Y - 18,
    size: 8.5,
    font: fontBold,
    color: rgb(0.12, 0.60, 0.45),
  });
  page3.drawText("1. Your first sentence must be about the client's specific problem.", {
    x: 60,
    y: p3Y - 35,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.20, 0.25),
  });
  page3.drawText('2. Only bid on jobs that score 7+ on the Radar.', {
    x: 60,
    y: p3Y - 50,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.20, 0.25),
  });
  page3.drawText('3. Never lower your price without lowering the scope.', {
    x: 60,
    y: p3Y - 65,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.20, 0.25),
  });

  p3Y -= card1H + 16;

  // CARD 2: USING THE FILES (Neutral/Slate Border)
  const card2H = 82;
  page3.drawRectangle({
    x: 45,
    y: p3Y - card2H,
    width: pageWidth - 90,
    height: card2H,
    borderWidth: 1,
    borderColor: rgb(0.80, 0.85, 0.90),
    color: rgb(0.98, 0.99, 1),
  });

  page3.drawText('USING THE FILES', {
    x: 60,
    y: p3Y - 18,
    size: 8.5,
    font: fontBold,
    color: rgb(0.40, 0.48, 0.58),
  });
  page3.drawText('*  All files are PDFs you can read on any device or print. Worksheets and checklists can be', {
    x: 60,
    y: p3Y - 34,
    size: 8,
    font: fontRegular,
    color: rgb(0.20, 0.25, 0.30),
  });
  page3.drawText('    printed and filled in by hand.', {
    x: 60,
    y: p3Y - 45,
    size: 8,
    font: fontRegular,
    color: rgb(0.20, 0.25, 0.30),
  });
  page3.drawText('*  Templates are easiest to copy from a computer. Always personalise the yellow parts.', {
    x: 60,
    y: p3Y - 58,
    size: 8,
    font: fontRegular,
    color: rgb(0.20, 0.25, 0.30),
  });
  page3.drawText('*  You get free updates when Upwork changes its rules, fees or features.', {
    x: 60,
    y: p3Y - 71,
    size: 8,
    font: fontRegular,
    color: rgb(0.20, 0.25, 0.30),
  });

  p3Y -= card2H + 16;

  // CARD 3: NEED HELP? (Blue Tint Border)
  const card3H = 58;
  page3.drawRectangle({
    x: 45,
    y: p3Y - card3H,
    width: pageWidth - 90,
    height: card3H,
    borderWidth: 1,
    borderColor: rgb(0.65, 0.78, 0.96),
    color: rgb(0.96, 0.98, 1),
  });

  page3.drawText('NEED HELP?', {
    x: 60,
    y: p3Y - 17,
    size: 8.5,
    font: fontBold,
    color: rgb(0.18, 0.42, 0.75),
  });
  page3.drawText('Email support@freelancemastery.io with your question. VIP members: reply to your welcome', {
    x: 60,
    y: p3Y - 33,
    size: 8,
    font: fontRegular,
    color: rgb(0.15, 0.22, 0.30),
  });
  page3.drawText('email with your profile link and one recent proposal to book your 1:1 audit.', {
    x: 60,
    y: p3Y - 45,
    size: 8,
    font: fontRegular,
    color: rgb(0.15, 0.22, 0.30),
  });

  p3Y -= card3H + 16;

  // CARD 4: AN HONEST NOTE (Rose/Pink Border)
  const card4H = 58;
  page3.drawRectangle({
    x: 45,
    y: p3Y - card4H,
    width: pageWidth - 90,
    height: card4H,
    borderWidth: 1,
    borderColor: rgb(0.95, 0.75, 0.82),
    color: rgb(1, 0.97, 0.98),
  });

  page3.drawText('AN HONEST NOTE', {
    x: 60,
    y: p3Y - 17,
    size: 8.5,
    font: fontBold,
    color: rgb(0.78, 0.25, 0.40),
  });
  page3.drawText('This system works when you apply it. Results depend on your skills, niche, proof and consistency.', {
    x: 60,
    y: p3Y - 33,
    size: 8,
    font: fontRegular,
    color: rgb(0.25, 0.18, 0.22),
  });
  page3.drawText('Nobody can honestly guarantee income -- but these methods remove the most common reasons', {
    x: 60,
    y: p3Y - 45,
    size: 8,
    font: fontRegular,
    color: rgb(0.25, 0.18, 0.22),
  });

  p3Y -= card4H + 20;

  // Legal disclaimer
  const legal1 = "(c) 2026 Freelance Mastery Systems. For the purchaser's personal use only. UPWORK is a registered trademark of Upwork Global";
  const legal2 = "Inc.; this guide is independent and not endorsed by Upwork. Case studies marked illustrative are composite examples built from";
  const legal3 = "common, realistic patterns to teach the method; they are not claims about specific individuals. Platform rules, fees and Connects";
  const legal4 = "costs change -- always confirm on Upwork's Help Center. No training can guarantee income; your results depend on your skills,";
  const legal5 = "niche, and execution.";

  page3.drawText(legal1, { x: 45, y: p3Y, size: 6.5, font: fontRegular, color: rgb(0.60, 0.65, 0.70) });
  page3.drawText(legal2, { x: 45, y: p3Y - 10, size: 6.5, font: fontRegular, color: rgb(0.60, 0.65, 0.70) });
  page3.drawText(legal3, { x: 45, y: p3Y - 20, size: 6.5, font: fontRegular, color: rgb(0.60, 0.65, 0.70) });
  page3.drawText(legal4, { x: 45, y: p3Y - 30, size: 6.5, font: fontRegular, color: rgb(0.60, 0.65, 0.70) });
  page3.drawText(legal5, { x: 45, y: p3Y - 40, size: 6.5, font: fontRegular, color: rgb(0.60, 0.65, 0.70) });

  // Page 3 Footer
  page3.drawText('Start Here | Freelance Mastery Systems', {
    x: 45,
    y: 35,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.55, 0.60, 0.65),
  });
  page3.drawText('Page 3 / 3', {
    x: pageWidth - 90,
    y: 35,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.55, 0.60, 0.65),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Generate and deploy to all required asset locations
async function run() {
  console.log('Generating Start Here Quick-Start Guide PDF...');
  const buffer = await generateGuidePdf();

  const productMeta = {
    id: 'prod_quick_start_guide',
    filename: 'Start-Here-Quick-Start-Guide.pdf',
    originalName: 'Start-Here-Quick-Start-Guide.pdf',
    fileSize: `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`,
    fileSizeBytes: buffer.length,
    fileType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    downloadUrl: '/api/download-product?id=prod_quick_start_guide'
  };

  // Directories
  const publicDownloads = path.resolve(process.cwd(), 'public', 'downloads');
  const distDownloads = path.resolve(process.cwd(), 'dist', 'downloads');
  const tmpDownloads = path.join('/tmp', 'upwork_downloads');
  const dataDir = path.resolve(process.cwd(), 'data');

  [publicDownloads, distDownloads, tmpDownloads, dataDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Write actual PDF files
  const filePaths = [
    path.join(publicDownloads, 'Start-Here-Quick-Start-Guide.pdf'),
    path.join(publicDownloads, 'active-product.pdf'),
    path.join(distDownloads, 'Start-Here-Quick-Start-Guide.pdf'),
    path.join(distDownloads, 'active-product.pdf'),
    path.join(tmpDownloads, 'Start-Here-Quick-Start-Guide.pdf'),
    path.join(tmpDownloads, 'active-product.pdf'),
  ];

  filePaths.forEach(fp => {
    try {
      const dir = path.dirname(fp);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fp, buffer);
      console.log(`Saved PDF to ${fp} (${buffer.length} bytes)`);
    } catch (e) {
      console.warn(`Could not write to ${fp}:`, e);
    }
  });

  // Write JSON metadata
  const listFiles = [
    path.join(dataDir, 'products_list.json'),
    path.join('/tmp', 'products_list.json'),
    path.resolve(process.cwd(), 'dist', 'products_list.json')
  ];

  const singleMetaFiles = [
    path.join(dataDir, 'product.json'),
    path.join('/tmp', 'product.json'),
    path.resolve(process.cwd(), 'dist', 'product.json')
  ];

  listFiles.forEach(fp => {
    try {
      fs.writeFileSync(fp, JSON.stringify([productMeta], null, 2));
      console.log(`Updated products list: ${fp}`);
    } catch {}
  });

  singleMetaFiles.forEach(fp => {
    try {
      fs.writeFileSync(fp, JSON.stringify(productMeta, null, 2));
      console.log(`Updated single product meta: ${fp}`);
    } catch {}
  });

  console.log('Successfully replaced test product with Start-Here-Quick-Start-Guide.pdf!');
}

run().catch(console.error);
