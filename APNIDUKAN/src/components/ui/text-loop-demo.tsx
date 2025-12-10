"use client"
import * as React from 'react'
import { TextLoop } from './text-loop'

export function BasicDemo() {
  return (
    <div className="flex justify-center">
      <div className="w-[400px]">
        <TextLoop>
          {[
            'How can I assist you today?',
            'Generate a logo',
            'Create a component',
            'Draw a diagram',
          ].map((text) => (
            <span key={text} className="block text-left">
              {text}
            </span>
          ))}
        </TextLoop>
      </div>
    </div>
  )
}

export function CustomIntervalDemo() {
  return (
    <div className="flex justify-center">
      <div className="flex w-[400px]">
        <span className="mr-2">Beautiful templates for</span>
        <TextLoop interval={1}>
          {['Designers', 'Design Engineers', 'Developers'].map((text) => (
            <span key={text}>{text}</span>
          ))}
        </TextLoop>
      </div>
    </div>
  )
}

export function CustomAnimationDemo() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const motionVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: currentIndex % 2 === 0 ? -20 : 20, opacity: 0 },
  }

  return (
    <div className="flex justify-center">
      <div className="w-[400px]">
        <TextLoop
          variants={motionVariants}
          onIndexChange={setCurrentIndex}
          interval={2}
          transition={{ duration: 0.3 }}
        >
          {[
            'La Trinité, Martinique',
            'A Little Lost・Arthur Russell',
          ].map((text) => (
            <span key={text} className="block text-left">
              {text}
            </span>
          ))}
        </TextLoop>
      </div>
    </div>
  )
}

export const demos = [
  {
    name: 'Basic',
    description: 'Basic text loop with default settings',
    component: BasicDemo,
  },
  {
    name: 'Custom Interval',
    description: 'Text loop with faster transition speed',
    component: CustomIntervalDemo,
  },
  {
    name: 'Custom Animation',
    description: 'Text loop with vertical slide animation',
    component: CustomAnimationDemo,
  },
]

export default BasicDemo
