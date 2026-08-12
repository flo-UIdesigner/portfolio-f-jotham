function SpanMouseBtn() {
  return (
    <div className="-translate-x-1/2 absolute border-3 border-[rgba(122,122,124,0.92)] border-solid bottom-[29px] left-1/2 rounded-[20px] top-0 w-[40px]" data-name="span.mouse-btn">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 opacity-78 rounded-[10px] size-[20px] top-[calc(50%+10px)]" style={{ backgroundImage: "linear-gradient(170.0000000836963deg, rgba(122, 122, 124, 0.918) 0%, rgb(123, 124, 124) 100%)" }} data-name="span.mouse-scroll" />
    </div>
  );
}

export default function DivContainerMouse() {
  return (
    <div className="relative size-full" data-name="div.container_mouse">
      <SpanMouseBtn />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Roboto:Regular',sans-serif] font-normal h-[19px] justify-center leading-[0] left-0 text-[16px] text-black top-[99.5px] w-[84.45px]" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[normal]">Scroll Down</p>
      </div>
    </div>
  );
}