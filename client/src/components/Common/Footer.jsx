import React, { memo, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const footerLinks = {
    information: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Affiliates", href: "#" },
    ],
    customerService: [
      { name: "Help Center", href: "#" },
      { name: "Track Order", href: "#" },
      { name: "Shipping Info", href: "#" },
      { name: "Returns", href: "#" },
      { name: "FAQs", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Warranty", href: "#" },
      { name: "Sitemap", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, href: "#", color: "hover:text-red-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-gray-300 text-lg">
                Subscribe to our newsletter and get exclusive deals, new
                arrivals, and insider updates.
              </p>
              <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Join 50,000+ subscribers</span>
                </div>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/50"
                >
                  <Send size={20} />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>

              {subscribed && (
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm backdrop-blur-sm">
                    <Heart size={16} className="fill-current" />
                    Thank you for subscribing!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Digital World
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your trusted destination for cutting-edge technology and
                  premium electronics. Quality products, exceptional service.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <MapPin size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      474 Ontario St Toronto,
                    </p>
                    <p className="text-sm text-gray-400">ON M4X 1M7 Canada</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Phone size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    (+1234) 56789xxx
                  </a>
                </div>

                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="mailto:tadathemes@gmail.com"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    tadathemes@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6">
                <p className="text-sm font-semibold mb-4 text-gray-300">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all transform hover:scale-110 ${social.color}`}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Information Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative inline-block">
                Information
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.information.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative inline-block">
                Customer Service
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.customerService.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 relative inline-block">
                Legal
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></span>
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Digital World. All rights reserved. Made with{" "}
              <Heart
                size={14}
                className="inline text-red-500 fill-current animate-pulse"
              />{" "}
              by Your Team
            </p>

            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex gap-2">
                {["Visa", "Master", "PayPal", "Amex"].map((card) => (
                  <div
                    key={card}
                    className="px-3 py-1.5 bg-white/5 rounded text-xs font-semibold text-gray-400 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
