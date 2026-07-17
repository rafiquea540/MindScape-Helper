import jsPDF from 'jspdf'
import 'jspdf-autotable'

const downloadPDFReport = (emotions) => {
  // Initialize PDF with better default font
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Add a professional font
  pdf.addFont('Helvetica', 'normal')
  pdf.addFont('Helvetica-Bold', 'bold')

  // Helper function for text with custom styling
  const addText = (
    text,
    size = 12,
    isBold = false,
    align = 'left',
    color = '#000000'
  ) => {
    pdf.setFontSize(size)
    pdf.setFont('Helvetica', isBold ? 'bold' : 'normal')
    pdf.setTextColor(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b)
    pdf.text(text, align === 'center' ? pageWidth / 2 : 20, yPosition, {
      align,
    })
    yPosition += size / 2 + 4
  }

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Helper for page breaks
  const checkPage = (needed) => {
    if (yPosition + needed > pageHeight - 20) {
      pdf.addPage()
      yPosition = 20
    }
  }

  // Enhanced metrics calculation with personality insights
  const calculateEmotionalMetrics = (emotionsData) => {
    const emotionPoints = {
      happy: 1,
      neutral: 0,
      sad: -1,
      angry: -1,
      fearful: -1,
      disgusted: -1,
      surprised: 0.5,
    }

    // Basic metrics calculation
    const emotionChanges = emotionsData
      .slice(1)
      .filter((e, i) => e.emotion !== emotionsData[i].emotion).length
    const stabilityScore = Math.round(
      ((emotionsData.length - 1 - emotionChanges) / (emotionsData.length - 1)) *
        100
    )

    const uniqueEmotions = new Set(emotionsData.map((e) => e.emotion)).size
    const varianceScore = Math.round((uniqueEmotions / 7) * 100)

    const emotionalPoints = emotionsData.reduce(
      (sum, e) => sum + (emotionPoints[e.emotion] || 0),
      0
    )
    const balanceScore = Math.round(
      ((emotionalPoints + emotionsData.length) / (2 * emotionsData.length)) *
        100
    )

    const confidences = emotionsData.map((e) => e.confidence)
    const avgConfidence =
      confidences.reduce((a, b) => a + b, 0) / confidences.length
    const confidenceVariance = Math.sqrt(
      confidences.reduce(
        (sum, conf) => sum + Math.pow(conf - avgConfidence, 2),
        0
      ) / confidences.length
    )
    const consistencyScore = Math.round((1 - confidenceVariance / 100) * 100)

    // Calculate emotional pattern insights
    const emotionSequences = emotionsData.map((e) => e.emotion)
    const dominantEmotion = Object.entries(
      emotionSequences.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1
        return acc
      }, {})
    ).sort((a, b) => b[1] - a[1])[0][0]

    const emotionalReactivity = emotionChanges / emotionsData.length
    const emotionalResiliency = stabilityScore * (1 + balanceScore / 100)

    return {
      stabilityScore,
      varianceScore,
      balanceScore,
      consistencyScore,
      avgConfidence: Math.round(avgConfidence),
      dominantEmotion,
      emotionalReactivity: Math.round(emotionalReactivity * 100),
      emotionalResiliency: Math.round(emotionalResiliency),
      compositeScore: Math.round(
        (stabilityScore + varianceScore + balanceScore + consistencyScore) / 4
      ),
    }
  }

  // Draw enhanced metrics visualization
  const drawMetricsVisualization = (metrics) => {
    const startX = 25
    const barWidth = 30
    const maxHeight = 50
    const spacing = 40
    const metrics_data = [
      { label: 'Stability', value: metrics.stabilityScore, color: '#4CAF50' },
      { label: 'Range', value: metrics.varianceScore, color: '#2196F3' },
      { label: 'Balance', value: metrics.balanceScore, color: '#9C27B0' },
      {
        label: 'Consistency',
        value: metrics.consistencyScore,
        color: '#FF9800',
      },
    ]

    // Draw gradient background
    pdf.setFillColor(245, 245, 245)
    pdf.rect(
      startX - 5,
      yPosition - 5,
      metrics_data.length * spacing + 10,
      maxHeight + 25,
      'F'
    )

    // Draw grid lines with labels
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.1)
    pdf.setFontSize(8)
    for (let i = 0; i <= 100; i += 20) {
      const y = yPosition + maxHeight - (maxHeight * i) / 100
      pdf.line(startX - 5, y, startX + metrics_data.length * spacing, y)
      pdf.text(`${i}%`, startX - 10, y)
    }

    // Draw bars with gradients
    metrics_data.forEach((metric, index) => {
      const x = startX + spacing * index
      const height = (metric.value / 100) * maxHeight
      const y = yPosition + maxHeight - height

      // Draw bar with gradient effect
      const { r, g, b } = hexToRgb(metric.color)
      pdf.setFillColor(r, g, b)
      pdf.rect(x, y, barWidth, height, 'F')

      // Add value on top
      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${metric.value}%`, x + barWidth / 2, y - 2, { align: 'center' })

      // Add label below
      pdf.setFontSize(8)
      pdf.text(metric.label, x + barWidth / 2, yPosition + maxHeight + 10, {
        align: 'center',
      })
    })

    // Reset colors
    pdf.setDrawColor(0, 0, 0)
    pdf.setTextColor(0, 0, 0)
    yPosition += maxHeight + 25
  }

  // Generate emotional insights
  const generateInsights = (metrics) => {
    const insights = []

    // Stability insights
    if (metrics.stabilityScore > 70) {
      insights.push(
        'Demonstrates high emotional stability and consistent self-regulation.'
      )
    } else if (metrics.stabilityScore < 50) {
      insights.push(
        'Shows variable emotional responses, indicating potential sensitivity to environmental factors.'
      )
    }

    // Range insights
    if (metrics.varianceScore > 70) {
      insights.push(
        'Exhibits broad emotional range, suggesting high emotional intelligence and adaptability.'
      )
    } else if (metrics.varianceScore < 50) {
      insights.push(
        'Displays limited emotional range, potentially indicating emotional restraint or reduced expressiveness.'
      )
    }

    // Balance insights
    if (metrics.balanceScore > 70) {
      insights.push(
        'Maintains well-balanced emotional states, indicating good emotional regulation.'
      )
    } else if (metrics.balanceScore < 50) {
      insights.push(
        'Shows tendency towards emotional intensity, suggesting strong emotional engagement.'
      )
    }

    // Composite analysis
    insights.push(
      `Overall emotional competency score: ${metrics.compositeScore}/100`
    )
    if (metrics.emotionalReactivity < 30) {
      insights.push(
        'Demonstrates measured emotional responses with good regulation.'
      )
    } else if (metrics.emotionalReactivity > 70) {
      insights.push('Shows high emotional responsiveness and sensitivity.')
    }

    return insights
  }

  // Generate PDF content
  const generatePDF = () => {
    const metrics = calculateEmotionalMetrics(emotions)
    const insights = generateInsights(metrics)

    // Cover Page
    pdf.setFillColor(45, 55, 72)
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')

    // Logo or symbol (placeholder circle)
    pdf.setFillColor(255, 255, 255)
    pdf.circle(pageWidth / 2, 60, 20, 'F')

    // Title
    yPosition = 100
    addText('MindScan™', 36, true, 'center', '#FFFFFF')
    addText('Emotional Intelligence Assessment', 24, false, 'center', '#FFFFFF')
    yPosition += 20
    addText(new Date().toLocaleDateString(), 14, false, 'center', '#FFFFFF')

    // Add new page for content
    pdf.addPage()
    yPosition = 20

    // Executive Summary
    addText('Executive Summary', 24, true, 'left', '#2C3E50')
    pdf.setDrawColor(45, 55, 72)
    pdf.setLineWidth(0.5)
    pdf.line(20, yPosition, pageWidth - 20, yPosition)
    yPosition += 10

    addText('Overview', 16, true, 'left', '#2C3E50')
    addText(
      `This report presents a comprehensive analysis of emotional patterns and responses, measured across ${emotions.length} distinct emotional states. The assessment evaluates key dimensions of emotional intelligence including stability, range, balance, and consistency.`,
      12,
      false,
      'left'
    )
    yPosition += 10

    // Key Metrics Visualization
    addText('Key Metrics Analysis', 16, true, 'left', '#2C3E50')
    drawMetricsVisualization(metrics)

    // Detailed Analysis
    checkPage(100)
    addText('Detailed Analysis', 16, true, 'left', '#2C3E50')
    pdf.autoTable({
      startY: yPosition,
      head: [['Metric', 'Score', 'Interpretation']],
      body: [
        [
          'Emotional Stability',
          `${metrics.stabilityScore}%`,
          metrics.stabilityScore > 70
            ? 'Excellent'
            : metrics.stabilityScore > 50
            ? 'Good'
            : 'Needs Development',
        ],
        [
          'Emotional Range',
          `${metrics.varianceScore}%`,
          metrics.varianceScore > 70
            ? 'Highly Expressive'
            : metrics.varianceScore > 50
            ? 'Balanced'
            : 'Limited',
        ],
        [
          'Emotional Balance',
          `${metrics.balanceScore}%`,
          metrics.balanceScore > 70
            ? 'Well Balanced'
            : metrics.balanceScore > 50
            ? 'Moderate'
            : 'Unbalanced',
        ],
        [
          'Response Consistency',
          `${metrics.consistencyScore}%`,
          metrics.consistencyScore > 70
            ? 'Very Consistent'
            : metrics.consistencyScore > 50
            ? 'Moderate'
            : 'Variable',
        ],
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [45, 55, 72] },
    })
    yPosition = pdf.lastAutoTable.finalY + 10

    // Emotional Pattern Analysis
    checkPage(60)
    addText('Emotional Pattern Analysis', 16, true, 'left', '#2C3E50')
    addText(`Dominant Emotion: ${metrics.dominantEmotion}`, 12, false)
    addText(`Emotional Reactivity: ${metrics.emotionalReactivity}%`, 12, false)
    addText(`Emotional Resiliency: ${metrics.emotionalResiliency}%`, 12, false)
    yPosition += 10

    // Key Insights
    checkPage(100)
    addText('Key Insights', 16, true, 'left', '#2C3E50')
    insights.forEach((insight) => {
      addText('• ' + insight, 12, false)
    })

    // Recommendations
    checkPage(100)
    addText('Development Recommendations', 16, true, 'left', '#2C3E50')
    const recommendations = [
      metrics.stabilityScore < 70
        ? '• Practice mindfulness and emotional awareness techniques'
        : null,
      metrics.varianceScore < 50
        ? '• Engage in emotional vocabulary expansion exercises'
        : null,
      metrics.balanceScore < 60
        ? '• Develop stress management and emotional regulation strategies'
        : null,
      '• Maintain regular emotional self-assessment practices',
      '• Consider emotional intelligence development workshops',
      '• Practice active emotional awareness in daily interactions',
    ].filter(Boolean)

    recommendations.forEach((rec) => {
      checkPage(10)
      addText(rec, 12, false)
    })

    // Footer on each page
    const totalPages = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text(
        `MindScan™ Assessment Report - Page ${i} of ${totalPages}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      )
      pdf.text('Confidential Document', 20, pageHeight - 10)
    }

    // Save the PDF
    pdf.save(`MindScan_Assessment_${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  generatePDF()
}

// Export the function
export const downloadResults = (emotions) => {
  if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
    throw new Error('Valid emotions data array is required')
  }
  downloadPDFReport(emotions)
}
