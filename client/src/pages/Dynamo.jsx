import { GoogleGenerativeAI } from '@google/generative-ai'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'

const genAI = new GoogleGenerativeAI('AIzaSyBmvPatGPV6MeO2j6obla-xUlBVNH9X7W8')

const MENTAL_HEALTH_KEYWORDS = [
  // Emotions & Feelings
  'anxiety',
  'depression',
  'stress',
  'mood',
  'emotion',
  'feeling',
  'worry',
  'fear',
  'sadness',
  'anger',
  'happiness',
  'loneliness',
  'grief',
  'guilt',
  'shame',
  'joy',
  'frustration',
  'overwhelm',
  'hope',
  'despair',
  'empathy',
  'apathy',
  'compassion',
  'confidence',
  'trust',
  'vulnerability',
  'love',
  'optimism',
  'regret',
  'envy',
  'contentment',

  // Mental Health Terms
  'therapy',
  'counseling',
  'mental health',
  'psychological',
  'psychiatry',
  'diagnosis',
  'treatment',
  'recovery',
  'intervention',
  'mental illness',
  'disorder',
  'condition',
  'psychotherapy',
  'emotional health',
  'behavioral health',
  'psychoeducation',
  'neurodiversity',
  'cognitive health',
  'emotional regulation',

  // Wellbeing
  'self-care',
  'mindfulness',
  'meditation',
  'wellness',
  'healing',
  'growth',
  'resilience',
  'coping',
  'support',
  'balance',
  'peace',
  'calm',
  'relaxation',
  'positivity',
  'self-awareness',
  'gratitude',
  'self-acceptance',
  'harmony',
  'grounding',
  'introspection',
  'spiritual health',
  'mental clarity',
  'journaling',
  'breathing exercises',
  'body scan',

  // Specific Conditions
  'ptsd',
  'trauma',
  'ocd',
  'bipolar',
  'adhd',
  'addiction',
  'eating disorder',
  'panic attack',
  'phobia',
  'insomnia',
  'anxiety attack',
  'burnout',
  'schizophrenia',
  'autism',
  'dissociation',
  'personality disorder',
  'social anxiety',
  'generalized anxiety',
  'postpartum depression',
  'seasonal affective disorder',
  'compulsive behavior',
  'intrusive thoughts',

  // Relationships & Support
  'relationship',
  'family',
  'friend',
  'support system',
  'boundaries',
  'communication',
  'social',
  'isolation',
  'connection',
  'community',
  'therapy group',
  'trust issues',
  'co-dependency',
  'attachment',
  'caregiver',
  'mentorship',
  'allyship',
  'peer support',
  'collaboration',

  // Life Challenges
  'crisis',
  'suicide',
  'self-harm',
  'abuse',
  'conflict',
  'stress management',
  'work stress',
  'life changes',
  'adjustment',
  'transition',
  'loss',
  'financial stress',
  'bullying',
  'discrimination',
  'traumatic event',
  'chronic illness',
  'disability',
  'unemployment',
  'grief counseling',
  'divorce',
  'loneliness',
  'identity crisis',
  'existential dread',

  // Therapy & Tools
  'cognitive behavioral therapy',
  'cbt',
  'dialectical behavior therapy',
  'dbt',
  'exposure therapy',
  'art therapy',
  'music therapy',
  'group therapy',
  'teletherapy',
  'self-help',
  'psychodynamic therapy',
  'emdr',
  'hypnotherapy',
  'positive psychology',
  'coping mechanisms',
  'emotional intelligence',
  'psychoanalysis',
  'behavioral therapy',
  'journaling techniques',
  'goal setting',
]

const CONTEXT_PROMPT = `You are a supportive AI companion focused on mental health. Provide brief, 
concise responses (2-3 sentences maximum) focused on emotional support and practical suggestions. 
For serious issues, encourage professional help. Question: `

const MentalHealthChat = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isRelatedToMentalHealth = (text) => {
    const lowercaseText = text.toLowerCase()
    return MENTAL_HEALTH_KEYWORDS.some((keyword) =>
      lowercaseText.includes(keyword)
    )
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const trimmedMessage = inputMessage.trim()

    if (trimmedMessage === '') return

    if (!isRelatedToMentalHealth(trimmedMessage)) {
      setErrorMessage(
        'Please ask questions related to mental health and emotional well-being.'
      )
      setTimeout(() => setErrorMessage(''), 5000)
      return
    }

    setMessages((prev) => [...prev, { type: 'user', content: trimmedMessage }])
    setInputMessage('')
    setIsLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(
        CONTEXT_PROMPT + trimmedMessage
      )
      const response = await result.response
      const text = response.text()
      setMessages((prev) => [...prev, { type: 'bot', content: text }])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content:
            "I'm having trouble responding. Please try again or reach out to a mental health professional if needed.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className='mt-12 flex h-screen bg-gradient-to-br from-green-50 to-green-100'>
        {/* Sidebar */}
        <div className='w-1/4 bg-white p-6 shadow-lg'>
          <div className='flex items-center space-x-2 mb-8'>
            <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-xl'>🫂</span>
            </div>
            <h1 className='text-2xl font-bold text-green-800'>MindScape AI</h1>
          </div>

          <div className='space-y-6'>
            <div className='bg-green-50 rounded-lg p-4'>
              <h2 className='font-semibold text-green-800 mb-2'>About</h2>
              <p className='text-green-700 text-sm'>
                Here to support your mental well-being with brief, practical
                guidance.
              </p>
            </div>

            <div className='bg-green-50 rounded-lg p-4'>
              <h2 className='font-semibold text-green-800 mb-2'>
                We can discuss:
              </h2>
              <ul className='text-green-700 text-sm space-y-2'>
                <li>• Mental wellness</li>
                <li>• Emotional support</li>
                <li>• Stress management</li>
                <li>• Coping strategies</li>
                <li>• Self-care practices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col'>
          <div className='bg-white p-4 shadow-md'>
            <h2 className='text-xl font-semibold text-green-800'>
              Chat with MindScape
            </h2>
          </div>

          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-2xl p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-white text-gray-800 p-3 rounded-lg shadow-md flex items-center'>
                  <Loader2 className='animate-spin mr-2' size={20} />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {errorMessage && (
            <div className='mx-4 mb-2'>
              <div className='bg-red-50 text-red-700 p-3 rounded-lg text-sm'>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className='bg-white p-4 shadow-lg'>
            <div className='flex space-x-3'>
              <input
                type='text'
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder='Share your thoughts...'
                className='flex-1 p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent'
              />
              <button
                type='submit'
                className='bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-3 transition-colors duration-300 flex items-center justify-center min-w-[100px]'
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='animate-spin' size={20} />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default MentalHealthChat
