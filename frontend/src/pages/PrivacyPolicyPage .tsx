"use client";

import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { 
  FiShield,
  FiEye,
  FiLock,
  FiUsers,
  FiDatabase,
  FiGlobe,
  FiFileText,
  FiMail,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiSettings
} from 'react-icons/fi';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  // Add scroll to section function
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100; // Offset for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: FiFileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            This Privacy Policy relates to the collection, use and disclosure of personal data, including special or sensitive personal data, by our platform ("we", or "our"). Personal Data is information relating to an individual ("you" or "your") as more fully defined herein below.
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            We are committed to protecting your privacy and ensuring that you have a secured experience on our website and while using our products and services (collectively, "Products").
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            In this Privacy Policy, "Personal Data" means any information that can be used to individually identify a person and may include, but is not limited to, name, email address, postal or other physical addresses, title, and other personally identifiable information.
          </p>
        </div>
      )
    },
    {
      id: 'applicability',
      title: 'Applicability of the Policy',
      icon: FiGlobe,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            This policy shall apply to all information we collect through the Company Systems and/or in the course of your use of our services.
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            This policy does not apply to, nor do we take any responsibility for, any information that is collected by any third party either using Company Systems or through any links on the Company Systems.
          </p>
        </div>
      )
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FiDatabase,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            We will only collect information which you share with us. We will collect the following information:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 text-lg">Personal information required for registration and use of our systems</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 text-lg">Contact details like name, email, phone number, and profile picture</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 text-lg">Educational and professional information including resume/CV</span>
            </li>
            <li className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-800 dark:text-gray-200 text-lg">Technical data like IP addresses and cookies</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-processing',
      title: 'How We Use Your Data',
      icon: FiSettings,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            We use your Personal Data only in accordance with this policy for the following purposes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Account registration</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Website functionality</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Online tests and assessments</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Content customization</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Job opportunity referrals</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: FiShield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            You have the following rights regarding your Personal Data:
          </p>
          <div className="space-y-4">
            {[
              { title: 'Access', description: 'Request information about the data we hold about you' },
              { title: 'Correction', description: 'Request correction of incorrect or incomplete data' },
              { title: 'Deletion', description: 'Request deletion of your personal data from our systems' },
              { title: 'Portability', description: 'Request a copy of your data in a readable format' }
            ].map((right, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FiShield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{right.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300">{right.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: FiLock,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            We implement comprehensive security measures to protect your information:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">SSL encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Secure servers with firewalls</span>
              </div>
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Regular security audits</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Access controls</span>
              </div>
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Data encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <FiLock className="w-5 h-5 text-green-600" />
                <span className="text-gray-800 dark:text-gray-200">Regular backups</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies',
      icon: FiEye,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            We use cookies to enhance your experience on our platform:
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Essential Cookies</h4>
              <p className="text-gray-700 dark:text-gray-300">Required for basic website functionality</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Analytics Cookies</h4>
              <p className="text-gray-700 dark:text-gray-300">Help us improve our services</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: FiMail,
      content: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
            If you have any questions about this privacy policy, please contact us:
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FiMail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg mb-2">Privacy Officer</h4>
                <p className="text-gray-800 dark:text-gray-200 mb-2">
                  Email: <a href="mailto:privacy@yourcompany.com" className="text-blue-600 hover:underline">privacy@yourcompany.com</a>
                </p>
                <p className="text-gray-600 dark:text-gray-400">We will respond within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiShield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            Learn how we collect, use, and protect your personal information.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <FiClock className="w-4 h-4" />
            <span>Last updated: January 2024</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)} // Updated to use scrollToSection
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition-all",
                      activeSection === section.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id} // Make sure each section has the correct ID
                  className={cn(
                    "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 scroll-mt-24", // Added scroll-mt-24 for better positioning
                    activeSection === section.id && "ring-2 ring-blue-500/20"
                  )}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div>
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer Notice */}
            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center">
              <FiAlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Policy Updates
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This policy may be updated from time to time. We recommend reviewing it regularly.
              </p>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <FiMail className="w-5 h-5" />
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
