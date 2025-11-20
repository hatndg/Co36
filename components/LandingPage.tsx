import React, { useEffect, useRef } from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onPlay: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlay }) => {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 } // Kích hoạt khi 10% phần tử hiển thị
    );

    sectionsRef.current.forEach((section) => {
        if (section) {
            observer.observe(section);
        }
    });

    return () => {
        sectionsRef.current.forEach((section) => {
            if (section) {
                observer.unobserve(section);
            }
        });
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-slate-900 text-white overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 md:px-16 bg-slate-900/80 backdrop-blur-sm animate-fade-in-down">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
              <Logo />
              <div className="hidden md:flex items-center gap-8 text-lg">
                  <a href="#gioi-thieu" className="text-slate-300 hover:text-white transition-colors">Giới thiệu</a>
                  <a href="#luat-choi" className="text-slate-300 hover:text-white transition-colors">Luật chơi</a>
                  <a href="#beta-test" className="text-slate-300 hover:text-white transition-colors">Tham gia Beta</a>
              </div>
              <button
                  onClick={onPlay}
                  className="px-6 py-2 text-base border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 active:scale-95 transform shadow-md hover:shadow-lg md:hidden"
              >
                  Chơi Ngay
              </button>
          </nav>
      </header>
      
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-500 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-10 right-20 w-24 h-24 bg-green-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 border-4 border-blue-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '6s' }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center text-center p-4 pt-20">
        <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-title-glow">
              Cờ 36
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-8 max-w-2xl">
              Một kỷ nguyên mới của dòng game cờ chiến thuật. Thử thách trí tuệ với những quân cờ mang năng lực đặc biệt.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onPlay}
                className="px-10 py-4 text-xl border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 active:scale-95 transform shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                Chơi trên Web
              </button>
              <a
                href="#beta-test"
                className="px-10 py-4 text-xl border-2 border-white rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-transparent hover:bg-white hover:text-slate-900 active:scale-95 transform focus:outline-none focus:ring-4 focus:ring-slate-500"
              >
                Tham gia Beta
              </a>
            </div>
        </div>
        <div className="absolute bottom-10 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 bg-slate-900 px-4 sm:px-8 md:px-16 py-20 space-y-24">
        
        {/* Giới thiệu Section */}
        {/* FIX: Changed ref callback to use a block body to prevent returning a value, which is not allowed. */}
        <section id="gioi-thieu" ref={el => { sectionsRef.current[0] = el; }} className="max-w-4xl mx-auto text-center reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Chào Mừng Đến Với Cờ 36</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
            Cờ 36 không chỉ là một trò chơi cờ thông thường. Đây là một đấu trường chiến thuật, nơi mỗi người chơi sở hữu những quân cờ với khả năng độc nhất. Người chơi 3 cần kết nối 6 quân cờ để thắng, trong khi người chơi 6 chỉ cần kết nối 3 quân. Với kỹ năng 'Rau Má', bạn có thể thay đổi cục diện trận đấu trong chớp mắt. Hãy sẵn sàng cho những trận đấu trí tuệ đỉnh cao!
            </p>
        </section>

        {/* Luật chơi Section */}
        {/* FIX: Changed ref callback to use a block body to prevent returning a value, which is not allowed. */}
        <section id="luat-choi" ref={el => { sectionsRef.current[1] = el; }} className="max-w-5xl mx-auto reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">Luật Chơi & Hướng Dẫn</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-blue-500/50 shadow-lg">
                    <h3 className="text-3xl font-bold text-blue-400 mb-4">Phe 3 (Xanh)</h3>
                    <ul className="space-y-3 text-slate-300">
                        <li><span className="font-semibold text-white">Điều kiện thắng:</span> Kết nối 6 quân cờ liền nhau theo hàng ngang hoặc hàng dọc.</li>
                        <li><span className="font-semibold text-white">Số nước đi:</span> 2 nước mỗi lượt.</li>
                        <li><span className="font-semibold text-white">Kỹ năng 'Rau Má':</span> Thêm 1 nước đi (tổng 3 nước). Hồi chiêu 6 lượt.</li>
                    </ul>
                </div>
                 <div className="bg-slate-800/50 p-8 rounded-2xl border border-red-500/50 shadow-lg">
                    <h3 className="text-3xl font-bold text-red-400 mb-4">Phe 6 (Đỏ)</h3>
                    <ul className="space-y-3 text-slate-300">
                        <li><span className="font-semibold text-white">Điều kiện thắng:</span> Kết nối 3 quân cờ liền nhau theo hàng ngang, dọc hoặc chéo.</li>
                        <li><span className="font-semibold text-white">Số nước đi:</span> 1 nước mỗi lượt.</li>
                        <li><span className="font-semibold text-white">Kỹ năng 'Rau Má':</span> Thêm 1 nước đi (tổng 2 nước). Hồi chiêu 3 lượt.</li>
                    </ul>
                </div>
            </div>
             <p className="text-center mt-8 text-slate-400">Lưu ý: Bàn cờ 15x15 có 20 chướng ngại vật ngẫu nhiên. Bạn không thể đặt quân vào các ô này.</p>
        </section>

        {/* Beta Test Section */}
        {/* FIX: Changed ref callback to use a block body to prevent returning a value, which is not allowed. */}
        <section id="beta-test" ref={el => { sectionsRef.current[2] = el; }} className="max-w-4xl mx-auto text-center bg-slate-800/50 p-8 sm:p-12 rounded-2xl border border-green-500/50 shadow-lg reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Tham Gia Thử Nghiệm Beta</h2>
            <p className="text-slate-300 mb-10 text-lg">Hãy là những người đầu tiên trải nghiệm phiên bản Cờ 36 trên di động và giúp chúng tôi hoàn thiện trò chơi!</p>
            <div className="flex flex-col items-center gap-8">
                <div className="text-left max-w-md w-full">
                    <h3 className="text-2xl font-semibold mb-2 flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-slate-900 font-bold">1</span> Tham gia Google Group</h3>
                    <p className="text-slate-400 ml-11 mb-3">Đây là bước bắt buộc để có thể truy cập link tải game trên Google Play.</p>
                    <a href="https://groups.google.com/g/bteamapp-beta-test" target="_blank" rel="noopener noreferrer" className="inline-block ml-11 px-6 py-3 text-lg border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-green-600 hover:bg-green-700 active:scale-95 transform">Vào Nhóm Beta</a>
                </div>
                <div className="text-left max-w-md w-full">
                    <h3 className="text-2xl font-semibold mb-2 flex items-center gap-3"><span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-slate-900 font-bold">2</span> Trở thành người thử nghiệm</h3>
                    <p className="text-slate-400 ml-11 mb-3">Sau khi đã vào nhóm, hãy nhấn vào link bên dưới để tải game và trải nghiệm.</p>
                    <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="inline-block ml-11 px-6 py-3 text-lg border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-green-600 hover:bg-green-700 active:scale-95 transform">Tải Game (Beta)</a>
                </div>
            </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;