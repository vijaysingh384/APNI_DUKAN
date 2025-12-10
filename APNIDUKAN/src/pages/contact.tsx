import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const valid = name.trim() !== '' && email.trim() !== '' && message.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // simulate frontend-only submit / success
    setSubmitted(true);
    // Keep success state for a short time, then keep it (or reset if you want)
    setTimeout(() => {
      // leave as success state — you could navigate or reset fields here
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Form (fades in from left) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-8 rounded-lg shadow">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold">Get in touch</h2>

                <label className="block">
                  <span className="text-sm text-gray-600">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Phone</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full border rounded-md px-3 py-2 min-h-[120px]"
                    placeholder="How can we help you?"
                    required
                  />
                </label>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!valid}
                    className={`inline-flex items-center px-5 py-2 rounded-md text-white transition disabled:opacity-60 ${
                      valid ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-green-600"
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>
                <h3 className="mt-4 text-lg font-semibold">Thanks — message sent</h3>
                <p className="mt-2 text-gray-600 text-center">We will get back to you shortly.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Info (fades in from right) */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-md">
                <Mail className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Support email</h4>
                <a className="text-gray-600" href="mailto:support@example.com">support@example.com</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-md">
                <Phone className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <div className="text-gray-600">+91 98765 43210</div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-md">
                <MapPin className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Office address</h4>
                <div className="text-gray-600">123 Local Street, Your City, India</div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
