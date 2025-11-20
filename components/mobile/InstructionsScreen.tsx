
import React from 'react';

const InstructionsScreen: React.FC = () => {
    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                Luật Chơi & Hướng Dẫn
            </h1>
            <div className="space-y-8">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-blue-500/50 shadow-lg">
                    <h3 className="text-2xl font-bold text-blue-400 mb-4">Phe 3 (Xanh)</h3>
                    <ul className="space-y-3 text-slate-300 leading-relaxed">
                        <li><span className="font-semibold text-white">Điều kiện thắng:</span> Kết nối 6 quân cờ liền nhau theo hàng ngang hoặc hàng dọc.</li>
                        <li><span className="font-semibold text-white">Số nước đi:</span> 2 nước mỗi lượt.</li>
                        <li><span className="font-semibold text-white">Kỹ năng 'Rau Má':</span> Thêm 1 nước đi (tổng 3 nước). Hồi chiêu 6 lượt.</li>
                    </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-red-500/50 shadow-lg">
                    <h3 className="text-2xl font-bold text-red-400 mb-4">Phe 6 (Đỏ)</h3>
                    <ul className="space-y-3 text-slate-300 leading-relaxed">
                        <li><span className="font-semibold text-white">Điều kiện thắng:</span> Kết nối 3 quân cờ liền nhau theo hàng ngang, dọc hoặc chéo.</li>
                        <li><span className="font-semibold text-white">Số nước đi:</span> 1 nước mỗi lượt.</li>
                        <li><span className="font-semibold text-white">Kỹ năng 'Rau Má':</span> Thêm 1 nước đi (tổng 2 nước). Hồi chiêu 3 lượt.</li>
                    </ul>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-600/50">
                    <h3 className="text-2xl font-bold text-slate-300 mb-4">Lưu ý chung</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Bàn cờ có kích thước 15x15 và chứa 20 chướng ngại vật được đặt ngẫu nhiên. Người chơi không thể đặt quân cờ của mình vào các ô có chướng ngại vật. Hãy tận dụng chúng để cản đường đối thủ!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InstructionsScreen;
