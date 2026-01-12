import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from './components/footer';

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What materials are used in your crochet products?",
      answer: "We care deeply about quality and sustainability. We primarily use high-quality organic cotton for wearables to ensure breathability, and premium acrylic blends for plushies to ensure durability and ease of washing. Specific material details are listed on every product page."
    },
    {
      question: "Do you offer custom crochet orders?",
      answer: "Yes, we love bringing your ideas to life! Whether it's a specific color palette for a blanket or a custom plushie character, we accept a limited number of custom commissions each month. Please use our Contact page to inquire."
    },
    {
      question: "What is your return policy?",
      answer: "We want you to love your handmade item. We offer a 30-day return policy on non-custom items. Products must be in their original, unused condition. Please note that custom/personalized orders are final sale unless there is a defect."
    },
    {
      question: "How long does shipping take?",
      answer: "Since many of our items are made to order, please allow 3-5 days for production. Once shipped, domestic delivery typically takes 5-7 business days. You will receive a tracking number as soon as your package is on its way."
    },
    {
      question: "How do I care for my crochet items?",
      answer: "To keep your items looking their best, we recommend hand washing in cold water with mild detergent and laying them flat to dry. Avoid wringing or twisting the fabric to maintain its shape."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-800 font-sans">
      <main className="flex-grow">
        
        <div className="bg-white py-16 border-b border-stone-200">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-500 max-w-2xl mx-auto">
              Got a question? We're here to help. If you don't see your answer here, feel free to reach out to our team.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className={`border border-stone-200 rounded-xl bg-white overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg ring-1 ring-orange-100' : 'shadow-sm hover:shadow-md'}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`text-lg font-serif font-bold transition-colors ${openIndex === index ? 'text-orange-600' : 'text-stone-800'}`}>
                    {item.question}
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-6 w-6 text-orange-500 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-50">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 py-16 text-center">
           <div className="container mx-auto px-4">
             <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">Still have questions?</h3>
             <p className="text-stone-600 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
             <Link 
               to="/contact" 
               className="inline-block bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg"
             >
               Get in Touch
             </Link>
           </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default Faq;