import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface FoundCats {
  treeCat: boolean;
  bushCat: boolean;
  starCat: boolean;
  pondCat: boolean;
}

const MagicForestExplorer: React.FC = () => {
  const [foundCats, setFoundCats] = useState<FoundCats>({
    treeCat: false,
    bushCat: false,
    starCat: false,
    pondCat: false,
  });
  const [showHint, setShowHint] = useState(false);
  const [fireflies, setFireflies] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  const totalFound = Object.values(foundCats).filter(Boolean).length;

  useEffect(() => {
    // Generate random fireflies
    const newFireflies = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60 + 20,
      delay: Math.random() * 3,
    }));
    setFireflies(newFireflies);
  }, []);

  const revealCat = (catType: keyof FoundCats) => {
    setFoundCats(prev => ({ ...prev, [catType]: true }));
  };

  const resetGame = () => {
    setFoundCats({
      treeCat: false,
      bushCat: false,
      starCat: false,
      pondCat: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-16 right-20 w-24 h-24 bg-yellow-100 rounded-full shadow-2xl shadow-yellow-300/30 animate-pulse">
        <div className="absolute inset-2 bg-yellow-50 rounded-full opacity-80"></div>
      </div>

      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-60"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: '2s',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 8px rgba(255, 255, 0, 0.8)',
          }}
          onClick={() => !foundCats.starCat && revealCat('starCat')}
        />
      ))}

      {/* Hidden Star Cat (appears among fireflies) */}
      {foundCats.starCat && (
        <div 
          className="absolute top-32 left-1/3 text-2xl animate-bounce z-10"
          style={{ 
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.8))',
            animation: 'bounce 1s ease-in-out infinite, fadeIn 0.5s ease-in'
          }}
        >
          ✨🐱⭐
        </div>
      )}

      {/* Game UI */}
      <div className="absolute top-6 left-6 z-20">
        <Card className="bg-black/30 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              🌙 Magic Forest Explorer
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="bg-purple-600/80 text-white">
                고양이 발견: {totalFound}/4
              </Badge>
              {totalFound === 4 && (
                <Badge className="bg-yellow-500 text-black animate-pulse">
                  🎉 모든 고양이 발견!
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowHint(!showHint)}
                className="bg-indigo-600/20 border-indigo-400 text-white hover:bg-indigo-600/40"
              >
                {showHint ? '힌트 숨기기' : '힌트 보기'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={resetGame}
                className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40"
              >
                다시 시작
              </Button>
            </div>
            {showHint && (
              <div className="mt-3 text-sm text-purple-200 space-y-1">
                <div className={foundCats.treeCat ? 'line-through opacity-50' : ''}>
                  🌲 큰 나무에 마우스를 올려보세요
                </div>
                <div className={foundCats.bushCat ? 'line-through opacity-50' : ''}>
                  🌿 수풀을 클릭해보세요
                </div>
                <div className={foundCats.starCat ? 'line-through opacity-50' : ''}>
                  ✨ 반딧불이를 클릭해보세요
                </div>
                <div className={foundCats.pondCat ? 'line-through opacity-50' : ''}>
                  💧 연못 위를 클릭해보세요
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forest Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-900 to-green-800/50"></div>

      {/* Large Tree (Cat 1 - Hover to reveal) */}
      <div 
        className="absolute bottom-16 left-20 cursor-pointer transform hover:scale-105 transition-transform"
        onMouseEnter={() => !foundCats.treeCat && revealCat('treeCat')}
      >
        <div className="relative">
          {/* Tree trunk */}
          <div className="w-8 h-20 bg-amber-900 mx-auto rounded-t-lg"></div>
          {/* Tree leaves */}
          <div className="absolute -top-16 -left-12 w-32 h-32 bg-green-700 rounded-full"></div>
          <div className="absolute -top-20 -left-8 w-24 h-24 bg-green-600 rounded-full"></div>
          <div className="absolute -top-12 -left-16 w-20 h-20 bg-green-800 rounded-full"></div>
          
          {/* Hidden Tree Cat */}
          {foundCats.treeCat && (
            <div className="absolute -top-8 left-2 text-xl animate-pulse z-10">
              🐱
            </div>
          )}
        </div>
      </div>

      {/* Bush area (Cat 2 - Click to reveal) */}
      <div 
        className="absolute bottom-20 right-32 cursor-pointer"
        onClick={() => !foundCats.bushCat && revealCat('bushCat')}
      >
        <div className="relative">
          <div className="w-24 h-16 bg-green-800 rounded-full"></div>
          <div className="absolute -top-4 left-4 w-20 h-12 bg-green-700 rounded-full"></div>
          <div className="absolute -top-2 right-2 w-16 h-10 bg-green-900 rounded-full"></div>
          
          {/* Hidden Bush Cat */}
          {foundCats.bushCat && (
            <div className="absolute top-2 left-6 text-lg animate-bounce z-10">
              🐱
            </div>
          )}
        </div>
      </div>

      {/* Mushrooms */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-3 h-8 bg-yellow-100 rounded-t-full"></div>
            <div className="absolute -top-2 -left-2 w-7 h-7 bg-red-500 rounded-full"></div>
            <div className="absolute -top-1 left-0 w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="relative">
            <div className="w-2 h-6 bg-yellow-100 rounded-t-full"></div>
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Pond (Cat 4 - Click for reflection) */}
      <div 
        className="absolute bottom-8 right-1/4 cursor-pointer"
        onClick={() => !foundCats.pondCat && revealCat('pondCat')}
      >
        <div className="relative">
          <div className="w-32 h-16 bg-blue-900/60 rounded-full border border-blue-700/50 backdrop-blur-sm">
            <div className="absolute inset-2 bg-blue-800/40 rounded-full">
              <div className="absolute inset-1 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full">
                {/* Ripples */}
                <div className="absolute inset-4 border border-blue-400/30 rounded-full animate-ping"></div>
                <div className="absolute inset-6 border border-blue-300/20 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
          
          {/* Hidden Pond Cat (reflection) */}
          {foundCats.pondCat && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-lg animate-pulse z-10">
              🐱💧
            </div>
          )}
        </div>
      </div>

      {/* Small plants scattered around */}
      <div className="absolute bottom-12 left-1/4">
        <div className="text-green-600 text-lg">🌱</div>
      </div>
      <div className="absolute bottom-28 right-1/2">
        <div className="text-green-700 text-sm">🌿</div>
      </div>
      <div className="absolute bottom-32 left-3/4">
        <div className="text-green-500 text-base">🍃</div>
      </div>

      {/* Completion message */}
      {totalFound === 4 && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <Card className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-sm border-yellow-400">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">축하합니다!</h2>
              <p className="text-yellow-200 mb-4">숨겨진 모든 고양이를 찾았습니다!</p>
              <div className="text-2xl mb-4">🐱🐱🐱🐱</div>
              <Button 
                onClick={resetGame}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
              >
                다시 도전하기
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MagicForestExplorer;

export const metadata = {
  title: 'Magic Forest Explorer',
  description: '신비로운 숲 속에서 숨겨진 4마리의 고양이를 찾는 인터랙티브 탐험 게임',
  type: 'react',
  tags: ['interactive', 'game', 'cats', 'forest', 'exploration', 'animation'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};