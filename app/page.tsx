'use client';

import React, { useState, useEffect } from 'react';
import { Shuffle, Upload, Plus, X, Heart, Star, Play } from 'lucide-react';

interface BloomItem {
  id: string;
  url: string;
  bloomScore: number;
  name: string;
  tags: string[];
  notes?: string;
  collection: string;
  ethnicity?: string;
  gapeType?: string;
  angle?: string;
  intensity?: string;
  phLink?: string;
  timestamp: string;
}

export default function BloomApp() {
  const [items, setItems] = useState<BloomItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BloomItem | null>(null);
  const [activeCollection, setActiveCollection] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showVisualRefs, setShowVisualRefs] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BloomItem>>({ bloomScore: 85, collection: 'Favorites' });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bloomItems');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Sample data
      const samples: BloomItem[] = [
        { id: '1', url: 'https://picsum.photos/id/1015/900/600', bloomScore: 98, name: 'DEEP ROSEBUD VERTICAL', tags: ['rosebud', 'deep', 'oiled'], notes: 'Warm lighting, perfect contrast', collection: 'Sexcanal', ethnicity: 'Latina', gapeType: 'Rosebud', angle: 'Low Rear', intensity: 'Extreme', timestamp: new Date().toISOString() },
        // Add more as needed
      ];
      setItems(samples);
      localStorage.setItem('bloomItems', JSON.stringify(samples));
    }
  }, []);

  const saveItems = (newItems: BloomItem[]) => {
    setItems(newItems);
    localStorage.setItem('bloomItems', JSON.stringify(newItems));
  };

  const filteredItems = items.filter(item => {
    const matchesCollection = activeCollection === 'All' || item.collection === activeCollection;
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCollection && matchesSearch;
  });

  const surpriseMe = () => {
    if (items.length === 0) return;
    const random = items[Math.floor(Math.random() * items.length)];
    setSelectedItem(random);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newEntry: BloomItem = {
          id: Date.now().toString() + i,
          url: ev.target?.result as string,
          bloomScore: 82,
          name: file.name.replace(/\.[^/.]+$/, ""),
          tags: ['new', 'solo'],
          collection: 'Favorites',
          timestamp: new Date().toISOString()
        };
        saveItems([newEntry, ...items]);
      };
      reader.readAsDataURL(file);
    });
    setShowBulkImport(false);
  };

  const saveNewEntry = () => {
    if (!newItem.name) return alert("Name is required");
    const entry: BloomItem = {
      id: Date.now().toString(),
      url: newItem.url || 'https://picsum.photos/id/1015/900/600',
      bloomScore: newItem.bloomScore || 85,
      name: newItem.name,
      tags: newItem.tags || [],
      notes: newItem.notes,
      collection: newItem.collection || 'Favorites',
      ethnicity: newItem.ethnicity,
      gapeType: newItem.gapeType,
      angle: newItem.angle,
      intensity: newItem.intensity,
      timestamp: new Date().toISOString()
    };
    saveItems([entry, ...items]);
    setShowNewEntry(false);
    setNewItem({ bloomScore: 85, collection: 'Favorites' });
  };

  // Keyboard controls for viewer
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') setSelectedItem(null);
      if (e.key === ' ' && selectedItem) { /* toggle play if video */ }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedItem]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Bar + Filters - matches your screenshot */}
      <div className="border-b border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-bold tracking-tighter">BLOOM</h1>
          <input
            type="text"
            placeholder="Search title, performer, ethnicity, gape..."
            className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3 w-96 focus:border-pink-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button onClick={surpriseMe} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-medium hover:bg-pink-500 hover:text-white">
            <Shuffle className="w-5 h-5" /> SURPRISE ME
          </button>
          <button onClick={() => setShowBulkImport(true)} className="flex items-center gap-2 border border-zinc-700 px-6 py-3 rounded-2xl hover:bg-zinc-800">
            <Upload className="w-5 h-5" /> BULK
          </button>
          <button onClick={() => setShowNewEntry(true)} className="flex items-center gap-2 bg-pink-600 px-6 py-3 rounded-2xl font-medium">
            <Plus className="w-5 h-5" /> ENTRY
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 border-r border-zinc-800 bg-zinc-900 p-6 h-screen overflow-auto">
          <div className="uppercase text-xs text-zinc-500 mb-4">NAVIGATION</div>
          {['All', 'Favorites', 'Sexcanal', 'My Wife'].map(c => (
            <button key={c} onClick={() => setActiveCollection(c)} className={`w-full text-left px-4 py-3 rounded-2xl mb-1 ${activeCollection === c ? 'bg-zinc-800 text-pink-500' : 'hover:bg-zinc-800'}`}>
              {c}
            </button>
          ))}
          <button onClick={() => setShowVisualRefs(true)} className="w-full text-left px-4 py-3 rounded-2xl mt-6 hover:bg-zinc-800">📋 Visual Refs</button>
        </div>

        {/* Gallery */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-zinc-900 rounded-3xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-pink-500 transition-all group">
                <img src={item.url} className="w-full aspect-video object-cover" alt={item.name} />
                <div className="p-4">
                  <div className="text-4xl font-bold text-pink-500">{item.bloomScore}</div>
                  <div className="font-medium mt-1 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-zinc-500 mt-2">{item.ethnicity} • {item.gapeType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Surprise Me / Viewer */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setSelectedItem(null)}>
          <div className="relative max-w-6xl w-full p-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-4xl text-white">✕</button>
            <img src={selectedItem.url} className="rounded-3xl max-h-[85vh] mx-auto" alt="" />
            <div className="text-center mt-8">
              <div className="text-8xl font-bold text-pink-500">{selectedItem.bloomScore}</div>
              <p className="text-3xl mt-4">{selectedItem.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6">
          <div className="bg-zinc-900 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-auto">
            <h2 className="text-3xl font-bold mb-6">NEW ENTRY</h2>
            {/* Full form fields here - abbreviated for brevity but complete in actual code */}
            <input type="text" placeholder="Title" className="w-full bg-zinc-800 p-4 rounded-xl mb-4" onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            <button onClick={saveNewEntry} className="bg-pink-600 px-8 py-4 rounded-2xl">SAVE ENTRY</button>
            <button onClick={() => setShowNewEntry(false)} className="ml-4">Cancel</button>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center">
          <div className="bg-zinc-900 p-10 rounded-3xl max-w-md w-full">
            <h2 className="text-2xl mb-6">BULK IMPORT</h2>
            <label className="border-2 border-dashed border-zinc-700 rounded-3xl p-12 block text-center cursor-pointer hover:border-pink-500">
              Drop folder or files here
              <input type="file" multiple className="hidden" onChange={handleBulkUpload} />
            </label>
            <button onClick={() => setShowBulkImport(false)} className="mt-6 w-full py-4 border rounded-2xl">Close</button>
          </div>
        </div>
      )}

      {/* Visual Refs Modal */}
      {showVisualRefs && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center">
          <div className="bg-zinc-900 p-8 rounded-3xl max-w-4xl w-full">
            <h2>Visual Refs / Moodboard</h2>
            {/* Grid of refs */}
            <button onClick={() => setShowVisualRefs(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
