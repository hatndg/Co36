import React from 'react';

interface HomeProps {
    onStartGame: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartGame }) => {
    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 animate-title-glow">Chào mừng đến với Cờ 36</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Một trò chơi chiến thuật đối kháng độc đáo, nơi mỗi người chơi có một mục tiêu và khả năng riêng biệt.
                </p>

                <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200 prose prose-lg max-w-none">
                    <h2 className="text-2xl font-semibold text-gray-700">Luật Chơi</h2>
                    <h3 className="font-semibold">Mục tiêu:</h3>
                    <ul>
                        <li><strong className="text-blue-600">Người chơi 3 (Xanh):</strong> Cần tạo thành một hàng <strong>6 quân</strong> liên tiếp theo hàng ngang hoặc hàng dọc.</li>
                        <li><strong className="text-red-600">Người chơi 6 (Đỏ):</strong> Cần tạo thành một hàng <strong>3 quân</strong> liên tiếp theo hàng ngang, hàng dọc, hoặc đường chéo.</li>
                    </ul>

                     <h3 className="font-semibold">Cách đi:</h3>
                     <ul>
                        <li><strong className="text-blue-600">Người chơi 3 (Xanh):</strong> Đi <strong>2 nước</strong> mỗi lượt.</li>
                        <li><strong className="text-red-600">Người chơi 6 (Đỏ):</strong> Đi <strong>1 nước</strong> mỗi lượt.</li>
                    </ul>

                    <h3 className="font-semibold">Kỹ năng đặc biệt (Rau Má):</h3>
                     <p>Mỗi người chơi có một kỹ năng đặc biệt có thể sử dụng một lần sau một số lượt hồi chiêu nhất định.</p>
                     <ul>
                        <li>Khi kích hoạt, người chơi sẽ được <strong>thêm 1 nước đi</strong> trong lượt đó.</li>
                        <li><strong>Người chơi 3:</strong> Hồi chiêu trong 6 lượt.</li>
                        <li><strong>Người chơi 6:</strong> Hồi chiêu trong 3 lượt.</li>
                    </ul>
                </div>

                <button
                    onClick={onStartGame}
                    className="mt-10 px-10 py-4 text-xl sm:text-2xl border-none rounded-full text-white font-semibold cursor-pointer transition-all duration-300 bg-blue-500 hover:bg-blue-600 active:scale-95 transform shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Bắt đầu chơi
                </button>
            </div>
        </div>
    );
};

export default Home;