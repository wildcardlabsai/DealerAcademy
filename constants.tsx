
import { Module, Template } from './types';

export const EXPERT_DATA = {
  name: 'Matt Taylor',
  marketingYears: 19,
  automotiveYears: 12,
  roles: ['Sales', 'Sales & Marketing Manager', 'Business Manager'],
  quote: "There's marketing, and then there's car dealership marketing. They are vastly different. I understand dealerships inside out because I've done the jobs. This isn't theory from someone with no forecourt experience.",
  // To add your photo, replace this URL with your image path (e.g., './assets/matt.jpg' or a hosted URL)
  imageUrl: 'https://i.postimg.cc/zXpdh1mZ/IMG-7793.png', 
};

export const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Dealer Positioning & Trust',
    description: 'Why customers don\'t trust dealers and how to fix your brand without a rebrand.',
    lessons: [
      {
        id: 'l1',
        title: 'The Trust Deficit: Why They Don\'t Buy',
        slug: 'trust-deficit',
        content: 'Understand the psychological barriers car buyers face and why transparency is your greatest sales tool. We explore the "Second Hand Car Salesman" stigma and how to actively combat it on your website.',
        isFree: true,
        actionSteps: ['Audit your homepage for trust signals', 'Check your Google reviews for negative patterns', 'Add an "Our History" section to your site']
      },
      {
        id: 'l2',
        title: 'Specialist vs Generalist',
        slug: 'positioning-strategy',
        content: 'How being a specialist in a niche helps you command higher margins. If you sell everything, you sell nothing to nobody. Find your niche.',
        isFree: false,
        actionSteps: ['Identify your top-selling category', 'Write a 1-sentence niche statement', 'Remove stock that doesn\'t fit your new focus']
      }
    ]
  },
  {
    id: 'm2',
    title: 'Stock-Led Marketing Strategy',
    description: 'Marketing the right stock at the right time to maintain velocity.',
    lessons: [
      {
        id: 'l3',
        title: 'Margin vs Velocity',
        slug: 'margin-velocity',
        content: 'Learn when to hold for profit and when to drop for cashflow. A car on the forecourt for 90 days is a liability, not an asset.',
        isFree: true,
        actionSteps: ['Identify aged stock (60+ days)', 'Calculate your cost-to-stand', 'Plan a price-drop sequence']
      }
    ]
  },
  {
    id: 'm3',
    title: 'Social Media Systems',
    description: 'Automating and systemising your social presence.',
    lessons: [
      {
        id: 'l4',
        title: 'The Weekly Content Framework',
        slug: 'weekly-framework',
        content: 'A simple 5-day posting schedule that takes 15 minutes a day. Cover Stock, Behind the Scenes, and Customer Success.',
        isFree: false,
        actionSteps: ['Set up a Meta Business Suite account', 'Draft 3 posts using the Stock Template', 'Schedule 1 week of content']
      }
    ]
  },
  {
    id: 'm4',
    title: 'Short-Form Video',
    description: 'Walkarounds and confidence on camera.',
    lessons: [
      {
        id: 'l5',
        title: 'The Perfect Walkaround Script',
        slug: 'walkaround-script',
        content: 'The 4-part script: Hook, The Highlights, The Trust Factor, The CTA.',
        isFree: false,
        actionSteps: ['Record a 60-second video of your best car', 'Post to Instagram Reels/TikTok']
      }
    ]
  },
  {
    id: 'm5',
    title: 'Paid Advertising (Plain English)',
    description: '£5–£20/day logic that actually sells cars.',
    lessons: [
      {
        id: 'l6',
        title: 'Boosts vs Ads Manager',
        slug: 'ads-manager-basics',
        content: 'Why clicking "Boost Post" is usually lighting money on fire. How to target local buyers efficiently.',
        isFree: false,
        actionSteps: ['Set up a Facebook Pixel', 'Create a 10-mile radius targeting group']
      }
    ]
  },
  {
    id: 'm6',
    title: 'Lead Handling & Conversion',
    description: 'Speed to lead and first-message psychology.',
    lessons: [
      {
        id: 'l7',
        title: 'Handling "Best Price?"',
        slug: 'best-price-reply',
        content: 'Don\'t ignore the "Best Price" tyre kickers. Use the "Value Bridge" response to get them on the phone.',
        isFree: false,
        actionSteps: ['Save the "Best Price" script to your phone notes', 'Audit lead response times']
      }
    ]
  },
  {
    id: 'm7',
    title: 'AI for Car Dealers',
    description: 'Save hours on descriptions and replies.',
    lessons: [
      {
        id: 'l8',
        title: 'AI Car Description Genius',
        slug: 'ai-descriptions',
        content: 'Use ChatGPT to write better, more emotional descriptions than any human. Focus on the benefits, not just the spec list.',
        isFree: false,
        actionSteps: ['Run your best car through the provided AI Prompt', 'Update 5 listings with AI copy']
      }
    ]
  },
  {
    id: 'm8',
    title: 'Reviews & Reputation',
    description: 'Turning reviews into marketing assets.',
    lessons: [
      {
        id: 'l9',
        title: 'The Review Request Timing',
        slug: 'review-timing',
        content: 'When to ask for a review for maximum success. Hint: It\'s not when they get home.',
        isFree: false,
        actionSteps: ['Create a Google Review QR code for your desk', 'Train staff on the "Soft Ask"']
      }
    ]
  },
  {
    id: 'm9',
    title: 'Websites & Listings That Convert',
    description: 'Optimising your 24/7 digital salesperson.',
    lessons: [
      {
        id: 'l10',
        title: 'The Listing Trust Stack',
        slug: 'listing-trust',
        content: 'What every individual listing needs to show to prove the car is real and the dealer is honest.',
        isFree: false,
        actionSteps: ['Add HPI clear badges to all photos', 'Check mobile load speed']
      }
    ]
  },
  {
    id: 'm10',
    title: 'Automation & Scalable Growth',
    description: 'Simple systems to scale without more staff.',
    lessons: [
      {
        id: 'l11',
        title: 'Missed Lead Recovery',
        slug: 'missed-lead-automation',
        content: 'How to automate a text message reply to missed calls or out-of-hours leads.',
        isFree: false,
        actionSteps: ['Map out your lead flow on paper', 'Look at Zapier for simple SMS alerts']
      }
    ]
  }
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: 't1',
    title: 'The "Just In" Facebook Template',
    category: 'Facebook',
    content: '🚨 JUST IN: {Year} {Make} {Model}\n\nThis one won\'t last long. {Key Feature 1} and {Key Feature 2}.\n\n✅ Fully Inspected\n✅ 3 Months Warranty\n✅ HPI Clear\n\nClick here for more photos: {Link}',
    isPaidOnly: false
  },
  {
    id: 't2',
    title: 'WhatsApp Follow-up (No Reply)',
    category: 'WhatsApp',
    content: 'Hi {Name}, just checking you got the video I sent over of the {Car}? Let me know if you have any questions or want to see anything else specifically!',
    isPaidOnly: true
  },
  {
    id: 't3',
    title: 'AI Prompt: Car Description Genius',
    category: 'AI Prompts',
    content: 'Act as a professional car copywriter. Write a 200-word description for a {Car} emphasizing trust, local service, and its {Main Feature}. Use UK spelling and a professional but friendly tone.',
    isPaidOnly: true
  },
  {
    id: 't4',
    title: 'Review Request Script',
    category: 'Reviews',
    content: 'Hi {Name}, it was great meeting you today! Glad you\'re happy with the {Car}. If you could spare 30 seconds to leave us a quick Google review, it really helps our small business: {Link}',
    isPaidOnly: false
  },
  {
    id: 't5',
    title: 'Facebook Marketplace Hook',
    category: 'Facebook',
    content: 'Looking for a reliable {Make}? This {Model} is arguably the best value in {Area} right now. Finance available, trade-ins welcome. Message for a walkaround video!',
    isPaidOnly: true
  }
];
