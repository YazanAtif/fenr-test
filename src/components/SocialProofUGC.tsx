import React from 'react';
import { Instagram, Sparkles, ExternalLink } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

interface UGCItem {
  id: string;
  handle: string;
  city: string;
  image: string;
  wearing: string;
  tag: string;
}

const UGC_POSTS: UGCItem[] = [
  {
    id: 'ugc-1',
    handle: '@zayd.kuro',
    city: 'London, UK',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    wearing: 'Cyber-Ronin 460GSM Hoodie (Size L)',
    tag: '#FENRARCHIVE',
  },
  {
    id: 'ugc-2',
    handle: '@areeb.street',
    city: 'Lahore, PK',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    wearing: 'Ghost Heavy Tee (Size M)',
    tag: '#FENRARCHIVE',
  },
  {
    id: 'ugc-3',
    handle: '@alina.fits',
    city: 'Karachi, PK',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    wearing: 'Voidwalker Zip Hoodie (Size S)',
    tag: '#FENRCLAN',
  },
  {
    id: 'ugc-4',
    handle: '@kenzo.raw',
    city: 'New York, US',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    wearing: 'Neo-Akira Comic Tee (Size XL)',
    tag: '#FENRSTUDIOS',
  },
];

export const SocialProofUGC: React.FC = () => {
  return (
    <section className="py-20 bg-kuro-base relative border-b border-kuro-divider overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-kuro-divider pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-[0.3em] text-accent-olive uppercase mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>COMMUNITY ARCHIVE // STREET BROADCAST</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl tracking-[0.15em] text-white uppercase">
              AS SEEN ON THE STREETS
            </h2>
          </div>
          <div className="text-xs font-mono text-canvas-cream/60">
            TAG <span className="text-white font-bold">@FENRSTUDIOS</span> TO BE ARCHIVED
          </div>
        </div>

        {/* 4 UGC Grid Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UGC_POSTS.map((post) => (
            <div
              key={post.id}
              className="bg-kuro-off border border-kuro-divider hover:border-canvas-cream/40 transition-all duration-300 group overflow-hidden"
            >
              <div className="aspect-[4/5] bg-kuro-gray overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.handle}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kuro-base/90 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="text-xs font-mono font-bold text-white">
                    {post.handle}
                  </div>
                  <div className="text-[10px] font-mono text-canvas-cream/70">
                    {post.city}
                  </div>
                </div>
              </div>

              <div className="p-3.5 border-t border-kuro-divider text-[11px] font-mono flex items-center justify-between text-canvas-cream/70">
                <span className="line-clamp-1">{post.wearing}</span>
                <span className="text-accent-olive font-bold">{post.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
