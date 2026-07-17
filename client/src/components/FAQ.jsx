import React from 'react'

const faqs = [
  {
    question: 'How does the MindScape AI support system work?',
    answer:
      'Our AI analyzes your emotional patterns and provides real-time coping strategies, mindfulness exercises, and data-driven insights to help manage your mental well-being 24/7.',
  },
  {
    question: 'Is my data private and encrypted?',
    answer:
      'Absolutely. We use enterprise-grade end-to-end encryption. Your personal data is never shared with third parties, and even our AI interactions are processed with strict privacy-preserving protocols.',
  },
  {
    question: 'Can I connect with human professionals as well?',
    answer:
      'Yes. Mindscape Helper bridges the gap between AI support and human expertise. You can easily transition to sessions with licensed psychologists and therapists integrated within our platform.',
  },
  {
    question: 'Is MindScape Helper available on mobile?',
    answer:
      'Yes, the platform is fully responsive and offers a seamless experience across all your devices, including smartphones, tablets, and desktops.',
  },
]

const FAQ = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24 transition-colors duration-300">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Common <span className="text-red-600 dark:text-red-500">Inquiries</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Everything you need to know about our AI-powered mental wellness ecosystem.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((item) => (
          <details
            key={item.question}
            className="group rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50 p-6 shadow-xl open:shadow-red-500/5 transition-all duration-300"
          >
            <summary className="cursor-pointer list-none font-bold text-lg text-gray-900 dark:text-white flex items-center justify-between">
              <span>{item.question}</span>
              <span className="text-2xl leading-none text-red-600 dark:text-red-500 group-open:rotate-45 transition-transform duration-300">
                +
              </span>
            </summary>
            <div className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-lg border-t dark:border-gray-700 pt-4">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FAQ

