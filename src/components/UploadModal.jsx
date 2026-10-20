'use client';

import { useState } from 'react';

export default function UploadModal({ isOpen, onClose, onUploadResource }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('System Design');
  const [pages, setPages] = useState(96);
  const [author, setAuthor] = useState('');
  const [abstract, setAbstract] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUploadResource({
      title,
      category,
      pages: Number(pages),
      author,
      abstract
    });
    setTitle('');
    setAuthor('');
    setAbstract('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full border-2 border-emerald-200 shadow-2xl overflow-hidden">
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-sm flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up text-emerald-300"></i>
            Upload Learning Resource (PDF)
          </span>
          <button onClick={onClose} className="text-emerald-200 hover:text-white p-1">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs bg-white">
          <div>
            <label className="block font-bold text-slate-700 mb-1">PDF Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Kubernetes Production Security Patterns"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm bg-emerald-50/40 cursor-pointer"
              >
                <option value="System Design">System Design</option>
                <option value="Full-Stack">Full-Stack</option>
                <option value="AI & Data">AI & Data</option>
                <option value="Cloud & Security">Cloud & Security</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Page Count</label>
              <input
                type="number"
                required
                min={10}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Author / Instructor</label>
            <input
              type="text"
              required
              placeholder="Prof. Marcus Sterling"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Executive Summary</label>
            <textarea
              rows={3}
              required
              placeholder="Comprehensive guide covering..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition"
          >
            Publish Resource to Google Sheet & Library
          </button>
        </form>
      </div>
    </div>
  );
}
