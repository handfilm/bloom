import { execSync } from 'child_process';
import fs from 'fs';

console.log('Generating exact 2 photos and video asset pipeline...');

// ==========================================
// 1. GENERATE PHOTO 1: rural-classroom-setup.jpg
// (Classroom with teacher, smart interactive board, students, and 2 ceiling box insets)
// ==========================================

// Create the main classroom background with teacher and smart board
execSync(`
convert -size 1376x768 xc:'#1a1f2c' \\
  \\( assets/pilot-classroom.jpg -resize 1376x768^ -gravity center -extent 1376x768 \\
     -modulate 106,112,100 -sharpen 0x0.8 \\
  \\) -composite \\
  \\( -size 420x250 xc:'#f8fafc' \\
     -stroke '#94a3b8' -strokewidth 2 -draw 'roundrectangle 0,0 419,249 8,8' \\
     \\( -size 400x42 xc:'#0f172a' -font DejaVu-Sans-Bold -pointsize 13 -fill '#34d399' -draw 'text 14,26 "🔒 CEILING SECURITY BOX: REINFORCED"' \\) -geometry +10+10 -composite \\
     \\( -size 400x180 xc:'#020617' \\
        \\( -size 190x160 xc:'#1e293b' -stroke '#334155' -strokewidth 1 -draw 'roundrectangle 0,0 189,159 6,6' \\
           -font DejaVu-Sans-Bold -pointsize 11 -fill '#e2e8f0' -draw 'text 10,24 "1. Locked Enclosure"' \\
           -font DejaVu-Sans -pointsize 10 -fill '#94a3b8' -draw 'text 10,48 "Heavy-duty steel casing\\nmounted to ceiling slab.\\nPadlocked against theft."' \\
        \\) -geometry +6+10 -composite \\
        \\( -size 190x160 xc:'#1e293b' -stroke '#334155' -strokewidth 1 -draw 'roundrectangle 0,0 189,159 6,6' \\
           -font DejaVu-Sans-Bold -pointsize 11 -fill '#38bdf8' -draw 'text 10,24 "2. Android Stick HDMI"' \\
           -font DejaVu-Sans -pointsize 10 -fill '#94a3b8' -draw 'text 10,48 "Stick housed inside.\\nNo exposed wiring.\\nOperates via remote."' \\
        \\) -geometry +204+10 -composite \\
     \\) -geometry +10+56 -composite \\
     -stroke 'rgba(16,185,129,0.7)' -strokewidth 2 -fill none -draw 'roundrectangle 0,0 419,249 8,8' \\
  \\) -geometry +24+24 -composite \\
  -quality 95 assets/rural-classroom-setup.jpg
`);
console.log('Generated assets/rural-classroom-setup.jpg');

// ==========================================
// 2. GENERATE PHOTO 2: rural-implementation-guide.jpg
// (Exact 4-Quadrant Rural Strategy Guide)
// ==========================================
execSync(`
convert -size 1376x768 xc:'#090d16' \\
  \\( assets/problem-screen.jpg -resize 664x330^ -gravity center -extent 664x330 \\
     \\( -size 664x46 xc:'rgba(15,23,42,0.92)' -font DejaVu-Sans-Bold -pointsize 15 -fill '#f43f5e' -draw 'text 16,30 "❌ 1. The Problem with TVs in Rural Schools"' \\) -gravity northwest -composite \\
     \\( -size 664x38 xc:'rgba(2,6,23,0.90)' -font DejaVu-Sans -pointsize 13 -fill '#cbd5e1' -draw 'text 16,25 "TVs face high damage & theft risk; costly screen replacements."' \\) -gravity southwest -composite \\
     -stroke 'rgba(244,63,94,0.5)' -strokewidth 2 -fill none -draw 'roundrectangle 0,0 663,329 8,8' \\
  \\) -geometry +16+16 -composite \\
  \\( assets/pilot-classroom.jpg -resize 664x330^ -gravity center -extent 664x330 \\
     \\( -size 664x46 xc:'rgba(15,23,42,0.92)' -font DejaVu-Sans-Bold -pointsize 15 -fill '#34d399' -draw 'text 16,30 "✅ 2. The Durable Projector Solution"' \\) -gravity northwest -composite \\
     \\( -size 664x38 xc:'rgba(2,6,23,0.90)' -font DejaVu-Sans -pointsize 13 -fill '#cbd5e1' -draw 'text 16,25 "Large-screen projection on standard wall/whiteboard. 100% durable."' \\) -gravity southwest -composite \\
     -stroke 'rgba(16,185,129,0.5)' -strokewidth 2 -fill none -draw 'roundrectangle 0,0 663,329 8,8' \\
  \\) -geometry +696+16 -composite \\
  \\( assets/connect-diagram.jpg -resize 664x330^ -gravity center -extent 664x330 \\
     \\( -size 664x46 xc:'rgba(15,23,42,0.92)' -font DejaVu-Sans-Bold -pointsize 15 -fill '#38bdf8' -draw 'text 16,30 "⚡ 3. Quick Implementation: Android Stick"' \\) -gravity northwest -composite \\
     \\( -size 664x38 xc:'rgba(2,6,23,0.90)' -font DejaVu-Sans -pointsize 13 -fill '#cbd5e1' -draw 'text 16,25 "Plug Android Stick into HDMI. Instant offline BLOOM classroom."' \\) -gravity southwest -composite \\
     -stroke 'rgba(56,189,248,0.5)' -strokewidth 2 -fill none -draw 'roundrectangle 0,0 663,329 8,8' \\
  \\) -geometry +16+362 -composite \\
  \\( assets/boardroom-proof.jpg -resize 664x330^ -gravity center -extent 664x330 \\
     \\( -size 664x46 xc:'rgba(15,23,42,0.92)' -font DejaVu-Sans-Bold -pointsize 15 -fill '#fbbf24' -draw 'text 16,30 "🔒 4. Rural Implementation Guide: Steel Security Enclosure"' \\) -gravity northwest -composite \\
     \\( -size 664x38 xc:'rgba(2,6,23,0.90)' -font DejaVu-Sans -pointsize 13 -fill '#cbd5e1' -draw 'text 16,25 "Mild steel enclosure + engineered heat grille + padlock security."' \\) -gravity southwest -composite \\
     -stroke 'rgba(251,191,36,0.5)' -strokewidth 2 -fill none -draw 'roundrectangle 0,0 663,329 8,8' \\
  \\) -geometry +696+362 -composite \\
  \\( -size 1344x36 xc:'rgba(15,23,42,0.95)' \\
     -stroke 'rgba(16,185,129,0.4)' -strokewidth 1 -draw 'roundrectangle 0,0 1343,35 6,6' \\
     -font DejaVu-Sans-Bold -pointsize 13 -fill '#34d399' -draw 'text 20,23 "BLOOM EdTech - হিয়ার বাগান"' \\
     -font DejaVu-Sans -pointsize 12 -fill '#94a3b8' -draw 'text 250,23 "Curriculum • Offline Learning • 10-Foot UI • Rural Primary Schools"' \\
  \\) -geometry +16+710 -composite \\
  -quality 95 assets/rural-implementation-guide.jpg
`);
console.log('Generated assets/rural-implementation-guide.jpg');

// ==========================================
// 3. GENERATE VIDEO: rural-classroom-video.mp4 & .webm
// (Projector Security Box Lens Glow + Teacher Bangla Alphabet Classroom Demo)
// ==========================================

// Create video poster
execSync(`
convert assets/pilot-classroom.jpg \\
  -resize 1280x720^ -gravity center -extent 1280x720 -quality 95 \\
  \\( -size 1280x720 xc:'rgba(0,0,0,0.35)' \\
     -fill 'rgba(16, 185, 129, 0.95)' -stroke '#ffffff' -strokewidth 3 -draw 'circle 640,360 640,430' \\
     -fill '#ffffff' -stroke none -draw 'polygon 624,336 624,384 668,360' \\
     -font DejaVu-Sans-Bold -pointsize 26 -fill '#ffffff' -draw 'text 40,670 "▶ ভিডিও ডেমো: গ্রামীণ স্কুলে প্রজেক্টর ও অ্যান্ড্রয়েড স্টিক পরিচালনা"' \\
  \\) -composite \\
  assets/rural-classroom-video-poster.jpg
`);

// Create high-compatibility MP4 video using standard H.264 Baseline and AAC
execSync(`
ffmpeg -y \\
  -loop 1 -t 4 -i assets/pilot-classroom.jpg \\
  -loop 1 -t 4 -i assets/lesson-screen.jpg \\
  -loop 1 -t 4 -i assets/home-menu.jpg \\
  -f lavfi -t 12 -i "sine=frequency=523.25:duration=12" \\
  -filter_complex "
    [0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='🔒 ১. সিলিং মাউন্টেড প্রটেক্টিভ কেসিং ও অ্যান্ড্রয়েড স্টিক':fontcolor=white:fontsize=24:x=30:y=30:box=1:boxcolor=black@0.7:boxborderw=10[v0];
    [1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='📚 ২. প্রজেক্টরে BLOOM বাংলা বর্ণমালা ইন্টারঅ্যাক্টিভ লেসন':fontcolor=0x34d399:fontsize=24:x=30:y=30:box=1:boxcolor=black@0.7:boxborderw=10[v1];
    [2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='✨ ৩. ১০-ফুট টিভি ইন্টারফেস: প্রত্যন্ত স্কুলে ১০০% অফলাইন ক্লাসরুম':fontcolor=0x38bdf8:fontsize=24:x=30:y=30:box=1:boxcolor=black@0.7:boxborderw=10[v2];
    [v0][v1][v2]concat=n=3:v=1:a=0[outv];
    [3:a]volume=0.08,afade=t=out:st=11:d=1[outa]
  " \\
  -map "[outv]" -map "[outa]" \\
  -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -movflags +faststart -r 25 \\
  -c:a aac -b:a 96k -ar 44100 \\
  assets/rural-classroom-video.mp4
`);

// Create WebM fallback
execSync(`
ffmpeg -y -i assets/rural-classroom-video.mp4 \\
  -c:v libvpx -b:v 1000k -crf 18 \\
  -c:a libvorbis -b:a 96k \\
  assets/rural-classroom-video.webm
`);

console.log('All 2 photos and video built successfully!');
