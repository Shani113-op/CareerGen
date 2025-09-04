# filename: smart_chatbot_v3.py

import os
import re
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Enhanced AI with Emotional Intelligence ---
# Deep learning capabilities for academic guidance and emotional support
try:
    import torch
    import numpy as np
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    from sentence_transformers import SentenceTransformer
    AI_AVAILABLE = True
    print("✅ AI libraries loaded - Enhanced emotional intelligence enabled")
except ImportError:
    AI_AVAILABLE = False
    print("⚠️ AI libraries not found. Install with: pip install transformers torch sentence-transformers")
    print("🔄 Running in basic mode - some emotional intelligence features limited")

# --- FastAPI App Initialization ---
app = FastAPI(
    title="CareerGenAI Production Chatbot API",
    version="4.0.0",
    description="Production-ready intelligent chatbot for CareerGenAI website services and career guidance.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- CORS Middleware ---
# CORS Configuration - Use environment variable for production
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",") if os.getenv("CORS_ORIGINS") else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration for deployment - Use environment variable for base URL
BASE_URL = os.getenv("FRONTEND_BASE_URL", "https://www.careergenai.in")

# SERVICE_MAPPINGS for endpoint compatibility with configurable URLs
SERVICE_MAPPINGS = {
    "resume_builder": {"keywords": ["resume builder", "resume", "cv"], "url": f"{BASE_URL}/resume-templates"},
    "premium_resume": {"keywords": ["premium resume", "advanced resume", "ai resume"], "url": f"{BASE_URL}/AllComponents"},
    "career_assessment": {"keywords": ["career assessment", "assessment"], "url": f"{BASE_URL}/interest-form"},
    "personality_quiz": {"keywords": ["personality quiz", "personality test"], "url": f"{BASE_URL}/careerQuiz"},
    "career_counselling": {"keywords": ["career counselling", "counseling"], "url": f"{BASE_URL}/consult"},
    "top_colleges": {"keywords": ["colleges", "college search"], "url": f"{BASE_URL}/college"},
    "career_comparison": {"keywords": ["career comparison", "compare careers"], "url": f"{BASE_URL}/compare"},
    "profile_builder": {"keywords": ["profile builder", "build profile"], "url": f"{BASE_URL}/profile-builder"},
    "career_details": {"keywords": ["career details", "career info"], "url": f"{BASE_URL}/careerDetail"},
    "chat": {"keywords": ["chat", "chatbot", "ai assistant"], "url": f"{BASE_URL}/chat"},
}

# Quick fix: Add missing functions to prevent startup errors
async def initialize_ai_models():
    """Initialize AI models - stub function"""
    logger.info("🚀 Initializing Enhanced AI Chatbot with Emotional Intelligence...")
    logger.info("⚠️ AI libraries not available - using enhanced rule-based intelligence")
    logger.info("✅ Enhanced chatbot initialized with academic database")

async def classify_intent_ai(message: str):
    """Classify intent using AI - stub function"""
    return {
        "intent": "general_question",
        "confidence": 0.7,
        "service": None,
        "query_context": {},
        "relevant_knowledge": {}
    }

async def detect_emotion(message: str):
    """Detect emotion - stub function"""
    return {
        "emotions": [],
        "primary_emotion": None,
        "needs_empathy": False
    }

# Cache for responses
response_cache = {}
cache_enabled = True

# --- Pydantic Models for API Data Structure ---
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    reply: str
    confidence: Optional[float] = None
    intent: Optional[str] = None
    suggestions: Optional[List[str]] = None
    metadata: Optional[Dict] = None

# --- UNIVERSAL AUGMENTED MODEL CONFIGURATION ---
AI_CONFIG = {
    "emotion_model": "j-hartmann/emotion-english-distilroberta-base",
    "similarity_model": "sentence-transformers/all-MiniLM-L6-v2",
    "universal_threshold": 0.7,
    "context_window": 512
}

# Global AI models and universal knowledge
ai_models = {}
universal_knowledge_base = {}
query_patterns = {}

# Production optimizations - Response caching for common queries
response_cache = {}
cache_enabled = True

# COMPREHENSIVE UNIVERSAL KNOWLEDGE BASE - All Website Services & Information
UNIVERSAL_KNOWLEDGE_BASE = {
    # Core Services Knowledge
    "services": {
        "career_assessment": {
            "description": "AI-powered career discovery tool that analyzes your interests and suggests matching careers",
            "features": ["18+ career interest areas", "AI matching algorithm", "Detailed career reports", "Skills assessment", "Growth prospects analysis"],
            "process": "Take quiz → AI analysis → Get top 5 career matches → Detailed insights → Action plan",
            "url": f"{BASE_URL}/interest-form",
            "type": "FREE",
            "duration": "15-20 minutes",
            "keywords": ["career assessment", "career test", "career quiz", "find career", "career match", "interest test", "what can i do", "features", "tools", "assessments"]
        },
        "personality_quiz": {
            "description": "Comprehensive personality analysis to understand your work style and matching careers",
            "features": ["Personality type identification", "Work style analysis", "Team dynamics", "Career alignment", "Growth areas"],
            "process": "Answer questions → Personality analysis → Career matching → Detailed report → Recommendations",
            "url": f"{BASE_URL}/careerQuiz",
            "type": "FREE",
            "duration": "10-15 minutes",
            "keywords": ["personality quiz", "personality test", "work style", "personality type", "mbti", "personality"]
        },
        "resume_builder": {
            "description": "Professional ATS-friendly resume builder with modern templates",
            "features": ["ATS-friendly templates", "Professional layouts", "Easy customization", "PDF download", "Multiple formats"],
            "process": "Choose template → Fill details → Customize design → Download PDF → Apply to jobs",
            "url": f"{BASE_URL}/resume-templates",
            "type": "FREE",
            "templates": ["Modern", "Classic", "Creative", "Minimalist", "Professional"],
            "keywords": ["resume builder", "resume", "cv", "build resume", "create resume", "resume template"]
        },
        "premium_resume": {
            "description": "AI-powered premium resume builder with advanced features and industry-specific templates",
            "features": ["AI content suggestions", "Industry-specific templates", "Keyword optimization", "Real-time feedback", "Cover letter builder"],
            "process": "Select industry → AI suggestions → Advanced customization → Optimization → Professional output",
            "url": f"{BASE_URL}/AllComponents",
            "type": "PREMIUM",
            "pricing": {"1_month": "₹1,999", "3_months": "₹2,999", "1_year": "₹3,999"},
            "keywords": ["premium resume builder", "premium resume", "ai resume", "advanced resume", "ai-powered resume", "premium templates"]
        },
        "career_counselling": {
            "description": "One-on-one expert career counselling sessions with certified professionals",
            "features": ["Certified counselors", "Personalized guidance", "Career planning", "Decision support", "Goal setting"],
            "process": "Book session → Expert consultation → Personalized plan → Follow-up support → Success tracking",
            "url": f"{BASE_URL}/consult",
            "type": "FREE consultation available",
            "duration": "30-60 minutes",
            "keywords": ["career counselling", "counseling", "expert guidance", "career advisor", "counselor", "guidance"]
        },
        "top_colleges": {
            "description": "Comprehensive database of 10,000+ colleges with smart search and filtering",
            "features": ["10,000+ colleges", "Smart filters", "Ranking data", "Admission info", "Fee structure", "Placement records"],
            "process": "Set preferences → Search colleges → Compare options → Get details → Apply",
            "url": f"{BASE_URL}/college",
            "type": "FREE",
            "coverage": "India and International",
            "keywords": ["colleges", "college search", "top colleges", "university", "admission", "college finder"]
        },
        "profile_builder": {
            "description": "Complete student career profile creation tool for comprehensive self-assessment",
            "features": ["Academic tracking", "Skills inventory", "Achievement records", "Goal setting", "Progress monitoring"],
            "process": "Enter details → Build profile → Track progress → Set goals → Monitor growth",
            "url": f"{BASE_URL}/profile-builder",
            "type": "FREE",
            "sections": ["Personal Info", "Education", "Skills", "Projects", "Achievements", "Goals"],
            "keywords": ["profile builder", "profile building", "student profile", "career profile", "profile creation", "build profile"]
        },
        "career_comparison": {
            "description": "Side-by-side career comparison tool for informed decision making",
            "features": ["Salary comparison", "Skills analysis", "Education requirements", "Growth prospects", "Work-life balance"],
            "process": "Select careers → Compare metrics → Analyze differences → Make decision → Get guidance",
            "url": f"{BASE_URL}/compare",
            "type": "FREE",
            "metrics": ["Salary", "Growth", "Education", "Skills", "Demand", "Lifestyle"],
            "keywords": ["career comparison", "compare careers", "career vs career", "which career", "career analysis"]
        },
        "career_roadmaps": {
            "description": "Step-by-step career roadmaps with detailed guidance for your dream career",
            "features": ["Step-by-step guides", "Timeline planning", "Skill development", "Milestone tracking", "Resource recommendations"],
            "process": "Choose career → Get roadmap → Follow steps → Track progress → Achieve goals",
            "url": f"{BASE_URL}/careerDetail",
            "type": "PREMIUM",
            "careers": ["Software Engineer", "Data Scientist", "Doctor", "Business Manager", "Digital Marketer"],
            "keywords": ["career roadmap", "career path", "career guide", "roadmap", "career plan"]
        },
        "ai_chatbot": {
            "description": "24/7 intelligent AI career assistant for instant guidance and support",
            "features": ["24/7 availability", "Instant responses", "Personalized guidance", "Emotional support", "Service navigation"],
            "process": "Ask question → AI analysis → Intelligent response → Follow-up support → Resource links",
            "url": f"{BASE_URL}/chat",
            "type": "FREE",
            "capabilities": ["Career guidance", "Service info", "Emotional support", "Academic help"],
            "keywords": ["chatbot", "ai assistant", "chat", "help", "support", "ask question"]
        }
    },
    
    # Website Information
    "website_info": {
        "about": {
            "mission": "Making career guidance accessible to every student through AI-powered tools and expert support",
            "vision": "To be the leading platform for intelligent career guidance and student success",
            "values": ["Accessibility", "Intelligence", "Empathy", "Excellence", "Innovation"],
            "founded": "2024",
            "team": "Career experts, AI specialists, and student counselors"
        },
        "pricing": {
            "free_services": 8,
            "premium_services": 2,
            "free_list": ["Career Assessment", "Personality Quiz", "AI Chatbot", "Career Counselling", "Profile Builder", "Top Colleges", "Career Comparison", "Resume Builder"],
            "premium_plans": {
                "1_month": {"price": "₹1,999", "features": ["Career Roadmaps", "Premium Resume Builder", "Priority Support"]},
                "3_months": {"price": "₹2,999", "features": ["All Premium Features", "Extended Support", "Multiple Roadmaps"], "popular": True},
                "1_year": {"price": "₹3,999", "features": ["All Features", "Unlimited Access", "Personal Mentor"], "best_value": True}
            }
        },
        "contact": {
            "phone_primary": "+91 8657869659",
            "phone_secondary": "+91 9619901999",
            "hours": "Mon-Sat (9 AM - 8 PM), Sun (10 AM - 6 PM)",
            "support_types": ["Career guidance", "Technical support", "Admission counselling", "General inquiries"],
            "response_time": "Within 24 hours"
        },
        "admission_counselling": {
            "description": "FREE admission counselling for major entrance exams and career paths",
            "coverage": {
                "engineering": ["JEE Main/Advanced", "BITSAT", "State CETs", "Private Entrance"],
                "medical": ["NEET UG", "AIIMS", "JIPMER", "State NEET"],
                "management": ["CAT", "XAT", "GMAT", "MAT", "SNAP"],
                "other": ["CLAT", "NIFT", "NID", "Hotel Management"]
            },
            "process": "Call → Expert consultation → Personalized strategy → College selection → Application guidance",
            "type": "FREE",
            "no_registration": True
        }
    },
    
    # Academic Guidance Database
    "academic_guidance": {
        "streams": {
            "engineering": {
                "popular_branches": ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Chemical"],
                "top_exams": ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE"],
                "career_options": ["Software Engineer", "Data Scientist", "Mechanical Engineer", "Civil Engineer", "Research Scientist"],
                "salary_range": "₹3-50 LPA",
                "growth_prospects": "Excellent, especially in tech and emerging fields"
            },
            "medical": {
                "popular_branches": ["MBBS", "BDS", "BAMS", "BHMS", "Nursing", "Pharmacy"],
                "top_exams": ["NEET UG", "NEET PG", "AIIMS", "JIPMER"],
                "career_options": ["Doctor", "Surgeon", "Researcher", "Healthcare Administrator", "Medical Consultant"],
                "salary_range": "₹5-100 LPA",
                "growth_prospects": "Stable, high respect, growing healthcare sector"
            },
            "commerce": {
                "popular_courses": ["B.Com", "BBA", "CA", "CS", "CFA", "MBA"],
                "top_exams": ["CAT", "XAT", "GMAT", "CA Foundation", "CS Foundation"],
                "career_options": ["Chartered Accountant", "Business Manager", "Financial Analyst", "Entrepreneur", "Consultant"],
                "salary_range": "₹4-75 LPA",
                "growth_prospects": "High growth potential across industries"
            }
        }
    }
}

# Location-based College Database
LOCATION_COLLEGE_DATABASE = {
    "mumbai": {
        "engineering": ["IIT Bombay", "VJTI Mumbai", "SPIT Mumbai", "DJ Sanghvi", "Thadomal Shahani", "KJ Somaiya"],
        "medical": ["Seth GS Medical College", "Lokmanya Tilak Medical College", "Topiwala National Medical College", "BYL Nair Hospital"],
        "commerce": ["St. Xavier's College", "HR College", "Mithibai College", "KC College", "NMIMS Mumbai"],
        "arts": ["St. Xavier's College", "Elphinstone College", "Wilson College", "Ruia College"],
        "management": ["NMIMS Mumbai", "JBIMS", "SP Jain", "Welingkar Institute"]
    },
    "delhi": {
        "engineering": ["IIT Delhi", "DTU", "NSIT", "IIIT Delhi", "Jamia Millia Islamia", "Bharati Vidyapeeth"],
        "medical": ["AIIMS Delhi", "MAMC Delhi", "UCMS Delhi", "LHMC Delhi", "VMMC Delhi"],
        "commerce": ["SRCC", "LSR", "Hindu College", "Hansraj College", "Ramjas College", "Kirori Mal College"],
        "arts": ["St. Stephen's College", "Hindu College", "Miranda House", "LSR", "Ramjas College"],
        "management": ["FMS Delhi", "IIM Rohtak", "MDI Gurgaon", "IMT Ghaziabad"]
    },
    "bangalore": {
        "engineering": ["IISc Bangalore", "IIIT Bangalore", "RV College", "BMS College", "PES University", "MS Ramaiah"],
        "medical": ["NIMHANS", "St. John's Medical College", "Bangalore Medical College", "MS Ramaiah Medical"],
        "commerce": ["Christ University", "St. Joseph's College", "Mount Carmel College", "Jain University"],
        "arts": ["Christ University", "St. Joseph's College", "Bangalore University", "Jain University"],
        "management": ["IIM Bangalore", "IIPM Bangalore", "Christ University", "Alliance University"]
    },
    "chennai": {
        "engineering": ["IIT Madras", "Anna University", "SSN College", "PSG College", "VIT Chennai", "SRM Chennai"],
        "medical": ["CMC Vellore", "Stanley Medical College", "Madras Medical College", "Sri Ramachandra Medical"],
        "commerce": ["Loyola College", "Stella Maris College", "Presidency College", "MOP Vaishnav"],
        "arts": ["Loyola College", "Stella Maris College", "Presidency College", "Women's Christian College"],
        "management": ["IIM Chennai", "Great Lakes", "Loyola Institute", "SRM Business School"]
    },
    "pune": {
        "engineering": ["COEP", "PICT", "VIT Pune", "MIT Pune", "Symbiosis Institute", "PCCOE"],
        "medical": ["Armed Forces Medical College", "BJ Medical College", "Symbiosis Medical College", "Dr. DY Patil Medical College", "Bharati Vidyapeeth Medical College", "Maharashtra Institute of Medical Sciences"],
        "commerce": ["Fergusson College", "Symbiosis College", "Modern College", "SP College"],
        "arts": ["Fergusson College", "Symbiosis College", "Modern College", "Garware College"],
        "management": ["SCMHRD", "SIBM Pune", "MIT School of Management", "PUMBA"]
    },
    "hyderabad": {
        "engineering": ["IIT Hyderabad", "IIIT Hyderabad", "BITS Pilani Hyderabad", "CBIT", "Osmania University"],
        "medical": ["AIIMS Hyderabad", "Osmania Medical College", "Gandhi Medical College", "Kamineni Medical"],
        "commerce": ["Osmania University", "St. Francis College", "Loyola Academy", "ICFAI Business School"],
        "arts": ["Osmania University", "St. Francis College", "Loyola Academy", "Nizam College"],
        "management": ["ISB Hyderabad", "ICFAI Business School", "Osmania University", "JNTU"]
    },
    "kolkata": {
        "engineering": ["IIT Kharagpur", "Jadavpur University", "Bengal Engineering College", "Kalyani University"],
        "medical": ["Medical College Kolkata", "IPGMER", "RG Kar Medical College", "NRS Medical College"],
        "commerce": ["St. Xavier's College", "Presidency College", "Scottish Church College", "Calcutta University"],
        "arts": ["St. Xavier's College", "Presidency College", "Scottish Church College", "Jadavpur University"],
        "management": ["IIM Calcutta", "XLRI Jamshedpur", "St. Xavier's University", "Calcutta University"]
    },
    "jaipur": {
        "engineering": ["MNIT Jaipur", "JNU Jaipur", "Poornima College", "Arya College", "LNM Institute"],
        "medical": ["SMS Medical College", "JLN Medical College", "Mahatma Gandhi Medical College"],
        "commerce": ["Rajasthan University", "St. Xavier's Jaipur", "Poddar College"],
        "arts": ["Rajasthan University", "St. Xavier's Jaipur", "Maharani College"],
        "management": ["MNIT Jaipur", "Amity Jaipur", "JNU Jaipur"]
    },
    "ahmedabad": {
        "engineering": ["IIT Gandhinagar", "NIT Surat", "PDPU", "Nirma University", "LD College"],
        "medical": ["BJ Medical College", "NHL Medical College", "Smt. SCL Medical College"],
        "commerce": ["Gujarat University", "Nirma University", "HL College"],
        "arts": ["Gujarat University", "St. Xavier's Ahmedabad", "Christ College"],
        "management": ["IIM Ahmedabad", "Nirma University", "Gujarat University"]
    },
    "indore": {
        "engineering": ["IIT Indore", "SGSITS", "Medicaps University", "Acropolis Institute"],
        "medical": ["MGM Medical College", "Sri Aurobindo Medical College", "Index Medical College"],
        "commerce": ["Devi Ahilya University", "Prestige Institute", "Acropolis Institute"],
        "arts": ["Devi Ahilya University", "Holkar College", "Government College"],
        "management": ["IIM Indore", "Prestige Institute", "Acropolis Institute"]
    }
}

# COMPREHENSIVE QUESTION PATTERNS FOR ALL 5 CATEGORIES
QUESTION_PATTERNS = {
    # 1. Services & Features Questions
    "services_features": {
        "patterns": [
            r"what can i do on this website",
            r"list all your features",
            r"what services do you offer",
            r"what all things do you offer",
            r"tell me about your.*tools",
            r"what kind of assessments",
            r"do you have.*tool.*cv|resume",
            r"feature.*compare.*career",
            r"can you.*help.*find.*college",
            r"ai.*powered.*tools",
            r"is there.*feature",
            r"counselling.*real person",
            r"what.*website.*for",
            r"can you.*build.*cv",
            r"is there.*feature.*help.*compare",
            r"can you actually.*help.*find.*college",
            r"so what all things.*offer",
            r"tell me about.*ai.*powered.*tools",
            r"what kind of.*assessments.*have",
            r"is.*counselling.*with.*real person",
            r"what.*can.*do.*here",
            r"show me.*features",
            r"what.*tools.*available"
        ],
        "response_type": "services_overview"
    },
    
    # 2. Cost & Pricing Questions  
    "cost_pricing": {
        "patterns": [
            r"is this.*free",
            r"how much.*cost",
            r"subscription plans",
            r"what.*included.*free",
            r"pay.*career assessment",
            r"exactly what.*get.*free",
            r"why.*pay.*premium",
            r"price.*premium.*resume",
            r"hidden charges",
            r"pricing",
            r"cost.*money",
            r"is this website free to use",
            r"what are your subscription plans",
            r"what features.*included.*free plan",
            r"do i have to pay.*take.*career assessment",
            r"tell me exactly what.*get.*free",
            r"why should i pay.*premium version",
            r"what is.*price.*premium resume builder",
            r"are there.*hidden charges",
            r"how much does it cost",
            r"what.*pricing.*plans"
        ],
        "response_type": "pricing_details"
    },
    
    # 3. How To & Process Questions
    "how_to_process": {
        "patterns": [
            r"how.*get started",
            r"process.*register|sign up",
            r"how.*book.*session.*counsellor",
            r"where.*personality quiz",
            r"what happens.*complete.*assessment",
            r"how.*use.*college search",
            r"guide.*build.*profile",
            r"how to.*",
            r"what.*process",
            r"step.*step",
            r"what is.*process.*register",
            r"how can i book.*session.*career counsellor",
            r"where can i find.*personality quiz",
            r"what happens after.*complete.*interest assessment",
            r"how do i use.*college search feature",
            r"can you guide.*how to build.*profile",
            r"how do i.*",
            r"what are.*steps",
            r"guide me.*how to"
        ],
        "response_type": "process_guide"
    },
    
    # 4. About Us & Platform Questions
    "about_platform": {
        "patterns": [
            r"what is careergenai",
            r"who.*website.*for",
            r"platform.*only.*students.*india",
            r"working professionals.*use",
            r"where.*company.*based",
            r"main goal.*website",
            r"different.*other.*career portals",
            r"about.*company",
            r"who are you",
            r"who is this website for",
            r"is this platform only for students in india",
            r"can working professionals also use this site",
            r"where is your company based",
            r"what is.*main goal.*this website",
            r"how are you different.*other career portals",
            r"tell me about.*company",
            r"what.*careergenai"
        ],
        "response_type": "about_us"
    },
    
    # 5. Support & Contact Questions
    "support_contact": {
        "patterns": [
            r"contact.*support",
            r"phone number.*email",
            r"talk.*person.*admission",
            r"working hours",
            r"facing.*issue.*registration",
            r"contact.*help",
            r"customer.*support",
            r"need help",
            r"how can i contact.*customer support",
            r"what is your phone number.*email address",
            r"i need to talk.*person.*admission guidance",
            r"what are your working hours",
            r"i.*facing.*issue.*registration.*who can i contact",
            r"how.*contact.*support",
            r"customer.*service",
            r"support.*team",
            r"help.*contact"
        ],
        "response_type": "contact_support"
    }
}

# COMPREHENSIVE RESPONSE TEMPLATES - Function to generate templates with BASE_URL
def get_response_templates():
    return {
    "services_overview": f"""🎯 **CAREERGENAI - COMPLETE SERVICE PORTFOLIO**

**🆓 FREE SERVICES (8 Total) - Registration Required, No Money:**
1. **Career Assessment** - AI-powered career discovery based on your interests
2. **Personality Quiz** - Discover your personality type and matching careers  
3. **AI Chatbot** - 24/7 intelligent career assistant (that's me! 🤖)
4. **Career Counselling** - One-on-one sessions with certified experts
5. **Profile Builder** - Create your comprehensive student career profile
6. **Top Colleges Search** - Explore 10,000+ colleges with smart filters
7. **Career Comparison Tool** - Compare salaries, skills, and growth prospects
8. **Resume Builder** - ATS-friendly professional resume templates

**💎 PREMIUM SERVICES (2 Total) - Paid Subscription:**
9. **Career Roadmaps** - Step-by-step guides for your dream career
10. **Premium Resume Builder** - AI-powered templates with advanced features

**🎁 BONUS:** FREE Admission Counselling for Engineering/MBBS/MBA/Medical courses (No registration required!)

**✨ AI-Powered Tools Include:**
- Intelligent career matching algorithms
- Personality-based career suggestions  
- Smart college recommendations
- ATS-optimized resume building
- 24/7 conversational AI support

**Real Person Counselling:** Yes! Our career counselling connects you with certified human experts for personalized guidance.

**🔗 Quick Access Links:**
- Career Assessment: {BASE_URL}/interest-form
- Personality Quiz: {BASE_URL}/careerQuiz
- Resume Builder (FREE): {BASE_URL}/resume-templates
- Premium Resume Builder: {BASE_URL}/AllComponents
- College Search: {BASE_URL}/college
- Expert Counselling: {BASE_URL}/consult
- Career Comparison: {BASE_URL}/compare
- Profile Builder: {BASE_URL}/profile-builder
- Career Details: {BASE_URL}/careerDetail

Ready to explore? Which service interests you most?""",

    "pricing_details": f"""💰 **CAREERGENAI PRICING - TRANSPARENT & AFFORDABLE**

**🆓 FREE SERVICES (Registration Required, No Money):**
✅ Career Assessment - AI career discovery
✅ Personality Quiz - Know your work style  
✅ AI Chatbot - 24/7 career assistant
✅ Career Counselling - Expert consultations
✅ Profile Builder - Student career profiles
✅ Top Colleges Search - 10,000+ colleges
✅ Career Comparison - Compare career paths
✅ Resume Builder - Professional templates
✅ **FREE Admission Counselling** - Engineering/MBBS/MBA guidance (No registration needed!)

**💎 PREMIUM PLANS (Only 2 Features):**
🥉 **1 Month** - ₹1,999
🥈 **3 Months** - ₹2,999 (MOST POPULAR - Save 33%)  
🥇 **1 Year** - ₹3,999 (BEST VALUE - Save 83%)

**Premium Features:**
- Career Roadmaps (downloadable step-by-step guides)
- Premium Resume Builder (6+ AI-powered templates)

**What You Get FREE (Just Register - No Payment):**
- 8 complete services worth ₹10,000+
- FREE account registration (no fees)
- No assessment charges  
- No counselling fees
- No college search limits
- Unlimited access to all free features

**Why Upgrade to Premium?**
- Detailed career roadmaps for 50+ careers
- Advanced AI resume optimization
- Priority customer support

**🔗 Get Started:**
- Register Free: {BASE_URL}/register
- View Pricing: {BASE_URL}/pricing

**Payment:** Secure payments • Cancel anytime • No hidden charges

80% of our features are FREE forever (just register)! Need more details about any plan?""",

    "process_guide": f"""🚀 **HOW TO GET STARTED - STEP-BY-STEP GUIDE**

**📝 FREE Registration Process (2 Minutes, No Payment):**
1. Visit: {BASE_URL}/register
2. Fill: Name, Email, Mobile, Password  
3. Receive 6-digit OTP via email
4. Enter OTP for instant verification
5. **Account activated!** Access all 8 FREE services immediately (no money required)

**🎯 Using Career Assessment (FREE after registration):**
1. Login → Visit: {BASE_URL}/interest-form
2. Select from 18 interest areas (Mathematics, Design, Technology, etc.)
3. AI analyzes your choices in real-time
4. Get top 5 career matches with detailed insights
5. Download your personalized career report

**👨‍💼 Booking Career Counselling (FREE after registration):**
1. Visit: {BASE_URL}/consult
2. Choose available time slot
3. Provide your academic background
4. Connect with certified career expert
5. Get personalized guidance (30-60 minutes)

**🧠 Taking Personality Quiz (FREE after registration):**
1. Visit: {BASE_URL}/careerQuiz
2. Answer personality-based questions
3. Discover your type: Analytical, Creative, Helper, or Builder
4. Get matching career suggestions
5. Download detailed PDF results

**🏛️ College Search Process (FREE after registration):**
1. Visit: {BASE_URL}/college
2. Enter: Percentile + Course + Location
3. Get filtered results based on eligibility  
4. Compare colleges, fees, placements
5. Save favorites and get admission guidance

**🔍 Career Comparison Tool (FREE after registration):**
1. Visit: {BASE_URL}/compare
2. Select careers to compare side-by-side
3. Analyze salary, growth, and requirements
4. Make informed career decisions

**�  Premium Resume Builder (PAID subscription):**
1. Visit: {BASE_URL}/AllComponents
2. Access advanced AI-powered resume templates
3. Get industry-specific suggestions and optimization
4. Create professional resumes with advanced features

**👤 Building Your Profile (FREE after registration):**
1. Visit: {BASE_URL}/profile-builder
2. Add: Education, Skills, Projects, Goals
3. Track your academic progress
4. Set career milestones
5. Monitor growth over time

**📄 Resume Builder (FREE after registration):**
1. Visit: {BASE_URL}/resume-templates
2. Choose from professional templates
3. Fill in your details
4. Download ATS-friendly PDF

**🆓 FREE Admission Counselling (No registration required!):**
- Visit: {BASE_URL} and click **'Book Now'**
- Available for Engineering/MBBS/MBA/Medical
- Direct expert consultation at zero cost

**🔗 Quick Start Links:**
- Register: {BASE_URL}/register
- Login: {BASE_URL}/login

Need help with any specific step?""",

    "about_us": f"""🌟 **ABOUT CAREERGENAI - YOUR AI-POWERED CAREER COMPANION**

**🎯 What is CareerGenAI?**
CareerGenAI is India's leading AI-powered career guidance platform that makes professional career counselling accessible to every student through intelligent technology and expert support.

**👥 Who is this for?**
- **Students (Class 10-12)** - Career exploration and stream selection
- **College Students** - Specialization and skill development guidance  
- **Working Professionals** - Career transitions and upskilling
- **Parents** - Understanding career options for their children
- **Career Changers** - Exploring new professional paths

**🇮🇳 Geographic Coverage:**
- **Primary Focus:** Indian students and education system
- **Global Reach:** International career guidance available
- **Local Expertise:** Deep understanding of Indian job market
- **Company Base:** India (serving students nationwide)

**🎯 Our Mission:**
"Making intelligent career guidance accessible to every student through AI-powered tools and expert human support"

**🔮 Our Vision:**  
"To be the leading platform where technology meets human expertise for career success"

**💡 What Makes Us Different:**
- **AI + Human Expertise:** Best of both worlds
- **Comprehensive Platform:** 10 services under one roof
- **Accessibility:** 8 services completely FREE
- **Real Experts:** Certified career counsellors  
- **Data-Driven:** AI algorithms for personalized guidance
- **Student-Centric:** Designed specifically for student needs

**🏆 Our Values:**
- **Accessibility** - Career guidance for everyone
- **Intelligence** - AI-powered personalized recommendations  
- **Empathy** - Understanding student challenges
- **Excellence** - High-quality guidance and support
- **Innovation** - Cutting-edge technology for career discovery

**👨‍💼 Our Team:**
- Certified career counsellors and psychologists
- AI specialists and data scientists  
- Education experts and industry professionals
- Student success coordinators

**🎯 Main Goal:**
To bridge the gap between student potential and career success through intelligent guidance, making career decisions less stressful and more informed.

Ready to start your career journey with us?""",

    "contact_support": f"""📞 **CAREERGENAI SUPPORT & CONTACT INFORMATION**

**📱 Primary Contact Numbers:**
- **Main Support:** +91 8657869659
- **Secondary:** +91 9619901999  
- **WhatsApp:** Available on both numbers
- **Website:** {BASE_URL}

**🕒 Working Hours:**
- **Monday-Saturday:** 9:00 AM - 8:00 PM
- **Sunday:** 10:00 AM - 6:00 PM  
- **AI Chatbot:** 24/7 availability (that's me! 🤖)

**💬 Support Types Available:**

**1. Career Guidance Support:**
- Career path confusion and selection
- Stream and specialization advice
- Skill development recommendations
- Industry insights and trends

**2. Technical Support:**  
- Website navigation issues
- Account registration problems
- Service access difficulties
- Payment and subscription queries

**3. Admission Counselling:**
- Engineering entrance exam guidance
- MBBS admission strategy  
- MBA program selection
- Medical course counselling
- **Completely FREE** - No registration required!

**4. General Inquiries:**
- Service information and features
- Pricing and subscription details
- Partnership and collaboration queries

**⚡ Response Time:**
- **Phone Calls:** Immediate during working hours
- **WhatsApp Messages:** Within 2-4 hours
- **Email Queries:** Within 24 hours
- **AI Chatbot:** Instant responses 24/7

**🆓 FREE Admission Counselling Process:**
1. **No Registration Required!**
2. Visit: {BASE_URL} and click **'Book Now'**
3. Choose your preferred time slot
4. Get expert consultation at zero cost
5. Available for: Engineering, MBBS, MBA, Medical courses

**🔧 Common Issues We Help With:**
- "I can't register my account" - Visit: {BASE_URL}/register
- "Payment not processing" - Call: +91 8657869659
- "Can't access career assessment" - Login at: {BASE_URL}/login
- "Need help choosing engineering branch"
- "Confused about medical entrance exams"
- "Want to talk to a real counsellor"

**🔗 Quick Support Links:**
- Contact Form: {BASE_URL}/contact
- Register Account: {BASE_URL}/register
- Login Issues: {BASE_URL}/login
- Book Counselling: {BASE_URL}/consult
- Premium Resume Builder: {BASE_URL}/AllComponents

**💡 Pro Tip:** For fastest support, call during working hours or use our AI chatbot for instant help!

What specific help do you need today?"""
    }

# Initialize response templates (will be called dynamically)
def get_formatted_response(template_key):
    """Get a formatted response template with current BASE_URL"""
    templates = get_response_templates()
    return templates.get(template_key, "Template not found")

# Enhanced Academic Database - College recommendations by percentage
COLLEGE_DATABASE = {
    "engineering": {
        "95_plus": {
            "colleges": ["IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Kharagpur"],
            "cutoffs": "JEE Advanced Rank 1-1000",
            "message": "🎉 Excellent score! You're eligible for top IITs"
        },
        "90_95": {
            "colleges": ["IIT Roorkee", "IIT Guwahati", "NIT Trichy", "NIT Warangal", "BITS Pilani"],
            "cutoffs": "JEE Main 99+ percentile",
            "message": "🌟 Great score! Top NITs and private colleges await"
        },
        "85_90": {
            "colleges": ["NIT Surathkal", "NIT Calicut", "IIIT Hyderabad", "VIT Vellore", "Manipal"],
            "cutoffs": "JEE Main 95+ percentile",
            "message": "✅ Good score! Excellent engineering colleges available"
        },
        "80_85": {
            "colleges": ["NIT Jaipur", "NIT Bhopal", "IIIT Bangalore", "SRM Chennai", "Amity"],
            "cutoffs": "JEE Main 90+ percentile",
            "message": "👍 Solid score! Many good options available"
        },
        "75_80": {
            "colleges": ["State Engineering Colleges", "Private Universities", "Regional Colleges"],
            "cutoffs": "State CET, Private Entrance",
            "message": "💪 Don't worry! Many excellent colleges still available"
        }
    },
    "medical": {
        "95_plus": {
            "colleges": ["AIIMS Delhi", "AIIMS Bombay", "JIPMER", "CMC Vellore", "KGMU"],
            "cutoffs": "NEET Rank 1-500",
            "message": "🏥 Outstanding! Top medical colleges within reach"
        },
        "90_95": {
            "colleges": ["AIIMS Jodhpur", "AIIMS Bhubaneswar", "Government Medical Colleges"],
            "cutoffs": "NEET Rank 500-5000",
            "message": "🩺 Excellent score! Government medical colleges possible"
        },
        "85_90": {
            "colleges": ["State Medical Colleges", "Deemed Universities", "Private Medical"],
            "cutoffs": "NEET State Quota",
            "message": "⚕️ Good score! Medical career definitely possible"
        },
        "80_85": {
            "colleges": ["Private Medical Colleges", "Management Quota", "Abroad Options"],
            "cutoffs": "NEET Qualifying",
            "message": "🌍 Consider private colleges and international options"
        }
    },
    "commerce": {
        "95_plus": {
            "colleges": ["SRCC Delhi", "LSR Delhi", "St. Xavier's Mumbai", "Christ Bangalore"],
            "cutoffs": "99+ percentile",
            "message": "📊 Excellent! Top commerce colleges await you"
        },
        "90_95": {
            "colleges": ["Hindu College", "Hansraj College", "Loyola Chennai", "NMIMS Mumbai"],
            "cutoffs": "95+ percentile", 
            "message": "💼 Great score! Premier commerce institutions possible"
        },
        "85_90": {
            "colleges": ["Delhi University Colleges", "Mumbai University", "Pune Colleges"],
            "cutoffs": "90+ percentile",
            "message": "📈 Good score! Many excellent options available"
        }
    }
}

# Emotional Intelligence Patterns
EMOTIONAL_RESPONSES = {
    "anxiety": {
        "keywords": ["worried", "anxious", "scared", "nervous", "stressed", "tension"],
        "response": "🤗 I understand you're feeling anxious about your future. This is completely normal - most students feel this way. Take a deep breath. Let's work through this together step by step."
    },
    "confusion": {
        "keywords": ["confused", "don't know", "lost", "unclear", "mixed up"],
        "response": "💭 Feeling confused about your career path is very common. You're not alone in this. Let's break down your options and find clarity together."
    },
    "disappointment": {
        "keywords": ["disappointed", "sad", "upset", "failed", "didn't get"],
        "response": "💙 I can sense you're disappointed. Remember, one setback doesn't define your entire future. There are always multiple paths to success."
    },
    "pressure": {
        "keywords": ["pressure", "parents", "family", "expectations", "forced"],
        "response": "🫂 Family pressure can be overwhelming. Remember, this is YOUR life and career. Let's find a path that balances your interests with practical considerations."
    },
    "excitement": {
        "keywords": ["excited", "happy", "thrilled", "amazing", "awesome"],
        "response": "🎉 I love your enthusiasm! This positive energy will take you far. Let's channel this excitement into making the best decisions for your future."
    }
}

# --- Comprehensive Knowledge & Service Data (Preserved from Original) ---

# This data is now used for both cognitive retrieval and formatted static responses.
CAREER_KNOWLEDGE = {
    "engineering": {
        "summary": "Engineering is a broad field that applies scientific and mathematical principles to design, build, and maintain structures, machines, and systems. It's ideal for problem-solvers who enjoy technical challenges.",
        "skills": ["problem-solving", "mathematics", "programming", "analytical thinking", "project management", "technical communication"],
        "paths": ["software engineer", "mechanical engineer", "civil engineer", "electrical engineer", "aerospace engineer", "biomedical engineer"],
        "education": ["B.Tech", "B.E", "M.Tech", "PhD", "Diploma in Engineering"],
        "salary_range": "₹3-25 LPA (Freshers: ₹3-8 LPA, Experienced: ₹8-25+ LPA)",
        "growth_prospects": "High demand, excellent growth opportunities, especially in software and emerging technologies.",
    },
    "medical": {
        "summary": "The medical field focuses on diagnosing, treating, and preventing illness and injury. It requires dedication, empathy, and a strong foundation in biological sciences.",
        "skills": ["empathy", "attention to detail", "communication", "scientific knowledge", "critical thinking", "stress management"],
        "paths": ["doctor", "surgeon", "researcher", "healthcare administrator", "medical consultant", "public health specialist"],
        "education": ["MBBS", "MD", "MS", "PhD", "BDS", "BAMS", "BHMS"],
        "salary_range": "₹5-50 LPA (Freshers: ₹5-12 LPA, Specialists: ₹15-50+ LPA)",
        "growth_prospects": "Stable demand, respected profession, growing healthcare sector.",
    },
    "business": {
        "summary": "Business involves managing organizations to achieve specific goals. It covers areas like finance, marketing, human resources, and strategy, requiring strong leadership and communication skills.",
        "skills": ["leadership", "communication", "strategic thinking", "negotiation", "financial analysis", "market research"],
        "paths": ["manager", "consultant", "entrepreneur", "analyst", "marketing executive", "finance professional"],
        "education": ["MBA", "BBA", "CA", "CFA", "CS", "B.Com"],
        "salary_range": "₹4-30 LPA (Freshers: ₹4-10 LPA, Senior roles: ₹12-30+ LPA)",
        "growth_prospects": "High growth potential, diverse opportunities across industries.",
    },
    "technology": {
        "summary": "The technology sector is a fast-paced field focused on creating and applying digital tools, software, and systems. It's driven by innovation, continuous learning, and logical problem-solving.",
        "skills": ["programming", "innovation", "logical thinking", "continuous learning", "system design", "data analysis"],
        "paths": ["software developer", "data scientist", "AI engineer", "cybersecurity expert", "cloud architect", "DevOps engineer"],
        "education": ["B.Tech CS", "MCA", "MS CS", "Bootcamps", "Online Certifications"],
        "salary_range": "₹4-40 LPA (Freshers: ₹4-12 LPA, Senior: ₹15-40+ LPA)",
        "growth_prospects": "Explosive growth, future-oriented.",
    }
}

# This SERVICE_MAPPINGS is a duplicate - using the one defined at the top with BASE_URL

# --- Core AI and Logic Functions ---

async def detect_emotion(message: str) -> Dict:
    """Detect emotional state of the user for empathetic responses."""
    message_lower = message.lower()
    
    # Rule-based emotion detection (fast and reliable)
    detected_emotions = []
    
    for emotion, data in EMOTIONAL_RESPONSES.items():
        for keyword in data["keywords"]:
            if keyword in message_lower:
                detected_emotions.append({
                    "emotion": emotion,
                    "confidence": 0.8,
                    "response": data["response"]
                })
                break
    
    # AI-based emotion detection if available
    if AI_AVAILABLE and "emotion_classifier" in ai_models:
        try:
            ai_emotion = ai_models["emotion_classifier"](message)
            if ai_emotion and ai_emotion[0]["score"] > AI_CONFIG["emotion_threshold"]:
                detected_emotions.append({
                    "emotion": ai_emotion[0]["label"].lower(),
                    "confidence": ai_emotion[0]["score"],
                    "ai_detected": True
                })
        except Exception as e:
            logger.error(f"AI emotion detection failed: {e}")
    
    return {
        "emotions": detected_emotions,
        "primary_emotion": detected_emotions[0] if detected_emotions else None,
        "needs_empathy": len(detected_emotions) > 0
    }

def classify_question_category(message: str) -> Dict:
    """Classify user question into one of the 5 main categories."""
    message_lower = message.lower()
    
    # Check each category pattern
    for category, data in QUESTION_PATTERNS.items():
        for pattern in data["patterns"]:
            if re.search(pattern, message_lower):
                return {
                    "category": category,
                    "response_type": data["response_type"],
                    "confidence": 0.9,
                    "matched_pattern": pattern
                }
    
    # Fallback classification based on keywords
    keyword_mapping = {
        "services_features": ["services", "features", "tools", "assessments", "website", "platform", "offer", "do"],
        "cost_pricing": ["free", "cost", "price", "money", "pay", "subscription", "plan", "charges"],
        "how_to_process": ["how", "process", "steps", "guide", "start", "register", "book", "use"],
        "about_platform": ["about", "company", "who", "what is", "careergenai", "platform"],
        "support_contact": ["contact", "support", "help", "phone", "number", "hours", "issue"]
    }
    
    for category, keywords in keyword_mapping.items():
        if any(keyword in message_lower for keyword in keywords):
            response_type = QUESTION_PATTERNS[category]["response_type"]
            return {
                "category": category,
                "response_type": response_type,
                "confidence": 0.7,
                "matched_pattern": "keyword_fallback"
            }
    
    return {
        "category": "general",
        "response_type": "general_help",
        "confidence": 0.5,
        "matched_pattern": None
    }

def generate_comprehensive_response(message: str, category_info: Dict) -> str:
    """Generate comprehensive responses based on question category."""
    
    response_type = category_info.get("response_type", "general_help")
    
    # Use predefined comprehensive templates
    templates = get_response_templates()
    if response_type in templates:
        return templates[response_type]
    
    # Fallback responses for edge cases
    fallback_responses = {
        "general_help": """🤖 **I'm here to help with CareerGenAI!**

I can assist you with:
🎯 **Services & Features** - What we offer and how our tools work
💰 **Pricing & Plans** - Free services and premium options  
🚀 **Getting Started** - Registration and using our platform
🏢 **About Us** - Company info and our mission
📞 **Support & Contact** - Getting help and reaching our team

What specific information would you like to know?""",
        
        "services_overview": get_formatted_response("services_overview"),
        "pricing_details": get_formatted_response("pricing_details"), 
        "process_guide": get_formatted_response("process_guide"),
        "about_us": get_formatted_response("about_us"),
        "contact_support": get_formatted_response("contact_support")
    }
    
    return fallback_responses.get(response_type, fallback_responses["general_help"])

def extract_academic_info(message: str) -> Dict:
    """Extract academic information like percentage, stream, etc."""
    message_lower = message.lower()
    
    # Extract percentage/marks
    percentage_patterns = [
        r'(\d+(?:\.\d+)?)\s*(?:percent|percentage|%)',
        r'(\d+(?:\.\d+)?)\s*(?:marks?|score)',
        r'got\s+(\d+(?:\.\d+)?)',
        r'scored\s+(\d+(?:\.\d+)?)'
    ]
    
    percentage = None
    for pattern in percentage_patterns:
        match = re.search(pattern, message_lower)
        if match:
            percentage = float(match.group(1))
            break
    
    # Extract stream/field
    stream = None
    stream_keywords = {
        "engineering": ["engineering", "engineer", "tech", "computer", "mechanical", "civil", "electrical"],
        "medical": ["medical", "doctor", "mbbs", "medicine", "health", "neet"],
        "commerce": ["commerce", "business", "management", "bcom", "bba", "economics"],
        "science": ["science", "physics", "chemistry", "biology", "bsc"],
        "arts": ["arts", "humanities", "literature", "history", "psychology"]
    }
    
    for field, keywords in stream_keywords.items():
        if any(keyword in message_lower for keyword in keywords):
            stream = field
            break
    
    # Enhanced location extraction
    location = None
    location_keywords = {
        "delhi": ["delhi", "new delhi", "ncr", "gurgaon", "noida", "faridabad", "ghaziabad"],
        "mumbai": ["mumbai", "bombay", "navi mumbai", "thane"],
        "bangalore": ["bangalore", "bengaluru", "karnataka"],
        "chennai": ["chennai", "madras", "tamil nadu"],
        "hyderabad": ["hyderabad", "telangana", "andhra pradesh"],
        "kolkata": ["kolkata", "calcutta", "west bengal"],
        "pune": ["pune", "maharashtra"],
        "ahmedabad": ["ahmedabad", "gujarat"],
        "jaipur": ["jaipur", "rajasthan"],
        "lucknow": ["lucknow", "uttar pradesh", "up"],
        "bhopal": ["bhopal", "madhya pradesh", "mp"],
        "kochi": ["kochi", "cochin", "kerala"],
        "bhubaneswar": ["bhubaneswar", "odisha"],
        "chandigarh": ["chandigarh", "punjab", "haryana"],
        "indore": ["indore", "madhya pradesh"],
        "nagpur": ["nagpur", "maharashtra"],
        "coimbatore": ["coimbatore", "tamil nadu"],
        "vadodara": ["vadodara", "baroda", "gujarat"],
        "visakhapatnam": ["visakhapatnam", "vizag", "andhra pradesh"],
        "thiruvananthapuram": ["thiruvananthapuram", "trivandrum", "kerala"]
    }
    
    # Check for location-specific queries like "best colleges in mumbai"
    location_query_patterns = [
        r'(?:best|top|good)\s+(?:medical|engineering|commerce|arts|management)?\s*colleges?\s+in\s+(\w+)',
        r'(?:medical|engineering|commerce|arts|management)\s+colleges?\s+in\s+(\w+)',
        r'colleges?\s+in\s+(\w+)',
        r'study\s+in\s+(\w+)'
    ]
    
    for pattern in location_query_patterns:
        match = re.search(pattern, message_lower)
        if match:
            city_mentioned = match.group(1)
            # Direct city name match first (most specific)
            if city_mentioned in location_keywords:
                location = city_mentioned
                break
            # Then check variants
            for city, variants in location_keywords.items():
                if city_mentioned in variants:
                    location = city
                    break
            if location:
                break
    
    # Fallback: check for any city mention (but prioritize exact matches)
    if not location:
        # First check for exact city names
        for city in location_keywords.keys():
            if city in message_lower:
                location = city
                break
        
        # Then check variants if no exact match
        if not location:
            for city, variants in location_keywords.items():
                if any(variant in message_lower for variant in variants):
                    location = city
                    break
    
    # Enhanced academic query detection
    college_keywords = ["college", "colleges", "university", "universities", "institution", "admission", "cutoff", "top colleges", "best colleges"]
    has_college_query = any(keyword in message_lower for keyword in college_keywords)
    
    return {
        "percentage": percentage,
        "stream": stream,
        "location": location,
        "has_academic_query": percentage is not None or stream is not None or has_college_query
    }

def get_location_specific_colleges(location: str, stream: str = None, query_type: str = "general") -> Dict:
    """Get colleges specific to a location."""
    
    if location not in LOCATION_COLLEGE_DATABASE:
        return None
    
    location_data = LOCATION_COLLEGE_DATABASE[location]
    
    # If specific stream requested
    if stream and stream in location_data:
        colleges = location_data[stream]
        return {
            "location": location.title(),
            "stream": stream.title(),
            "colleges": colleges,
            "query_type": query_type
        }
    
    # If no specific stream, return all streams
    return {
        "location": location.title(),
        "all_streams": location_data,
        "query_type": query_type
    }

def get_college_recommendations(percentage: float, stream: str = "engineering", location: str = None) -> Dict:
    """Get personalized college recommendations based on percentage, stream, and location."""
    
    # If location is specified, prioritize location-specific colleges
    if location and location in LOCATION_COLLEGE_DATABASE:
        location_colleges = LOCATION_COLLEGE_DATABASE[location]
        
        # Get location-specific colleges for the stream
        if stream in location_colleges:
            location_specific = location_colleges[stream]
            
            # Determine category based on percentage for messaging
            if percentage >= 95:
                category = "95_plus"
                message = f"🎉 Excellent score! You're eligible for top colleges in {location.title()}"
            elif percentage >= 90:
                category = "90_95"
                message = f"🌟 Great score! Top colleges in {location.title()} await you"
            elif percentage >= 85:
                category = "85_90"
                message = f"✅ Good score! Excellent colleges available in {location.title()}"
            elif percentage >= 80:
                category = "80_85"
                message = f"👍 Solid score! Many good options in {location.title()}"
            else:
                category = "75_80"
                message = f"💪 Don't worry! Many excellent colleges in {location.title()} are still available"
            
            return {
                "category": category,
                "colleges": location_specific,
                "cutoffs": f"Location-specific entrance exams and cutoffs for {location.title()}",
                "message": message,
                "stream": stream.title(),
                "percentage": percentage,
                "location": location.title(),
                "location_specific": True
            }
    
    # Fallback to general recommendations if no location or location not found
    if stream not in COLLEGE_DATABASE:
        stream = "engineering"  # Default fallback
    
    stream_data = COLLEGE_DATABASE[stream]
    
    # Determine category based on percentage
    if percentage >= 95:
        category = "95_plus"
    elif percentage >= 90:
        category = "90_95"
    elif percentage >= 85:
        category = "85_90"
    elif percentage >= 80:
        category = "80_85"
    else:
        category = "75_80"
    
    # Get recommendations
    if category in stream_data:
        recommendation = stream_data[category]
    else:
        # Fallback to closest category
        recommendation = stream_data["75_80"]
    
    return {
        "category": category,
        "colleges": recommendation["colleges"],
        "cutoffs": recommendation["cutoffs"],
        "message": recommendation["message"],
        "stream": stream.title(),
        "percentage": percentage,
        "location_specific": False
    }

def generate_academic_guidance_response(academic_info: Dict, emotion_info: Dict) -> str:
    """Generate comprehensive academic guidance with emotional support."""
    
    percentage = academic_info.get("percentage")
    stream = academic_info.get("stream")  # Don't set default here
    location = academic_info.get("location")
    
    if not percentage:
        # Handle location-specific college queries without percentage
        if location:
            location_data = get_location_specific_colleges(location, stream)
            if location_data:
                if stream and "colleges" in location_data:
                    # Specific stream in specific location
                    return f"""🏛️ **Top {location_data['stream']} Colleges in {location_data['location']}**

**🎓 Premier Institutions:**
{chr(10).join([f"• **{college}**" for college in location_data["colleges"]])}

**📍 Location:** {location_data['location']}
**🎯 Field:** {location_data['stream']}

**💡 For Personalized Recommendations:**
Share your percentage/marks for specific college suggestions!
Example: "I got 85% and want to study {stream} in {location}"

**🆓 FREE Services:**
• **College Search Tool** - Explore 10,000+ colleges: /colleges
• **Career Assessment** - Find your perfect match: /interest-form
• **Expert Counselling** - Get professional guidance: /consult

**📞 Need immediate help?** Call +91 8657869659 | +91 9619901999"""
                
                elif "all_streams" in location_data:
                    # All streams in specific location
                    streams_text = ""
                    for stream_name, colleges in location_data["all_streams"].items():
                        streams_text += f"\n**🎓 {stream_name.title()}:**\n"
                        streams_text += "\n".join([f"• {college}" for college in colleges[:4]])  # Show top 4
                        streams_text += "\n"
                    
                    return f"""🏛️ **Best Colleges in {location_data['location']}**

{streams_text}

**📍 Location:** {location_data['location']}
**🎯 Coverage:** All major streams

**💡 For Specific Recommendations:**
• Share your stream: "Engineering colleges in {location}"
• Share your percentage: "I got 85% in {location}"

**🆓 FREE Services:**
• **College Search Tool** - Explore 10,000+ colleges: /colleges
• **Career Assessment** - Find your perfect match: /interest-form
• **Expert Counselling** - Get professional guidance: /consult

**📞 Need immediate help?** Call +91 8657869659 | +91 9619901999"""
        
        # Handle general college queries without percentage or location
        if stream:
            # Provide general information about the stream
            stream_info = {
                "engineering": {
                    "top_colleges": ["IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "NIT Trichy", "BITS Pilani"],
                    "entrance": "JEE Main & Advanced",
                    "description": "Engineering offers diverse specializations in technology and innovation"
                },
                "medical": {
                    "top_colleges": ["AIIMS Delhi", "AIIMS Jodhpur", "JIPMER", "CMC Vellore", "KGMU", "MAMC Delhi"],
                    "entrance": "NEET",
                    "description": "Medical field focuses on healthcare and saving lives"
                },
                "commerce": {
                    "top_colleges": ["SRCC Delhi", "LSR Delhi", "St. Xavier's Mumbai", "Christ University", "Loyola Chennai"],
                    "entrance": "Various university entrance exams",
                    "description": "Commerce opens doors to business, finance, and management careers"
                }
            }
            
            if stream in stream_info:
                info = stream_info[stream]
                return f"""🎓 **Top Colleges for {stream.title()}**

**🏛️ Premier Institutions:**
{chr(10).join([f"• **{college}**" for college in info["top_colleges"]])}

**📝 Entrance Exam:** {info["entrance"]}
**💡 About {stream.title()}:** {info["description"]}

**🎯 For Personalized Recommendations:**
Share your percentage/marks for specific college suggestions!
Example: "I got 85% in {stream}"

**🆓 FREE Services:**
• **College Search Tool** - Explore 10,000+ colleges: /colleges
• **Career Assessment** - Find your perfect match: /interest-form
• **Expert Counselling** - Get professional guidance: /consult

**📞 Need immediate help?** Call +91 8657869659 | +91 9619901999"""
        
        return """🎓 **I'd love to help you with college recommendations!**

To give you the best guidance, could you please share:
• Your percentage/marks (e.g., "I got 92%")
• Your preferred stream (Engineering, Medical, Commerce, etc.)
• Any location preferences (e.g., "colleges in Mumbai")

**Examples:** 
• "I got 85% and want to study engineering in Delhi"
• "Best medical colleges in Mumbai"
• "Commerce colleges in Bangalore"

📞 **Need immediate guidance?** Call our FREE counselling: +91 8657869659"""
    
    # UNIVERSAL COLLEGE GUIDANCE - Not Engineering-Biased
    if not stream:
        # When no stream is specified, provide universal guidance
        return f"""🎓 **Personalized College Guidance for {percentage}%**

🌟 Excellent score! Multiple career paths are open to you.

**🎯 Choose Your Path:**

**🔧 ENGINEERING Path:**
• **Top Options:** IIT Roorkee, IIT Guwahati, NIT Trichy, NIT Warangal, BITS Pilani
• **Entrance:** JEE Main (99+ percentile expected)
• **Careers:** Software Engineer, Data Scientist, AI Engineer

**🩺 MEDICAL Path:**
• **Top Options:** AIIMS Jodhpur, AIIMS Bhubaneswar, Government Medical Colleges
• **Entrance:** NEET (Rank 500-5000 expected)
• **Careers:** Doctor, Surgeon, Medical Researcher

**📊 COMMERCE/BUSINESS Path:**
• **Top Options:** SRCC Delhi, LSR Delhi, St. Xavier's Mumbai, Christ Bangalore
• **Entrance:** University entrance exams (95+ percentile)
• **Careers:** CA, MBA, Business Manager, Financial Analyst

**🎨 OTHER PATHS:**
• **Law:** CLAT for top NLUs
• **Design:** NIFT, NID entrance
• **Science:** BSc from top universities

**💡 Next Steps:**
1. **Identify Your Interest** - Take our FREE Career Assessment: /interest-form
2. **Apply Strategically** - Don't wait for results, apply early
3. **Backup Options** - Apply to multiple streams/colleges
4. **Expert Guidance** - Book FREE counselling: /consult

**📞 Need personalized guidance?** Call +91 8657869659 | +91 9619901999

Which field interests you most? I can provide specific guidance! 🌟"""
    
    # Get college recommendations for specific stream (with location if provided)
    recommendations = get_college_recommendations(percentage, stream, location)
    
    location_text = f" in {recommendations['location']}" if recommendations.get('location_specific') else ""
    
    return f"""🎓 **{recommendations['message']}**

**🏛️ Top Recommended Colleges for {recommendations['stream']}{location_text}:**
{chr(10).join([f"{i+1}. **{college}**" for i, college in enumerate(recommendations['colleges'])])}

**📊 Expected Cutoffs:** {recommendations['cutoffs']}
**🎯 Your Category:** {recommendations['category'].replace('_', '-')}% range
{f"**📍 Location Focus:** {recommendations['location']}" if recommendations.get('location_specific') else ""}

**💡 Next Steps:**
1. **Apply Early** - Don't wait for results
2. **Backup Options** - Apply to multiple colleges
3. **Entrance Exams** - Prepare for relevant tests
4. **Documentation** - Keep all certificates ready

**🆓 FREE Services to Help You:**
• **College Search Tool** - Find more options: /colleges
• **Career Assessment** - Confirm your interests: /interest-form
• **Expert Counselling** - Book session: /consult

**📞 Need personalized guidance?** Call +91 8657869659 | +91 9619901999

Remember: Your percentage is just one factor. With the right strategy, you can get into an excellent college! 🌟"""
    
    # Start with emotional support if needed
    response = ""
    if emotion_info.get("needs_empathy") and emotion_info.get("primary_emotion"):
        response += emotion_info["primary_emotion"]["response"] + "\n\n"
    
    # Add personalized academic guidance
    response += f"""🎓 **Personalized College Guidance for {percentage}%**

{recommendations['message']}

**🏛️ Top Recommended Colleges for {recommendations['stream']}:**"""
    
    for i, college in enumerate(recommendations['colleges'][:5], 1):
        response += f"\n{i}. **{college}**"
    
    response += f"""

**📊 Expected Cutoffs:** {recommendations['cutoffs']}
**🎯 Your Category:** {recommendations['category'].replace('_', '-')}% range

**💡 Next Steps:**
1. **Apply Early** - Don't wait for results
2. **Backup Options** - Apply to multiple colleges
3. **Entrance Exams** - Prepare for relevant tests
4. **Documentation** - Keep all certificates ready

**🆓 FREE Services to Help You:**
• **College Search Tool** - Find more options: /colleges
• **Career Assessment** - Confirm your interests: /interest-form
• **Expert Counselling** - Book session: /consult

**📞 Need personalized guidance?** Call +91 8657869659 | +91 9619901999

Remember: Your percentage is just one factor. With the right strategy, you can get into an excellent college! 🌟"""
    
    if location:
        response += f"\n\n📍 **Location Preference:** {location.title()} - I can help you find specific colleges in this area!"
    
    return response

async def initialize_ai_models():
    """Initialize enhanced AI models for emotional intelligence and academic guidance."""
    logger.info("🚀 Initializing Enhanced AI Chatbot with Emotional Intelligence...")
    
    if not AI_AVAILABLE:
        logger.info("⚠️ AI libraries not available - using enhanced rule-based intelligence")
        logger.info("✅ Enhanced chatbot initialized with academic database")
        return
    
    try:
        logger.info("🧠 Loading emotional intelligence models...")
        
        # Load emotion detection model
        ai_models["emotion_classifier"] = pipeline(
            "text-classification",
            model=AI_CONFIG["emotion_model"],
            device=-1  # CPU for stability
        )
        
        # Load sentence similarity model for academic matching
        ai_models["similarity_model"] = SentenceTransformer(AI_CONFIG["similarity_model"])
        
        logger.info("✅ Emotional intelligence models loaded successfully")
        logger.info("🎓 Academic guidance system ready")
        logger.info("💙 Enhanced empathy and support capabilities active")
        
    except Exception as e:
        logger.error(f"❌ Error loading AI models: {e}")
        logger.info("🔄 Falling back to enhanced rule-based intelligence")
        ai_models.clear()

def extract_query_context(message: str) -> Dict:
    """Extract comprehensive context from any user query"""
    message_lower = message.lower().strip()
    
    context = {
        "query_type": None,
        "service_mentioned": None,
        "information_needed": [],
        "emotional_state": None,
        "academic_info": None,
        "specific_requests": []
    }
    
    # Service detection with comprehensive keyword matching - PRIORITIZE LONGER/MORE SPECIFIC MATCHES
    best_match = None
    best_match_length = 0
    best_match_specificity = 0
    
    # Define service specificity (higher = more specific)
    service_specificity = {
        "premium_resume": 10,
        "career_roadmaps": 9,
        "career_counselling": 8,
        "career_assessment": 7,
        "personality_quiz": 6,
        "career_comparison": 5,
        "profile_builder": 4,
        "top_colleges": 3,
        "ai_chatbot": 2,
        "resume_builder": 1
    }
    
    for service_name, service_data in UNIVERSAL_KNOWLEDGE_BASE["services"].items():
        for keyword in service_data["keywords"]:
            if keyword in message_lower:
                keyword_len = len(keyword)
                service_spec = service_specificity.get(service_name, 0)
                
                # Prioritize by keyword length first, then by service specificity
                if (keyword_len > best_match_length or 
                    (keyword_len == best_match_length and service_spec > best_match_specificity)):
                    best_match = service_name
                    best_match_length = keyword_len
                    best_match_specificity = service_spec
    
    if best_match:
        context["service_mentioned"] = best_match
        context["query_type"] = "service_inquiry"
    
    # Information type detection
    info_patterns = {
        "pricing": ["price", "cost", "fee", "charge", "plan", "subscription", "how much", "pricing"],
        "process": ["how to", "process", "steps", "procedure", "how does", "how can"],
        "features": ["features", "what does", "capabilities", "what can", "benefits"],
        "comparison": ["vs", "versus", "compare", "difference", "better", "which is"],
        "contact": ["contact", "phone", "call", "reach", "support", "help desk"],
        "about": ["about", "what is", "tell me about", "information about", "details"]
    }
    
    for info_type, keywords in info_patterns.items():
        if any(keyword in message_lower for keyword in keywords):
            context["information_needed"].append(info_type)
    
    # Specific request detection
    request_patterns = {
        "need_help": ["i need", "i want", "i require", "help me", "assist me"],
        "recommendation": ["recommend", "suggest", "advice", "guidance", "what should"],
        "explanation": ["explain", "how", "why", "what", "tell me"],
        "comparison": ["compare", "which is better", "difference between"]
    }
    
    for request_type, keywords in request_patterns.items():
        if any(keyword in message_lower for keyword in keywords):
            context["specific_requests"].append(request_type)
    
    return context

def find_relevant_knowledge(query_context: Dict, message: str) -> Dict:
    """Find relevant information from universal knowledge base"""
    relevant_info = {
        "primary_match": None,
        "secondary_matches": [],
        "confidence": 0.0,
        "knowledge_type": None
    }
    
    message_lower = message.lower()
    
    # Direct service match
    if query_context["service_mentioned"]:
        service_name = query_context["service_mentioned"]
        relevant_info["primary_match"] = UNIVERSAL_KNOWLEDGE_BASE["services"][service_name]
        relevant_info["knowledge_type"] = "service"
        relevant_info["confidence"] = 0.9
        return relevant_info
    
    # Keyword-based matching across all knowledge
    max_matches = 0
    best_match = None
    best_type = None
    
    # Search in services
    for service_name, service_data in UNIVERSAL_KNOWLEDGE_BASE["services"].items():
        matches = 0
        for keyword in service_data["keywords"]:
            if keyword in message_lower:
                matches += 1
        
        # Also check description and features
        if service_data["description"].lower() in message_lower or any(feature.lower() in message_lower for feature in service_data.get("features", [])):
            matches += 2
        
        if matches > max_matches:
            max_matches = matches
            best_match = service_data
            best_type = "service"
            relevant_info["primary_match"] = best_match
            relevant_info["knowledge_type"] = best_type
            relevant_info["confidence"] = min(0.9, matches * 0.2)
    
    # Search in website info
    for info_type, info_data in UNIVERSAL_KNOWLEDGE_BASE["website_info"].items():
        if info_type in message_lower or any(str(value).lower() in message_lower for value in str(info_data).lower().split()):
            relevant_info["secondary_matches"].append({
                "type": info_type,
                "data": info_data,
                "relevance": 0.7
            })
    
    return relevant_info

async def classify_intent_ai(message: str) -> Dict:
    """Universal intent classification for all website queries."""
    message_lower = message.lower().strip()
    
    # Extract comprehensive query context
    query_context = extract_query_context(message)
    relevant_knowledge = find_relevant_knowledge(query_context, message)
    
    # Academic query detection (highest priority for student questions)
    academic_info = extract_academic_info(message)
    academic_indicators = [
        "percentage", "marks", "score", "got", "scored", "which college", 
        "college recommendation", "admission", "cutoff", "eligibility"
    ]
    
    if (academic_info["has_academic_query"] or 
        any(indicator in message_lower for indicator in academic_indicators)):
        return {
            "intent": "academic_guidance", 
            "confidence": 0.95,
            "academic_info": academic_info,
            "query_context": query_context
        }
    
    # Universal service query detection (enhanced)
    if query_context["service_mentioned"]:
        return {
            "intent": "universal_service_query",
            "confidence": max(0.85, relevant_knowledge["confidence"]),
            "service": query_context["service_mentioned"],
            "query_context": query_context,
            "relevant_knowledge": relevant_knowledge,
            "information_needed": query_context["information_needed"]
        }
    
    # ENHANCED SERVICE DETECTION - Comprehensive phrase matching
    service_phrases = {
        # Resume Builder variations
        "resume building": "resume_builder", "build resume": "resume_builder", "create resume": "resume_builder",
        "resume maker": "resume_builder", "cv builder": "resume_builder", "cv maker": "resume_builder",
        "resume template": "resume_builder", "professional resume": "resume_builder",
        
        # Premium Resume variations  
        "premium resume": "premium_resume", "premium resume builder": "premium_resume", 
        "advanced resume": "premium_resume", "ai resume": "premium_resume", "ai-powered resume": "premium_resume",
        
        # Career Assessment variations
        "career test": "career_assessment", "career quiz": "career_assessment", "career match": "career_assessment",
        "find career": "career_assessment", "career suggestions": "career_assessment", "interest test": "career_assessment",
        
        # Personality Quiz variations
        "personality test": "personality_quiz", "personality type": "personality_quiz", "work style": "personality_quiz",
        
        # Profile Builder variations
        "profile building": "profile_builder", "profile building help": "profile_builder", 
        "build profile": "profile_builder", "student profile": "profile_builder",
        "career profile": "profile_builder", "create profile": "profile_builder", "need profile": "profile_builder",
        
        # College Search variations
        "college search": "top_colleges", "find colleges": "top_colleges", "college finder": "top_colleges",
        "university search": "top_colleges", "college database": "top_colleges", "top colleges": "top_colleges",
        
        # Career Counselling variations
        "career counseling": "career_counselling", "career guidance": "career_counselling", "expert advice": "career_counselling",
        "counselor": "career_counselling", "career advisor": "career_counselling",
        
        # Career Comparison variations
        "compare careers": "career_comparison", "career comparison": "career_comparison", "career vs": "career_comparison",
        
        # Career Roadmaps variations
        "career roadmap": "career_roadmaps", "career path": "career_roadmaps", "career guide": "career_roadmaps",
        "roadmap": "career_roadmaps", "career plan": "career_roadmaps",
        
        # AI Chatbot variations
        "chatbot": "ai_chatbot", "ai assistant": "ai_chatbot", "chat support": "ai_chatbot"
    }
    
    for phrase, service in service_phrases.items():
        if phrase in message_lower:
            return {
                "intent": "universal_service_query",
                "confidence": 0.95,
                "service": service,
                "query_context": query_context,
                "relevant_knowledge": {"primary_match": UNIVERSAL_KNOWLEDGE_BASE["services"][service]},
                "information_needed": query_context["information_needed"]
            }
    
    # Greeting detection
    greeting_words = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste"]
    if any(word in message_lower for word in greeting_words):
        return {"intent": "greeting", "confidence": 0.95}
    
    # Website information queries
    website_info_indicators = ["about", "company", "team", "mission", "vision", "founded"]
    if any(indicator in message_lower for indicator in website_info_indicators):
        return {
            "intent": "website_info_query",
            "confidence": 0.85,
            "query_context": query_context,
            "relevant_knowledge": relevant_knowledge
        }
    
    # Pricing and plans
    pricing_indicators = ["price", "cost", "pricing", "plan", "plans", "subscription", "premium", 
                         "how much", "fees", "charges", "payment", "free", "paid"]
    if any(indicator in message_lower for indicator in pricing_indicators):
        return {
            "intent": "pricing_inquiry",
            "confidence": 0.9,
            "query_context": query_context
        }
    
    # Contact and support
    contact_indicators = ["contact", "phone", "call", "support", "number", "reach", "talk", "help desk"]
    if any(indicator in message_lower for indicator in contact_indicators):
        return {
            "intent": "contact_inquiry",
            "confidence": 0.9,
            "query_context": query_context
        }
    
    # Emotional support detection
    emotional_indicators = ["worried", "anxious", "scared", "confused", "lost", "disappointed", 
                           "pressure", "stressed", "don't know what to do", "help me", "frustrated"]
    if any(indicator in message_lower for indicator in emotional_indicators):
        return {
            "intent": "emotional_support",
            "confidence": 0.8,
            "query_context": query_context
        }
    
    # Process/How-to queries
    process_indicators = ["how to", "how can", "how do", "steps", "process", "procedure", "guide"]
    if any(indicator in message_lower for indicator in process_indicators):
        return {
            "intent": "process_inquiry",
            "confidence": 0.8,
            "query_context": query_context,
            "relevant_knowledge": relevant_knowledge
        }
    
    # Comparison queries
    comparison_indicators = ["vs", "versus", "compare", "difference", "better", "which is", "which should"]
    if any(indicator in message_lower for indicator in comparison_indicators):
        return {
            "intent": "comparison_query",
            "confidence": 0.8,
            "query_context": query_context
        }
    
    # Services inquiry (general)
    services_indicators = ["services", "what do you offer", "what can you do", "features", "tools", "help with"]
    if any(indicator in message_lower for indicator in services_indicators):
        return {
            "intent": "universal_service_query",
            "confidence": 0.85,
            "service": None,  # Will trigger general services overview
            "query_context": query_context,
            "relevant_knowledge": relevant_knowledge
        }
    
    # General information seeking
    info_indicators = ["what is", "tell me about", "information", "details", "explain", "describe"]
    if any(indicator in message_lower for indicator in info_indicators):
        return {
            "intent": "information_query",
            "confidence": 0.7,
            "query_context": query_context,
            "relevant_knowledge": relevant_knowledge
        }
    
    # Default universal fallback
    return {
        "intent": "universal_query",
        "confidence": 0.6,
        "query_context": query_context,
        "relevant_knowledge": relevant_knowledge
    }

# Removed - using optimized production responses

def generate_enhanced_static_response(message: str, intent: str, query_context: Dict) -> str:
    """Enhanced static responses with universal context awareness"""
    
    if intent == "greeting":
        return """👋 **Welcome to CareerGenAI - Your Intelligent Career Partner!**

I'm your AI assistant, ready to help with:
🎓 **Academic Guidance** - College recommendations based on your marks
🛠️ **All Services** - Resume building, career assessment, counselling
💙 **Emotional Support** - When you're confused or stressed about your future
📞 **Expert Connect** - Direct access to human counselors

**💡 Try asking me:**
• "I got 85% which college should I go?"
• "I need help with resume building"
• "What services do you offer?"
• "I'm confused about my career"

How can I help you today?"""
    
    elif intent == "pricing_inquiry":
        return """💰 **CareerGenAI Pricing - Transparent & Student-Friendly**

**🆓 FREE Services (8 total) - No Hidden Charges:**
✅ Career Assessment - AI-powered career matching
✅ Personality Quiz - Work style analysis
✅ Resume Builder - Professional ATS templates
✅ Career Counselling - Expert guidance sessions
✅ Profile Builder - Complete career tracking
✅ College Search - 10,000+ colleges database
✅ Career Comparison - Side-by-side analysis
✅ AI Chatbot - 24/7 intelligent support (that's me!)

**💎 Premium Services (2 total):**
🥉 **1 Month Plan** - ₹1,999
• Career Roadmaps - Step-by-step career guides
• Premium Resume Builder - AI-powered features
• Priority support

🥈 **3 Months Plan** - ₹2,999 (Most Popular - Save ₹1,998!)
• All premium features
• Extended support period
• Multiple career roadmaps

🥇 **1 Year Plan** - ₹3,999 (Best Value - Save ₹3,997!)
• Unlimited access to all features
• Personal mentor support
• Continuous updates

**🎁 BONUS: FREE Admission Counselling**
• Engineering (JEE, BITSAT, State CETs)
• Medical (NEET, AIIMS, JIPMER)
• Management (CAT, XAT, GMAT)
• No registration required!

**📞 Questions?** Call +91 8657869659 | +91 9619901999

**💡 Recommendation:** Start with our 8 FREE services, upgrade only if you need advanced roadmaps!"""
    
    elif intent == "contact_inquiry":
        return """📞 **CareerGenAI Contact & Support Information**

**🔥 Immediate Support:**
• **Primary Phone:** +91 8657869659
• **Secondary Phone:** +91 9619901999
• **Response Time:** Within 2 hours during business hours

**🕐 Support Hours:**
• **Mon-Sat:** 9:00 AM - 8:00 PM
• **Sunday:** 10:00 AM - 6:00 PM
• **AI Chatbot:** 24/7 (that's me!)

**🎯 What Our Support Team Helps With:**
• **Academic Guidance** - College selection, entrance exam strategy
• **Career Counselling** - Personalized career planning sessions
• **Technical Support** - Platform usage, account issues
• **Admission Counselling** - FREE guidance for JEE, NEET, CAT
• **Emotional Support** - When you're confused or stressed

**💬 Multiple Ways to Reach Us:**
• **Phone Calls** - Direct conversation with experts
• **AI Chat** - Instant responses anytime (ask me anything!)
• **Service Platform** - Book counselling sessions online

**🆓 FREE Consultation Available:**
No registration required - just call and get immediate expert guidance!

**🎓 Specialized Support:**
• Engineering admissions and career planning
• Medical entrance strategy and college selection
• Business and management career guidance
• Emotional support for career confusion

**📱 Save Our Numbers:** +91 8657869659 | +91 9619901999

How can I connect you with the right support today?"""
    
    return None

def generate_formatted_static_response(message: str, intent: str, metadata: Optional[Dict] = None) -> Optional[str]:
    """
    (Preserved & Enhanced from Original) Provides high-quality, pre-written responses for specific, factual intents.
    This ensures accuracy for important information like pricing, services, and contact details.
    """
    if intent == "greeting":
        return "👋 **Welcome to CareerGenAI!** I'm your intelligent AI career assistant. How can I help you explore your career journey today?"

    if intent == "specific_service" and metadata and "service" in metadata:
        service_name = metadata["service"]
        service_responses = {
            "resume_builder": """📄 **Resume Builder - Create Professional Resumes**

🆓 **FREE Resume Builder Features:**
✅ **ATS-Friendly Templates** - Pass applicant tracking systems
✅ **Professional Layouts** - Clean, modern designs
✅ **Easy Customization** - Drag-and-drop interface
✅ **PDF Download** - High-quality output
✅ **Multiple Formats** - Choose from various styles

🎯 **Perfect For:**
• Fresh graduates seeking first jobs
• Students applying for internships
• Career changers updating their profiles
• Anyone needing a professional resume quickly

💡 **Pro Tips:**
• Use action verbs and quantify achievements
• Tailor your resume for each job application
• Keep it concise (1-2 pages maximum)
• Include relevant keywords from job descriptions

🔗 **Access FREE Resume Builder:** /resume-templates
📞 **Need Help?** Call +91 8657869659 | +91 9619901999

Want to upgrade to our Premium Resume Builder with AI-powered suggestions?""",

            "premium_resume": """💎 **Premium Resume Builder - AI-Powered Excellence**

🚀 **Premium Features:**
✅ **AI Content Suggestions** - Smart recommendations for your content
✅ **Advanced Templates** - Industry-specific professional designs
✅ **Keyword Optimization** - Automatically optimize for ATS systems
✅ **Real-time Feedback** - Get instant improvement suggestions
✅ **Multiple Versions** - Create different resumes for different roles
✅ **Cover Letter Builder** - Matching cover letter templates

💼 **Industry-Specific Templates:**
• Technology & Software
• Healthcare & Medical
• Finance & Banking
• Marketing & Sales
• Engineering & Manufacturing

💰 **Premium Plans:**
🥉 **1 Month** - ₹1,999
🥈 **3 Months** - ₹2,999 (Most Popular)
🥇 **1 Year** - ₹3,999 (Best Value)

🔗 **Access Premium Builder:** /AllComponents
📞 **Questions?** Call +91 8657869659 | +91 9619901999""",

            "career_assessment": """🎯 **Career Assessment - Discover Your Perfect Career Match**

🧠 **AI-Powered Career Discovery:**
✅ **Interest Analysis** - Explore 18+ career interest areas
✅ **Personality Matching** - Find careers that fit your personality
✅ **Skills Assessment** - Identify your strengths and growth areas
✅ **AI Recommendations** - Get personalized career suggestions
✅ **Detailed Reports** - Comprehensive career insights

🎓 **Assessment Categories:**
• STEM Fields (Engineering, Medical, Science)
• Creative Fields (Design, Arts, Media)
• Business & Management
• Social Services & Education
• Technology & Innovation

📊 **What You'll Get:**
• Top 5 career matches with detailed descriptions
• Required education and skills for each career
• Salary expectations and growth prospects
• Recommended colleges and courses
• Next steps to pursue your chosen path

🆓 **Completely FREE** - No hidden charges!
🔗 **Take Assessment:** /interest-form
📞 **Support:** +91 8657869659 | +91 9619901999

Ready to discover your ideal career path?""",

            "personality_quiz": """🧠 **Personality Quiz - Know Yourself, Choose Better**

🎭 **Discover Your Work Personality:**
✅ **Comprehensive Analysis** - Based on proven personality frameworks
✅ **Career Matching** - Find careers that suit your personality type
✅ **Work Style Insights** - Understand how you work best
✅ **Team Dynamics** - Learn about your collaboration style
✅ **Growth Areas** - Identify skills to develop

🎯 **Personality Dimensions:**
• Introversion vs Extraversion
• Thinking vs Feeling
• Judging vs Perceiving
• Sensing vs Intuition

💼 **Career Alignment:**
• Leadership roles for natural leaders
• Creative positions for innovative minds
• Analytical roles for logical thinkers
• People-focused careers for empathetic personalities

📈 **Benefits:**
• Better career decision making
• Improved job satisfaction
• Enhanced self-awareness
• Stronger professional relationships

🆓 **FREE Personality Quiz**
🔗 **Take Quiz:** /career-quiz
📞 **Questions?** Call +91 8657869659 | +91 9619901999""",

            "career_counselling": """👨‍💼 **Career Counselling - Expert Guidance for Your Future**

🎓 **One-on-One Expert Sessions:**
✅ **Certified Career Counselors** - Industry experts with proven track records
✅ **Personalized Guidance** - Tailored advice for your unique situation
✅ **Career Planning** - Strategic roadmap for your professional journey
✅ **Decision Support** - Help with difficult career choices
✅ **Goal Setting** - Clear, achievable career objectives

🎯 **Counselling Areas:**
• Career exploration and selection
• College and course selection
• Entrance exam preparation strategy
• Career transition and change
• Skill development planning
• Interview and job search guidance

👥 **Our Expert Counselors:**
• 10+ years industry experience
• Specialized in various fields
• Updated with latest market trends
• Proven success track record

📅 **Session Options:**
• 30-minute consultation calls
• 60-minute detailed planning sessions
• Follow-up support included
• Flexible scheduling

🆓 **FREE Initial Consultation Available!**
🔗 **Book Session:** /consult
📞 **Direct Booking:** +91 8657869659 | +91 9619901999

Ready to get expert guidance for your career?""",

            "top_colleges": """🏛️ **Top Colleges - Find Your Perfect Institution**

🎓 **Comprehensive College Database:**
✅ **10,000+ Colleges** - Across India and abroad
✅ **Smart Filters** - Search by location, course, fees, ranking
✅ **Percentile Matching** - Find colleges based on your scores
✅ **Detailed Profiles** - Complete information about each college
✅ **Admission Process** - Step-by-step guidance

🔍 **Search Options:**
• **By Course:** Engineering, Medical, MBA, Arts, Science
• **By Location:** State-wise, city-wise search
• **By Ranking:** NIRF, private rankings
• **By Fees:** Budget-friendly options
• **By Percentile:** JEE, NEET, CAT score-based

📊 **College Information:**
• Admission requirements and cutoffs
• Fee structure and scholarships
• Placement records and average packages
• Faculty profiles and infrastructure
• Student reviews and ratings

🎯 **Popular Categories:**
• Top Engineering Colleges (IITs, NITs, Private)
• Medical Colleges (AIIMS, Government, Private)
• Management Schools (IIMs, Top B-Schools)
• Arts & Science Colleges

🆓 **FREE College Search**
🔗 **Explore Colleges:** /colleges
📞 **Admission Help:** +91 8657869659 | +91 9619901999""",

            "career_comparison": """⚖️ **Career Comparison Tool - Make Informed Decisions**

📊 **Compare Careers Side-by-Side:**
✅ **Salary Comparison** - Detailed salary ranges and growth
✅ **Skills Analysis** - Required skills and competencies
✅ **Education Requirements** - Degrees, certifications, courses
✅ **Growth Prospects** - Future demand and opportunities
✅ **Work-Life Balance** - Job stress and lifestyle factors

🎯 **Comparison Categories:**
• **Financial Aspects:** Starting salary, peak earnings, job security
• **Educational Path:** Duration, cost, difficulty level
• **Career Growth:** Promotion opportunities, leadership roles
• **Market Demand:** Job availability, industry growth
• **Personal Fit:** Work environment, required personality traits

💼 **Popular Comparisons:**
• Engineering vs Medical vs Business
• Software Engineer vs Data Scientist
• CA vs MBA vs CFA
• Government Jobs vs Private Sector
• Traditional vs Emerging Careers

📈 **Decision Factors:**
• Return on investment (ROI)
• Time to establish career
• Geographic opportunities
• Industry stability
• Personal interest alignment

🆓 **FREE Career Comparison**
🔗 **Compare Careers:** /career-compare
📞 **Expert Advice:** +91 8657869659 | +91 9619901999

Which careers would you like to compare?""",

            "profile_builder": """👤 **Profile Builder - Create Your Complete Career Profile**

🎯 **Build Your Professional Identity:**
✅ **Comprehensive Profile** - All your career information in one place
✅ **Skills Inventory** - Document your abilities and competencies
✅ **Achievement Tracker** - Record your accomplishments
✅ **Goal Setting** - Define and track career objectives
✅ **Progress Monitoring** - See your growth over time

📋 **Profile Sections:**
• **Personal Information** - Basic details and contact
• **Educational Background** - Degrees, certifications, courses
• **Skills & Competencies** - Technical and soft skills
• **Experience & Projects** - Internships, work, personal projects
• **Achievements & Awards** - Recognition and accomplishments
• **Career Goals** - Short-term and long-term objectives

🎓 **Student-Specific Features:**
• Academic performance tracking
• Extracurricular activities
• Volunteer work and social service
• Leadership experiences
• Career exploration history

💡 **Benefits:**
• Better self-awareness
• Improved career planning
• Enhanced job applications
• Scholarship and opportunity matching
• Progress tracking and motivation

🆓 **FREE Profile Builder**
🔗 **Create Profile:** /profile-builder
📞 **Support:** +91 8657869659 | +91 9619901999

Ready to build your professional profile?""",

            "career_roadmaps": """🗺️ **Career Roadmaps - Your Step-by-Step Success Guide**

📈 **Detailed Career Journey Maps:**
✅ **Step-by-Step Guides** - Clear path from student to professional
✅ **Timeline Planning** - Realistic milestones and deadlines
✅ **Skill Development** - What to learn and when
✅ **Experience Building** - Internships, projects, networking
✅ **Goal Achievement** - Measurable success metrics

🎯 **Available Roadmaps:**
• **Software Engineer** - From coding basics to senior roles
• **Data Scientist** - Statistics to machine learning mastery
• **Doctor** - NEET to specialization
• **Business Manager** - MBA to leadership positions
• **Digital Marketer** - Basics to growth hacking
• **Entrepreneur** - Idea to successful business

📊 **Roadmap Components:**
• **Phase-wise Planning** - Beginner to expert levels
• **Skill Checkpoints** - What to master at each stage
• **Resource Recommendations** - Books, courses, tools
• **Industry Insights** - Market trends and opportunities
• **Success Metrics** - How to measure progress

💎 **Premium Feature:**
🥉 **1 Month** - ₹1,999 (Access to 3 roadmaps)
🥈 **3 Months** - ₹2,999 (Access to 10 roadmaps)
🥇 **1 Year** - ₹3,999 (All roadmaps + updates)

🔗 **Explore Roadmaps:** /career-roadmap
📞 **Questions?** Call +91 8657869659 | +91 9619901999

Which career roadmap interests you most?"""
        }
        
        if service_name in service_responses:
            return service_responses[service_name]
        else:
            return f"I'd be happy to help you with {service_name.replace('_', ' ').title()}! Let me get you the specific information you need."

    if intent == "services_inquiry":
        return """🎯 **CareerGenAI's Complete Service Portfolio - 10 Services**

**🆓 FREE SERVICES (8 total):**
1️⃣ **Career Assessment** - AI-powered career suggestions based on interests
2️⃣ **Personality Quiz** - Discover your personality type & matching careers
3️⃣ **AI Chatbot** - 24/7 intelligent career guidance (that's me! 🤖)
4️⃣ **Career Counselling** - Book one-on-one sessions with certified experts
5️⃣ **Profile Builder** - Create your complete student career profile
6️⃣ **Top Colleges** - Search colleges by location, course & percentile
7️⃣ **Career Comparison Tool** - Compare salaries, skills & growth prospects
8️⃣ **Resume Builder** - Professional ATS-friendly templates

**💎 PREMIUM SERVICES (2 total):**
9️⃣ **Career Roadmaps** - Step-by-step career guides for your dream career
• Software Engineer roadmap
• Data Scientist roadmap  
• Doctor career path
• Business Manager guide
• Digital Marketing roadmap

🔟 **Premium Resume Builder** - AI-powered templates with smart suggestions
• Industry-specific templates
• AI content recommendations
• Keyword optimization
• Real-time feedback
• Cover letter builder

**🎁 BONUS: FREE Admission Counselling**
• Engineering (JEE, BITSAT, State CETs)
• Medical (NEET, AIIMS, JIPMER) 
• MBA (CAT, XAT, GMAT)
• No registration required!

**📞 Contact:** +91 8657869659 | +91 9619901999
**Getting Started:** Register free → Access all 8 FREE services immediately!

Which service interests you most?"""

    if intent == "pricing_inquiry":
        return """💰 **CareerGenAI Pricing - Transparent & Student-Friendly**

**🆓 FREE Services (8 total) - No Hidden Charges:**
✅ Career Assessment - AI-powered career matching
✅ Personality Quiz - Work style analysis  
✅ Resume Builder - Professional ATS templates
✅ Career Counselling - Expert guidance sessions
✅ Profile Builder - Complete career tracking
✅ College Search - 10,000+ colleges database
✅ Career Comparison - Side-by-side analysis
✅ AI Chatbot - 24/7 intelligent support (that's me!)

**💎 Premium Services (2 total):**
🥉 **1 Month Plan** - ₹1,999
• Career Roadmaps - Step-by-step career guides
• Premium Resume Builder - AI-powered features  
• Priority support

🥈 **3 Months Plan** - ₹2,999 (Most Popular - Save ₹1,998!)
• All premium features
• Extended support period
• Multiple career roadmaps

🥇 **1 Year Plan** - ₹3,999 (Best Value - Save ₹3,997!)
• Unlimited access to all features
• Personal mentor support
• Continuous updates

**🎁 BONUS: FREE Admission Counselling**
• Engineering (JEE, BITSAT, State CETs)
• Medical (NEET, AIIMS, JIPMER)
• Management (CAT, XAT, GMAT)
• No registration required!

**📞 Questions?** Call +91 8657869659 | +91 9619901999

**💡 Recommendation:** Start with our 8 FREE services, upgrade only if you need advanced roadmaps!"""
    
    if intent == "contact_inquiry":
        return """📞 **CareerGenAI Contact Information**

For direct assistance, admission counselling, or any support:
• **Primary Phone:** +91 8657869659
• **Secondary Phone:** +91 9619901999
• **Hours:** Mon-Sat (9 AM - 8 PM), Sun (10 AM - 6 PM)"""
    
    if intent == "career_guidance":
        return """🎯 **I understand you're looking for career guidance!** 

Career confusion is completely normal - you're not alone in feeling this way. Let me help you find clarity:

**🎓 PRIORITY: FREE Admission Counselling Available!**
📞 **Get Expert Help:** We offer FREE admission counselling for:
• **Engineering** - JEE Main/Advanced, BITSAT, State CETs
• **Medical (MBBS)** - NEET UG, AIIMS, JIPMER
• **MBA** - CAT, XAT, GMAT preparation & college selection
• **Medical Allied** - Nursing, Pharmacy, Physiotherapy

**📞 Contact for FREE Counselling:**
• **Phone:** +91 8657869659 | +91 9619901999
• **No Registration Required** - Call directly!

**🔍 Let's Start With Discovery:**
• What subjects or activities do you naturally enjoy?
• What problems do you like solving?
• Do you prefer working with people, data, or creative projects?

**🎯 CareerGenAI's Smart Assessment Process:**
1️⃣ **Interest Analysis** - Choose from 18 career interests (Math, Design, Coding, Writing, etc.)
2️⃣ **AI Matching** - Our AI analyzes your selections and suggests matching careers
3️⃣ **Detailed Insights** - Get career descriptions, required skills, education paths, and salary expectations
4️⃣ **College Recommendations** - Find the best institutions for your chosen field

**🆓 FREE Tools to Help You:**
• **Career Assessment** - AI-powered career matching based on interests
• **Personality Quiz** - Discover your work style and matching careers
• **College Search** - Find institutions by course, location, and percentile
• **Expert Counselling** - Book sessions with certified career counselors

**💡 Quick Questions to Get Started:**
• Are you more interested in technology, healthcare, business, or creative fields?
• Do you prefer hands-on work or analytical thinking?
• What's your current education level or field of study?

Tell me more about your interests, and I'll provide personalized guidance! 🚀"""
    
    if intent == "resume_help":
        return """📄 **CareerGenAI Resume Builders - Choose Your Option**

**📄 STANDARD RESUME BUILDER (FREE)**
✅ Professional ATS-friendly templates
✅ Easy-to-use interface
✅ PDF download
🔗 Access FREE Builder: /resume-templates

**💎 PREMIUM RESUME BUILDER (Premium Plan)**
✅ Advanced AI-powered templates
✅ Smart content suggestions
✅ Industry-specific keyword optimization
🔗 Access Premium Builder: /AllComponents"""

    # If no specific static response is defined for the intent, return None
    return None

def generate_intelligent_response(message: str, intent: str) -> str:
    """
    Enhanced intelligent response generation that can handle questions beyond static data.
    Uses pattern matching, keyword analysis, and contextual understanding.
    """
    message_lower = message.lower().strip()
    
    # Priority 1: Handle website-specific questions first
    if "free services" in message_lower or "free service" in message_lower:
        return """🆓 **CareerGenAI's 8 FREE Services:**

**🎯 Career Assessment** - Get AI-powered career suggestions based on your interests
**🧠 Personality Quiz** - Discover your personality type and matching careers  
**🤖 AI Chatbot** - 24/7 intelligent career guidance (that's me!)
**👨‍💼 Career Counselling** - Book sessions with certified career experts
**👤 Profile Builder** - Create your complete student career profile
**🏛️ Top Colleges** - Search colleges by location, course & percentile
**⚖️ Career Comparison Tool** - Compare salaries, skills & growth prospects
**📄 Resume Builder** - Professional ATS-friendly templates

**🎁 BONUS: FREE Admission Counselling**
• Engineering, Medical, MBA guidance
• No registration required
• Direct phone support

**📞 Contact:** +91 8657869659 | +91 9619901999
**Access:** Register free → Use all services immediately!

All these services are completely FREE for registered users! 🎉"""
    
    # Priority 2: Handle emotional/crisis situations
    emotional_keywords = ['failed', 'failure', 'rejected', 'ashamed', 'scared', 'afraid', 'worried', 'anxious', 'depressed', 'hopeless', 'lost', 'confused', 'torn', 'stuck']
    if any(word in message_lower for word in emotional_keywords):
        return generate_contextual_response(message_lower)
    
    # Handle specific complex scenarios
    if 'both' in message_lower and ('vs' in message_lower or 'or' in message_lower):
        return generate_contextual_response(message_lower)
    
    if any(phrase in message_lower for phrase in ['too late', 'change career', 'switch career']):
        return generate_contextual_response(message_lower)
    
    if any(phrase in message_lower for phrase in ['can\'t afford', 'expensive', 'cheap', 'money']):
        return generate_contextual_response(message_lower)
    
    # Career field specific questions with typo tolerance
    career_fields = {
        'engineering': ['engineer', 'engineering', 'engneering', 'engnerring', 'engg', 'coding', 'programming', 'software', 'computer', 'tech', 'development', 'it', 'jee', 'iit', 'btech', 'b.tech', 'cse', 'ece', 'mechanical', 'civil'],
        'medical': ['doctor', 'medicine', 'mbbs', 'medical', 'health', 'hospital', 'patient', 'neet', 'aiims', 'bds', 'nursing', 'pharmacy'],
        'business': ['business', 'management', 'mba', 'marketing', 'finance', 'entrepreneur', 'startup', 'cat', 'bba', 'commerce'],
        'design': ['design', 'creative', 'art', 'graphic', 'ui', 'ux', 'artist', 'visual', 'nift', 'fashion', 'interior'],
        'teaching': ['teacher', 'education', 'teaching', 'professor', 'academic', 'school', 'college', 'b.ed', 'bed'],
        'law': ['law', 'lawyer', 'legal', 'advocate', 'court', 'justice', 'clat', 'llb', 'judiciary'],
        'science': ['science', 'research', 'scientist', 'physics', 'chemistry', 'biology', 'lab', 'bsc', 'b.sc']
    }
    
    # Detect career field from message
    detected_field = None
    for field, keywords in career_fields.items():
        if any(keyword in message_lower for keyword in keywords):
            detected_field = field
            break
    
    # Question type analysis with better pattern matching
    question_patterns = {
        'salary': ['salary', 'pay', 'earn', 'income', 'money', 'package', 'lpa', 'earning', 'wages'],
        'education': ['study', 'course', 'degree', 'college', 'university', 'admission', 'entrance', 'education', 'qualification'],
        'skills': ['skill', 'learn', 'requirement', 'qualification', 'ability', 'knowledge', 'competency'],
        'future': ['future', 'scope', 'growth', 'opportunity', 'demand', 'job market', 'career path', 'career paths', 'prospects', 'outlook'],
        'comparison': ['vs', 'versus', 'compare', 'difference', 'better', 'which', 'or', 'between'],
        'how_to': ['how to', 'how can', 'steps', 'process', 'way to', 'method', 'guide', 'guidance'],
        'overview': ['about', 'tell me', 'information', 'details', 'overview', 'explain', 'what is']
    }
    
    detected_question_type = None
    for q_type, patterns in question_patterns.items():
        if any(pattern in message_lower for pattern in patterns):
            detected_question_type = q_type
            break
    
    # Handle follow-up questions (like "yes career paths" after engineering discussion)
    if detected_question_type and not detected_field:
        # Check if it's a short follow-up that might need context
        if len(message.split()) <= 3 and detected_question_type in ['future', 'overview']:
            # For short questions about career paths/future, provide general career guidance
            if detected_question_type == 'future':
                return """🚀 **Popular Career Paths by Field:**

**🔧 Engineering Paths:**
• Software Engineer → Tech Lead → Engineering Manager
• Data Scientist → Senior Data Scientist → Chief Data Officer
• Mechanical Engineer → Design Engineer → Project Manager

**🩺 Medical Paths:**
• MBBS → Specialization (MD/MS) → Senior Consultant
• Nursing → Staff Nurse → Nursing Supervisor
• Pharmacy → Clinical Pharmacist → Hospital Administrator

**📊 Business Paths:**
• Analyst → Senior Analyst → Manager → Director
• Marketing Executive → Brand Manager → Marketing Director
• Finance Analyst → Finance Manager → CFO

**💡 Key Success Factors:**
• Continuous learning and skill development
• Building professional networks
• Gaining relevant experience
• Pursuing certifications and advanced degrees

📞 **FREE Career Counselling:** +91 8657869659 | +91 9619901999
🎯 **Take our Career Assessment** to find your ideal path!"""

    # Generate intelligent response based on detected patterns
    if detected_field and detected_question_type:
        return generate_field_specific_response(detected_field, detected_question_type, message)
    elif detected_field:
        return generate_field_overview_response(detected_field)
    elif detected_question_type:
        return generate_general_question_response(detected_question_type, message)
    else:
        return generate_contextual_response(message_lower)

def generate_field_specific_response(field: str, question_type: str, original_message: str) -> str:
    """Generate specific responses based on career field and question type"""
    
    field_data = {
        'engineering': {
            'salary': "💰 **Engineering Salaries in India:**\n• **Freshers:** ₹3-8 LPA\n• **Mid-level (3-5 years):** ₹8-15 LPA\n• **Senior (5+ years):** ₹15-25+ LPA\n• **Top companies:** ₹25-50+ LPA\n\n**Highest paying:** Software Engineering, Data Science, AI/ML",
            'education': "🎓 **Engineering Education Path:**\n• **12th:** PCM with 75%+ marks\n• **Entrance:** JEE Main/Advanced, BITSAT, State CETs\n• **Degree:** B.Tech/B.E (4 years)\n• **Specializations:** CSE, ECE, Mechanical, Civil, etc.\n• **Advanced:** M.Tech, MBA, MS abroad",
            'skills': "🛠️ **Essential Engineering Skills:**\n• **Technical:** Programming, Mathematics, Problem-solving\n• **Software:** AutoCAD, MATLAB, Python, Java\n• **Soft Skills:** Communication, Teamwork, Project Management\n• **Emerging:** AI/ML, Cloud Computing, IoT",
            'future': "🚀 **Engineering Future Scope:**\n• **High Demand:** Software, AI/ML, Cybersecurity\n• **Growth Rate:** 8-12% annually\n• **Opportunities:** Startups, MNCs, Government, Entrepreneurship\n• **Global Scope:** Excellent for international careers"
        },
        'medical': {
            'salary': "💰 **Medical Career Salaries:**\n• **MBBS Freshers:** ₹4-8 LPA\n• **Specialists:** ₹10-25 LPA\n• **Senior Doctors:** ₹25-50+ LPA\n• **Private Practice:** ₹50L-2Cr+ annually\n\n**Note:** Medical careers have excellent long-term earning potential",
            'education': "🎓 **Medical Education Journey:**\n• **12th:** PCB with 50%+ (General), 40%+ (Reserved)\n• **Entrance:** NEET UG (mandatory)\n• **MBBS:** 5.5 years (4.5 study + 1 internship)\n• **Specialization:** MD/MS (3 years) via NEET PG\n• **Super-specialization:** DM/MCh (3 years)",
            'skills': "🩺 **Medical Professional Skills:**\n• **Core:** Anatomy, Physiology, Pathology knowledge\n• **Clinical:** Patient care, Diagnosis, Treatment planning\n• **Soft Skills:** Empathy, Communication, Decision-making\n• **Technical:** Medical equipment, EMR systems",
            'future': "🏥 **Medical Field Future:**\n• **Demand:** Always high, recession-proof\n• **Specializations:** Cardiology, Neurology, Oncology in demand\n• **Opportunities:** Hospitals, Private practice, Research, Teaching\n• **Global:** Excellent international opportunities"
        },
        'business': {
            'salary': "💰 **Business Career Salaries:**\n• **MBA Freshers:** ₹6-15 LPA\n• **Mid-level Managers:** ₹15-30 LPA\n• **Senior Management:** ₹30-75+ LPA\n• **C-level Executives:** ₹1Cr+ annually\n\n**Top sectors:** Consulting, Finance, Technology",
            'education': "🎓 **Business Education Path:**\n• **Bachelor's:** Any degree (BBA preferred)\n• **Entrance:** CAT, XAT, GMAT, MAT\n• **MBA:** 2 years from top B-schools\n• **Specializations:** Finance, Marketing, Operations, HR\n• **Executive MBA:** For working professionals",
            'skills': "📊 **Business Management Skills:**\n• **Analytical:** Data analysis, Financial modeling\n• **Leadership:** Team management, Strategic thinking\n• **Communication:** Presentation, Negotiation\n• **Technical:** Excel, PowerBI, CRM tools",
            'future': "📈 **Business Management Future:**\n• **Growth:** 10-15% annually\n• **Opportunities:** Startups, MNCs, Consulting, Entrepreneurship\n• **Emerging:** Digital marketing, E-commerce, Fintech\n• **Global:** Excellent for international business careers"
        }
    }
    
    if field in field_data and question_type in field_data[field]:
        response = field_data[field][question_type]
        response += f"\n\n💡 **Want personalized guidance?** Call our FREE counselling: +91 8657869659"
        return response
    
    return generate_field_overview_response(field)

def generate_field_overview_response(field: str) -> str:
    """Generate overview response for a specific career field"""
    
    overviews = {
        'engineering': "🔧 **Engineering Career Overview:**\nEngineering is perfect for problem-solvers who love technology and innovation. With high demand and excellent salaries, it offers diverse specializations from software to mechanical engineering.\n\n**Popular branches:** Computer Science, Electronics, Mechanical, Civil\n**Best for:** Logical thinkers, math lovers, tech enthusiasts",
        
        'medical': "🩺 **Medical Career Overview:**\nMedicine is a noble profession focused on healing and helping others. It requires dedication but offers job security, respect, and the satisfaction of saving lives.\n\n**Specializations:** General Medicine, Surgery, Pediatrics, Cardiology\n**Best for:** Compassionate individuals, science lovers, detail-oriented people",
        
        'business': "📊 **Business Career Overview:**\nBusiness management opens doors to leadership roles across industries. It's ideal for those who want to drive growth, manage teams, and make strategic decisions.\n\n**Areas:** Marketing, Finance, Operations, Human Resources\n**Best for:** Natural leaders, communication experts, strategic thinkers"
    }
    
    if field in overviews:
        response = overviews[field]
        response += f"\n\n🎯 **Take our FREE Career Assessment** to see if {field.title()} matches your interests!"
        response += f"\n📞 **FREE Counselling:** +91 8657869659 | +91 9619901999"
        return response
    
    return f"I'd love to help you learn about {field}! Could you be more specific about what you'd like to know? I can provide information about career paths, salaries, education requirements, and more."

def generate_general_question_response(question_type: str, message: str) -> str:
    """Generate responses for general question types"""
    
    responses = {
        'salary': "💰 **Career Salaries in India:**\n\n**High-paying fields:**\n• **Technology:** ₹8-50+ LPA\n• **Medicine:** ₹6-50+ LPA\n• **Business/Management:** ₹6-75+ LPA\n• **Finance:** ₹5-40+ LPA\n• **Consulting:** ₹10-60+ LPA\n\n**Factors affecting salary:** Skills, experience, company, location, specialization",
        
        'education': "🎓 **Education Pathways:**\n\n**After 12th Science:**\n• Engineering (JEE), Medical (NEET), BSc\n\n**After 12th Commerce:**\n• CA, CS, BBA, BCom, Economics\n\n**After 12th Arts:**\n• Law, Journalism, Psychology, Design\n\n**Professional courses:** Available at any stage",
        
        'skills': "🛠️ **Essential Career Skills:**\n\n**Technical Skills:**\n• Programming, Data Analysis, Digital Marketing\n\n**Soft Skills:**\n• Communication, Leadership, Problem-solving\n\n**Future Skills:**\n• AI/ML, Cloud Computing, Emotional Intelligence\n\n**How to develop:** Online courses, practice, mentorship",
        
        'future': "🚀 **Future Career Trends:**\n\n**High-growth fields:**\n• Artificial Intelligence & Machine Learning\n• Data Science & Analytics\n• Cybersecurity\n• Digital Health\n• Renewable Energy\n• E-commerce & Fintech\n\n**Key advice:** Focus on continuous learning and adaptability",
        
        'how_to': "📋 **How to Choose the Right Career:**\n\n**Step 1:** Take our FREE Career Assessment\n**Step 2:** Identify your interests and strengths\n**Step 3:** Research career options and requirements\n**Step 4:** Talk to professionals in the field\n**Step 5:** Make an informed decision\n\n**Get help:** Book FREE counselling session!"
    }
    
    if question_type in responses:
        response = responses[question_type]
        response += f"\n\n💡 **Need personalized guidance?** Call +91 8657869659 for FREE counselling!"
        return response
    
    return "I understand you're looking for guidance! Could you be more specific about what you'd like to know? I'm here to help with career planning, education paths, and more."

def generate_contextual_response(message_lower: str) -> str:
    """Generate contextual responses for general queries with enhanced emotional intelligence"""
    
    # Enhanced emotional support responses
    if any(word in message_lower for word in ['confused', 'lost', 'don\'t know', 'help me', 'stuck', 'clueless']):
        return """🤗 **I understand you're feeling confused - that's completely normal!**

Career confusion affects 80% of students. You're not alone in this journey.

**Let's start with small steps:**
1️⃣ **Take our FREE Career Assessment** - Discover your interests
2️⃣ **Talk to our counselors** - Get personalized guidance
3️⃣ **Explore different fields** - Learn about various options
4️⃣ **Connect with professionals** - Get real-world insights

**Remember:** Every successful person was once confused about their path. The key is taking action!

📞 **FREE Support:** +91 8657869659 | +91 9619901999
🎯 **Start here:** Take our Career Assessment (completely FREE!)"""
    
    # Failure/Rejection support
    if any(word in message_lower for word in ['failed', 'failure', 'rejected', 'ashamed', 'disappointed']):
        return """💪 **Setbacks are NOT the end - they're new beginnings!**

**Important truths:**
• JEE/NEET failure doesn't define your worth or future
• Many successful people didn't get into their first choice
• Alternative paths often lead to better opportunities
• Your journey is unique - don't compare with others

**Immediate next steps:**
✅ **State colleges** - Many excellent options available
✅ **Private colleges** - Good placement records
✅ **Alternative courses** - BCA, BSc, Diploma programs
✅ **Gap year preparation** - Try again next year
✅ **Skill-based careers** - Coding bootcamps, certifications

**Success stories:** Many CEOs and entrepreneurs didn't go to IITs!

📞 **FREE Counselling:** +91 8657869659 | +91 9619901999
💡 **Remember:** This is a detour, not a dead end!"""
    
    # Financial concerns
    if any(word in message_lower for word in ['afford', 'expensive', 'money', 'fees', 'cost', 'cheap']):
        return """💰 **Great careers don't always need expensive education!**

**Affordable high-paying options:**
🎯 **Government colleges** - Low fees, excellent education
🎯 **Skill-based careers** - Coding, Digital Marketing, Design
🎯 **Professional courses** - CA, CS, CMA (self-study possible)
🎯 **Online certifications** - Google, Microsoft, Amazon courses
🎯 **Vocational training** - ITI, Polytechnic, Trade courses

**Financial support:**
💳 **Education loans** - Available for most courses
💳 **Scholarships** - Merit and need-based options
💳 **Part-time work** - Earn while you learn

**High ROI careers:**
• Software Development (₹3-15+ LPA)
• Digital Marketing (₹2-10+ LPA)
• Accounting/Finance (₹2-8+ LPA)

📞 **FREE Guidance:** +91 8657869659 | +91 9619901999"""
    
    # Comparison/Choice dilemmas
    if any(word in message_lower for word in ['vs', 'versus', 'choose', 'torn', 'both', 'which']):
        return """🤔 **Tough choices need smart analysis!**

**Decision framework:**
1️⃣ **Interest alignment** - Which excites you more?
2️⃣ **Skill match** - Where are your natural strengths?
3️⃣ **Market demand** - Future job opportunities
4️⃣ **Lifestyle fit** - Work-life balance preferences
5️⃣ **Financial goals** - Earning potential and timeline

**Common comparisons:**
• **Engineering vs Medical** - Problem-solving vs People-helping
• **Government vs Private** - Security vs Growth potential
• **India vs Abroad** - Cost vs Exposure

**Pro tip:** There's rarely a "wrong" choice - just different paths to success!

📞 **FREE Counselling:** +91 8657869659 | +91 9619901999
🎯 **Take assessment:** Get personalized recommendations!"""
    
    # Career change concerns
    if any(word in message_lower for word in ['change career', 'too late', 'switch', 'different field']):
        return """🔄 **It's NEVER too late to change careers!**

**Career change success stories:**
• Colonel Sanders started KFC at 62
• Vera Wang entered fashion at 40
• Many professionals switch careers successfully

**Smart transition steps:**
1️⃣ **Skill assessment** - What transfers to new field?
2️⃣ **Gradual transition** - Part-time learning while working
3️⃣ **Network building** - Connect with new industry professionals
4️⃣ **Certification/Training** - Bridge skill gaps
5️⃣ **Strategic timing** - Plan financial cushion

**Popular transitions:**
• IT to Teaching (many opportunities)
• Corporate to Entrepreneurship
• Any field to Consulting/Training

**Age is just a number** - Your experience is an asset!

📞 **FREE Guidance:** +91 8657869659 | +91 9619901999"""

    # Age/class specific responses
    if any(word in message_lower for word in ['10th', 'class 10', 'after 10th']):
        return """🎓 **After 10th Class - Your Options:**

**Stream Selection:**
• **Science (PCM):** Engineering, Architecture, Pure Sciences
• **Science (PCB):** Medical, Pharmacy, Biotechnology
• **Commerce:** CA, CS, BBA, Economics
• **Arts/Humanities:** Law, Journalism, Psychology, Design

**Key Decision Factors:**
✅ Your interests and strengths
✅ Career goals and aspirations
✅ Future job market trends
✅ Your academic performance

**Don't rush!** Take time to explore each option.

📞 **FREE Guidance:** +91 8657869659"""

    if any(word in message_lower for word in ['12th', 'class 12', 'after 12th']):
        return """🚀 **After 12th - Career Pathways:**

**Popular Options:**
• **Engineering:** JEE Main/Advanced, State CETs
• **Medical:** NEET UG for MBBS/BDS
• **Management:** BBA, then MBA
• **Law:** CLAT for 5-year integrated LLB
• **Design:** NIFT, NID entrance exams
• **Commerce:** CA, CS, BCom

**Timeline:** Most entrance exams happen Feb-May

**Preparation Tips:**
✅ Start preparation early
✅ Take mock tests
✅ Stay updated with exam patterns
✅ Have backup options

📞 **FREE Admission Counselling:** +91 8657869659"""

    # General encouragement
    return """🌟 **I'm here to help with your career journey!**

**I can assist you with:**
• Career guidance and assessment
• Education pathways and requirements
• Salary information and job prospects
• College selection and admission guidance
• Skill development recommendations
• Industry trends and future opportunities

**Popular topics students ask about:**
• "What career is right for me?"
• "Engineering vs Medical - which is better?"
• "How much do software engineers earn?"
• "What should I study after 12th?"

**Ask me anything!** I'm designed to provide intelligent, personalized career guidance.

📞 **Need human expert?** Call +91 8657869659 for FREE counselling!"""

def generate_emotional_support_response(message: str, emotion_info: Dict) -> str:
    """Generate empathetic response for students needing emotional support."""
    
    primary_emotion = emotion_info.get("primary_emotion")
    
    if primary_emotion:
        base_response = primary_emotion["response"]
    else:
        base_response = "🤗 I can sense you're going through a challenging time. You're not alone in this journey."
    
    return f"""{base_response}

**🌟 Remember These Important Points:**
• **You're Not Alone** - Millions of students face similar challenges
• **Every Path is Valid** - There's no single "right" way to success
• **Setbacks are Temporary** - They don't define your future
• **Support is Available** - We're here to help you navigate this

**🎯 Let's Take Action Together:**
1. **Breathe & Reset** - Take a moment to center yourself
2. **Identify Your Strengths** - What are you naturally good at?
3. **Explore Options** - Let's look at all available paths
4. **Make a Plan** - Step-by-step approach to your goals

**🆓 FREE Support Available:**
• **Career Assessment** - Discover your strengths: /interest-form
• **Expert Counselling** - Talk to professionals: /consult
• **College Guidance** - Find the right fit: /colleges

**📞 Immediate Support:** +91 8657869659 | +91 9619901999
*Our counselors are trained to help students through difficult times*

**💙 You've got this! Every successful person has faced moments of doubt. What matters is taking the next step forward.**

What specific area would you like to explore together?"""

def generate_enhanced_intelligent_response(message: str, intent: str, emotion_info: Dict) -> str:
    """Enhanced intelligent response with emotional awareness."""
    
    message_lower = message.lower().strip()
    
    # Add emotional context if detected
    emotional_prefix = ""
    if emotion_info.get("needs_empathy"):
        emotional_prefix = "🤗 I understand this might be a challenging topic for you. "
    
    # Enhanced career guidance with emotional intelligence
    if intent == "career_guidance" or any(word in message_lower for word in ["career", "future", "what should i do"]):
        return f"""{emotional_prefix}🎯 **Let's Find Your Perfect Career Path Together**

**🔍 Quick Self-Discovery Questions:**
• What subjects do you enjoy most?
• What activities make you lose track of time?
• Do you prefer working with people, data, or creative projects?
• What problems in the world would you like to solve?

**🎓 Popular Career Paths by Interest:**
• **Tech-Minded:** Software Development, Data Science, AI/ML
• **People-Oriented:** Teaching, Counseling, HR, Social Work
• **Creative:** Design, Marketing, Content Creation, Arts
• **Problem-Solvers:** Engineering, Research, Consulting
• **Business-Minded:** Management, Entrepreneurship, Finance

**🆓 FREE Tools to Help You Decide:**
• **Career Assessment** - AI-powered matching: /interest-form
• **Personality Quiz** - Understand your work style: /career-quiz
• **Expert Guidance** - Book counseling session: /consult

**📞 Need to talk it through?** Call +91 8657869659

What type of work environment appeals to you most?"""
    
    # Handle general questions with empathy
    return f"""{emotional_prefix}👋 **I'm here to help you with your career journey!**

**🎯 I can assist you with:**
• **Academic Guidance** - College recommendations based on your marks
• **Career Exploration** - Find careers that match your interests
• **Emotional Support** - Navigate the stress of career decisions
• **Practical Help** - Resume building, interview prep, college search

**💡 Try asking me:**
• "I got 85% which college should I go?"
• "I'm confused about my career"
• "What services do you offer?"
• "Help me build a resume"

**🆓 FREE Resources Available:**
• Career assessment and personality quiz
• College search and comparison tools
• Resume builder and career counseling
• Expert guidance sessions

**📞 Direct Support:** +91 8657869659 | +91 9619901999

What would you like to explore first? I'm here to support you every step of the way! 🌟"""

def generate_universal_service_response(intent_result: Dict) -> str:
    """UNIVERSAL SERVICE RESPONSE - Handles ALL service queries intelligently"""
    
    service_name = intent_result.get("service")
    query_context = intent_result.get("query_context", {})
    relevant_knowledge = intent_result.get("relevant_knowledge", {})
    information_needed = intent_result.get("information_needed", [])
    
    # Debug logging
    logger.info(f"🔍 Service Response Debug - Service: {service_name}, Intent Result Keys: {list(intent_result.keys())}")
    
    # Enhanced service detection - try multiple approaches
    if not service_name:
        # Try to extract from relevant knowledge
        if relevant_knowledge.get("primary_match"):
            for svc_name, svc_data in UNIVERSAL_KNOWLEDGE_BASE["services"].items():
                if svc_data == relevant_knowledge["primary_match"]:
                    service_name = svc_name
                    break
    
    # If still no service found, provide general services overview
    if not service_name or service_name not in UNIVERSAL_KNOWLEDGE_BASE["services"]:
        return """🛠️ **CareerGenAI Services - Complete Overview**

**🆓 FREE Services (8 total):**
1️⃣ **Career Assessment** - AI-powered career matching (/interest-form)
2️⃣ **Personality Quiz** - Work style analysis (/career-quiz)
3️⃣ **Resume Builder** - Professional ATS templates (/resume-templates)
4️⃣ **Career Counselling** - Expert guidance sessions (/consult)
5️⃣ **Profile Builder** - Complete career tracking (/profile-builder)
6️⃣ **Top Colleges** - 10,000+ colleges database (/colleges)
7️⃣ **Career Comparison** - Side-by-side analysis (/career-compare)
8️⃣ **AI Chatbot** - 24/7 intelligent support (that's me!)

**💎 PREMIUM Services (2 total):**
9️⃣ **Career Roadmaps** - Step-by-step career guides (/career-roadmap)
🔟 **Premium Resume Builder** - AI-powered features (/AllComponents)

**💰 Premium Pricing:** ₹1,999 (1M) | ₹2,999 (3M) | ₹3,999 (1Y)

**📞 Support:** +91 8657869659 | +91 9619901999

Which specific service interests you most?"""
    
    service_data = UNIVERSAL_KNOWLEDGE_BASE["services"][service_name]
    
    # Build comprehensive response
    response_parts = []
    
    # Service title and description
    service_title = service_name.replace("_", " ").title()
    service_emoji = {
        "career_assessment": "🎯",
        "personality_quiz": "🧠", 
        "resume_builder": "📄",
        "premium_resume": "💎",
        "career_counselling": "👨‍💼",
        "top_colleges": "🏛️",
        "profile_builder": "👤",
        "career_comparison": "⚖️",
        "career_roadmaps": "�️",
        "ai_chatbot": "🤖"
    }.get(service_name, "🛠️")
    
    response_parts.append(f"{service_emoji} **{service_title}**")
    response_parts.append(f"\n📝 **{service_data['description']}**")
    
    # Key Features (always show top 4)
    if service_data.get("features"):
        response_parts.append("\n**✨ Key Features:**")
        for i, feature in enumerate(service_data["features"][:4], 1):
            response_parts.append(f"{i}. **{feature}**")
    
    # Process information (show if requested or for complex services)
    if ("process" in information_needed or 
        "how" in str(query_context.get("specific_requests", [])).lower() or
        service_name in ["career_assessment", "premium_resume", "career_roadmaps"]):
        if service_data.get("process"):
            response_parts.append(f"\n**📋 How It Works:**\n{service_data['process']}")
    
    # Pricing (always show for premium, show for free if requested)
    if service_data.get("type") == "PREMIUM":
        if service_data.get("pricing"):
            response_parts.append("\n**💰 Premium Pricing:**")
            for plan, price in service_data["pricing"].items():
                plan_name = plan.replace("_", " ").title()
                popular = " (Most Popular)" if "3" in plan else ""
                best_value = " (Best Value)" if "1_year" in plan else ""
                response_parts.append(f"• **{plan_name}:** {price}{popular}{best_value}")
    elif service_data.get("type") == "FREE":
        response_parts.append("\n**🆓 Completely FREE** - No registration required!")
    
    # Duration and additional info
    if service_data.get("duration"):
        response_parts.append(f"\n**⏱️ Duration:** {service_data['duration']}")
    
    if service_data.get("templates"):
        response_parts.append(f"\n**🎨 Templates:** {', '.join(service_data['templates'][:3])}")
    
    if service_data.get("coverage"):
        response_parts.append(f"\n**🌍 Coverage:** {service_data['coverage']}")
    
    # Call-to-action
    response_parts.append(f"\n**🚀 Get Started:** {service_data['url']}")
    
    # Support information
    response_parts.append("\n**📞 Need Help?** Call +91 8657869659 | +91 9619901999")
    
    # Smart suggestions based on service type
    if service_name == "resume_builder":
        response_parts.append("\n**💡 Next Steps:** Take Career Assessment → Build Resume → Apply to Jobs")
    elif service_name == "career_assessment":
        response_parts.append("\n**💡 After Assessment:** Explore Colleges → Build Resume → Book Counselling")
    elif service_name == "top_colleges":
        response_parts.append("\n**💡 Pro Tip:** Use with Career Assessment for personalized recommendations")
    else:
        response_parts.append("\n**💡 Related:** Career Assessment, Resume Builder, Expert Counselling")
    
    return "\n".join(response_parts)

def generate_process_response(message: str, query_context: Dict, relevant_knowledge: Dict) -> str:
    """Generate step-by-step process guidance"""
    
    message_lower = message.lower()
    
    # Detect what process they're asking about
    if any(word in message_lower for word in ["resume", "cv"]):
        return """📄 **How to Build a Professional Resume - Step by Step**

**🎯 Using Our FREE Resume Builder:**

**Step 1: Choose Template**
• Visit /resume-templates
• Select from Modern, Classic, Creative, or Professional templates
• All templates are ATS-friendly

**Step 2: Fill Your Information**
• Personal details and contact info
• Professional summary (2-3 lines)
• Work experience (if any)
• Education details
• Skills and certifications

**Step 3: Customize Design**
• Adjust colors and fonts
• Rearrange sections as needed
• Preview your resume

**Step 4: Download & Apply**
• Download as PDF
• Tailor for each job application
• Include relevant keywords

**💡 Pro Tips:**
• Keep it to 1-2 pages maximum
• Use action verbs (achieved, managed, developed)
• Quantify achievements with numbers
• Proofread carefully

**🔗 Start Building:** /resume-templates
**📞 Need Help?** Call +91 8657869659"""
    
    elif any(word in message_lower for word in ["career", "assessment", "test"]):
        return """🎯 **How to Take Career Assessment - Complete Guide**

**🧠 Our AI-Powered Career Discovery Process:**

**Step 1: Access Assessment**
• Visit /interest-form
• No registration required
• Takes 15-20 minutes

**Step 2: Answer Questions**
• 18+ career interest areas
• Rate your preferences honestly
• Include skills and subjects you enjoy

**Step 3: AI Analysis**
• Our AI analyzes your responses
• Matches with 500+ career options
• Considers market trends and growth

**Step 4: Get Results**
• Top 5 career matches
• Detailed career descriptions
• Required skills and education
• Salary expectations and growth prospects

**Step 5: Take Action**
• Explore recommended careers
• Use our college search tool
• Book expert counselling session

**🎁 Bonus Features:**
• Personality quiz integration
• Career comparison tool
• Personalized roadmaps

**🔗 Start Assessment:** /interest-form
**📞 Expert Guidance:** +91 8657869659"""
    
    else:
        return """🔍 **How to Use CareerGenAI Platform - Complete Guide**

**🚀 Getting Started:**

**Step 1: Explore Services**
• 8 FREE services available
• 2 Premium services for advanced features
• No registration required for most services

**Step 2: Take Assessments**
• Career Assessment - Find your ideal career
• Personality Quiz - Understand your work style
• Both are completely FREE

**Step 3: Build Your Profile**
• Use Profile Builder to track progress
• Create professional resume
• Search and compare colleges

**Step 4: Get Expert Help**
• Book FREE counselling sessions
• Call direct support lines
• Access 24/7 AI chatbot (that's me!)

**Step 5: Plan Your Future**
• Use career roadmaps (Premium)
• Compare different career options
• Get admission counselling

**🆓 FREE Services:** Career Assessment, Resume Builder, College Search, Expert Counselling
**💎 Premium:** Advanced roadmaps and premium resume builder

**📞 Support:** +91 8657869659 | +91 9619901999
**💬 Chat:** Available 24/7 for instant help"""

def generate_comparison_response(message: str, query_context: Dict) -> str:
    """Generate detailed comparison responses"""
    
    message_lower = message.lower()
    
    if "free vs premium" in message_lower or "free vs paid" in message_lower:
        return """⚖️ **FREE vs PREMIUM Services Comparison**

**🆓 FREE Services (8 total):**
✅ **Career Assessment** - AI-powered career matching
✅ **Personality Quiz** - Work style analysis  
✅ **Resume Builder** - Professional ATS templates
✅ **Career Counselling** - Expert guidance sessions
✅ **Profile Builder** - Complete career profile
✅ **Top Colleges** - 10,000+ college database
✅ **Career Comparison** - Side-by-side analysis
✅ **AI Chatbot** - 24/7 intelligent support

**💎 PREMIUM Services (2 total):**
✅ **Career Roadmaps** - Step-by-step career guides
✅ **Premium Resume Builder** - AI-powered with advanced features

**💰 Premium Pricing:**
• 1 Month: ₹1,999
• 3 Months: ₹2,999 (Most Popular)
• 1 Year: ₹3,999 (Best Value)

**🎯 Who Should Choose Premium:**
• Students wanting detailed career roadmaps
• Job seekers needing advanced resume features
• Those requiring priority support

**💡 Recommendation:** Start with FREE services, upgrade if you need advanced features!"""
    
    elif any(word in message_lower for word in ["engineering vs medical", "medical vs engineering"]):
        return """⚖️ **Engineering vs Medical - Detailed Comparison**

**🔧 ENGINEERING:**
• **Duration:** 4 years (B.Tech/B.E)
• **Entrance:** JEE Main/Advanced, State CETs
• **Investment:** ₹2-20 lakhs total
• **Starting Salary:** ₹3-8 LPA
• **Peak Salary:** ₹15-50+ LPA
• **Job Security:** High, especially in tech
• **Work-Life Balance:** Good to Excellent
• **Growth:** Rapid in emerging technologies

**🏥 MEDICAL:**
• **Duration:** 5.5 years (MBBS) + specialization
• **Entrance:** NEET (mandatory)
• **Investment:** ₹5-50 lakhs (varies by college type)
• **Starting Salary:** ₹4-8 LPA
• **Peak Salary:** ₹20-100+ LPA
• **Job Security:** Excellent, recession-proof
• **Work-Life Balance:** Challenging initially
• **Growth:** Steady, high social respect

**🎯 Choose Engineering If:**
• You love problem-solving and technology
• Want faster entry into job market
• Prefer diverse career options
• Enjoy innovation and creativity

**🎯 Choose Medical If:**
• You want to help people directly
• Can handle long study duration
• Seek high social respect
• Don't mind intensive training

**📞 Need personalized guidance?** Call +91 8657869659"""
    
    else:
        return """⚖️ **Career Comparison Tool Available!**

I can help you compare:
• **Career Fields** - Engineering vs Medical vs Business
• **Services** - FREE vs Premium features
• **Colleges** - Rankings, fees, placements
• **Career Paths** - Growth, salary, work-life balance

**🔗 Use Our Comparison Tool:** /career-compare

**💡 Popular Comparisons:**
• Engineering vs Medical career paths
• FREE vs Premium service features
• Government vs Private colleges
• Traditional vs Emerging careers

**📞 Expert Comparison Guidance:** +91 8657869659

What specific comparison would you like me to help with?"""

def generate_website_info_response(query_context: Dict) -> str:
    """Generate website information responses"""
    
    return """🌟 **About CareerGenAI - Your Intelligent Career Partner**

**🎯 Our Mission:**
Making career guidance accessible to every student through AI-powered tools and expert support.

**👥 Our Team:**
• Career guidance experts with 10+ years experience
• AI specialists and data scientists
• Certified counselors and psychologists
• Student success advocates

**🏆 What Makes Us Different:**
• **AI-Powered Intelligence** - Advanced algorithms for personalized guidance
• **Comprehensive Platform** - 10 services covering all career needs
• **Expert Support** - Human counselors for complex decisions
• **Emotional Intelligence** - Understanding student stress and anxiety
• **Accessibility** - 8 FREE services, no barriers to guidance

**📊 Our Impact:**
• 50,000+ students guided
• 95% satisfaction rate
• 10,000+ successful placements
• 24/7 support availability

**🎓 Services Coverage:**
• **Academic Guidance** - College recommendations, entrance prep
• **Career Discovery** - Assessments, personality analysis
• **Professional Tools** - Resume building, profile creation
• **Expert Support** - Counselling, mentorship, guidance

**📞 Connect With Us:**
• Phone: +91 8657869659 | +91 9619901999
• Hours: Mon-Sat (9 AM - 8 PM), Sun (10 AM - 6 PM)
• Chat: 24/7 AI assistant (that's me!)

**🚀 Founded in 2024** with a vision to democratize career guidance through technology and human expertise.

Ready to start your career journey with us?"""

def generate_information_response(message: str, query_context: Dict, relevant_knowledge: Dict) -> str:
    """Generate informational responses for general queries"""
    
    message_lower = message.lower()
    
    # If we found relevant knowledge, use it
    if relevant_knowledge.get("primary_match"):
        service_data = relevant_knowledge["primary_match"]
        service_name = relevant_knowledge.get("service_name", "this service")
        
        return f"""ℹ️ **Information about {service_name.replace('_', ' ').title()}**

**📝 Description:**
{service_data.get('description', 'Comprehensive service for your career needs')}

**✨ Key Features:**
{chr(10).join([f'• {feature}' for feature in service_data.get('features', ['Professional guidance', 'Expert support'])[:4]])}

**🔗 Access:** {service_data.get('url', '/services')}
**💰 Type:** {service_data.get('type', 'Available')}

**📞 Questions?** Call +91 8657869659 | +91 9619901999

Would you like more specific information about any aspect?"""
    
    # General information response
    return """ℹ️ **CareerGenAI Information Hub**

**🎯 What We Offer:**
• **10 Comprehensive Services** - Career assessment to resume building
• **AI-Powered Guidance** - Intelligent, personalized recommendations
• **Expert Support** - Human counselors for complex decisions
• **24/7 Availability** - Always here when you need guidance

**🆓 FREE Services (8):**
Career Assessment, Personality Quiz, Resume Builder, Career Counselling, Profile Builder, College Search, Career Comparison, AI Chatbot

**💎 Premium Services (2):**
Career Roadmaps, Premium Resume Builder

**📊 Key Statistics:**
• 10,000+ colleges in database
• 500+ career options analyzed
• 95% student satisfaction rate
• 24/7 support availability

**🎓 Specializations:**
• Academic guidance and college selection
• Career discovery and planning
• Emotional support for students
• Professional development tools

**📞 Get Information:**
• Call: +91 8657869659 | +91 9619901999
• Chat: Ask me anything, anytime!
• Visit: Explore our services online

What specific information are you looking for?"""

def generate_universal_response(message: str, query_context: Dict, relevant_knowledge: Dict) -> str:
    """UNIVERSAL INTELLIGENT RESPONSE - Handles ANY query with context awareness"""
    
    message_lower = message.lower().strip()
    
    # SMART CONTEXT DETECTION
    # Help/Support requests
    if any(word in message_lower for word in ["help", "need", "want", "looking for", "assist", "support"]):
        return """🤗 **I'm your intelligent career assistant - here to help with everything!**

**🎯 I excel at helping with:**

**🎓 Academic Guidance:**
• "I got 85% which college should I go?" - Personalized recommendations
• "Engineering vs Medical - which is better?" - Detailed comparisons
• "I'm confused about my career" - Emotional support + guidance

**🛠️ Service Information:**
• "How does resume builder work?" - Step-by-step guidance
• "What services do you offer?" - Complete overview
• "Free vs Premium - what's the difference?" - Detailed comparison

**💼 Career Planning:**
• "What career is right for me?" - AI-powered assessment
• "Software engineer salary in India" - Market insights
• "How to become a data scientist?" - Career roadmaps

**🤝 Instant Support:**
• 24/7 intelligent responses (that's me!)
• Direct expert access: +91 8657869659 | +91 9619901999
• Emotional support for career stress

**💡 Just ask naturally:**
• "I need help with..." 
• "Tell me about..."
• "How do I..."
• "What's the best way to..."

What specific area can I help you with right now?"""
    
    # Career-related queries
    if any(word in message_lower for word in ["career", "job", "future", "profession", "work"]):
        return """🚀 **Career Guidance - My Specialty!**

**🎯 I can help you with ANY career question:**

**🔍 Career Discovery:**
• Take FREE Career Assessment - Find your perfect match
• Personality Quiz - Understand your work style
• Career Comparison - Compare different paths

**📚 Education Planning:**
• College recommendations based on your percentage
• Stream selection (Engineering, Medical, Commerce, Arts)
• Entrance exam guidance (JEE, NEET, CAT, etc.)

**💼 Professional Development:**
• Resume building with ATS-friendly templates
• Interview preparation and tips
• Skill development recommendations

**🎓 Popular Career Questions I Answer:**
• "What career suits my personality?"
• "Engineering vs Medical - which pays more?"
• "I got 92% - which college should I choose?"
• "How to switch careers successfully?"

**🆓 FREE Tools Available:**
• Career Assessment (/interest-form)
• Resume Builder (/resume-templates)
• College Search (/colleges)
• Expert Counselling (/consult)

**📞 Expert Support:** +91 8657869659 | +91 9619901999

What career question is on your mind?"""
    
    # Service/Product inquiries
    if any(word in message_lower for word in ["service", "offer", "provide", "feature", "tool", "platform"]):
        return """🛠️ **CareerGenAI Complete Service Portfolio**

**🆓 FREE Services (8 total) - No Registration Required:**
1️⃣ **Career Assessment** - AI finds your perfect career match
2️⃣ **Personality Quiz** - Discover your work style & preferences  
3️⃣ **Resume Builder** - Professional ATS-friendly templates
4️⃣ **Career Counselling** - One-on-one expert guidance sessions
5️⃣ **Profile Builder** - Complete career tracking system
6️⃣ **Top Colleges** - Search 10,000+ colleges database
7️⃣ **Career Comparison** - Side-by-side career analysis
8️⃣ **AI Chatbot** - 24/7 intelligent support (that's me!)

**💎 PREMIUM Services (2 total):**
9️⃣ **Career Roadmaps** - Step-by-step career guides
🔟 **Premium Resume Builder** - AI-powered with advanced features

**💰 Transparent Pricing:**
• **FREE Services:** 8 services, no hidden charges
• **Premium Plans:** ₹1,999 (1M) | ₹2,999 (3M) | ₹3,999 (1Y)

**🎁 BONUS:** FREE admission counselling for JEE, NEET, CAT

**📞 Support:** +91 8657869659 | +91 9619901999

Which service interests you most?"""
    
    # Default intelligent welcome
    return """🌟 **Welcome to CareerGenAI - Your Intelligent Career Partner!**

**🤖 I'm your AI assistant, ready to help with:**
• **Academic Guidance** - College recommendations, stream selection
• **Career Planning** - Assessment, exploration, roadmaps  
• **Professional Tools** - Resume building, profile creation
• **Emotional Support** - When you're confused or stressed
• **Expert Connect** - Direct access to human counselors

**💬 I understand natural language - just ask me:**
• "I got 85% which college should I go?"
• "What career is right for me?"
• "I need help with resume building"
• "I'm confused about my future"
• "What services do you offer?"

**🆓 Everything starts FREE:**
• Career Assessment - Discover your perfect match
• Resume Builder - Professional templates
• College Search - 10,000+ institutions
• Expert Counselling - Human guidance when needed

**📞 Need immediate help?** Call +91 8657869659 | +91 9619901999

I'm here 24/7 to support your career journey. What's on your mind? 🚀"""

def generate_intelligent_universal_fallback(message: str, intent: str, query_context: Dict) -> str:
    """Intelligent fallback that tries to understand and help with any query"""
    
    return """🤔 **I want to understand exactly how to help you!**

Based on your message, I can see you're looking for assistance. Let me offer some specific ways I can help:

**🎯 If you're asking about our services:**
• Try: "What services do you offer?"
• Try: "How does resume builder work?"
• Try: "I need profile building help"

**🎓 If you need academic guidance:**
• Try: "I got [your percentage]% which college should I go?"
• Try: "I'm confused about career selection"
• Try: "Help me choose between engineering and medical"

**💡 If you want to know about processes:**
• Try: "How to build a resume?"
• Try: "Steps for career assessment"
• Try: "How to search colleges?"

**🤗 If you're feeling overwhelmed:**
• Try: "I'm stressed about my future"
• Try: "I don't know what career to choose"
• Try: "My parents are pressuring me"

**🆓 Quick Access:**
• **Career Assessment:** /interest-form
• **Resume Builder:** /resume-templates
• **College Search:** /colleges
• **Expert Help:** Call +91 8657869659

**💬 You can also ask me directly:**
"What can you help me with?" and I'll give you a complete overview!

What specific area would you like to explore?"""

def generate_empathetic_fallback(message: str, intent: str) -> str:
    """Empathetic fallback response for unclear inputs."""
    
    return """🤗 **I want to help you, but I need a bit more information.**

**🎯 I'm specially designed to help with:**
• **Academic Questions** - "I got 92% which college should I go?"
• **Career Confusion** - "I don't know what career to choose"
• **Emotional Support** - When you're feeling overwhelmed or stressed
• **Service Information** - Resume building, career assessment, counseling

**💡 Try being more specific:**
• Share your percentage/marks for college recommendations
• Tell me what's worrying you about your future
• Ask about specific services or career fields
• Let me know if you're feeling confused or anxious

**🆓 Quick Access:**
• **Career Assessment:** /interest-form
• **Resume Builder:** /resume-templates  
• **Expert Help:** /consult

**📞 Need immediate support?** Call +91 8657869659

I'm here to support you through your career journey. What's on your mind? 💙"""

def generate_production_fallback(message: str, intent: str) -> str:
    """Optimized production fallback for fast, reliable responses"""
    message_lower = message.lower().strip()
    
    # Quick pattern matching for common scenarios
    if any(word in message_lower for word in ["help", "confused", "lost", "don't know"]):
        return """🎯 **I'm here to help you!** 

**🆓 FREE Services Available:**
• **Career Assessment** - Find your perfect career match
• **Resume Builder** - Create professional resumes
• **Career Counselling** - Expert guidance sessions
• **College Search** - Find top institutions

**📞 Direct Support:** +91 8657869659 | +91 9619901999
**💬 Ask me about:** Services, pricing, career guidance, or any specific questions!

What would you like to explore first?"""
    
    # Default helpful response
    return """👋 **Welcome to CareerGenAI!**

I can help you with:
🎯 **All our services** - Career assessment, resume builder, counselling
💰 **Pricing information** - Plans and packages
📞 **Contact details** - Direct support numbers
🎓 **Career guidance** - Expert advice and support

**Quick Examples:**
• "resume builder" - Get resume creation help
• "pricing" - See our plans
• "career guidance" - Get expert advice
• "contact details" - Get support numbers

**📞 Need immediate help?** Call +91 8657869659 | +91 9619901999

What can I help you with today?"""

def handle_unclear_input(message: str) -> str:
    """Enhanced handler for unclear input with intelligent fallback"""
    message_lower = message.lower().strip()
    
    # Check for very short or unclear messages
    if len(message_lower) < 3:
        return "Could you please provide more details? I'm here to help with your career questions!"
    
    # Check for random characters or gibberish
    if not any(c in 'aeiou' for c in message_lower) or len([c for c in message_lower if c.isalpha()]) < 2:
        return "I didn't quite understand that. Could you rephrase your question? I'm here to help with career guidance!"
    
    # Try to generate an intelligent response even for unclear input
    return generate_intelligent_response(message, "general_question")
    
    return """🤖 **I'm your AI career assistant!**

I'm here to help with any career-related questions you have.

**🎯 I'm excellent at helping with:**
* **Career Exploration**: Discovering careers that match your interests.
* **Education Planning**: Finding the right colleges and courses.
* **Professional Development**: Resume building and interview tips.

**💬 Try asking me something like:**
* "I need career guidance"
* "Tell me about engineering"
* "What services do you offer?"

How can I help you navigate your career journey today? 🚀"""

def generate_suggestions(intent: str) -> List[str]:
    """(Preserved from Original) Generate contextual suggestions based on intent."""
    suggestions_map = {
        "career_guidance": ["Tell me about technology careers", "What skills do I need for business?", "Compare engineering and medical fields"],
        "resume_help": ["What is an ATS-friendly resume?", "View pricing for premium builder", "What are your other services?"],
        "college_search": ["Search for engineering colleges", "Tell me about MBA programs", "How does career counselling work?"],
        "greeting": ["What services do you offer?", "Help me plan my career", "I need guidance with college selection"]
    }
    return suggestions_map.get(intent, ["What are your free services?", "Help me with career planning", "Show me pricing options"])

# --- FastAPI Endpoints ---

@app.on_event("startup")
async def startup_event():
    await initialize_ai_models()

# Removed duplicate - using optimized version below

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """
    Enhanced chat endpoint with comprehensive question handling for all 5 categories.
    """
    try:
        message = chat_message.message.strip()
        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Production optimization: Check cache for common queries
        cache_key = message.lower().strip()
        if cache_enabled and cache_key in response_cache:
            logger.info(f"Cache hit for: '{message[:50]}...'")
            cached_response = response_cache[cache_key]
            cached_response["metadata"]["timestamp"] = datetime.now().isoformat()
            cached_response["metadata"]["cache_hit"] = True
            return ChatResponse(**cached_response)
        
        logger.info(f"Processing message: '{message[:50]}...'")

        # Quick fix for resume building and common requests
        message_lower = message.lower()
        
        # Handle resume building requests
        if any(word in message_lower for word in ["resume", "cv", "build resume", "create resume", "resume builder"]):
            reply = f"""📄 **Resume Builder - Create Professional Resumes!**

**🆓 FREE Resume Builder:**
• Professional ATS-friendly templates
• Easy-to-use interface
• Multiple format options
• Instant PDF download

**💎 Premium Resume Builder:**
• 6+ advanced templates
• AI-powered content suggestions
• Industry-specific optimization
• Advanced customization

**🔗 Get Started:**
• FREE Resume Builder: {BASE_URL}/resume-templates
• Premium Version: {BASE_URL}/AllComponents

**📝 How to Use:**
1. Register free at: {BASE_URL}/register
2. Choose your template
3. Fill in your details
4. Download professional PDF

**💰 Pricing:**
• FREE: Basic templates (no payment required, just register)
• Premium: ₹1,999 (1 month) | ₹2,999 (3 months) | ₹3,999 (1 year)

**📞 Need help?** Call +91 8657869659 | +91 9619901999

Ready to create your professional resume?"""
            
            response_data = {
                "reply": reply,
                "confidence": 0.95,
                "intent": "resume_builder",
                "suggestions": ["How to create ATS-friendly resume?", "What's the difference between free and premium?", "Show me resume templates"],
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "model_used": "resume_handler",
                    "user_id": chat_message.user_id,
                    "cache_hit": False
                }
            }
            return ChatResponse(**response_data)
        
        # Handle service inquiries
        elif any(word in message_lower for word in ["services", "what can you do", "features", "what do you offer"]):
            reply = f"""🎯 **CareerGenAI - Complete Service Portfolio**

**🆓 FREE SERVICES (8 Total) - Registration Required, No Money:**
1. **Career Assessment** - AI-powered career discovery
2. **Personality Quiz** - Discover your work style
3. **AI Chatbot** - 24/7 intelligent assistant (that's me!)
4. **Career Counselling** - Expert guidance sessions
5. **Profile Builder** - Complete career tracking
6. **Top Colleges Search** - 10,000+ colleges database
7. **Career Comparison Tool** - Compare career paths
8. **Resume Builder** - Professional templates

**💎 PREMIUM SERVICES (2 Total) - Paid Subscription:**
9. **Career Roadmaps** - Step-by-step career guides
10. **Premium Resume Builder** - AI-powered advanced features

**🎁 BONUS:** FREE Admission Counselling (no registration required!)

**🔗 Quick Access:**
• Register: {BASE_URL}/register
• Career Assessment: {BASE_URL}/interest-form
• Resume Builder: {BASE_URL}/resume-templates
• College Search: {BASE_URL}/college

**📞 Support:** +91 8657869659 | +91 9619901999

Which service interests you most?"""
            
            response_data = {
                "reply": reply,
                "confidence": 0.95,
                "intent": "services_inquiry",
                "suggestions": ["How do I get started?", "What's the pricing?", "Tell me about career assessment"],
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "model_used": "services_handler",
                    "user_id": chat_message.user_id,
                    "cache_hit": False
                }
            }
            return ChatResponse(**response_data)
        
        # Fallback to existing AI system for complex queries
        intent_result = await classify_intent_ai(message)
        intent, confidence = intent_result["intent"], intent_result["confidence"]
        service_name = intent_result.get("service", None)
        logger.info(f"Detected intent: '{intent}' (Confidence: {confidence:.2f})")

        # UNIVERSAL AUGMENTED RESPONSE SYSTEM: Handles ALL website queries intelligently
        reply = None
        model_used = "unknown"
        query_context = intent_result.get("query_context", {})
        relevant_knowledge = intent_result.get("relevant_knowledge", {})
        
        # Layer 1: Academic Guidance (highest priority for student questions)
        if intent == "academic_guidance":
            logger.info("Providing personalized academic guidance...")
            academic_info = intent_result.get("academic_info", {})
            emotion_info = await detect_emotion(message)
            reply = generate_academic_guidance_response(academic_info, emotion_info)
            model_used = "academic_intelligence"
        
        # Layer 2: Universal Service Queries (comprehensive service information)
        elif intent == "universal_service_query" or service_name:
            logger.info(f"Processing universal service query for: {service_name}")
            reply = generate_universal_service_response(intent_result)
            model_used = "universal_service_intelligence"
        
        # Layer 3: Process/How-to Queries (step-by-step guidance)
        elif intent == "process_inquiry":
            logger.info("Providing process guidance...")
            reply = generate_process_response(message, query_context, relevant_knowledge)
            model_used = "process_intelligence"
        
        # Layer 4: Comparison Queries (detailed comparisons)
        elif intent == "comparison_query":
            logger.info("Generating comparison analysis...")
            reply = generate_comparison_response(message, query_context)
            model_used = "comparison_intelligence"
        
        # Layer 5: Website Information Queries
        elif intent == "website_info_query":
            logger.info("Providing website information...")
            reply = generate_website_info_response(query_context)
            model_used = "website_intelligence"
        
        # Layer 6: Emotional Support (for students in distress)
        elif intent == "emotional_support":
            logger.info("Providing emotional support...")
            emotion_info = await detect_emotion(message)
            reply = generate_emotional_support_response(message, emotion_info)
            model_used = "emotional_intelligence"
        
        # Layer 7: Traditional static responses (pricing, contact, greeting)
        elif intent in ["pricing_inquiry", "contact_inquiry", "greeting"]:
            reply = generate_enhanced_static_response(message, intent, query_context)
            model_used = "enhanced_static"
            logger.info(f"Using enhanced static response for intent: {intent}")
        
        # Layer 8: Information Queries (general information seeking)
        elif intent == "information_query":
            logger.info("Processing information query...")
            reply = generate_information_response(message, query_context, relevant_knowledge)
            model_used = "information_intelligence"
        
        # Layer 9: Universal Query Handler (catches everything else)
        elif intent == "universal_query":
            logger.info("Using universal query handler...")
            reply = generate_universal_response(message, query_context, relevant_knowledge)
            model_used = "universal_intelligence"
        
        # Layer 10: Final intelligent fallback
        if not reply:
            logger.info("Using intelligent universal fallback...")
            reply = generate_intelligent_universal_fallback(message, intent, query_context)
            model_used = "universal_fallback"
        
        # Layer 11: Emergency universal response (ensures we ALWAYS respond)
        if not reply or len(reply.strip()) < 50:
            logger.info("Using emergency universal response...")
            reply = generate_universal_response(message, query_context, relevant_knowledge)
            model_used = "emergency_universal"
            confidence = max(confidence, 0.7)  # Boost confidence for universal responses
        
        # Layer 12: Absolute fallback (should never reach here)
        if not reply:
            reply = """🤖 **I'm your CareerGenAI assistant!**

I can help you with:
🎯 **Career Assessment** - Find your perfect career match
📄 **Resume Builder** - Create professional resumes  
🏛️ **College Search** - Find top institutions
👨‍💼 **Expert Counselling** - Get personalized guidance

**📞 Direct Support:** +91 8657869659 | +91 9619901999

What would you like to explore?"""
            model_used = "absolute_fallback"

        response_data = {
            "reply": reply,
            "confidence": confidence,
            "intent": intent,
            "suggestions": generate_suggestions(intent),
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "model_used": model_used,
                "user_id": chat_message.user_id,
                "cache_hit": False
            }
        }
        
        # Cache common service and website queries for better performance
        if cache_enabled and intent in ["specific_service", "services_inquiry", "pricing_inquiry", "contact_inquiry", "greeting"]:
            response_cache[cache_key] = response_data.copy()
            # Limit cache size to prevent memory issues
            if len(response_cache) > 100:
                # Remove oldest entries
                oldest_keys = list(response_cache.keys())[:20]
                for key in oldest_keys:
                    del response_cache[key]
        
        return ChatResponse(**response_data)
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}", exc_info=True)
        return ChatResponse(
            reply="I'm experiencing some technical difficulties. Could you please rephrase your question or ask about our services?",
            confidence=0.1, intent="error_fallback",
            suggestions=["What services do you offer?", "Show pricing", "Contact support"]
        )

# Production-optimized endpoints
@app.get("/")
async def root():
    """Production root endpoint"""
    return {
        "message": "CareerGenAI Production Chatbot API",
        "status": "healthy",
        "version": "4.0.0",
        "services_supported": len(SERVICE_MAPPINGS),
        "cache_enabled": cache_enabled,
        "endpoints": {
            "chat": "/chat",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Production health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "4.0.0",
        "service": "CareerGenAI Production Chatbot",
        "performance": {
            "cache_enabled": cache_enabled,
            "cache_size": len(response_cache),
            "services_supported": len(SERVICE_MAPPINGS)
        },
        "features": {
            "intent_classification": "optimized",
            "service_detection": "active",
            "response_caching": "enabled",
            "fallback_handling": "robust"
        }
    }

@app.get("/models")
async def model_status():
    return {"ai_models_loaded": list(ai_models.keys()), "ai_status": "cognitive_enabled" if ai_models else "legacy_mode"}


if __name__ == "__main__":
    print("=" * 70)
    print("🚀 CareerGenAI Production Chatbot Server v4.0.0")
    print("=" * 70)
    print(f"🎯 Services Supported: {len(SERVICE_MAPPINGS)}")
    print(f"⚡ Performance Optimizations: Enabled")
    print(f"💾 Response Caching: {'Enabled' if cache_enabled else 'Disabled'}")
    print(f"🔗 API Documentation: https://careergen.onrender.com/docs")
    print(f"💡 Chat Endpoint: https://careergen.onrender.com/chat")
    print(f"🏥 Health Check: https://careergen.onrender.com/health")
    print("=" * 70)
    print("🎉 Ready for Production Deployment!")
    print("=" * 70)
    
    # Production-optimized server configuration
    uvicorn.run(
        "chatbot:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=False,  # Disable reload for production
        workers=1,     # Single worker for now, can be increased
        log_level="info"
    )