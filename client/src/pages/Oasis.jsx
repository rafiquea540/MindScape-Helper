import {
  Heart,
  Info,
  Moon,
  Music,
  Pause,
  Play,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const Oasis = () => {
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSound, setSelectedSound] = useState(null)
  const [audioContext, setAudioContext] = useState(null)
  const [soundSource, setSoundSource] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [infoMessage, setInfoMessage] = useState(null)

  const exercises = [
    {
      id: 1,
      name: 'Deep Noise',
      type: 'relaxation',
      description:
        'Focus on slow, deep breaths to reduce stress and anxiety. This technique involves breathing deeply from the diaphragm, which can lower heart rate, blood pressure, and stress levels. Practice by inhaling slowly through your nose for a count of 4, holding for 4, then exhaling through your mouth for a count of 4. Repeat for 5-10 minutes.',
    },
    {
      id: 2,
      name: 'Body Noise',
      type: 'mindfulness',
      description:
        'Gradually focus your attention on different parts of your body, releasing tension. Start from your toes and work your way up to the top of your head. As you focus on each part, notice any sensations, tension, or discomfort. Imagine breathing into that area and releasing any tension as you exhale. This practice increases body awareness and promotes relaxation.',
    },
    {
      id: 3,
      name: 'Guided Noise',
      type: 'meditation',
      description:
        'Use your imagination to create a peaceful, calming scene or experience. Close your eyes and visualize a serene environment, such as a beach, forest, or mountain retreat. Engage all your senses in the visualization: what do you see, hear, smell, and feel? This technique can reduce stress, enhance mood, and promote a sense of well-being.',
    },
    {
      id: 4,
      name: 'Progressive Muscle Noise',
      type: 'relaxation',
      description:
        'Tense and then relax different muscle groups to reduce physical tension. Start with your toes and work up to your face. Tense each muscle group for 5 seconds, then release and relax for 10 seconds. Notice the difference between tension and relaxation. This practice can reduce muscle tension, anxiety, and improve sleep quality.',
    },
    {
      id: 5,
      name: 'Mindful Noise',
      type: 'mindfulness',
      description:
        'Focus on the experience of walking, paying attention to each step and your surroundings. Notice the sensation of your feet touching the ground, the movement of your legs, and your breath. Observe your environment without judgment. This practice combines the benefits of mindfulness with light physical activity, promoting both mental and physical well-being.',
    },
    {
      id: 6,
      name: 'Loving-Kindness Noise',
      type: 'meditation',
      description:
        'Cultivate feelings of goodwill towards yourself and others. Begin by directing kind thoughts to yourself, then extend them to loved ones, acquaintances, and even difficult people. Use phrases like "May I be happy, may I be healthy, may I be safe." This practice can increase empathy, compassion, and overall life satisfaction.',
    },
    {
      id: 7,
      name: 'Yoga Noise',
      type: 'relaxation',
      description:
        'A guided meditation that induces total physical, mental, and emotional relaxation. Lie down comfortably and follow a guided script that takes you through various stages of relaxation. This practice can reduce stress, improve sleep, and increase overall well-being. Regular practice may help with chronic pain, anxiety, and depression.',
    },
    {
      id: 8,
      name: 'Breath Noise',
      type: 'mindfulness',
      description:
        'Simply observe your natural breathing pattern without trying to change it. Notice the sensation of air moving in and out of your body, the rise and fall of your chest or abdomen. When your mind wanders, gently bring your attention back to your breath. This practice improves concentration, reduces stress, and enhances overall mindfulness.',
    },
  ]

  const sounds = [
    {
      id: 1,
      name: 'Ocean Waves Noise',
      frequency: 100,
      description:
        'The rhythmic sound of waves can promote relaxation and improve sleep quality. The consistent ebb and flow of ocean waves creates a natural white noise that can mask disruptive sounds, lower stress levels, and induce a meditative state. The sound frequency mimics delta brain waves associated with deep sleep, potentially improving sleep onset and quality.',
    },
    {
      id: 2,
      name: 'Forest Noise',
      frequency: 200,
      description:
        'Natural forest sounds can reduce stress and increase feelings of tranquility. This soundscape typically includes a mix of gentle wind through trees, bird calls, and perhaps a distant stream. Exposure to these nature sounds has been shown to lower cortisol levels, heart rate, and blood pressure. It can also improve mood and cognitive function.',
    },
    {
      id: 3,
      name: 'Soft Noise',
      frequency: 300,
      description:
        'The gentle patter of rain can create a soothing atmosphere and aid in concentration. Rain sounds provide a consistent background noise that can mask distractions, making it easier to focus on tasks or fall asleep. The steady rhythm can induce a state of calm and may help alleviate symptoms of anxiety or racing thoughts.',
    },
    {
      id: 4,
      name: 'Gentle Noise',
      frequency: 150,
      description:
        'The sound of flowing water can promote calmness and reduce anxiety. Stream sounds combine the soothing qualities of moving water with the subtle variations that keep the mind engaged just enough to prevent unwanted thoughts. This sound can be particularly helpful for meditation, relaxation, or as a sleep aid.',
    },
    {
      id: 5,
      name: 'Birdsong Noise',
      frequency: 400,
      description:
        'Bird calls can boost mood and help create a positive mindset. The cheerful sounds of birds chirping are often associated with mornings and new beginnings, which can promote feelings of optimism and vitality. Studies have shown that listening to birdsong can improve mental alertness and creativity while reducing stress and fatigue.',
    },
    {
      id: 6,
      name: 'White Noise',
      frequency: 500,
      description:
        'A consistent background sound that can mask distracting noises and improve focus. White noise contains all frequencies at equal intensity, creating a uniform sound that can drown out both external noises and internal distractions. Its particularly useful for improving concentration during work or study, and can also aid in falling asleep faster and achieving more restful sleep.',
    },
  ]

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)()
    setAudioContext(context)

    return () => {
      if (context.state !== 'closed') {
        context.close()
      }
    }
  }, [])

  const playSound = (frequency) => {
    if (audioContext) {
      if (soundSource) {
        soundSource.stop()
      }
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      gainNode.gain.setValueAtTime(isMuted ? 0 : 0.1, audioContext.currentTime)
      oscillator.start()
      setSoundSource(oscillator)
    }
  }

  const startExercise = (exercise) => {
    setCurrentExercise(exercise)
    setIsPlaying(true)
    playSound(300) // Play a sound when starting an exercise
    setInfoMessage({ title: exercise.name, description: exercise.description })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      soundSource?.stop()
    } else if (selectedSound) {
      playSound(selectedSound.frequency)
    }
  }

  const selectSound = (sound) => {
    setSelectedSound(sound)
    playSound(sound.frequency)
    setInfoMessage({ title: sound.name, description: sound.description })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (soundSource) {
      const gainNode = audioContext.createGain()
      soundSource.connect(gainNode)
      gainNode.connect(audioContext.destination)
      gainNode.gain.setValueAtTime(isMuted ? 0.1 : 0, audioContext.currentTime)
    }
  }

  return (
    <>
      <Navbar />
      <div className='mt-10 bg-gradient-to-br from-green-100 to-green-200 min-h-screen p-8'>
        <div className='max-w-4xl mx-auto'>
          <header className='text-center mb-12'>
            <Heart className='text-green-600 mx-auto mb-4' size={48} />
            <h1 className='text-4xl font-bold text-green-800 mb-2'>
              Therapeutic Exercise
            </h1>
            <p className='text-xl text-green-700'>
              Nurture your mind and find inner peace
            </p>
          </header>

          {infoMessage && (
            <div className='mb-8 bg-green-50 border-l-4 border-green-500 p-4 rounded-md'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <Info className='h-5 w-5 text-green-600' />
                </div>
                <div className='ml-3'>
                  <h3 className='text-lg font-medium text-green-800'>
                    {infoMessage.title}
                  </h3>
                  <p className='mt-2 text-sm text-green-700'>
                    {infoMessage.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='grid md:grid-cols-2 gap-8'>
            <section className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-2xl font-semibold text-green-800 mb-4 flex items-center'>
                <Sun className='mr-2' /> Exercises
              </h2>
              <ul className='space-y-4 max-h-96 overflow-y-auto'>
                {exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <button
                      onClick={() => startExercise(exercise)}
                      className='w-full text-left px-4 py-2 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition duration-300'
                    >
                      {exercise.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-2xl font-semibold text-green-800 mb-4 flex items-center'>
                <Music className='mr-2' /> Ambient Sounds
              </h2>
              <ul className='space-y-4 max-h-96 overflow-y-auto'>
                {sounds.map((sound) => (
                  <li key={sound.id}>
                    <button
                      onClick={() => selectSound(sound)}
                      className={`w-full text-left px-4 py-2 rounded-md transition duration-300 ${
                        selectedSound === sound
                          ? 'bg-green-200 text-green-800'
                          : 'bg-green-50 hover:bg-green-100 text-green-700'
                      }`}
                    >
                      {sound.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {currentExercise && (
            <div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-2xl font-semibold text-green-800 mb-4 flex items-center'>
                <Moon className='mr-2' /> Current Exercise:{' '}
                {currentExercise.name}
              </h2>
              <div className='flex items-center justify-between'>
                <p className='text-green-700'>
                  {isPlaying ? 'Exercise in progress...' : 'Exercise paused'}
                </p>
                <div className='flex space-x-4'>
                  <button
                    onClick={togglePlayPause}
                    className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300'
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Oasis
