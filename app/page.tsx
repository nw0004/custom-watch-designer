export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-yellow-400">
        Design Your Time ⌚
      </h1>

      <p className="text-gray-400">
        ออกแบบนาฬิกาในแบบของคุณ
      </p>

      <a
        href="/design"
        className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold"
      >
        เริ่มออกแบบ
      </a>
    </main>
  );
}
