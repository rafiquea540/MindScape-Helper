import {
  AlarmClock,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  HelpCircle,
  MessageCircle,
  Phone,
  PhoneCall,
  Shield,
  UserCheck,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import Navbar from '../components/Navbar'

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='relative'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'
          >
            <X className='w-6 h-6' />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

// Main Component
const EmergencyArsenal = () => {
  const [selectedCrisis, setSelectedCrisis] = useState(null)
  const [showEmergencyPlan, setShowEmergencyPlan] = useState(false)

  // Crisis Types Data
  const crisisTypes = [
    {
      id: 1,
      type: 'Panic Attack',
      symptoms: [
        'Rapid heartbeat',
        'Difficulty breathing',
        'Feeling of losing control',
      ],
      immediateSteps: [
        'Start guided breathing',
        'Ground yourself',
        'Contact support',
      ],
      detailedPlan: [
        {
          title: '1. Breathing Exercise',
          description:
            'Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5 times.',
          icon: Clock,
        },
        {
          title: '2. Grounding Technique',
          description:
            'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
          icon: Shield,
        },
        {
          title: '3. Seek Support',
          description:
            'Contact your designated support person or crisis hotline.',
          icon: Phone,
        },
      ],
      icon: AlertCircle,
    },
    {
      id: 2,
      type: 'Suicidal Thoughts',
      urgent: true,
      symptoms: ['Feeling hopeless', 'Thoughts of self-harm', 'Isolation'],
      immediateSteps: [
        'Call crisis hotline',
        'Contact trusted person',
        'Stay in safe environment',
      ],
      detailedPlan: [
        {
          title: '1. Ensure Immediate Safety',
          description:
            'Remove yourself from any dangerous situations or items.',
          icon: Shield,
        },
        {
          title: '2. Call for Help',
          description:
            'Contact the National Suicide Prevention Lifeline at +92 313 7821430.',
          icon: Phone,
        },
        {
          title: '3. Connect with Support',
          description:
            'Reach out to a trusted friend, family member, or counselor.',
          icon: UserCheck,
        },
      ],
      icon: AlertTriangle,
    },
    {
      id: 3,
      type: 'Severe Anxiety',
      symptoms: ['Overwhelming worry', 'Physical tension', 'Racing thoughts'],
      immediateSteps: [
        'Use calming techniques',
        'Progressive relaxation',
        'Reach out for help',
      ],
      detailedPlan: [
        {
          title: '1. Calming Exercise',
          description:
            'Focus on progressive muscle relaxation, starting from toes to head.',
          icon: Heart,
        },
        {
          title: '2. Mindful Breathing',
          description:
            'Practice deep, slow breathing while focusing on the present moment.',
          icon: Clock,
        },
        {
          title: '3. Get Support',
          description:
            'Contact your therapist or support network for guidance.',
          icon: Phone,
        },
      ],
      icon: AlarmClock,
    },
  ]

  // Emergency Contacts Data
  const emergencyContacts = [
    {
      id: 1,
      name: '24/7 Crisis Hotline',
      number: '+92 313 7821430',
      available: 'Always Available',
      icon: Phone,
    },
    {
      id: 2,
      name: 'Chat Support',
      service: 'Instant Message Support',
      available: '24/7 Response',
      icon: MessageCircle,
    },
    {
      id: 3,
      name: 'Emergency Services',
      number: '911',
      available: 'Emergency Only',
      icon: AlertTriangle,
    },
  ]

  // Safety Plan Data
  const safetyPlanSections = [
    {
      title: 'Warning Signs',
      items: [
        'Increased anxiety or restlessness',
        'Changes in sleep patterns',
        'Withdrawal from social activities',
        'Difficulty concentrating',
      ],
      icon: AlertTriangle,
    },
    {
      title: 'Coping Strategies',
      items: [
        'Deep breathing exercises',
        'Progressive muscle relaxation',
        'Mindfulness meditation',
        'Physical exercise',
      ],
      icon: Heart,
    },
    {
      title: 'Social Support',
      items: [
        'Family members (speed dial 2)',
        'Close friends (speed dial 3)',
        'Mental health professional',
        'Support group members',
      ],
      icon: UserCheck,
    },
    {
      title: 'Professional Contacts',
      items: [
        'Therapist: (555) 123-4567',
        'Psychiatrist: (555) 234-5678',
        'Local Crisis Center: (555) 345-6789',
        'Emergency: 911',
      ],
      icon: Phone,
    },
  ]

  return (
    <>
      <Navbar />
      <div className='mt-10 min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 lg:p-8'>
        {/* Crisis Banner */}
        <div className='bg-red-100 border-l-4 border-red-500 p-4 mb-8'>
          <div className='flex items-center'>
            <AlertTriangle className='h-6 w-6 text-red-500 mr-4' />
            <div>
              <h2 className='text-lg font-semibold text-red-700'>
                Need Immediate Help?
              </h2>
              <p className='text-red-600'>
                Call{' '}
                <a href='tel:911' className='font-bold underline'>
                  911
                </a>{' '}
                or{' '}
                <a href='tel:+92 313 7821430' className='font-bold underline'>
                  +92 313 7821430
                </a>{' '}
                (National Crisis Hotline)
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Recognition Section */}
        <div className='max-w-7xl mx-auto mb-12'>
          <div className='flex items-center mb-6'>
            <HelpCircle className='w-6 h-6 text-green-600 mr-2' />
            <h2 className='text-2xl font-bold text-green-800'>
              Crisis Recognition
            </h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {crisisTypes.map((crisis) => (
              <div
                key={crisis.id}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  crisis.urgent ? 'border-2 border-red-500' : ''
                }`}
              >
                <div className='flex items-center mb-4'>
                  <crisis.icon className='w-6 h-6 text-green-600 mr-2' />
                  <h3 className='text-xl font-semibold text-green-800'>
                    {crisis.type}
                  </h3>
                </div>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium text-green-700 mb-2'>
                      Common Signs:
                    </h4>
                    <ul className='list-disc list-inside text-green-600'>
                      {crisis.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => setSelectedCrisis(crisis)}
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300'
                  >
                    View Action Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Response Planning */}
        <div className='max-w-7xl mx-auto mb-12'>
          <div className='flex items-center mb-6'>
            <ClipboardList className='w-6 h-6 text-green-600 mr-2' />
            <h2 className='text-2xl font-bold text-green-800'>
              Emergency Response Plan
            </h2>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-xl font-semibold text-green-800 mb-4'>
                  Your Safety Plan
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center'>
                    <Shield className='w-5 h-5 text-green-600 mr-2' />
                    <span className='text-green-700'>
                      Personalized coping strategies
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <UserCheck className='w-5 h-5 text-green-600 mr-2' />
                    <span className='text-green-700'>
                      Trusted contacts list
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <Heart className='w-5 h-5 text-green-600 mr-2' />
                    <span className='text-green-700'>
                      Safe places and resources
                    </span>
                  </div>
                  <button
                    onClick={() => setShowEmergencyPlan(true)}
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300'
                  >
                    Access Safety Plan
                  </button>
                </div>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-green-800 mb-4'>
                  Emergency Contacts
                </h3>
                <div className='space-y-4'>
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className='flex items-center justify-between bg-green-50 p-3 rounded-lg'
                    >
                      <div className='flex items-center'>
                        <contact.icon className='w-5 h-5 text-green-600 mr-2' />
                        <div>
                          <h4 className='font-medium text-green-800'>
                            {contact.name}
                          </h4>
                          <p className='text-sm text-green-600'>
                            {contact.available}
                          </p>
                        </div>
                      </div>
                      {contact.number && (
                        <a
                          href={`tel:${contact.number}`}
                          className='bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded transition duration-300'
                        >
                          Call
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Hotline Integration */}
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center mb-6'>
            <PhoneCall className='w-6 h-6 text-green-600 mr-2' />
            <h2 className='text-2xl font-bold text-green-800'>
              24/7 Crisis Support
            </h2>
          </div>
          <div className='bg-green-600 rounded-xl shadow-lg p-6 text-white'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <Clock className='w-12 h-12 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>Always Available</h3>
                <p>Round-the-clock support when you need it most</p>
              </div>
              <div className='text-center'>
                <FileText className='w-12 h-12 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>Expert Support</h3>
                <p>Trained professionals ready to help</p>
              </div>
              <div className='text-center'>
                <Shield className='w-12 h-12 mx-auto mb-4' />
                <h3 className='text-xl font-semibold mb-2'>Confidential</h3>
                <p>Private and secure support services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Plan Modal */}
        <Modal
          isOpen={selectedCrisis !== null}
          onClose={() => setSelectedCrisis(null)}
        >
          {selectedCrisis && (
            <div className='p-6'>
              <div className='flex items-center mb-6'>
                <selectedCrisis.icon className='w-8 h-8 text-green-600 mr-3' />
                <h2 className='text-2xl font-bold text-green-800'>
                  Action Plan: {selectedCrisis.type}
                </h2>
              </div>

              <div className='space-y-6'>
                {selectedCrisis.detailedPlan.map((step, index) => (
                  <div key={index} className='bg-green-50 rounded-lg p-4'>
                    <div className='flex items-start'>
                      <step.icon className='w-6 h-6 text-green-600 mr-3 mt-1' />
                      <div>
                        <h3 className='font-semibold text-green-800 mb-2'>
                          {step.title}
                        </h3>
                        <p className='text-green-700'>{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 p-4 bg-green-100 rounded-lg'>
                <h3 className='font-semibold text-green-800 mb-2'>Remember:</h3>
                <p className='text-green-700'>
                  If you're in immediate danger or having thoughts of self-harm,
                  call emergency services immediately at 911 or the crisis
                  hotline at +92 313 7821430.
                </p>
              </div>

              <button
                onClick={() => setSelectedCrisis(null)}
                className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300'
              >
                Close Action Plan
              </button>
            </div>
          )}
        </Modal>

        {/* Safety Plan Modal */}
        <Modal
          isOpen={showEmergencyPlan}
          onClose={() => setShowEmergencyPlan(false)}
        >
          <div className='p-6'>
            <h2 className='text-2xl font-bold text-green-800 mb-6 pr-8'>
              Your Personal Safety Plan
            </h2>

            <div className='space-y-6'>
              {safetyPlanSections.map((section, index) => (
                <div key={index} className='bg-green-50 rounded-lg p-4'>
                  <div className='flex items-center mb-3'>
                    <section.icon className='w-6 h-6 text-green-600 mr-2' />
                    <h3 className='font-semibold text-green-800'>
                      {section.title}
                    </h3>
                  </div>
                  <ul className='space-y-2'>
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className='flex items-center text-green-700'
                      >
                        <CheckCircle className='w-4 h-4 text-green-600 mr-2' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className='mt-6 bg-green-100 rounded-lg p-4'>
              <h3 className='font-semibold text-green-800 mb-2'>
                Important Reminder:
              </h3>
              <p className='text-green-700'>
                Keep this safety plan easily accessible. Share it with your
                trusted contacts and update it regularly with your mental health
                professional.
              </p>
            </div>

            <button
              onClick={() => setShowEmergencyPlan(false)}
              className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300'
            >
              Close Safety Plan
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default EmergencyArsenal
