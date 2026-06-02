export default function OgPreviewPage() {
  return (
    <main className="min-h-dvh grid place-items-center bg-[#0e0d1a] p-6">
      <div
        className="relative h-[630px] w-[1200px] overflow-hidden"
        style={{
          background:
            'radial-gradient(80% 90% at 50% 35%, rgba(145,126,255,0.18) 0%, rgba(19,17,33,1) 62%), linear-gradient(135deg, #131121 0%, #1a1530 100%)',
        }}
      >
        <div className="absolute left-[110px] top-[78px] h-[14px] w-[14px] rounded-full bg-[#e5dff6]/70" />
        <div className="absolute right-[148px] top-[112px] h-[8px] w-[8px] rounded-full bg-[#c9c4d8]/70" />
        <div className="absolute bottom-[104px] left-[172px] h-[10px] w-[10px] rounded-full bg-[#c9c4d8]/60" />

        <div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[10px]"
          style={{
            background:
              'radial-gradient(circle, rgba(201,191,255,0.3) 0%, rgba(145,126,255,0.2) 30%, rgba(145,126,255,0) 70%)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <div
            className="mb-6 flex h-[210px] w-[210px] items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(229,223,246,0.92) 0%, rgba(201,191,255,0.85) 40%, rgba(145,126,255,0.78) 78%, rgba(115,88,230,0.82) 100%)',
              boxShadow:
                '0 0 30px rgba(145,126,255,0.7), 0 0 56px rgba(201,191,255,0.35), inset -20px -14px 40px rgba(70,45,160,0.35)',
            }}
          >
            <div className="flex h-[42px] w-[82px] items-center justify-between">
              <div className="h-[18px] w-[18px] rounded-full bg-[#201736]" />
              <div className="h-[18px] w-[18px] rounded-full bg-[#201736]" />
            </div>
          </div>

          <h1 className="text-[96px] font-bold leading-none tracking-[-0.03em] text-[#e5dff6]">Blunno</h1>
          <p className="mt-5 text-[34px] font-medium leading-[1.2] text-[#c9c4d8]">
            Your pocket reset for study stress
          </p>
        </div>
      </div>
    </main>
  );
}
