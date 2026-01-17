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
      answer: "We care deeply about quality and sustainability. We primarily use high-quality organic cotton for wearables to ensure breathability, and premium acrylic blends for plushies to ensure durability and ease of washing."
    },
    {
      question: "Do you offer custom crochet orders?",
      answer: "Yes, we love bringing your ideas to life! Whether it's a specific color palette or a custom keychain. Feel free to reach out to us with your ideas by messaging us on +919850881616."
    },
    {
      question: "What is your return policy?",
      answer: "There is no return policy. If it is being delivered by us we will take utmost care of it. If it is delivered by uber or being picked up we have no control over it once it leaves our hands."
    },
    {
      question: "How long does shipping take?",
      answer: "Please allow 3-5 days for production. Once shipped, delivery typically takes 2-3 business days. You will be updated by the updates on the Orders page."
    },
    {
      question: "When is delivery free?",
      answer: "Delivery is free for all orders which are in a range of 5km from our workshop. You can check the distance between the workshop and your address on the checkout page."
    },
    {
      question: "What will happen if I enter the wrong transaction Id?",
      answer: "To keep things simple, we will not be able to verify your order and it will be cancelled. You can place a new order with the correct transaction Id."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team by messaging us on the number +919850881616. We aim to respond within 24-48 hours."
    },
    {
      question: "How will I know the status of my order?",
      answer: "You will receive updates on your order status on the Orders page."
    },
    {
      question: "How will I get my order if I live far away?",
      answer: "We deliver to all locations within a 5km radius of our workshop. For orders beyond this range, we will contact you via whatsapp. You will have to pick it up from our workshop or get it delivered via a courier service at an additional cost."
    }
  ];

  return (
    <>
    <title>FAQ</title>
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

        {/* <div className="bg-orange-50 py-16 text-center">
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
        </div> */}

      </main>
      <Footer />
    </div>
    </>
  );
}

export default Faq;