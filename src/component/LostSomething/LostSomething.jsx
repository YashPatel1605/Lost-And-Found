import { useNavigate } from 'react-router-dom'

export default function LostSomething({ dashboardStats = {}, loading = false }) {
    const navigate = useNavigate()
    const { totalItems = 0, recoveredItems = 0, students = 0 } = dashboardStats

    return (
        <div className="min-h-screen bg-linear-to-r from-[#0b1d3a] via-[#0f2a4d] to-[#0b1d3a] text-white flex items-center justify-center px-4">
            <div className="max-w-7xl w-full text-center">
                <div className="inline-flex items-center gap-2 border border-blue-400/30 bg-blue-500/10 px-4 py-1 rounded-full text-sm text-blue-300 mb-6">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    CAMPUS LOST & FOUND PORTAL
                </div>

                <h1 className="font-bold leading-tight text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
                    Lost something? Found something <span className="text-blue-400">We connect.</span>
                </h1>

                <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                    The smartest lost & found platform for your campus. Report, search, and recover items with ease — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                    <button
                        onClick={() => navigate('/browse')}
                        className="bg-blue-500 hover:bg-blue-600 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                        🔍 Browse Items
                    </button>

                    <button
                        onClick={() => navigate('/report')}
                        className="border border-gray-500 hover:border-blue-400 hover:text-blue-400 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
                    >
                        📦 Report an Item
                    </button>
                </div>

                <div className="flex justify-center mt-10">
                    <div className="w-full max-w-3xl bg-[#0f2747]/80 backdrop-blur-sm rounded-xl px-4 py-4">
                        <div className="grid grid-cols-3 text-center items-center">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                                    {loading ? '...' : `${totalItems}+`}
                                </h2>
                                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">Items Listed</p>
                            </div>

                            <div className="border-x border-white/10">
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                                    {loading ? '...' : `${recoveredItems}+`}
                                </h2>
                                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">Items Recovered</p>
                            </div>

                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 leading-none">
                                    {loading ? '...' : `${students}+`}
                                </h2>
                                <p className="text-gray-400 text-[11px] sm:text-xs mt-1">Students Registered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}