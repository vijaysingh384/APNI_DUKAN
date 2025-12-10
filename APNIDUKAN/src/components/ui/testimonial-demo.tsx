import { TestimonialCard } from './testimonial-card'

const testimonials = [
  {
    author: {
      name: 'Emma Thompson',
      handle: '@emmaai',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    text:
      "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: 'https://twitter.com/emmaai',
  },
  {
    author: {
      name: 'David Park',
      handle: '@davidtech',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    text:
      "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: 'https://twitter.com/davidtech',
  },
  {
    author: {
      name: 'Sofia Rodriguez',
      handle: '@sofiaml',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    text:
      'Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.',
  },
  {
    author: {
      name: 'James Chen',
      handle: '@jamesdev',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    },
    text:
      "Game-changing ML capabilities. We've automated our entire data pipeline with incredible accuracy.",
    href: 'https://twitter.com/jamesdev',
  },
  {
    author: {
      name: 'Aisha Patel',
      handle: '@aishatech',
      avatar:
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    },
    text:
      "The real-time processing capabilities are mind-blowing. Our team's productivity has doubled.",
    href: 'https://twitter.com/aishatech',
  },
  {
    author: {
      name: 'Michael Kim',
      handle: '@mikeai',
      avatar:
        'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?w=150&h=150&fit=crop&crop=face',
    },
    text:
      'Best decision we made was switching to this platform. The AI models are incredibly accurate and easy to deploy.',
  },
]

export function TestimonialCardDemo() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} author={testimonial.author} text={testimonial.text} href={testimonial.href} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialCardDemo
