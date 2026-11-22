/**
 * NoticeFlow AI - Curated Academic Notice Samples
 * High-fidelity realistic college circulars and exam schedules for 1-click evaluation & demo mode.
 */

export const SAMPLE_NOTICES = [
  {
    id: 'sample-vtu-exam',
    title: 'VTU End-Semester Examination & Fee Schedule Notification',
    badge: 'Multi-Event Circular',
    college: 'Visvesvaraya Technological University (VTU), Belagavi',
    issue_date: '2026-11-12',
    description: 'Official university circular containing examination fee registration deadlines, penalty dates, and theory exam commencement.',
    rawText: `VISVESVARAYA TECHNOLOGICAL UNIVERSITY
"Jnana Sangama", Belagavi - 590 018, Karnataka State
Ref: VTU/BGM/Reg(Eval)/Exam/2026-27/1429
Date: 12th November 2026

CIRCULAR / ಅಧಿಸೂಚನೆ

Sub: Schedule of Events for B.E / B.Tech / M.Tech Semester End Examinations (Winter 2026) - reg.

Principals of all Constituent and Affiliated Engineering Colleges are hereby requested to bring the following schedule of events to the notice of all concerned students and faculty members.

SCHEDULE OF ACTIVITIES:
1. Submission of Exam Application forms by candidates without penalty:
   Last Date: 28th November 2026 (5:00 PM)
   Applicable to: 3rd, 5th, and 7th Semester B.E./B.Tech regular & backlog students.

2. Submission of Exam Application forms with penal fee of ₹500/-:
   From: 29th November 2026 to 03rd December 2026 (5:00 PM)

3. Generation and issue of Hall Tickets by the Colleges:
   Date: 08th December 2026 onwards on the University Portal.

4. Commencement of Theory Examinations:
   Date: 15th December 2026 (Timing: 09:30 AM to 12:30 PM)
   Venue: Respective College Examination Centers.

5. Commencement of Practical / Project Examinations:
   Date: 05th January 2027 onwards.

NOTE: Strict compliance with the above dates is mandatory. Under no circumstances will the portal be reopened after 03-12-2026. Hall tickets will only be issued to students having minimum 75% attendance.

By Order,
Registrar (Evaluation), VTU Belagavi`,
    goldenResult: {
      notice_title: 'VTU End-Semester Examination & Fee Schedule (Winter 2026)',
      college_or_dept: 'Visvesvaraya Technological University (VTU), Belagavi',
      issue_date: '2026-11-12',
      language_detected: 'English / Kannada Reference',
      summary: 'VTU circular outlining the Winter 2026 B.E/B.Tech examination deadlines. Exam form submission without penalty closes on Nov 28, with ₹500 fine until Dec 3, and theory exams commence on Dec 15.',
      kannada_summary: 'ವಿಟಿಯು ಚಳಿಗಾಲದ 2026 ಪರೀಕ್ಷಾ ಶುಲ್ಕ ಪಾವತಿಗೆ ನವೆಂಬರ್ 28 ಕೊನೆಯ ದಿನ. ₹500 ದಂಡದೊಂದಿಗೆ ಡಿಸೆಂಬರ್ 3 ರವರೆಗೆ ಅವಕಾಶವಿದೆ. ಲಿಖಿತ ಪರೀಕ್ಷೆಗಳು ಡಿಸೆಂಬರ್ 15 ರಂದು ಪ್ರಾರಂಭವಾಗಲಿವೆ.',
      hindi_summary: 'वीटीयू शीतकालीन 2026 परीक्षा फॉर्म बिना जुर्माने के 28 नवंबर तक भरे जा सकते हैं। थ्योरी परीक्षाएं 15 दिसंबर से शुरू होंगी।',
      events: [
        {
          id: 'vtu-evt-1',
          title: 'VTU Exam Fee Submission (Without Penalty)',
          description: 'Last date for submission of online examination forms for 3rd, 5th, 7th Sem without penalty fee.',
          event_type: 'Registration',
          date: '2026-11-28',
          time: '17:00',
          deadline: '2026-11-28',
          venue: 'University Student Portal',
          priority: 'Urgent',
          reminder_days: [7, 3, 1],
          source_text: 'Submission of Exam Application forms by candidates without penalty: Last Date: 28th November 2026 (5:00 PM)',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'vtu-evt-2',
          title: 'VTU Exam Fee Late Submission (With ₹500 Fine)',
          description: 'Final cutoff window for submission with penal fee of ₹500. Portal closes permanently at 5:00 PM.',
          event_type: 'Registration',
          date: '2026-12-03',
          time: '17:00',
          deadline: '2026-12-03',
          venue: 'University Student Portal',
          priority: 'Urgent',
          reminder_days: [3, 1],
          source_text: 'Submission of Exam Application forms with penal fee of ₹500/-: From: 29th November 2026 to 03rd December 2026 (5:00 PM)',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'vtu-evt-3',
          title: 'VTU Hall Ticket Download Release',
          description: 'Hall tickets available for download on college portal for students meeting 75% attendance criteria.',
          event_type: 'Event',
          date: '2026-12-08',
          time: '10:00',
          deadline: null,
          venue: 'College Portal',
          priority: 'Important',
          reminder_days: [2, 1],
          source_text: 'Generation and issue of Hall Tickets by the Colleges: Date: 08th December 2026 onwards',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'vtu-evt-4',
          title: 'VTU Semester End Theory Exams Commence',
          description: 'Commencement of regular and backlog theory exams across all affiliated colleges.',
          event_type: 'Exam',
          date: '2026-12-15',
          time: '09:30',
          deadline: null,
          venue: 'Respective College Examination Centers',
          priority: 'Important',
          reminder_days: [7, 3, 1],
          source_text: 'Commencement of Theory Examinations: Date: 15th December 2026 (Timing: 09:30 AM to 12:30 PM)',
          is_uncertain: false,
          uncertainty_reason: null
        }
      ]
    }
  },
  {
    id: 'sample-project-capstone',
    title: 'Department Notice – Final Year Capstone Project & Viva',
    badge: 'Urgent Deadlines',
    college: 'Department of Computer Science & Engineering',
    issue_date: '2026-11-15',
    description: 'Notice detailing capstone project phase-1 abstract submission, code freeze, and external project viva voce dates.',
    rawText: `DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
COLLEGE OF ENGINEERING & TECHNOLOGY
NOTICE - CAPSTONE PROJECT PHASE-I (2026-27)

Date: 15 November 2026

Attention: 7th Semester B.Tech (CSE, AI&DS, ISE) Students

The Project Review Committee (PRC) has scheduled the following timeline for Major Project Phase-I evaluations. All students must strictly adhere to the guidelines.

1. Abstract & Problem Statement Submission:
   Deadline: 25th November 2026 before 11:59 PM.
   Submission mode: Google Classroom / Department Canvas LMS.
   Must include literature review matrix and faculty guide signature.

2. Mid-Term Demonstration & SRS Document Review:
   Date: 01st December 2026, from 09:30 AM to 04:30 PM.
   Venue: Software Engineering Lab (Lab 302).

3. Code Freeze & Final Project Report (Spiral Bound):
   Submission Deadline: 06th December 2026, 04:00 PM at Dept Office.
   Plagiarism must be under 15% (Turnitin report required).

4. External Viva Voce & Demonstration:
   Date: 10th December 2026, 09:00 AM sharp.
   Venue: CS Seminar Hall & Lab 304.
   Dress Code: Formal attire is mandatory.

Note: No extensions will be entertained. Non-submission of abstract on 25th Nov will lead to disqualification from external review.

Prof. R. Sundaram
Project Coordinator, CSE`,
    goldenResult: {
      notice_title: 'Capstone Project Phase-I Review & Submission Schedule',
      college_or_dept: 'Department of Computer Science & Engineering',
      issue_date: '2026-11-15',
      language_detected: 'English',
      summary: 'Mandatory deadlines for 7th Sem B.Tech CSE project phase-1. Abstract submission due on Nov 25, mid-term demo on Dec 1, code freeze on Dec 6, and final external viva on Dec 10.',
      kannada_summary: 'ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ 7 ನೇ ಸೆಮಿಸ್ಟರ್ ಮೇಜರ್ ಪ್ರಾಜೆಕ್ಟ್ ವೇಳಾಪಟ್ಟಿ: ಸಾರಾಂಶ ಸಲ್ಲಿಕೆ ನವೆಂಬರ್ 25, ಮಿಡ್-ಟರ್ಮ್ ಡೆಮೊ ಡಿಸೆಂಬರ್ 1 ಮತ್ತು ಅಂತಿಮ ವೈವಾ ಡಿಸೆಂಬರ್ 10.',
      hindi_summary: 'कंप्यूटर साइंस अंतिम वर्ष प्रोजेक्ट शेड्यूल: 25 नवंबर तक सारांश जमा करें, 1 दिसंबर को मिड-टर्म डेमो और 10 दिसंबर को एक्सटर्नल वाइवा होगा।',
      events: [
        {
          id: 'proj-evt-1',
          title: 'Project Abstract & Problem Statement Submission',
          description: 'Submit 2-page IEEE synopsis with faculty guide endorsement on Canvas LMS.',
          event_type: 'Assignment',
          date: '2026-11-25',
          time: '23:59',
          deadline: '2026-11-25',
          venue: 'Canvas LMS Portal',
          priority: 'Urgent',
          reminder_days: [3, 1],
          source_text: 'Abstract & Problem Statement Submission: Deadline: 25th November 2026 before 11:59 PM.',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'proj-evt-2',
          title: 'Mid-Term Project Demo & SRS Document Review',
          description: 'Progress review and software requirement specification evaluation before panel committee.',
          event_type: 'Event',
          date: '2026-12-01',
          time: '09:30',
          deadline: null,
          venue: 'Software Engineering Lab (Lab 302)',
          priority: 'Important',
          reminder_days: [3, 1],
          source_text: 'Mid-Term Demonstration & SRS Document Review: Date: 01st December 2026, from 09:30 AM to 04:30 PM.',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'proj-evt-3',
          title: 'Code Freeze & Final Spiral-Bound Report Submission',
          description: 'Hardcopy submission with Turnitin plagiarism report (<15%) at Department Office.',
          event_type: 'Assignment',
          date: '2026-12-06',
          time: '16:00',
          deadline: '2026-12-06',
          venue: 'CSE Department Office',
          priority: 'Urgent',
          reminder_days: [3, 1],
          source_text: 'Code Freeze & Final Project Report (Spiral Bound): Submission Deadline: 06th December 2026, 04:00 PM at Dept Office.',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'proj-evt-4',
          title: 'Final External Viva Voce & Project Demonstration',
          description: 'External evaluation panel assessment. Formal attire and working prototype mandatory.',
          event_type: 'Exam',
          date: '2026-12-10',
          time: '09:00',
          deadline: null,
          venue: 'CS Seminar Hall & Lab 304',
          priority: 'Urgent',
          reminder_days: [7, 3, 1],
          source_text: 'External Viva Voce & Demonstration: Date: 10th December 2026, 09:00 AM sharp.',
          is_uncertain: false,
          uncertainty_reason: null
        }
      ]
    }
  },
  {
    id: 'sample-hackathon-fest',
    title: 'TechnoNova 2026 – Annual Inter-College 36-Hour Hackathon',
    badge: 'Registration & Competition',
    college: 'Institution Innovation Council & Dept of IT',
    issue_date: '2026-11-18',
    description: 'National level hackathon announcement with cash prizes worth ₹1.5 Lakhs, registration deadline, and hackathon date.',
    rawText: `INSTITUTION'S INNOVATION COUNCIL (IIC)
INNOVATION & ENTREPRENEURSHIP CELL
CIRCULAR: TECHNO-NOVA 2026 HACKATHON

Date: 18th November 2026

Dear Students,
Registrations are now officially open for the prestigious 36-Hour National Hackathon: "TechnoNova 2026" focusing on AI for Social Impact, Green Energy, and Autonomous Systems.

IMPORTANT MILESTONES:
- Team Registration Closes: 27th November 2026 at 06:00 PM (Strict cutoff, max 4 members per team).
- Virtual Idea Screening Round Results: 30th November 2026, 07:00 PM on official website.
- On-Campus Grand Finale (36 Hours): 
  Starts: 12th December 2026 at 08:30 AM
  Ends: 13th December 2026 at 08:30 PM
  Venue: Campus Central Indoor Arena & High-Performance Computing Center.

Registration Fee: Free for in-house students.
Cash Pool: ₹1,50,000 + Incubation funding opportunities.

Interested teams can register at: https://hack.technonova2026.edu/apply

Dr. Anita Rao, Convener IIC`,
    goldenResult: {
      notice_title: 'TechnoNova 2026 - 36-Hour National Hackathon',
      college_or_dept: 'Institution Innovation Council (IIC) & IT Dept',
      issue_date: '2026-11-18',
      language_detected: 'English',
      summary: 'TechnoNova 2026 36-Hour Hackathon announcement. Team registration closes on Nov 27 at 6:00 PM, and the 36-hour grand finale takes place on Dec 12-13 at the Campus Indoor Arena.',
      kannada_summary: 'ಟೆಕ್ನೋನೋವಾ 2026 ರಾಷ್ಟ್ರೀಯ ಹ್ಯಾಕಥಾನ್: ತಂಡ ನೋಂದಣಿಗೆ ನವೆಂಬರ್ 27 ಕೊನೆಯ ದಿನ. ಮುಖ್ಯ ಸ್ಪರ್ಧೆಯು ಡಿಸೆಂಬರ್ 12 ಮತ್ತು 13 ರಂದು ನಡೆಯಲಿದೆ.',
      hindi_summary: 'टेक्नोनोवा 2026 36-घंटे का हैकाथॉन: टीम पंजीकरण की अंतिम तिथि 27 नवंबर है। मुख्य प्रतियोगिता 12-13 दिसंबर को होगी।',
      events: [
        {
          id: 'hack-evt-1',
          title: 'TechnoNova 2026 Team Registration Closes',
          description: 'Last date to register teams (max 4 members) for the 36-Hour National Hackathon with cash prize pool ₹1.5L.',
          event_type: 'Registration',
          date: '2026-11-27',
          time: '18:00',
          deadline: '2026-11-27',
          venue: 'Online Portal (https://hack.technonova2026.edu)',
          priority: 'Urgent',
          reminder_days: [5, 2, 1],
          source_text: 'Team Registration Closes: 27th November 2026 at 06:00 PM (Strict cutoff, max 4 members per team).',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'hack-evt-2',
          title: 'TechnoNova 36-Hour Hackathon Grand Finale',
          description: 'On-campus 36-hour prototyping marathon, mentoring sessions, and investor evaluation pitch.',
          event_type: 'Event',
          date: '2026-12-12',
          time: '08:30',
          deadline: null,
          venue: 'Campus Central Indoor Arena & HPC Center',
          priority: 'Important',
          reminder_days: [7, 3, 1],
          source_text: 'On-Campus Grand Finale (36 Hours): Starts: 12th December 2026 at 08:30 AM',
          is_uncertain: false,
          uncertainty_reason: null
        }
      ]
    }
  },
  {
    id: 'sample-scholarship-ssp',
    title: 'State Scholarship Portal (SSP) & Fee Concession Renewal',
    badge: 'Bilingual Circular',
    college: 'Student Welfare Section / ಸಮಾಜ ಕಲ್ಯಾಣ ಇಲಾಖೆ',
    issue_date: '2026-11-14',
    description: 'Notice regarding mandatory online application for post-matric scholarship renewal and physical document verification.',
    rawText: `OFFICE OF THE DEAN - STUDENT WELFARE
CIRCULAR / ಸುತ್ತೋಲೆ
Date / ದಿನಾಂಕ: 14-11-2026

Subject: Post-Matric Scholarship (SSP Portal) E-Attestation and Application Submission for 2026-27.
ವಿಷಯ: 2026-27 ನೇ ಸಾಲಿನ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ (SSP) ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆ ಕುರಿತು.

All eligible SC/ST/OBC/Minority students of 2nd, 3rd, and 4th year are informed that the State Scholarship Portal (SSP) has released the renewal and fresh application deadline.

Important Dates:
1. Online Application Submission on SSP Portal:
   Last Date: 26th November 2026 (05:00 PM)
   Link: https://ssp.postmatric.karnataka.gov.in

2. Physical Verification of Aadhar, Income & Caste Certificates at Student Welfare Office:
   Date: 29th November 2026 (10:00 AM to 04:00 PM)
   Venue: Administrative Block, Room 104.

ಎಲ್ಲ ಅರ್ಹ ವಿದ್ಯಾರ್ಥಿಗಳು ನಿಗದಿತ ದಿನಾಂಕದೊಳಗೆ ಆನ್‌ಲೈನ್‌ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ, ಕಚೇರಿಯಲ್ಲಿ ಪರಿಶೀಲನೆ ಮಾಡಿಸುವುದು ಕಡ್ಡಾಯ.

Dean, Student Welfare`,
    goldenResult: {
      notice_title: 'State Scholarship Portal (SSP) Post-Matric Renewal',
      college_or_dept: 'Dean - Student Welfare Section',
      issue_date: '2026-11-14',
      language_detected: 'English & Kannada (Bilingual)',
      summary: 'State Post-Matric scholarship online application closes on Nov 26 at 5:00 PM. Physical document e-attestation and verification scheduled for Nov 29 at Room 104.',
      kannada_summary: '2026-27 ನೇ ಸಾಲಿನ SSP ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ನವೆಂಬರ್ 26 ಕೊನೆಯ ದಿನಾಂಕ. ನವೆಂಬರ್ 29 ರಂದು ಕೊಠಡಿ 104 ರಲ್ಲಿ ದಾಖಲೆ ಪರಿಶೀಲನೆ ನಡೆಯಲಿದೆ.',
      hindi_summary: 'पोस्ट-मैट्रिक छात्रवृत्ति (SSP पोर्टल) के लिए ऑनलाइन आवेदन की अंतिम तिथि 26 नवंबर (शाम 5:00 बजे) है। 29 नवंबर को दस्तावेजों का भौतिक सत्यापन होगा।',
      events: [
        {
          id: 'ssp-evt-1',
          title: 'SSP Post-Matric Scholarship Online Application Deadline',
          description: 'Submit online application on State Scholarship Portal with updated Aadhar & income certificate.',
          event_type: 'Registration',
          date: '2026-11-26',
          time: '17:00',
          deadline: '2026-11-26',
          venue: 'SSP Portal (ssp.postmatric.karnataka.gov.in)',
          priority: 'Urgent',
          reminder_days: [5, 2, 1],
          source_text: 'Online Application Submission on SSP Portal: Last Date: 26th November 2026 (05:00 PM)',
          is_uncertain: false,
          uncertainty_reason: null
        },
        {
          id: 'ssp-evt-2',
          title: 'Scholarship Documents Physical Verification & E-Attestation',
          description: 'Present original caste, income, fee receipts, and marks cards at Welfare Office Room 104.',
          event_type: 'Event',
          date: '2026-11-29',
          time: '10:00',
          deadline: null,
          venue: 'Administrative Block, Room 104',
          priority: 'Important',
          reminder_days: [2, 1],
          source_text: 'Physical Verification of Aadhar, Income & Caste Certificates at Student Welfare Office: Date: 29th November 2026',
          is_uncertain: false,
          uncertainty_reason: null
        }
      ]
    }
  }
]
