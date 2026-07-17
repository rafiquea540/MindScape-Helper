import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  ChartBar,
  Clock,
  Download,
  FileText,
  Flag,
  Loader,
  Shield,
  TrendingUp,
  User,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'

// Complete Clinical Assessment Data Structure
const clinicalAssessmentData = {
  demographics: {
    required: true,
    fields: [
      { id: 'age', type: 'number', label: 'Age', required: true },
      {
        id: 'gender',
        type: 'select',
        label: 'Gender',
        options: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: true,
      },
      {
        id: 'education',
        type: 'select',
        label: 'Education Level',
        options: ['High School', 'Bachelors', 'Masters', 'Doctorate', 'Other'],
      },
      { id: 'occupation', type: 'text', label: 'Occupation' },
      {
        id: 'maritalStatus',
        type: 'select',
        label: 'Marital Status',
        options: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
      },
      {
        id: 'livingArrangement',
        type: 'select',
        label: 'Living Arrangement',
        options: ['Alone', 'With Family', 'With Roommates', 'Other'],
      },
    ],
  },
  assessments: [
    {
      id: 'depression',
      title: 'Depression Scale (PHQ-9)',
      description: 'Clinical depression screening instrument',
      timeFrame: 'Over the last 2 weeks',
      scoringAlgorithm: {
        ranges: [
          { min: 0, max: 4, severity: 'Minimal', action: 'Monitor' },
          { min: 5, max: 9, severity: 'Mild', action: 'Watchful waiting' },
          { min: 10, max: 14, severity: 'Moderate', action: 'Treatment plan' },
          {
            min: 15,
            max: 19,
            severity: 'Moderately Severe',
            action: 'Active treatment',
          },
          { min: 20, max: 27, severity: 'Severe', action: 'Immediate action' },
        ],
        weights: { somatic: 1.0, cognitive: 1.2, behavioral: 1.1 },
      },
      questions: [
        {
          id: 'dep1',
          text: 'Little interest or pleasure in doing things',
          domain: 'behavioral',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.1 },
            { value: 2, label: 'More than half the days', weight: 1.2 },
            { value: 3, label: 'Nearly every day', weight: 1.3 },
          ],
        },
        {
          id: 'dep2',
          text: 'Feeling down, depressed, or hopeless',
          domain: 'cognitive',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.2 },
            { value: 2, label: 'More than half the days', weight: 1.4 },
            { value: 3, label: 'Nearly every day', weight: 1.6 },
          ],
        },
        {
          id: 'dep3',
          text: 'Trouble falling/staying asleep, sleeping too much',
          domain: 'somatic',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.1 },
            { value: 2, label: 'More than half the days', weight: 1.2 },
            { value: 3, label: 'Nearly every day', weight: 1.3 },
          ],
        },
      ],
    },
    {
      id: 'anxiety',
      title: 'Anxiety Assessment (GAD-7)',
      description: 'Generalized anxiety disorder screening',
      timeFrame: 'Over the last 2 weeks',
      scoringAlgorithm: {
        ranges: [
          { min: 0, max: 4, severity: 'Minimal', action: 'Monitor' },
          { min: 5, max: 9, severity: 'Mild', action: 'Watchful waiting' },
          { min: 10, max: 14, severity: 'Moderate', action: 'Treatment plan' },
          { min: 15, max: 21, severity: 'Severe', action: 'Immediate action' },
        ],
        weights: { physical: 1.1, cognitive: 1.2, emotional: 1.0 },
      },
      questions: [
        {
          id: 'anx1',
          text: 'Feeling nervous, anxious, or on edge',
          domain: 'emotional',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.1 },
            { value: 2, label: 'More than half the days', weight: 1.2 },
            { value: 3, label: 'Nearly every day', weight: 1.3 },
          ],
        },
        {
          id: 'anx2',
          text: 'Not being able to stop or control worrying',
          domain: 'cognitive',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.2 },
            { value: 2, label: 'More than half the days', weight: 1.4 },
            { value: 3, label: 'Nearly every day', weight: 1.6 },
          ],
        },
        {
          id: 'anx3',
          text: 'Physical symptoms (heart racing, sweating)',
          domain: 'physical',
          options: [
            { value: 0, label: 'Not at all', weight: 1.0 },
            { value: 1, label: 'Several days', weight: 1.1 },
            { value: 2, label: 'More than half the days', weight: 1.2 },
            { value: 3, label: 'Nearly every day', weight: 1.3 },
          ],
        },
      ],
    },
  ],
}

// Enhanced Diagnostic Algorithm Implementation
const EnhancedDiagnosticAlgorithm = {
  calculateDomainScores: (responses, assessment) => {
    const domainScores = {}

    assessment.questions.forEach((question) => {
      const response = responses[question.id]
      if (response) {
        const domain = question.domain
        const weight = assessment.scoringAlgorithm.weights[domain] || 1
        const optionWeight =
          question.options.find((opt) => opt.value === response.value)
            ?.weight || 1

        domainScores[domain] =
          (domainScores[domain] || 0) + response.value * weight * optionWeight
      }
    })

    return domainScores
  },

  calculateSeverity: (totalScore, ranges) => {
    return (
      ranges.find(
        (range) => totalScore >= range.min && totalScore <= range.max
      ) || ranges[ranges.length - 1]
    )
  },

  analyzeComorbidity: (scores) => {
    const comorbidityRisk = {
      level: 'Low',
      factors: [],
      riskScore: 0,
    }

    if (scores.depression && scores.anxiety) {
      const depScore = scores.depression.totalScore
      const anxScore = scores.anxiety.totalScore

      // Calculate combined risk score
      comorbidityRisk.riskScore = (depScore / 27 + anxScore / 21) * 50

      if (depScore > 10 && anxScore > 10) {
        comorbidityRisk.level = 'High'
        comorbidityRisk.factors.push('Depression-Anxiety Comorbidity')
      } else if (depScore > 5 && anxScore > 5) {
        comorbidityRisk.level = 'Moderate'
        comorbidityRisk.factors.push('Mild Depression-Anxiety Symptoms')
      }
    }

    return comorbidityRisk
  },

  calculateTrendAnalysis: (historicalData) => {
    const trends = {
      improvement: 0,
      deterioration: 0,
      stable: 0,
      overallTrend: 'stable',
      changeRate: 0,
      volatility: 0,
    }

    if (historicalData.length >= 2) {
      const sortedData = historicalData.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
      const recentScores = sortedData.slice(-2)
      const percentageChange =
        ((recentScores[1].totalScore - recentScores[0].totalScore) /
          recentScores[0].totalScore) *
        100

      trends.changeRate = percentageChange

      // Calculate volatility
      if (historicalData.length >= 3) {
        const scores = sortedData.map((d) => d.totalScore)
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length
        trends.volatility = Math.sqrt(
          scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length
        )
      }

      if (percentageChange <= -10) {
        trends.improvement = Math.abs(percentageChange)
        trends.overallTrend = 'improving'
      } else if (percentageChange >= 10) {
        trends.deterioration = percentageChange
        trends.overallTrend = 'deteriorating'
      } else {
        trends.stable = 100 - Math.abs(percentageChange)
        trends.overallTrend = 'stable'
      }
    }

    return trends
  },

  calculateRiskScore: (scores, demographics) => {
    let riskScore = 0
    const weights = {
      depression: 0.4,
      anxiety: 0.4,
      age: 0.1,
      socialSupport: 0.1,
    }

    // Calculate weighted score from assessments
    if (scores.depression) {
      riskScore +=
        (scores.depression.totalScore / 27) * weights.depression * 100
    }
    if (scores.anxiety) {
      riskScore += (scores.anxiety.totalScore / 21) * weights.anxiety * 100
    }

    // Age-based risk adjustment
    const age = parseInt(demographics.age)
    if (age) {
      const ageRisk = age > 65 || age < 25 ? 1 : 0.7
      riskScore += ageRisk * weights.age * 100
    }

    // Social support factor
    const livingAlone = demographics.livingArrangement === 'Alone'
    const socialRisk = livingAlone ? 1 : 0.7
    riskScore += socialRisk * weights.socialSupport * 100

    return Math.min(Math.round(riskScore), 100)
  },

  generateDetailedReport: (results, demographics, historicalData) => {
    const report = {
      summary: {
        assessmentDate: new Date().toISOString(),
        patientProfile: {
          age: demographics.age,
          gender: demographics.gender,
          occupation: demographics.occupation,
          education: demographics.education,
          maritalStatus: demographics.maritalStatus,
          livingArrangement: demographics.livingArrangement,
        },
        overallRisk: null,
        primaryConcerns: [],
        recommendedActions: [],
      },
      details: {
        assessments: {},
        riskFactors: [],
        protectiveFactors: [],
      },
      trends: {
        shortTerm: {},
        longTerm: {},
        stability: 'stable',
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        lifestyle: [],
      },
    }

    // Calculate overall risk score
    report.summary.overallRisk = EnhancedDiagnosticAlgorithm.calculateRiskScore(
      results.scores,
      demographics
    )

    // Process each assessment
    Object.entries(results.scores).forEach(([domain, data]) => {
      report.details.assessments[domain] = {
        score: data.totalScore,
        severity: data.severity.severity,
        action: data.severity.action,
        domainScores: data.domainScores,
      }

      if (data.severity.severity !== 'Minimal') {
        report.summary.primaryConcerns.push({
          domain,
          severity: data.severity.severity,
          score: data.totalScore,
        })
      }
    })

    // Analyze trends if historical data is available
    if (historicalData.length > 0) {
      const trends =
        EnhancedDiagnosticAlgorithm.calculateTrendAnalysis(historicalData)
      report.trends = {
        ...report.trends,
        ...trends,
      }
    }

    // Generate recommendations based on risk level and trends
    if (report.summary.overallRisk >= 70) {
      report.recommendations.immediate.push(
        'Immediate clinical intervention required'
      )
      report.recommendations.shortTerm.push('Daily mood monitoring')
      report.recommendations.longTerm.push(
        'Develop comprehensive treatment plan'
      )
    } else if (report.summary.overallRisk >= 50) {
      report.recommendations.shortTerm.push(
        'Schedule follow-up assessment within 1 week'
      )
      report.recommendations.longTerm.push('Consider therapy or counseling')
    } else {
      report.recommendations.shortTerm.push('Regular monitoring recommended')
      report.recommendations.lifestyle.push('Maintain current support systems')
    }

    // Add lifestyle recommendations
    const livingAlone = demographics.livingArrangement === 'Alone'
    if (livingAlone) {
      report.recommendations.lifestyle.push(
        'Consider increasing social support network'
      )
    }

    return report
  },

  generateRecommendations: (severity, comorbidity) => {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      lifestyle: [],
    }

    if (severity.action === 'Immediate action') {
      recommendations.immediate.push(
        'Immediate clinical evaluation recommended'
      )
      recommendations.shortTerm.push('Daily symptom monitoring')
      recommendations.lifestyle.push('Establish emergency support network')
    }

    if (comorbidity.level === 'High') {
      recommendations.immediate.push(
        'Comprehensive psychological evaluation advised'
      )
      recommendations.shortTerm.push('Weekly therapy sessions recommended')
      recommendations.longTerm.push('Develop integrated treatment plan')
    }

    recommendations.lifestyle.push('Regular exercise and sleep schedule')
    recommendations.lifestyle.push('Stress management techniques')

    return recommendations
  },
}

// Main Component
const ClinicalAssessmentPage = () => {
  // State Management
  const [currentSection, setCurrentSection] = useState('demographics')
  const [responses, setResponses] = useState({})
  const [demographicData, setDemographicData] = useState({})
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historicalData, setHistoricalData] = useState([])
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [detailedReport, setDetailedReport] = useState(null)
  const [assessmentHistory, setAssessmentHistory] = useState([])
  const [showTrends, setShowTrends] = useState(false)

  // Handle demographic input
  const handleDemographicChange = (field, value) => {
    setDemographicData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle assessment responses
  const handleResponse = (questionId, response) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }))
  }

  // Process and analyze assessment data
  const processAssessment = async () => {
    setLoading(true)
    try {
      const results = {}

      // Process each assessment
      for (const assessment of clinicalAssessmentData.assessments) {
        const domainScores = EnhancedDiagnosticAlgorithm.calculateDomainScores(
          responses,
          assessment
        )
        const totalScore = Object.values(domainScores).reduce(
          (a, b) => a + b,
          0
        )
        const severity = EnhancedDiagnosticAlgorithm.calculateSeverity(
          totalScore,
          assessment.scoringAlgorithm.ranges
        )

        results[assessment.id] = {
          domainScores,
          totalScore,
          severity,
        }
      }

      // Add to historical data
      const newHistoricalData = [
        ...historicalData,
        {
          timestamp: new Date().toISOString(),
          totalScore: Object.values(results).reduce(
            (sum, { totalScore }) => sum + totalScore,
            0
          ),
          results: { ...results },
        },
      ]
      setHistoricalData(newHistoricalData)

      // Generate comprehensive report
      const report = EnhancedDiagnosticAlgorithm.generateDetailedReport(
        { scores: results },
        demographicData,
        newHistoricalData
      )

      // Calculate trends
      const trends =
        EnhancedDiagnosticAlgorithm.calculateTrendAnalysis(newHistoricalData)

      // Set analysis results
      setAnalysisResults({
        scores: results,
        comorbidity: EnhancedDiagnosticAlgorithm.analyzeComorbidity(results),
        recommendations: EnhancedDiagnosticAlgorithm.generateRecommendations(
          results[clinicalAssessmentData.assessments[0].id].severity,
          EnhancedDiagnosticAlgorithm.analyzeComorbidity(results)
        ),
        trends,
        timestamp: new Date().toISOString(),
      })

      setDetailedReport(report)

      // Update assessment history
      setAssessmentHistory((prev) => [
        ...prev,
        {
          date: new Date().toISOString(),
          report: report,
          results: results,
        },
      ])
    } catch (error) {
      console.error('Error in diagnostic processing:', error)
    } finally {
      setLoading(false)
    }
  }

  // Render the demographic information form
  const renderDemographics = () => (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-4 flex items-center'>
        <User className='w-6 h-6 mr-2 text-green-600' />
        Demographic Information
      </h2>
      <div className='grid gap-4 md:grid-cols-2'>
        {clinicalAssessmentData.demographics.fields.map((field) => (
          <div key={field.id} className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              {field.label}
              {field.required && <span className='text-red-500'>*</span>}
            </label>
            {field.type === 'select' ? (
              <select
                value={demographicData[field.id] || ''}
                onChange={(e) =>
                  handleDemographicChange(field.id, e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
              >
                <option value=''>Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={demographicData[field.id] || ''}
                onChange={(e) =>
                  handleDemographicChange(field.id, e.target.value)
                }
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // Render individual assessment questions
  const renderAssessment = (assessment) => (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-2'>{assessment.title}</h2>
      <p className='text-gray-600 mb-4'>{assessment.description}</p>
      <p className='text-sm text-gray-500 mb-6'>
        Timeframe: {assessment.timeFrame}
      </p>

      <div className='space-y-6'>
        {assessment.questions.map((question) => (
          <div key={question.id} className='space-y-3'>
            <p className='font-medium'>{question.text}</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(question.id, option)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200
                    ${
                      responses[question.id]?.value === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Render risk score gauge
  const renderRiskGauge = (riskScore) => (
    <div className='relative h-48 w-48 mx-auto'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='text-4xl font-bold text-gray-800'>{riskScore}</div>
      </div>
      <svg viewBox='0 0 100 100' className='transform -rotate-90 h-full w-full'>
        <circle
          cx='50'
          cy='50'
          r='45'
          fill='none'
          stroke='#e5e7eb'
          strokeWidth='10'
        />
        <circle
          cx='50'
          cy='50'
          r='45'
          fill='none'
          stroke={
            riskScore > 70 ? '#ef4444' : riskScore > 50 ? '#f59e0b' : '#10b981'
          }
          strokeWidth='10'
          strokeDasharray={`${riskScore * 2.83} 283`}
        />
      </svg>
    </div>
  )

  // Render trends analysis
  const renderTrendsChart = () => {
    if (historicalData.length < 2) return null

    const chartData = historicalData.map((data) => ({
      date: new Date(data.timestamp).toLocaleDateString(),
      score: data.totalScore,
      trend: data.totalScore,
    }))

    return (
      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type='monotone'
              dataKey='score'
              stroke='#16a34a'
              fill='#16a34a'
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Render domain scores radar chart
  const renderDomainRadar = (scores) => {
    const radarData = Object.entries(scores).map(([domain, data]) => ({
      domain: domain.charAt(0).toUpperCase() + domain.slice(1),
      score: data.totalScore,
    }))

    return (
      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey='domain' />
            <PolarRadiusAxis />
            <Radar
              name='Scores'
              dataKey='score'
              stroke='#16a34a'
              fill='#16a34a'
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Render comorbidity analysis
  const renderComorbidityAnalysis = (comorbidity) => (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-4 flex items-center'>
        <Activity className='w-6 h-6 mr-2 text-green-600' />
        Comorbidity Analysis
      </h2>
      <div className='p-4 bg-green-50 rounded-lg'>
        <p className='font-medium mb-2'>Risk Level: {comorbidity.level}</p>
        {comorbidity.factors.length > 0 && (
          <ul className='list-disc list-inside text-sm text-gray-600'>
            {comorbidity.factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )

  // Render detailed clinical report
  const renderDetailedReport = () => {
    if (!detailedReport) return null

    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold mb-4 flex items-center'>
          <FileText className='w-6 h-6 mr-2 text-green-600' />
          Detailed Clinical Report
        </h2>
        <div className='space-y-6'>
          {/* Patient Information */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-medium mb-2'>Patient Information</h3>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              {Object.entries(detailedReport.summary.patientProfile).map(
                ([key, value]) => (
                  <div key={key}>
                    <span className='font-medium capitalize'>{key}: </span>
                    <span>{value}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Primary Concerns */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-medium mb-2'>Primary Concerns</h3>
            <ul className='list-disc list-inside text-sm'>
              {detailedReport.summary.primaryConcerns.map((concern, index) => (
                <li key={index}>
                  {concern.domain.charAt(0).toUpperCase() +
                    concern.domain.slice(1)}
                  : {concern.severity} (Score: {concern.score})
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <h3 className='font-medium mb-2'>Clinical Recommendations</h3>
            {Object.entries(detailedReport.recommendations).map(
              ([timeframe, items]) =>
                items.length > 0 && (
                  <div key={timeframe} className='mb-4'>
                    <h4 className='font-medium text-sm mb-2 capitalize'>
                      {timeframe.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <ul className='list-disc list-inside text-sm text-gray-600'>
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main render function
  return (
    <>
      <Navbar />
      <div className='mt-10  min-h-screen bg-gray-50 p-4 md:p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-4 flex items-center'>
              <Brain className='w-8 h-8 mr-3 text-green-600' />
              Clinical Psychometric Assessment
            </h1>
            <p className='text-gray-600'>
              Professional-grade psychological assessment tool using validated
              clinical instruments and diagnostic algorithms.
            </p>
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            {!analysisResults ? (
              <>
                {/* Progress Steps */}
                <div className='flex items-center mb-8'>
                  {[
                    'demographics',
                    ...clinicalAssessmentData.assessments.map((a) => a.id),
                  ].map((step, index) => (
                    <React.Fragment key={step}>
                      <div className='flex items-center'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center
                          ${
                            currentSection === step
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className='ml-2 text-sm hidden md:inline capitalize'>
                          {step}
                        </span>
                      </div>
                      {index <
                        clinicalAssessmentData.assessments.length + 1 - 1 && (
                        <div className='flex-1 h-px bg-gray-200 mx-4' />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Current Section Content */}
                {currentSection === 'demographics'
                  ? renderDemographics()
                  : renderAssessment(
                      clinicalAssessmentData.assessments.find(
                        (a) => a.id === currentSection
                      )
                    )}

                {/* Navigation */}
                <div className='flex justify-between mt-6'>
                  <button
                    onClick={() => {
                      const sections = [
                        'demographics',
                        ...clinicalAssessmentData.assessments.map((a) => a.id),
                      ]
                      const currentIndex = sections.indexOf(currentSection)
                      if (currentIndex > 0) {
                        setCurrentSection(sections[currentIndex - 1])
                      }
                    }}
                    disabled={currentSection === 'demographics'}
                    className='px-6 py-2 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors'
                  >
                    Previous
                  </button>
                  {currentSection ===
                  clinicalAssessmentData.assessments[
                    clinicalAssessmentData.assessments.length - 1
                  ].id ? (
                    <button
                      onClick={processAssessment}
                      disabled={loading}
                      className='px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center'
                    >
                      {loading ? (
                        <>
                          <Loader className='w-4 h-4 mr-2 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Assessment
                          <ArrowRight className='w-4 h-4 ml-2' />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const sections = [
                          'demographics',
                          ...clinicalAssessmentData.assessments.map(
                            (a) => a.id
                          ),
                        ]
                        const currentIndex = sections.indexOf(currentSection)
                        if (currentIndex < sections.length - 1) {
                          setCurrentSection(sections[currentIndex + 1])
                        }
                      }}
                      className='px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center'
                    >
                      Next
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </button>
                  )}
                </div>
              </>
            ) : (
              // Results View
              <div className='space-y-8'>
                {/* Risk Score Panel */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h2 className='text-xl font-semibold mb-4 flex items-center'>
                    <Flag className='w-6 h-6 mr-2 text-green-600' />
                    Overall Risk Assessment
                  </h2>
                  <div className='flex flex-col items-center'>
                    {renderRiskGauge(detailedReport.summary.overallRisk)}
                    <p className='mt-4 text-center text-gray-600'>
                      Overall Risk Score: {detailedReport.summary.overallRisk}
                      /100
                    </p>
                  </div>
                </div>

                {/* Domain Scores */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h2 className='text-xl font-semibold mb-4 flex items-center'>
                    <ChartBar className='w-6 h-6 mr-2 text-green-600' />
                    Domain Analysis
                  </h2>
                  {renderDomainRadar(analysisResults.scores)}
                </div>

                {/* Trends Analysis */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h2 className='text-xl font-semibold mb-4 flex items-center'>
                    <TrendingUp className='w-6 h-6 mr-2 text-green-600' />
                    Trends Analysis
                  </h2>
                  {renderTrendsChart()}
                  <div className='mt-4 p-4 bg-green-50 rounded-lg'>
                    <p className='text-sm text-gray-600'>
                      Trend Status:{' '}
                      <span className='font-medium capitalize'>
                        {analysisResults.trends.overallTrend}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Comorbidity Analysis */}
                {renderComorbidityAnalysis(analysisResults.comorbidity)}

                {/* Detailed Report Section */}
                <div className='flex justify-center mt-6'>
                  <button
                    onClick={() => setShowDetailedReport(!showDetailedReport)}
                    className='px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center'
                  >
                    <FileText className='w-4 h-4 mr-2' />
                    {showDetailedReport
                      ? 'Hide Detailed Report'
                      : 'View Detailed Report'}
                  </button>
                </div>

                {showDetailedReport && renderDetailedReport()}

                {/* Disclaimer */}
                <div className='mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <div className='flex items-start'>
                    <AlertTriangle className='w-5 h-5 text-yellow-500 mr-3 mt-0.5' />
                    <div>
                      <h3 className='font-medium mb-1'>Clinical Disclaimer</h3>
                      <p className='text-sm text-gray-600'>
                        This assessment tool is designed for screening purposes
                        only and should not be used as a substitute for
                        professional clinical evaluation. If you are
                        experiencing severe symptoms or having thoughts of
                        self-harm, please seek immediate medical attention or
                        contact emergency services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ClinicalAssessmentPage
