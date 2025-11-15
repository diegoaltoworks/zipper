'use client';

import { ReactNode, useState } from 'react';

import Link from 'next/link';

interface DemoLayoutProps {
  children: ReactNode;
  currentDemo?: 'home' | 'progress' | 'mixed' | 'playground' | 'server' | 'demo' | 'docs';
  title: string;
  description: string;
  sidebarContent?: ReactNode;
}

export default function DemoLayout({
  children,
  currentDemo = 'home',
  title,
  description,
  sidebarContent
}: DemoLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Intro', demo: 'home' as const, color: 'indigo', external: false },
    { href: '/progress', label: 'Progress', demo: 'progress' as const, color: 'purple', external: false },
    { href: '/mixed', label: 'Mixed-Type', demo: 'mixed' as const, color: 'teal', external: false },
    { href: '/playground', label: 'Playground', demo: 'playground' as const, color: 'orange', external: false },
    { href: '/server', label: 'Server-Side', demo: 'server' as const, color: 'emerald', external: false },
    { href: 'https://zipper-demo.vercel.app', label: 'Full App', demo: 'demo' as const, color: 'rose', external: true },
    { href: 'https://github.com/diegoaltoworks/zipper#readme', label: 'Docs', demo: 'docs' as const, color: 'slate', external: true },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap: Record<string, { active: string; inactive: string }> = {
      indigo: {
        active: 'bg-indigo-100 text-indigo-700',
        inactive: 'text-indigo-700 hover:bg-indigo-50',
      },
      purple: {
        active: 'bg-purple-100 text-purple-700',
        inactive: 'text-purple-700 hover:bg-purple-50',
      },
      teal: {
        active: 'bg-teal-100 text-teal-700',
        inactive: 'text-teal-700 hover:bg-teal-50',
      },
      orange: {
        active: 'bg-orange-100 text-orange-700',
        inactive: 'text-orange-700 hover:bg-orange-50',
      },
      emerald: {
        active: 'bg-emerald-100 text-emerald-700',
        inactive: 'text-emerald-700 hover:bg-emerald-50',
      },
      rose: {
        active: 'bg-rose-100 text-rose-700',
        inactive: 'text-rose-700 hover:bg-rose-50',
      },
      slate: {
        active: 'bg-slate-100 text-slate-700',
        inactive: 'text-slate-700 hover:bg-slate-50',
      },
    };
    return isActive ? colorMap[color].active : colorMap[color].inactive;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link href="/" className="text-2xl sm:text-3xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                Zipper
              </Link>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
                Bulk file downloads made simple
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/playground"
                className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                title="Playground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </Link>
              <a
                href="https://www.npmjs.com/package/@diegoaltoworks/zipper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="NPM Package"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
                </svg>
              </a>
              <a
                href="https://github.com/diegoaltoworks/zipper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                title="GitHub Repository"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            {navItems.map((item) => {
              const isActive = currentDemo === item.demo;
              const linkProps = item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {};

              return (
                <Link
                  key={item.demo}
                  href={item.href}
                  {...linkProps}
                  className={`px-3 py-1.5 rounded-md transition-colors ${getColorClasses(
                    item.color,
                    isActive
                  )} ${isActive ? 'font-medium' : ''} ${item.external ? 'flex items-center gap-1' : ''}`}
                >
                  {item.label}
                  {item.external && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="font-medium">Navigation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dialog */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = currentDemo === item.demo;
                  const linkProps = item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {};

                  return (
                    <Link
                      key={item.demo}
                      href={item.href}
                      {...linkProps}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg transition-colors text-base ${
                        isActive
                          ? `${getColorClasses(item.color, true)} font-medium`
                          : 'text-gray-700 hover:bg-gray-50'
                      } ${item.external ? 'flex items-center justify-between' : ''}`}
                    >
                      <span>{item.label}</span>
                      {item.external && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column - Info (only show if sidebarContent provided) */}
          {sidebarContent && (
            <div className="lg:col-span-2 space-y-6">
              {sidebarContent}
            </div>
          )}

          {/* Right Column - Demo */}
          <div className={sidebarContent ? "lg:col-span-3" : "lg:col-span-5"}>
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
                <p className="text-gray-600">
                  {description}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
