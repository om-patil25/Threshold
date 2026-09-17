import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from '../shared/Card';
import { ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { MOCK_USER, MOCK_LINKS, MOCK_SHOWCASE, MOCK_UPDATES } from '../../data/mockData';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-brand-primary/10 last:border-0">
      <button 
        className="w-full flex items-center justify-between py-4 text-left font-bold text-brand-primary hover:text-brand-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp size={18} className="text-brand-primary/50" /> : <ChevronDown size={18} className="text-brand-primary/50" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-text-primary/70 text-sm">{answer}</p>
      </div>
    </div>
  );
};

export const HelpAndSupport = () => {
  const EditorContent = (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-8">
      <div className="flex items-center gap-3 border-b border-brand-primary/10 pb-6">
        <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
          <LifeBuoy size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">Help & Support</h1>
          <p className="text-text-primary/60 text-sm">Learn how to make the most of your profile.</p>
        </div>
      </div>

      {/* Video Section */}
      <Card className="p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-brand-primary mb-4">Getting Started</h2>
        <div className="aspect-video w-full bg-brand-primary/5 rounded-lg border border-brand-primary/10 overflow-hidden relative">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=abcdefghijklmnop&controls=1" 
            title="Getting Started Tutorial" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      </Card>

      {/* FAQs */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-brand-primary mb-2">Frequently Asked Questions</h2>
        <div className="flex flex-col">
          <FAQItem 
            question="How do I change my theme colors?"
            answer='Head over to Settings from your Dashboard sidebar, under "Appearance," and pick any of our handcrafted color themes. Changes apply instantly and are visible on your public profile right away.'
          />
          <FAQItem 
            question="What's the difference between Links and Featured Work?"
            answer="Links are simple buttons that send visitors to external sites — your Instagram, GitHub, booking page, anything. Featured Work is for showcasing your actual projects, certifications, achievements, or documents, with a preview image and description — built to stand out more than a plain link."
          />
          <FAQItem 
            question="How long do Updates stay on my profile?"
            answer="Updates automatically disappear after 15 days — think of it as a rolling feed of what's current, not a permanent post. If you want something to stay up long-term, add it as Featured Work instead."
          />
          <FAQItem 
            question="Is Threshold free?"
            answer="Yes, Threshold is completely free to use."
          />
          <FAQItem 
            question="What happens if I don't fill in a section — like Links or Featured Work?"
            answer="Nothing shows up for that section on your public profile. Threshold only displays sections you've actually used, so your page stays clean whether you're using it as a portfolio, a link hub, or both."
          />
        </div>
      </Card>
      
      <div className="text-center mt-4">
        <p className="text-sm text-text-primary/60">Still need help? Reach out to us at <a href="mailto:support@threshold.me" className="text-brand-accent font-bold hover:underline">support@threshold.me</a></p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {EditorContent}
    </DashboardLayout>
  );
};
