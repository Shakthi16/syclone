import { useState } from "react";
import { CheckCircle, ArrowRight, Loader2, Mail } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setName("");
      setEmail("");
      setWebsite("");
      setMessage("");
    }, 1800);
  };

  return (
    <div id="contact" className="mx-auto max-w-lg w-full relative z-10 font-sans px-4 py-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(24,24,27,0.02)] transition-all">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4 animate-fade-up">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-2">
              <CheckCircle className="size-7 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-header uppercase tracking-wider">Message Received</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
              Thank you for contacting the Syclone team. We will inspect your request and follow up within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 text-xs font-bold text-slate-900 hover:underline cursor-pointer flex items-center gap-1.5 mx-auto"
            >
              Send another message <ArrowRight className="size-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-slate-200 pb-3.5 mb-2">
              <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest flex items-center gap-2 font-sans mb-1">
                <Mail className="size-3.5 text-primary" /> Get in Touch
              </span>
              <h3 className="text-base font-bold text-slate-900 font-header uppercase tracking-wider">Contact Us</h3>
            </div>

            {error && (
              <div className="text-xs text-rose-650 bg-rose-500/5 border border-rose-500/10 p-3 rounded-lg font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Your Name *</label>
              <input
                type="text"
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address *</label>
              <input
                type="email"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Website URL (Optional)</label>
              <input
                type="url"
                disabled={isSubmitting}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Message *</label>
              <textarea
                disabled={isSubmitting}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What design or deconstruction spec support can we assist you with?"
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-slate-900 px-5 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Sending Message...
                </>
              ) : (
                <>
                  Send Message
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
