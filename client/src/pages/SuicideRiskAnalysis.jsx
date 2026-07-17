import nlp from 'compromise'
import Navbar from '../components/Navbar'

import { Activity, AlertTriangle, Brain, FileText, Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from 'recharts'

import jsPDF from 'jspdf'
import 'jspdf-autotable'
// Configure NLP
nlp.extend((Doc, world) => {
  world.addWords({
    depressive: 'Adjective',
    anxious: 'Adjective',
    suicidal: 'Adjective',
    hopeless: 'Adjective',
  })
})

// Helper function to generate score visualization with validation
function generateScoreBar(score) {
  // Ensure score is between 0 and 100
  const validScore = Math.max(0, Math.min(100, Number(score) || 0))
  const fullBlocks = Math.max(0, Math.min(10, Math.round(validScore / 10)))
  const emptyBlocks = Math.max(0, 10 - fullBlocks)

  // Using simple ASCII characters: * for filled and - for empty
  return `[${'*'.repeat(fullBlocks)}${'-'.repeat(emptyBlocks)}]`
}

const generatePDFReport = (analysisData) => {
  if (!analysisData) {
    console.error('No analysis data available')
    return
  }

  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    // Helper function to add page number
    const addPageNumber = (doc) => {
      doc.setFontSize(10)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
        pageWidth - 20,
        pageHeight - 10
      )
    }

    // Company Logo/Header
    doc.setFillColor(0, 150, 136)
    doc.rect(0, 0, pageWidth, 50, 'F')

    // Company Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(32)
    doc.setFont('helvetica', 'bold')
    doc.text('Mindscape', 20, 25)

    // Report Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'normal')
    doc.text('Mental Health Assessment Report', 20, 42)

    // Client Information Section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.text('CONFIDENTIAL', pageWidth - 60, 70)

    doc.setFillColor(220, 220, 220)
    doc.rect(20, 75, pageWidth - 40, 25, 'F')
    doc.setFont('helvetica', 'bold')
    doc.text('Assessment Details:', 25, 85)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Date: ${new Date(analysisData.timestamp).toLocaleDateString()}`,
      25,
      95
    )
    doc.text(
      `Report ID: MS-${Date.now().toString().slice(-6)}`,
      pageWidth - 80,
      95
    )

    // Domain Scores Section
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Domain Analysis', 20, 120)
    doc.line(20, 122, 190, 122)

    const domainData = Object.entries(analysisData.scores).map(
      ([domain, score]) => {
        const numericScore = ((score || 0) * 10).toFixed(1)
        const absoluteScore = Math.abs(Number(numericScore))
        return [
          domain.charAt(0).toUpperCase() + domain.slice(1),
          `${numericScore}%`,
          generateScoreBar(absoluteScore), // Using absolute value for visualization
        ]
      }
    )

    doc.autoTable({
      startY: 130,
      head: [['Domain', 'Score', 'Visual Scale (0-100%)']],
      body: domainData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 150, 136],
        fontSize: 12,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30, halign: 'center' },
        2: {
          cellWidth: 80,
          halign: 'left',
          fontStyle: 'normal',
          font: 'courier', // Using monospace font for better alignment
        },
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [240, 250, 248],
      },
    })

    // Risk Level Section
    const riskY = doc.autoTable.previous.finalY + 20
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Risk Assessment', 20, riskY)
    doc.line(20, riskY + 2, 190, riskY + 2)

    const riskColors = {
      High: [255, 87, 87],
      Moderate: [255, 165, 0],
      Low: [0, 150, 136],
    }

    doc.setFillColor(...(riskColors[analysisData.riskLevel] || riskColors.Low))
    doc.rect(20, riskY + 10, 170, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`Risk Level: ${analysisData.riskLevel}`, 25, riskY + 23)

    // Response Analysis Section
    const textY = riskY + 40
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Response Analysis', 20, textY)
    doc.line(20, textY + 2, 190, textY + 2)

    const textAnalysisData = [
      [
        'Positive Indicators',
        analysisData.textInsights.sentiments.positive || 0,
      ],
      [
        'Negative Indicators',
        analysisData.textInsights.sentiments.negative || 0,
      ],
      ['Anxiety Indicators', analysisData.textInsights.sentiments.anxiety || 0],
      [
        'Depression Indicators',
        analysisData.textInsights.sentiments.depression || 0,
      ],
    ]

    doc.autoTable({
      startY: textY + 10,
      head: [['Indicator Type', 'Frequency']],
      body: textAnalysisData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 150, 136],
        fontSize: 12,
      },
      alternateRowStyles: {
        fillColor: [240, 250, 248],
      },
    })

    // Add recommendations and emergency resources
    doc.addPage()
    addPageNumber(doc)

    // Recommendations Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Recommendations', 20, 20)
    doc.line(20, 22, 190, 22)

    const recommendations = getRiskBasedRecommendations(analysisData.riskLevel)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 25, 35 + index * 10)
    })

    // Emergency Resources Section
    const emergencyY = 35 + recommendations.length * 10 + 20
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Emergency Resources', 20, emergencyY)
    doc.line(20, emergencyY + 2, 190, emergencyY + 2)

    const emergencyContacts = [
      ['Crisis Hotline', '988', '24/7 Support'],
      ['Crisis Text Line', 'Text HOME to 741741', '24/7 Text Support'],
      ['Emergency Services', '911', 'For immediate emergencies'],
      ['Mindscape Support', '1-800-MINDSCAPE', 'Business hours only'],
    ]

    doc.autoTable({
      startY: emergencyY + 10,
      head: [['Service', 'Contact', 'Availability']],
      body: emergencyContacts,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 150, 136],
        fontSize: 12,
      },
      alternateRowStyles: {
        fillColor: [240, 250, 248],
      },
    })

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    const footerText = [
      'CONFIDENTIALITY NOTICE: This report contains sensitive health information protected by law.',
      "This assessment is generated by Mindscape's AI system and should be reviewed by a healthcare professional.",
      'Mindscape © ' + new Date().getFullYear() + ' - All Rights Reserved',
    ]

    footerText.forEach((text, index) => {
      doc.text(text, pageWidth / 2, pageHeight - 25 + index * 5, {
        align: 'center',
      })
    })

    // Save the PDF
    const filename = `mindscape-assessment-${
      new Date().toISOString().split('T')[0]
    }.pdf`
    doc.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Here you could add user-facing error handling
    alert('There was an error generating the PDF report. Please try again.')
  }
}

// Helper function to get risk-based recommendations
function getRiskBasedRecommendations(riskLevel) {
  const recommendations = {
    High: [
      'Immediate consultation with a mental health professional is strongly recommended',
      'Contact emergency services (988) if you experience crisis thoughts',
      'Maintain frequent contact with your support system',
      'Consider temporary schedule adjustments to reduce stress',
      'Schedule an urgent follow-up assessment',
    ],
    Moderate: [
      'Schedule an appointment with a mental health professional',
      'Implement daily stress management techniques',
      'Maintain regular sleep schedule and healthy routines',
      'Stay connected with your support system',
      'Schedule a follow-up assessment within 2 weeks',
    ],
    Low: [
      'Continue current wellness practices',
      'Schedule regular check-ins with mental health professionals',
      'Monitor mood and stress levels using Mindscape tools',
      'Maintain healthy lifestyle habits',
      'Schedule a routine follow-up assessment in 1 month',
    ],
  }

  return recommendations[riskLevel] || recommendations.Low
}

// Assessment sections definition
const assessmentSections = [
  {
    id: 'emotional',
    title: 'Emotional Assessment',
    questions: [
      {
        id: 'currentMood',
        text: 'How would you rate your current mood?',
        type: 'slider',
        min: 0,
        max: 10,
        weight: 3,
      },
      {
        id: 'moodStability',
        text: 'How stable has your mood been over the past week?',
        type: 'scale',
        options: [
          'Very Unstable',
          'Unstable',
          'Somewhat Stable',
          'Stable',
          'Very Stable',
        ],
        weight: 2,
      },
      {
        id: 'anxiety',
        text: 'Rate your anxiety level:',
        type: 'slider',
        min: 0,
        max: 10,
        weight: 2.5,
      },
      {
        id: 'irritability',
        text: 'How irritable have you been feeling?',
        type: 'scale',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
        weight: 2,
      },
      {
        id: 'emotionalRegulation',
        text: 'How well can you manage your emotions?',
        type: 'scale',
        options: ['Very Poorly', 'Poorly', 'Moderately', 'Well', 'Very Well'],
        weight: 2.5,
      },
    ],
  },
  {
    id: 'behavioral',
    title: 'Behavioral Patterns',
    questions: [
      {
        id: 'sleepQuality',
        text: 'How would you rate your sleep quality?',
        type: 'scale',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
        weight: 2,
      },
      {
        id: 'sleepDuration',
        text: 'Average hours of sleep per night:',
        type: 'slider',
        min: 0,
        max: 12,
        weight: 2,
      },
      {
        id: 'activityLevel',
        text: 'How active have you been?',
        type: 'scale',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'],
        weight: 1.5,
      },
      {
        id: 'appetite',
        text: 'How has your appetite been?',
        type: 'scale',
        options: ['Very Poor', 'Poor', 'Normal', 'Increased', 'Excessive'],
        weight: 1.5,
      },
      {
        id: 'dailyTasks',
        text: 'How are you managing daily tasks?',
        type: 'scale',
        options: [
          'Not at all',
          'With great difficulty',
          'With some difficulty',
          'Fairly well',
          'Very well',
        ],
        weight: 2,
      },
    ],
  },
  {
    id: 'cognitive',
    title: 'Cognitive Assessment',
    questions: [
      {
        id: 'thoughtDescription',
        text: 'Describe your thought patterns over the past week:',
        type: 'textarea',
        weight: 3,
        placeholder: 'Please share any recurring thoughts or concerns...',
      },
      {
        id: 'concentration',
        text: 'How is your concentration?',
        type: 'slider',
        min: 0,
        max: 10,
        weight: 2,
      },
      {
        id: 'memory',
        text: 'How would you rate your memory function?',
        type: 'scale',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
        weight: 2,
      },
      {
        id: 'decisionMaking',
        text: 'How difficult is it to make decisions?',
        type: 'scale',
        options: [
          'Extremely Difficult',
          'Very Difficult',
          'Moderately Difficult',
          'Slightly Difficult',
          'Not Difficult',
        ],
        weight: 2,
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Connection',
    questions: [
      {
        id: 'socialInteractions',
        text: 'How satisfied are you with your social connections?',
        type: 'scale',
        options: [
          'Very Unsatisfied',
          'Unsatisfied',
          'Neutral',
          'Satisfied',
          'Very Satisfied',
        ],
        weight: 2,
      },
      {
        id: 'supportSystem',
        text: 'How strong is your support system?',
        type: 'scale',
        options: ['None', 'Limited', 'Moderate', 'Strong', 'Very Strong'],
        weight: 2.5,
      },
      {
        id: 'relationshipQuality',
        text: 'How would you rate your relationships with family/friends?',
        type: 'scale',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
        weight: 2,
      },
      {
        id: 'socialAnxiety',
        text: 'How anxious do you feel in social situations?',
        type: 'slider',
        min: 0,
        max: 10,
        weight: 2,
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Factors',
    questions: [
      {
        id: 'exercise',
        text: 'How often do you exercise?',
        type: 'scale',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'],
        weight: 1.5,
      },
      {
        id: 'diet',
        text: 'How healthy is your diet?',
        type: 'scale',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
        weight: 1.5,
      },
      {
        id: 'stressLevel',
        text: 'Rate your current stress level:',
        type: 'slider',
        min: 0,
        max: 10,
        weight: 2.5,
      },
      {
        id: 'copingMechanisms',
        text: 'How effective are your coping mechanisms?',
        type: 'scale',
        options: [
          'Not Effective',
          'Slightly Effective',
          'Moderately Effective',
          'Very Effective',
          'Extremely Effective',
        ],
        weight: 2,
      },
    ],
  },
]

// Text analysis helper function
const analyzeText = (text) => {
  if (!text) return { score: 0, insights: [], sentiments: {}, topTerms: [] }

  const doc = nlp(text)

  const sentiments = {
    positive: doc.match('(good|great|happy|better|wonderful|optimistic)')
      .length,
    negative: doc.match('(bad|terrible|sad|worse|hopeless|depressed)').length,
    anxiety: doc.match('(anxious|worried|nervous|stress|panic)').length,
    depression: doc.match('(depressed|hopeless|worthless|tired|exhausted)')
      .length,
    risk: doc.match('(suicide|die|death|end|hurt)').length,
  }

  const score =
    sentiments.positive * 1 +
    sentiments.negative * -2 +
    sentiments.anxiety * -1.5 +
    sentiments.depression * -2 +
    sentiments.risk * -3

  return {
    score,
    sentiments,
    topTerms: doc.match('#Adjective').out('array').slice(0, 5),
  }
}

const SuicideRiskAnalysis = () => {
  const [responses, setResponses] = useState({})
  const [analysis, setAnalysis] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const calculateDomainScores = () => {
    const scores = {}

    assessmentSections.forEach((section) => {
      let sectionScore = 0
      let questionCount = 0

      section.questions.forEach((question) => {
        const response = responses[question.id]
        if (response) {
          if (question.type === 'textarea') {
            const analysis = analyzeText(response)
            sectionScore += analysis.score * question.weight
          } else if (question.type === 'slider') {
            sectionScore += (response / 10) * question.weight
          } else {
            const optionIndex = question.options.indexOf(response)
            sectionScore +=
              ((optionIndex + 1) / question.options.length) * question.weight
          }
          questionCount++
        }
      })

      scores[section.id] = questionCount > 0 ? sectionScore / questionCount : 0
    })

    return scores
  }

  const calculateRiskLevel = (scores, textAnalysis) => {
    const avgScore =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.keys(scores).length
    const textRiskScore = textAnalysis.score

    const finalScore = avgScore * 0.7 + textRiskScore * 0.3

    if (finalScore < -2) return 'High'
    if (finalScore < 0) return 'Moderate'
    return 'Low'
  }

  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const generateReport = async () => {
    setIsLoading(true)
    try {
      const domainScores = calculateDomainScores()
      const textAnalysis = analyzeText(responses.thoughtDescription || '')

      setAnalysis({
        scores: domainScores,
        textInsights: textAnalysis,
        timestamp: new Date().toISOString(),
        riskLevel: calculateRiskLevel(domainScores, textAnalysis),
      })

      setShowReport(true)
    } catch (error) {
      console.error('Error generating report:', error)
      // Here you could add error handling UI
    } finally {
      setIsLoading(false)
    }
  }

  const renderSlider = (question) => (
    <div className='space-y-2'>
      <input
        type='range'
        min={question.min}
        max={question.max}
        value={responses[question.id] || 0}
        onChange={(e) =>
          handleInputChange(question.id, parseInt(e.target.value))
        }
        className='w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer'
      />
      <div className='flex justify-between px-1 text-sm text-emerald-600'>
        {Array.from({ length: question.max + 1 }, (_, i) => (
          <div key={i} className='flex flex-col items-center'>
            <div className='h-1 w-px bg-emerald-300 mb-1'></div>
            {i}
          </div>
        ))}
      </div>
      <div className='flex justify-between px-1 text-xs text-emerald-600'>
        {question.labels && (
          <>
            <span>{question.labels.min}</span>
            <span>{question.labels.max}</span>
          </>
        )}
      </div>
    </div>
  )

  const renderAssessmentForm = () => (
    <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-emerald-800 flex items-center gap-2'>
          <Brain className='text-emerald-600' />
          Comprehensive Mental Health Assessment
        </h2>
        <p className='text-emerald-600 mt-2'>
          Step {currentStep + 1} of {assessmentSections.length}
        </p>
      </div>

      <div className='space-y-6'>
        {assessmentSections[currentStep].questions.map((question) => (
          <div key={question.id} className='space-y-2'>
            <label className='block text-emerald-800 font-medium'>
              {question.text}
            </label>

            {question.type === 'slider' && renderSlider(question)}

            {question.type === 'scale' && (
              <div className='flex flex-wrap gap-2'>
                {question.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleInputChange(question.id, option)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      responses[question.id] === option
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'textarea' && (
              <textarea
                className='w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500'
                rows={4}
                placeholder={question.placeholder}
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className='mt-6 flex justify-between'>
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className='px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg disabled:opacity-50'
        >
          Previous
        </button>

        {currentStep < assessmentSections.length - 1 ? (
          <button
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className='px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600'
          >
            Next
          </button>
        ) : (
          <button
            onClick={generateReport}
            disabled={isLoading}
            className='px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50'
          >
            {isLoading ? 'Analyzing...' : 'Generate Analysis'}
          </button>
        )}
      </div>
    </div>
  )

  const renderReport = () => (
    <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6'>
      <h2 className='text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2'>
        <Activity className='text-emerald-600' />
        Analysis Report
      </h2>

      <div
        className={`p-4 rounded-lg mb-6 ${
          analysis.riskLevel === 'High'
            ? 'bg-red-50'
            : analysis.riskLevel === 'Moderate'
            ? 'bg-orange-50'
            : 'bg-emerald-50'
        }`}
      >
        <h3 className='font-semibold text-lg mb-2'>Risk Assessment</h3>
        <p
          className={`font-bold ${
            analysis.riskLevel === 'High'
              ? 'text-red-700'
              : analysis.riskLevel === 'Moderate'
              ? 'text-orange-700'
              : 'text-emerald-700'
          }`}
        >
          {analysis.riskLevel} Risk Level
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-4 text-emerald-800'>
            Domain Analysis
          </h3>
          <RadarChart
            width={300}
            height={300}
            data={Object.entries(analysis.scores).map(([domain, score]) => ({
              domain: domain.charAt(0).toUpperCase() + domain.slice(1),
              score: score * 10,
            }))}
          >
            <PolarGrid stroke='#10B981' />
            <PolarAngleAxis dataKey='domain' stroke='#065F46' />
            <PolarRadiusAxis stroke='#10B981' />
            <Radar
              name='Scores'
              dataKey='score'
              stroke='#10B981'
              fill='#10B981'
              fillOpacity={0.5}
            />
          </RadarChart>
        </div>

        <div className='bg-emerald-50 p-4 rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-4 text-emerald-800'>
            Response Analysis
          </h3>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='bg-emerald-50 p-3 rounded-lg'>
                <p className='text-sm text-emerald-600'>Positive Indicators</p>
                <p className='text-2xl font-bold text-emerald-700'>
                  {analysis.textInsights.sentiments.positive || 0}
                </p>
              </div>
              <div className='bg-red-50 p-3 rounded-lg'>
                <p className='text-sm text-red-600'>Negative Indicators</p>
                <p className='text-2xl font-bold text-red-700'>
                  {analysis.textInsights.sentiments.negative || 0}
                </p>
              </div>
            </div>
            <div className='space-y-3'>
              <h4 className='font-medium text-emerald-800'>
                Key Terms Identified:
              </h4>
              {analysis.textInsights.topTerms.map((term, index) => (
                <div key={index} className='bg-emerald-50 p-3 rounded-lg'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-emerald-700 font-medium'>{term}</span>
                    <span className='text-sm text-emerald-600'>
                      Frequency:{' '}
                      {analysis.textInsights.sentiments[term.toLowerCase()]
                        ? Math.round(
                            analysis.textInsights.sentiments[
                              term.toLowerCase()
                            ] * 100
                          ) + '%'
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='w-full bg-emerald-200 rounded-full h-2'>
                    <div
                      className='bg-emerald-500 h-2 rounded-full transition-all duration-500'
                      style={{
                        width: `${
                          analysis.textInsights.sentiments[term.toLowerCase()]
                            ? Math.min(
                                100,
                                analysis.textInsights.sentiments[
                                  term.toLowerCase()
                                ] * 100
                              )
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4'>
              <h4 className='font-medium text-emerald-800 mb-2'>
                Sentiment Categories
              </h4>
              <div className='space-y-2'>
                {Object.entries(analysis.textInsights.sentiments)
                  .filter(([key]) => !['positive', 'negative'].includes(key))
                  .map(([category, value]) => (
                    <div
                      key={category}
                      className='flex items-center justify-between'
                    >
                      <span className='text-emerald-600 capitalize'>
                        {category}
                      </span>
                      <span className='text-emerald-700 font-medium'>
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {/* Detailed Metrics */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
          {Object.entries(analysis.scores).map(([domain, score]) => (
            <div key={domain} className='bg-emerald-50 p-4 rounded-lg'>
              <h4 className='font-semibold text-emerald-800 mb-2'>
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </h4>
              <div className='flex items-center gap-2'>
                <div className='w-full bg-emerald-200 rounded-full h-2'>
                  <div
                    className='bg-emerald-500 h-2 rounded-full transition-all duration-500'
                    style={{ width: `${score * 100}%` }}
                  />
                </div>
                <span className='text-emerald-700 font-medium'>
                  {(score * 10).toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-6 flex justify-end gap-4'>
        <button
          onClick={() => setShowReport(false)}
          className='bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2'
        >
          Back to Assessment
        </button>
        <button
          onClick={() => generatePDFReport(analysis)}
          disabled={!analysis}
          className='bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50'
        >
          <FileText size={18} />
          Download Report (PDF)
        </button>
      </div>

      {/* Emergency Resources */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-emerald-50 p-4 rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-3 text-emerald-800'>
            Emergency Contacts
          </h3>
          <div className='space-y-3'>
            <div className='p-3 bg-white rounded-lg'>
              <p className='font-medium text-emerald-800'>Crisis Hotline</p>
              <p className='text-emerald-600 text-lg font-bold'>988</p>
              <p className='text-sm text-emerald-500'>24/7 Support Available</p>
            </div>
            <div className='p-3 bg-white rounded-lg'>
              <p className='font-medium text-emerald-800'>Crisis Text Line</p>
              <p className='text-emerald-600 text-lg font-bold'>
                Text HOME to 741741
              </p>
              <p className='text-sm text-emerald-500'>24/7 Text Support</p>
            </div>
          </div>
        </div>

        <div className='bg-emerald-50 p-4 rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-3 text-emerald-800'>
            Recommended Actions
          </h3>
          <ul className='space-y-3'>
            {[
              {
                text: 'Schedule professional consultation',
                icon: <Heart size={18} />,
              },
              {
                text: 'Create daily wellness routine',
                icon: <Activity size={18} />,
              },
              { text: 'Connect with support group', icon: <Brain size={18} /> },
            ].map((action, index) => (
              <li
                key={index}
                className='flex items-center gap-2 text-emerald-700'
              >
                <span className='text-emerald-500'>{action.icon}</span>
                {action.text}
              </li>
            ))}
          </ul>
        </div>

        <div className='bg-emerald-50 p-4 rounded-lg shadow-sm'>
          <h3 className='font-semibold text-lg mb-3 text-emerald-800'>
            Follow-up Plan
          </h3>
          <button
            onClick={() => {
              /* Add scheduling logic */
            }}
            className='w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors'
          >
            Schedule Next Assessment
          </button>
          <p className='mt-3 text-sm text-emerald-600'>
            Regular assessments help track progress and adjust support
            strategies as needed.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className='mt-10 min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 p-6'>
        <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg'>
          <div className='flex items-center'>
            <AlertTriangle className='text-red-500 mr-3' />
            <div>
              <h2 className='text-lg font-semibold text-red-700'>
                Need Immediate Help?
              </h2>
              <p className='text-red-600'>
                Call 911 for 24/7 support. You're not alone.
              </p>
            </div>
          </div>
        </div>

        {showReport ? renderReport() : renderAssessmentForm()}
      </div>
    </>
  )
}

export default SuicideRiskAnalysis
