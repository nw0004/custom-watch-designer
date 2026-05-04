export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-4">
      
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 text-center">
        Design Your Time ⌚
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-center max-w-md">
        ออกแบบนาฬิกาในแบบของคุณเอง เลือกสาย หน้าปัด และสลักข้อความได้ตามใจ
      </p>

      {/* Button */}
      <a
        href="/design"
        className="bg-yellow-500 hover:bg-yellow-400 transition text-black px-6 py-3 rounded-xl font-semibold shadow-lg"
      >
        เริ่มออกแบบ
      </a>

    </main>
  );
}