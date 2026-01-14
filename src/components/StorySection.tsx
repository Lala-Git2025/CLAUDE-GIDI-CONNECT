interface Story {
  id: string;
  user: string;
  image: string;
  isCreator: boolean;
}

const STORIES: Story[] = [
  { id: 's1', user: 'Zilla', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200', isCreator: true },
  { id: 's2', user: 'LagosEats', image: 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=200', isCreator: true },
  { id: 's3', user: 'David', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200', isCreator: false },
  { id: 's4', user: 'Sarah', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', isCreator: false },
  { id: 's5', user: 'Mike', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', isCreator: false },
  { id: 's6', user: 'Linda', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', isCreator: false },
];

export const StorySection = () => {
  return (
    <div className="bg-black py-4">
      <div className="flex gap-4 overflow-x-auto px-4 scrollbar-hide">
        {/* Add Your Story */}
        <button className="flex flex-col items-center gap-2 min-w-[64px]">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-800 bg-zinc-900 flex items-center justify-center">
            <span className="text-2xl">➕</span>
          </div>
          <span className="text-xs font-medium text-white max-w-[64px] text-center truncate">My Vibe</span>
        </button>

        {/* Stories */}
        {STORIES.map((story) => (
          <button key={story.id} className="flex flex-col items-center gap-2 min-w-[64px]">
            <div
              className={`w-16 h-16 rounded-full p-0.5 relative ${
                story.isCreator ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img
                  src={story.image}
                  alt={story.user}
                  className="w-full h-full object-cover"
                />
              </div>
              {story.isCreator && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center">
                  <span className="text-[10px]">⭐</span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-white max-w-[64px] text-center truncate">
              {story.user}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
