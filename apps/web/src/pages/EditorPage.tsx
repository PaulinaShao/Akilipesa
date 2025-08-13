import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Type, 
  Palette, 
  Music, 
  Sticker,
  Crop,
  Sliders,
  Download,
  Share,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorState {
  mediaUrl: string;
  mediaType: 'photo' | 'video';
  watermark: boolean;
  filters: string;
  text?: {
    content: string;
    x: number;
    y: number;
    size: number;
    color: string;
  }[];
}

const filters = [
  { name: 'Original', value: 'none', filter: '' },
  { name: 'Vintage', value: 'vintage', filter: 'sepia(0.5) contrast(1.2)' },
  { name: 'B&W', value: 'bw', filter: 'grayscale(1)' },
  { name: 'Vibrant', value: 'vibrant', filter: 'saturate(1.5) contrast(1.1)' },
  { name: 'Cool', value: 'cool', filter: 'hue-rotate(240deg) saturate(1.2)' },
  { name: 'Warm', value: 'warm', filter: 'hue-rotate(25deg) saturate(1.1)' },
];

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const mediaData = location.state as { mediaUrl?: string; mediaType?: 'photo' | 'video' } | null;
  
  const [editorState, setEditorState] = useState<EditorState>({
    mediaUrl: mediaData?.mediaUrl || '',
    mediaType: mediaData?.mediaType || 'photo',
    watermark: true,
    filters: 'none',
    text: []
  });
  
  const [activeTab, setActiveTab] = useState<'filters' | 'text' | 'music' | 'stickers'>('filters');
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showWatermark, setShowWatermark] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);

  useEffect(() => {
    if (!editorState.mediaUrl) {
      navigate('/create/camera');
    }
  }, [editorState.mediaUrl, navigate]);

  const applyFilter = (filterValue: string) => {
    setEditorState(prev => ({ ...prev, filters: filterValue }));
  };

  const addText = () => {
    if (!textInput.trim()) return;
    
    const newText = {
      content: textInput,
      x: 50, // Center position
      y: 50,
      size: 24,
      color: '#ffffff'
    };
    
    setEditorState(prev => ({
      ...prev,
      text: [...(prev.text || []), newText]
    }));
    setTextInput('');
  };

  const handleSave = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would:
      // 1. Apply all edits to the media
      // 2. Add watermark if enabled
      // 3. Upload to storage
      // 4. Create post/reel
      
      navigate('/reels', {
        state: { 
          message: 'Your content has been posted successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFilter = filters.find(f => f.value === editorState.filters);

  if (!editorState.mediaUrl) {
    return (
      <div className="h-screen-safe bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No media to edit</p>
          <button
            onClick={() => navigate('/create/camera')}
            className="bg-primary text-white px-6 py-3 rounded-xl"
          >
            Capture Media
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-black flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 flex items-center justify-between bg-black/50 backdrop-blur-sm">
        <button
          onClick={() => navigate('/create/camera')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-lg font-semibold text-white">Edit</h1>
        
        <button
          onClick={handleSave}
          disabled={isProcessing}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-4 py-2 rounded-xl transition-colors"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Post
            </>
          )}
        </button>
      </div>

      {/* Media Preview */}
      <div className="flex-1 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-black">
          {editorState.mediaType === 'photo' ? (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={editorState.mediaUrl}
              alt="Editor preview"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: selectedFilter?.filter || ''
              }}
            />
          ) : (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={editorState.mediaUrl}
              className="max-w-full max-h-full object-contain"
              style={{
                filter: selectedFilter?.filter || ''
              }}
              controls
              loop
              muted
            />
          )}
          
          {/* Text overlays */}
          {editorState.text?.map((text, index) => (
            <div
              key={index}
              className="absolute text-white font-bold pointer-events-none"
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                fontSize: `${text.size}px`,
                color: text.color,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {text.content}
            </div>
          ))}
          
          {/* Watermark */}
          {showWatermark && editorState.watermark && (
            <div className="absolute bottom-4 right-4 text-white/70 text-sm font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
              AkiliPesa
            </div>
          )}
        </div>
        
        {/* Watermark toggle */}
        <button
          onClick={() => setShowWatermark(!showWatermark)}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-colors"
        >
          {showWatermark ? (
            <Eye className="w-5 h-5 text-white" />
          ) : (
            <EyeOff className="w-5 h-5 text-white/60" />
          )}
        </button>
      </div>

      {/* Editor Tabs */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="flex border-b border-white/10">
          {[
            { key: 'filters', label: 'Filters', icon: Palette },
            { key: 'text', label: 'Text', icon: Type },
            { key: 'music', label: 'Music', icon: Music },
            { key: 'stickers', label: 'Stickers', icon: Sticker },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-white/60 hover:text-white"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-4 h-32 overflow-y-auto">
          {activeTab === 'filters' && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => applyFilter(filter.value)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all relative overflow-hidden",
                    editorState.filters === filter.value
                      ? "border-primary"
                      : "border-white/20 hover:border-white/40"
                  )}
                >
                  <div
                    className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"
                    style={{ filter: filter.filter }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {filter.name}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Add text..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && addText()}
                />
                <button
                  onClick={addText}
                  disabled={!textInput.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              
              {editorState.text && editorState.text.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Added text:</p>
                  {editorState.text.map((text, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <span className="text-white text-sm truncate">{text.content}</span>
                      <button
                        onClick={() => {
                          setEditorState(prev => ({
                            ...prev,
                            text: prev.text?.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'music' && (
            <div className="text-center py-4">
              <Music className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Music library coming soon</p>
              <p className="text-white/40 text-xs">Add background music to your content</p>
            </div>
          )}

          {activeTab === 'stickers' && (
            <div className="text-center py-4">
              <Sticker className="w-8 h-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 text-sm">Stickers coming soon</p>
              <p className="text-white/40 text-xs">Add fun stickers and emojis</p>
            </div>
          )}
        </div>
      </div>

      {/* Watermark Settings */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 p-4 safe-bottom">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">AkiliPesa Watermark</p>
            <p className="text-white/60 text-xs">Showcase your content on AkiliPesa</p>
          </div>
          <button
            onClick={() => setEditorState(prev => ({ ...prev, watermark: !prev.watermark }))}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              editorState.watermark ? "bg-primary" : "bg-white/20"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                editorState.watermark ? "translate-x-6" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
