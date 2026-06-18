'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLang, Lang } from '@/lib/translations';

const content = {
  en: {
    title: 'Community Support',
    sub: 'Anonymous stories from people like you. You are not alone.',
    shareTitle: 'Share Your Story Anonymously',
    shareHint: 'Your story can help someone feel less alone. Share only what feels right for you.',
    placeholder: 'Share how you feel or what helped you heal... (anonymous)',
    supportNote: 'This page is peer support, not professional therapy. If you need immediate medical help, go to Helpers or Crisis.',
    promptTitle: 'If you’re not sure what to say, try one of these:',
    prompts: ['I’m feeling alone and I want someone to hear me.', 'I feel overwhelmed and I do not know how to explain it.', 'My chest is tight, my mind is restless, and I need support right now.'],
    post: 'Share Anonymously',
    posting: 'Sharing...',
    testimonies: 'Community Stories',
    tags: ['Anxiety', 'Depression', 'Trauma', 'Grief', 'Hope', 'Recovery'],
    pickTag: 'What relates to you?',
  },
  rw: {
    title: 'Inkunga y\'Umuryango',
    sub: 'Inkuru z\'abantu nkawe. Ntabwo uri wenyine — ni nk\'ikiganiro cy\'itsinda aho abandi basangira ubufasha.',
    shareTitle: 'Sangira Inkuru Yawe Utazwi',
    shareHint: 'Inkuru yawe ishobora gufasha undi kumva ko atari wenyine. Sangira gusa ibyo wumva neza.',
    placeholder: 'Sangira uko umeze cyangwa icyagufashije gukira... (ntazwi)',
    supportNote: 'Uyu ni umwanya wo gusangira n\'abagenzi, si ubuvuzi bw\'umwuga. Niba ukeneye ubufasha bw\'ihutirwa bwa muganga, jya kuri Inzobere cyangwa Ihutirwa.',
    promptTitle: 'Niba udafite icyo uvuga neza, gerageza ibi:',
    prompts: ['Ndi numwe kandi nkeneye umuntu umbwire.', 'Ndambaye umutwaro kandi sinzi uko mbisobanura.', 'Umutima urantera vuba, ibitekerezo birahoraho, ndakeneye ubufasha ubu.'],
    post: 'Sangira Utazwi',
    posting: 'Gutegereza...',
    testimonies: 'Inkuru z\'Umuryango',
    tags: ['Impungenge', 'Agahinda', 'Trauma', 'Ubudrwari', 'Ibyiringiro', 'Gukira'],
    pickTag: 'Ni ikihe kiguhuye?',
  },
  fr: {
    title: 'Soutien Communautaire',
    sub: 'Des témoignages de personnes comme vous. Vous n\'êtes pas seul(e) — c\'est comme un chat de groupe où chacun partage du soutien.',
    shareTitle: 'Partagez Votre Histoire Anonymement',
    shareHint: 'Votre histoire peut aider quelqu\'un à se sentir moins seul(e). Partagez seulement ce qui vous semble juste.',
    placeholder: 'Partagez comment vous vous sentez ou ce qui vous a aidé à guérir... (anonyme)',
    supportNote: 'Cet espace est un soutien entre pairs, pas une thérapie professionnelle. Si vous avez besoin d\'aide médicale immédiate, allez vers Aide professionnelle ou Urgence.',
    promptTitle: 'Si vous ne savez pas quoi dire, essayez l\'une de ces phrases :',
    prompts: ['Je me sens seul(e) et j\'ai besoin qu\'on m\'écoute.', 'Je suis dépassé(e) et je ne sais pas comment l\'exprimer.', 'Mon cœur est serré, mes pensées tournent en boucle, et j\'ai besoin de soutien maintenant.'],
    post: 'Partager Anonymement',
    posting: 'Partage...',
    testimonies: 'Témoignages de la Communauté',
    tags: ['Anxiété', 'Dépression', 'Trauma', 'Deuil', 'Espoir', 'Guérison'],
    pickTag: 'Qu\'est-ce qui vous correspond?',
  },
};

const seedStories = [
  { tag: 'Hope', text: 'I’m not a therapist, but I want you to know you are heard and you are not alone. Sharing how you feel can be the first step toward healing.', time: 'Just now', likes: 22 },
  { tag: 'Hope', text: 'I thought I would never feel better after losing my father. But slowly, day by day, I found small reasons to smile again. If you are reading this, you can heal too. 💚', time: '2 days ago', likes: 47 },
  { tag: 'Recovery', text: 'I was ashamed to talk about my depression for 3 years. When I finally opened up to my sister, everything changed. Do not carry this alone.', time: '5 days ago', likes: 89 },
  { tag: 'Anxiety', text: 'The breathing exercises here helped me survive a panic attack at work. I did not have to leave. I just breathed and it passed. Thank you Komera.', time: '1 week ago', likes: 34 },
  { tag: 'Trauma', text: 'As a genocide survivor, I was afraid to speak. This platform gave me a safe space where no one judges. Healing is possible even from the deepest wounds.', time: '2 weeks ago', likes: 156 },
  { tag: 'Depression', text: 'Some days are still hard. But I log my mood every day and I can see I am improving. The graph of my life is going up slowly. That gives me strength.', time: '3 weeks ago', likes: 62 },
];

export default function CommunityPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [stories, setStories] = useState(seedStories);
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [posting, setPosting] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.replace('/login'); return; }
    setLang(getLang());
  }, [router]);

  const C = content[lang];

  const post = () => {
    if (!text.trim()) return;
    setPosting(true);
    setTimeout(() => {
      setStories(prev => [{ tag: selectedTag || 'Hope', text, time: 'Just now', likes: 0 }, ...prev]);
      setText(''); setSelectedTag(''); setPosting(false);
    }, 800);
  };

  const like = (i: number) => setStories(prev => prev.map((s, idx) => idx === i ? { ...s, likes: s.likes + 1 } : s));

  const filtered = filter === 'All' ? stories : stories.filter(s => s.tag === filter);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <nav className="bg-gradient-to-r from-teal-800 to-emerald-800 px-6 py-4 shadow-lg">
        <h1 className="text-white font-black text-xl">{C.title}</h1>
        <p className="text-teal-300 text-xs mt-0.5">{C.sub}</p>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Share form */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">💬 {C.shareTitle}</h2>
          <p className="text-sm text-gray-600 mb-4">{C.shareHint}</p>
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">{C.pickTag}</p>
            <div className="flex flex-wrap gap-2">
              {C.tags.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${selectedTag === tag ? 'bg-teal-600 text-white border-teal-600' : 'text-teal-700 border-teal-200 hover:border-teal-400'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={C.placeholder} rows={3}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-teal-500 transition resize-none" />
          <button onClick={post} disabled={posting || !text.trim()}
            className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 transition">
            {posting ? C.posting : C.post}
          </button>
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
          <p className="text-sm text-teal-800 font-semibold">{C.supportNote}</p>
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2">{C.promptTitle}</p>
            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
              {C.prompts.map((prompt, idx) => <li key={idx}>{prompt}</li>)}
            </ul>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {['All', ...C.tags].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filter === f ? 'bg-teal-600 text-white border-teal-600' : 'text-gray-500 border-gray-200 hover:border-teal-300'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Stories */}
        <h3 className="font-bold text-gray-700">{C.testimonies}</h3>
        <div className="space-y-4">
          {filtered.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">A</div>
                  <span className="text-xs text-gray-400">Anonymous · {s.time}</span>
                </div>
                <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded-full font-semibold">{s.tag}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{s.text}</p>
              <button onClick={() => like(i)} className="mt-3 flex items-center gap-1 text-gray-400 hover:text-red-400 text-xs transition">
                <span>❤️</span> <span>{s.likes}</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
